import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";

const requestSchema = z.object({
  raw: z
    .string()
    .min(1, "raw is required")
    .max(2000, "raw too long"),
});

const capsuleSchema = z.object({
  capsule_type: z.enum(["transactional", "advisory", "verification", "governance"]),
  normalized_intent: z.string().min(1),
  sensitivity: z.enum(["low", "medium", "high", "critical"]).default("medium"),
  derived_tags: z.array(z.string().min(1)).max(12).default([]),
  context_vectors: z
    .record(z.string(), z.number().min(0).max(1))
    .default({}),
});

const systemPrompt = `You are the AIMAS normalization adapter. Convert a raw human intent into a deterministic L1 capsule.
Return JSON ONLY with keys: capsule_type, normalized_intent, sensitivity, derived_tags, context_vectors.
- normalized_intent must be rewritten in protocol tone (short, neutral, no raw text quoting).
- sensitivity: low, medium, high, or critical.
- capsule_type: transactional, advisory, verification, or governance (pick the closest).
- derived_tags: array of lowercase feature tags (max 12).
- context_vectors: object of numeric scores 0-1 keyed by snake_case dimensions.
Absolutely do not include the raw text in the response.`;

const apiKey = process.env.OPENAI_API_KEY;
const openai = apiKey ? new OpenAI({ apiKey }) : null;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { raw } = requestSchema.parse(body);

    if (!openai) {
      return NextResponse.json({ error: "Adapter not configured" }, { status: 503 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: raw.slice(0, 2000) },
      ],
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("Adapter response empty");
    }

    const parsed = capsuleSchema.parse(JSON.parse(content));
    const derived_tags = Array.from(
      new Set(parsed.derived_tags.map((tag) => tag.toLowerCase().replace(/\s+/g, "-").slice(0, 48)))
    ).filter(Boolean);
    const limitedVectors = Object.fromEntries(Object.entries(parsed.context_vectors).slice(0, 8));

    return NextResponse.json({
      capsule_type: parsed.capsule_type,
      normalized_intent: parsed.normalized_intent,
      sensitivity: parsed.sensitivity,
      derived_tags,
      context_vectors: limitedVectors,
    });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues.map((issue) => issue.message).join(", ") }, { status: 400 });
    }
    return NextResponse.json({ error: "Unable to normalize intent" }, { status: 502 });
  }
}

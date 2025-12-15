# Task 011 — OpenAI Normalize Adapter (UI Server Route)

Goal:
- Provide a UI server-side endpoint that converts raw text L0 -> structured L1.
- Output must be strict JSON matching the Intent Capsule intent_features schema.

Scope:
- Repo: AIMAS-UI only (App Router API route + validator + OpenAI client config).

Route:
- POST /api/adapter/normalize

Input:
- { raw: string }

Output:
- { capsule_type, normalized_intent, sensitivity, derived_tags, context_vectors }

Rules:
- Never store or log raw input
- Return 400 if raw missing/oversized
- Use OpenAI Responses/Chat API with JSON schema enforcement
- Validate with zod/ajv before returning
- Require server-only `OPENAI_API_KEY` (no NEXT_PUBLIC)

Acceptance:
- Works locally with OPENAI_API_KEY in `.env.local`
- Rejects non-conforming output
- Does not call AIMAS API directly

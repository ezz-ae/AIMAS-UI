"use client";

import { useEffect, useMemo, useState } from "react";

export type FitMatrixView = {
  eta_minutes: number;
  probability: number;
  confidence: number;
  sensitivity: string;
  paths: Array<{ tier: "free" | "paid"; label: string; notes: string }>;
};

type IntentCapsuleView = {
  capsule_type: string;
  normalized_intent: string;
  sensitivity: string;
  derived_tags: string[];
  context_vectors: Record<string, number>;
};

type RawPath = {
  free_baseline?: boolean;
  tier?: "free" | "paid" | string;
  label?: string;
  path_id?: string;
  type?: string;
  notes?: string;
};

type RawFitMatrix = {
  eta_minutes?: number;
  eta_hours?: number;
  probability?: number;
  success_probability?: number;
  confidence?: number;
  confidence_level?: number;
  sensitivity?: string;
  sensitivity_tag?: string;
  paths?: RawPath[];
};

export function ProtocolDashboard({ initialIntent = "", apiBase }: { initialIntent?: string; apiBase?: string }) {
  const [intent, setIntent] = useState(initialIntent);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [capsule, setCapsule] = useState<IntentCapsuleView>(() => demoCapsule(initialIntent));
  const [out, setOut] = useState<FitMatrixView | null>(initialIntent ? demoFit(initialIntent) : null);

  const hasApi = Boolean(apiBase);

  useEffect(() => {
    setIntent(initialIntent);
    setCapsule(demoCapsule(initialIntent));
    setOut(initialIntent ? demoFit(initialIntent) : null);
  }, [initialIntent]);

  async function compute() {
    const value = intent.trim();
    if (!value) return;
    setBusy(true);
    setNote(null);
    const fallback = () => {
      setCapsule(demoCapsule(value));
      setOut(demoFit(value));
    };

    try {
      if (!apiBase) {
        fallback();
        setNote("API base not configured. Showing deterministic demo output.");
        return;
      }

      const normalizeRes = await fetch("/api/adapter/normalize", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ raw: value }),
      });
      if (!normalizeRes.ok) {
        throw new Error("adapter failed");
      }
      const normalized = (await normalizeRes.json()) as IntentCapsuleView;
      setCapsule(normalized);

      const base = apiBase.replace(/\/$/, "");
      const intentRes = await fetch(`${base}/v1/intent`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          capsule_type: normalized.capsule_type,
          intent_features: {
            capsule_type: normalized.capsule_type,
            normalized_intent: normalized.normalized_intent,
            sensitivity: normalized.sensitivity,
            derived_tags: normalized.derived_tags,
            context_vectors: normalized.context_vectors,
          },
        }),
      });
      if (!intentRes.ok) {
        throw new Error("intent registration failed");
      }
      const intentPayload = await intentRes.json();
      const intentId = intentPayload?.intent_id;
      if (!intentId) throw new Error("missing intent_id");

      const fitRes = await fetch(`${base}/v1/fit/${intentId}`, { method: "POST" });
      if (!fitRes.ok) throw new Error("fit computation failed");
      const fitPayload = await fitRes.json();
      setOut(normalizeFitMatrix(fitPayload));
    } catch (err) {
      console.error(err);
      fallback();
      setNote("API unavailable. Showing deterministic demo output.");
    } finally {
      setBusy(false);
    }
  }

  const derivedTags = useMemo(() => capsule.derived_tags || [], [capsule]);
  const contextVectors = useMemo(() => Object.entries(capsule.context_vectors || {}), [capsule]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <div className="text-xs uppercase tracking-[0.3em] text-neutral-400">Intent Intake</div>
        <p className="mt-1 text-sm text-neutral-300">Raw declarations never persist. Input is transient.</p>
        <textarea
          value={intent}
          onChange={(event) => setIntent(event.target.value)}
          placeholder="Declare intent. One shot."
          className="mt-4 w-full min-h-[160px] rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white outline-none focus:ring-2 focus:ring-white/40"
        />
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
          <button
            type="button"
            onClick={compute}
            disabled={busy || !intent.trim()}
            className="rounded-2xl bg-white/90 px-5 py-2 font-semibold text-black disabled:opacity-50"
          >
            {busy ? "Computing…" : hasApi ? "Compute via API" : "Compute demo"}
          </button>
          {note ? <span className="text-xs text-amber-300">{note}</span> : null}
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <div className="text-xs uppercase tracking-[0.3em] text-neutral-400">Intent Capsule · L1</div>
        <p className="mt-1 text-sm text-neutral-300">Derived features only. Raw text is gone.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <div className="text-xs text-neutral-400">capsule_type</div>
            <div className="mt-1 font-mono text-sm uppercase text-white">{capsule.capsule_type}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <div className="text-xs text-neutral-400">sensitivity</div>
            <div className="mt-1 font-mono text-sm uppercase text-white">{capsule.sensitivity}</div>
          </div>
        </div>
        <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4">
          <div className="text-xs text-neutral-400">normalized_intent</div>
          <div className="mt-1 text-sm text-white/90">{capsule.normalized_intent}</div>
        </div>
        <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4">
          <div className="text-xs text-neutral-400">derived_tags</div>
          {derivedTags.length ? (
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              {derivedTags.map((tag) => (
                <span key={tag} className="rounded-full bg-white/10 px-3 py-1 font-mono text-white/80">
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-xs text-neutral-500">No derived tags.</p>
          )}
        </div>
        <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4">
          <div className="text-xs text-neutral-400">context_vectors</div>
          {contextVectors.length ? (
            <ul className="mt-2 space-y-1 text-xs text-neutral-300">
              {contextVectors.map(([key, value]) => (
                <li key={key} className="flex items-center justify-between font-mono">
                  <span>{key}</span>
                  <span>{value.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-xs text-neutral-500">No context vectors.</p>
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <div className="text-xs uppercase tracking-[0.3em] text-neutral-400">Fit Matrix</div>
        <p className="mt-1 text-sm text-neutral-300">Deterministic certainty — never persuasion.</p>
        {out ? (
          <div className="mt-4 space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
              <Metric label="ETA" value={`${out.eta_minutes} min`} />
              <Metric label="Probability" value={`${Math.round(out.probability * 100)}%`} />
              <Metric label="Confidence" value={`${Math.round(out.confidence * 100)}%`} />
              <Metric label="Sensitivity" value={out.sensitivity}
 />
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="text-xs text-neutral-400 uppercase tracking-[0.3em]">Paths</div>
              <p className="mt-2 text-sm text-neutral-300">At least one Free Baseline Path exists in every output.</p>
              <div className="mt-4 space-y-3">
                {out.paths.map((p, idx) => (
                  <div key={`${p.label}-${idx}`} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="flex items-center justify-between text-sm font-semibold">
                      <span>{p.label}</span>
                      <span className={`font-mono text-xs ${p.tier === "free" ? "text-emerald-300" : "text-neutral-400"}`}>
                        {p.tier.toUpperCase()}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-neutral-300">{p.notes}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm text-neutral-400">No Fit Matrix yet. Declare intent to enter execution mode.</p>
        )}
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <div className="text-xs text-neutral-400">{label}</div>
      <div className="mt-2 font-mono text-lg text-white">{value}</div>
    </div>
  );
}

function normalizeFitMatrix(payload: RawFitMatrix): FitMatrixView {
  const etaMinutes = typeof payload?.eta_minutes === "number"
    ? payload.eta_minutes
    : typeof payload?.eta_hours === "number"
    ? Math.round(payload.eta_hours * 60)
    : 42;
  const probabilityRaw = typeof payload?.probability === "number"
    ? payload.probability
    : typeof payload?.success_probability === "number"
    ? payload.success_probability
    : 0.72;
  const confidenceRaw = typeof payload?.confidence === "number"
    ? payload.confidence
    : typeof payload?.confidence_level === "number"
    ? payload.confidence_level
    : 0.72;
  const sensitivity = String(payload?.sensitivity ?? payload?.sensitivity_tag ?? "medium");

  const probability = probabilityRaw > 1 ? probabilityRaw / 100 : probabilityRaw;
  const confidence = confidenceRaw > 1 ? confidenceRaw / 100 : confidenceRaw;

  const paths = Array.isArray(payload?.paths)
    ? payload.paths.map((path) => {
        const tier: "free" | "paid" = path?.free_baseline || path?.tier === "free" ? "free" : "paid";
        return {
          tier,
          label:
            path?.label ||
            path?.path_id ||
            (path?.type === "free_baseline"
              ? "Free Baseline Path"
              : path?.type === "paid_accelerator"
              ? "Accelerated Path"
              : "Deterministic Path"),
          notes:
            path?.notes ||
            (path?.free_baseline ? "Canonical baseline path." : "Time compression + guarantees."),
        };
      })
    : demoFit("demo").paths;

  return {
    eta_minutes: Math.max(1, Math.round(etaMinutes)),
    probability: Math.min(1, Math.max(0, probability)),
    confidence: Math.min(1, Math.max(0, confidence)),
    sensitivity,
    paths,
  };
}

function demoFit(seed: string): FitMatrixView {
  const normalized = seed.length || 10;
  const eta = Math.max(8, Math.min(220, normalized * 3));
  const probability = Math.max(0.35, Math.min(0.95, 0.4 + normalized / 200));
  return {
    eta_minutes: Math.round(eta),
    probability,
    confidence: 0.72,
    sensitivity: seed.toLowerCase().includes("medical") ? "high" : "medium",
    paths: [
      { tier: "free", label: "Free Baseline Path", notes: "Canonical handling. Still valid." },
      { tier: "paid", label: "Accelerated Path", notes: "Time compression + governed guarantees." },
    ],
  };
}

function demoCapsule(seed: string): IntentCapsuleView {
  const normalizedSeed = seed.trim().toLowerCase();
  const tags = Array.from(new Set(normalizedSeed.split(/[^a-z0-9]+/).filter((token) => token.length >= 4))).slice(0, 6);
  const sensitivity = normalizedSeed.includes("medical")
    ? "high"
    : normalizedSeed.includes("critical") || normalizedSeed.includes("government")
    ? "critical"
    : "medium";
  const capsule_type = normalizedSeed.includes("verify") || normalizedSeed.includes("compliance")
    ? "verification"
    : normalizedSeed.includes("advise") || normalizedSeed.includes("help")
    ? "advisory"
    : "transactional";
  return {
    capsule_type,
    normalized_intent: seed.trim() ? `Structured intent: ${seed.trim()}` : "Structured intent placeholder.",
    sensitivity,
    derived_tags: tags,
    context_vectors: {
      urgency: Math.min(1, seed.length / 200) || 0.3,
      complexity: Math.min(1, tags.length / 10) || 0.2,
    },
  };
}

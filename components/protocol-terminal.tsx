"use client";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type FitMatrix = {
  eta_minutes: number;
  probability: number;
  confidence: number;
  sensitivity: "low" | "medium" | "high" | "critical";
  paths: Array<{ tier: "free" | "paid"; label: string; notes: string }>;
};

function demoFit(intent: string): FitMatrix {
  const base = Math.max(8, Math.min(180, intent.length * 2));
  const prob = Math.max(0.35, Math.min(0.92, 0.45 + intent.length / 200));
  return {
    eta_minutes: Math.round(base),
    probability: Math.round(prob * 100) / 100,
    confidence: 0.72,
    sensitivity: intent.toLowerCase().includes("medical") ? "high" : "medium",
    paths: [
      { tier: "free", label: "Free Baseline Path", notes: "Canonical baseline. No acceleration. Still valid." },
      { tier: "paid", label: "Accelerator Path", notes: "Time compression + higher handling guarantees." },
    ],
  };
}

export function ProtocolTerminal() {
  const sp = useSearchParams();
  const seed = sp.get("intent") || "";
  const [intent, setIntent] = useState(seed);
  const [busy, setBusy] = useState(false);
  const [out, setOut] = useState<FitMatrix | null>(seed ? demoFit(seed) : null);
  const api = process.env.NEXT_PUBLIC_AIMAS_API_URL || "";
  const canCall = useMemo(() => !!api, [api]);

  async function run() {
    if (!intent.trim()) return;
    setBusy(true);
    try {
      if (canCall) {
        const base = api.replace(/\/$/, "");
        const res = await fetch(`${base}/v1/intent`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ intent }),
        });
        const data = await res.json();
        setOut(data.fit_matrix ?? data);
      } else {
        setOut(demoFit(intent));
      }
    } catch {
      setOut(demoFit(intent));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6">
      <div className="rounded-3xl border p-5">
        <div className="text-xs text-neutral-500">Intent Intake</div>
        <textarea
          value={intent}
          onChange={(e) => setIntent(e.target.value)}
          placeholder="Declare intent. One shot."
          className="mt-2 w-full min-h-[140px] rounded-2xl border p-4 outline-none focus:ring-2 focus:ring-neutral-900/20"
        />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            onClick={run}
            disabled={busy || !intent.trim()}
            className="rounded-2xl bg-neutral-900 text-white px-5 py-2.5 text-sm font-medium disabled:opacity-50"
          >
            {busy ? "Computing…" : "Compute Fit Matrix"}
          </button>
          <div className="text-xs text-neutral-500">
            {canCall ? <>API: <span className="font-mono">{api}</span></> : <>No API set — demo output.</>}
          </div>
        </div>
        <div className="mt-6 rounded-2xl bg-neutral-50 border p-4">
          <div className="text-xs text-neutral-500">Invariant</div>
          <div className="mt-1 text-sm">A free baseline path exists in every output.</div>
        </div>
      </div>

      <div className="rounded-3xl border p-5">
        <div className="text-xs text-neutral-500">Output Station</div>
        {out ? (
          <div className="mt-3 space-y-4">
            <div className="rounded-2xl border p-4">
              <div className="text-xs text-neutral-500">Fit Matrix</div>
              <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-neutral-50 border p-3">
                  <div className="text-xs text-neutral-500">ETA</div>
                  <div className="mt-1 font-mono">{out.eta_minutes} min</div>
                </div>
                <div className="rounded-xl bg-neutral-50 border p-3">
                  <div className="text-xs text-neutral-500">Probability</div>
                  <div className="mt-1 font-mono">{Math.round(out.probability * 100)}%</div>
                </div>
                <div className="rounded-xl bg-neutral-50 border p-3">
                  <div className="text-xs text-neutral-500">Confidence</div>
                  <div className="mt-1 font-mono">{Math.round(out.confidence * 100)}%</div>
                </div>
                <div className="rounded-xl bg-neutral-50 border p-3">
                  <div className="text-xs text-neutral-500">Sensitivity</div>
                  <div className="mt-1 font-mono">{out.sensitivity}</div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border p-4">
              <div className="text-xs text-neutral-500">Paths</div>
              <div className="mt-2 space-y-2">
                {out.paths.map((p, i) => (
                  <div key={i} className="rounded-xl border p-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">{p.label}</div>
                      <div className={`text-xs font-mono ${p.tier === "free" ? "text-green-700" : "text-neutral-500"}`}>
                        {p.tier.toUpperCase()}
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-neutral-600">{p.notes}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-xs text-neutral-500">
              Output is not a list. Output is a declaration of computed certainty.
            </div>
          </div>
        ) : (
          <div className="mt-4 text-sm text-neutral-600">No output yet.</div>
        )}
      </div>
    </div>
  );
}

const capsuleSample = {
  capsule_id: "capsule-l1",
  normalized_intent: "Time-critical property acquisition support",
  derived_features: [
    "domain: real_estate",
    "priority: immediate",
    "actor: verified",
  ],
  sensitivity: "medium",
};

const fitSample = {
  eta_minutes: 42,
  probability: 0.81,
  confidence: 0.74,
  sensitivity: "medium",
};

const paths = [
  {
    tier: "Free Baseline",
    notes: "Canonical handling. No acceleration. Still deterministic.",
  },
  {
    tier: "Accelerated",
    notes: "Time compression + higher handling guarantees (paid).",
  },
];

export function ProtocolDashboard({ intent }: { intent?: string }) {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border p-5">
        <div className="text-xs uppercase tracking-[0.3em] text-neutral-500">Raw Input · L0</div>
        <p className="mt-1 text-sm text-neutral-600">Ephemeral declaration. Never stored.</p>
        <div className="mt-4 rounded-2xl border bg-neutral-50 p-4 text-sm min-h-[120px] whitespace-pre-wrap">
          {intent?.trim() || "(empty)"}
        </div>
      </section>

      <section className="rounded-3xl border p-5">
        <div className="text-xs uppercase tracking-[0.3em] text-neutral-500">Intent Capsule · L1</div>
        <p className="mt-1 text-sm text-neutral-600">Derived features only. Raw text is gone.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border p-4">
            <div className="text-xs text-neutral-500">capsule_id</div>
            <div className="mt-1 font-mono text-sm">{capsuleSample.capsule_id}</div>
          </div>
          <div className="rounded-2xl border p-4">
            <div className="text-xs text-neutral-500">sensitivity</div>
            <div className="mt-1 font-mono text-sm">{capsuleSample.sensitivity}</div>
          </div>
        </div>
        <div className="mt-4 rounded-2xl border p-4">
          <div className="text-xs text-neutral-500">normalized_intent</div>
          <div className="mt-1 font-mono text-sm">{capsuleSample.normalized_intent}</div>
        </div>
        <div className="mt-4 rounded-2xl border p-4">
          <div className="text-xs text-neutral-500">derived_features</div>
          <ul className="mt-2 space-y-1 text-sm font-mono">
            {capsuleSample.derived_features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-3xl border p-5">
        <div className="text-xs uppercase tracking-[0.3em] text-neutral-500">Fit Matrix</div>
        <p className="mt-1 text-sm text-neutral-600">Deterministic certainty — not ranking.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-4">
          <Metric label="ETA" value={`${fitSample.eta_minutes} min`} />
          <Metric label="Probability" value={`${Math.round(fitSample.probability * 100)}%`} />
          <Metric label="Confidence" value={`${Math.round(fitSample.confidence * 100)}%`} />
          <Metric label="Sensitivity" value={fitSample.sensitivity} />
        </div>
      </section>

      <section className="rounded-3xl border p-5">
        <div className="text-xs uppercase tracking-[0.3em] text-neutral-500">Paths</div>
        <p className="mt-1 text-sm text-neutral-600">Fit Matrix always includes ≥1 Free Baseline Path.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {paths.map((path) => (
            <div key={path.tier} className="rounded-2xl border p-4">
              <div className="text-xs text-neutral-500">{path.tier}</div>
              <p className="mt-2 text-sm text-neutral-700">{path.notes}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border p-4">
      <div className="text-xs text-neutral-500">{label}</div>
      <div className="mt-2 font-mono text-lg">{value}</div>
    </div>
  );
}

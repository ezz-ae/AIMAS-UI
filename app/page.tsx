import { GateSearch } from "@/components/gate-search";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#010308] text-white px-6 py-20">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-6">
        <p className="text-xs font-mono uppercase tracking-[0.4em] text-neutral-500">Fairness Gate Demo</p>
        <h1 className="text-4xl font-semibold tracking-tight">This system cannot be persuaded.</h1>
        <p className="text-sm text-neutral-400 max-w-2xl">
          Submit a single intent. AIMAS discards the raw declaration, emits a Fit Matrix, and stops. Nothing here ranks, optimizes, or stores your text.
        </p>
        <GateSearch />
        <p className="text-[11px] font-mono text-neutral-500">Demo only · Input is erased immediately · Output proves invariance.</p>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-black/30 p-5 text-left">
          <div className="text-xs font-mono text-neutral-400">Who installs it</div>
          <p className="mt-3 text-sm text-white/90">Marketplaces, financial platforms, and regulators that must show deterministic intake behavior.</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-black/30 p-5 text-left">
          <div className="text-xs font-mono text-neutral-400">What it sells</div>
          <p className="mt-3 text-sm text-white/90">Gate API access, Fit Matrix guarantees, audit-grade fairness proofs.</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-black/30 p-5 text-left">
          <div className="text-xs font-mono text-neutral-400">Why it exists</div>
          <p className="mt-3 text-sm text-white/90">Cheaper than lawsuits, bias scandals, or custom compliance rewrites.</p>
        </div>
      </div>
    </main>
  );
}

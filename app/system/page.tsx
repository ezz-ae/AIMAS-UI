import { ProtocolDashboard } from "@/components/protocol-dashboard";
import { ShellLayout } from "@/components/shell/ShellLayout";

export default function SystemPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = typeof searchParams.q === "string" ? searchParams.q : "";
  const apiBase = process.env.NEXT_PUBLIC_AIMAS_API_BASE || "";

  return (
    <ShellLayout
      section="system"
      title="Protocol Shell"
      subtitle="Input → Capsule → Fit Matrix → Paths (read-only)."
      apiBase={apiBase}
    >
      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        <div className="rounded-3xl border border-white/10 bg-black/30 p-5 text-sm text-neutral-200">
          <div className="text-xs font-mono text-neutral-400">Gate</div>
          <p className="mt-2">Single intent, normalized capsule, immutable audit trail.</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-black/30 p-5 text-sm text-neutral-200">
          <div className="text-xs font-mono text-neutral-400">Output</div>
          <p className="mt-2">Fit Matrix + Free Baseline Path, no ranking, no persuasion.</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-black/30 p-5 text-sm text-neutral-200">
          <div className="text-xs font-mono text-neutral-400">Audit</div>
          <p className="mt-2">Headers + run id ensure buyers can prove the gate executed.</p>
        </div>
      </div>
      <ProtocolDashboard initialIntent={query} apiBase={apiBase} />
    </ShellLayout>
  );
}

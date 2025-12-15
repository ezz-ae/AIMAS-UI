import { ProtocolDashboard } from "@/components/protocol-dashboard";

export default function SystemPage({ searchParams }: { searchParams: { intent?: string } }) {
  const intent = typeof searchParams.intent === "string" ? searchParams.intent : "";
  return (
    <main className="min-h-[calc(100vh-64px)]">
      <section className="mx-auto max-w-6xl px-6 py-10 space-y-6">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">XUI</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Protocol Dashboard</h1>
            <p className="mt-2 text-neutral-600">
              Read-only visualization. Logic lives in AIMAS authority, not here.
            </p>
          </div>
          <div className="text-xs text-neutral-500 font-mono text-right">
            Input → Capsule → Fit Matrix → Paths
          </div>
        </header>

        <ProtocolDashboard intent={intent} />
      </section>
    </main>
  );
}

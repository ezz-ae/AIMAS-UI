import { ProtocolTerminal } from "@/components/protocol-terminal";

export const dynamic = "force-dynamic";

export default function X() {
  return (
    <main className="min-h-[calc(100vh-64px)]">
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Protocol Dashboard</h1>
            <p className="mt-2 text-neutral-600">
              Deterministic surface. Output is a Fit Matrix.
            </p>
          </div>
          <div className="text-xs text-neutral-500 text-right">
            <div className="font-mono">XUI</div>
            <div>Execution UI</div>
          </div>
        </div>

        <div className="mt-8">
          <ProtocolTerminal />
        </div>
      </section>
    </main>
  );
}

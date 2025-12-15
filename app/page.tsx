import { GateSearch } from "@/components/gate-search";

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-64px)]">
      <section className="mx-auto max-w-3xl px-6 pt-20 pb-10">
        <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
          <span className="font-mono">AIMAS</span>
          <span className="text-neutral-500">Protocol Surface</span>
        </div>

        <h1 className="mt-6 text-4xl leading-tight font-semibold tracking-tight">
          One input. One system.
        </h1>
        <p className="mt-4 text-neutral-600 leading-relaxed">
          Not ads. Not recommendations. Not attention.
          Declare intent → enter execution mode.
        </p>

        <div className="mt-10">
          <GateSearch />
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a className="rounded-2xl border p-4 hover:shadow-soft transition" href="/docs">Docs</a>
          <a className="rounded-2xl border p-4 hover:shadow-soft transition" href="/rfc">RFC</a>
          <a className="rounded-2xl border p-4 hover:shadow-soft transition" href="/api">API</a>
        </div>
      </section>
    </main>
  );
}

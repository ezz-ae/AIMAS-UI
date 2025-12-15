import { GateSearch } from "@/components/gate-search";

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-64px)] grid place-items-center px-6 py-16">
      <div className="w-full max-w-2xl space-y-6 text-center">
        <div className="text-xs font-mono uppercase tracking-[0.5em] text-neutral-400">AIMAS</div>
        <GateSearch />
        <p className="text-xs text-neutral-500">
          Landing is single-purpose. Declare → /search handles routing into the system surface.
        </p>
      </div>
    </main>
  );
}

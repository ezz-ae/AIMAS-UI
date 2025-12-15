import { GateSearch } from "@/components/gate-search";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#010308] text-white flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-3xl space-y-6 text-center">
        <p className="text-xs font-mono uppercase tracking-[0.4em] text-neutral-400">Protocol Gate</p>
        <h1 className="text-4xl font-semibold tracking-tight">One input. One system.</h1>
        <p className="text-sm text-neutral-400">
          Declare intent → enter execution mode. No browsing. No persuasion.
        </p>
        <GateSearch />
      </div>
    </main>
  );
}

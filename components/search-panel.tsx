"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function SearchPanel({ initialQuery = "" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  function submit() {
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  function enterSystem() {
    if (!query.trim()) return;
    router.push(`/system?intent=${encodeURIComponent(query.trim())}`);
  }

  return (
    <div className="rounded-3xl border p-5 space-y-4">
      <div>
        <div className="text-xs text-neutral-500 uppercase tracking-[0.3em]">search</div>
        <p className="text-sm text-neutral-600">Intent is transient. No ranking — only routing.</p>
      </div>
      <textarea
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Declare intent"
        className="w-full min-h-[140px] rounded-2xl border p-4 text-sm outline-none focus:ring-2 focus:ring-neutral-900/20"
      />
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={submit}
          disabled={!query.trim()}
          className="rounded-2xl bg-neutral-900 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          Search docs
        </button>
        <button
          type="button"
          onClick={enterSystem}
          disabled={!query.trim()}
          className="rounded-2xl border px-5 py-2 text-sm font-semibold text-neutral-700 disabled:opacity-50"
        >
          Enter system →
        </button>
      </div>
      <div className="text-xs text-neutral-500 font-mono">/search routes to read-only system surfaces only.</div>
    </div>
  );
}

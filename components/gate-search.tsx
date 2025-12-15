"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type GateSearchProps = {
  initialQuery?: string;
};

export function GateSearch({ initialQuery = "" }: GateSearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  function submit() {
    const value = query.trim();
    if (!value) return;
    router.push(`/search?q=${encodeURIComponent(value)}`);
  }

  return (
    <div className="rounded-[32px] border shadow-soft p-5 bg-white">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              submit();
            }
          }}
          placeholder="Declare intent"
          aria-label="Intent"
          className="flex-1 rounded-2xl border px-4 py-3 text-lg outline-none focus:ring-2 focus:ring-neutral-900/30"
        />
        <button
          type="button"
          onClick={submit}
          className="rounded-2xl bg-neutral-900 px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
          disabled={!query.trim()}
        >
          Search →
        </button>
      </div>
      <div className="mt-3 text-xs text-neutral-500 font-mono">No browse. Input → system.</div>
    </div>
  );
}

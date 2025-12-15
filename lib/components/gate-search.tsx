"use client";
import { useState } from "react";

export function GateSearch() {
  const [q, setQ] = useState("");
  return (
    <div className="rounded-3xl border shadow-soft p-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Declare intent…"
          className="flex-1 rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-neutral-900/20"
        />
        <a
          href={`/x?intent=${encodeURIComponent(q || "")}`}
          className="rounded-2xl bg-neutral-900 text-white px-5 py-3 text-center font-medium"
        >
          Search
        </a>
      </div>
      <div className="mt-3 text-xs text-neutral-500">
        Landing surface: no browsing, no ranking, no persuasion.
      </div>
    </div>
  );
}

"use client";
import { useEffect, useMemo, useState } from "react";
import MiniSearch from "minisearch";

type Item = { id: string; title: string; path: string; content: string; section?: string };

export function SearchBox() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch("/search-index.json")
      .then((r) => r.json())
      .then((data) => { setItems(data.items || []); setReady(true); })
      .catch(() => setReady(true));
  }, []);

  const ms = useMemo(() => {
    const m = new MiniSearch({
      fields: ["title", "content", "section"],
      storeFields: ["title", "path", "section"],
      searchOptions: { prefix: true, fuzzy: 0.2 },
    });
    if (items.length) m.addAll(items);
    return m;
  }, [items]);

  const results = useMemo(() => {
    if (!q.trim() || !ready) return [];
    return ms.search(q).slice(0, 8);
  }, [q, ms, ready]);

  return (
    <div className="rounded-2xl border p-3">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={ready ? "Search docs…" : "Indexing…"}
        className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-900/20 text-sm"
      />
      {q.trim() && results.length ? (
        <div className="mt-2 space-y-1">
          {results.map((r: any) => (
            <a key={r.id} href={r.path} className="block rounded-xl px-3 py-2 hover:bg-neutral-100">
              <div className="text-sm font-medium">{r.title}</div>
              <div className="text-xs text-neutral-500">{r.section || r.path}</div>
            </a>
          ))}
        </div>
      ) : q.trim() && ready ? (
        <div className="mt-2 text-xs text-neutral-500 px-1">No matches.</div>
      ) : null}
    </div>
  );
}

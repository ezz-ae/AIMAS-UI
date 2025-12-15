import Link from "next/link";

import { SearchPanel } from "@/components/search-panel";
import { ShellLayout } from "@/components/shell/ShellLayout";
import { searchDocs } from "@/lib/search/runtime";

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = typeof searchParams.q === "string" ? searchParams.q : "";
  const results = query ? await searchDocs(query) : [];

  const apiBase = process.env.NEXT_PUBLIC_AIMAS_API_BASE || "";

  return (
    <ShellLayout
      section="docs"
      apiBase={apiBase}
      title="Docs search"
      subtitle="Internal helper for protocol readers."
    >
      <div className="grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
        <SearchPanel initialQuery={query} />
        <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
          <div className="flex items-center justify-between gap-2 text-sm">
            <div>
              <div className="text-xs text-neutral-400 uppercase tracking-[0.3em]">Docs</div>
              <p className="text-sm text-neutral-300">MiniSearch across canonical AIMAS files.</p>
            </div>
            <div className="text-xs text-neutral-400 font-mono">
              {query ? `${results.length} hits` : "0 hits"}
            </div>
          </div>

          {query ? (
            results.length ? (
              <ul className="mt-6 space-y-4">
                {results.map((result) => (
                  <li key={result.id}>
                    <Link
                      href={result.href}
                      className="block rounded-2xl border border-white/10 bg-black/40 p-4 transition hover:border-white/40"
                    >
                      <div className="text-xs font-mono text-neutral-400">{result.section}</div>
                      <div className="mt-1 text-lg font-semibold tracking-tight text-white">{result.title}</div>
                      {result.excerpt ? (
                        <p className="mt-2 text-sm text-neutral-300">{result.excerpt}</p>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-6 text-sm text-neutral-400">No matches.</p>
            )
          ) : (
            <p className="mt-6 text-sm text-neutral-400">
              Enter intent on the left. Search covers RFC, schemas, conformance, compliance, and meta files.
            </p>
          )}
        </div>
      </div>
    </ShellLayout>
  );
}

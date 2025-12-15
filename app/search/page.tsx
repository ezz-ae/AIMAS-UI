import Link from "next/link";

import { SearchPanel } from "@/components/search-panel";
import { searchDocs } from "@/lib/search/runtime";

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = typeof searchParams.q === "string" ? searchParams.q : "";
  const results = query ? await searchDocs(query) : [];

  return (
    <main className="min-h-[calc(100vh-64px)]">
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
          <SearchPanel initialQuery={query} />
          <div className="rounded-3xl border p-5">
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="text-xs text-neutral-500 uppercase tracking-[0.3em]">Docs</div>
                <p className="text-sm text-neutral-600">MiniSearch across canonical AIMAS files.</p>
              </div>
              <div className="text-xs text-neutral-500 font-mono">
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
                        className="block rounded-2xl border p-4 hover:border-neutral-900 transition"
                      >
                        <div className="text-xs font-mono text-neutral-500">{result.section}</div>
                        <div className="mt-1 text-lg font-semibold tracking-tight">{result.title}</div>
                        {result.excerpt ? (
                          <p className="mt-2 text-sm text-neutral-600">{result.excerpt}</p>
                        ) : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-6 text-sm text-neutral-500">No matches.</p>
              )
            ) : (
              <p className="mt-6 text-sm text-neutral-500">
                Enter intent on the left. Search covers RFC, schemas, conformance, compliance, and meta files.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

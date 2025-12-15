import Link from "next/link";

import {
  loadDocsRegistry,
  SECTION_DESCRIPTIONS,
  SECTION_ORDER,
  type Doc,
} from "@/lib/docs";

function groupDocsBySection(docs: Doc[]) {
  const map = new Map<string, Doc[]>();
  for (const section of SECTION_ORDER) {
    map.set(section, []);
  }
  for (const doc of docs) {
    const bucket = map.get(doc.section);
    if (bucket) bucket.push(doc);
  }
  return map;
}

export default async function DocsIndexPage() {
  const docs = await loadDocsRegistry();
  const grouped = groupDocsBySection(docs);

  return (
    <main className="min-h-[calc(100vh-64px)]">
      <section className="mx-auto max-w-6xl px-6 py-12 space-y-10">
        <header>
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">Protocol Authority</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">Docs</h1>
          <p className="mt-3 max-w-3xl text-neutral-600">
            Read-only view of the AIMAS authority repo. Source of truth is always vendor/aimas
            (or AIMAS_DOCS_PATH override). No drift, no rewrites.
          </p>
        </header>

        <div className="space-y-8">
          {SECTION_ORDER.map((section) => {
            const entries = grouped.get(section) ?? [];
            if (!entries.length) return null;
            return (
              <div key={section} className="border rounded-3xl p-6 space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <div className="text-xs font-mono text-neutral-500">{section}</div>
                    <div className="text-sm text-neutral-600 max-w-3xl">{SECTION_DESCRIPTIONS[section]}</div>
                  </div>
                  <div className="text-xs text-neutral-500">
                    {entries.length} {entries.length === 1 ? "doc" : "docs"}
                  </div>
                </div>
                <div className="grid gap-3 lg:grid-cols-2">
                  {entries
                    .sort((a, b) => a.title.localeCompare(b.title))
                    .map((doc) => (
                      <Link
                        href={`/docs/${doc.slug.join("/")}`}
                        key={doc.id}
                        className="rounded-2xl border p-4 hover:border-neutral-900 transition"
                      >
                        <div className="text-sm font-semibold tracking-tight">{doc.title}</div>
                        <div className="mt-1 text-xs text-neutral-500 break-words">
                          {doc.sourcePath}
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

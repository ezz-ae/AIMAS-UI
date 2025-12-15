import Link from "next/link";

import { ShellLayout } from "@/components/shell/ShellLayout";
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
  const apiBase = process.env.NEXT_PUBLIC_AIMAS_API_BASE || "";

  return (
    <ShellLayout
      section="docs"
      title="Documentation"
      subtitle="Read-only view of the AIMAS authority repo. No drift, no rewrites."
      apiBase={apiBase}
    >
      <div className="space-y-8">
        {SECTION_ORDER.map((section) => {
          const entries = grouped.get(section) ?? [];
          if (!entries.length) return null;
          return (
            <div key={section} className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <div className="text-xs font-mono text-neutral-400">{section}</div>
                  <div className="text-sm text-neutral-300 max-w-3xl">{SECTION_DESCRIPTIONS[section]}</div>
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
                      className="rounded-2xl border border-white/10 bg-black/30 p-4 transition hover:border-white/40"
                    >
                      <div className="text-sm font-semibold tracking-tight text-white">{doc.title}</div>
                      <div className="mt-1 text-xs text-neutral-400 break-words">{doc.sourcePath}</div>
                    </Link>
                  ))}
              </div>
            </div>
          );
        })}
      </div>
    </ShellLayout>
  );
}

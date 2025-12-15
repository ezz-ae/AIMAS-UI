import { notFound } from "next/navigation";

import { ShellLayout } from "@/components/shell/ShellLayout";
import { getDocBySlug } from "@/lib/docs";
import { renderMarkdownToHtml } from "@/lib/markdown";

async function loadDoc(slug: string[]) {
  const doc = await getDocBySlug(slug);
  if (!doc) notFound();
  const html = await renderMarkdownToHtml(doc.body);
  return { title: doc.title, html };
}

const SPEC_SLUGS = [
  ["docs", "spec-architecture"],
  ["docs", "spec-intent-capsule"],
  ["docs", "spec-fit-matrix"],
  ["docs", "spec-fairness-law"],
  ["docs", "spec-lifecycle"],
];

export default async function SpecPage() {
  const apiBase = process.env.NEXT_PUBLIC_AIMAS_API_BASE || "";
  const sections = await Promise.all(SPEC_SLUGS.map((slug) => loadDoc(slug)));

  return (
    <ShellLayout section="spec" title="Specification" subtitle="Contract-level view of the gate." apiBase={apiBase}>
      <div className="grid gap-6">
        {sections.map((section) => (
          <article
            key={section.title}
            className="rounded-3xl border border-white/10 bg-black/30 p-6 prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: section.html }}
          />
        ))}
      </div>
    </ShellLayout>
  );
}

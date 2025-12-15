import { notFound } from "next/navigation";

import { ShellLayout } from "@/components/shell/ShellLayout";
import { getDocBySlug } from "@/lib/docs";
import { renderMarkdownToHtml } from "@/lib/markdown";

const DEV_DOCS = [
  ["docs", "dev", "environment-setup"],
  ["docs", "dev", "testing-conformance"],
  ["docs", "dev", "ci-workflows"],
  ["docs", "dev", "git-modules-usage"],
];

async function loadDoc(slug: string[]) {
  const doc = await getDocBySlug(slug);
  if (!doc) notFound();
  const html = await renderMarkdownToHtml(doc.body);
  return { title: doc.title, html };
}

export default async function DevPage() {
  const apiBase = process.env.NEXT_PUBLIC_AIMAS_API_BASE || "";
  const docs = await Promise.all(DEV_DOCS.map((slug) => loadDoc(slug)));

  return (
    <ShellLayout section="dev" title="Developer Guides" subtitle="Deterministic setup, test, and CI instructions." apiBase={apiBase}>
      <div className="space-y-6">
        {docs.map((doc) => (
          <article
            key={doc.title}
            className="rounded-3xl border border-white/10 bg-black/30 p-6 prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: doc.html }}
          />
        ))}
      </div>
    </ShellLayout>
  );
}

import { notFound } from "next/navigation";

import { ShellLayout } from "@/components/shell/ShellLayout";
import { getDocBySlug } from "@/lib/docs";
import { renderMarkdownToHtml } from "@/lib/markdown";

const TUTORIALS = [
  ["docs", "tutorials", "normalize-intent"],
  ["docs", "tutorials", "submit-intent"],
  ["docs", "tutorials", "compute-fit"],
];

async function loadDoc(slug: string[]) {
  const doc = await getDocBySlug(slug);
  if (!doc) notFound();
  const html = await renderMarkdownToHtml(doc.body);
  return { title: doc.title, html };
}

export default async function TutorialsPage() {
  const apiBase = process.env.NEXT_PUBLIC_AIMAS_API_BASE || "";
  const tutorials = await Promise.all(TUTORIALS.map((slug) => loadDoc(slug)));

  return (
    <ShellLayout section="tutorials" title="Tutorials" subtitle="Exact steps to consume the Fairness Gate." apiBase={apiBase}>
      <div className="space-y-6">
        {tutorials.map((tutorial) => (
          <article
            key={tutorial.title}
            className="rounded-3xl border border-white/10 bg-black/30 p-6 prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: tutorial.html }}
          />
        ))}
      </div>
    </ShellLayout>
  );
}

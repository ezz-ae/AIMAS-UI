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

export default async function UseCasesPage() {
  const apiBase = process.env.NEXT_PUBLIC_AIMAS_API_BASE || "";
  const useCases = await loadDoc(["docs", "use-cases"]);

  return (
    <ShellLayout section="use-cases" title="Use Cases" subtitle="Institutions that install AIMAS before making decisions." apiBase={apiBase}>
      <article
        className="rounded-3xl border border-white/10 bg-black/30 p-6 prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: useCases.html }}
      />
    </ShellLayout>
  );
}

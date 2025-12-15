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

export default async function OverviewPage() {
  const apiBase = process.env.NEXT_PUBLIC_AIMAS_API_BASE || "";
  const overview = await loadDoc(["docs", "overview"]);
  const integration = await loadDoc(["docs", "integration"]);

  return (
    <ShellLayout section="overview" title="Protocol Overview" subtitle="Decision boundary before your own logic." apiBase={apiBase}>
      <div className="space-y-10">
        <article
          className="rounded-3xl border border-white/10 bg-black/30 p-6 prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: overview.html }}
        />
        <article
          className="rounded-3xl border border-white/10 bg-black/30 p-6 prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: integration.html }}
        />
      </div>
    </ShellLayout>
  );
}

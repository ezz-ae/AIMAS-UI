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

export default async function PricingPage() {
  const apiBase = process.env.NEXT_PUBLIC_AIMAS_API_BASE || "";
  const pricing = await loadDoc(["docs", "pricing"]);
  const buyer = await loadDoc(["docs", "buyer"]);

  return (
    <ShellLayout section="pricing" title="Access & Pricing" subtitle="Buy Fairness Gate access, not guesswork." apiBase={apiBase}>
      <div className="space-y-8">
        <article
          className="rounded-3xl border border-white/10 bg-black/30 p-6 prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: pricing.html }}
        />
        <article
          className="rounded-3xl border border-white/10 bg-black/30 p-6 prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: buyer.html }}
        />
      </div>
    </ShellLayout>
  );
}

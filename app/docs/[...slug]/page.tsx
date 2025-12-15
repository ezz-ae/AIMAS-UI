import Link from "next/link";
import { notFound } from "next/navigation";
import path from "node:path";

import { ShellLayout } from "@/components/shell/ShellLayout";
import { getAllDocSlugs, getDocBySlug } from "@/lib/docs";
import { renderMarkdownToHtml } from "@/lib/markdown";

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getAllDocSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function DocPage({ params }: { params: { slug: string[] } }) {
  const doc = await getDocBySlug(params.slug);
  if (!doc) notFound();

  const ext = path.extname(doc.sourcePath).toLowerCase();
  const isMarkdown = ext === ".md" || ext === ".mdx";
  const html = isMarkdown ? await renderMarkdownToHtml(doc.body) : null;
  const apiBase = process.env.NEXT_PUBLIC_AIMAS_API_BASE || "";

  return (
    <ShellLayout section="docs" apiBase={apiBase} title={doc.title} subtitle={`source: ${doc.sourcePath}`}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px]">
        <article>
          <Link href="/docs" className="text-xs text-neutral-400 hover:text-white">
            ← Docs index
          </Link>
          <div className="mt-8">
            {isMarkdown ? (
              <div dangerouslySetInnerHTML={{ __html: html! }} />
            ) : (
              <pre className="text-xs overflow-x-auto rounded-2xl border border-white/10 bg-black/30 p-4">
                {doc.body}
              </pre>
            )}
          </div>
        </article>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <div className="text-xs text-neutral-400">doc id</div>
            <div className="mt-1 font-mono text-sm break-words text-white">{doc.id}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <div className="text-xs text-neutral-400">table of contents</div>
            {doc.toc.length ? (
              <ul className="mt-2 space-y-2 text-sm">
                {doc.toc.map((entry) => {
                  const indent = entry.depth === 1 ? "pl-0" : entry.depth === 2 ? "pl-3" : "pl-6";
                  return (
                    <li key={entry.id} className={`${indent} text-neutral-300`}>
                      <a href={`#${entry.id}`} className="hover:text-white">
                        {entry.text}
                      </a>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="mt-2 text-xs text-neutral-500">No headings.</div>
            )}
          </div>
        </aside>
      </div>
    </ShellLayout>
  );
}

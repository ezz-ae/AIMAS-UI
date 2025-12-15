import Link from "next/link";
import { getAllDocSlugs, getDocBySlug } from "@/lib/docs";
import { renderMarkdown } from "@/lib/markdown";

export async function generateSectionStaticParams(section: string) {
  const all = getAllDocSlugs();
  return all
    .filter((s) => s[0] === section)
    .map((s) => ({ slug: s.slice(1) }));
}

export async function SectionDocPage(props: {
  section: string;
  slug: string[];
}) {
  const { section, slug } = props;
  const doc = getDocBySlug([section, ...slug]);
  const html = await renderMarkdown(doc.content);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <Link
          href={`/${section}`}
          className="text-sm text-zinc-400 hover:text-zinc-200"
        >
          ← Back to {section.toUpperCase()}
        </Link>
        <div className="text-xs text-zinc-500">AIMAS Protocol</div>
      </div>

      <h1 className="mb-3 text-3xl font-semibold tracking-tight">
        {doc.title || slug[slug.length - 1]}
      </h1>
      {doc.description ? (
        <p className="mb-8 text-zinc-400">{doc.description}</p>
      ) : null}

      <article
        className="prose prose-invert max-w-none prose-pre:bg-zinc-950/60 prose-pre:border prose-pre:border-zinc-800"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

import { notFound } from "next/navigation";
import { getDocBySlug, getAllDocSlugs } from "@/lib/docs";
import { Markdown } from "@/components/markdown";
import { DocChrome } from "@/components/doc-chrome";

export async function generateStaticParams() {
  return getAllDocSlugs().map((slug) => ({ slug }));
}

export default async function DocPage({ params }: { params: { slug?: string[] } }) {
  const slugArr = params.slug ?? [];
  const prefix = slugArr[0];
  if (!prefix || !["docs", "rfc", "api", "schemas", "conformance", "governance", "changelog"].includes(prefix)) {
    return notFound();
  }
  const doc = await getDocBySlug(slugArr);
  if (!doc) return notFound();
  return (
    <DocChrome title={doc.frontmatter.title} subtitle={doc.frontmatter.subtitle}>
      <Markdown source={doc.content} />
    </DocChrome>
  );
}

import { renderMarkdownToHtml } from "@/lib/markdown";

export async function Markdown({ source }: { source: string }) {
  const html = await renderMarkdownToHtml(source);
  return <article dangerouslySetInnerHTML={{ __html: html }} />;
}

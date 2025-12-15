import MiniSearch from "minisearch";

import type { Doc } from "@/lib/docs";

export type SearchDocument = {
  id: string;
  title: string;
  body: string;
  headings: string;
  slugPath: string;
  section: string;
  excerpt: string;
};

export const SEARCH_INDEX_OPTIONS = {
  fields: ["title", "body", "headings"],
  storeFields: ["id", "title", "section", "slugPath", "excerpt"],
};

export function buildSearchDocuments(docs: Doc[]): SearchDocument[] {
  return docs.map((doc) => ({
    id: doc.id,
    title: doc.title,
    body: doc.body,
    headings: doc.toc.map((t) => t.text).join(" "),
    slugPath: `/docs/${doc.slug.join("/")}`,
    section: doc.section,
    excerpt: createExcerpt(doc.body),
  }));
}

export function createMiniSearch(documents: SearchDocument[]): MiniSearch<SearchDocument> {
  const mini = new MiniSearch<SearchDocument>(SEARCH_INDEX_OPTIONS);
  mini.addAll(documents);
  return mini;
}

function createExcerpt(body: string): string {
  const plain = stripMarkdown(body).slice(0, 240).trim();
  if (!plain) return "";
  return plain.length >= 240 ? `${plain}…` : plain;
}

function stripMarkdown(value: string): string {
  return value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/[#>*_~`]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

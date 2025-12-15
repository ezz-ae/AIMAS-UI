import fs from "node:fs";
import path from "node:path";

import MiniSearch, { type AsPlainObject } from "minisearch";

import { loadDocsRegistry } from "@/lib/docs";
import {
  SEARCH_INDEX_OPTIONS,
  buildSearchDocuments,
  createMiniSearch,
  type SearchDocument,
} from "@/lib/search/indexer";

type SerializedIndex = {
  generatedAt: string;
  documentCount: number;
  index: AsPlainObject;
};

let searchIndexPromise: Promise<MiniSearch<SearchDocument>> | null = null;

export async function getSearchIndex() {
  if (!searchIndexPromise) {
    searchIndexPromise = process.env.NODE_ENV === "production" ? loadFromFile() : buildOnDemand();
  }
  return searchIndexPromise;
}

export async function searchDocs(query: string) {
  const text = query?.trim();
  if (!text) return [];
  const index = await getSearchIndex();
  const results = index.search(text, { prefix: true, fuzzy: 0.2 });
  return results.map((result) => ({
    id: String(result.id),
    title: String(result.title),
    section: String(result.section),
    href: String(result.slugPath),
    excerpt: String(result.excerpt || ""),
    score: result.score,
  }));
}

async function buildOnDemand() {
  const docs = await loadDocsRegistry();
  const documents = buildSearchDocuments(docs);
  return createMiniSearch(documents);
}

async function loadFromFile() {
  const file = path.join(process.cwd(), "public", "search-index.json");
  if (!fs.existsSync(file)) {
    throw new Error("[aimas-search] search-index.json missing. Run pnpm build first.");
  }
  const payload = JSON.parse(fs.readFileSync(file, "utf-8")) as SerializedIndex;
  if (!payload?.index) {
    throw new Error("[aimas-search] Invalid search index payload.");
  }
  return MiniSearch.loadJS(payload.index, SEARCH_INDEX_OPTIONS);
}

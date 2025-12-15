import fs from "node:fs";
import path from "node:path";

import { getDocsRoot, loadDocsRegistry } from "@/lib/docs";
import { buildSearchDocuments, createMiniSearch } from "@/lib/search/indexer";

async function main() {
  const docs = await loadDocsRegistry();
  const documents = buildSearchDocuments(docs);
  const mini = createMiniSearch(documents);
  const outPath = path.join(process.cwd(), "public", "search-index.json");

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(
    outPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        documentCount: documents.length,
        index: mini.toJSON(),
        source: path.relative(process.cwd(), getDocsRoot()),
      },
      null,
      2
    )
  );

  console.log(`[aimas-search] indexed ${documents.length} docs → ${outPath}`);
}

main().catch((err) => {
  console.error("[aimas-search] build failed", err);
  process.exit(1);
});

import { getDocsRoot, loadDocsRegistry, SECTION_ORDER } from "@/lib/docs";
import { loadOpenApiSpec } from "@/lib/openapi";

async function main() {
  try {
    const root = getDocsRoot();
    const docs = await loadDocsRegistry();
    if (!docs.length) {
      throw new Error("Doc registry is empty.");
    }

    const sections = new Map<string, number>();
    for (const section of SECTION_ORDER) sections.set(section, 0);
    for (const doc of docs) {
      sections.set(doc.section, (sections.get(doc.section) ?? 0) + 1);
    }

    console.log(`[docs:verify] source: ${root}`);
    for (const [section, count] of sections.entries()) {
      console.log(`  - ${section}: ${count}`);
      if (count === 0) {
        throw new Error(`Section ${section} has no documents.`);
      }
    }

    console.log(`[docs:verify] total docs: ${docs.length}`);

    if (process.env.AIMAS_ALLOW_MISSING_OPENAPI === "1") {
      console.log("[docs:verify] OpenAPI check skipped via AIMAS_ALLOW_MISSING_OPENAPI");
    } else {
      const spec = loadOpenApiSpec();
      if (!spec) {
        throw new Error("OpenAPI spec missing. Provide vendor/aimas/openapi.(yaml|yml|json) or set AIMAS_ALLOW_MISSING_OPENAPI=1");
      }
      console.log(`[docs:verify] OpenAPI: ${spec.filePath} (${spec.format})`);
    }
  } catch (err) {
    console.error("[docs:verify]", err);
    process.exit(1);
  }
}

main();

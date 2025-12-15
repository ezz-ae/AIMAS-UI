import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import { fromMarkdown } from "mdast-util-from-markdown";
import { toString } from "mdast-util-to-string";
import type { Heading } from "mdast";
import { visit } from "unist-util-visit";

export type DocSection =
  | "Meta"
  | "RFC"
  | "Schemas"
  | "Conformance"
  | "Compliance"
  | "Docs";

export type TocEntry = { depth: number; text: string; id: string };

export type Doc = {
  id: string;
  slug: string[];
  title: string;
  section: DocSection;
  sourcePath: string;
  body: string;
  toc: TocEntry[];
};

type SectionConfig = {
  section: DocSection;
  slugRoot: string;
  dirNames: string[];
};

type MetaFileConfig = { file: string; slug: string[]; label?: string };

const ACCEPTED_EXTS = new Set([".md", ".mdx", ".txt", ".json", ".yaml", ".yml"]);
const MARKDOWN_EXTS = new Set([".md", ".mdx"]);

const SECTION_DIRECTORIES: SectionConfig[] = [
  { section: "RFC", slugRoot: "rfc", dirNames: ["RFC"] },
  { section: "Schemas", slugRoot: "schemas", dirNames: ["schemas"] },
  { section: "Conformance", slugRoot: "conformance", dirNames: ["conformance"] },
  { section: "Compliance", slugRoot: "compliance", dirNames: ["compliance"] },
  { section: "Docs", slugRoot: "docs", dirNames: ["docs"] },
];

const META_FILES: MetaFileConfig[] = [
  { file: "README.md", slug: ["meta", "readme"], label: "README" },
  { file: "CHANGELOG.md", slug: ["meta", "changelog"], label: "Changelog" },
  { file: "CONFORMANCE.md", slug: ["meta", "conformance"], label: "Conformance" },
  { file: "GOVERNANCE.md", slug: ["meta", "governance"], label: "Governance" },
  { file: "SECURITY.md", slug: ["meta", "security"], label: "Security" },
];

export const SECTION_ORDER: DocSection[] = [
  "Meta",
  "RFC",
  "Schemas",
  "Conformance",
  "Compliance",
  "Docs",
];

export const SECTION_DESCRIPTIONS: Record<DocSection, string> = {
  Meta: "Top-level README, governance, security, and change control.",
  RFC: "Canonical protocol RFCs (constraints, math, invariants).",
  Schemas: "Deterministic machine contracts for AIMAS primitives.",
  Conformance: "Verification requirements, fixtures, and proofs.",
  Compliance: "Forbidden patterns and enforcement notes.",
  Docs: "Adoption notes, architecture memos, supporting context.",
};

let registryCache: Doc[] | null = null;
let registryMap: Map<string, Doc> | null = null;
let docsRootCache: string | null = null;

function ensureDocsRoot(): string {
  const override = process.env.AIMAS_DOCS_PATH;
  const defaultRoot = path.join(process.cwd(), "vendor", "aimas");
  const fallbackRoot = path.join(process.cwd(), "AIMAS");
  const resolved = override
    ? path.resolve(process.cwd(), override)
    : fs.existsSync(defaultRoot)
    ? defaultRoot
    : fallbackRoot;

  if (!override && resolved === defaultRoot && !hasOpenApi(defaultRoot) && fs.existsSync(fallbackRoot)) {
    return fallbackRoot;
  }

  if (!fs.existsSync(resolved)) {
    const msg = override
      ? `Override path ${resolved} does not exist.`
      : `Docs source missing. Run \"git submodule update --init --recursive\", ensure AIMAS/ exists, or set AIMAS_DOCS_PATH.`;
    throw new Error(`[aimas-docs] ${msg}`);
  }

  return resolved;
}

function hasOpenApi(root: string) {
  const candidates = ["openapi.yaml", "openapi.yml", "openapi.json"];
  return candidates.some((name) => fs.existsSync(path.join(root, name)));
}

function maybeRefreshCache(targetRoot: string) {
  if (!registryCache || docsRootCache !== targetRoot) {
    const docs = buildRegistry(targetRoot);
    registryCache = docs;
    docsRootCache = targetRoot;
    registryMap = new Map(docs.map((doc) => [doc.id, doc]));
  }
}

function buildRegistry(root: string): Doc[] {
  const docs: Doc[] = [];

  for (const config of SECTION_DIRECTORIES) {
    const dir = resolveDirectory(root, config.dirNames);
    docs.push(...collectSectionDocs({ root, dir, config }));
  }

  for (const meta of META_FILES) {
    const source = resolveFile(root, meta.file);
    docs.push(createDocRecord({
      root,
      section: "Meta",
      slug: meta.slug,
      filePath: source,
      explicitTitle: meta.label,
    }));
  }

  if (docs.length === 0) {
    throw new Error("[aimas-docs] Registry is empty. AIMAS source is required.");
  }

  return docs.sort((a, b) => a.id.localeCompare(b.id));
}

type CollectArgs = { root: string; dir: string; config: SectionConfig };

function collectSectionDocs({ root, dir, config }: CollectArgs): Doc[] {
  const docs: Doc[] = [];
  const queue: { current: string; parts: string[] }[] = [{ current: dir, parts: [] }];

  while (queue.length) {
    const node = queue.pop()!;
    const entries = fs.readdirSync(node.current, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue;
      const fullPath = path.join(node.current, entry.name);
      if (entry.isDirectory()) {
        queue.push({ current: fullPath, parts: [...node.parts, entry.name] });
        continue;
      }

      if (!entry.isFile()) continue;
      const ext = path.extname(entry.name).toLowerCase();
      if (!ACCEPTED_EXTS.has(ext)) continue;

      const slugParts = [config.slugRoot, ...node.parts, entry.name.replace(ext, "")].map(
        (part) => slugify(part)
      );
      const slug = slugParts.filter(Boolean);
      docGuard(slug, fullPath);
      docs.push(
        createDocRecord({
          root,
          section: config.section,
          filePath: fullPath,
          slug,
        })
      );
    }
  }

  if (docs.length === 0) {
    throw new Error(`[aimas-docs] Section ${config.section} has no documents.`);
  }

  return docs;
}

type DocRecordArgs = {
  root: string;
  section: DocSection;
  filePath: string;
  slug?: string[];
  explicitTitle?: string;
};

function createDocRecord(args: DocRecordArgs): Doc {
  const { root, section, filePath, slug, explicitTitle } = args;
  const relativeSource = path.relative(root, filePath).replace(/\\/g, "/");
  const ext = path.extname(filePath).toLowerCase();
  const raw = fs.readFileSync(filePath, "utf-8");

  let body = raw;
  let title = explicitTitle || "";
  let toc: TocEntry[] = [];

  if (MARKDOWN_EXTS.has(ext)) {
    const parsed = matter(raw);
    body = parsed.content;
    if (!title) title = typeof parsed.data?.title === "string" ? parsed.data.title : "";
    toc = buildToc(body);
    if (!title && toc.length > 0) {
      const primary = toc.find((t) => t.depth === 1) ?? toc[0];
      title = primary?.text ?? "";
    }
  }

  if (!title) {
    const base = path.basename(filePath).replace(ext, "");
    title = humanize(base);
  }

  const slugParts = slug ?? buildSlugFromPath(section, relativeSource, ext);

  return {
    id: slugParts.join("/"),
    slug: slugParts,
    title,
    section,
    sourcePath: relativeSource,
    body: body.length ? body : raw,
    toc,
  };
}

function buildSlugFromPath(section: DocSection, relativeSource: string, ext: string): string[] {
  const withoutExt = stripFileExt(relativeSource, ext);
  const parts = withoutExt.split(/[\\/]/).map((part) => slugify(part));
  const root = sectionSlugRoot(section);
  return [root, ...parts].filter(Boolean);
}

function stripFileExt(value: string, ext: string): string {
  if (!ext) return value;
  if (value.toLowerCase().endsWith(ext)) {
    return value.slice(0, -ext.length);
  }
  return value;
}

function sectionSlugRoot(section: DocSection): string {
  const match = SECTION_DIRECTORIES.find((cfg) => cfg.section === section);
  if (match) return match.slugRoot;
  return section.toLowerCase();
}

function buildToc(content: string): TocEntry[] {
  if (!content.trim()) return [];
  const tree = fromMarkdown(content);
  const slugger = new GithubSlugger();
  const toc: TocEntry[] = [];

  visit(tree, "heading", (node) => {
    const heading = node as Heading;
    const depth = heading.depth ?? 0;
    if (depth < 1 || depth > 3) return;
    const text = toString(heading).trim();
    if (!text) return;
    toc.push({ depth, text, id: slugger.slug(text) });
  });

  return toc;
}

function slugify(input: string): string {
  const normalized = input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return normalized || input.toLowerCase() || "entry";
}

function humanize(value: string): string {
  const base = value.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
  return base
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    .trim();
}

function resolveDirectory(root: string, candidates: string[]): string {
  for (const candidate of candidates) {
    const dir = findCaseInsensitive(root, candidate);
    if (dir && fs.statSync(dir).isDirectory()) return dir;
  }
  throw new Error(`[aimas-docs] Required directory ${candidates[0]} is missing in ${root}`);
}

function resolveFile(root: string, fileName: string): string {
  const file = findCaseInsensitive(root, fileName);
  if (file && fs.statSync(file).isFile()) return file;
  throw new Error(`[aimas-docs] Required file ${fileName} is missing in ${root}`);
}

function findCaseInsensitive(root: string, target: string): string | null {
  const entries = fs.readdirSync(root, { withFileTypes: true });
  const match = entries.find((entry) => entry.name.toLowerCase() === target.toLowerCase());
  return match ? path.join(root, match.name) : null;
}

function docGuard(slug: string[], filePath: string) {
  if (slug.length === 0) {
    throw new Error(`[aimas-docs] Could not derive slug for ${filePath}`);
  }
}

export async function loadDocsRegistry(): Promise<Doc[]> {
  const root = ensureDocsRoot();
  maybeRefreshCache(root);
  return registryCache ?? [];
}

export async function getDocBySlug(slug: string[]): Promise<Doc | null> {
  if (!slug?.length) return null;
  await loadDocsRegistry();
  const id = slug.join("/");
  return (registryMap?.get(id) as Doc | undefined) ?? null;
}

export async function getAllDocSlugs(): Promise<string[][]> {
  const docs = await loadDocsRegistry();
  return docs.map((doc) => doc.slug);
}

export function getDocsRoot(): string {
  if (docsRootCache) return docsRootCache;
  docsRootCache = ensureDocsRoot();
  return docsRootCache;
}

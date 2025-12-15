import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const root = process.cwd();
const contentDir = path.join(root, "content");
const outPath = path.join(root, "public", "search-index.json");

function stripMd(s) {
  return s
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function walk(dir, files = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, files);
    else if (ent.isFile() && ent.name.endsWith(".md")) files.push(p);
  }
  return files;
}

const files = walk(contentDir);
const items = [];
for (const f of files) {
  const rel = path.relative(contentDir, f).replace(/\\/g, "/");
  const slug = rel.replace(/\.md$/, "");
  const url = "/" + slug;
  const raw = fs.readFileSync(f, "utf-8");
  const parsed = matter(raw);
  items.push({
    id: slug,
    title: String(parsed.data?.title || slug),
    section: String(parsed.data?.subtitle || ""),
    path: url,
    content: stripMd(parsed.content),
  });
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify({ generated_at: new Date().toISOString(), items }, null, 2));
console.log(`Search index: ${items.length} docs → public/search-index.json`);

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type Doc = {
  slug: string[];
  frontmatter: { title: string; subtitle?: string };
  content: string;
};

export function getAllDocSlugs(): string[][] {
  const files: string[] = [];
  const walk = (dir: string) => {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, ent.name);
      if (ent.isDirectory()) walk(p);
      else if (ent.isFile() && ent.name.endsWith(".md")) files.push(p);
    }
  };
  walk(CONTENT_DIR);
  return files.map((f) => path.relative(CONTENT_DIR, f).replace(/\.md$/, "").split(path.sep));
}

export async function getDocBySlug(slug: string[]): Promise<Doc | null> {
  const file = path.join(CONTENT_DIR, ...slug) + ".md";
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf-8");
  const parsed = matter(raw);
  const fm = parsed.data as any;
  return {
    slug,
    frontmatter: { title: fm.title || slug.join("/"), subtitle: fm.subtitle || "" },
    content: parsed.content,
  };
}

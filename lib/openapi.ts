import fs from "node:fs";
import path from "node:path";

import { getDocsRoot } from "@/lib/docs";

const CANDIDATES = [
  ["schemas", "openapi.yaml"],
  ["schemas", "openapi.yml"],
  ["schemas", "openapi.json"],
  ["openapi.yaml"],
  ["openapi.yml"],
  ["openapi.json"],
];

export type OpenApiSpec = {
  format: "yaml" | "json";
  filePath: string;
  body: string;
};

export function loadOpenApiSpec(): OpenApiSpec | null {
  const root = getDocsRoot();
  for (const segments of CANDIDATES) {
    const resolved = resolveCandidate(root, segments);
    if (!resolved) continue;
    const ext = path.extname(resolved).toLowerCase();
    if (!fs.statSync(resolved).isFile()) continue;
    const body = fs.readFileSync(resolved, "utf-8");
    return {
      format: ext === ".json" ? "json" : "yaml",
      filePath: path.relative(root, resolved).replace(/\\/g, "/"),
      body,
    };
  }
  return null;
}

function resolveCandidate(root: string, segments: string[]): string | null {
  let current = root;
  for (const segment of segments) {
    const match = findCaseInsensitive(current, segment);
    if (!match) return null;
    current = match;
  }
  return current;
}

function findCaseInsensitive(dir: string, target: string): string | null {
  if (!fs.existsSync(dir)) return null;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const match = entries.find((entry) => entry.name.toLowerCase() === target.toLowerCase());
  return match ? path.join(dir, match.name) : null;
}

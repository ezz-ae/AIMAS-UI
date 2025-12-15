#!/usr/bin/env node
import { execSync } from "node:child_process";
import fs from "node:fs";

const secretPattern = /sk-[a-zA-Z0-9]{20,}/;
const files = execSync("git ls-files", { encoding: "utf-8" })
  .split("\n")
  .filter(Boolean)
  .filter((file) => !file.startsWith(".next/"));

for (const file of files) {
  if (file.startsWith("node_modules/")) continue;
  const stat = fs.statSync(file, { throwIfNoEntry: false });
  if (!stat || !stat.isFile()) continue;
  const content = fs.readFileSync(file, "utf-8");
  if (secretPattern.test(content)) {
    console.error(`[check-secrets] Potential OpenAI secret detected in ${file}`);
    process.exit(1);
  }
}

console.log("[check-secrets] OK — no OpenAI secrets detected.");

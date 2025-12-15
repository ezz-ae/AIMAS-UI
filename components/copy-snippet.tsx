"use client";

import { useState } from "react";

export function CopySnippet({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-xs text-neutral-300 font-mono">
      <pre className="whitespace-pre-wrap break-words">{value}</pre>
      <button
        type="button"
        onClick={copy}
        className="mt-3 rounded-full border border-white/20 px-3 py-1 text-[11px] font-semibold text-white hover:border-white"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

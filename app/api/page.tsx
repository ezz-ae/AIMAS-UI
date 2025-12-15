import { CopySnippet } from "@/components/copy-snippet";
import { ShellLayout } from "@/components/shell/ShellLayout";
import { loadOpenApiSpec } from "@/lib/openapi";

export default function ApiPage() {
  const spec = loadOpenApiSpec();
  const apiBase = process.env.NEXT_PUBLIC_AIMAS_API_BASE || "";
  const sanitizedBase = apiBase.replace(/\/$/, "");

  const curlGet = sanitizedBase
    ? `curl ${sanitizedBase}`
    : "Set NEXT_PUBLIC_AIMAS_API_BASE to render curl snippets.";
  const curlSpec = sanitizedBase ? `curl ${sanitizedBase}/openapi.yaml` : curlGet;
  const curlFit = sanitizedBase
    ? `curl -X POST ${sanitizedBase}/fit \\\n+  -H "content-type: application/json" \\\n+  -d '{"intent":"Need compliance partner"}'`
    : curlGet;

  return (
    <ShellLayout section="api" apiBase={apiBase} title="OpenAPI" subtitle="Read-only render of the canonical protocol interface.">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <CopySnippet value={curlGet} />
          <CopySnippet value={curlSpec} />
          <CopySnippet value={curlFit} />
        </div>

        {spec ? (
          <div className="rounded-3xl border border-white/10 bg-black/30 p-5 space-y-4">
            <div className="flex items-center justify-between gap-3 text-sm">
              <div>
                <div className="text-xs text-neutral-400">source</div>
                <div className="font-mono text-xs text-white/80">{spec.filePath}</div>
              </div>
              <div className="text-xs font-mono text-neutral-400 uppercase">{spec.format}</div>
            </div>
            <pre className="rounded-2xl border border-white/10 bg-black/50 p-4 text-xs text-neutral-200 overflow-x-auto">
              {spec.body}
            </pre>
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-white/20 p-5 text-sm text-neutral-400">
            No OpenAPI spec found. Place openapi.yaml/json in vendor/aimas (or configure AIMAS_DOCS_PATH) and rebuild.
          </div>
        )}
      </div>
    </ShellLayout>
  );
}

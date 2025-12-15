import { CopySnippet } from "@/components/copy-snippet";
import { ShellLayout } from "@/components/shell/ShellLayout";
import { loadOpenApiSpec } from "@/lib/openapi";

const ENDPOINTS = [
  { method: "GET", path: "/", summary: "Service metadata" },
  { method: "GET", path: "/healthz", summary: "Health probe" },
  { method: "GET", path: "/readyz", summary: "Ready probe" },
  { method: "GET", path: "/livez", summary: "Live probe" },
  { method: "POST", path: "/v1/intent", summary: "Register Intent Capsule" },
  { method: "POST", path: "/v1/fit/{intent_id}", summary: "Return Fit Matrix" },
  { method: "POST", path: "/v1/conformance/validate", summary: "Validate payload" },
  { method: "GET", path: "/openapi.yaml", summary: "Contract" },
];

export default function ApiPage() {
  const spec = loadOpenApiSpec();
  const apiBase = process.env.NEXT_PUBLIC_AIMAS_API_BASE || "";
  const sanitizedBase = apiBase.replace(/\/$/, "");

  const placeholder = "Set NEXT_PUBLIC_AIMAS_API_BASE to render curl snippets.";
  const curlIntent = sanitizedBase
    ? `curl -X POST ${sanitizedBase}/v1/intent \\
  -H "content-type: application/json" \\
  -d '{"intent_features":{"normalized_intent":"Need compliance partner"}}'`
    : placeholder;
  const curlSpec = sanitizedBase ? `curl ${sanitizedBase}/openapi.yaml` : placeholder;
  const curlFit = sanitizedBase
    ? `curl -X POST ${sanitizedBase}/v1/fit/intent-demo-123 \\
  -H "content-type: application/json" \\
  -d '{"capsule_echo":false}'`
    : placeholder;

  return (
    <ShellLayout section="api" apiBase={apiBase} title="OpenAPI" subtitle="Read-only render of the canonical protocol interface.">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-black/30 p-5 text-sm text-neutral-200">
            <div className="text-xs font-mono text-neutral-400">Contract guarantees</div>
            <ul className="mt-3 space-y-2 text-xs text-neutral-400">
              <li>Free Baseline Path in every Fit Matrix.</li>
              <li>No personalization, ranking, or persuasion.</li>
              <li>Audit headers on every response (`X-AIMAS-*`).</li>
              <li>Rate-limit headers expose tier + window.</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/30 p-5 text-sm text-neutral-200">
            <div className="text-xs font-mono text-neutral-400">How buyers integrate</div>
            <p className="mt-3 text-neutral-300">
              Normalize intent → POST <code className="font-mono">/v1/intent</code> → POST <code className="font-mono">/v1/fit/{'{intent_id}'}</code> → store Fit Matrix + headers → run your own decision logic. AIMAS stops before ranking.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-black/30 p-5 text-xs text-neutral-300">
          <div className="text-xs font-mono text-neutral-400">Endpoints</div>
          <div className="mt-3 divide-y divide-white/10">
            {ENDPOINTS.map((ep) => (
              <div key={ep.path} className="py-2 flex items-center justify-between gap-4">
                <span className="font-mono text-neutral-400">{ep.method}</span>
                <span className="flex-1 text-left text-white/90">{ep.path}</span>
                <span className="text-right text-neutral-500">{ep.summary}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <CopySnippet value={curlIntent} />
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

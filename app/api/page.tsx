import { loadOpenApiSpec } from "@/lib/openapi";

export default function ApiPage() {
  const spec = loadOpenApiSpec();

  return (
    <main className="min-h-[calc(100vh-64px)]">
      <section className="mx-auto max-w-5xl px-6 py-12 space-y-6">
        <header>
          <div className="text-xs uppercase tracking-[0.3em] text-neutral-500">OpenAPI</div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Protocol Interface</h1>
          <p className="mt-2 text-neutral-600">
            Viewer is read-only. Actual contract lives in the AIMAS authority repository.
          </p>
        </header>

        {spec ? (
          <div className="rounded-3xl border p-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs text-neutral-500">source</div>
                <div className="font-mono text-sm">{spec.filePath}</div>
              </div>
              <div className="text-xs font-mono text-neutral-500 uppercase">{spec.format}</div>
            </div>
            <pre className="rounded-2xl border bg-neutral-50 p-4 text-xs overflow-x-auto">
              {spec.body}
            </pre>
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed p-5 text-sm text-neutral-500">
            No OpenAPI spec found. Place openapi.yaml/json in vendor/aimas (or configure AIMAS_DOCS_PATH) and rebuild.
          </div>
        )}
      </section>
    </main>
  );
}

import { DocLayout } from "@/components/doc-layout";
import { DocCard } from "@/components/doc-card";

export default function ApiIndex() {
  return (
    <DocLayout title="API" subtitle="Deterministic endpoints. LLMs are adapters, never judges.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DocCard href="/api/reference" title="Reference" desc="Routes, request/response, errors." />
        <DocCard href="/api/examples" title="Examples" desc="curl + Node quickstarts." />
        <DocCard href="/api/cloud-run" title="Cloud Run Deploy" desc="Source deploy, env, CORS." />
        <DocCard href="/api/security" title="Security" desc="Integrity-first posture." />
      </div>
    </DocLayout>
  );
}

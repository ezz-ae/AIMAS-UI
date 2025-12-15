import { DocLayout } from "@/components/doc-layout";
import { DocCard } from "@/components/doc-card";

export default function DocsIndex() {
  return (
    <DocLayout title="Documentation" subtitle="Specification-first reading surface.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DocCard href="/docs/overview" title="Overview" desc="What AIMAS is, what it refuses to be." />
        <DocCard href="/docs/architecture" title="Architecture" desc="Surfaces, pipelines, organs, constraints." />
        <DocCard href="/docs/fairness" title="Fairness Rule" desc="Free baseline is mandatory." />
        <DocCard href="/docs/zero-leakage" title="Zero Leakage" desc="L0 never persists. Derived features only." />
        <DocCard href="/docs/versioning" title="Versioning" desc="Protocol changes are proposals, not edits." />
        <DocCard href="/docs/implementations" title="Implementations" desc="Node, WordPress kit, adapters." />
      </div>
    </DocLayout>
  );
}

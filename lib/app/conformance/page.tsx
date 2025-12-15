import { DocLayout } from "@/components/doc-layout";
import { DocCard } from "@/components/doc-card";
export default function ConformanceIndex() {
  return (
    <DocLayout title="Conformance" subtitle="How implementations prove they are compliant.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DocCard href="/conformance/rules" title="Rules" desc="Non-negotiables." />
        <DocCard href="/conformance/tests" title="Test Vectors" desc="Fixtures to validate behavior." />
        <DocCard href="/conformance/violations" title="Violations" desc="Forbidden patterns." />
      </div>
    </DocLayout>
  );
}

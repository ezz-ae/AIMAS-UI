import { DocLayout } from "@/components/doc-layout";
import { DocCard } from "@/components/doc-card";
export default function SchemasIndex() {
  return (
    <DocLayout title="Schemas" subtitle="Canonical data contracts.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DocCard href="/schemas/intent-capsule" title="Intent Capsule" desc="Derived input object." />
        <DocCard href="/schemas/fit-matrix" title="Fit Matrix" desc="Monetizable output object." />
        <DocCard href="/schemas/nyk" title="NYK" desc="Versioned identity anchor." />
        <DocCard href="/schemas/force-notes" title="Force Notes" desc="Append-only ledger." />
        <DocCard href="/schemas/was" title="Was" desc="Private reflex schema." />
      </div>
    </DocLayout>
  );
}

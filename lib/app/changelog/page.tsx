import { DocLayout } from "@/components/doc-layout";
import { DocCard } from "@/components/doc-card";
export default function ChangelogIndex() {
  return (
    <DocLayout title="Changelog" subtitle="Release lineage (tags).">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DocCard href="/changelog/v1-0-1" title="v1.0.1" desc="Protocol site + XUI scaffold." />
        <DocCard href="/changelog/v1-0-0" title="v1.0.0" desc="Canonical protocol release." />
      </div>
    </DocLayout>
  );
}

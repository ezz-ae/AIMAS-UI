import { DocLayout } from "@/components/doc-layout";
import { DocCard } from "@/components/doc-card";
export default function GovernanceIndex() {
  return (
    <DocLayout title="Governance" subtitle="Change control. Spec-first.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DocCard href="/governance/process" title="Process" desc="How RFC changes are ratified." />
        <DocCard href="/governance/security" title="Security" desc="Disclosure + integrity posture." />
        <DocCard href="/governance/license" title="License" desc="Canonical usage rules." />
      </div>
    </DocLayout>
  );
}

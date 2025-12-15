import { DocLayout } from "@/components/doc-layout";
import { DocCard } from "@/components/doc-card";

const rfcs = [
  ["RFC-0001", "Core Protocol", "/rfc/rfc-0001"],
  ["RFC-0002", "CFS", "/rfc/rfc-0002"],
  ["RFC-0003", "NYK", "/rfc/rfc-0003"],
  ["RFC-0004", "Force Notes", "/rfc/rfc-0004"],
  ["RFC-0005", "Was", "/rfc/rfc-0005"],
  ["RFC-0006", "Fairness", "/rfc/rfc-0006"],
  ["RFC-0007", "Compliance", "/rfc/rfc-0007"],
];

export default function RfcIndex() {
  return (
    <DocLayout title="RFC Set" subtitle="Canonical laws. No improvisation.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rfcs.map(([code, title, href]) => (
          <DocCard key={code} href={href} title={`${code} — ${title}`} desc="Open canonical text" />
        ))}
      </div>
    </DocLayout>
  );
}

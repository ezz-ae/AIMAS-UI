import { ProtocolDashboard } from "@/components/protocol-dashboard";
import { ShellLayout } from "@/components/shell/ShellLayout";

export default function SystemPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = typeof searchParams.q === "string" ? searchParams.q : "";
  const apiBase = process.env.NEXT_PUBLIC_AIMAS_API_BASE || "";

  return (
    <ShellLayout
      section="system"
      title="Protocol Shell"
      subtitle="Input → Capsule → Fit Matrix → Paths (read-only)."
      apiBase={apiBase}
    >
      <ProtocolDashboard initialIntent={query} apiBase={apiBase} />
    </ShellLayout>
  );
}

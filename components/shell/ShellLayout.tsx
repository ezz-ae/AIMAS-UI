import Link from "next/link";

import { StatusIndicator } from "@/components/status-indicator";

const NAV_ITEMS = [
  { key: "overview", label: "Overview", href: "/overview" },
  { key: "system", label: "Protocol Shell", href: "/system" },
  { key: "spec", label: "Specification", href: "/spec" },
  { key: "tutorials", label: "Tutorials", href: "/tutorials" },
  { key: "dev", label: "Developer Guides", href: "/dev" },
  { key: "use-cases", label: "Use Cases", href: "/use-cases" },
  { key: "pricing", label: "Pricing", href: "/pricing" },
  { key: "docs", label: "Docs", href: "/docs" },
  { key: "api", label: "API Reference", href: "/api" },
];

const SECTION_LABELS: Record<string, string> = {
  system: "Protocol Shell",
  docs: "Documentation",
  api: "API Reference",
  overview: "Overview",
  spec: "Specification",
  pricing: "Pricing",
  "use-cases": "Use Cases",
  tutorials: "Tutorials",
  dev: "Developer Guides",
};

type ShellLayoutProps = {
  section: "overview" | "system" | "spec" | "tutorials" | "dev" | "use-cases" | "pricing" | "docs" | "api";
  title?: string;
  subtitle?: string;
  apiBase?: string;
  children: React.ReactNode;
};

export function ShellLayout({ section, title, subtitle, apiBase, children }: ShellLayoutProps) {
  const sectionLabel = SECTION_LABELS[section] || "AIMAS";

  return (
    <div className="min-h-screen bg-[#020308] text-white flex">
      <aside className="hidden md:flex w-64 flex-col border-r border-white/5 bg-black/40 backdrop-blur">
        <div className="p-6 border-b border-white/5">
          <div className="text-xs font-mono text-neutral-400">AIMAS</div>
          <div className="mt-1 text-lg font-semibold tracking-tight">Protocol Workspace</div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = section === item.key;
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`block rounded-xl px-4 py-3 text-sm transition ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-neutral-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-6 border-t border-white/5 text-xs text-neutral-500">
          Fairness enforced by structure. No persuasion, no ranking.
        </div>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="border-b border-white/10 bg-black/40 backdrop-blur px-4 py-3 flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-neutral-400">Current</div>
            <div className="text-base font-semibold tracking-tight">{sectionLabel}</div>
          </div>
          <div className="flex items-center gap-4">
            <StatusIndicator apiBase={apiBase} />
            <a
              href="https://github.com/ezz-ae/AIMAS-UI"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white hover:border-white"
            >
              GitHub
            </a>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto px-6 py-8">
          {title ? (
            <div className="mb-8">
              <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
              {subtitle ? <p className="mt-2 text-sm text-neutral-400 max-w-3xl">{subtitle}</p> : null}
            </div>
          ) : null}
          {children}
        </main>
      </div>
    </div>
  );
}

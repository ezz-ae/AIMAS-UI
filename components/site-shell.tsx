import { TopNav } from "@/components/top-nav";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <TopNav />
      {children}
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-6 py-10 text-xs text-neutral-500 flex justify-between gap-3 flex-wrap">
          <div>© {new Date().getFullYear()} AIMAS Protocol</div>
          <div className="font-mono">Spec-first · Deterministic · Fairness enforced</div>
        </div>
      </footer>
    </div>
  );
}

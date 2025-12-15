"use client";
import { usePathname } from "next/navigation";

const LINKS = [
  ["/", "Home"],
  ["/search", "Search"],
  ["/docs", "Docs"],
  ["/api", "API"],
  ["/system", "System"],
];

export function TopNav() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur border-b">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between gap-4">
        <a href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl border flex items-center justify-center font-mono text-xs">AI</div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">AIMAS</div>
            <div className="text-[11px] text-neutral-500 -mt-0.5">Protocol</div>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-1">
          {LINKS.map(([href, label]) => {
            const active = path === href || (href !== "/" && path.startsWith(href));
            return (
              <a
                key={href}
                href={href}
                className={[
                  "px-3 py-2 rounded-xl text-sm transition",
                  active ? "bg-neutral-900 text-white" : "text-neutral-700 hover:bg-neutral-100",
                ].join(" ")}
              >
                {label}
              </a>
            );
          })}
        </nav>

        <a href="/system" className="md:hidden px-3 py-2 rounded-xl bg-neutral-900 text-white text-sm">
          System
        </a>
      </div>
    </header>
  );
}

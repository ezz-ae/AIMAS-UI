import { NAV } from "@/lib/nav";
export function SideNav() {
  return (
    <nav className="rounded-2xl border p-3">
      <div className="text-xs text-neutral-500 px-2 py-2">Protocol</div>
      <div className="space-y-1">
        {NAV.map((g) => (
          <div key={g.title} className="pt-2">
            <div className="px-2 text-xs font-semibold text-neutral-900">{g.title}</div>
            <div className="mt-1 space-y-1">
              {g.items.map((it) => (
                <a key={it.href} href={it.href}
                   className="block px-2 py-1.5 rounded-xl text-sm text-neutral-700 hover:bg-neutral-100">
                  {it.label}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
}

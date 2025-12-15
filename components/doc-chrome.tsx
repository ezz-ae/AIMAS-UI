import { SideNav } from "@/components/side-nav";
import { SearchBox } from "@/components/search-box";

export function DocChrome({ title, subtitle, children }:
{ title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <main className="min-h-[calc(100vh-64px)]">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
          <aside className="lg:sticky lg:top-24 h-fit">
            <SearchBox />
            <div className="mt-4"><SideNav /></div>
          </aside>
          <section>
            <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
            {subtitle ? <p className="mt-2 text-neutral-600 max-w-3xl">{subtitle}</p> : null}
            <div className="mt-8">{children}</div>
          </section>
        </div>
      </div>
    </main>
  );
}

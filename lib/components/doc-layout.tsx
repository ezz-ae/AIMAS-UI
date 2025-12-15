export function DocLayout({ title, subtitle, children }:
{ title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <main className="min-h-[calc(100vh-64px)]">
      <section className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-neutral-600 max-w-3xl">{subtitle}</p>
        <div className="mt-8">{children}</div>
      </section>
    </main>
  );
}

export function DocCard({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <a href={href} className="rounded-2xl border p-5 hover:shadow-soft transition block">
      <div className="text-sm font-semibold">{title}</div>
      <div className="text-sm text-neutral-600 mt-2 leading-relaxed">{desc}</div>
      <div className="mt-4 text-xs text-neutral-500 font-mono">{href}</div>
    </a>
  );
}

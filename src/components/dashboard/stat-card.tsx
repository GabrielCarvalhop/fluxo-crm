import Link from "next/link";

export function StatCard({
  label,
  value,
  href,
  sublabel,
}: {
  label: string;
  value: string;
  href: string;
  sublabel?: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-1 rounded-lg border border-border bg-card p-3.5 transition-colors hover:border-border-strong"
    >
      <span className="text-[11px] font-medium tracking-wide text-text-subtle uppercase">{label}</span>
      <span className="font-mono text-2xl font-semibold tabular-nums text-foreground">{value}</span>
      {sublabel && <span className="text-xs text-muted-foreground">{sublabel}</span>}
    </Link>
  );
}

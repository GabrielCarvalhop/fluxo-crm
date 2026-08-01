export function IndicatorCard({ label, value, sublabel }: { label: string; value: string; sublabel?: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-border bg-card p-3.5">
      <span className="text-[11px] font-medium tracking-wide text-text-subtle uppercase">{label}</span>
      <span className="font-mono text-xl font-semibold tabular-nums text-foreground">{value}</span>
      {sublabel && <span className="text-xs text-muted-foreground">{sublabel}</span>}
    </div>
  );
}

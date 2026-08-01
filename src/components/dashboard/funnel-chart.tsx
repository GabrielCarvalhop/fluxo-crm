const STEPS = [
  { key: "prospected_count", label: "Prospectados" },
  { key: "responded_count", label: "Responderam" },
  { key: "meeting_count", label: "Reuniões" },
  { key: "proposal_count", label: "Propostas" },
  { key: "won_count", label: "Fechamentos" },
] as const;

export function FunnelChart({ metrics }: { metrics: Record<(typeof STEPS)[number]["key"], number> }) {
  const max = Math.max(metrics.prospected_count, 1);

  return (
    <div className="flex flex-col gap-2.5 px-4 py-3">
      {STEPS.map((step, i) => {
        const value = metrics[step.key];
        const prev = i > 0 ? metrics[STEPS[i - 1].key] : null;
        const conversion = prev && prev > 0 ? Math.round((value / prev) * 100) : null;
        const widthPct = Math.max(4, Math.round((value / max) * 100));

        return (
          <div key={step.key} className="flex items-center gap-3">
            <span className="w-24 shrink-0 text-xs text-muted-foreground">{step.label}</span>
            <div className="h-6 flex-1 overflow-hidden rounded-md bg-muted">
              <div
                className="flex h-full items-center justify-end rounded-md bg-primary/80 px-2 transition-all"
                style={{ width: `${widthPct}%` }}
              >
                <span className="font-mono text-xs font-medium text-primary-foreground tabular-nums">{value}</span>
              </div>
            </div>
            <span className="w-10 shrink-0 text-right font-mono text-xs text-text-subtle tabular-nums">
              {conversion !== null ? `${conversion}%` : ""}
            </span>
          </div>
        );
      })}
    </div>
  );
}

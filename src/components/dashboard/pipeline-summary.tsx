import Link from "next/link";
import { StageBadge } from "@/components/shared/stage-badge";
import { MoneyValue } from "@/components/shared/money-value";
import type { DashboardData } from "@/lib/queries/dashboard";

export function PipelineSummary({ leads, stages }: { leads: DashboardData["leads"]; stages: DashboardData["stages"] }) {
  const rows = stages
    .filter((s) => !s.is_won && !s.is_lost)
    .map((stage) => {
      const inStage = leads.filter((l) => l.stage_id === stage.id);
      return {
        stage,
        count: inStage.length,
        value: inStage.reduce((sum, l) => sum + (l.estimated_value ? Number(l.estimated_value) : 0), 0),
      };
    })
    .filter((r) => r.count > 0);

  if (rows.length === 0) {
    return <p className="px-4 py-3 text-sm text-muted-foreground">Nenhum lead ativo no pipeline.</p>;
  }

  return (
    <div className="flex flex-col">
      {rows.map(({ stage, count, value }) => (
        <Link
          key={stage.id}
          href={`/leads?stage=${stage.key}`}
          className="flex items-center justify-between gap-2 border-b border-border px-4 py-2 text-sm last:border-0 hover:bg-accent/50"
        >
          <StageBadge label={stage.label} color={stage.color} />
          <div className="flex items-center gap-3">
            <span className="text-text-subtle">{count}</span>
            <MoneyValue value={value} className="text-muted-foreground" />
          </div>
        </Link>
      ))}
    </div>
  );
}

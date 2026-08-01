import Link from "next/link";
import { RelativeTime } from "@/components/shared/relative-time";
import { EmptyState } from "@/components/shared/empty-state";
import { Activity } from "lucide-react";
import type { DashboardData } from "@/lib/queries/dashboard";

const ENTITY_LABEL: Record<string, string> = {
  lead: "Lead",
  client: "Cliente",
  project: "Projeto",
  proposal: "Proposta",
  financial_transaction: "Financeiro",
};

const ENTITY_HREF: Record<string, (id: string) => string> = {
  lead: (id) => `/leads/${id}`,
  client: (id) => `/clients/${id}`,
  project: (id) => `/projects/${id}`,
  proposal: () => "/proposals",
  financial_transaction: () => "/finance",
};

const ACTION_LABEL: Record<string, string> = {
  created: "criado",
  stage_changed: "mudou de estágio",
  temperature_changed: "mudou de temperatura",
  contact_logged: "recebeu um contato",
  status_changed: "mudou de status",
};

export function RecentActivity({ logs }: { logs: DashboardData["recentLogs"] }) {
  if (logs.length === 0) {
    return <EmptyState icon={Activity} title="Sem atividade ainda" />;
  }

  return (
    <div className="flex flex-col">
      {logs.map((log) => (
        <Link
          key={log.id}
          href={ENTITY_HREF[log.entity_type]?.(log.entity_id) ?? "/"}
          className="flex items-center justify-between gap-2 border-b border-border px-4 py-2 text-sm last:border-0 hover:bg-accent/50"
        >
          <span className="truncate text-foreground">
            <span className="text-text-subtle">{ENTITY_LABEL[log.entity_type] ?? log.entity_type}</span>{" "}
            {log.to_value ?? ""} {ACTION_LABEL[log.action] ?? log.action}
          </span>
          <RelativeTime iso={log.created_at} className="shrink-0 text-xs text-text-subtle" />
        </Link>
      ))}
    </div>
  );
}

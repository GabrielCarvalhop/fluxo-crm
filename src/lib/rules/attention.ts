import { differenceInCalendarDays, differenceInHours } from "date-fns";
import type { DashboardData } from "@/lib/queries/dashboard";
import { formatMoney } from "@/lib/utils/format";

export type Severity = "critical" | "warning" | "info";

export type AttentionItem = {
  id: string;
  severity: Severity;
  title: string;
  href: string;
};

const SEVERITY_WEIGHT: Record<Severity, number> = { critical: 0, warning: 1, info: 2 };

export function buildAttentionItems(data: DashboardData): AttentionItem[] {
  const now = new Date();
  const items: AttentionItem[] = [];

  // 1) Follow-up atrasado
  for (const f of data.followUps) {
    if (!f.due_at) continue;
    const days = differenceInCalendarDays(now, new Date(f.due_at));
    if (days <= 0) continue;
    const name = f.lead?.company_name ?? "Contato";
    items.push({
      id: `followup-${f.id}`,
      severity: "critical",
      title: `${name} com follow-up atrasado há ${days} dia${days > 1 ? "s" : ""}`,
      href: f.lead_id ? `/leads/${f.lead_id}` : "/follow-ups",
    });
  }

  // 2) Reunião hoje
  for (const m of data.meetings) {
    const start = new Date(m.starts_at);
    if (differenceInCalendarDays(start, now) !== 0) continue;
    const hoursUntil = differenceInHours(start, now);
    const name = m.lead?.company_name ?? m.client?.company_name ?? m.title;
    const time = start.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    items.push({
      id: `meeting-${m.id}`,
      severity: hoursUntil < 2 && hoursUntil >= 0 ? "critical" : "warning",
      title: `Reunião com ${name} hoje às ${time}`,
      href: m.lead_id ? `/leads/${m.lead_id}` : m.client_id ? `/clients/${m.client_id}` : "/agenda",
    });
  }

  // 3) Pagamento vencido
  for (const t of data.pendingTransactions) {
    if (!t.due_date) continue;
    const days = differenceInCalendarDays(now, new Date(t.due_date));
    if (days <= 0) continue;
    const name = t.client?.company_name ?? t.description;
    items.push({
      id: `transaction-${t.id}`,
      severity: "critical",
      title: `Pagamento de ${formatMoney(t.amount)} (${name}) está atrasado`,
      href: t.client_id ? `/clients/${t.client_id}` : "/finance",
    });
  }

  // 4) Proposta perto de vencer + 5) proposta parada
  for (const p of data.proposals) {
    const name = p.lead?.company_name ?? p.client?.company_name ?? p.title;
    const href = p.lead_id ? `/leads/${p.lead_id}` : p.client_id ? `/clients/${p.client_id}` : "/proposals";

    if (p.valid_until) {
      const daysToExpire = differenceInCalendarDays(new Date(p.valid_until), now);
      if (daysToExpire >= 0 && daysToExpire <= 2) {
        items.push({
          id: `proposal-expiring-${p.id}`,
          severity: "warning",
          title: daysToExpire === 0 ? `Proposta de ${name} vence hoje` : `Proposta de ${name} vence em ${daysToExpire} dia${daysToExpire > 1 ? "s" : ""}`,
          href,
        });
      }
    }

    if (p.status === "sent" && p.sent_at) {
      const daysSinceSent = differenceInCalendarDays(now, new Date(p.sent_at));
      if (daysSinceSent > 3) {
        items.push({
          id: `proposal-stalled-${p.id}`,
          severity: "warning",
          title: `Proposta de ${name} enviada há ${daysSinceSent} dias sem retorno`,
          href,
        });
      }
    }
  }

  // 6) Lead quente sem contato + 7) negociação parada
  for (const l of data.leads) {
    if (l.stage?.is_won || l.stage?.is_lost) continue;

    if (l.temperature === "hot") {
      const reference = l.last_contact_at ?? l.prospected_at;
      const days = differenceInCalendarDays(now, new Date(reference));
      if (days > 4) {
        items.push({
          id: `hot-lead-${l.id}`,
          severity: "warning",
          title: `${l.company_name} está quente e sem contato há ${days} dias`,
          href: `/leads/${l.id}`,
        });
      }
    }

    if (l.stage?.key === "negotiation") {
      const days = differenceInCalendarDays(now, new Date(l.stage_changed_at));
      if (days > 7) {
        items.push({
          id: `stalled-negotiation-${l.id}`,
          severity: "warning",
          title: `${l.company_name} parado em negociação há ${days} dias`,
          href: `/leads/${l.id}`,
        });
      }
    }
  }

  // 8) Projeto em revisão do cliente parado + 9) sem briefing
  for (const p of data.projects) {
    const name = p.client?.company_name ? `${p.name} (${p.client.company_name})` : p.name;

    if (p.status === "client_review") {
      const days = differenceInCalendarDays(now, new Date(p.updated_at));
      if (days > 5) {
        items.push({
          id: `project-review-${p.id}`,
          severity: "warning",
          title: `${name} aguardando revisão do cliente há ${days} dias`,
          href: `/projects/${p.id}`,
        });
      }
    }

    if (p.briefing_status === "not_sent") {
      const days = differenceInCalendarDays(now, new Date(p.created_at));
      if (days > 3) {
        items.push({
          id: `project-briefing-${p.id}`,
          severity: "warning",
          title: `${name} está sem briefing há ${days} dias`,
          href: `/projects/${p.id}`,
        });
      }
    }
  }

  // 10) Domínio vencendo
  for (const d of data.expiringDomains) {
    if (!d.expires_at) continue;
    const days = differenceInCalendarDays(new Date(d.expires_at), now);
    const projectName = d.project?.client?.company_name ?? d.domain_name;
    items.push({
      id: `domain-${d.id}`,
      severity: "info",
      title: days <= 0 ? `Domínio de ${projectName} venceu` : `Domínio de ${projectName} vence em ${days} dias`,
      href: `/projects/${d.project_id}`,
    });
  }

  // 11) Tarefa atrasada
  for (const t of data.overdueTasks) {
    if (!t.due_at) continue;
    items.push({
      id: `task-${t.id}`,
      severity: "warning",
      title: `Tarefa atrasada: ${t.title}`,
      href: t.lead_id ? `/leads/${t.lead_id}` : t.client_id ? `/clients/${t.client_id}` : t.project_id ? `/projects/${t.project_id}` : "/tasks",
    });
  }

  return items.sort((a, b) => SEVERITY_WEIGHT[a.severity] - SEVERITY_WEIGHT[b.severity]);
}

import { isToday } from "date-fns";
import type { DashboardData } from "@/lib/queries/dashboard";

export type DashboardMetrics = {
  activeLeads: number;
  hotLeads: number;
  followUpsToday: number;
  meetingsThisWeek: number;
  openProposalsCount: number;
  openProposalsValue: number;
  activeProjects: number;
  receivable: number;
  revenueThisMonth: number;
};

export function computeDashboardMetrics(data: DashboardData): DashboardMetrics {
  const activeLeads = data.leads.filter((l) => !l.stage?.is_won && !l.stage?.is_lost);

  return {
    activeLeads: activeLeads.length,
    hotLeads: activeLeads.filter((l) => l.temperature === "hot").length,
    followUpsToday: data.followUps.filter((f) => f.due_at && isToday(new Date(f.due_at))).length,
    meetingsThisWeek: data.meetings.length,
    openProposalsCount: data.proposals.length,
    openProposalsValue: data.proposals.reduce((sum, p) => sum + Number(p.value), 0),
    activeProjects: data.projects.length,
    receivable: data.pendingTransactions.filter((t) => t.kind === "income").reduce((sum, t) => sum + Number(t.amount), 0),
    revenueThisMonth: data.paidThisMonth.reduce((sum, t) => sum + Number(t.amount), 0),
  };
}

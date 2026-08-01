import { createClient } from "@/lib/supabase/server";

export async function getDashboardData() {
  const supabase = await createClient();
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const weekAhead = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const [
    leadsRes,
    followUpsRes,
    meetingsRes,
    proposalsRes,
    projectsRes,
    transactionsRes,
    paidThisMonthRes,
    domainsRes,
    tasksRes,
    logsRes,
    stagesRes,
  ] = await Promise.all([
    supabase
      .from("leads")
      .select("*, segment:segments(label), stage:pipeline_stages(key, label, color, is_won, is_lost, position)")
      .is("deleted_at", null),
    supabase.from("follow_ups").select("*, lead:leads(company_name, whatsapp)").eq("status", "pending"),
    supabase
      .from("meetings")
      .select("*, lead:leads(company_name), client:clients(company_name)")
      .gte("starts_at", now.toISOString().slice(0, 10))
      .lte("starts_at", weekAhead)
      .neq("status", "canceled")
      .order("starts_at"),
    supabase
      .from("proposals")
      .select("*, lead:leads(company_name), client:clients(company_name)")
      .in("status", ["draft", "sent", "viewed", "negotiation"])
      .is("deleted_at", null),
    supabase
      .from("projects")
      .select("*, client:clients(company_name)")
      .is("deleted_at", null)
      .not("status", "in", "(finished,post_sale)"),
    supabase.from("financial_transactions").select("*, client:clients(company_name)").eq("status", "pending").is("deleted_at", null),
    supabase
      .from("financial_transactions")
      .select("amount")
      .eq("kind", "income")
      .eq("status", "paid")
      .gte("paid_at", startOfMonth)
      .is("deleted_at", null),
    supabase.from("domains").select("*, project:projects(name, client:clients(company_name))").lte("expires_at", in30Days),
    supabase
      .from("tasks")
      .select("*, lead:leads(company_name), client:clients(company_name), project:projects(name)")
      .neq("status", "done")
      .lte("due_at", now.toISOString()),
    supabase.from("activity_logs").select("*").order("created_at", { ascending: false }).limit(15),
    supabase.from("pipeline_stages").select("*").eq("active", true).order("position"),
  ]);

  for (const res of [leadsRes, followUpsRes, meetingsRes, proposalsRes, projectsRes, transactionsRes, paidThisMonthRes, domainsRes, tasksRes, logsRes, stagesRes]) {
    if (res.error) throw res.error;
  }

  return {
    leads: leadsRes.data ?? [],
    followUps: followUpsRes.data ?? [],
    meetings: meetingsRes.data ?? [],
    proposals: proposalsRes.data ?? [],
    projects: projectsRes.data ?? [],
    pendingTransactions: transactionsRes.data ?? [],
    paidThisMonth: paidThisMonthRes.data ?? [],
    expiringDomains: domainsRes.data ?? [],
    overdueTasks: tasksRes.data ?? [],
    recentLogs: logsRes.data ?? [],
    stages: stagesRes.data ?? [],
  };
}

export type DashboardData = Awaited<ReturnType<typeof getDashboardData>>;

export async function getFunnelMetrics() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("v_funnel_metrics").select("*").single();
  if (error) throw error;
  return {
    prospected_count: data?.prospected_count ?? 0,
    responded_count: data?.responded_count ?? 0,
    meeting_count: data?.meeting_count ?? 0,
    proposal_count: data?.proposal_count ?? 0,
    won_count: data?.won_count ?? 0,
  };
}


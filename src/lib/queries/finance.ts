import { createClient } from "@/lib/supabase/server";

export async function getFinanceData() {
  const supabase = await createClient();
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [transactionsRes, leadsRes, projectsRes] = await Promise.all([
    supabase
      .from("v_financial_status")
      .select("*, client:clients(company_name), project:projects(name)")
      .order("due_date", { ascending: false }),
    supabase.from("leads").select("estimated_value, stage:pipeline_stages(is_won, is_lost)").is("deleted_at", null),
    supabase.from("projects").select("value, status").is("deleted_at", null),
  ]);

  if (transactionsRes.error) throw transactionsRes.error;
  if (leadsRes.error) throw leadsRes.error;
  if (projectsRes.error) throw projectsRes.error;

  const transactions = transactionsRes.data ?? [];
  const leads = leadsRes.data ?? [];
  const projects = projectsRes.data ?? [];

  const revenueThisMonth = transactions
    .filter((t) => t.kind === "income" && t.status === "paid" && t.paid_at && t.paid_at >= startOfMonth)
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const receivable = transactions
    .filter((t) => t.kind === "income" && t.status === "pending")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const potentialRevenue = leads
    .filter((l) => !l.stage?.is_won && !l.stage?.is_lost)
    .reduce((sum, l) => sum + (l.estimated_value ? Number(l.estimated_value) : 0), 0);

  const projectsWithValue = projects.filter((p) => p.value !== null);
  const averageTicket = projectsWithValue.length
    ? projectsWithValue.reduce((sum, p) => sum + Number(p.value), 0) / projectsWithValue.length
    : 0;

  const closedClientsThisMonth = projects.filter((p) => p.status !== "briefing_pending").length;

  return {
    transactions,
    indicators: { revenueThisMonth, receivable, potentialRevenue, averageTicket, closedClientsThisMonth },
  };
}

export type FinanceData = Awaited<ReturnType<typeof getFinanceData>>;

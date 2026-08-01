import { createClient } from "@/lib/supabase/server";
import { subMonths, startOfMonth, format } from "date-fns";
import { ptBR } from "date-fns/locale";

export async function getReportsData() {
  const supabase = await createClient();
  const sixMonthsAgo = startOfMonth(subMonths(new Date(), 5)).toISOString();

  const [leadsRes, transactionsRes] = await Promise.all([
    supabase
      .from("leads")
      .select("id, estimated_value, source:lead_sources(label), loss_reason:loss_reasons(label), stage:pipeline_stages(is_lost)")
      .is("deleted_at", null),
    supabase
      .from("financial_transactions")
      .select("amount, paid_at")
      .eq("kind", "income")
      .eq("status", "paid")
      .gte("paid_at", sixMonthsAgo)
      .is("deleted_at", null),
  ]);

  if (leadsRes.error) throw leadsRes.error;
  if (transactionsRes.error) throw transactionsRes.error;

  const leads = leadsRes.data ?? [];

  const bySource = new Map<string, number>();
  for (const l of leads) {
    const label = l.source?.label ?? "Sem origem";
    bySource.set(label, (bySource.get(label) ?? 0) + 1);
  }

  const byLossReason = new Map<string, number>();
  for (const l of leads) {
    if (!l.stage?.is_lost) continue;
    const label = l.loss_reason?.label ?? "Sem motivo registrado";
    byLossReason.set(label, (byLossReason.get(label) ?? 0) + 1);
  }

  const months: { month: string; label: string; total: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const monthDate = subMonths(new Date(), i);
    const key = format(monthDate, "yyyy-MM");
    months.push({ month: key, label: format(monthDate, "MMM", { locale: ptBR }), total: 0 });
  }
  for (const t of transactionsRes.data ?? []) {
    if (!t.paid_at) continue;
    const key = t.paid_at.slice(0, 7);
    const entry = months.find((m) => m.month === key);
    if (entry) entry.total += Number(t.amount);
  }

  return {
    bySource: Array.from(bySource.entries()).map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count),
    byLossReason: Array.from(byLossReason.entries()).map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count),
    monthlyRevenue: months,
  };
}

export type ReportsData = Awaited<ReturnType<typeof getReportsData>>;

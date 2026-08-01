import { createClient } from "@/lib/supabase/server";
import { isPast, isToday, isTomorrow, addDays } from "date-fns";
import type { FollowUpItem } from "@/components/shared/follow-up-row";

export type FollowUpBuckets = {
  overdue: FollowUpItem[];
  today: FollowUpItem[];
  tomorrow: FollowUpItem[];
  thisWeek: FollowUpItem[];
  noDate: FollowUpItem[];
};

export async function getFollowUpsBoard(): Promise<FollowUpBuckets> {
  const supabase = await createClient();

  const [followUpsRes, leadsRes] = await Promise.all([
    supabase
      .from("follow_ups")
      .select("*, lead:leads(id, company_name, whatsapp), client:clients(id, company_name, whatsapp)")
      .eq("status", "pending")
      .order("due_at")
      .limit(300),
    supabase
      .from("leads")
      .select("id, company_name, whatsapp, stage:pipeline_stages(is_won, is_lost)")
      .is("deleted_at", null)
      .limit(300),
  ]);

  if (followUpsRes.error) throw followUpsRes.error;
  if (leadsRes.error) throw leadsRes.error;

  const buckets: FollowUpBuckets = { overdue: [], today: [], tomorrow: [], thisWeek: [], noDate: [] };
  const leadIdsWithFollowUp = new Set<string>();

  const weekLimit = addDays(new Date(), 7);

  for (const f of followUpsRes.data ?? []) {
    if (f.lead_id) leadIdsWithFollowUp.add(f.lead_id);

    const entity = f.lead ?? f.client;
    if (!entity) continue;

    const item: FollowUpItem = {
      id: f.id,
      title: f.title,
      due_at: f.due_at,
      lead_id: f.lead_id,
      client_id: f.client_id,
      entityName: entity.company_name,
      entityHref: f.lead_id ? `/leads/${f.lead_id}` : `/clients/${f.client_id}`,
      whatsapp: entity.whatsapp,
    };

    const due = new Date(f.due_at);
    if (isPast(due) && !isToday(due)) buckets.overdue.push(item);
    else if (isToday(due)) buckets.today.push(item);
    else if (isTomorrow(due)) buckets.tomorrow.push(item);
    else if (due <= weekLimit) buckets.thisWeek.push(item);
  }

  for (const lead of leadsRes.data ?? []) {
    if (leadIdsWithFollowUp.has(lead.id)) continue;
    if (lead.stage?.is_won || lead.stage?.is_lost) continue;

    buckets.noDate.push({
      id: `lead-${lead.id}`,
      title: "Nenhuma próxima ação definida",
      due_at: "",
      lead_id: lead.id,
      client_id: null,
      entityName: lead.company_name,
      entityHref: `/leads/${lead.id}`,
      whatsapp: lead.whatsapp,
    });
  }

  return buckets;
}

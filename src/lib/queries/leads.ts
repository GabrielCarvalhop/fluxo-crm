import { createClient } from "@/lib/supabase/server";

const LEAD_CARD_SELECT = "*, segment:segments(label), source:lead_sources(label)";

export async function getPipelineBoard() {
  const supabase = await createClient();
  const [stagesRes, leadsRes] = await Promise.all([
    supabase.from("pipeline_stages").select("*").eq("active", true).order("position"),
    supabase.from("leads").select(LEAD_CARD_SELECT).is("deleted_at", null).order("position"),
  ]);

  if (stagesRes.error) throw stagesRes.error;
  if (leadsRes.error) throw leadsRes.error;

  return { stages: stagesRes.data ?? [], leads: leadsRes.data ?? [] };
}

export type LeadsListFilters = {
  q?: string;
  stageKey?: string;
  temperature?: string;
  segmentKey?: string;
};

export async function getLeadsList(filters: LeadsListFilters = {}) {
  const supabase = await createClient();

  let query = supabase
    .from("leads")
    .select(`${LEAD_CARD_SELECT}, stage:pipeline_stages(key, label, color)`)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (filters.q) query = query.ilike("company_name", `%${filters.q}%`);
  if (filters.temperature) query = query.eq("temperature", filters.temperature as never);

  const { data, error } = await query;
  if (error) throw error;

  let rows = data ?? [];
  if (filters.stageKey) rows = rows.filter((r) => r.stage?.key === filters.stageKey);
  if (filters.segmentKey) rows = rows.filter((r) => r.segment_id && r.segment?.label);

  return rows;
}

export async function getLeadDetail(id: string) {
  const supabase = await createClient();

  const [leadRes, contactsRes, notesRes, tagsRes, followUpsRes, meetingsRes, proposalsRes, logsRes] = await Promise.all([
    supabase
      .from("leads")
      .select(
        "*, segment:segments(id, label), source:lead_sources(id, label), stage:pipeline_stages(id, key, label, color), loss_reason:loss_reasons(label)"
      )
      .eq("id", id)
      .single(),
    supabase.from("lead_contacts").select("*").eq("lead_id", id).order("contacted_at", { ascending: false }),
    supabase.from("notes").select("*, author:profiles(full_name)").eq("lead_id", id).order("created_at", { ascending: false }),
    supabase.from("lead_tags").select("tag:tags(id, label, color)").eq("lead_id", id),
    supabase.from("follow_ups").select("*").eq("lead_id", id).order("due_at"),
    supabase.from("meetings").select("*").eq("lead_id", id).order("starts_at", { ascending: false }),
    supabase.from("proposals").select("*").eq("lead_id", id).is("deleted_at", null).order("created_at", { ascending: false }),
    supabase
      .from("activity_logs")
      .select("*")
      .eq("entity_type", "lead")
      .eq("entity_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (leadRes.error) throw leadRes.error;

  return {
    lead: leadRes.data,
    contacts: contactsRes.data ?? [],
    notes: notesRes.data ?? [],
    tags: (tagsRes.data ?? []).map((t) => t.tag).filter(Boolean),
    followUps: followUpsRes.data ?? [],
    meetings: meetingsRes.data ?? [],
    proposals: proposalsRes.data ?? [],
    logs: logsRes.data ?? [],
  };
}

export type LeadDetail = Awaited<ReturnType<typeof getLeadDetail>>;

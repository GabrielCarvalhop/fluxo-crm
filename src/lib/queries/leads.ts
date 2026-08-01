import { createClient } from "@/lib/supabase/server";

const LEAD_CARD_SELECT = "*, segment:segments(label), source:lead_sources(label)";

/** Teto de segurança nas listas — evita puxar a base inteira quando ela crescer. */
const LIST_LIMIT = 300;
/** Histórico exibido na página de detalhe (timeline já é longa o suficiente). */
const DETAIL_HISTORY_LIMIT = 50;

export async function getPipelineBoard() {
  const supabase = await createClient();
  const [stagesRes, leadsRes] = await Promise.all([
    supabase.from("pipeline_stages").select("*").eq("active", true).order("position"),
    supabase.from("leads").select(LEAD_CARD_SELECT).is("deleted_at", null).order("position").limit(LIST_LIMIT),
  ]);

  if (stagesRes.error) throw stagesRes.error;
  if (leadsRes.error) throw leadsRes.error;

  return { stages: stagesRes.data ?? [], leads: leadsRes.data ?? [] };
}

export type LeadsListFilters = {
  q?: string;
  stageKey?: string;
  temperature?: string;
};

export async function getLeadsList(filters: LeadsListFilters = {}) {
  const supabase = await createClient();

  // !inner + eq no campo embutido faz o filtro de estágio acontecer no
  // Postgres. Antes isso era feito em JS depois de baixar todos os leads.
  const stageJoin = filters.stageKey ? "stage:pipeline_stages!inner(key, label, color)" : "stage:pipeline_stages(key, label, color)";

  let query = supabase
    .from("leads")
    .select(`${LEAD_CARD_SELECT}, ${stageJoin}`)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(LIST_LIMIT);

  if (filters.q) query = query.ilike("company_name", `%${filters.q}%`);
  if (filters.temperature) query = query.eq("temperature", filters.temperature as never);
  if (filters.stageKey) query = query.eq("stage.key", filters.stageKey);

  const { data, error } = await query;
  if (error) throw error;

  return data ?? [];
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
    supabase
      .from("lead_contacts")
      .select("*")
      .eq("lead_id", id)
      .order("contacted_at", { ascending: false })
      .limit(DETAIL_HISTORY_LIMIT),
    supabase
      .from("notes")
      .select("*, author:profiles(full_name)")
      .eq("lead_id", id)
      .order("created_at", { ascending: false })
      .limit(DETAIL_HISTORY_LIMIT),
    supabase.from("lead_tags").select("tag:tags(id, label, color)").eq("lead_id", id),
    supabase.from("follow_ups").select("*").eq("lead_id", id).order("due_at").limit(DETAIL_HISTORY_LIMIT),
    supabase
      .from("meetings")
      .select("*")
      .eq("lead_id", id)
      .order("starts_at", { ascending: false })
      .limit(DETAIL_HISTORY_LIMIT),
    supabase
      .from("proposals")
      .select("*")
      .eq("lead_id", id)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(DETAIL_HISTORY_LIMIT),
    supabase
      .from("activity_logs")
      .select("*")
      .eq("entity_type", "lead")
      .eq("entity_id", id)
      .order("created_at", { ascending: false })
      .limit(DETAIL_HISTORY_LIMIT),
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

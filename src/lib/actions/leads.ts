"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  createLeadSchema,
  updateLeadSchema,
  moveLeadStageSchema,
  logContactSchema,
  addNoteSchema,
  markLostSchema,
  setTemperatureSchema,
} from "@/lib/validations/leads";

export type ActionState = { error?: string; success?: boolean };

function revalidateLeadPaths(id?: string) {
  revalidatePath("/pipeline");
  revalidatePath("/leads");
  revalidatePath("/follow-ups");
  revalidatePath("/");
  if (id) revalidatePath(`/leads/${id}`);
}

export async function createLead(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = createLeadSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };

  const supabase = await createClient();
  const { data: firstStage } = await supabase
    .from("pipeline_stages")
    .select("id")
    .eq("key", "prospected")
    .single();

  if (!firstStage) return { error: "Estágio inicial do pipeline não encontrado" };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("leads").insert({
    company_name: parsed.data.company_name,
    contact_name: parsed.data.contact_name ?? null,
    whatsapp: parsed.data.whatsapp ?? null,
    city: parsed.data.city ?? null,
    segment_id: parsed.data.segment_id ?? null,
    source_id: parsed.data.source_id ?? null,
    stage_id: firstStage.id,
    owner_id: user?.id ?? null,
  });

  if (error) return { error: error.message };

  revalidateLeadPaths();
  return { success: true };
}

export async function updateLead(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const raw = Object.fromEntries(formData);
  const parsed = updateLeadSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };

  const supabase = await createClient();
  const { id, ...rest } = parsed.data;
  const { error } = await supabase
    .from("leads")
    .update({
      ...rest,
      segment_id: rest.segment_id ?? null,
      source_id: rest.source_id ?? null,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidateLeadPaths(id);
  return { success: true };
}

export async function moveLeadStage(input: { id: string; stage_id: string; position: number }) {
  const parsed = moveLeadStageSchema.safeParse(input);
  if (!parsed.success) throw new Error("Dados inválidos");

  const supabase = await createClient();
  const { error } = await supabase
    .from("leads")
    .update({ stage_id: parsed.data.stage_id, position: parsed.data.position })
    .eq("id", parsed.data.id);

  if (error) throw new Error(error.message);
  revalidateLeadPaths(parsed.data.id);
}

export async function logContact(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = logContactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  if (!parsed.data.lead_id && !parsed.data.client_id) return { error: "Contato precisa de um lead ou cliente" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("lead_contacts").insert({
    lead_id: parsed.data.lead_id ?? null,
    client_id: parsed.data.client_id ?? null,
    user_id: user?.id ?? null,
    type: parsed.data.type,
    summary: parsed.data.summary ?? null,
    outcome: parsed.data.outcome ?? null,
    next_action: parsed.data.next_action ?? null,
    next_action_at: parsed.data.next_action_at ?? null,
  });

  if (error) return { error: error.message };

  revalidateLeadPaths(parsed.data.lead_id);
  if (parsed.data.client_id) revalidatePath(`/clients/${parsed.data.client_id}`);
  return { success: true };
}

export async function addNote(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = addNoteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("notes").insert({
    lead_id: parsed.data.lead_id ?? null,
    client_id: parsed.data.client_id ?? null,
    project_id: parsed.data.project_id ?? null,
    author_id: user?.id ?? null,
    body: parsed.data.body,
  });

  if (error) return { error: error.message };

  if (parsed.data.lead_id) revalidatePath(`/leads/${parsed.data.lead_id}`);
  if (parsed.data.client_id) revalidatePath(`/clients/${parsed.data.client_id}`);
  if (parsed.data.project_id) revalidatePath(`/projects/${parsed.data.project_id}`);
  return { success: true };
}

export async function markLeadLost(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = markLostSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Selecione um motivo" };

  const supabase = await createClient();
  const { data: lostStage } = await supabase.from("pipeline_stages").select("id").eq("key", "lost").single();
  if (!lostStage) return { error: "Estágio 'perdido' não encontrado" };

  const { error } = await supabase
    .from("leads")
    .update({
      stage_id: lostStage.id,
      loss_reason_id: parsed.data.loss_reason_id,
      loss_notes: parsed.data.loss_notes ?? null,
    })
    .eq("id", parsed.data.id);

  if (error) return { error: error.message };

  revalidateLeadPaths(parsed.data.id);
  return { success: true };
}

export async function setLeadTemperature(input: { id: string; temperature: "hot" | "warm" | "cold" | "none" }) {
  const parsed = setTemperatureSchema.safeParse(input);
  if (!parsed.success) throw new Error("Dados inválidos");

  const supabase = await createClient();
  const { error } = await supabase.from("leads").update({ temperature: parsed.data.temperature }).eq("id", parsed.data.id);
  if (error) throw new Error(error.message);

  revalidateLeadPaths(parsed.data.id);
}

export async function toggleLeadTag(leadId: string, tagId: string, add: boolean) {
  const supabase = await createClient();
  if (add) {
    const { error } = await supabase.from("lead_tags").insert({ lead_id: leadId, tag_id: tagId });
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("lead_tags").delete().eq("lead_id", leadId).eq("tag_id", tagId);
    if (error) throw new Error(error.message);
  }
  revalidatePath(`/leads/${leadId}`);
}

export async function convertLeadToClient(leadId: string) {
  const supabase = await createClient();

  const { data: lead, error: leadError } = await supabase.from("leads").select("*").eq("id", leadId).single();
  if (leadError || !lead) throw new Error(leadError?.message ?? "Lead não encontrado");

  const { data: wonStage } = await supabase.from("pipeline_stages").select("id").eq("key", "won").single();

  const { data: client, error: clientError } = await supabase
    .from("clients")
    .insert({
      lead_id: lead.id,
      company_name: lead.company_name,
      contact_name: lead.contact_name,
      whatsapp: lead.whatsapp,
      email: lead.email,
      instagram: lead.instagram,
      city: lead.city,
      state: lead.state,
      website_url: lead.website_url,
    })
    .select("id")
    .single();

  if (clientError || !client) throw new Error(clientError?.message ?? "Erro ao criar cliente");

  const { error: updateError } = await supabase
    .from("leads")
    .update({
      converted_client_id: client.id,
      converted_at: new Date().toISOString(),
      stage_id: wonStage?.id ?? lead.stage_id,
    })
    .eq("id", lead.id);

  if (updateError) throw new Error(updateError.message);

  revalidateLeadPaths(leadId);
  revalidatePath("/clients");
  redirect(`/clients/${client.id}`);
}

"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  addSimpleOptionSchema,
  toggleSimpleOptionSchema,
  addTagSchema,
  upsertMessageTemplateSchema,
  addPipelineStageSchema,
  updatePipelineStageSchema,
  addChecklistItemSchema,
  updateProfileSchema,
} from "@/lib/validations/settings";
import type { ActionState } from "./leads";

function slugify(label: string) {
  return label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export async function addSimpleOption(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = addSimpleOptionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };

  const supabase = await createClient();
  const { count } = await supabase.from(parsed.data.table).select("id", { count: "exact", head: true });

  const { error } = await supabase.from(parsed.data.table).insert({
    key: `${slugify(parsed.data.label)}_${Date.now().toString(36)}`,
    label: parsed.data.label,
    position: (count ?? 0) + 1,
  });

  if (error) return { error: error.message };
  revalidatePath("/settings");
  return { success: true };
}

export async function toggleSimpleOption(input: { table: "lead_sources" | "segments" | "loss_reasons"; id: string; active: boolean }) {
  const parsed = toggleSimpleOptionSchema.safeParse(input);
  if (!parsed.success) throw new Error("Dados inválidos");

  const supabase = await createClient();
  const { error } = await supabase.from(parsed.data.table).update({ active: parsed.data.active }).eq("id", parsed.data.id);
  if (error) throw new Error(error.message);
  revalidatePath("/settings");
}

export async function addTag(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = addTagSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };

  const supabase = await createClient();
  const { error } = await supabase.from("tags").insert({ label: parsed.data.label });
  if (error) return { error: error.message };

  revalidatePath("/settings");
  return { success: true };
}

export async function deleteTag(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("tags").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/settings");
}

export async function upsertMessageTemplate(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = upsertMessageTemplateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };

  const supabase = await createClient();
  const { id, ...rest } = parsed.data;

  const { error } = id
    ? await supabase.from("message_templates").update({ title: rest.title, body: rest.body }).eq("id", id)
    : await supabase.from("message_templates").insert(rest);

  if (error) return { error: error.message };
  revalidatePath("/settings");
  return { success: true };
}

export async function addPipelineStage(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const raw = Object.fromEntries(formData);
  const parsed = addPipelineStageSchema.safeParse({ ...raw, key: `${slugify(String(raw.label))}_${Date.now().toString(36)}` });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };

  const supabase = await createClient();
  const { count } = await supabase.from("pipeline_stages").select("id", { count: "exact", head: true });

  const { error } = await supabase.from("pipeline_stages").insert({
    key: parsed.data.key,
    label: parsed.data.label,
    color: parsed.data.color,
    position: (count ?? 0) + 1,
  });

  if (error) return { error: error.message };
  revalidatePath("/settings");
  revalidatePath("/pipeline");
  return { success: true };
}

export async function updatePipelineStage(input: { id: string; label?: string; color?: string; active?: boolean }) {
  const parsed = updatePipelineStageSchema.safeParse(input);
  if (!parsed.success) throw new Error("Dados inválidos");

  const supabase = await createClient();
  const { id, ...rest } = parsed.data;
  const { error } = await supabase.from("pipeline_stages").update(rest).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/settings");
  revalidatePath("/pipeline");
}

export async function addChecklistItem(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = addChecklistItemSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };

  const supabase = await createClient();
  const { count } = await supabase
    .from("checklist_template_items")
    .select("id", { count: "exact", head: true })
    .eq("template_id", parsed.data.template_id)
    .eq("group_label", parsed.data.group_label);

  const { error } = await supabase.from("checklist_template_items").insert({
    template_id: parsed.data.template_id,
    group_label: parsed.data.group_label,
    label: parsed.data.label,
    position: (count ?? 0) + 1,
  });

  if (error) return { error: error.message };
  revalidatePath("/settings");
  return { success: true };
}

export async function updateProfile(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = updateProfileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sessão inválida" };

  const { error } = await supabase.from("profiles").update({ full_name: parsed.data.full_name }).eq("id", user.id);
  if (error) return { error: error.message };

  revalidatePath("/settings");
  revalidatePath("/");
  return { success: true };
}

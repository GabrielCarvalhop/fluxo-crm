"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  createProjectSchema,
  updateProjectStatusSchema,
  toggleChecklistItemSchema,
  updateBriefingSchema,
  updateDomainSchema,
} from "@/lib/validations/projects";
import type { ActionState } from "./leads";

function revalidateProjectPaths(id: string, clientId?: string | null) {
  revalidatePath("/projects");
  revalidatePath("/");
  revalidatePath(`/projects/${id}`);
  if (clientId) revalidatePath(`/clients/${clientId}`);
}

export async function createProject(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = createProjectSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };

  const supabase = await createClient();

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .insert({
      client_id: parsed.data.client_id,
      name: parsed.data.name,
      type: parsed.data.type,
      value: parsed.data.value ?? null,
      due_date: parsed.data.due_date ?? null,
    })
    .select("id")
    .single();

  if (projectError || !project) return { error: projectError?.message ?? "Erro ao criar projeto" };

  const { data: template } = await supabase
    .from("checklist_templates")
    .select("id, checklist_template_items(group_label, label, position)")
    .eq("is_default", true)
    .maybeSingle();

  if (template) {
    const groupLabels = Array.from(new Set(template.checklist_template_items.map((i) => i.group_label)));
    const groupIdByLabel: Record<string, string> = {};

    for (const [index, label] of groupLabels.entries()) {
      const { data: group } = await supabase
        .from("project_checklist_groups")
        .insert({ project_id: project.id, label, position: index })
        .select("id")
        .single();
      if (group) groupIdByLabel[label] = group.id;
    }

    const items = template.checklist_template_items.map((i) => ({
      group_id: groupIdByLabel[i.group_label],
      label: i.label,
      position: i.position,
    }));
    if (items.length) await supabase.from("project_checklist_items").insert(items);
  }

  revalidateProjectPaths(project.id, parsed.data.client_id);
  redirect(`/projects/${project.id}`);
}

export async function updateProjectStatus(input: { id: string; status: string }) {
  const parsed = updateProjectStatusSchema.safeParse(input);
  if (!parsed.success) throw new Error("Dados inválidos");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.id)
    .select("client_id")
    .single();

  if (error) throw new Error(error.message);
  revalidateProjectPaths(parsed.data.id, data?.client_id);
}

export async function toggleChecklistItem(input: { id: string; done: boolean; projectId: string; clientId?: string | null }) {
  const parsed = toggleChecklistItemSchema.safeParse({ id: input.id, done: input.done });
  if (!parsed.success) throw new Error("Dados inválidos");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("project_checklist_items")
    .update({
      done: parsed.data.done,
      done_at: parsed.data.done ? new Date().toISOString() : null,
      done_by: parsed.data.done ? (user?.id ?? null) : null,
    })
    .eq("id", parsed.data.id);

  if (error) throw new Error(error.message);
  revalidateProjectPaths(input.projectId, input.clientId);
}

export async function updateBriefing(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = updateBriefingSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };

  const { project_id, ...rest } = parsed.data;
  const supabase = await createClient();

  const hasAnyContent = Object.values(rest).some(Boolean);

  const { error } = await supabase.from("project_briefings").upsert(
    { project_id, ...rest, answered_at: hasAnyContent ? new Date().toISOString() : null },
    { onConflict: "project_id" }
  );
  if (error) return { error: error.message };

  await supabase
    .from("projects")
    .update({ briefing_status: hasAnyContent ? "complete" : "sent" })
    .eq("id", project_id);

  revalidateProjectPaths(project_id);
  return { success: true };
}

export async function updateDomain(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = updateDomainSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };

  const { project_id, ...rest } = parsed.data;
  const supabase = await createClient();

  const { data: existing } = await supabase.from("domains").select("id").eq("project_id", project_id).maybeSingle();

  const payload = {
    domain_name: rest.domain_name,
    registrar: rest.registrar ?? null,
    registered_at: rest.registered_at ?? null,
    expires_at: rest.expires_at ?? null,
    cost: rest.cost ?? null,
    paid_by: rest.paid_by ?? null,
    hosting: rest.hosting ?? null,
    dns_configured: rest.dns_configured ?? false,
    final_url: rest.final_url ?? null,
  };

  const { error } = existing
    ? await supabase.from("domains").update(payload).eq("id", existing.id)
    : await supabase.from("domains").insert({ project_id, ...payload });

  if (error) return { error: error.message };

  revalidateProjectPaths(project_id);
  return { success: true };
}

"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createTaskSchema, updateTaskStatusSchema } from "@/lib/validations/tasks";
import type { ActionState } from "./leads";

function revalidateTaskPaths(ids: { lead_id?: string | null; client_id?: string | null; project_id?: string | null }) {
  revalidatePath("/tasks");
  revalidatePath("/");
  if (ids.lead_id) revalidatePath(`/leads/${ids.lead_id}`);
  if (ids.client_id) revalidatePath(`/clients/${ids.client_id}`);
  if (ids.project_id) revalidatePath(`/projects/${ids.project_id}`);
}

export async function createTask(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = createTaskSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("tasks").insert({
    lead_id: parsed.data.lead_id ?? null,
    client_id: parsed.data.client_id ?? null,
    project_id: parsed.data.project_id ?? null,
    title: parsed.data.title,
    description: parsed.data.description ?? null,
    priority: parsed.data.priority,
    due_at: parsed.data.due_at ?? null,
    assignee_id: user?.id ?? null,
  });

  if (error) return { error: error.message };

  revalidateTaskPaths(parsed.data);
  return { success: true };
}

export async function updateTaskStatus(input: { id: string; status: "pending" | "in_progress" | "done" }) {
  const parsed = updateTaskStatusSchema.safeParse(input);
  if (!parsed.success) throw new Error("Dados inválidos");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tasks")
    .update({ status: parsed.data.status, done_at: parsed.data.status === "done" ? new Date().toISOString() : null })
    .eq("id", parsed.data.id)
    .select("lead_id, client_id, project_id")
    .single();

  if (error) throw new Error(error.message);
  if (data) revalidateTaskPaths(data);
}

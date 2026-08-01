"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createMeetingSchema, updateMeetingStatusSchema } from "@/lib/validations/meetings";
import type { ActionState } from "./leads";

function revalidateAgendaPaths(ids: { lead_id?: string | null; client_id?: string | null; project_id?: string | null }) {
  revalidatePath("/agenda");
  revalidatePath("/");
  if (ids.lead_id) revalidatePath(`/leads/${ids.lead_id}`);
  if (ids.client_id) revalidatePath(`/clients/${ids.client_id}`);
  if (ids.project_id) revalidatePath(`/projects/${ids.project_id}`);
}

export async function createMeeting(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = createMeetingSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };

  const { date, time, ...rest } = parsed.data;
  const startsAt = new Date(`${date}T${time}:00`).toISOString();

  const supabase = await createClient();
  const { error } = await supabase.from("meetings").insert({
    title: rest.title,
    lead_id: rest.lead_id ?? null,
    client_id: rest.client_id ?? null,
    project_id: rest.project_id ?? null,
    starts_at: startsAt,
    format: rest.format,
    location: rest.location ?? null,
    link: rest.link ?? null,
    objective: rest.objective ?? null,
    type: "meeting",
  });

  if (error) return { error: error.message };

  revalidateAgendaPaths(parsed.data);
  return { success: true };
}

export async function updateMeetingStatus(input: { id: string; status: "scheduled" | "done" | "canceled" | "no_show" }) {
  const parsed = updateMeetingStatusSchema.safeParse(input);
  if (!parsed.success) throw new Error("Dados inválidos");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("meetings")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.id)
    .select("lead_id, client_id, project_id")
    .single();

  if (error) throw new Error(error.message);
  if (data) revalidateAgendaPaths(data);
}

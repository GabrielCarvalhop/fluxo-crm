"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function revalidateFollowUpPaths(ids: { lead_id?: string | null; client_id?: string | null }) {
  revalidatePath("/follow-ups");
  revalidatePath("/pipeline");
  revalidatePath("/leads");
  revalidatePath("/");
  if (ids.lead_id) revalidatePath(`/leads/${ids.lead_id}`);
  if (ids.client_id) revalidatePath(`/clients/${ids.client_id}`);
}

export async function completeFollowUp(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("follow_ups")
    .update({ status: "done", done_at: new Date().toISOString() })
    .eq("id", id)
    .select("lead_id, client_id")
    .single();

  if (error) throw new Error(error.message);
  if (data) revalidateFollowUpPaths(data);
}

export async function snoozeFollowUp(id: string, newDueAt: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("follow_ups")
    .update({ due_at: newDueAt, snoozed_from: new Date().toISOString() })
    .eq("id", id)
    .select("lead_id, client_id")
    .single();

  if (error) throw new Error(error.message);
  if (data) revalidateFollowUpPaths(data);
}

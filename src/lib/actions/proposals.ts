"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createProposalSchema, updateProposalStatusSchema } from "@/lib/validations/proposals";
import type { ActionState } from "./leads";
import type { Database } from "@/types/database";

type ProposalUpdate = Database["public"]["Tables"]["proposals"]["Update"];

function revalidateProposalPaths(ids: { lead_id?: string | null; client_id?: string | null; project_id?: string | null }) {
  revalidatePath("/proposals");
  revalidatePath("/");
  if (ids.lead_id) revalidatePath(`/leads/${ids.lead_id}`);
  if (ids.client_id) revalidatePath(`/clients/${ids.client_id}`);
  if (ids.project_id) revalidatePath(`/projects/${ids.project_id}`);
}

export async function createProposal(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = createProposalSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };

  const supabase = await createClient();
  const { error } = await supabase.from("proposals").insert({
    lead_id: parsed.data.lead_id ?? null,
    client_id: parsed.data.client_id ?? null,
    project_id: parsed.data.project_id ?? null,
    title: parsed.data.title,
    value: parsed.data.value,
    valid_until: parsed.data.valid_until ?? null,
    payment_terms: parsed.data.payment_terms ?? null,
    payment_method: parsed.data.payment_method ?? null,
    status: "draft",
  });

  if (error) return { error: error.message };

  revalidateProposalPaths(parsed.data);
  return { success: true };
}

export async function updateProposalStatus(input: {
  id: string;
  status: "draft" | "sent" | "viewed" | "negotiation" | "accepted" | "rejected" | "expired";
  rejected_reason_id?: string;
}) {
  const parsed = updateProposalStatusSchema.safeParse(input);
  if (!parsed.success) throw new Error("Dados inválidos");

  const supabase = await createClient();
  const patch: ProposalUpdate = { status: parsed.data.status };
  if (parsed.data.status === "sent") patch.sent_at = new Date().toISOString();
  if (parsed.data.status === "rejected" && parsed.data.rejected_reason_id) {
    patch.rejected_reason_id = parsed.data.rejected_reason_id;
  }

  const { data, error } = await supabase
    .from("proposals")
    .update(patch)
    .eq("id", parsed.data.id)
    .select("lead_id, client_id, project_id")
    .single();

  if (error) throw new Error(error.message);
  if (data) revalidateProposalPaths(data);
}

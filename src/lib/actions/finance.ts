"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createTransactionSchema, updateTransactionStatusSchema } from "@/lib/validations/finance";
import type { ActionState } from "./leads";

function revalidateFinancePaths(ids: { client_id?: string | null; project_id?: string | null }) {
  revalidatePath("/finance");
  revalidatePath("/");
  if (ids.client_id) revalidatePath(`/clients/${ids.client_id}`);
  if (ids.project_id) revalidatePath(`/projects/${ids.project_id}`);
}

export async function createTransaction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = createTransactionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };

  const supabase = await createClient();
  const { error } = await supabase.from("financial_transactions").insert({
    client_id: parsed.data.client_id ?? null,
    project_id: parsed.data.project_id ?? null,
    description: parsed.data.description,
    amount: parsed.data.amount,
    kind: parsed.data.kind,
    expense_category: parsed.data.kind === "expense" ? (parsed.data.expense_category ?? "other") : null,
    due_date: parsed.data.due_date ?? null,
    method: parsed.data.method ?? null,
    status: "pending",
  });

  if (error) return { error: error.message };

  revalidateFinancePaths(parsed.data);
  return { success: true };
}

export async function updateTransactionStatus(input: { id: string; status: "paid" | "pending" | "canceled" }) {
  const parsed = updateTransactionStatusSchema.safeParse(input);
  if (!parsed.success) throw new Error("Dados inválidos");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("financial_transactions")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.id)
    .select("client_id, project_id")
    .single();

  if (error) throw new Error(error.message);
  if (data) revalidateFinancePaths(data);
}

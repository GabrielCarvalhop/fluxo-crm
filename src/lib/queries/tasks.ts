import { createClient } from "@/lib/supabase/server";

export async function getTasksList() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tasks")
    .select("*, lead:leads(company_name), client:clients(company_name), project:projects(name)")
    .order("due_at", { ascending: true, nullsFirst: false });

  if (error) throw error;
  return data ?? [];
}

export type TasksList = Awaited<ReturnType<typeof getTasksList>>;

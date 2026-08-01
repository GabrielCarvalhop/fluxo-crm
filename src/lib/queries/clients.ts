import { createClient } from "@/lib/supabase/server";

export async function getClientsList(q?: string) {
  const supabase = await createClient();
  let query = supabase
    .from("clients")
    .select("*, projects(id, name, status)")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(300);

  if (q) query = query.ilike("company_name", `%${q}%`);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getClientDetail(id: string) {
  const supabase = await createClient();

  const [clientRes, projectsRes, contactsRes, notesRes, meetingsRes, transactionsRes, logsRes] = await Promise.all([
    supabase.from("clients").select("*").eq("id", id).single(),
    supabase.from("projects").select("*").eq("client_id", id).is("deleted_at", null).order("created_at", { ascending: false }).limit(100),
    supabase.from("lead_contacts").select("*").eq("client_id", id).order("contacted_at", { ascending: false }).limit(50),
    supabase.from("notes").select("*, author:profiles(full_name)").eq("client_id", id).order("created_at", { ascending: false }).limit(50),
    supabase.from("meetings").select("*").eq("client_id", id).order("starts_at", { ascending: false }).limit(50),
    supabase.from("financial_transactions").select("*").eq("client_id", id).is("deleted_at", null).order("due_date", { ascending: false }).limit(100),
    supabase.from("activity_logs").select("*").eq("entity_type", "client").eq("entity_id", id).order("created_at", { ascending: false }).limit(50),
  ]);

  if (clientRes.error) throw clientRes.error;

  return {
    client: clientRes.data,
    projects: projectsRes.data ?? [],
    contacts: contactsRes.data ?? [],
    notes: notesRes.data ?? [],
    meetings: meetingsRes.data ?? [],
    transactions: transactionsRes.data ?? [],
    logs: logsRes.data ?? [],
  };
}

export type ClientDetail = Awaited<ReturnType<typeof getClientDetail>>;

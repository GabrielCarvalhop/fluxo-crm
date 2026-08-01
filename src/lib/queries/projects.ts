import { createClient } from "@/lib/supabase/server";

export async function getProjectsList() {
  const supabase = await createClient();
  const [projectsRes, progressRes] = await Promise.all([
    supabase
      .from("projects")
      .select("*, client:clients(company_name)")
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
    supabase.from("v_project_progress").select("project_id, progress_pct"),
  ]);

  if (projectsRes.error) throw projectsRes.error;
  if (progressRes.error) throw progressRes.error;

  const progressByProject = new Map((progressRes.data ?? []).map((p) => [p.project_id, p.progress_pct]));

  return (projectsRes.data ?? []).map((p) => ({ ...p, progressPct: progressByProject.get(p.id) ?? 0 }));
}

export async function getProjectDetail(id: string) {
  const supabase = await createClient();

  const [projectRes, groupsRes, briefingRes, domainRes, transactionsRes, notesRes, tasksRes, progressRes] = await Promise.all([
    supabase.from("projects").select("*, client:clients(id, company_name, whatsapp, email)").eq("id", id).single(),
    supabase
      .from("project_checklist_groups")
      .select("*, items:project_checklist_items(*)")
      .eq("project_id", id)
      .order("position"),
    supabase.from("project_briefings").select("*").eq("project_id", id).maybeSingle(),
    supabase.from("domains").select("*").eq("project_id", id).maybeSingle(),
    supabase.from("financial_transactions").select("*").eq("project_id", id).is("deleted_at", null).order("due_date", { ascending: false }),
    supabase.from("notes").select("*, author:profiles(full_name)").eq("project_id", id).order("created_at", { ascending: false }),
    supabase.from("tasks").select("*").eq("project_id", id).order("due_at"),
    supabase.from("v_project_progress").select("*").eq("project_id", id).maybeSingle(),
  ]);

  if (projectRes.error) throw projectRes.error;

  const groups = (groupsRes.data ?? []).map((g) => ({
    ...g,
    items: (g.items ?? []).sort((a, b) => a.position - b.position),
  }));

  return {
    project: projectRes.data,
    checklistGroups: groups,
    briefing: briefingRes.data,
    domain: domainRes.data,
    transactions: transactionsRes.data ?? [],
    notes: notesRes.data ?? [],
    tasks: tasksRes.data ?? [],
    progress: progressRes.data,
  };
}

export type ProjectDetail = Awaited<ReturnType<typeof getProjectDetail>>;

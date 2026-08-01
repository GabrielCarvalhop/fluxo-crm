import { createClient } from "@/lib/supabase/server";

export async function getSettingsData() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [profileRes, tagsRes, sourcesRes, segmentsRes, lossReasonsRes, templatesRes, stagesRes, checklistRes] = await Promise.all([
    user ? supabase.from("profiles").select("*").eq("id", user.id).single() : Promise.resolve({ data: null }),
    supabase.from("tags").select("*").order("label"),
    supabase.from("lead_sources").select("*").order("position"),
    supabase.from("segments").select("*").order("position"),
    supabase.from("loss_reasons").select("*").order("position"),
    supabase.from("message_templates").select("*").order("position"),
    supabase.from("pipeline_stages").select("*").order("position"),
    supabase
      .from("checklist_templates")
      .select("*, items:checklist_template_items(*)")
      .eq("is_default", true)
      .maybeSingle(),
  ]);

  return {
    profile: profileRes.data,
    tags: tagsRes.data ?? [],
    sources: sourcesRes.data ?? [],
    segments: segmentsRes.data ?? [],
    lossReasons: lossReasonsRes.data ?? [],
    templates: templatesRes.data ?? [],
    stages: stagesRes.data ?? [],
    checklistTemplate: checklistRes.data ?? null,
  };
}

export type SettingsData = Awaited<ReturnType<typeof getSettingsData>>;

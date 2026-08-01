import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

/** Dados de configuração usados em formulários e filtros — memorizado por request. */
export const getReferenceData = cache(async () => {
  const supabase = await createClient();
  const [stages, segments, sources, lossReasons, tags, templates] = await Promise.all([
    supabase.from("pipeline_stages").select("*").eq("active", true).order("position"),
    supabase.from("segments").select("*").eq("active", true).order("position"),
    supabase.from("lead_sources").select("*").eq("active", true).order("position"),
    supabase.from("loss_reasons").select("*").eq("active", true).order("position"),
    supabase.from("tags").select("*").order("label"),
    supabase.from("message_templates").select("*").eq("active", true).order("position"),
  ]);

  return {
    stages: stages.data ?? [],
    segments: segments.data ?? [],
    sources: sources.data ?? [],
    lossReasons: lossReasons.data ?? [],
    tags: tags.data ?? [],
    templates: templates.data ?? [],
  };
});

export const getCurrentProfile = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  return data;
});

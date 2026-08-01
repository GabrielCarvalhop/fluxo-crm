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

/**
 * getUser() faz uma chamada de rede ao Auth do Supabase. Como o layout e o
 * menu de usuário (em Suspense) precisam do mesmo dado, o cache() do React
 * garante uma única chamada por request.
 */
export const getAuthUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export const getCurrentProfile = cache(async () => {
  const user = await getAuthUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  return data;
});

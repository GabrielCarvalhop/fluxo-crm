import { createClient } from "@/lib/supabase/server";

export async function getAgendaEvents(from: string, to: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("v_agenda_events")
    .select("*")
    .gte("starts_at", from)
    .lte("starts_at", to)
    .order("starts_at");

  if (error) throw error;
  return data ?? [];
}

export type AgendaEvent = Awaited<ReturnType<typeof getAgendaEvents>>[number];

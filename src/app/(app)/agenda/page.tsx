import { getAgendaEvents } from "@/lib/queries/agenda";
import { createClient } from "@/lib/supabase/server";
import { getDayRange, getWeekRange, getMonthRange, daysInRange } from "@/lib/utils/dates";
import { AgendaNav } from "@/components/agenda/agenda-nav";
import { DayView } from "@/components/agenda/day-view";
import { WeekView } from "@/components/agenda/week-view";
import { MonthView } from "@/components/agenda/month-view";
import type { DecoratedEvent } from "@/components/agenda/types";

const SOURCE_HREF: Record<string, (e: { lead_id: string | null; client_id: string | null; project_id: string | null }) => string> = {
  meeting: (e) => (e.lead_id ? `/leads/${e.lead_id}` : e.client_id ? `/clients/${e.client_id}` : "/agenda"),
  follow_up: (e) => (e.lead_id ? `/leads/${e.lead_id}` : e.client_id ? `/clients/${e.client_id}` : "/follow-ups"),
  task: (e) => (e.lead_id ? `/leads/${e.lead_id}` : e.client_id ? `/clients/${e.client_id}` : e.project_id ? `/projects/${e.project_id}` : "/tasks"),
  project_deadline: (e) => `/projects/${e.project_id}`,
};

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; date?: string }>;
}) {
  const params = await searchParams;
  const view = (params.view === "day" || params.view === "month" ? params.view : "week") as "day" | "week" | "month";
  const date = params.date ? new Date(params.date + "T12:00:00") : new Date();

  const range = view === "day" ? getDayRange(date) : view === "month" ? getMonthRange(date) : getWeekRange(date);
  const events = await getAgendaEvents(range.from.toISOString(), range.to.toISOString());

  const supabase = await createClient();
  const leadIds = [...new Set(events.map((e) => e.lead_id).filter(Boolean))] as string[];
  const clientIds = [...new Set(events.map((e) => e.client_id).filter(Boolean))] as string[];

  const [leadsRes, clientsRes] = await Promise.all([
    leadIds.length ? supabase.from("leads").select("id, company_name").in("id", leadIds) : { data: [] as { id: string; company_name: string }[] },
    clientIds.length ? supabase.from("clients").select("id, company_name").in("id", clientIds) : { data: [] as { id: string; company_name: string }[] },
  ]);

  const leadName = new Map((leadsRes.data ?? []).map((l) => [l.id, l.company_name]));
  const clientName = new Map((clientsRes.data ?? []).map((c) => [c.id, c.company_name]));

  const decorated: DecoratedEvent[] = events.map((e) => {
    const entity = (e.lead_id && leadName.get(e.lead_id)) || (e.client_id && clientName.get(e.client_id));
    return {
      id: e.id!,
      source: e.source!,
      title: entity && (e.source === "follow_up" || e.source === "task") ? `${entity} — ${e.title}` : e.title!,
      starts_at: e.starts_at!,
      href: SOURCE_HREF[e.source!]?.(e) ?? "/agenda",
    };
  });

  const days = daysInRange(range.from, range.to);

  return (
    <div className="flex h-full flex-col">
      <div className="px-4 py-3">
        <h1 className="text-base font-medium text-foreground">Agenda</h1>
      </div>
      <AgendaNav view={view} date={date.toISOString().slice(0, 10)} />
      <div className="flex-1 overflow-y-auto">
        {view === "day" && <DayView events={decorated} />}
        {view === "week" && <WeekView days={days} events={decorated} />}
        {view === "month" && <MonthView days={days} events={decorated} month={date} />}
      </div>
    </div>
  );
}

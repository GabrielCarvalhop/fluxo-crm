import { format, isSameDay, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { EventChip } from "./event-chip";
import { formatTime } from "@/lib/utils/dates";
import { cn } from "@/lib/utils";
import type { DecoratedEvent } from "./types";

export function WeekView({ days, events }: { days: Date[]; events: DecoratedEvent[] }) {
  return (
    <div className="grid grid-cols-7 divide-x divide-border overflow-x-auto">
      {days.map((day) => {
        const dayEvents = events.filter((e) => isSameDay(new Date(e.starts_at), day));
        return (
          <div key={day.toISOString()} className="flex min-w-32 flex-col">
            <div
              className={cn(
                "sticky top-0 border-b border-border bg-background px-2 py-1.5 text-center text-xs",
                isToday(day) ? "font-semibold text-primary" : "text-muted-foreground"
              )}
            >
              {format(day, "EEE d", { locale: ptBR })}
            </div>
            <div className="flex flex-1 flex-col gap-1 p-1.5">
              {dayEvents.map((e) => (
                <EventChip key={e.id} time={formatTime(e.starts_at)} title={e.title} href={e.href} source={e.source} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

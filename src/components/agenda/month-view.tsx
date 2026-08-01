import Link from "next/link";
import { format, isSameDay, isSameMonth, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import type { DecoratedEvent } from "./types";

export function MonthView({ days, events, month }: { days: Date[]; events: DecoratedEvent[]; month: Date }) {
  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

  return (
    <div className="flex flex-col divide-y divide-border">
      {weeks.map((week, wi) => (
        <div key={wi} className="grid grid-cols-7 divide-x divide-border">
          {week.map((day) => {
            const dayEvents = events.filter((e) => isSameDay(new Date(e.starts_at), day));
            const inMonth = isSameMonth(day, month);
            return (
              <Link
                key={day.toISOString()}
                href={`/agenda?view=day&date=${format(day, "yyyy-MM-dd")}`}
                className={cn("flex min-h-20 flex-col gap-1 p-1.5 hover:bg-accent/40", !inMonth && "opacity-40")}
              >
                <span
                  className={cn(
                    "self-start text-xs",
                    isToday(day) ? "flex size-5 items-center justify-center rounded-full bg-primary font-medium text-primary-foreground" : "text-muted-foreground"
                  )}
                >
                  {format(day, "d")}
                </span>
                {dayEvents.length > 0 && (
                  <span className="text-[11px] text-text-subtle">{dayEvents.length} evento{dayEvents.length > 1 ? "s" : ""}</span>
                )}
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
}

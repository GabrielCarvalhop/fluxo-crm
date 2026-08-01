import { EmptyState } from "@/components/shared/empty-state";
import { EventChip } from "./event-chip";
import { formatTime } from "@/lib/utils/dates";
import { CalendarX } from "lucide-react";
import type { DecoratedEvent } from "./types";

export function DayView({ events }: { events: DecoratedEvent[] }) {
  if (events.length === 0) {
    return <EmptyState icon={CalendarX} title="Nada marcado" />;
  }

  return (
    <div className="flex flex-col gap-1 p-4">
      {events.map((e) => (
        <div key={e.id} className="flex items-center gap-3 rounded-md border border-border px-3 py-2">
          <span className="w-14 shrink-0 font-mono text-sm text-text-subtle tabular-nums">{formatTime(e.starts_at)}</span>
          <EventChip title={e.title} href={e.href} source={e.source} className="flex-1 bg-transparent px-0 py-0 text-sm text-foreground" />
        </div>
      ))}
    </div>
  );
}

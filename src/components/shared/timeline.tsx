import { MessageSquare, StickyNote, Calendar, FileText, Activity } from "lucide-react";
import { formatDateTime } from "@/lib/utils/dates";
import type { TimelineEvent } from "@/lib/rules/timeline";
import { EmptyState } from "./empty-state";

const ICON = {
  log: Activity,
  contact: MessageSquare,
  note: StickyNote,
  meeting: Calendar,
  proposal: FileText,
};

export function Timeline({ events }: { events: TimelineEvent[] }) {
  if (events.length === 0) {
    return <EmptyState icon={Activity} title="Nada por aqui ainda" description="O histórico aparece conforme você interage com este registro." />;
  }

  return (
    <ol className="flex flex-col">
      {events.map((event, i) => {
        const Icon = ICON[event.kind];
        return (
          <li key={event.id} className="relative flex gap-3 pb-5 last:pb-0">
            {i < events.length - 1 && <span className="absolute top-6 left-[11px] h-full w-px bg-border" />}
            <span className="z-10 flex size-6 shrink-0 items-center justify-center rounded-full border border-border bg-card">
              <Icon className="size-3 text-muted-foreground" />
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5 pt-0.5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-medium text-foreground">{event.title}</span>
                <span className="shrink-0 text-xs text-text-subtle">{formatDateTime(event.at)}</span>
              </div>
              {event.description && <p className="text-sm text-muted-foreground">{event.description}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

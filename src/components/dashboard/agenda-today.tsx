import Link from "next/link";
import { isToday } from "date-fns";
import { Calendar } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { formatTime } from "@/lib/utils/dates";
import type { DashboardData } from "@/lib/queries/dashboard";

export function AgendaToday({ meetings, followUps }: { meetings: DashboardData["meetings"]; followUps: DashboardData["followUps"] }) {
  const todayMeetings = meetings.filter((m) => isToday(new Date(m.starts_at)));
  const todayFollowUps = followUps.filter((f) => f.due_at && isToday(new Date(f.due_at)));

  type Row = { time: string; label: string; href: string; kind: "meeting" | "follow_up" };

  const rows: Row[] = [
    ...todayMeetings.map((m) => ({
      time: formatTime(m.starts_at),
      label: `Reunião — ${m.lead?.company_name ?? m.client?.company_name ?? m.title}`,
      href: m.lead_id ? `/leads/${m.lead_id}` : m.client_id ? `/clients/${m.client_id}` : "/agenda",
      kind: "meeting" as const,
    })),
    ...todayFollowUps.map((f) => ({
      time: formatTime(f.due_at),
      label: `Follow-up — ${f.lead?.company_name ?? f.title}`,
      href: f.lead_id ? `/leads/${f.lead_id}` : "/follow-ups",
      kind: "follow_up" as const,
    })),
  ].sort((a, b) => a.time.localeCompare(b.time));

  if (rows.length === 0) {
    return <EmptyState icon={Calendar} title="Nada marcado para hoje" />;
  }

  return (
    <div className="flex flex-col">
      {rows.map((row, i) => (
        <Link
          key={i}
          href={row.href}
          className="flex items-center gap-3 border-b border-border px-4 py-2 text-sm last:border-0 hover:bg-accent/50"
        >
          <span className="w-12 shrink-0 font-mono text-xs text-text-subtle tabular-nums">{row.time}</span>
          <span className="truncate text-foreground">{row.label}</span>
        </Link>
      ))}
    </div>
  );
}

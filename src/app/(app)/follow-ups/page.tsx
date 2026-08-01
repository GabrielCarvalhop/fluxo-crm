import { getFollowUpsBoard } from "@/lib/queries/follow-ups";
import { FollowUpRow } from "@/components/shared/follow-up-row";
import { EmptyState } from "@/components/shared/empty-state";
import { AlarmClock } from "lucide-react";

const SECTIONS = [
  { key: "overdue" as const, label: "Atrasados" },
  { key: "today" as const, label: "Hoje" },
  { key: "tomorrow" as const, label: "Amanhã" },
  { key: "thisWeek" as const, label: "Esta semana" },
  { key: "noDate" as const, label: "Sem data" },
];

export default async function FollowUpsPage() {
  const buckets = await getFollowUpsBoard();
  const total = Object.values(buckets).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-4 py-3">
        <h1 className="text-base font-medium text-foreground">Follow-ups</h1>
        <p className="text-sm text-muted-foreground">{total} no total</p>
      </div>

      {total === 0 ? (
        <EmptyState icon={AlarmClock} title="Nenhum follow-up pendente" description="Tudo em dia por aqui." />
      ) : (
        <div className="flex-1 overflow-y-auto">
          {SECTIONS.map((section) => {
            const items = buckets[section.key];
            if (items.length === 0) return null;
            return (
              <div key={section.key}>
                <div className="sticky top-0 flex items-center gap-2 border-b border-border bg-background px-4 py-2">
                  <h2 className="text-sm font-medium text-foreground">{section.label}</h2>
                  <span className="text-xs text-text-subtle">{items.length}</span>
                </div>
                {items.map((item) => (
                  <FollowUpRow key={item.id} item={item} />
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

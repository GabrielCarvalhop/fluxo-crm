"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { StageBadge } from "@/components/shared/stage-badge";
import { MoneyValue } from "@/components/shared/money-value";
import { LeadCard, type PipelineLead } from "./lead-card";
import { cn } from "@/lib/utils";

export function PipelineColumn({
  stage,
  leads,
}: {
  stage: { id: string; key: string; label: string; color: string };
  leads: PipelineLead[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id });
  const total = leads.reduce((sum, l) => sum + (l.estimated_value ? Number(l.estimated_value) : 0), 0);

  return (
    <div className="flex w-72 shrink-0 flex-col">
      <div className="flex items-center justify-between px-1 pb-2">
        <StageBadge label={stage.label} color={stage.color} />
        <span className="text-xs text-text-subtle">{leads.length}</span>
      </div>
      <div className="px-1 pb-2 text-xs text-muted-foreground">
        <MoneyValue value={total} />
      </div>
      <div
        ref={setNodeRef}
        className={cn(
          "flex min-h-24 flex-1 flex-col gap-2 rounded-lg border border-transparent p-1 transition-colors",
          isOver && "border-border-strong bg-accent/40"
        )}
      >
        <SortableContext items={leads.map((l) => l.id)} strategy={verticalListSortingStrategy}>
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

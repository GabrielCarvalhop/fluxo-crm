"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { toast } from "sonner";
import { PipelineColumn } from "./pipeline-column";
import { LeadCard, type PipelineLead } from "./lead-card";
import { reorderLeads } from "@/lib/actions/leads";

type Stage = { id: string; key: string; label: string; color: string; position: number };

export function PipelineBoard({ stages, leads: initialLeads }: { stages: Stage[]; leads: PipelineLead[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const columns = useMemo(() => {
    const byStage = new Map<string, PipelineLead[]>();
    for (const stage of stages) byStage.set(stage.id, []);
    for (const lead of leads) {
      if (!byStage.has(lead.stage_id)) byStage.set(lead.stage_id, []);
      byStage.get(lead.stage_id)!.push(lead);
    }
    for (const arr of byStage.values()) arr.sort((a, b) => Number(a.position) - Number(b.position));
    return byStage;
  }, [leads, stages]);

  const activeLead = activeId ? leads.find((l) => l.id === activeId) ?? null : null;

  function handleDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id));
  }

  async function handleDragEnd(e: DragEndEvent) {
    setActiveId(null);
    const { active, over } = e;
    if (!over) return;

    const dragged = leads.find((l) => l.id === active.id);
    if (!dragged) return;

    // over.id é ou o id de outro card (solta perto dele) ou o id da coluna (solta vazia)
    const overIsColumn = stages.some((s) => s.id === over.id);
    const targetStageId = overIsColumn ? String(over.id) : leads.find((l) => l.id === over.id)?.stage_id;
    if (!targetStageId) return;

    const withoutDragged = (columns.get(targetStageId) ?? []).filter((l) => l.id !== dragged.id);
    const overIndex = overIsColumn ? withoutDragged.length : withoutDragged.findIndex((l) => l.id === over.id);
    const insertIndex = overIndex === -1 ? withoutDragged.length : overIndex;

    const orderedIds = [
      ...withoutDragged.slice(0, insertIndex).map((l) => l.id),
      dragged.id,
      ...withoutDragged.slice(insertIndex).map((l) => l.id),
    ];

    // Nada mudou: mesma coluna, mesma posição.
    const currentOrder = (columns.get(targetStageId) ?? []).map((l) => l.id);
    if (targetStageId === dragged.stage_id && currentOrder.join() === orderedIds.join()) return;

    const previousLeads = leads;
    const positionById = new Map(orderedIds.map((id, i) => [id, i + 1]));
    setLeads((prev) =>
      prev.map((l) =>
        positionById.has(l.id) ? { ...l, stage_id: targetStageId, position: positionById.get(l.id)! } : l
      )
    );

    try {
      await reorderLeads({ stage_id: targetStageId, lead_ids: orderedIds });
    } catch {
      setLeads(previousLeads);
      toast.error("Não foi possível mover o lead. Tente novamente.");
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex h-full gap-3 overflow-x-auto p-4">
        {stages.map((stage) => (
          <PipelineColumn key={stage.id} stage={stage} leads={columns.get(stage.id) ?? []} />
        ))}
      </div>
      <DragOverlay>{activeLead ? <LeadCard lead={activeLead} /> : null}</DragOverlay>
    </DndContext>
  );
}

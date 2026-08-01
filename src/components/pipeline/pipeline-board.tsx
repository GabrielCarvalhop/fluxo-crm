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
import { moveLeadStage } from "@/lib/actions/leads";

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

    const activeLead = leads.find((l) => l.id === active.id);
    if (!activeLead) return;

    // over.id é ou o id de outro card (solta perto dele) ou o id da coluna (solta vazia)
    const overIsColumn = stages.some((s) => s.id === over.id);
    const targetStageId = overIsColumn ? String(over.id) : leads.find((l) => l.id === over.id)?.stage_id;
    if (!targetStageId) return;

    const targetColumn = (columns.get(targetStageId) ?? []).filter((l) => l.id !== activeLead.id);
    const overIndex = overIsColumn ? targetColumn.length : targetColumn.findIndex((l) => l.id === over.id);
    const insertIndex = overIndex === -1 ? targetColumn.length : overIndex;

    const prevPos = insertIndex > 0 ? Number(targetColumn[insertIndex - 1].position) : null;
    const nextPos = insertIndex < targetColumn.length ? Number(targetColumn[insertIndex].position) : null;
    const newPosition = prevPos === null && nextPos === null ? 0 : prevPos === null ? nextPos! - 1 : nextPos === null ? prevPos + 1 : (prevPos + nextPos) / 2;

    if (targetStageId === activeLead.stage_id && newPosition === Number(activeLead.position)) return;

    const previousLeads = leads;
    setLeads((prev) =>
      prev.map((l) => (l.id === activeLead.id ? { ...l, stage_id: targetStageId, position: newPosition } : l))
    );

    try {
      await moveLeadStage({ id: activeLead.id, stage_id: targetStageId, position: newPosition });
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

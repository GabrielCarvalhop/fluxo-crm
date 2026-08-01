"use client";

import { useTransition } from "react";
import { updateProjectStatus } from "@/lib/actions/projects";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const STATUSES = [
  { value: "briefing_pending", label: "Briefing pendente" },
  { value: "awaiting_materials", label: "Aguardando materiais" },
  { value: "planning", label: "Planejamento" },
  { value: "design", label: "Design" },
  { value: "development", label: "Desenvolvimento" },
  { value: "internal_review", label: "Revisão interna" },
  { value: "client_review", label: "Revisão cliente" },
  { value: "awaiting_approval", label: "Aguardando aprovação" },
  { value: "deploy", label: "Deploy" },
  { value: "finished", label: "Finalizado" },
  { value: "post_sale", label: "Pós-venda" },
];

export function ProjectStatusSelect({ projectId, status }: { projectId: string; status: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Select
      value={status}
      disabled={isPending}
      onValueChange={(value) => startTransition(() => updateProjectStatus({ id: projectId, status: value }))}
    >
      <SelectTrigger className="h-8 w-48"><SelectValue /></SelectTrigger>
      <SelectContent>
        {STATUSES.map((s) => (
          <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

"use client";

import { useActionState, useEffect, useState } from "react";
import { updateBriefing } from "@/lib/actions/projects";
import type { ActionState } from "@/lib/actions/leads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { ProjectDetail } from "@/lib/queries/projects";

const initialState: ActionState = {};

const FIELDS: { name: keyof NonNullable<ProjectDetail["briefing"]>; label: string; type: "text" | "textarea" }[] = [
  { name: "about", label: "Sobre a empresa", type: "textarea" },
  { name: "services", label: "Serviços", type: "textarea" },
  { name: "target_audience", label: "Público-alvo", type: "textarea" },
  { name: "differentiators", label: "Diferenciais", type: "textarea" },
  { name: "goal", label: "Objetivo do site", type: "textarea" },
  { name: "whatsapp", label: "WhatsApp", type: "text" },
  { name: "instagram", label: "Instagram", type: "text" },
  { name: "location", label: "Localização", type: "text" },
  { name: "competitors", label: "Concorrentes", type: "textarea" },
  { name: "references_text", label: "Referências", type: "textarea" },
  { name: "colors", label: "Cores", type: "text" },
  { name: "logo_notes", label: "Logo", type: "text" },
  { name: "photos_notes", label: "Fotos", type: "text" },
  { name: "domain_notes", label: "Domínio desejado", type: "text" },
];

export function BriefingForm({ projectId, briefing }: { projectId: string; briefing: ProjectDetail["briefing"] }) {
  const [state, formAction, isPending] = useActionState(updateBriefing, initialState);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (state.success) {
      setSaved(true);
      toast.success("Briefing salvo");
      const t = setTimeout(() => setSaved(false), 2000);
      return () => clearTimeout(t);
    }
  }, [state]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="project_id" value={projectId} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {FIELDS.map((field) => (
          <div key={field.name} className={field.type === "textarea" ? "sm:col-span-2 flex flex-col gap-1.5" : "flex flex-col gap-1.5"}>
            <Label htmlFor={field.name}>{field.label}</Label>
            {field.type === "textarea" ? (
              <Textarea id={field.name} name={field.name} rows={2} defaultValue={briefing?.[field.name] ?? ""} />
            ) : (
              <Input id={field.name} name={field.name} defaultValue={briefing?.[field.name] ?? ""} />
            )}
          </div>
        ))}
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" className="self-start" disabled={isPending}>
        {isPending ? "Salvando…" : saved ? "Salvo ✓" : "Salvar briefing"}
      </Button>
    </form>
  );
}

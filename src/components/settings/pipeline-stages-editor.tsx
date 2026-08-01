"use client";

import { useActionState, useEffect, useRef, useTransition } from "react";
import { addPipelineStage, updatePipelineStage } from "@/lib/actions/settings";
import type { ActionState } from "@/lib/actions/leads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { StageBadge } from "@/components/shared/stage-badge";
import { Plus } from "lucide-react";

const initialState: ActionState = {};

export function PipelineStagesEditor({ stages }: { stages: { id: string; label: string; color: string; active: boolean; is_won: boolean; is_lost: boolean }[] }) {
  const [, startTransition] = useTransition();
  const [state, formAction, isPending] = useActionState(addPipelineStage, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state]);

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-medium text-foreground">Estágios do pipeline</h3>
      <div className="flex flex-col rounded-md border border-border">
        {stages.map((stage) => (
          <div key={stage.id} className="flex items-center gap-3 border-b border-border px-3 py-2 last:border-0">
            <Checkbox
              checked={stage.active}
              disabled={stage.is_won || stage.is_lost}
              onCheckedChange={(checked) => startTransition(() => updatePipelineStage({ id: stage.id, active: checked === true }))}
            />
            <StageBadge label={stage.label} color={stage.color} className="min-w-28" />
            <Input
              defaultValue={stage.label}
              className="h-7 max-w-40 text-xs"
              onBlur={(e) => {
                if (e.target.value.trim() && e.target.value !== stage.label) {
                  startTransition(() => updatePipelineStage({ id: stage.id, label: e.target.value.trim() }));
                }
              }}
            />
            <Input
              type="color"
              defaultValue={stage.color}
              className="h-7 w-12 p-1"
              onChange={(e) => startTransition(() => updatePipelineStage({ id: stage.id, color: e.target.value }))}
            />
          </div>
        ))}
      </div>
      <form ref={formRef} action={formAction} className="flex gap-2">
        <Input name="label" placeholder="Novo estágio…" className="h-8 flex-1 max-w-56" />
        <Input name="color" type="color" defaultValue="#71717a" className="h-8 w-12 p-1" />
        <Button type="submit" size="icon-sm" variant="outline" disabled={isPending} aria-label="Adicionar">
          <Plus className="size-4" />
        </Button>
      </form>
      {state.error && <p className="text-xs text-destructive">{state.error}</p>}
    </div>
  );
}

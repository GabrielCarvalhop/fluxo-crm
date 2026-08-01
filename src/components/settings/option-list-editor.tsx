"use client";

import { useActionState, useEffect, useRef, useTransition } from "react";
import { addSimpleOption, toggleSimpleOption } from "@/lib/actions/settings";
import type { ActionState } from "@/lib/actions/leads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";

const initialState: ActionState = {};

export function OptionListEditor({
  table,
  title,
  items,
}: {
  table: "lead_sources" | "segments" | "loss_reasons";
  title: string;
  items: { id: string; label: string; active: boolean }[];
}) {
  const [state, formAction, isPending] = useActionState(addSimpleOption, initialState);
  const [, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state]);

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-medium text-foreground">{title}</h3>
      <div className="flex flex-col rounded-md border border-border">
        {items.length === 0 && <p className="p-3 text-sm text-muted-foreground">Nenhum ainda.</p>}
        {items.map((item) => (
          <label
            key={item.id}
            className="flex items-center gap-2.5 border-b border-border px-3 py-2 text-sm last:border-0"
          >
            <Checkbox
              checked={item.active}
              onCheckedChange={(checked) => startTransition(() => toggleSimpleOption({ table, id: item.id, active: checked === true }))}
            />
            <span className={item.active ? "text-foreground" : "text-muted-foreground line-through"}>{item.label}</span>
          </label>
        ))}
      </div>
      <form ref={formRef} action={formAction} className="flex gap-2">
        <input type="hidden" name="table" value={table} />
        <Input name="label" placeholder="Adicionar novo…" className="h-8 flex-1" />
        <Button type="submit" size="icon-sm" variant="outline" disabled={isPending} aria-label="Adicionar">
          <Plus className="size-4" />
        </Button>
      </form>
      {state.error && <p className="text-xs text-destructive">{state.error}</p>}
    </div>
  );
}

"use client";

import { useActionState, useEffect, useRef } from "react";
import { addChecklistItem } from "@/lib/actions/settings";
import type { ActionState } from "@/lib/actions/leads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

const initialState: ActionState = {};

export function ChecklistEditor({
  templateId,
  groups,
}: {
  templateId: string;
  groups: { label: string; items: { id: string; label: string }[] }[];
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {groups.map((group) => (
        <div key={group.label} className="rounded-md border border-border p-3">
          <h4 className="mb-2 text-sm font-medium text-foreground">{group.label}</h4>
          <ul className="mb-2 flex flex-col gap-1">
            {group.items.map((item) => (
              <li key={item.id} className="text-sm text-muted-foreground">· {item.label}</li>
            ))}
          </ul>
          <AddItemForm templateId={templateId} groupLabel={group.label} />
        </div>
      ))}
    </div>
  );
}

function AddItemForm({ templateId, groupLabel }: { templateId: string; groupLabel: string }) {
  const [state, formAction, isPending] = useActionState(addChecklistItem, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex gap-1.5">
      <input type="hidden" name="template_id" value={templateId} />
      <input type="hidden" name="group_label" value={groupLabel} />
      <Input name="label" placeholder="Novo item…" className="h-7 flex-1 text-xs" />
      <Button type="submit" size="icon-sm" variant="ghost" disabled={isPending} aria-label="Adicionar item">
        <Plus className="size-3.5" />
      </Button>
    </form>
  );
}

"use client";

import { useActionState, useEffect, useRef, useTransition } from "react";
import { addTag, deleteTag } from "@/lib/actions/settings";
import type { ActionState } from "@/lib/actions/leads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

const initialState: ActionState = {};

export function TagsEditor({ tags }: { tags: { id: string; label: string }[] }) {
  const [state, formAction, isPending] = useActionState(addTag, initialState);
  const [, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state]);

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-medium text-foreground">Tags</h3>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <Badge key={tag.id} variant="secondary" className="gap-1 pr-1">
            {tag.label}
            <button
              onClick={() => startTransition(() => deleteTag(tag.id))}
              className="rounded-full p-0.5 hover:bg-foreground/10"
              aria-label={`Remover ${tag.label}`}
            >
              <X className="size-2.5" />
            </button>
          </Badge>
        ))}
      </div>
      <form ref={formRef} action={formAction} className="flex gap-2">
        <Input name="label" placeholder="Nova tag…" className="h-8 flex-1 max-w-56" />
        <Button type="submit" size="icon-sm" variant="outline" disabled={isPending} aria-label="Adicionar">
          <Plus className="size-4" />
        </Button>
      </form>
      {state.error && <p className="text-xs text-destructive">{state.error}</p>}
    </div>
  );
}

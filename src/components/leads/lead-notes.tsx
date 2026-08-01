"use client";

import { useActionState, useEffect, useRef } from "react";
import { addNote, type ActionState } from "@/lib/actions/leads";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils/dates";

const initialState: ActionState = {};

type Note = { id: string; body: string; created_at: string; author: { full_name: string | null } | null };

export function LeadNotes({ leadId, notes }: { leadId: string; notes: Note[] }) {
  const [state, formAction, isPending] = useActionState(addNote, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state]);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-text-subtle uppercase">Notas</span>

      <form ref={formRef} action={formAction} className="flex flex-col gap-1.5">
        <input type="hidden" name="lead_id" value={leadId} />
        <Textarea name="body" placeholder="Adicionar nota…" rows={2} required className="text-sm" />
        {state.error && <p className="text-xs text-destructive">{state.error}</p>}
        <Button type="submit" size="sm" variant="outline" className="self-end" disabled={isPending}>
          {isPending ? "Salvando…" : "Adicionar"}
        </Button>
      </form>

      <div className="flex flex-col gap-2.5">
        {notes.map((note) => (
          <div key={note.id} className="rounded-md bg-muted/50 p-2 text-sm">
            <p className="text-foreground">{note.body}</p>
            <p className="mt-1 text-[11px] text-text-subtle">
              {note.author?.full_name ?? "—"} · {formatDateTime(note.created_at)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

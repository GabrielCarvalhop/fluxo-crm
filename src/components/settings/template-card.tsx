"use client";

import { useActionState, useState } from "react";
import { toast } from "sonner";
import { Copy, Check } from "lucide-react";
import { upsertMessageTemplate } from "@/lib/actions/settings";
import type { ActionState } from "@/lib/actions/leads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const initialState: ActionState = {};

export function TemplateCard({ template }: { template: { id: string; key: string; title: string; body: string } }) {
  const [state, formAction, isPending] = useActionState(upsertMessageTemplate, initialState);
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(template.body);
    setCopied(true);
    toast.success("Copiado");
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <form action={formAction} className="flex flex-col gap-2 rounded-md border border-border p-3">
      <input type="hidden" name="id" value={template.id} />
      <input type="hidden" name="key" value={template.key} />
      <Input name="title" defaultValue={template.title} className="h-8 font-medium" />
      <Textarea name="body" defaultValue={template.body} rows={3} className="text-sm" />
      <div className="flex items-center justify-between">
        <Button type="button" variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" onClick={copy}>
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? "Copiado" : "Copiar"}
        </Button>
        <Button type="submit" size="sm" variant="outline" disabled={isPending}>
          {isPending ? "Salvando…" : "Salvar"}
        </Button>
      </div>
      {state.error && <p className="text-xs text-destructive">{state.error}</p>}
    </form>
  );
}

"use client";

import { useActionState, useEffect, useState } from "react";
import { MessageSquarePlus } from "lucide-react";
import { logContact, type ActionState } from "@/lib/actions/leads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const initialState: ActionState = {};

const TYPES = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "call", label: "Ligação" },
  { value: "instagram", label: "Instagram" },
  { value: "email", label: "E-mail" },
  { value: "meeting", label: "Reunião" },
  { value: "other", label: "Outro" },
];

export function ContactLogDialog({ leadId, clientId }: { leadId?: string; clientId?: string }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(logContact, initialState);

  useEffect(() => {
    if (state.success) setOpen(false);
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <MessageSquarePlus className="size-3.5" />
          Registrar contato
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar contato</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="flex flex-col gap-3">
          <input type="hidden" name="lead_id" value={leadId ?? ""} />
          <input type="hidden" name="client_id" value={clientId ?? ""} />

          <div className="flex flex-col gap-1.5">
            <Label>Tipo</Label>
            <Select name="type" defaultValue="whatsapp">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="summary">Resumo</Label>
            <Textarea id="summary" name="summary" placeholder="O que foi conversado" rows={2} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="outcome">Resultado</Label>
            <Textarea id="outcome" name="outcome" placeholder="Como o cliente reagiu" rows={2} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="next_action">Próxima ação</Label>
              <Input id="next_action" name="next_action" placeholder="Ex: fazer follow-up" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="next_action_at">Data</Label>
              <Input id="next_action_at" name="next_action_at" type="date" />
            </div>
          </div>

          {state.error && <p className="text-sm text-destructive">{state.error}</p>}

          <DialogFooter>
            <Button type="submit" disabled={isPending}>{isPending ? "Salvando…" : "Registrar"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

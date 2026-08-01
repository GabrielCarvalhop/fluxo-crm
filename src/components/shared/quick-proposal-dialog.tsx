"use client";

import { useActionState, useEffect, useState } from "react";
import { FileText } from "lucide-react";
import { createProposal } from "@/lib/actions/proposals";
import type { ActionState } from "@/lib/actions/leads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const initialState: ActionState = {};

export function QuickProposalDialog({
  leadId,
  clientId,
  projectId,
  defaultTitle,
  clients,
}: {
  leadId?: string;
  clientId?: string;
  projectId?: string;
  defaultTitle?: string;
  /** Quando não há leadId/clientId fixo (ex: página de Propostas), oferece um seletor de cliente. */
  clients?: { id: string; company_name: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createProposal, initialState);

  useEffect(() => {
    if (state.success) setOpen(false);
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <FileText className="size-3.5" />
          Criar proposta
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Criar proposta</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="flex flex-col gap-3">
          <input type="hidden" name="lead_id" value={leadId ?? ""} />
          <input type="hidden" name="project_id" value={projectId ?? ""} />

          {!clientId && clients && (
            <div className="flex flex-col gap-1.5">
              <Label>Cliente</Label>
              <Select name="client_id">
                <SelectTrigger><SelectValue placeholder="Selecionar cliente" /></SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.company_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {clientId && <input type="hidden" name="client_id" value={clientId} />}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">Título</Label>
            <Input id="title" name="title" defaultValue={defaultTitle} required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="value">Valor (R$)</Label>
              <Input id="value" name="value" type="number" step="0.01" min="0" required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="valid_until">Validade</Label>
              <Input id="valid_until" name="valid_until" type="date" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="payment_terms">Forma de pagamento</Label>
            <Input id="payment_terms" name="payment_terms" placeholder="Ex: 50% início, 50% entrega" />
          </div>

          {state.error && <p className="text-sm text-destructive">{state.error}</p>}

          <DialogFooter>
            <Button type="submit" disabled={isPending}>{isPending ? "Salvando…" : "Criar rascunho"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

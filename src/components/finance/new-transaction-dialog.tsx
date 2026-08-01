"use client";

import { useActionState, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { createTransaction } from "@/lib/actions/finance";
import type { ActionState } from "@/lib/actions/leads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const initialState: ActionState = {};

const EXPENSE_CATEGORIES = [
  { value: "domain", label: "Domínio" },
  { value: "hosting", label: "Hospedagem" },
  { value: "plugin", label: "Plugin" },
  { value: "tool", label: "Ferramenta" },
  { value: "freelancer", label: "Freelancer" },
  { value: "other", label: "Outro" },
];

export function NewTransactionDialog({ clients }: { clients: { id: string; company_name: string }[] }) {
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<"income" | "expense">("income");
  const [state, formAction, isPending] = useActionState(createTransaction, initialState);

  useEffect(() => {
    if (state.success) setOpen(false);
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1">
          <Plus className="size-4" />
          Novo lançamento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo lançamento</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="flex flex-col gap-3">
          <RadioGroup name="kind" value={kind} onValueChange={(v) => setKind(v as "income" | "expense")} className="flex gap-4">
            <label className="flex items-center gap-1.5 text-sm">
              <RadioGroupItem value="income" /> Receita
            </label>
            <label className="flex items-center gap-1.5 text-sm">
              <RadioGroupItem value="expense" /> Despesa
            </label>
          </RadioGroup>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Descrição</Label>
            <Input id="description" name="description" required autoFocus />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input id="amount" name="amount" type="number" step="0.01" min="0" required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="due_date">Vencimento</Label>
              <Input id="due_date" name="due_date" type="date" />
            </div>
          </div>

          {kind === "income" && (
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

          {kind === "expense" && (
            <div className="flex flex-col gap-1.5">
              <Label>Categoria</Label>
              <Select name="expense_category" defaultValue="other">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label>Forma de pagamento</Label>
            <Select name="method" defaultValue="pix">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pix">PIX</SelectItem>
                <SelectItem value="cash">Dinheiro</SelectItem>
                <SelectItem value="transfer">Transferência</SelectItem>
                <SelectItem value="card">Cartão</SelectItem>
                <SelectItem value="other">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {state.error && <p className="text-sm text-destructive">{state.error}</p>}

          <DialogFooter>
            <Button type="submit" disabled={isPending}>{isPending ? "Salvando…" : "Adicionar"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

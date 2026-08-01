"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createLead, type ActionState } from "@/lib/actions/leads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

const initialState: ActionState = {};

export function NewLeadDialog({
  segments,
  sources,
}: {
  segments: { id: string; label: string }[];
  sources: { id: string; label: string }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const keepOpenRef = useRef(false);
  const [state, formAction, isPending] = useActionState(createLead, initialState);

  useEffect(() => {
    if (searchParams.get("new") === "1") setOpen(true);
  }, [searchParams]);

  useEffect(() => {
    if (!state.success) return;
    if (keepOpenRef.current) {
      formRef.current?.reset();
      keepOpenRef.current = false;
      formRef.current?.querySelector<HTMLInputElement>('[name="company_name"]')?.focus();
    } else {
      closeDialog();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  function closeDialog() {
    setOpen(false);
    if (searchParams.get("new")) {
      const params = new URLSearchParams(searchParams);
      params.delete("new");
      router.replace(`?${params.toString()}`.replace(/\?$/, ""), { scroll: false });
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? setOpen(true) : closeDialog())}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1">
          <Plus className="size-4" />
          Novo lead
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-md"
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            keepOpenRef.current = true;
            formRef.current?.requestSubmit();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Novo lead</DialogTitle>
          <DialogDescription>O resto dos detalhes você preenche depois, na página do lead.</DialogDescription>
        </DialogHeader>

        <form ref={formRef} action={formAction} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="company_name">Empresa</Label>
            <Input id="company_name" name="company_name" autoFocus required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input id="whatsapp" name="whatsapp" placeholder="55329..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="city">Cidade</Label>
              <Input id="city" name="city" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Segmento</Label>
              <Select name="segment_id">
                <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                <SelectContent>
                  {segments.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Origem</Label>
            <Select name="source_id">
              <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
              <SelectContent>
                {sources.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {state.error && <p className="text-sm text-destructive">{state.error}</p>}

          <DialogFooter>
            <span className="mr-auto self-center text-xs text-text-subtle">Ctrl+Enter salva e cria outro</span>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando…" : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

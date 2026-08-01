"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { updateLead, type ActionState } from "@/lib/actions/leads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { LeadDetail } from "@/lib/queries/leads";

const initialState: ActionState = {};

const WEBSITE_QUALITY = [
  { value: "none", label: "Não possui" },
  { value: "very_bad", label: "Muito ruim" },
  { value: "bad", label: "Ruim" },
  { value: "average", label: "Razoável" },
  { value: "good", label: "Bom" },
];

export function EditLeadDialog({
  lead,
  segments,
  sources,
}: {
  lead: LeadDetail["lead"];
  segments: { id: string; label: string }[];
  sources: { id: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(updateLead, initialState);

  useEffect(() => {
    if (state.success) {
      setOpen(false);
      toast.success("Lead atualizado");
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Pencil className="size-3.5" />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar lead</DialogTitle>
        </DialogHeader>

        <form action={formAction} className="flex flex-col gap-4">
          <input type="hidden" name="id" value={lead.id} />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Empresa" name="company_name" defaultValue={lead.company_name} required />
            <Field label="Responsável" name="contact_name" defaultValue={lead.contact_name} />

            <div className="flex flex-col gap-1.5">
              <Label>Segmento</Label>
              <Select name="segment_id" defaultValue={lead.segment_id ?? undefined}>
                <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                <SelectContent>
                  {segments.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Origem</Label>
              <Select name="source_id" defaultValue={lead.source_id ?? undefined}>
                <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                <SelectContent>
                  {sources.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Field label="Cidade" name="city" defaultValue={lead.city} />
            <Field label="Estado (UF)" name="state" defaultValue={lead.state} maxLength={2} />
            <Field label="WhatsApp" name="whatsapp" defaultValue={lead.whatsapp} />
            <Field label="Telefone" name="phone" defaultValue={lead.phone} />
            <Field label="E-mail" name="email" type="email" defaultValue={lead.email} />
            <Field label="Instagram" name="instagram" defaultValue={lead.instagram} />
            <Field label="Site atual" name="website_url" defaultValue={lead.website_url} />
            <Field label="Google Maps" name="google_maps_url" defaultValue={lead.google_maps_url} />

            <div className="flex flex-col gap-1.5">
              <Label>Qualidade do site atual</Label>
              <Select name="website_quality" defaultValue={lead.website_quality ?? undefined}>
                <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                <SelectContent>
                  {WEBSITE_QUALITY.map((q) => (
                    <SelectItem key={q.value} value={q.value}>{q.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Field
              label="Valor potencial (R$)"
              name="estimated_value"
              type="number"
              step="0.01"
              defaultValue={lead.estimated_value}
            />

            <Field label="URL do site piloto" name="pilot_url" defaultValue={lead.pilot_url} />
          </div>

          <div className="flex flex-wrap gap-5">
            {/* hidden "false" antes do checkbox: sem ele, desmarcar não envia nada
                e o campo nunca voltaria para false no banco. */}
            <label className="flex items-center gap-2 text-sm">
              <input type="hidden" name="has_website" value="false" />
              <Checkbox name="has_website" defaultChecked={lead.has_website ?? false} />
              Possui site
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="hidden" name="pilot_created" value="false" />
              <Checkbox name="pilot_created" defaultChecked={lead.pilot_created} />
              Site piloto criado
            </label>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notes">Observações</Label>
            <Textarea id="notes" name="notes" rows={3} defaultValue={lead.notes ?? ""} />
          </div>

          {state.error && <p className="text-sm text-destructive">{state.error}</p>}

          <DialogFooter>
            <Button type="submit" disabled={isPending}>{isPending ? "Salvando…" : "Salvar"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  name,
  defaultValue,
  ...props
}: Omit<React.ComponentProps<"input">, "defaultValue" | "name"> & {
  label: string;
  name: string;
  defaultValue?: string | number | null;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} defaultValue={defaultValue ?? ""} {...props} />
    </div>
  );
}

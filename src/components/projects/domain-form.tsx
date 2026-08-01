"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { updateDomain } from "@/lib/actions/projects";
import type { ActionState } from "@/lib/actions/leads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ProjectDetail } from "@/lib/queries/projects";

const initialState: ActionState = {};

export function DomainForm({ projectId, domain }: { projectId: string; domain: ProjectDetail["domain"] }) {
  const [state, formAction, isPending] = useActionState(updateDomain, initialState);

  useEffect(() => {
    if (state.success) toast.success("Domínio salvo");
  }, [state]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="project_id" value={projectId} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="domain_name">Domínio</Label>
          <Input id="domain_name" name="domain_name" placeholder="empresa.com.br" defaultValue={domain?.domain_name ?? ""} required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="registrar">Registrador</Label>
          <Input id="registrar" name="registrar" defaultValue={domain?.registrar ?? ""} placeholder="Registro.br" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="registered_at">Data de registro</Label>
          <Input id="registered_at" name="registered_at" type="date" defaultValue={domain?.registered_at ?? ""} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="expires_at">Vencimento</Label>
          <Input id="expires_at" name="expires_at" type="date" defaultValue={domain?.expires_at ?? ""} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cost">Valor (R$)</Label>
          <Input id="cost" name="cost" type="number" step="0.01" defaultValue={domain?.cost ?? ""} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Pago por</Label>
          <Select name="paid_by" defaultValue={domain?.paid_by ?? "fluxo"}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="fluxo">Fluxo</SelectItem>
              <SelectItem value="client">Cliente</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Hospedagem</Label>
          <Select name="hosting" defaultValue={domain?.hosting ?? "vercel"}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="vercel">Vercel</SelectItem>
              <SelectItem value="railway">Railway</SelectItem>
              <SelectItem value="other">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="final_url">URL final</Label>
          <Input id="final_url" name="final_url" defaultValue={domain?.final_url ?? ""} placeholder="https://empresa.com.br" />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <Checkbox name="dns_configured" defaultChecked={domain?.dns_configured ?? false} />
        DNS configurado
      </label>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" className="self-start" disabled={isPending}>
        {isPending ? "Salvando…" : "Salvar"}
      </Button>
    </form>
  );
}

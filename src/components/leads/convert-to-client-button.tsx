"use client";

import { UserCheck } from "lucide-react";
import { convertLeadToClient } from "@/lib/actions/leads";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function ConvertToClientButton({ leadId, companyName }: { leadId: string; companyName: string }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <UserCheck className="size-3.5" />
          Converter em cliente
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Converter {companyName} em cliente?</AlertDialogTitle>
          <AlertDialogDescription>
            Isso marca o lead como fechado e cria o cadastro de cliente reaproveitando os dados de contato — nada é
            duplicado, o histórico continua ligado.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <form action={convertLeadToClient.bind(null, leadId)}>
            <AlertDialogAction asChild>
              <Button type="submit">Converter</Button>
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoneyValue } from "@/components/shared/money-value";
import { TemperatureBadge, type Temperature } from "@/components/shared/temperature-badge";
import { StageBadge } from "@/components/shared/stage-badge";
import { RelativeTime } from "@/components/shared/relative-time";
import { EmptyState } from "@/components/shared/empty-state";
import { Users } from "lucide-react";
import type { getLeadsList } from "@/lib/queries/leads";

export async function LeadsTable({ leads }: { leads: Awaited<ReturnType<typeof getLeadsList>> }) {
  if (leads.length === 0) {
    return <EmptyState icon={Users} title="Nenhum lead encontrado" description="Ajuste os filtros ou cadastre um novo lead." />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Empresa</TableHead>
          <TableHead>Estágio</TableHead>
          <TableHead>Temperatura</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead>Último contato</TableHead>
          <TableHead>Próxima ação</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leads.map((lead) => (
          <TableRow key={lead.id} className="cursor-pointer">
            <TableCell className="font-medium">
              <Link href={`/leads/${lead.id}`} className="block hover:underline">
                {lead.company_name}
                <div className="text-xs font-normal text-text-subtle">
                  {[lead.segment?.label, lead.city].filter(Boolean).join(" · ")}
                </div>
              </Link>
            </TableCell>
            <TableCell>
              {lead.stage && <StageBadge label={lead.stage.label} color={lead.stage.color} />}
            </TableCell>
            <TableCell>
              <TemperatureBadge value={lead.temperature as Temperature} />
            </TableCell>
            <TableCell><MoneyValue value={lead.estimated_value} /></TableCell>
            <TableCell className="text-sm text-muted-foreground"><RelativeTime iso={lead.last_contact_at} /></TableCell>
            <TableCell className="text-sm text-muted-foreground">{lead.next_action || "—"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

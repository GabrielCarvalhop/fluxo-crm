import { Suspense } from "react";
import { getProposalsList, computeProposalIndicators } from "@/lib/queries/proposals";
import { getClientsList } from "@/lib/queries/clients";
import { IndicatorCard } from "@/components/shared/indicator-card";
import { QuickProposalDialog } from "@/components/shared/quick-proposal-dialog";
import { ProposalStatusBadge } from "@/components/shared/proposal-status-badge";
import { ProposalStatusSelect } from "@/components/proposals/proposal-status-select";
import { MoneyValue } from "@/components/shared/money-value";
import { EmptyState } from "@/components/shared/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateShort } from "@/lib/utils/dates";
import { formatMoney, formatPercent } from "@/lib/utils/format";
import { FileText } from "lucide-react";

export default async function ProposalsPage() {
  const [proposals, clients] = await Promise.all([getProposalsList(), getClientsList()]);
  const indicators = computeProposalIndicators(proposals);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <h1 className="text-base font-medium text-foreground">Propostas</h1>
          <p className="text-sm text-muted-foreground">{proposals.length} no total</p>
        </div>
        <Suspense>
          <QuickProposalDialog clients={clients.map((c) => ({ id: c.id, company_name: c.company_name }))} />
        </Suspense>
      </div>

      <div className="grid grid-cols-2 gap-3 px-4 pb-3 sm:grid-cols-4">
        <IndicatorCard label="Enviadas" value={String(indicators.sentCount)} />
        <IndicatorCard label="Valor total proposto" value={formatMoney(indicators.totalProposedValue)} />
        <IndicatorCard label="Em negociação" value={formatMoney(indicators.negotiationValue)} />
        <IndicatorCard
          label="Taxa de fechamento"
          value={indicators.closingRate !== null ? formatPercent(indicators.closingRate) : "—"}
          sublabel={formatMoney(indicators.closedValue) + " fechado"}
        />
      </div>

      <div className="flex-1 overflow-y-auto border-t border-border">
        {proposals.length === 0 ? (
          <EmptyState icon={FileText} title="Nenhuma proposta ainda" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Cliente/Lead</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Validade</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proposals.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs text-text-subtle">{p.code}</TableCell>
                  <TableCell>
                    <p className="font-medium text-foreground">{p.lead?.company_name ?? p.client?.company_name ?? "—"}</p>
                    <p className="text-xs text-text-subtle">{p.title}</p>
                  </TableCell>
                  <TableCell><MoneyValue value={p.value} /></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDateShort(p.valid_until)}</TableCell>
                  <TableCell>
                    {p.effective_status === "expired" ? (
                      <ProposalStatusBadge status="expired" />
                    ) : (
                      <ProposalStatusSelect proposalId={p.id!} status={p.status ?? "draft"} />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

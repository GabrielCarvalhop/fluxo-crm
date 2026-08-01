import { Suspense } from "react";
import { getFinanceData } from "@/lib/queries/finance";
import { getClientsList } from "@/lib/queries/clients";
import { IndicatorCard } from "@/components/shared/indicator-card";
import { NewTransactionDialog } from "@/components/finance/new-transaction-dialog";
import { TransactionStatusSelect } from "@/components/finance/transaction-status-select";
import { TransactionStatusBadge } from "@/components/shared/transaction-status-badge";
import { MoneyValue } from "@/components/shared/money-value";
import { EmptyState } from "@/components/shared/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateShort } from "@/lib/utils/dates";
import { formatMoney } from "@/lib/utils/format";
import { Wallet } from "lucide-react";

export default async function FinancePage() {
  const [{ transactions, indicators }, clients] = await Promise.all([getFinanceData(), getClientsList()]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <h1 className="text-base font-medium text-foreground">Financeiro</h1>
          <p className="text-sm text-muted-foreground">{transactions.length} lançamentos</p>
        </div>
        <Suspense>
          <NewTransactionDialog clients={clients.map((c) => ({ id: c.id, company_name: c.company_name }))} />
        </Suspense>
      </div>

      <div className="grid grid-cols-2 gap-3 px-4 pb-3 sm:grid-cols-3 lg:grid-cols-5">
        <IndicatorCard label="Recebido no mês" value={formatMoney(indicators.revenueThisMonth)} />
        <IndicatorCard label="A receber" value={formatMoney(indicators.receivable)} />
        <IndicatorCard label="Receita potencial" value={formatMoney(indicators.potentialRevenue)} />
        <IndicatorCard label="Ticket médio" value={formatMoney(indicators.averageTicket)} />
        <IndicatorCard label="Clientes fechados" value={String(indicators.closedClientsThisMonth)} />
      </div>

      <div className="flex-1 overflow-y-auto border-t border-border">
        {transactions.length === 0 ? (
          <EmptyState icon={Wallet} title="Nenhum lançamento ainda" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead>Cliente/Projeto</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="text-foreground">{t.description}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {t.client?.company_name ?? t.project?.name ?? "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDateShort(t.due_date)}</TableCell>
                  <TableCell>
                    <MoneyValue value={t.amount} className={t.kind === "expense" ? "text-destructive" : "text-won"} />
                  </TableCell>
                  <TableCell>
                    {t.effective_status === "overdue" ? (
                      <TransactionStatusBadge status="overdue" />
                    ) : (
                      <TransactionStatusSelect id={t.id!} status={t.status!} />
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

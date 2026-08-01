import { getFunnelMetrics } from "@/lib/queries/dashboard";
import { getReportsData } from "@/lib/queries/reports";
import { getFinanceData } from "@/lib/queries/finance";
import { FunnelChart } from "@/components/dashboard/funnel-chart";
import { SimpleBarList } from "@/components/reports/simple-bar-list";
import { RevenueChart } from "@/components/reports/revenue-chart-lazy";
import { DashboardSection } from "@/components/dashboard/section";
import { IndicatorCard } from "@/components/shared/indicator-card";
import { formatMoney, formatPercent } from "@/lib/utils/format";

export default async function ReportsPage() {
  const [funnel, reports, finance] = await Promise.all([getFunnelMetrics(), getReportsData(), getFinanceData()]);

  const conversions = [
    { label: "Lead → resposta", value: funnel.prospected_count > 0 ? (funnel.responded_count / funnel.prospected_count) * 100 : null },
    { label: "Resposta → reunião", value: funnel.responded_count > 0 ? (funnel.meeting_count / funnel.responded_count) * 100 : null },
    { label: "Reunião → proposta", value: funnel.meeting_count > 0 ? (funnel.proposal_count / funnel.meeting_count) * 100 : null },
    { label: "Proposta → fechamento", value: funnel.proposal_count > 0 ? (funnel.won_count / funnel.proposal_count) * 100 : null },
  ];

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <h1 className="text-base font-medium text-foreground">Relatórios</h1>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <DashboardSection title="Funil de vendas">
          <FunnelChart metrics={funnel} />
        </DashboardSection>

        <DashboardSection title="Conversão">
          <div className="grid grid-cols-2 gap-3 p-4">
            {conversions.map((c) => (
              <IndicatorCard key={c.label} label={c.label} value={c.value !== null ? formatPercent(c.value) : "—"} />
            ))}
          </div>
        </DashboardSection>

        <DashboardSection title="Origem dos leads">
          <SimpleBarList items={reports.bySource} />
        </DashboardSection>

        <DashboardSection title="Por que estou perdendo vendas">
          <SimpleBarList items={reports.byLossReason} />
        </DashboardSection>
      </div>

      <DashboardSection title="Financeiro">
        <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3">
          <IndicatorCard label="Faturamento do mês" value={formatMoney(finance.indicators.revenueThisMonth)} />
          <IndicatorCard label="Ticket médio" value={formatMoney(finance.indicators.averageTicket)} />
          <IndicatorCard label="Valor potencial no pipeline" value={formatMoney(finance.indicators.potentialRevenue)} />
        </div>
        <RevenueChart data={reports.monthlyRevenue} />
      </DashboardSection>
    </div>
  );
}

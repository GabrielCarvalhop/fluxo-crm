import { getDashboardData, getFunnelMetrics } from "@/lib/queries/dashboard";
import { getCurrentProfile } from "@/lib/queries/reference";
import { buildAttentionItems } from "@/lib/rules/attention";
import { computeDashboardMetrics } from "@/lib/rules/metrics";
import { formatDate } from "@/lib/utils/dates";
import { formatMoney } from "@/lib/utils/format";
import { StatCard } from "@/components/dashboard/stat-card";
import { AttentionList } from "@/components/dashboard/attention-list";
import { AgendaToday } from "@/components/dashboard/agenda-today";
import { FunnelChart } from "@/components/dashboard/funnel-chart";
import { PipelineSummary } from "@/components/dashboard/pipeline-summary";
import { ProjectsInProgress } from "@/components/dashboard/projects-in-progress";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { DashboardSection } from "@/components/dashboard/section";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export default async function DashboardPage() {
  const [data, funnel, profile] = await Promise.all([getDashboardData(), getFunnelMetrics(), getCurrentProfile()]);

  const attentionItems = buildAttentionItems(data);
  const metrics = computeDashboardMetrics(data);
  const firstName = (profile?.full_name ?? "").split(" ")[0] || "";

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6">
      <div>
        <h1 className="text-lg font-semibold text-foreground">
          {greeting()}{firstName ? `, ${firstName}` : ""}
        </h1>
        <p className="text-sm text-muted-foreground capitalize">{formatDate(new Date().toISOString(), "EEEE, d 'de' MMMM")}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard label="Leads ativos" value={String(metrics.activeLeads)} href="/leads" />
        <StatCard label="Leads quentes" value={String(metrics.hotLeads)} href="/leads?temp=hot" />
        <StatCard label="Follow-ups hoje" value={String(metrics.followUpsToday)} href="/follow-ups" />
        <StatCard label="Reuniões (semana)" value={String(metrics.meetingsThisWeek)} href="/agenda" />
        <StatCard
          label="Propostas abertas"
          value={String(metrics.openProposalsCount)}
          sublabel={formatMoney(metrics.openProposalsValue)}
          href="/proposals"
        />
        <StatCard label="Projetos ativos" value={String(metrics.activeProjects)} href="/projects" />
        <StatCard label="A receber" value={formatMoney(metrics.receivable)} href="/finance" />
        <StatCard label="Faturamento do mês" value={formatMoney(metrics.revenueThisMonth)} href="/finance" />
      </div>

      <DashboardSection title="Precisa da sua atenção">
        <AttentionList items={attentionItems} />
      </DashboardSection>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <DashboardSection title="Agenda de hoje" action={{ label: "Ver agenda", href: "/agenda" }}>
          <AgendaToday meetings={data.meetings} followUps={data.followUps} />
        </DashboardSection>

        <DashboardSection title="Funil" action={{ label: "Relatórios", href: "/reports" }}>
          <FunnelChart metrics={funnel} />
        </DashboardSection>

        <DashboardSection title="Pipeline resumido" action={{ label: "Ver pipeline", href: "/pipeline" }}>
          <PipelineSummary leads={data.leads} stages={data.stages} />
        </DashboardSection>

        <DashboardSection title="Projetos em andamento" action={{ label: "Ver projetos", href: "/projects" }}>
          <ProjectsInProgress projects={data.projects} />
        </DashboardSection>
      </div>

      <DashboardSection title="Atividade recente">
        <RecentActivity logs={data.recentLogs} />
      </DashboardSection>
    </div>
  );
}

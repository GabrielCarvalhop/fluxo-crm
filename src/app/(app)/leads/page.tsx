import { Suspense } from "react";
import { getLeadsList } from "@/lib/queries/leads";
import { getReferenceData } from "@/lib/queries/reference";
import { LeadsFilters } from "@/components/leads/leads-filters";
import { LeadsTable } from "@/components/leads/leads-table";
import { NewLeadDialog } from "@/components/leads/new-lead-dialog";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; stage?: string; temp?: string }>;
}) {
  const params = await searchParams;
  const ref = await getReferenceData();
  const leads = await getLeadsList({ q: params.q, stageKey: params.stage, temperature: params.temp });

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <h1 className="text-base font-medium text-foreground">Leads</h1>
          <p className="text-sm text-muted-foreground">{leads.length} encontrados</p>
        </div>
        <Suspense>
          <NewLeadDialog segments={ref.segments} sources={ref.sources} />
        </Suspense>
      </div>
      <Suspense>
        <LeadsFilters stages={ref.stages} />
      </Suspense>
      <div className="flex-1 overflow-y-auto">
        <LeadsTable leads={leads} />
      </div>
    </div>
  );
}

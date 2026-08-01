import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { MoneyValue } from "@/components/shared/money-value";
import { ProjectStatusSelect } from "./project-status-select";
import { formatDateShort } from "@/lib/utils/dates";
import type { ProjectDetail } from "@/lib/queries/projects";

export function ProjectHeader({ project, progress }: { project: ProjectDetail["project"]; progress: ProjectDetail["progress"] }) {
  return (
    <div className="flex flex-col gap-3 border-b border-border px-6 py-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-foreground">{project.name}</h1>
          {project.client && (
            <Link href={`/clients/${project.client.id}`} className="text-sm text-muted-foreground hover:underline">
              {project.client.company_name}
            </Link>
          )}
        </div>
        <ProjectStatusSelect projectId={project.id} status={project.status} />
      </div>

      <div className="flex flex-wrap items-center gap-5 text-sm">
        <div className="flex min-w-40 items-center gap-2">
          <Progress value={progress?.progress_pct ?? 0} className="h-1.5 w-32" />
          <span className="text-xs text-text-subtle">{Math.round(progress?.progress_pct ?? 0)}%</span>
        </div>
        {project.value !== null && (
          <span className="text-muted-foreground">
            Valor: <MoneyValue value={project.value} />
          </span>
        )}
        {project.due_date && <span className="text-muted-foreground">Prazo: {formatDateShort(project.due_date)}</span>}
        {progress && (
          <span className="text-muted-foreground">
            Lucro estimado: <MoneyValue value={progress.profit_estimate} />
          </span>
        )}
      </div>
    </div>
  );
}

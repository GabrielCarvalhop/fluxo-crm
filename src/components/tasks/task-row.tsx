"use client";

import { useTransition } from "react";
import Link from "next/link";
import { updateTaskStatus } from "@/lib/actions/tasks";
import { Checkbox } from "@/components/ui/checkbox";
import { TaskPriorityBadge } from "@/components/shared/task-priority-badge";
import { formatDateShort, isOverdue } from "@/lib/utils/dates";
import { cn } from "@/lib/utils";
import type { TasksList } from "@/lib/queries/tasks";

export function TaskRow({ task }: { task: TasksList[number] }) {
  const [isPending, startTransition] = useTransition();
  const overdue = task.status !== "done" && isOverdue(task.due_at);
  const entityName = task.lead?.company_name ?? task.client?.company_name ?? task.project?.name;
  const entityHref = task.lead_id ? `/leads/${task.lead_id}` : task.client_id ? `/clients/${task.client_id}` : task.project_id ? `/projects/${task.project_id}` : null;

  return (
    <div className="flex items-center gap-3 border-b border-border px-4 py-2.5 last:border-0">
      <Checkbox
        checked={task.status === "done"}
        disabled={isPending}
        onCheckedChange={(checked) => startTransition(() => updateTaskStatus({ id: task.id, status: checked ? "done" : "pending" }))}
      />
      <div className="min-w-0 flex-1">
        <p className={cn("truncate text-sm", task.status === "done" ? "text-muted-foreground line-through" : "text-foreground")}>
          {task.title}
        </p>
        {entityName && (
          entityHref ? (
            <Link href={entityHref} className="text-xs text-text-subtle hover:underline">{entityName}</Link>
          ) : (
            <span className="text-xs text-text-subtle">{entityName}</span>
          )
        )}
      </div>
      <TaskPriorityBadge priority={task.priority} />
      {task.due_at && (
        <span className={cn("w-20 shrink-0 text-right text-xs", overdue ? "text-destructive" : "text-text-subtle")}>
          {formatDateShort(task.due_at)}
        </span>
      )}
    </div>
  );
}

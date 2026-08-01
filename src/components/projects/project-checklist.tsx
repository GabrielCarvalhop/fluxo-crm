"use client";

import { useTransition } from "react";
import { toggleChecklistItem } from "@/lib/actions/projects";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { ProjectDetail } from "@/lib/queries/projects";

export function ProjectChecklist({
  projectId,
  clientId,
  groups,
}: {
  projectId: string;
  clientId?: string | null;
  groups: ProjectDetail["checklistGroups"];
}) {
  const [, startTransition] = useTransition();

  if (groups.length === 0) {
    return <p className="text-sm text-muted-foreground">Nenhum checklist neste projeto ainda.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      {groups.map((group) => {
        const done = group.items.filter((i) => i.done).length;
        return (
          <div key={group.id}>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground">{group.label}</h3>
              <span className="text-xs text-text-subtle">{done}/{group.items.length}</span>
            </div>
            <div className="flex flex-col gap-1.5">
              {group.items.map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm hover:bg-accent/50"
                >
                  <Checkbox
                    checked={item.done}
                    onCheckedChange={(checked) =>
                      startTransition(() =>
                        toggleChecklistItem({ id: item.id, done: checked === true, projectId, clientId })
                      )
                    }
                  />
                  <span className={cn(item.done && "text-muted-foreground line-through")}>{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

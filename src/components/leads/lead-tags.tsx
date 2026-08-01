"use client";

import { useTransition } from "react";
import { Plus, X } from "lucide-react";
import { toggleLeadTag } from "@/lib/actions/leads";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function LeadTags({
  leadId,
  currentTags,
  allTags,
}: {
  leadId: string;
  currentTags: { id: string; label: string }[];
  allTags: { id: string; label: string }[];
}) {
  const [, startTransition] = useTransition();
  const currentIds = new Set(currentTags.map((t) => t.id));

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-text-subtle uppercase">Tags</span>
      <div className="flex flex-wrap items-center gap-1.5">
        {currentTags.map((tag) => (
          <Badge key={tag.id} variant="secondary" className="gap-1 pr-1">
            {tag.label}
            <button
              onClick={() => startTransition(() => toggleLeadTag(leadId, tag.id, false))}
              className="rounded-full p-0.5 hover:bg-foreground/10"
              aria-label={`Remover tag ${tag.label}`}
            >
              <X className="size-2.5" />
            </button>
          </Badge>
        ))}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-xs" className="text-muted-foreground">
              <Plus className="size-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {allTags.map((tag) => (
              <DropdownMenuCheckboxItem
                key={tag.id}
                checked={currentIds.has(tag.id)}
                onCheckedChange={(checked) => startTransition(() => toggleLeadTag(leadId, tag.id, checked))}
              >
                {tag.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

"use client";

import { PanelLeft } from "lucide-react";
import { NAV, SETTINGS_LINK } from "@/lib/nav";
import { NavItem } from "./nav-item";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <aside
      className={cn(
        "hidden shrink-0 flex-col border-r border-border bg-sidebar transition-[width] duration-150 md:flex",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex h-14 shrink-0 items-center justify-between px-3">
        {!collapsed && (
          <span className="px-1 text-sm font-semibold tracking-tight text-foreground">Fluxo CRM</span>
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggle}
          className="ml-auto text-muted-foreground"
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          <PanelLeft className="size-4" />
        </Button>
      </div>

      <nav className="flex flex-1 flex-col gap-4 overflow-y-auto px-2.5 py-2">
        {NAV.map((entry, i) =>
          entry.kind === "link" ? (
            <NavItem key={entry.href} {...entry} collapsed={collapsed} />
          ) : (
            <div key={entry.label + i} className="flex flex-col gap-0.5">
              {!collapsed && (
                <span className="px-2.5 pb-1 text-[11px] font-medium tracking-wide text-text-subtle uppercase">
                  {entry.label}
                </span>
              )}
              <div className="flex flex-col gap-0.5">
                {entry.items.map((item) => (
                  <NavItem key={item.href} {...item} collapsed={collapsed} />
                ))}
              </div>
            </div>
          )
        )}
      </nav>

      <div className="border-t border-border px-2.5 py-2.5">
        <NavItem {...SETTINGS_LINK} collapsed={collapsed} />
      </div>
    </aside>
  );
}

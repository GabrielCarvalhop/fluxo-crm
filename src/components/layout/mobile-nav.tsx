"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { NAV, SETTINGS_LINK } from "@/lib/nav";
import { NavItem } from "./nav-item";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button
        variant="ghost"
        size="icon-sm"
        className="md:hidden"
        onClick={() => setOpen(true)}
        aria-label="Abrir menu"
      >
        <Menu className="size-4" />
      </Button>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="border-b border-border">
          <SheetTitle>Fluxo CRM</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-1 flex-col gap-4 overflow-y-auto px-2.5 py-3" onClick={() => setOpen(false)}>
          {NAV.map((entry, i) =>
            entry.kind === "link" ? (
              <NavItem key={entry.href} {...entry} />
            ) : (
              <div key={entry.label + i} className="flex flex-col gap-0.5">
                <span className="px-2.5 pb-1 text-[11px] font-medium tracking-wide text-text-subtle uppercase">
                  {entry.label}
                </span>
                {entry.items.map((item) => (
                  <NavItem key={item.href} {...item} />
                ))}
              </div>
            )
          )}
          <div className="mt-auto border-t border-border pt-2.5">
            <NavItem {...SETTINGS_LINK} />
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

"use client";

import { Search } from "lucide-react";
import { MobileNav } from "./mobile-nav";
import { NewButton } from "./new-button";
import { NotificationsPopover } from "./notifications-popover";

export function Topbar({
  userMenu,
  onOpenSearch,
}: {
  userMenu: React.ReactNode;
  onOpenSearch: () => void;
}) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-3 md:px-4">
      <MobileNav />

      <button
        onClick={onOpenSearch}
        className="flex h-8 w-full max-w-72 items-center gap-2 rounded-md border border-border bg-transparent px-2.5 text-sm text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
      >
        <Search className="size-3.5 shrink-0" />
        <span className="truncate">Buscar…</span>
        <kbd className="ml-auto hidden shrink-0 rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-text-subtle sm:inline-block">
          Ctrl K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-1.5">
        <NewButton />
        <NotificationsPopover />
        {userMenu}
      </div>
    </header>
  );
}

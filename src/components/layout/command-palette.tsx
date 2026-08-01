"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Building2, FolderKanban, FileText, ListChecks, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

type SearchRow = { type: string; id: string; title: string; subtitle: string | null };

const TYPE_META: Record<string, { label: string; icon: typeof Users; href: (id: string) => string }> = {
  lead: { label: "Lead", icon: Users, href: (id) => `/leads/${id}` },
  client: { label: "Cliente", icon: Building2, href: (id) => `/clients/${id}` },
  project: { label: "Projeto", icon: FolderKanban, href: (id) => `/projects/${id}` },
  proposal: { label: "Proposta", icon: FileText, href: (id) => `/proposals/${id}` },
  task: { label: "Tarefa", icon: ListChecks, href: (id) => `/tasks/${id}` },
};

export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const timeout = setTimeout(async () => {
      const { data } = await supabase.rpc("global_search", { q: query.trim() });
      setResults((data as SearchRow[] | null) ?? []);
      setLoading(false);
    }, 200);

    return () => clearTimeout(timeout);
  }, [query]);

  function select(row: SearchRow) {
    const meta = TYPE_META[row.type];
    if (!meta) return;
    onOpenChange(false);
    router.push(meta.href(row.id));
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} title="Busca" description="Buscar clientes, leads, projetos, propostas e tarefas">
      <CommandInput placeholder="Buscar clientes, leads, projetos…" value={query} onValueChange={setQuery} />
      <CommandList>
        {query.trim().length < 2 && (
          <CommandEmpty>Digite ao menos 2 letras para buscar.</CommandEmpty>
        )}
        {query.trim().length >= 2 && loading && (
          <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
            <Loader2 className="size-3.5 animate-spin" />
            Buscando…
          </div>
        )}
        {query.trim().length >= 2 && !loading && results.length === 0 && (
          <CommandEmpty>Nada encontrado para &quot;{query}&quot;.</CommandEmpty>
        )}
        {results.length > 0 && (
          <CommandGroup heading="Resultados">
            {results.map((row) => {
              const meta = TYPE_META[row.type];
              const Icon = meta?.icon ?? FileText;
              return (
                <CommandItem key={`${row.type}-${row.id}`} value={`${row.type}-${row.id}`} onSelect={() => select(row)}>
                  <Icon className="size-4 text-muted-foreground" />
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate">{row.title}</span>
                    {row.subtitle && (
                      <span className="truncate text-xs text-muted-foreground">
                        {meta?.label} · {row.subtitle}
                      </span>
                    )}
                  </div>
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}

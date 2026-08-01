"use client";

import { useRouter } from "next/navigation";
import { Plus, UserPlus, Building2, ListPlus, CalendarPlus, FileText, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Convenção: cada rota lê ?new=1 e abre seu modal/drawer de criação.
// As páginas de destino ainda não existem (chegam na Fatia 1+) — o botão
// já fica pronto para não precisar mexer aqui de novo depois.
const ITEMS = [
  { href: "/leads?new=1", label: "Lead", icon: UserPlus },
  { href: "/clients?new=1", label: "Cliente", icon: Building2 },
  { href: "/tasks?new=1", label: "Tarefa", icon: ListPlus },
  { href: "/agenda?new=1", label: "Reunião", icon: CalendarPlus },
  { href: "/proposals?new=1", label: "Proposta", icon: FileText },
  { href: "/projects?new=1", label: "Projeto", icon: FolderPlus },
];

export function NewButton() {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" className="gap-1">
          <Plus className="size-4" />
          Novo
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {ITEMS.map((item) => (
          <DropdownMenuItem key={item.href} onSelect={() => router.push(item.href)}>
            <item.icon className="size-4 text-muted-foreground" />
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

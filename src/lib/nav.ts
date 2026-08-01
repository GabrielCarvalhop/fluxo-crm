import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Columns3,
  Users,
  Building2,
  AlarmClock,
  Calendar,
  FolderKanban,
  ListChecks,
  FileText,
  Wallet,
  BarChart3,
  Settings,
} from "lucide-react";

export type NavLink = { href: string; label: string; icon: LucideIcon };
export type NavGroup = { label: string; items: NavLink[] };
export type NavEntry = ({ kind: "link" } & NavLink) | ({ kind: "group" } & NavGroup);

/** Fonte única da navegação — usada pela sidebar de desktop e pelo menu mobile. */
export const NAV: NavEntry[] = [
  { kind: "link", href: "/", label: "Dashboard", icon: LayoutDashboard },
  {
    kind: "group",
    label: "CRM",
    items: [
      { href: "/pipeline", label: "Pipeline", icon: Columns3 },
      { href: "/leads", label: "Leads", icon: Users },
      { href: "/clients", label: "Clientes", icon: Building2 },
    ],
  },
  { kind: "link", href: "/follow-ups", label: "Follow-ups", icon: AlarmClock },
  { kind: "link", href: "/agenda", label: "Agenda", icon: Calendar },
  { kind: "link", href: "/projects", label: "Projetos", icon: FolderKanban },
  { kind: "link", href: "/tasks", label: "Tarefas", icon: ListChecks },
  { kind: "link", href: "/proposals", label: "Propostas", icon: FileText },
  { kind: "link", href: "/finance", label: "Financeiro", icon: Wallet },
  { kind: "link", href: "/reports", label: "Relatórios", icon: BarChart3 },
];

export const SETTINGS_LINK: NavLink = { href: "/settings", label: "Configurações", icon: Settings };

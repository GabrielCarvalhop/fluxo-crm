import { formatDistanceToNowStrict, format, isToday, isTomorrow, isYesterday, isPast } from "date-fns";
import { ptBR } from "date-fns/locale";

export function relativeTime(iso: string | null | undefined) {
  if (!iso) return "—";
  return formatDistanceToNowStrict(new Date(iso), { locale: ptBR, addSuffix: true });
}

export function formatDate(iso: string | null | undefined, pattern = "d 'de' MMMM") {
  if (!iso) return "—";
  return format(new Date(iso), pattern, { locale: ptBR });
}

export function formatDateShort(iso: string | null | undefined) {
  if (!iso) return "—";
  return format(new Date(iso), "dd/MM/yyyy", { locale: ptBR });
}

export function formatDateTime(iso: string | null | undefined) {
  if (!iso) return "—";
  return format(new Date(iso), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
}

export function formatTime(iso: string | null | undefined) {
  if (!iso) return "—";
  return format(new Date(iso), "HH:mm", { locale: ptBR });
}

export function friendlyDayLabel(iso: string | null | undefined) {
  if (!iso) return "";
  const date = new Date(iso);
  if (isToday(date)) return "Hoje";
  if (isTomorrow(date)) return "Amanhã";
  if (isYesterday(date)) return "Ontem";
  return format(date, "EEEE, d 'de' MMMM", { locale: ptBR });
}

export function isOverdue(iso: string | null | undefined) {
  if (!iso) return false;
  return isPast(new Date(iso)) && !isToday(new Date(iso));
}

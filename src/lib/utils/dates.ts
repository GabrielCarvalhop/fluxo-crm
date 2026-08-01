import {
  formatDistanceToNowStrict,
  format,
  isToday,
  isTomorrow,
  isYesterday,
  isPast,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
  eachDayOfInterval,
} from "date-fns";
import { ptBR } from "date-fns/locale";

export function getDayRange(date: Date) {
  return { from: startOfDay(date), to: endOfDay(date) };
}

export function getWeekRange(date: Date) {
  return { from: startOfWeek(date, { weekStartsOn: 1 }), to: endOfWeek(date, { weekStartsOn: 1 }) };
}

export function getMonthRange(date: Date) {
  const from = startOfWeek(startOfMonth(date), { weekStartsOn: 1 });
  const to = endOfWeek(endOfMonth(date), { weekStartsOn: 1 });
  return { from, to };
}

export function daysInRange(from: Date, to: Date) {
  return eachDayOfInterval({ start: from, end: to });
}

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

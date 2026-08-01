/** Monta um link wa.me a partir de um telefone em qualquer formato comum no Brasil. */
export function buildWhatsAppLink(phone: string | null | undefined, message?: string) {
  if (!phone) return null;
  let digits = phone.replace(/\D/g, "");
  if (!digits.startsWith("55")) digits = `55${digits}`;
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Interpola {{variavel}} num template de mensagem. */
export function interpolateTemplate(body: string, vars: Record<string, string | null | undefined>) {
  return body.replace(/\{\{(\w+)\}\}/g, (_, key: string) => vars[key] ?? "");
}

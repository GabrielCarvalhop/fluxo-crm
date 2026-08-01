import type { LucideIcon } from "lucide-react";

/**
 * Placeholder para rotas do sitemap ainda não construídas (chegam nas
 * próximas fatias). Existe para que a navegação inteira funcione desde a
 * Fatia 0, em vez de 404 — troque por conteúdo real fatia a fatia.
 */
export function PlaceholderPage({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 py-24 text-center">
      <div className="flex size-11 items-center justify-center rounded-lg bg-accent">
        <Icon className="size-5 text-muted-foreground" />
      </div>
      <h1 className="text-base font-medium text-foreground">{title}</h1>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

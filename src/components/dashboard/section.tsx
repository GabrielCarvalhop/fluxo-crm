import Link from "next/link";

export function DashboardSection({
  title,
  action,
  children,
}: {
  title: string;
  action?: { label: string; href: string };
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <h2 className="text-sm font-medium text-foreground">{title}</h2>
        {action && (
          <Link href={action.href} className="text-xs text-muted-foreground hover:text-foreground">
            {action.label} →
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}

export function SimpleBarList({ items }: { items: { label: string; count: number }[] }) {
  const max = Math.max(...items.map((i) => i.count), 1);

  if (items.length === 0) {
    return <p className="px-4 py-3 text-sm text-muted-foreground">Sem dados ainda.</p>;
  }

  return (
    <div className="flex flex-col gap-2 p-4">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <span className="w-32 shrink-0 truncate text-xs text-muted-foreground">{item.label}</span>
          <div className="h-5 flex-1 overflow-hidden rounded bg-muted">
            <div
              className="flex h-full items-center justify-end rounded bg-primary/70 px-1.5"
              style={{ width: `${Math.max(6, Math.round((item.count / max) * 100))}%` }}
            >
              <span className="font-mono text-[11px] text-primary-foreground tabular-nums">{item.count}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

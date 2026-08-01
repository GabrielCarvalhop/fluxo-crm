import Link from "next/link";
import { cn } from "@/lib/utils";

const SOURCE_CLASSES: Record<string, string> = {
  meeting: "bg-cold/10 text-cold",
  follow_up: "bg-warm/10 text-warm",
  task: "bg-muted text-muted-foreground",
  project_deadline: "bg-hot/10 text-hot",
};

export function EventChip({
  time,
  title,
  href,
  source,
  className,
}: {
  time?: string;
  title: string;
  href: string;
  source: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "block truncate rounded px-1.5 py-0.5 text-xs hover:opacity-80",
        SOURCE_CLASSES[source] ?? "bg-muted text-muted-foreground",
        className
      )}
    >
      {time && <span className="font-mono tabular-nums">{time} </span>}
      {title}
    </Link>
  );
}

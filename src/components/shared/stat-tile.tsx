import type { ReactNode } from "react";

import { Surface } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type StatTileProps = {
  className?: string;
  hint?: string;
  icon?: ReactNode;
  label: string;
  value: ReactNode;
};

export const StatTile = ({ className, hint, icon, label, value }: StatTileProps) => (
  <Surface className={cn("flex items-center gap-3 p-4", className)}>
    {icon ? (
      <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </span>
    ) : null}
    <div className="min-w-0">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="truncate font-display text-xl font-semibold tabular-nums">{value}</p>
      {hint ? <p className="truncate text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  </Surface>
);

import { type ReactNode } from "react";

import { cn } from "@/lib/cn";

export type EmptyStateProps = {
  action?: ReactNode;
  className?: string;
  description: string;
  icon?: ReactNode;
  title: string;
};

export const EmptyState = ({ action, className, description, icon, title }: EmptyStateProps) => (
  <div
    className={cn(
      "flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-surface/50 px-6 py-16 text-center",
      className,
    )}
  >
    {icon ? <div className="text-4xl" aria-hidden>{icon}</div> : null}
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
    {action ? <div className="mt-2">{action}</div> : null}
  </div>
);

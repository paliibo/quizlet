import { type HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export type BadgeTone = "accent" | "danger" | "muted" | "primary" | "success" | "warning";

const tones: Record<BadgeTone, string> = {
  accent: "bg-accent/15 text-accent",
  danger: "bg-danger/15 text-danger",
  muted: "bg-muted text-muted-foreground",
  primary: "bg-primary/15 text-primary",
  success: "bg-success/15 text-success",
  warning: "bg-warning/20 text-warning",
};

export type BadgeProps = { tone?: BadgeTone } & HTMLAttributes<HTMLSpanElement>;

export const Badge = ({ className, tone = "muted", ...props }: BadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium leading-5",
      tones[tone],
      className,
    )}
    {...props}
  />
);

import { type HTMLAttributes, forwardRef } from "react";

import { cn } from "@/lib/cn";

export type SurfaceProps = {
  /** Lift the card and add a ring on hover — for anything clickable. */
  interactive?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export const Surface = forwardRef<HTMLDivElement, SurfaceProps>(({ className, interactive, ...props }, ref) => (
  <div
    className={cn(
      "rounded-xl border border-border bg-card text-card-foreground shadow-raised",
      interactive &&
        "transition-all duration-300 focus-within:border-primary/40 hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow",
      className,
    )}
    ref={ref}
    {...props}
  />
));
Surface.displayName = "Surface";

export const SurfaceHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-1 p-5 pb-3", className)} {...props} />
);

export const SurfaceTitle = ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn("text-lg font-semibold leading-tight", className)} {...props} />
);

export const SurfaceDescription = ({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("text-sm text-muted-foreground", className)} {...props} />
);

export const SurfaceBody = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-5 pt-0", className)} {...props} />
);

export const SurfaceFooter = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex items-center gap-2 border-t border-border p-5", className)} {...props} />
);

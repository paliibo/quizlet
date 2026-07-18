import { cn } from "@/lib/cn";

export const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div aria-hidden className={cn("skeleton h-4 w-full", className)} {...props} />
);

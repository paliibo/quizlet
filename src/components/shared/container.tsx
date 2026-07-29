import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export const Container = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn("mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12", className)}>{children}</div>
);

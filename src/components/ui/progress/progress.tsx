"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";
export const Progress = forwardRef<
  ElementRef<typeof ProgressPrimitive.Root>,
  ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    className={"relative min-h-4 w-full overflow-hidden rounded-full bg-[#f3f4f6]"}
    ref={ref}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-[#7c3aed] transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = "Progress";

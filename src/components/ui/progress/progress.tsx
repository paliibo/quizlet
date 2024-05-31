"use client";

import { Indicator, Root } from "@radix-ui/react-progress";
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export const Progress = forwardRef<ElementRef<typeof Root>, ComponentPropsWithoutRef<typeof Root>>(
  ({ className, value, ...props }, ref) => (
    <Root
      className={twMerge("relative h-2 w-full overflow-hidden rounded-full bg-stone-900/20", className)}
      ref={ref}
      {...props}
    >
      <Indicator
        className="h-full w-full flex-1 bg-purple-700 transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </Root>
  ),
);
Progress.displayName = Root.displayName;

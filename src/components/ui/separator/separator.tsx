"use client";

import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { ComponentPropsWithoutRef, ElementRef, forwardRef, memo } from "react";

export const Separator = memo(
  forwardRef<ElementRef<typeof SeparatorPrimitive.Root>, ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>>(
    ({ className, decorative = true, orientation = "horizontal", ...props }, ref) => (
      <SeparatorPrimitive.Root
        className={"bg-border h-[1px] w-full shrink-0 rounded-lg bg-gray-300"}
        decorative={decorative}
        orientation={orientation}
        ref={ref}
        {...props}
      />
    ),
  ),
);
Separator.displayName = "Separator";

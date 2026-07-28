"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { type ReactNode } from "react";

export const TooltipProvider = TooltipPrimitive.Provider;

export const Tooltip = ({ children, label }: { children: ReactNode; label: string }) => (
  <TooltipPrimitive.Root>
    <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        className="z-50 animate-fade-in rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs shadow-raised"
        sideOffset={6}
      >
        {label}
        <TooltipPrimitive.Arrow className="fill-[hsl(var(--surface))]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  </TooltipPrimitive.Root>
);

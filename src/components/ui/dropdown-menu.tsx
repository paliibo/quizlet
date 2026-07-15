"use client";

import * as DropdownPrimitive from "@radix-ui/react-dropdown-menu";
import { type ComponentPropsWithoutRef, type ElementRef, forwardRef } from "react";

import { cn } from "@/lib/cn";

export const DropdownMenu = DropdownPrimitive.Root;
export const DropdownMenuTrigger = DropdownPrimitive.Trigger;

export const DropdownMenuContent = forwardRef<
  ElementRef<typeof DropdownPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DropdownPrimitive.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
  <DropdownPrimitive.Portal>
    <DropdownPrimitive.Content
      className={cn(
        "z-50 min-w-44 overflow-hidden rounded-lg border border-border bg-surface p-1 shadow-raised",
        "data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
        className,
      )}
      ref={ref}
      sideOffset={sideOffset}
      {...props}
    />
  </DropdownPrimitive.Portal>
));
DropdownMenuContent.displayName = "DropdownMenuContent";

export const DropdownMenuItem = forwardRef<
  ElementRef<typeof DropdownPrimitive.Item>,
  { destructive?: boolean } & ComponentPropsWithoutRef<typeof DropdownPrimitive.Item>
>(({ className, destructive, ...props }, ref) => (
  <DropdownPrimitive.Item
    className={cn(
      "flex cursor-pointer select-none items-center gap-2 rounded-md px-2.5 py-2 text-sm outline-none transition-colors",
      "focus:bg-muted data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      destructive && "text-danger focus:bg-danger/10",
      className,
    )}
    ref={ref}
    {...props}
  />
));
DropdownMenuItem.displayName = "DropdownMenuItem";

export const DropdownMenuSeparator = () => <DropdownPrimitive.Separator className="my-1 h-px bg-border" />;

export const DropdownMenuLabel = ({ className, ...props }: ComponentPropsWithoutRef<typeof DropdownPrimitive.Label>) => (
  <DropdownPrimitive.Label
    className={cn("px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground", className)}
    {...props}
  />
);

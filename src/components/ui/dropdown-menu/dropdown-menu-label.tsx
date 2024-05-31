"use client";
import { Label } from "@radix-ui/react-dropdown-menu";
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export const DropdownMenuLabel = forwardRef<
  ElementRef<typeof Label>,
  {
    inset?: boolean;
  } & ComponentPropsWithoutRef<typeof Label>
>(({ className, inset, ...props }, ref) => (
  <Label className={twMerge("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)} ref={ref} {...props} />
));
DropdownMenuLabel.displayName = Label.displayName;

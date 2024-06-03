"use client";
import { ChevronUpIcon } from "@radix-ui/react-icons";
import { ScrollUpButton } from "@radix-ui/react-select";
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export const SelectScrollUpButton = forwardRef<
  ElementRef<typeof ScrollUpButton>,
  ComponentPropsWithoutRef<typeof ScrollUpButton>
>(({ className, ...props }, ref) => (
  <ScrollUpButton
    className={twMerge("flex cursor-default items-center justify-center py-1", className)}
    ref={ref}
    {...props}
  >
    <ChevronUpIcon />
  </ScrollUpButton>
));
SelectScrollUpButton.displayName = ScrollUpButton.displayName;

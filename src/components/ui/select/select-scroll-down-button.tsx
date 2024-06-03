"use client";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { ScrollDownButton } from "@radix-ui/react-select";
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export const SelectScrollDownButton = forwardRef<
  ElementRef<typeof ScrollDownButton>,
  ComponentPropsWithoutRef<typeof ScrollDownButton>
>(({ className, ...props }, ref) => (
  <ScrollDownButton
    className={twMerge("flex cursor-default items-center justify-center py-1", className)}
    ref={ref}
    {...props}
  >
    <ChevronDownIcon />
  </ScrollDownButton>
));
SelectScrollDownButton.displayName = ScrollDownButton.displayName;

"use client";
import { Item } from "@radix-ui/react-dropdown-menu";
import { ComponentPropsWithoutRef, ElementRef, forwardRef, memo } from "react";
import { twMerge } from "tailwind-merge";

export const DropdownMenuItem = memo(
  forwardRef<
    ElementRef<typeof Item>,
    {
      inset?: boolean;
    } & ComponentPropsWithoutRef<typeof Item>
  >(({ className, inset, ...props }, ref) => (
    <Item
      className={twMerge(
        "relative flex cursor-default select-none items-center rounded-sm px-0.5 py-0.5 text-sm outline-none transition-colors focus:bg-stone-100 focus:text-stone-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-stone-800 dark:focus:text-stone-50",
        inset && "pl-8",
        className,
      )}
      ref={ref}
      {...props}
    />
  )),
);
DropdownMenuItem.displayName = Item.displayName;

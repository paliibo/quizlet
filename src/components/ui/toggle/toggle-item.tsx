"use client";
import { Item } from "@radix-ui/react-toggle-group";
import { ComponentPropsWithoutRef, ElementRef, forwardRef, useState } from "react";
import { twMerge } from "tailwind-merge";

export const ToggleItem = forwardRef<ElementRef<typeof Item>, ComponentPropsWithoutRef<typeof Item>>(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <div className={twMerge("w-full", className)}>
        <Item
          className={twMerge(
            `flex h-8 w-8 items-center justify-center gap-2 rounded-lg bg-white p-1 transition-all ease-in-out aria-[checked=true]:bg-purple-600 aria-[pressed=true]:bg-purple-600`,
          )}
          ref={forwardedRef}
          {...props}
        ></Item>
        <div className={"w-full"}>{children}</div>
      </div>
    );
  },
);
ToggleItem.displayName = Item.displayName;

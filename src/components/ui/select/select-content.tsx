"use client";
import { Content, Portal, SelectScrollDownButton, SelectScrollUpButton, Viewport } from "@radix-ui/react-select";
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export const SelectContent = forwardRef<ElementRef<typeof Content>, ComponentPropsWithoutRef<typeof Content>>(
  ({ children, className, position = "popper", ...props }, ref) => (
    <Portal>
      <Content
        className={twMerge(
          "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-stone-200 bg-white text-stone-950 shadow-md dark:border-stone-800 dark:bg-stone-950 dark:text-stone-50",
          className,
        )}
        position={position}
        ref={ref}
        {...props}
      >
        <SelectScrollUpButton />
        <Viewport className={twMerge("")}>{children}</Viewport>
        <SelectScrollDownButton />
      </Content>
    </Portal>
  ),
);
SelectContent.displayName = Content.displayName;

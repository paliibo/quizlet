"use client";
import { CheckIcon } from "@radix-ui/react-icons";
import { Indicator, RadioGroupItem } from "@radix-ui/react-radio-group";
import { ComponentPropsWithoutRef, ElementRef, forwardRef, memo } from "react";
import { twMerge } from "tailwind-merge";

export const RadioItem = memo(
  forwardRef<ElementRef<typeof RadioGroupItem>, ComponentPropsWithoutRef<typeof RadioGroupItem>>(
    ({ children, className, ...props }, ref) => (
      <RadioGroupItem
        className={twMerge(
          "relative flex w-full cursor-default items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-stone-100 focus:text-stone-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-stone-800 dark:focus:text-stone-50",
          className,
        )}
        ref={ref}
        {...props}
      >
        <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
          <Indicator>
            <CheckIcon className="h-4 w-4" />
          </Indicator>
        </span>
        <label>{children}</label>
      </RadioGroupItem>
    ),
  ),
);
RadioItem.displayName = RadioGroupItem.displayName;

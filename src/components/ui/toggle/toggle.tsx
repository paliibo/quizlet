"use client";

import { Root } from "@radix-ui/react-toggle-group";
import React, { ComponentPropsWithoutRef, ElementRef, forwardRef, memo } from "react";
import { twMerge } from "tailwind-merge";

export type ToggleGroupProps = {
  containerClassName?: string;
  error?: false | string;
  label?: string;
} & ComponentPropsWithoutRef<typeof Root>;
export type ToggleGroupRef = ElementRef<typeof Root>;

export const Toggle = memo(
  forwardRef<ToggleGroupRef, ToggleGroupProps>(
    ({ children, containerClassName = "", error, label = "", type, ...props }, ref) => {
      return (
        <div className={twMerge("max-w-full")}>
          {/*@ts-ignore*/}
          <Root className={twMerge("flex flex-col gap-2", containerClassName)} ref={ref} type={type} {...props}>
            {children}
          </Root>
          <div>{!!error && error}</div>
        </div>
      );
    },
  ),
);
Toggle.displayName = "Toggle";

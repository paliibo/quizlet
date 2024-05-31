"use client";

import { SelectProps as RadixSelectProps, Root } from "@radix-ui/react-select";
import { FC } from "react";
import { twMerge } from "tailwind-merge";

export type SelectProps = {
  containerClassName?: string;
  error?: false | string;
  label?: string;
} & RadixSelectProps;

export const Select: FC<SelectProps> = ({ children, containerClassName, error, label, ...props }) => {
  return (
    <div className={twMerge("max-w-full", containerClassName)}>
      <Root {...props}>{children}</Root>
    </div>
  );
};
Select.displayName = "Select";

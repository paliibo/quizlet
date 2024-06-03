"use client";

import { Root, ToggleGroupMultipleProps, ToggleGroupSingleProps } from "@radix-ui/react-toggle-group";
import React, { FC } from "react";
import { twMerge } from "tailwind-merge";

export type ToggleGroupProps = {
  containerClassName?: string;
  error?: false | string;
  label?: string;
} & (ToggleGroupMultipleProps | ToggleGroupSingleProps);

export const Toggle: FC<ToggleGroupProps> = ({
  children,
  containerClassName = "",
  error,
  label = "",
  type,
  ...props
}) => {
  return (
    <div className={twMerge("max-w-full")}>
      {/*@ts-ignore*/}
      <Root className={twMerge("flex flex-col gap-2", containerClassName)} type={type} {...props}>
        {children}
      </Root>
      <div>{!!error && error}</div>
    </div>
  );
};
Toggle.displayName = "Toggle";

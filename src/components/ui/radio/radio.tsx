"use client";

import { RadioGroupProps as RadixRadioProps, Root } from "@radix-ui/react-radio-group";
import { FC } from "react";
import { twMerge } from "tailwind-merge";

export type RadioProps = {
  containerClassName?: string;
  error?: false | string;
  label?: string;
} & RadixRadioProps;

export const Radio: FC<RadioProps> = ({ children, containerClassName = "", error = false, label = "", ...props }) => {
  return (
    <div className={twMerge("max-w-full", containerClassName)}>
      <Root {...props}>{children}</Root>
    </div>
  );
};
Radio.displayName = "Radio";

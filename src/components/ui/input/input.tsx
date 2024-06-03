import React, { InputHTMLAttributes, forwardRef, useState } from "react";

export type InputProps = {
  containerClassName?: string;
  error?: false | string;
  label?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, containerClassName, defaultValue = "", error, label, type, ...props }, ref) => {
    return (
      <div className={"h-full w-full" + containerClassName}>
        <input
          className={`placeholder:text-gray h-full min-h-8 w-full border px-2 text-sm placeholder:text-sm placeholder:font-normal focus:outline-none ${!!error ? "border-red-400" : "border-grey"} w-full rounded-md`}
          ref={ref}
          type={type}
          {...props}
        />
        <div>{error}</div>
      </div>
    );
  },
);
Input.displayName = "Input";

"use client";
import { FC, HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export const DropdownMenuShortcut: FC<HTMLAttributes<HTMLSpanElement>> = ({ className, ...props }) => {
  return <span className={twMerge("ml-auto text-xs tracking-widest opacity-60", className)} {...props} />;
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

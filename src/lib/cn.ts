import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names and let later Tailwind utilities win. */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

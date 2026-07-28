"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import { type ComponentPropsWithoutRef, type ElementRef, forwardRef } from "react";

import { cn } from "@/lib/cn";
import { clamp } from "@/lib/format";

export const Progress = forwardRef<
  ElementRef<typeof ProgressPrimitive.Root>,
  ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => {
  const percent = clamp(value ?? 0, 0, 100);

  return (
    <ProgressPrimitive.Root
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-muted", className)}
      ref={ref}
      value={percent}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full rounded-full bg-gradient-to-r from-primary to-accent transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${100 - percent}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = "Progress";

export type RingProps = {
  className?: string;
  label?: string;
  size?: number;
  strokeWidth?: number;
  /** 0..1 */
  value: number;
};

/** Circular progress used for deck mastery. Purely decorative, so aria-hidden. */
export const Ring = ({ className, label, size = 56, strokeWidth = 5, value }: RingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamp(value, 0, 1));

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ height: size, width: size }}
    >
      <svg aria-hidden height={size} viewBox={`0 0 ${size} ${size}`} width={size}>
        <circle
          className="text-muted"
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
        />
        <circle
          className="text-primary transition-[stroke-dashoffset] duration-700 ease-out"
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radius}
          stroke="currentColor"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      {label ? <span className="absolute text-[11px] font-semibold tabular-nums">{label}</span> : null}
    </div>
  );
};

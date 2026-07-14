"use client";

import { Slot } from "@radix-ui/react-slot";
import { type ButtonHTMLAttributes, forwardRef } from "react";

import { cn } from "@/lib/cn";

export type ButtonSize = "icon" | "lg" | "md" | "sm";
export type ButtonVariant = "danger" | "ghost" | "outline" | "primary" | "secondary" | "subtle";

export type ButtonProps = {
  asChild?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const variants: Record<ButtonVariant, string> = {
  danger: "bg-danger text-danger-foreground shadow-raised hover:brightness-110 active:brightness-95",
  ghost: "text-foreground hover:bg-muted",
  outline: "border border-border bg-transparent text-foreground hover:bg-muted",
  primary:
    "bg-primary text-primary-foreground shadow-raised hover:shadow-glow hover:brightness-110 active:brightness-95",
  secondary: "bg-muted text-foreground hover:bg-border",
  subtle: "bg-primary/10 text-primary hover:bg-primary/20",
};

const sizes: Record<ButtonSize, string> = {
  icon: "h-10 w-10 justify-center p-0",
  lg: "h-12 px-6 text-base",
  md: "h-10 px-4 text-sm",
  sm: "h-8 px-3 text-xs",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild = false, className, size = "md", type, variant = "primary", ...props }, ref) => {
    const Component = asChild ? Slot : "button";

    return (
      <Component
        className={cn(
          "inline-flex select-none items-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all duration-200",
          "disabled:pointer-events-none disabled:opacity-50",
          "active:scale-[0.98]",
          variants[variant],
          sizes[size],
          className,
        )}
        ref={ref}
        type={asChild ? undefined : (type ?? "button")}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

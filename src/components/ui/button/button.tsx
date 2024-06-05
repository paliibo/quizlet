import { Slot } from "@radix-ui/react-slot";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export type ButtonProps = {
  asChild?: boolean;
  onAction?: () => void;
} & ButtonHTMLAttributes<HTMLButtonElement>;
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild = false, className, onAction, ...props }, ref) => {
    const Component = asChild ? Slot : "button";

    return (
      <div onClick={onAction}>
        <Component
          className={twMerge(
            "min-h-8 w-full rounded-lg bg-purple-600 px-4 py-0.5 text-sm font-medium text-white transition-all ease-in-out hover:bg-purple-800",
            className,
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);
Button.displayName = "Button";

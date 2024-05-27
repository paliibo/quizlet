import { ReactNode, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

type ButtonProps = {
  children: ReactNode;
  className?: string;
  id?: string;
};
export const Card = forwardRef<HTMLDivElement, ButtonProps>(
  ({ children, className = "", id = "", ...props }, forwardRef) => {
    return (
      <div className={twMerge("rounded-lg bg-white shadow-2xl", className)} id={id} {...props}>
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";

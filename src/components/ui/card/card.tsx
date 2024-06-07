import { ReactNode, forwardRef, memo } from "react";
import { twMerge } from "tailwind-merge";

type ButtonProps = {
  children: ReactNode;
  className?: string;
  id?: string;
};
export const Card = memo(
  forwardRef<HTMLDivElement, ButtonProps>(({ children, className = "", id = "", ...props }, ref) => {
    return (
      <div className={twMerge("rounded-lg bg-white shadow-2xl", className)} id={id} ref={ref} {...props}>
        {children}
      </div>
    );
  }),
);

Card.displayName = "Card";

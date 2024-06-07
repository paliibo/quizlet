import { Button, ButtonProps } from "@/components/ui/button/button";
import { ReactNode, forwardRef, memo } from "react";

export type FormButtonProps = {
  children: ReactNode;
  disabled?: boolean;
} & ButtonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

export const FormButton = memo(
  forwardRef<HTMLButtonElement, FormButtonProps>(({ children, disabled, type, ...props }, ref) => {
    return (
      <Button ref={ref} type={type} {...props}>
        {children}
      </Button>
    );
  }),
);

FormButton.displayName = "FormButton";

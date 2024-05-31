import React, { ReactNode } from "react";

type ButtonProps = {
  action: () => void;
  children?: ReactNode;
  className: string;
};
export const Button = ({ action, children, className = "" }: ButtonProps) => {
  return (
    <button className={className} onClick={action} type={"button"}>
      {children}
    </button>
  );
};

Button.displayName = "Button";

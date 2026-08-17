"use client";

import { type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes, forwardRef, useId } from "react";

import { cn } from "@/lib/cn";

const control =
  "w-full rounded-lg border border-input bg-surface px-3 py-2 text-sm text-foreground shadow-sunken transition-colors " +
  "placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40 " +
  "disabled:cursor-not-allowed disabled:opacity-60";

export type FieldProps = {
  children: ReactNode;
  error?: string;
  hint?: string;
  htmlFor?: string;
  label?: string;
};

export const Field = ({ children, error, hint, htmlFor, label }: FieldProps) => (
  <div className="flex flex-col gap-1.5">
    {label ? (
      <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground" htmlFor={htmlFor}>
        {label}
      </label>
    ) : null}
    {children}
    {error ? (
      <p className="text-xs font-medium text-danger">{error}</p>
    ) : hint ? (
      <p className="text-xs text-muted-foreground">{hint}</p>
    ) : null}
  </div>
);

export type TextInputProps = {
  error?: string;
  hint?: string;
  label?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, error, hint, id, label, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    const input = (
      <input
        aria-invalid={Boolean(error)}
        className={cn(control, error && "border-danger focus:border-danger focus:ring-danger/30", className)}
        id={inputId}
        ref={ref}
        {...props}
      />
    );

    return label || error || hint ? (
      <Field error={error} hint={hint} htmlFor={inputId} label={label}>
        {input}
      </Field>
    ) : (
      input
    );
  },
);
TextInput.displayName = "TextInput";

export type TextAreaProps = {
  error?: string;
  hint?: string;
  label?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, error, hint, id, label, ...props }, ref) => {
    const generatedId = useId();
    const areaId = id ?? generatedId;

    const area = (
      <textarea
        aria-invalid={Boolean(error)}
        className={cn(control, "min-h-24 resize-y", error && "border-danger", className)}
        id={areaId}
        ref={ref}
        {...props}
      />
    );

    return label || error || hint ? (
      <Field error={error} hint={hint} htmlFor={areaId} label={label}>
        {area}
      </Field>
    ) : (
      area
    );
  },
);
TextArea.displayName = "TextArea";

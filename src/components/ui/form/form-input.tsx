// @ts-nocheck
import { Input, InputProps } from "@/components/ui/input/";
import { QuizData } from "@/types/types";
import { ReactElement, memo } from "react";
import { Control, FieldPathByValue, FieldValues, PathValue, useController } from "react-hook-form";

export type FormInputProps<
  TFieldValues extends FieldValues,
  TPath extends FieldPathByValue<TFieldValues, boolean | null | number | string | undefined>,
> = {
  control: Control<QuizData & TFieldValues>;
  defaultValue?: PathValue<TFieldValues, TPath>;
  name: TPath;
} & Omit<InputProps, "defaultValue" | "onBlur" | "onChange" | "value">;

export const FormInput = memo(
  <
    TFieldValues extends FieldValues,
    TPath extends FieldPathByValue<TFieldValues, boolean | null | number | string | undefined>,
  >({
    control,
    defaultValue,
    name,
    type,
    ...props
  }: FormInputProps<TFieldValues, TPath>): ReactElement | null => {
    const { field, fieldState } = useController({
      control,
      defaultValue,
      name,
      rules: {
        pattern:
          type === "number"
            ? {
                message: "Please enter a number",
                value: /^[0-9]+$/,
              }
            : undefined,
        required: "Shouldn't be empty",
      },
    });

    return (
      <Input
        {...props}
        {...field}
        error={fieldState.isTouched && (fieldState.error?.message ?? fieldState.error?.type)}
      />
    );
  },
);
FormInput.displayName = "FormInput";

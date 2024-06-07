import { Radio, RadioProps } from "@/components/ui/radio";
import { ReactElement, memo } from "react";
import { Control, FieldPathByValue, FieldValues, PathValue, useController } from "react-hook-form";

export type FormRadioProps<
  TFieldValues extends FieldValues,
  TPath extends FieldPathByValue<TFieldValues, boolean | number | string>,
> = {
  control: Control<TFieldValues>;
  defaultValue?: PathValue<TFieldValues, TPath>;
  name: TPath;
} & { containerClassName?: string } & Omit<RadioProps, "defaultValue" | "onBlur" | "onChange" | "value">;

export const FormRadio = memo(
  <TFieldValues extends FieldValues, TPath extends FieldPathByValue<TFieldValues, boolean | number | string>>({
    children,
    containerClassName,
    control,
    defaultValue,
    name,
    ...props
  }: FormRadioProps<TFieldValues, TPath>): ReactElement | null => {
    const { field, fieldState } = useController({
      control,
      defaultValue,
      name,
    });

    return (
      <Radio
        {...props}
        defaultValue={field.value}
        error={fieldState.isTouched && (fieldState.error?.message ?? fieldState.error?.type)}
        onSelect={field.onChange}
      >
        {children}
      </Radio>
    );
  },
);

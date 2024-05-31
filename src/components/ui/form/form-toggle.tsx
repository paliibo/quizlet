import { Toggle, ToggleGroupProps } from "@/components/ui/toggle";
import { ReactElement } from "react";
import { Control, FieldPathByValue, FieldValues, PathValue, useController } from "react-hook-form";

export type FormCheckboxProps<
  TFieldValues extends FieldValues,
  TPath extends FieldPathByValue<TFieldValues, unknown>,
> = {
  control: Control<TFieldValues>;
  defaultValue?: PathValue<TFieldValues, TPath>;
  name: TPath;
} & { containerClassName?: string } & Omit<ToggleGroupProps, "defaultValue" | "onBlur" | "onChange" | "value">;

export const FormToggle = <TFieldValues extends FieldValues, TPath extends FieldPathByValue<TFieldValues, unknown>>({
  children,
  containerClassName,
  control,
  defaultValue,
  name,
  type,
  ...props
}: FormCheckboxProps<TFieldValues, TPath>): ReactElement | null => {
  const { field, fieldState } = useController({
    control,
    defaultValue,
    name,
  });

  return (
    <>
      {/*@ts-ignore*/}
      <Toggle
        containerClassName={containerClassName}
        defaultValue={field.value}
        error={fieldState.isTouched && (fieldState.error?.message ?? fieldState.error?.type)}
        onValueChange={field.onChange}
        type={type}
        {...props}
      >
        {children}
      </Toggle>
    </>
  );
};

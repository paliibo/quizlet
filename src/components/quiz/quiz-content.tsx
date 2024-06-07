// @ts-nocheck
import { FormInput, FormToggle } from "@/components/ui/form";
import { ToggleItem } from "@/components/ui/toggle";
import { QuestionContentProps } from "@/types/types";
import { FC } from "react";

export const QuizContent: FC<Omit<QuestionContentProps, "type" | "update">> = ({ control, field, fieldIndex }) => {
  if (field.type === "multi") {
    if (!field || !field.options) return;

    return (
      <div className={"flex h-full w-full shrink flex-col p-2"}>
        <div className={"flex h-full w-full items-center rounded-md bg-blue-100 px-4 py-2"}>{field.title}</div>
        <FormToggle
          containerClassName={"flex w-full p-2 gap-2"}
          control={control}
          name={`answers.${fieldIndex}`}
          type={"multiple"}
        >
          {field.options.map((option, optionIndex) => {
            return (
              <ToggleItem className={"flex w-full gap-2"} key={optionIndex} value={option}>
                <div className={"bg flex h-full w-full items-center rounded-md bg-white px-4"}>{option}</div>
              </ToggleItem>
            );
          })}
        </FormToggle>
      </div>
    );
  }
  if (field.type === "text") {
    return (
      <div className={"flex h-full w-full shrink flex-col gap-2 p-2"}>
        <div className={"flex h-full w-full items-center rounded-md bg-blue-100 px-4 py-2"}>{field.title}</div>
        <FormInput
          control={control}
          defaultValue={"Your answer"}
          name={`answers.${fieldIndex}`}
          placeholder={"Correct answer"}
          type="text"
        />
      </div>
    );
  }
  return (
    <div className={"flex h-full w-full shrink flex-col p-2"}>
      <div className={"flex h-full w-full items-center rounded-md bg-blue-100 px-4 py-2"}>{field.title}</div>
      <FormToggle
        containerClassName={"flex w-full p-2 gap-2"}
        control={control}
        defaultValue={["0"]}
        name={`answers.${fieldIndex}`}
        type={"single"}
      >
        {field.options!.map((option, optionIndex) => {
          return (
            <ToggleItem className={"flex w-full gap-2"} key={optionIndex} value={option}>
              <div className={"bg flex h-full w-full items-center rounded-md bg-white px-4"}>{option}</div>
            </ToggleItem>
          );
        })}
      </FormToggle>
    </div>
  );
};

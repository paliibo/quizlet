import { FormButton, FormInput, FormToggle } from "@/components/ui/form";
import { QuestionContentProps } from "@/types/types";
import { FC, memo } from "react";

import { ToggleItem } from "../ui/toggle";

export const CreateQuestionContent: FC<QuestionContentProps> = memo(({ control, field, fieldIndex, type, update }) => {
  if (type === "multi") {
    if (!field || !field.options) return;

    return (
      <div>
        <div className={"flex justify-end gap-4"}>
          <FormButton
            onAction={() => {
              if (!field.options) return;

              if (field.options.length == 5) return;
              update(fieldIndex, {
                ...field,
                options: [...field.options, `Option ${field.options.length + 1}`],
              });
            }}
            type={"button"}
          >
            Add Option
          </FormButton>
          <FormButton
            onAction={() => {
              if (!field.options || !field.answer) return;

              if (field.options.length <= 2) return;
              update(fieldIndex, {
                ...field,
                answer: field.answer.filter(value => {
                  if (!field.options) return;

                  if (field.options[2] === value) return "";
                  return value;
                }),
                options: field.options.filter((value, index) => {
                  if (!field.options) return;

                  if (index === field.options.length - 1) return;
                  return value;
                }),
              });
            }}
            type="button"
          >
            Remove Option
          </FormButton>
        </div>
        <FormToggle
          containerClassName={"flex p-2 gap-2"}
          control={control}
          name={`questions.${fieldIndex}.answer`}
          type={"multiple"}
        >
          {field.options.map((option, optionIndex) => {
            return (
              <ToggleItem className={"flex gap-2"} key={optionIndex} value={option}>
                <FormInput
                  control={control}
                  name={`questions.${fieldIndex}.options.${optionIndex}`}
                  placeholder={`${option}`}
                  type="text"
                />
              </ToggleItem>
            );
          })}
        </FormToggle>
      </div>
    );
  }
  if (type === "text") {
    return (
      <>
        <FormInput
          control={control}
          name={`questions.${fieldIndex}.answer.0`}
          placeholder={"Correct answer"}
          type="text"
        />
      </>
    );
  }
  return (
    <div>
      <div className={"flex justify-end gap-4"}>
        <FormButton
          onAction={() => {
            if (!field.options) return;

            if (field.options.length == 5) return;
            update(fieldIndex, {
              ...field,
              options: [...field.options, `Option ${field.options.length + 1}`],
            });
          }}
          type={"button"}
        >
          Add Option
        </FormButton>
        <FormButton
          onAction={() => {
            if (!field.options) return;

            if (field.options.length <= 2) return;
            update(fieldIndex, {
              ...field,
              options: field.options.filter((value, index) => {
                if (index === field.options!.length - 1) return;
                return value;
              }),
            });
          }}
          type="button"
        >
          Remove Option
        </FormButton>
      </div>
      <FormToggle
        containerClassName={"flex p-2 gap-2"}
        control={control}
        defaultValue={["0"]}
        name={`questions.${fieldIndex}.answer`}
        type={"single"}
      >
        {field.options!.map((option, optionIndex) => {
          return (
            <ToggleItem className={"flex gap-2"} key={optionIndex} value={option}>
              <FormInput
                control={control}
                name={`questions.${fieldIndex}.options.${optionIndex}`}
                placeholder={`${option}`}
                type="text"
              />
            </ToggleItem>
          );
        })}
      </FormToggle>
    </div>
  );
});

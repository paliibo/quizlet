import { CreateQuestionContent } from "@/components/create-quiz-content/create-question-item";
import { FormInput, FormSelect } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QuestionContentProps } from "@/types/types";
import { FC, memo } from "react";
import { useWatch } from "react-hook-form";

export const CreateQuizContent: FC<Omit<QuestionContentProps, "type">> = memo(
  ({ control, field, fieldIndex, update }) => {
    const type = useWatch({
      control,
      name: `questions.${fieldIndex}.type`,
    });
    return (
      <div className={"flex flex-col gap-4 rounded-lg bg-blue-200 p-6"}>
        <div className={"flex flex-1 gap-2"}>
          <div className={"relative"}>
            <Label>Question Title</Label>
            <FormInput
              control={control}
              name={`questions.${fieldIndex}.title`}
              placeholder={"Your question title"}
              type="text"
            />
          </div>
          <div className={"relative"}>
            <Label>Question Points</Label>
            <FormInput
              control={control}
              name={`questions.${fieldIndex}.points`}
              placeholder={"Point for question"}
              type="number"
            />
          </div>
          <div className={"relative"}>
            <Label>Question Type</Label>
            <FormSelect
              containerClassName={"bg-white"}
              control={control}
              defaultValue={"regular"}
              name={`questions.${fieldIndex}.type`}
            >
              <SelectTrigger>
                <SelectValue placeholder={"Select question type"} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={"multi"}>Multiple Option</SelectItem>
                  <SelectItem value={"text"}>Selfwrite (Text)</SelectItem>
                  <SelectItem value={"regular"}>Ordinar (One option)</SelectItem>
                </SelectGroup>
              </SelectContent>
            </FormSelect>
          </div>
        </div>
        <CreateQuestionContent control={control} field={field} fieldIndex={fieldIndex} type={type} update={update} />
      </div>
    );
  },
);

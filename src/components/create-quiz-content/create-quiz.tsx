import { localStorageUtil } from "@/api/quiz";
import { CreateQuizContent } from "@/components/create-quiz-content/create-quiz-content";
import { FormButton, FormInput } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { QuizData } from "@/types/types";
import { useRouter } from "next/navigation";
import { memo } from "react";
import { FieldValues, FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form";

export const CreateQuiz = memo(({ id, quizFields }: { id?: number; quizFields?: QuizData }) => {
  const router = useRouter();
  const form = useForm<FieldValues & QuizData>({
    defaultValues: quizFields
      ? {
          questions: [...quizFields.questions],
          quizTitle: quizFields.quizTitle,
        }
      : {
          questions: [
            {
              answer: ["Option 1"],
              options: ["Option 1", "Option 2"],
              points: 5,
              title: "What is the ...",
              type: "regular",
            },
          ],
          quizTitle: "Quiz",
        },
    mode: "onTouched",
  });
  const { control, handleSubmit } = form;
  const { append, fields, remove, update } = useFieldArray({
    control,
    name: "questions",
  });
  const quesitions = useWatch({
    control,
    name: "questions",
  });
  const handleQuizSubmit = (data: QuizData) => {
    if (window) {
      const quiz = localStorageUtil("quiz").get() as QuizData[];
      if (!quiz) {
        localStorageUtil("quiz").set(JSON.stringify([data]));
      }
      if (id) {
        let editedQuiz = quiz.map((value, index) => {
          if (index == id) {
            return data;
          }
          return value;
        });
        localStorageUtil("quiz").delete();
        localStorageUtil("quiz").set(editedQuiz);
        router.push("/");
        return;
      }
      quiz.push(data);
      localStorageUtil("quiz").delete();
      localStorageUtil("quiz").set(quiz);
      router.push("/");
      return;
    }
  };
  return (
    <FormProvider {...form}>
      <form
        className={"mx-auto min-h-60 min-w-96 flex-shrink-0 flex-col justify-center rounded-lg bg-white p-8"}
        onSubmit={handleSubmit(handleQuizSubmit)}
      >
        <div className={"flex justify-between gap-4"}>
          <div className={"relative"}>
            <Label>Quiz Title</Label>
            <FormInput control={control} name={"quizTitle"} />
          </div>
          <div className={"flex gap-4"}>
            <FormButton
              onAction={() =>
                append({
                  answer: [],
                  options: ["Option 1", "Option 2"],
                  points: 5,
                  title: "What is the...",
                  type: "regular",
                })
              }
              type={"button"}
            >
              Add Question
            </FormButton>
            <FormButton
              onAction={() => {
                if (quesitions.length <= 1) return;
                remove(-1);
              }}
              type="button"
            >
              Remove Question
            </FormButton>
          </div>
        </div>
        <div className={"flex flex-col gap-8 py-8"}>
          {fields.map((field, fieldIndex) => {
            return (
              <CreateQuizContent
                control={control}
                field={field}
                fieldIndex={fieldIndex}
                key={fieldIndex}
                update={update}
              />
            );
          })}
        </div>
        <div className={"flex justify-center"}>
          <FormButton type="submit">Submit</FormButton>
        </div>
      </form>
    </FormProvider>
  );
});

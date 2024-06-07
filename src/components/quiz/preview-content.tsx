import { QuestionContentProps } from "@/types/types";
import { CheckIcon, PersonIcon } from "@radix-ui/react-icons";
import { FC } from "react";

export const PreviewContent: FC<
  {
    result: {
      answers: string[];
    };
  } & Omit<QuestionContentProps, "control" | "type" | "update">
> = ({ field, fieldIndex, result }) => {
  if (field.type === "text") {
    return (
      <div className={"flex h-full w-full shrink flex-col gap-2 p-2"}>
        <div className={"flex h-full w-full items-center rounded-md bg-blue-100 px-4 py-2"}>
          Correct answer: {field.answer[0]}
        </div>
        <div className={"flex h-full w-full items-center rounded-md bg-white px-4 py-2"}>
          Your answer: {result.answers[fieldIndex]}
        </div>
      </div>
    );
  }
  if (field.type === "multi") {
    return (
      <div className={"flex h-full w-full shrink flex-col gap-2 p-2"}>
        <div className={"flex h-full w-full items-center rounded-md bg-blue-100 px-4 py-2"}>{field.title}</div>
        {field.options!.map((option, optionIndex) => {
          console.log(result, field);
          if (field.answer[optionIndex] == result.answers[optionIndex]) {
            return (
              <div className={"flex w-full justify-between"} key={optionIndex}>
                <div className={"flex items-center gap-2"}>
                  <div
                    className={
                      "flex aspect-square h-8 items-center justify-center gap-2 rounded-lg bg-purple-600 p-1 transition-all ease-in-out"
                    }
                  >
                    <PersonIcon className={"text-white"} />
                  </div>
                  <div className={"rounded-lg bg-white px-4 py-2"}>{option}</div>
                </div>
                <div className={"flex aspect-square items-center justify-center rounded-full bg-green-600 px-2"}>
                  <CheckIcon className={"text-white"} />
                </div>
              </div>
            );
          } else {
            // @ts-ignore
            if (option == field.answer) {
              return (
                <div className={"flex w-full justify-between"} key={optionIndex}>
                  <div className={"flex items-center gap-2"}>
                    <div
                      className={
                        "flex aspect-square h-8 items-center justify-center gap-2 rounded-lg bg-white p-1 transition-all ease-in-out"
                      }
                    ></div>
                    <div className={"rounded-lg bg-white px-4 py-2"}>{option}</div>
                  </div>
                  <div className={"flex aspect-square items-center justify-center rounded-full bg-green-600 px-2"}>
                    <CheckIcon className={"text-white"} />
                  </div>
                </div>
              );
            } else if (option == result.answers[optionIndex]) {
              return (
                <div className={"flex items-center gap-2"} key={optionIndex}>
                  <div
                    className={
                      "flex aspect-square h-8 items-center justify-center gap-2 rounded-lg bg-purple-600 p-1 transition-all ease-in-out"
                    }
                  >
                    <PersonIcon className={"text-white"} />
                  </div>
                  <div className={"rounded-lg bg-white px-4 py-2"}>{option}</div>
                </div>
              );
            } else {
              return (
                <div className={"flex items-center gap-2"} key={optionIndex}>
                  <div
                    className={
                      "flex h-8 w-8 items-center justify-center gap-2 rounded-lg bg-white p-1 transition-all ease-in-out"
                    }
                  ></div>
                  <div className={"rounded-lg bg-white px-4 py-2"}>{option}</div>
                </div>
              );
            }
          }
        })}
      </div>
    );
  }
  return (
    <div className={"flex h-full w-full shrink flex-col gap-2 p-2"}>
      <div className={"flex h-full w-full items-center rounded-md bg-blue-100 px-4 py-2"}>{field.title}</div>
      {field.options!.map((option, optionIndex) => {
        if (field.answer[optionIndex] == result.answers[optionIndex]) {
          return (
            <div className={"flex w-full justify-between"} key={optionIndex}>
              <div className={"flex items-center gap-2"}>
                <div
                  className={
                    "flex aspect-square h-8 items-center justify-center gap-2 rounded-lg bg-purple-600 p-1 transition-all ease-in-out"
                  }
                >
                  <PersonIcon className={"text-white"} />
                </div>
                <div className={"rounded-lg bg-white px-4 py-2"}>{option}</div>
              </div>
              <div className={"flex aspect-square items-center justify-center rounded-full bg-green-600 px-2"}>
                <CheckIcon className={"text-white"} />
              </div>
            </div>
          );
        } else {
          // @ts-ignore
          if (option == field.answer) {
            return (
              <div className={"flex w-full justify-between"} key={optionIndex}>
                <div className={"flex items-center gap-2"}>
                  <div
                    className={
                      "flex aspect-square h-8 items-center justify-center gap-2 rounded-lg bg-white p-1 transition-all ease-in-out"
                    }
                  ></div>
                  <div className={"rounded-lg bg-white px-4 py-2"}>{option}</div>
                </div>
                <div className={"flex aspect-square items-center justify-center rounded-full bg-green-600 px-2"}>
                  <CheckIcon className={"text-white"} />
                </div>
              </div>
            );
          } else if (option == result.answers[optionIndex]) {
            return (
              <div className={"flex items-center gap-2"} key={optionIndex}>
                <div
                  className={
                    "flex aspect-square h-8 items-center justify-center gap-2 rounded-lg bg-purple-600 p-1 transition-all ease-in-out"
                  }
                >
                  <PersonIcon className={"text-white"} />
                </div>
                <div className={"rounded-lg bg-white px-4 py-2"}>{option}</div>
              </div>
            );
          } else {
            return (
              <div className={"flex items-center gap-2"} key={optionIndex}>
                <div
                  className={
                    "flex h-8 w-8 items-center justify-center gap-2 rounded-lg bg-white p-1 transition-all ease-in-out"
                  }
                ></div>
                <div className={"rounded-lg bg-white px-4 py-2"}>{option}</div>
              </div>
            );
          }
        }
      })}
    </div>
  );
};

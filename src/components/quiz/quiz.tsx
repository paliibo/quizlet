// @ts-nocheck
"use client";
import { PreviewContent } from "@/components/quiz/preview-content";
import { QuizContent } from "@/components/quiz/quiz-content";
import { Button } from "@/components/ui/button";
import { FormButton } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { QuestionData } from "@/types/types";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Pie } from "react-chartjs-2";
import { FormProvider, useForm } from "react-hook-form";
ChartJS.register(ArcElement, Tooltip, Legend);

export const Quiz = ({ questionAndAnswers }: { questionAndAnswers: QuestionData[] }) => {
  const Ref = useRef<NodeJS.Timer | null>(null);
  const [timer, setTimer] = useState("00:10:00");
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isPreview, setPreview] = useState(false);
  const [formData, setFormData] = useState({});
  const [result, setResult] = useState({
    correct: 0,
    totalPoints: 0,
    wrong: 0,
  });

  const form = useForm({
    defaultValues: {
      answers: [],
    },
    mode: "onSubmit",
  });
  const { control, handleSubmit } = form;
  const handleQuizSubmit = (data: unknown) => {
    setFormData(data);
    const tempRes = {
      correct: 0,
      totalPoints: 0,
      wrong: 0,
    };
    // @ts-ignore
    console.log(data);
    data.answers.map((value: string[], index: number) => {
      if (questionAndAnswers[index].type === "multi") {
        let amountOfCorrectAnswers = questionAndAnswers[index].answer.length;
        let userCorrectAnswers = 0;
        let total = questionAndAnswers[index].points;
        if (!Array.isArray(value)) {
          if (value === questionAndAnswers[index].answer[index]) {
            userCorrectAnswers += 1;
          }
        } else {
          value.map((value: string, index: number) => {
            console.log(questionAndAnswers[index].answer[index]);
            console.log(questionAndAnswers[index].answer);
            console.log(value);
            // @ts-ignore
            if (value === questionAndAnswers[index].answer[index] || value === questionAndAnswers[index].answer) {
              userCorrectAnswers += 1;
            }
          });
        }
        if (userCorrectAnswers === amountOfCorrectAnswers) {
          tempRes.correct += 1;
          tempRes.totalPoints += questionAndAnswers[index].points;
        } else if (userCorrectAnswers === 0) {
          tempRes.wrong += 1;
        } else {
          tempRes.correct += 0.5;
          tempRes.totalPoints += Math.floor((userCorrectAnswers / amountOfCorrectAnswers) * total);
        }
      }
      if (questionAndAnswers[index].type === "text") {
        // @ts-ignore
        if (value === questionAndAnswers[index].answer[0]) {
          tempRes.correct += 1;
          tempRes.totalPoints += questionAndAnswers[index].points;
        } else {
          tempRes.wrong += 1;
        }
      }
      if (questionAndAnswers[index].type === "regular") {
        console.log(value);
        // @ts-ignore
        if (value[0] === questionAndAnswers[index].answer[0] || value[0] === questionAndAnswers[index].answer) {
          tempRes.correct += 1;
          tempRes.totalPoints += questionAndAnswers[index].points;
        } else {
          tempRes.wrong += 1;
        }
      }
    });
    setResult(tempRes);
    setIsFinished(true);
  };
  const getTimeRemaining = (e: Date) => {
    const total = Date.parse(e.toString()) - Date.parse(new Date().toString());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / 1000 / 60 / 60) % 24);
    return {
      hours,
      minutes,
      seconds,
      total,
    };
  };
  const startTimer = (e: Date) => {
    let { hours, minutes, seconds, total } = getTimeRemaining(e);
    if (total >= 0) {
      setTimer(
        (hours > 9 ? hours : "0" + hours) +
          ":" +
          (minutes > 9 ? minutes : "0" + minutes) +
          ":" +
          (seconds > 9 ? seconds : "0" + seconds),
      );
    }
  };
  const clearTimer = (e: Date) => {
    setTimer("00:10:00");
    if (Ref.current) {
      // @ts-ignore
      clearInterval(Ref.current);
    }
    const id = setInterval(() => {
      startTimer(e);
    }, 1000);
    Ref.current = id;
  };
  const getDeadTime: () => Date = () => {
    let deadline = new Date();
    deadline.setSeconds(deadline.getSeconds() + 600);
    return deadline;
  };
  useEffect(() => {
    clearTimer(getDeadTime());
  }, []);

  useEffect(() => {
    if (Ref && isFinished) {
      // @ts-ignore
      clearInterval(Ref.current);
    }
  }, [isFinished]);
  if (timer === "00:00:00") {
    setIsFinished(true);
  }
  return (
    <>
      {!isPreview ? (
        <FormProvider {...form}>
          <form
            className={
              "relative mx-auto flex min-h-72 w-1/2 min-w-[30rem] flex-col justify-center gap-4 rounded-lg bg-white p-8"
            }
            onSubmit={handleSubmit(handleQuizSubmit)}
          >
            <div className={"absolute left-4 top-4 text-indigo-600"}>{timer}</div>
            <div className={"flex items-center justify-center text-indigo-600"}>
              <h1 className={"text-4xl"}>Quizbrain</h1>
            </div>

            <Separator />

            <Progress value={(activeQuestion / (questionAndAnswers.length - 1)) * 100} />
            <div>
              {isFinished ? (
                <h2 className={"text-2xl"}>Results</h2>
              ) : (
                <h2 className={"text-2xl"}>
                  Question {activeQuestion + 1} of {questionAndAnswers.length}:
                </h2>
              )}
            </div>
            <div className={"flex w-full flex-1 justify-center rounded-md bg-blue-200 "}>
              {isFinished ? (
                <div className={"flex flex-col p-2"}>
                  {isFinished && (
                    <Pie
                      data={{
                        datasets: [
                          {
                            backgroundColor: ["rgba(54,235,63,0.2)", "rgba(255, 99, 132, 0.2)"],
                            data: [result.correct, result.wrong],
                            label: "# of Votes",
                          },
                        ],
                        labels: ["Correct", "Wrong"],
                      }}
                    />
                  )}
                  <div className={"m-2 flex justify-between gap-2 rounded-lg bg-cyan-800/40 px-2 py-0.5 text-white"}>
                    <span>Total Points: {result.totalPoints}</span>
                    <span>Correct Answer: {result.correct}</span>
                    <span>Wrong Answer: {result.wrong}</span>
                  </div>

                  <div className={"flex justify-center gap-2"}>
                    <Button
                      className={"bg-blue-600 hover:bg-blue-800"}
                      onClick={() => {
                        setActiveQuestion(0);
                        setIsFinished(false);
                        setPreview(true);
                      }}
                    >
                      Review
                    </Button>
                    <Link href={"/"}>
                      <Button>To home</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  {/*@ts-ignore*/}
                  <QuizContent
                    control={control}
                    field={questionAndAnswers[activeQuestion]}
                    fieldIndex={activeQuestion}
                  />
                </>
              )}
            </div>
            {!isFinished && (
              <div className={"flex justify-center p-4"}>
                {activeQuestion == questionAndAnswers.length - 1 ? (
                  <FormButton className={"rounded-lg bg-[#ef4444] px-4 py-2 text-white"} type={"submit"}>
                    Finish
                  </FormButton>
                ) : (
                  <Button
                    className={"rounded-lg bg-[#7c3aed] px-4 py-2 text-white"}
                    onAction={() => setActiveQuestion(prevState => prevState + 1)}
                    type={"button"}
                  >
                    Next
                  </Button>
                )}
              </div>
            )}
          </form>
        </FormProvider>
      ) : (
        <div className={"relative mx-auto flex min-h-72 w-1/2 flex-col justify-center gap-4 rounded-lg bg-white p-8"}>
          <div className={"flex items-center justify-center text-indigo-600"}>
            <h1 className={"text-4xl"}>Quizbrain</h1>
          </div>

          <Separator />

          <Progress value={(activeQuestion / (questionAndAnswers.length - 1)) * 100} />
          <div>
            {isFinished ? (
              <h2 className={"text-2xl"}>Results</h2>
            ) : (
              <h2 className={"text-2xl"}>
                Question {activeQuestion + 1} of {questionAndAnswers.length}:
              </h2>
            )}
          </div>
          <div className={"flex w-full flex-1 rounded-md bg-blue-200 "}>
            {/*@ts-ignore*/}
            <PreviewContent field={questionAndAnswers[activeQuestion]} fieldIndex={activeQuestion} result={formData} />
          </div>
          {!isFinished && (
            <div className={"flex justify-center p-4"}>
              {activeQuestion == questionAndAnswers.length - 1 ? (
                <Link href={"/"}>
                  <Button>To home</Button>
                </Link>
              ) : (
                <Button
                  className={"rounded-lg bg-[#7c3aed] px-4 py-2 text-white"}
                  onAction={() => setActiveQuestion(prevState => prevState + 1)}
                  type={"button"}
                >
                  Next
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

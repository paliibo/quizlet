"use client";
import { QuizContent } from "@/components/quiz/quiz-content";
import { Button } from "@/components/ui/button";
import { FormButton } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { QuestionData } from "@/types/types";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { useEffect, useRef, useState } from "react";
import { Pie } from "react-chartjs-2";
import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form";
ChartJS.register(ArcElement, Tooltip, Legend);

export const Quiz = ({ questionAndAnswers }: { questionAndAnswers: QuestionData[] }) => {
  const Ref = useRef<NodeJS.Timer | null>(null);
  const [timer, setTimer] = useState("00:10:00");
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [finished, setFinished] = useState(false);
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
    const tempRes = {
      correct: 0,
      totalPoints: 0,
      wrong: 0,
    };
    console.log(data);
    // @ts-ignore
    data.answers.map((value: string[], index: number) => {
      if (questionAndAnswers[index].type === "multi") {
        let amountOfCorrectAnswears = questionAndAnswers[index].answer.length;
        let userCorrectAnswears = 0;
        let total = questionAndAnswers[index].points;
        value.map((value: string, index: number) => {
          console.log(questionAndAnswers[index].answer[index]);
          console.log(questionAndAnswers[index].answer);
          console.log(value);
          // @ts-ignore
          if (value === questionAndAnswers[index].answer[index] || value === questionAndAnswers[index].answer) {
            userCorrectAnswears += 1;
          }
        });
        if (userCorrectAnswears === amountOfCorrectAnswears) {
          tempRes.correct += 1;
          tempRes.totalPoints += questionAndAnswers[index].points;
        } else if (userCorrectAnswears === 0) {
          tempRes.wrong += 1;
        } else {
          tempRes.correct += 0.5;
          tempRes.totalPoints += Math.floor((userCorrectAnswears / amountOfCorrectAnswears) * total);
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
        if (value[0] === questionAndAnswers[index].answer[0]) {
          tempRes.correct += 1;
          tempRes.totalPoints += questionAndAnswers[index].points;
        } else {
          tempRes.wrong += 1;
        }
      }
    });
    setResult(tempRes);
    setFinished(true);
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
    if (Ref && finished) {
      // @ts-ignore
      clearInterval(Ref.current);
    }
  }, [finished]);
  if (timer === "00:00:00") {
    setFinished(true);
  }
  return (
    <FormProvider {...form}>
      <form
        className={"relative mx-auto flex min-h-72 w-1/2 flex-col justify-center gap-4 rounded-lg bg-white p-8"}
        onSubmit={handleSubmit(handleQuizSubmit)}
      >
        <div className={"absolute left-4 top-4 text-indigo-600"}>{timer}</div>
        <div className={"flex items-center justify-center text-indigo-600"}>
          <h1 className={"text-4xl"}>Quizbrain</h1>
        </div>

        <Separator />

        <Progress value={(activeQuestion / (questionAndAnswers.length - 1)) * 100} />
        <div>
          {finished ? (
            <h2 className={"text-2xl"}>Results</h2>
          ) : (
            <h2 className={"text-2xl"}>
              Question {activeQuestion + 1} of {questionAndAnswers.length}:
            </h2>
          )}
        </div>
        <div className={"w-full flex-1 rounded-md bg-blue-200 "}>
          {finished ? (
            <div className={"flex flex-col p-2"}>
              {finished && (
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
              <span>Total Points: {result.totalPoints}</span>
              <span>Correct Answer: {result.correct}</span>
              <span>Wrong Answer: {result.wrong}</span>
            </div>
          ) : (
            <>
              {/*@ts-ignore*/}
              <QuizContent control={control} field={questionAndAnswers[activeQuestion]} fieldIndex={activeQuestion} />
            </>
          )}
        </div>
        {!finished && (
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
  );
};

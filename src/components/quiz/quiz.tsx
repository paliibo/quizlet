"use client";
import { QuizContent } from "@/components/quiz/quiz-content";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { QuestionData } from "@/types/questionData";
import { useEffect, useRef, useState } from "react";

export const Quiz = ({ questionAndAnswers }: { questionAndAnswers: QuestionData[] }) => {
  const Ref = useRef<NodeJS.Timer | null>(null);
  const [timer, setTimer] = useState("00:10:00");

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

  const [activeQuestion, setActiveQuestion] = useState(0);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState({
    correctAnswers: 0,
    points: 0,
    totalPoints: 0,
    wrongAnswers: 0,
  });
  if (timer === "00:00:00") {
    setFinished(true);
  }
  return (
    <Card className={"flex w-1/2 flex-col gap-y-2.5 p-6 text-black"}>
      <div className={"relative flex items-center justify-center text-indigo-600"}>
        <div className={"absolute left-0 top-1/2 -translate-y-1/2"}>{timer}</div>
        <h1 className={"text-4xl"}>Quizbrain</h1>
      </div>

      <Separator />

      <Progress value={(100 / questionAndAnswers.length) * (activeQuestion + 1)} />
      <div>
        {finished ? (
          <h2 className={"text-2xl"}>Results</h2>
        ) : (
          <h2 className={"text-2xl"}>
            Question {activeQuestion + 1} of {questionAndAnswers.length}:
          </h2>
        )}
      </div>
      <div className={"w-full flex-1"}>
        {finished ? (
          <div className={"flex flex-col"}>
            <span>Total Points: {result.totalPoints}</span>
            <span>Correct Answer: {result.correctAnswers}</span>
            <span>Wrong Answer: {result.wrongAnswers}</span>
          </div>
        ) : (
          <QuizContent activeQuestion={questionAndAnswers[activeQuestion]} onAction={setResult} />
        )}
      </div>
      {!finished && (
        <div className={"flex justify-center p-4"}>
          {activeQuestion == questionAndAnswers.length - 1 ? (
            <Button action={() => setFinished(true)} className={"rounded-lg bg-[#ef4444] px-4 py-2 text-white"}>
              Finish
            </Button>
          ) : (
            <Button
              action={() => setActiveQuestion(prevState => prevState + 1)}
              className={"rounded-lg bg-[#7c3aed] px-4 py-2 text-white"}
            >
              Submit
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};

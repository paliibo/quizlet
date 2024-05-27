import { QuestionData } from "@/types/questionData";
import { ResultData } from "@/types/resultData";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { RadioButtons } from "../ui/radio-button";

export const QuizContent = ({
  activeQuestion,
  onAction,
}: {
  activeQuestion: QuestionData;
  onAction: Dispatch<SetStateAction<ResultData>>;
}) => {
  const { answer, options, points, question, type } = activeQuestion;
  const [selectedAnswer, setSelectedAnswers] = useState<string | string[]>("");
  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => {
    if (!selectedAnswer) return;

    if (type === "text") {
      if (selectedAnswer === answer) {
        onAction(prevState => ({
          ...prevState,
          correctAnswers: prevState.correctAnswers + 1,
          totalPoints: prevState.totalPoints + points,
        }));
        return;
      } else {
        onAction(prevState => ({
          ...prevState,
          wrongAnswers: prevState.wrongAnswers + 1,
        }));
        return;
      }
    }
    if (type === "multi" && Array.isArray(selectedAnswer) && Array.isArray(answer)) {
      let amountOfCorrectAnswears = answer.length;
      let userCorrectAnswears = 0;
      let totalPoint = points;
      for (let i = 0; i <= selectedAnswer.length; i++) {
        for (let j = 0; i <= selectedAnswer.length; i++) {
          if (selectedAnswer[i] == answer[j]) {
            userCorrectAnswears += 1;
          }
        }
      }
      if (userCorrectAnswears === amountOfCorrectAnswears) {
        onAction(prevState => ({
          ...prevState,
          correctAnswers: prevState.correctAnswers + 1,
          totalPoints: prevState.totalPoints + points,
        }));
        return;
      }
      if (userCorrectAnswears === 0) {
        onAction(prevState => ({
          ...prevState,
          wrongAnswers: prevState.wrongAnswers + 1,
        }));
        return;
      }
      onAction(prevState => ({
        ...prevState,
        correctAnswers: prevState.correctAnswers + 0.5,
        totalPoints: prevState.totalPoints + Math.floor((userCorrectAnswears / amountOfCorrectAnswears) * totalPoint),
      }));
      return;
    }
    if (type === "regular") {
      if (selectedAnswer === activeQuestion.answer) {
        console.log("Correct");
        onAction(prevState => ({
          ...prevState,
          correctAnswers: prevState.correctAnswers + 1,
          totalPoints: prevState.totalPoints + points,
        }));
        return;
      }
      console.log("Not Correct");
      onAction(prevState => ({
        ...prevState,
        wrongAnswers: prevState.wrongAnswers + 1,
      }));
    }
  }, [selectedAnswer]);

  if (type == "text") {
    return (
      <div className={"flex flex-col gap-2 pl-4"}>
        <span>{question}</span>
        <input onChange={e => setSelectedAnswers(e.target.value)} placeholder={"Your Answear"} type="text" />
      </div>
    );
  }
  if (type == "multi") {
    if (!options) return;
    return (
      <div>
        <span>{question}</span>
        {options.map((answer, index) => (
          <button
            className={"flex items-center gap-2"}
            key={crypto.randomUUID()}
            onClick={() => {
              setSelected(prevState => {
                return !prevState
                  ? [index]
                  : prevState.includes(index)
                    ? prevState.filter(value => value !== index)
                    : [...prevState, index];
              });
              setSelectedAnswers(prevState => {
                return typeof prevState === "string"
                  ? [answer]
                  : prevState.includes(answer)
                    ? prevState.filter(value => value !== answer)
                    : [...prevState, answer];
              });
            }}
          >
            <div className={"flex aspect-square h-full w-[20px] items-center justify-center rounded-full bg-gray-400"}>
              <div
                className={`aspect-square h-[11px] w-[11px] rounded-full ${selected.includes(index) ? "bg-gray-800" : ""}`}
              ></div>
            </div>
            <div>{answer}</div>
          </button>
        ))}
      </div>
    );
  }
  if (!options) return;
  return (
    <div>
      <span>{question}</span>
      <RadioButtons labels={options} onAction={setSelectedAnswers} />
    </div>
  );
};

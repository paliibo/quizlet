"use client";
import { HomeContext } from "@/context/context";
import { HomeContextType } from "@/types/context";
import { QuizData } from "@/types/questionData";
import Link from "next/link";
import { useContext, useEffect } from "react";

export const Utilities = () => {
  // @ts-ignore
  const { isTracking, quiz, setQuiz, setTracking } = useContext<HomeContextType>(HomeContext);
  useEffect(() => {
    if (!isTracking) return;

    const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const element = event.target as HTMLDivElement;
      const id = element.id;
      if (id.includes("quiz")) {
        const idNum = id.split("-")[1];
        const newQuiz = quiz.filter((value: QuizData) => {
          if (`${value.id}` !== `${idNum}`) {
            return value;
          }
        });
        window.localStorage.removeItem("quiz");
        window.localStorage.setItem("quiz", JSON.stringify(newQuiz));
        setQuiz(newQuiz);
      }
    };
    document.addEventListener("click", () => handleClick);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("click", () => handleClick);
    };
  }, [isTracking]);
  return (
    <div className={"absolute  right-0 top-0 flex gap-2 p-4 text-white"}>
      <Link className={"flex aspect-square h-10 w-10 items-center justify-center rounded-full bg-green-600"} href={"/"}>
        +
      </Link>
      <div
        className={"flex aspect-square h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-red-600"}
        onClick={() => setTracking(prevState => !prevState)}
      >
        -
      </div>
    </div>
  );
};

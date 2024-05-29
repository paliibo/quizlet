"use client";

import { mockApi } from "@/api/quiz";
import { Header } from "@/components/shared/header";
import { Card } from "@/components/ui/card";
import { HomeContext } from "@/context/context";
import { QuizData } from "@/types/questionData";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [quiz, setQuiz] = useState<QuizData[] | undefined>();
  const [loading, setLoading] = useState(true);
  const [isTracking, setTracking] = useState(false);
  useEffect(() => {
    mockApi().then(res => {
      if (!res) return;
      const quizDataResult: QuizData[] = JSON.parse(res);
      setQuiz(quizDataResult);
      setLoading(false);
    });
    if (window) {
      window.localStorage.setItem(
        "quiz",
        JSON.stringify([
          {
            id: 1,
            questionAndAnswer: [
              {
                answer: "C++",
                id: 1,
                options: ["ReactJS", "C++", "JavaScript", "CSS"],
                points: 5,
                question: "Whch Programming Language is best for writing System Programs?",
                type: "regular",
              },
              {
                answer: "HTML",
                id: 2,
                options: ["Markdown", "Swift", "Kotlin", "HTML"],
                points: 5,
                question: "What is the building block of the web?",
                type: "regular",
              },
              {
                answer: "A step by step by detailed guide",
                id: 3,
                options: [
                  "A list of ToDos",
                  "A programming paradigm",
                  "A step by step by detailed guide",
                  "A programming problem",
                ],
                points: 5,
                question: "What is an Algorithm?",
                type: "regular",
              },
              {
                answer: ["A list of ToDos", "A programming paradigm", "A step by step by detailed guide"],
                id: 4,
                options: [
                  "A list of ToDos",
                  "A programming paradigm",
                  "A step by step by detailed guide",
                  "A programming problem",
                ],
                points: 5,
                question: "What is?",
                type: "multi",
              },
              {
                answer: "A step by step by detailed guide",
                id: 5,
                points: 5,
                question: "What is an?",
                type: "text",
              },
            ],
            title: "Quiz 1",
          },
          {
            id: 2,
            questionAndAnswer: [
              {
                answer: "C++",
                id: 1,
                options: ["ReactJS", "C++", "JavaScript", "CSS"],
                points: 5,
                question: "Whch Programming Language is best for writing System Programs?",
                type: "regular",
              },
              {
                answer: "HTML",
                id: 2,
                options: ["Markdown", "Swift", "Kotlin", "HTML"],
                points: 5,
                question: "What is the building block of the web?",
                type: "regular",
              },
              {
                answer: "A step by step by detailed guide",
                id: 3,
                options: [
                  "A list of ToDos",
                  "A programming paradigm",
                  "A step by step by detailed guide",
                  "A programming problem",
                ],
                points: 5,
                question: "What is an Algorithm?",
                type: "regular",
              },
              {
                answer: ["A list of ToDos", "A programming paradigm", "A step by step by detailed guide"],
                id: 4,
                options: [
                  "A list of ToDos",
                  "A programming paradigm",
                  "A step by step by detailed guide",
                  "A programming problem",
                ],
                points: 5,
                question: "What is?",
                type: "multi",
              },
              {
                answer: "A step by step by detailed guide",
                id: 5,
                points: 5,
                question: "What is an?",
                type: "text",
              },
            ],
            title: "Quiz 2",
          },
          {
            id: 3,
            questionAndAnswer: [
              {
                answer: "C++",
                id: 1,
                options: ["ReactJS", "C++", "JavaScript", "CSS"],
                points: 5,
                question: "Whch Programming Language is best for writing System Programs?",
                type: "regular",
              },
              {
                answer: "HTML",
                id: 2,
                options: ["Markdown", "Swift", "Kotlin", "HTML"],
                points: 5,
                question: "What is the building block of the web?",
                type: "regular",
              },
              {
                answer: "A step by step by detailed guide",
                id: 3,
                options: [
                  "A list of ToDos",
                  "A programming paradigm",
                  "A step by step by detailed guide",
                  "A programming problem",
                ],
                points: 5,
                question: "What is an Algorithm?",
                type: "regular",
              },
              {
                answer: ["A list of ToDos", "A programming paradigm", "A step by step by detailed guide"],
                id: 4,
                options: [
                  "A list of ToDos",
                  "A programming paradigm",
                  "A step by step by detailed guide",
                  "A programming problem",
                ],
                points: 5,
                question: "What is?",
                type: "multi",
              },
              {
                answer: "A step by step by detailed guide",
                id: 5,
                points: 5,
                question: "What is an?",
                type: "text",
              },
            ],
            title: "Quiz 3",
          },
          {
            id: 4,
            questionAndAnswer: [
              {
                answer: "C++",
                id: 1,
                options: ["ReactJS", "C++", "JavaScript", "CSS"],
                points: 5,
                question: "Whch Programming Language is best for writing System Programs?",
                type: "regular",
              },
              {
                answer: "HTML",
                id: 2,
                options: ["Markdown", "Swift", "Kotlin", "HTML"],
                points: 5,
                question: "What is the building block of the web?",
                type: "regular",
              },
              {
                answer: "A step by step by detailed guide",
                id: 3,
                options: [
                  "A list of ToDos",
                  "A programming paradigm",
                  "A step by step by detailed guide",
                  "A programming problem",
                ],
                points: 5,
                question: "What is an Algorithm?",
                type: "regular",
              },
              {
                answer: ["A list of ToDos", "A programming paradigm", "A step by step by detailed guide"],
                id: 4,
                options: [
                  "A list of ToDos",
                  "A programming paradigm",
                  "A step by step by detailed guide",
                  "A programming problem",
                ],
                points: 5,
                question: "What is?",
                type: "multi",
              },
              {
                answer: "A step by step by detailed guide",
                id: 5,
                points: 5,
                question: "What is an?",
                type: "text",
              },
            ],
            title: "Quiz 4",
          },
          {
            id: 5,
            questionAndAnswer: [
              {
                answer: "C++",
                id: 1,
                options: ["ReactJS", "C++", "JavaScript", "CSS"],
                points: 5,
                question: "Whch Programming Language is best for writing System Programs?",
                type: "regular",
              },
              {
                answer: "HTML",
                id: 2,
                options: ["Markdown", "Swift", "Kotlin", "HTML"],
                points: 5,
                question: "What is the building block of the web?",
                type: "regular",
              },
              {
                answer: "A step by step by detailed guide",
                id: 3,
                options: [
                  "A list of ToDos",
                  "A programming paradigm",
                  "A step by step by detailed guide",
                  "A programming problem",
                ],
                points: 5,
                question: "What is an Algorithm?",
                type: "regular",
              },
              {
                answer: ["A list of ToDos", "A programming paradigm", "A step by step by detailed guide"],
                id: 4,
                options: [
                  "A list of ToDos",
                  "A programming paradigm",
                  "A step by step by detailed guide",
                  "A programming problem",
                ],
                points: 5,
                question: "What is?",
                type: "multi",
              },
              {
                answer: "A step by step by detailed guide",
                id: 5,
                points: 5,
                question: "What is an?",
                type: "text",
              },
            ],
            title: "Quiz 5",
          },
          {
            id: 6,
            questionAndAnswer: [
              {
                answer: "C++",
                id: 1,
                options: ["ReactJS", "C++", "JavaScript", "CSS"],
                points: 5,
                question: "Whch Programming Language is best for writing System Programs?",
                type: "regular",
              },
              {
                answer: "HTML",
                id: 2,
                options: ["Markdown", "Swift", "Kotlin", "HTML"],
                points: 5,
                question: "What is the building block of the web?",
                type: "regular",
              },
              {
                answer: "A step by step by detailed guide",
                id: 3,
                options: [
                  "A list of ToDos",
                  "A programming paradigm",
                  "A step by step by detailed guide",
                  "A programming problem",
                ],
                points: 5,
                question: "What is an Algorithm?",
                type: "regular",
              },
              {
                answer: ["A list of ToDos", "A programming paradigm", "A step by step by detailed guide"],
                id: 4,
                options: [
                  "A list of ToDos",
                  "A programming paradigm",
                  "A step by step by detailed guide",
                  "A programming problem",
                ],
                points: 5,
                question: "What is?",
                type: "multi",
              },
              {
                answer: "A step by step by detailed guide",
                id: 5,
                points: 5,
                question: "What is an?",
                type: "text",
              },
            ],
            title: "Quiz 6",
          },
        ]),
      );
    }
  }, []);
  if (!loading && quiz) {
    return (
      <HomeContext.Provider value={{ isTracking, quiz, setQuiz, setTracking }}>
        <Header />
        <main className={"flex h-full justify-center gap-4"}>
          {quiz.map((item, index) => {
            return (
              <Link
                href={`${index}`}
                key={crypto.randomUUID()}
                onClick={e => {
                  if (isTracking) {
                    e.preventDefault();
                  }
                }}
              >
                <Card className={`h-64 w-40 pt-6 ${isTracking ? "hover:bg-red-400" : ""}`} id={`quiz-${index + 1}`}>
                  <div className={"relative h-2/3 w-full rounded-t-lg"}>
                    <Image alt={"quiz profile"} fill src={"/quiz.avif"} />
                  </div>
                  <div className={"flex justify-center p-4 text-3xl"}>{item.title}</div>
                </Card>
              </Link>
            );
          })}
        </main>
      </HomeContext.Provider>
    );
  }
  return <div>loading...</div>;
}

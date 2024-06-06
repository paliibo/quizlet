"use client";

import { localStorageUtil, mockApi } from "@/api/quiz";
import { Header } from "@/components/shared/header";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HomeContext } from "@/context/context";
import { QuizData } from "@/types/types";
import { HamburgerMenuIcon, Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [quiz, setQuiz] = useState<QuizData[] | undefined>();
  const [loading, setLoading] = useState(true);
  const [isTracking, setTracking] = useState(false);
  useEffect(() => {
    mockApi().then(res => {
      if (!res) {
        localStorageUtil("quiz").set([
          {
            questions: [
              {
                answer: ["Default 1"],
                options: ["Default 1", "Default 2"],
                points: 1,
                title: "Default Question",
                type: "regular",
              },
            ],
            quizTitle: "DefaultQuiz",
          },
        ]);
        setQuiz([
          {
            questions: [
              {
                answer: ["Default 1"],
                options: ["Default 1", "Default 2"],
                points: 1,
                title: "Default Question",
                type: "regular",
              },
            ],
            quizTitle: "DefaultQuiz",
          },
        ]);
      } else {
        setQuiz(res);
      }
    });
    setLoading(false);
  }, []);
  const removeQuiz = (indexRemove: number) => {
    const quizRes = localStorageUtil("quiz").get() as QuizData[];
    const newQuiz = quizRes.filter((value, index) => {
      if (indexRemove === index) return;
      return value;
    });
    setQuiz(prevState => {
      return prevState?.filter((value, index) => {
        if (indexRemove === index) return;
        return value;
      });
    });
    localStorageUtil("quiz").delete();
    localStorageUtil("quiz").set(newQuiz);
  };
  if (!loading && quiz) {
    return (
      <HomeContext.Provider value={{ isTracking, quiz, setQuiz, setTracking }}>
        <Header />
        <main className={"flex h-full flex-wrap justify-center gap-4"}>
          {!!quiz &&
            quiz.map((item, index) => {
              return (
                <Card
                  className={`relative h-64 w-40 pt-7 transition-all ease-in-out hover:scale-110 ${isTracking ? "hover:bg-red-400" : ""}`}
                  id={`quiz-${index + 1}`}
                  key={index}
                >
                  <div className={"absolute right-1 top-1"}>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className={"rounded-md border-stone-800 bg-stone-950 p-1 text-sm text-stone-50"}
                      >
                        <HamburgerMenuIcon />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Link href={`/edit-quiz/${index}`}>
                            <Pencil2Icon />
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            removeQuiz(index);
                          }}
                        >
                          <TrashIcon />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <Link
                    href={`${index}`}
                    onClick={e => {
                      if (isTracking) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <div className={"relative h-2/3 w-full rounded-t-lg"}>
                      <Image alt={"quiz profile"} fill src={"/quiz.avif"} />
                    </div>
                    <div className={"flex justify-center p-4 text-3xl"}>{item.quizTitle}</div>
                  </Link>
                </Card>
              );
            })}
        </main>
      </HomeContext.Provider>
    );
  }
  return <div>loading...</div>;
}

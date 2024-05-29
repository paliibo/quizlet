"use client";

import { mockApi } from "@/api/quiz";
import { Quiz } from "@/components/quiz";
import { QuizData } from "@/types/questionData";
import { useEffect, useState } from "react";
export default function QuizPage({ params: { id } }: { params: { id: string } }) {
  const [quiz, setQuiz] = useState<QuizData>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    mockApi().then(res => {
      if (!res) return;
      const result = JSON.parse(res);
      setQuiz(result[id]);
      setLoading(false);
    });
  }, []);
  if (!loading && quiz) {
    return (
      <div className={"flex justify-center"}>
        <Quiz questionAndAnswers={quiz.questionAndAnswer} />
      </div>
    );
  }
  return <div>loading...</div>;
}

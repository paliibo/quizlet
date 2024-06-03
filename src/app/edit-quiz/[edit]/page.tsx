"use client";
import { mockApi } from "@/api/quiz";
import { CreateQuiz } from "@/components/create-quiz-content/create-quiz";
import { QuizData } from "@/types/types";
import { useEffect, useState } from "react";

export default function EditQuiz({ params: { edit } }: { params: { edit: number } }) {
  const [quiz, setQuiz] = useState<QuizData>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    mockApi().then(res => {
      if (!res) return;
      setQuiz(res[edit]);
      setLoading(false);
    });
  }, []);
  if (loading) {
    return <div>loading...</div>;
  }
  return <CreateQuiz id={edit} quizFields={quiz} />;
}

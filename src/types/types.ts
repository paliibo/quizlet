import { Dispatch, SetStateAction } from "react";
import { Control, UseFieldArrayUpdate } from "react-hook-form";

export type QuestionData = {
  answer: string[];
  options: string[];
  points: number;
  title: string;
  type: QuestionType;
};
export type QuestionType = "multi" | "regular" | "text";
export type QuizData = {
  questions: QuestionData[];
  quizTitle: string;
};
export type QuestionContentProps = {
  control: Control<QuizData>;
  field: QuestionData;
  fieldIndex: number;
  type?: QuestionType;
  update: UseFieldArrayUpdate<QuizData>;
};

export type HomeContextType = {
  isTracking: boolean;
  quiz: QuizData[];
  setQuiz: Dispatch<SetStateAction<QuizData[] | undefined>>;
  setTracking: Dispatch<SetStateAction<boolean>>;
};

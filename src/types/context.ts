import { QuizData } from "@/types/questionData";
import { Dispatch, SetStateAction } from "react";

export type HomeContextType = {
  isTracking: boolean;
  quiz: QuizData[];
  setQuiz: Dispatch<SetStateAction<QuizData[] | undefined>>;
  setTracking: Dispatch<SetStateAction<boolean>>;
};

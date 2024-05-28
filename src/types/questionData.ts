type MatchQuestion = {
  correctAnswer: string;
  question: string;
};
export type QuestionData = {
  answer?: string | string[];
  correctAnswer?: string | string[];
  id: number;
  options?: string[];
  points: number;
  question: string;
  type: "multi" | "regular" | "text";
};
export type QuizData = {
  id: number;
  questionAndAnswer: QuestionData[];
  title: string;
};

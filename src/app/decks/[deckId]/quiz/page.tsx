import { QuizRunner } from "@/components/quiz/quiz-runner";

export default function QuizPage({ params }: { params: { deckId: string } }) {
  return <QuizRunner deckId={params.deckId} />;
}

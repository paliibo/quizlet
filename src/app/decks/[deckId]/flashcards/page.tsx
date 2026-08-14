import { FlashcardSession } from "@/components/study/flashcard-session";

export default function FlashcardsPage({ params }: { params: { deckId: string } }) {
  return <FlashcardSession deckId={params.deckId} />;
}

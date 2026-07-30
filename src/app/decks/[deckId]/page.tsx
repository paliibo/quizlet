import { DeckDetail } from "@/components/decks/deck-detail";

export default function DeckPage({ params }: { params: { deckId: string } }) {
  return <DeckDetail deckId={params.deckId} />;
}

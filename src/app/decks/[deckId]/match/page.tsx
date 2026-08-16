import { MatchGame } from "@/components/match/match-game";

export default function MatchPage({ params }: { params: { deckId: string } }) {
  return <MatchGame deckId={params.deckId} />;
}

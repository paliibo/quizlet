"use client";

import { ClockIcon, DownloadIcon, Pencil1Icon, Share1Icon, TargetIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/shared/container";
import { PageHeader } from "@/components/shared/page-header";
import { StatTile } from "@/components/shared/stat-tile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Ring } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { downloadDeckJson } from "@/lib/download";
import { formatDuration, formatPercent, formatRelativeTime, pluralize } from "@/lib/format";
import { routes } from "@/lib/routes";
import { shareUrl } from "@/lib/share";
import { useDeck, useDeckStats, useMounted } from "@/store/hooks";

import { CardPreviewList } from "./card-preview-list";
import { DeckCover } from "./deck-cover";
import { StudyModePicker } from "./study-mode-picker";

export const DeckDetail = ({ deckId }: { deckId: string }) => {
  const deck = useDeck(deckId);
  const stats = useDeckStats(deckId);
  const mounted = useMounted();

  if (!mounted) {
    return (
      <Container>
        <Skeleton className="h-28 w-full rounded-xl" />
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton className="h-28 rounded-xl" key={index} />
          ))}
        </div>
      </Container>
    );
  }

  if (!deck || !stats) notFound();

  const onShare = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl(deck, window.location.origin));
      toast("Share link copied to your clipboard.", "success");
    } catch {
      toast("Clipboard is unavailable in this browser.", "error");
    }
  };

  return (
    <Container>
      <PageHeader
        actions={
          <>
            <Button onClick={onShare} variant="outline">
              <Share1Icon />
              Share
            </Button>
            <Button onClick={() => downloadDeckJson(deck)} variant="outline">
              <DownloadIcon />
              Export
            </Button>
            <Button asChild>
              <Link href={routes.deckEdit(deck.id)}>
                <Pencil1Icon />
                Edit
              </Link>
            </Button>
          </>
        }
        description={deck.description || "No description yet."}
        title={
          <span className="flex items-center gap-3">
            <DeckCover accent={deck.accent} emoji={deck.emoji} size="lg" />
            <span className="min-w-0">{deck.title}</span>
          </span>
        }
      />

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge tone="muted">{pluralize(deck.cards.length, "card")}</Badge>
        <Badge tone="primary">{stats.dueCount} due now</Badge>
        <Badge tone="accent">Updated {formatRelativeTime(deck.updatedAt)}</Badge>
        {deck.timeLimit > 0 ? <Badge tone="warning">{formatDuration(deck.timeLimit * 1000)} limit</Badge> : null}
      </div>

      <div className="mt-8">
        <StudyModePicker deckId={deck.id} />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile icon={<TargetIcon />} label="Best score" value={formatPercent(stats.bestAccuracy)} />
        <StatTile icon={<TargetIcon />} label="Average" value={formatPercent(stats.averageAccuracy)} />
        <StatTile icon={<ClockIcon />} label="Runs" value={stats.attempts} />
        <StatTile
          hint="from spaced repetition"
          icon={<Ring size={22} strokeWidth={3} value={stats.mastery} />}
          label="Mastery"
          value={formatPercent(stats.mastery)}
        />
      </div>

      <div className="mt-10">
        {deck.cards.length === 0 ? (
          <EmptyState
            action={
              <Button asChild>
                <Link href={routes.deckEdit(deck.id)}>Add cards</Link>
              </Button>
            }
            description="Add a few questions and this deck becomes playable in all three modes."
            icon="📝"
            title="This deck has no cards yet"
          />
        ) : (
          <CardPreviewList cards={deck.cards} />
        )}
      </div>
    </Container>
  );
};

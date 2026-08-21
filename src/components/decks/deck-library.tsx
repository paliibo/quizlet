"use client";

import {
  ClockIcon,
  FileTextIcon,
  LightningBoltIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  TargetIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Container } from "@/components/shared/container";
import { PageHeader } from "@/components/shared/page-header";
import { StatTile } from "@/components/shared/stat-tile";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { formatDuration, formatPercent } from "@/lib/format";
import { routes } from "@/lib/routes";
import type { Deck } from "@/lib/schema";
import { shareUrl } from "@/lib/share";
import { deckStats } from "@/lib/stats";
import { deleteDeck, duplicateDeck } from "@/store/actions";
import { useAppState, useMounted } from "@/store/hooks";

import { DeckCard } from "./deck-card";

type SortKey = "cards" | "due" | "mastery" | "recent" | "title";

const sortLabels: Record<SortKey, string> = {
  cards: "Most cards",
  due: "Most due",
  mastery: "Least mastered",
  recent: "Recently updated",
  title: "Title A–Z",
};

export const DeckLibrary = () => {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("recent");
  const [pendingDelete, setPendingDelete] = useState<Deck | null>(null);
  const mounted = useMounted();

  const { attempts, decks, reviews, summary } = useAppState(state => ({
    attempts: state.attempts,
    decks: state.decks,
    reviews: state.reviews,
    summary: {
      accuracy:
        state.attempts.reduce((total, attempt) => total + attempt.maxScore, 0) === 0
          ? 0
          : state.attempts.reduce((total, attempt) => total + attempt.score, 0) /
            state.attempts.reduce((total, attempt) => total + attempt.maxScore, 0),
      cards: state.decks.reduce((total, deck) => total + deck.cards.length, 0),
      time: state.attempts.reduce((total, attempt) => total + attempt.durationMs, 0),
    },
  }));

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const withStats = decks.map(deck => ({ deck, stats: deckStats(deck, attempts, reviews) }));

    const filtered = needle
      ? withStats.filter(row =>
          `${row.deck.title} ${row.deck.description} ${row.deck.cards.map(card => card.prompt).join(" ")}`
            .toLowerCase()
            .includes(needle),
        )
      : withStats;

    return [...filtered].sort((a, b) => {
      switch (sort) {
        case "cards":
          return b.deck.cards.length - a.deck.cards.length;
        case "due":
          return b.stats.dueCount - a.stats.dueCount;
        case "mastery":
          return a.stats.mastery - b.stats.mastery;
        case "title":
          return a.deck.title.localeCompare(b.deck.title);
        default:
          return b.deck.updatedAt - a.deck.updatedAt;
      }
    });
  }, [attempts, decks, query, reviews, sort]);

  const dueTotal = rows.reduce((total, row) => total + row.stats.dueCount, 0);

  const onShare = async (deck: Deck) => {
    const url = shareUrl(deck, window.location.origin);

    try {
      await navigator.clipboard.writeText(url);
      toast("Share link copied to your clipboard.", "success");
    } catch {
      toast("Clipboard is unavailable — copy the link from the address bar instead.", "error");
    }
  };

  const onDuplicate = (deck: Deck) => {
    const copy = duplicateDeck(deck.id);
    if (copy) toast(`Duplicated “${deck.title}”.`, "success");
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;

    deleteDeck(pendingDelete.id);
    toast(`Deleted “${pendingDelete.title}”.`, "success");
    setPendingDelete(null);
  };

  return (
    <Container>
      <PageHeader
        actions={
          <>
            <Button asChild variant="outline">
              <Link href={routes.import}>Import</Link>
            </Button>
            <Button asChild>
              <Link href={routes.newDeck}>
                <PlusIcon />
                New deck
              </Link>
            </Button>
          </>
        }
        description="Every deck lives in your browser. Pick one to drill, or build a new one from scratch."
        eyebrow="Your library"
        title={<span className="text-gradient">Study smarter, not longer</span>}
      />

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile icon={<FileTextIcon />} label="Decks" value={mounted ? decks.length : "—"} />
        <StatTile icon={<LightningBoltIcon />} label="Cards" value={mounted ? summary.cards : "—"} />
        <StatTile icon={<TargetIcon />} label="Accuracy" value={mounted ? formatPercent(summary.accuracy) : "—"} />
        <StatTile
          hint="across all runs"
          icon={<ClockIcon />}
          label="Time studied"
          value={mounted ? formatDuration(summary.time) : "—"}
        />
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            aria-label="Search decks"
            className="h-10 w-full rounded-lg border border-input bg-surface pl-9 pr-3 text-sm shadow-sunken outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/40"
            onChange={event => setQuery(event.target.value)}
            placeholder="Search decks and questions…"
            type="search"
            value={query}
          />
        </div>

        <div className="flex items-center gap-2">
          {dueTotal > 0 ? (
            <span className="hidden whitespace-nowrap text-sm text-muted-foreground sm:inline">
              {dueTotal} cards due
            </span>
          ) : null}
          <Select onValueChange={value => setSort(value as SortKey)} value={sort}>
            <SelectTrigger aria-label="Sort decks" className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(sortLabels) as SortKey[]).map(key => (
                <SelectItem key={key} value={key}>
                  {sortLabels[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-6">
        {!mounted ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton className="h-52 rounded-xl" key={index} />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            action={
              <Button asChild>
                <Link href={routes.newDeck}>Create your first deck</Link>
              </Button>
            }
            description={
              query
                ? `Nothing in your library matches “${query}”.`
                : "Build a deck of questions and Quizbrain will schedule the reviews for you."
            }
            icon="🗂️"
            title={query ? "No matching decks" : "Your library is empty"}
          />
        ) : (
          <div className="grid animate-fade-in gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map(({ deck, stats }) => (
              <DeckCard
                deck={deck}
                key={deck.id}
                onDelete={setPendingDelete}
                onDuplicate={onDuplicate}
                onShare={onShare}
                stats={stats}
              />
            ))}
          </div>
        )}
      </div>

      <Dialog onOpenChange={open => !open && setPendingDelete(null)} open={Boolean(pendingDelete)}>
        <DialogContent>
          <DialogTitle>Delete “{pendingDelete?.title}”?</DialogTitle>
          <DialogDescription>
            This removes the deck along with its attempt history and review schedule. It cannot be undone.
          </DialogDescription>
          <DialogFooter>
            <Button onClick={() => setPendingDelete(null)} variant="ghost">
              Cancel
            </Button>
            <Button onClick={confirmDelete} variant="danger">
              Delete deck
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

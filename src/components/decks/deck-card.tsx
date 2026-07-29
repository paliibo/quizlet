"use client";

import { DotsHorizontalIcon, LightningBoltIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Surface } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ring } from "@/components/ui/progress";
import { formatPercent, formatRelativeTime, pluralize } from "@/lib/format";
import { routes } from "@/lib/routes";
import type { Deck } from "@/lib/schema";
import type { DeckStats } from "@/lib/stats";

import { DeckCover } from "./deck-cover";

export type DeckCardProps = {
  deck: Deck;
  onDelete: (deck: Deck) => void;
  onDuplicate: (deck: Deck) => void;
  onShare: (deck: Deck) => void;
  stats: DeckStats;
};

export const DeckCard = ({ deck, onDelete, onDuplicate, onShare, stats }: DeckCardProps) => (
  <Surface className="group relative flex flex-col gap-4 p-5" interactive>
    <div className="flex items-start gap-3">
      <DeckCover accent={deck.accent} emoji={deck.emoji} />

      <div className="min-w-0 flex-1">
        <Link className="outline-none" href={routes.deck(deck.id)}>
          {/* Stretch the link over the whole card so the entire surface is clickable. */}
          <span aria-hidden className="absolute inset-0 rounded-xl" />
          <h3 className="truncate pr-8 font-semibold leading-tight">{deck.title}</h3>
        </Link>
        <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">{deck.description || "No description yet."}</p>
      </div>

      <div className="relative z-10">
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={`Actions for ${deck.title}`}
            className="rounded-md p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground focus:opacity-100 group-hover:opacity-100"
          >
            <DotsHorizontalIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={routes.deckEdit(deck.id)}>
                <Pencil1Icon /> Edit deck
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onDuplicate(deck)}>
              <LightningBoltIcon /> Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onShare(deck)}>Copy share link</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive onSelect={() => onDelete(deck)}>
              <TrashIcon /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>

    <div className="mt-auto flex items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge tone="muted">{pluralize(deck.cards.length, "card")}</Badge>
        {stats.dueCount > 0 ? <Badge tone="primary">{stats.dueCount} due</Badge> : <Badge tone="success">Rested</Badge>}
        {stats.attempts > 0 ? <Badge tone="accent">Best {formatPercent(stats.bestAccuracy)}</Badge> : null}
      </div>

      <Ring label={formatPercent(stats.mastery)} size={44} value={stats.mastery} />
    </div>

    <p className="text-xs text-muted-foreground">
      {stats.lastAttemptAt ? `Last studied ${formatRelativeTime(stats.lastAttemptAt)}` : "Not studied yet"}
    </p>
  </Surface>
);

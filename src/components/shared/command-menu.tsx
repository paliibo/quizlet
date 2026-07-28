"use client";

import {
  BarChartIcon,
  GearIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  PlusIcon,
  StackIcon,
  StarIcon,
  SunIcon,
} from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/cn";
import { routes } from "@/lib/routes";
import { useDecks } from "@/store/hooks";

import { useTheme } from "./theme-provider";

type Command = {
  group: string;
  icon: ReactNode;
  id: string;
  keywords: string;
  label: string;
  run: () => void;
};

export const CommandMenu = ({ onOpenChange, open }: { onOpenChange: (open: boolean) => void; open: boolean }) => {
  const router = useRouter();
  const decks = useDecks();
  const { resolved, setTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const commands = useMemo<Command[]>(() => {
    const go = (href: string) => () => {
      onOpenChange(false);
      router.push(href);
    };

    return [
      {
        group: "Actions",
        icon: <PlusIcon />,
        id: "new",
        keywords: "create deck add",
        label: "Create a new deck",
        run: go(routes.newDeck),
      },
      {
        group: "Actions",
        icon: <StackIcon />,
        id: "library",
        keywords: "home decks",
        label: "Go to library",
        run: go(routes.home),
      },
      {
        group: "Actions",
        icon: <BarChartIcon />,
        id: "stats",
        keywords: "progress analytics",
        label: "Open stats",
        run: go(routes.stats),
      },
      {
        group: "Actions",
        icon: <StarIcon />,
        id: "achievements",
        keywords: "badges trophies",
        label: "Open achievements",
        run: go(routes.achievements),
      },
      {
        group: "Actions",
        icon: <GearIcon />,
        id: "settings",
        keywords: "preferences data export",
        label: "Open settings",
        run: go(routes.settings),
      },
      {
        group: "Actions",
        icon: resolved === "dark" ? <SunIcon /> : <MoonIcon />,
        id: "theme",
        keywords: "dark light appearance",
        label: `Switch to ${resolved === "dark" ? "light" : "dark"} theme`,
        run: () => {
          setTheme(resolved === "dark" ? "light" : "dark");
          onOpenChange(false);
        },
      },
      ...decks.map(deck => ({
        group: "Decks",
        icon: <span aria-hidden>{deck.emoji}</span>,
        id: deck.id,
        keywords: `${deck.title} ${deck.description}`,
        label: deck.title,
        run: go(routes.deck(deck.id)),
      })),
    ];
  }, [decks, onOpenChange, resolved, router, setTheme]);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return commands;

    return commands.filter(command => `${command.label} ${command.keywords}`.toLowerCase().includes(needle));
  }, [commands, query]);

  useEffect(() => setActive(0), [query, open]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive(current => (current + 1) % Math.max(1, results.length));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive(current => (current - 1 + results.length) % Math.max(1, results.length));
    } else if (event.key === "Enter") {
      event.preventDefault();
      results[active]?.run();
    }
  };

  let lastGroup = "";

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-xl p-0">
        <div className="sr-only">
          <DialogTitle>Command menu</DialogTitle>
          <DialogDescription>Search decks and jump to any page.</DialogDescription>
        </div>

        <div className="flex items-center gap-2 border-b border-border px-4">
          <MagnifyingGlassIcon className="text-muted-foreground" />
          {/* eslint-disable-next-line jsx-a11y/no-autofocus -- the dialog exists to take focus */}
          <input
            autoFocus
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            onChange={event => setQuery(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search decks and commands…"
            value={query}
          />
        </div>

        <div className="max-h-80 overflow-y-auto p-2" ref={listRef}>
          {results.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">No matches for “{query}”.</p>
          ) : (
            results.map((command, index) => {
              const showGroup = command.group !== lastGroup;
              lastGroup = command.group;

              return (
                <div key={command.id}>
                  {showGroup ? (
                    <p className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {command.group}
                    </p>
                  ) : null}
                  <button
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                      index === active ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/60",
                    )}
                    onClick={command.run}
                    onMouseEnter={() => setActive(index)}
                    type="button"
                  >
                    <span className="grid h-6 w-6 shrink-0 place-items-center">{command.icon}</span>
                    <span className="truncate">{command.label}</span>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

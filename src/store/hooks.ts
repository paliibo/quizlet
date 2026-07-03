"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";

import type { Attempt, Deck, Review, Settings } from "@/lib/schema";
import type { AppState } from "@/lib/schema";

import { deckStats, globalStats } from "@/lib/stats";

import { initialState } from "./actions";
import { getServerState, getState, hydrate, subscribe } from "./store";

/**
 * Subscribe to a slice of app state.
 *
 * `useSyncExternalStore` compares snapshots with `Object.is`, so a selector
 * that derives a fresh object would loop forever. We memoise on the identity of
 * the state object instead: the store always replaces state immutably, so a
 * shared reference means the derived value is still valid.
 */
export const useAppState = <T>(selector: (state: AppState) => T): T => {
  useEffect(() => {
    hydrate(initialState);
  }, []);

  const cache = useRef<{ source: AppState; value: T } | null>(null);

  const snapshot = useCallback(
    (source: AppState): T => {
      if (cache.current && cache.current.source === source) return cache.current.value;

      const value = selector(source);
      cache.current = { source, value };

      return value;
    },
    [selector],
  );

  return useSyncExternalStore(
    subscribe,
    useCallback(() => snapshot(getState()), [snapshot]),
    useCallback(() => snapshot(getServerState()), [snapshot]),
  );
};

const selectDecks = (state: AppState) => state.decks;
const selectAttempts = (state: AppState) => state.attempts;
const selectReviews = (state: AppState) => state.reviews;
const selectSettings = (state: AppState) => state.settings;

export const useDecks = (): Deck[] => useAppState(selectDecks);
export const useAttempts = (): Attempt[] => useAppState(selectAttempts);
export const useReviews = (): Review[] => useAppState(selectReviews);
export const useSettings = (): Settings => useAppState(selectSettings);

export const useDeck = (deckId: string): Deck | undefined =>
  useAppState(useCallback((state: AppState) => state.decks.find(deck => deck.id === deckId), [deckId]));

export const useDeckStats = (deckId: string) =>
  useAppState(
    useCallback(
      (state: AppState) => {
        const deck = state.decks.find(item => item.id === deckId);

        return deck ? deckStats(deck, state.attempts, state.reviews) : null;
      },
      [deckId],
    ),
  );

const selectGlobalStats = (state: AppState) => globalStats(state.attempts, state.reviews);

export const useGlobalStats = () => useAppState(selectGlobalStats);

/**
 * `false` during SSR and the first client render, so client-only UI (theme
 * toggles, localStorage-backed lists) can render a stable placeholder instead
 * of tripping hydration.
 */
export const useMounted = (): boolean => {
  const subscribeToNothing = useCallback(() => () => {}, []);

  return useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
};

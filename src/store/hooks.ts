"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

import type { Attempt, Deck, Review, Settings } from "@/lib/schema";

import { deckStats, globalStats } from "@/lib/stats";

import { initialState } from "./actions";
import { getServerState, getState, hydrate, subscribe } from "./store";

/**
 * Subscribe to a slice of app state. The selector runs on every notification,
 * so keep it cheap and return referentially stable values where possible.
 */
export const useAppState = <T>(selector: (state: ReturnType<typeof getState>) => T): T => {
  useEffect(() => {
    hydrate(initialState);
  }, []);

  return useSyncExternalStore(
    subscribe,
    useCallback(() => selector(getState()), [selector]),
    useCallback(() => selector(getServerState()), [selector]),
  );
};

const selectDecks = (state: ReturnType<typeof getState>) => state.decks;
const selectAttempts = (state: ReturnType<typeof getState>) => state.attempts;
const selectReviews = (state: ReturnType<typeof getState>) => state.reviews;
const selectSettings = (state: ReturnType<typeof getState>) => state.settings;

export const useDecks = (): Deck[] => useAppState(selectDecks);
export const useAttempts = (): Attempt[] => useAppState(selectAttempts);
export const useReviews = (): Review[] => useAppState(selectReviews);
export const useSettings = (): Settings => useAppState(selectSettings);

export const useDeck = (deckId: string): Deck | undefined =>
  useAppState(useCallback(state => state.decks.find(deck => deck.id === deckId), [deckId]));

export const useDeckStats = (deckId: string) =>
  useAppState(
    useCallback(
      state => {
        const deck = state.decks.find(item => item.id === deckId);

        return deck ? deckStats(deck, state.attempts, state.reviews) : null;
      },
      [deckId],
    ),
  );

export const useGlobalStats = () =>
  useAppState(useCallback(state => globalStats(state.attempts, state.reviews), []));

/**
 * `false` until the store has read localStorage, so pages can render skeletons
 * instead of flashing an empty library on first paint.
 */
export const useIsReady = (): boolean => {
  const decks = useDecks();
  const mounted = useMounted();

  return mounted && decks !== undefined;
};

export const useMounted = (): boolean => {
  const subscribeToNothing = useCallback(() => () => {}, []);

  return useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
};

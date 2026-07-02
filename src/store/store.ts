import { type AppState, type Settings } from "@/lib/schema";
import { emptyState, loadState, saveState } from "@/lib/storage";

type Listener = () => void;

let state: AppState = emptyState();
let hydrated = false;

const listeners = new Set<Listener>();
const serverSnapshot: AppState = emptyState();

const emit = () => listeners.forEach(listener => listener());

export const getState = (): AppState => state;

export const getServerState = (): AppState => serverSnapshot;

export const isHydrated = (): boolean => hydrated;

export const subscribe = (listener: Listener): (() => void) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

/** Replace state, persist it, and notify subscribers. */
export const setState = (updater: (current: AppState) => AppState, options: { persist?: boolean } = {}): void => {
  state = updater(state);

  if (options.persist !== false) saveState(state);

  emit();
};

/**
 * Read persisted state once per page load. Callers may run this on every mount;
 * repeated calls after the first are no-ops.
 */
export const hydrate = (fallback: () => AppState): void => {
  if (hydrated) return;

  hydrated = true;
  const loaded = loadState();

  if (loaded) {
    setState(() => loaded, { persist: false });
  } else {
    setState(fallback);
  }
};

/** Test seam: drop everything back to a pristine, unhydrated store. */
export const resetStore = (next: AppState = emptyState()): void => {
  state = next;
  hydrated = false;
  emit();
};

export const patchSettings = (patch: Partial<Settings>): void => {
  setState(current => ({ ...current, settings: { ...current.settings, ...patch } }));
};

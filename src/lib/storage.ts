import { migrate } from "./migrate";
import { type AppState, SCHEMA_VERSION, appStateSchema } from "./schema";

export const STORAGE_KEY = "quizbrain:v2";
export const LEGACY_STORAGE_KEY = "quiz";

export const emptyState = (): AppState => appStateSchema.parse({ version: SCHEMA_VERSION });

const isBrowser = () => typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const readKey = (key: string): unknown => {
  const raw = window.localStorage.getItem(key);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

/**
 * Load persisted state, transparently upgrading a legacy payload the first time
 * we see one. Returns `null` when there is nothing usable to load, which the
 * store treats as "seed a fresh library".
 */
export const loadState = (): AppState | null => {
  if (!isBrowser()) return null;

  const current = migrate(readKey(STORAGE_KEY));
  if (current) return current;

  const legacy = migrate(readKey(LEGACY_STORAGE_KEY));
  if (legacy) {
    saveState(legacy);
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    return legacy;
  }

  return null;
};

export const saveState = (state: AppState): void => {
  if (!isBrowser()) return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    // Quota exceeded, or storage disabled in a private window. The app keeps
    // working in memory for the rest of the session.
    console.warn("Quizbrain could not persist state:", error);
  }
};

export const clearState = (): void => {
  if (!isBrowser()) return;

  window.localStorage.removeItem(STORAGE_KEY);
  window.localStorage.removeItem(LEGACY_STORAGE_KEY);
};

/** Format a millisecond duration as `m:ss`, or `h:mm:ss` past an hour. */
export const formatDuration = (ms: number): string => {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");

  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${minutes}:${pad(seconds)}`;
};

/** Format a 0..1 ratio as a whole percentage. */
export const formatPercent = (ratio: number): string => `${Math.round(clamp(ratio, 0, 1) * 100)}%`;

export const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

/** Coarse relative time — enough for "edited 3 days ago" without a date library. */
export const formatRelativeTime = (timestamp: number, now = Date.now()): string => {
  const diff = now - timestamp;
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return "just now";
  if (diff < hour) return `${Math.floor(diff / minute)}m ago`;
  if (diff < day) return `${Math.floor(diff / hour)}h ago`;
  if (diff < 7 * day) return `${Math.floor(diff / day)}d ago`;

  return new Date(timestamp).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
};

/** `1 card` / `4 cards` without sprinkling ternaries through the UI. */
export const pluralize = (count: number, singular: string, plural = `${singular}s`): string =>
  `${count} ${count === 1 ? singular : plural}`;

/** Calendar day key (`YYYY-MM-DD`) in the viewer's local timezone. */
export const dayKey = (timestamp: number): string => {
  const date = new Date(timestamp);
  const pad = (n: number) => n.toString().padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

/**
 * Fold a free-text answer down to something comparable: lowercase, accent
 * stripped, punctuation removed, whitespace collapsed.
 */
export const normalize = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Classic Levenshtein distance over two rows, so memory stays O(min(a, b)). */
export const levenshtein = (a: string, b: string): number => {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  let previous = Array.from({ length: b.length + 1 }, (_, index) => index);

  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];

    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min((current[j - 1] ?? 0) + 1, (previous[j] ?? 0) + 1, (previous[j - 1] ?? 0) + cost);
    }

    previous = current;
  }

  return previous[b.length] ?? 0;
};

/** 0..1 similarity derived from edit distance. */
export const similarity = (a: string, b: string): number => {
  const longest = Math.max(a.length, b.length);

  return longest === 0 ? 1 : 1 - levenshtein(a, b) / longest;
};

/**
 * Whether a typed answer should count. Exact after normalization always wins;
 * otherwise we forgive a single typo in longer answers so "mitochondria" is not
 * marked wrong for "mitochondia".
 */
export const isCloseEnough = (given: string, expected: string, tolerance = 0.86): boolean => {
  const a = normalize(given);
  const b = normalize(expected);

  if (!a || !b) return false;
  if (a === b) return true;
  if (b.length <= 4) return false;

  return similarity(a, b) >= tolerance;
};

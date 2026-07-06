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
 * Whether a typed answer should count.
 *
 * Exact after normalization always wins. Beyond that we allow a budget of edits
 * that grows with the length of the expected answer, so "mitochondrion" tolerates
 * a slip while "cat" and "car" stay distinct.
 */
export const typoBudget = (length: number): number => {
  if (length <= 4) return 0;
  if (length <= 9) return 1;
  if (length <= 15) return 2;

  return 3;
};

export const isCloseEnough = (given: string, expected: string): boolean => {
  const a = normalize(given);
  const b = normalize(expected);

  if (!a || !b) return false;
  if (a === b) return true;

  return levenshtein(a, b) <= typoBudget(b.length);
};

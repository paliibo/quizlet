/**
 * Stable, collision-resistant id. `crypto.randomUUID` is available in every
 * browser we target and in Node 19+, but we keep a fallback so ids can also be
 * minted inside tests and older embedded webviews.
 */
export const createId = (prefix = ""): string => {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;

  return prefix ? `${prefix}_${random.replace(/-/g, "").slice(0, 12)}` : random;
};

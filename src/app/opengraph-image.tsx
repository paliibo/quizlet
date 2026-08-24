import { ImageResponse } from "next/og";

export const alt = "Quizbrain — build decks, drill them, remember more";
export const contentType = "image/png";
export const size = { height: 630, width: 1200 };

/**
 * Rendered at build time so the social card never drifts from the tagline.
 *
 * Satori needs an explicit `display` on every element with more than one child,
 * and it has no emoji font unless one is fetched at build time — hence the plain
 * wordmark and the one-string-per-node structure below.
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        background: "linear-gradient(135deg, #0e1018 0%, #1a1436 55%, #08313a 100%)",
        color: "#f2f4fb",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "center",
        padding: "80px",
        width: "100%",
      }}
    >
      <div style={{ alignItems: "center", display: "flex", gap: 24 }}>
        <div
          style={{
            alignItems: "center",
            background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
            borderRadius: 22,
            display: "flex",
            fontSize: 52,
            fontWeight: 800,
            height: 88,
            justifyContent: "center",
            width: 88,
          }}
        >
          Q
        </div>
        <div style={{ display: "flex", fontSize: 46, fontWeight: 700, letterSpacing: -1 }}>Quizbrain</div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 88,
          fontWeight: 800,
          letterSpacing: -3,
          lineHeight: 1.05,
          marginTop: 48,
        }}
      >
        <div style={{ display: "flex" }}>Study smarter,</div>
        <div style={{ display: "flex" }}>not longer.</div>
      </div>

      <div style={{ color: "#a6adc8", display: "flex", fontSize: 30, gap: 28, marginTop: 44 }}>
        <span>Quiz</span>
        <span>·</span>
        <span>Spaced-repetition flashcards</span>
        <span>·</span>
        <span>Match</span>
      </div>
    </div>,
    size,
  );
}

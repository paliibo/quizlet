import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: "#0e1018",
    categories: ["education", "productivity"],
    description: "Build decks, drill them with quiz, flashcard and match modes, and watch your recall improve.",
    display: "standalone",
    icons: [{ purpose: "any", sizes: "any", src: "/icon.svg", type: "image/svg+xml" }],
    name: "Quizbrain",
    short_name: "Quizbrain",
    start_url: "/",
    theme_color: "#7c3aed",
  };
}

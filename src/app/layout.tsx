import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Outfit } from "next/font/google";

import { AppShell } from "@/components/shared/app-shell";
import { ThemeProvider, themeScript } from "@/components/shared/theme-provider";
import { Toaster } from "@/components/ui/toast";

import "./globals.css";

const sans = Inter({ display: "swap", subsets: ["latin"], variable: "--font-sans" });
const display = Outfit({ display: "swap", subsets: ["latin"], variable: "--font-display" });
const mono = JetBrains_Mono({ display: "swap", subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  applicationName: "Quizbrain",
  authors: [{ name: "paliibo", url: "https://github.com/paliibo" }],
  description:
    "Build decks, drill them with quiz, spaced-repetition flashcard and match modes, and watch your recall improve. Everything stays in your browser.",
  keywords: ["flashcards", "spaced repetition", "quiz", "study", "SM-2", "learning"],
  title: {
    default: "Quizbrain — study smarter",
    template: "%s · Quizbrain",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { color: "#f5f8fd", media: "(prefers-color-scheme: light)" },
    { color: "#0e1018", media: "(prefers-color-scheme: dark)" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className={`${sans.variable} ${display.variable} ${mono.variable}`} lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
          href="#main"
        >
          Skip to content
        </a>
        <ThemeProvider>
          <AppShell>
            <main id="main">{children}</main>
          </AppShell>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

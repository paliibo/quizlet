import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  description: "Build decks, drill them with spaced repetition, and watch your recall improve.",
  title: "Quizbrain",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}

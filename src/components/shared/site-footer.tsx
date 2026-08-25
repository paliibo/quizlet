import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";

import { routes } from "@/lib/routes";

export const SiteFooter = () => (
  <footer className="mt-16 border-t border-border/70 py-8">
    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-sm text-muted-foreground sm:flex-row sm:px-6">
      <p>Quizbrain — everything is stored in your browser. Nothing leaves this device.</p>
      <div className="flex items-center gap-4">
        <span className="hidden sm:inline">
          Press <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">?</kbd> for
          shortcuts
        </span>
        <Link className="transition-colors hover:text-foreground" href={routes.settings}>
          Settings
        </Link>
        <a
          className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
          href="https://github.com/paliibo/quizlet"
          rel="noreferrer noopener"
          target="_blank"
        >
          <GitHubLogoIcon />
          Source
        </a>
      </div>
    </div>
  </footer>
);

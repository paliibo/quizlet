"use client";

import { BarChartIcon, MagnifyingGlassIcon, PlusIcon, StackIcon, StarIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { routes } from "@/lib/routes";

import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { href: routes.home, icon: StackIcon, label: "Library" },
  { href: routes.stats, icon: BarChartIcon, label: "Stats" },
  { href: routes.achievements, icon: StarIcon, label: "Achievements" },
];

export const SiteHeader = ({ onOpenCommandMenu }: { onOpenCommandMenu: () => void }) => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Link aria-label="Quizbrain home" className="shrink-0" href={routes.home}>
          <Logo />
        </Link>

        <nav aria-label="Main" className="ml-2 hidden items-center gap-1 md:flex">
          {links.map(({ href, icon: Icon, label }) => {
            const active = href === routes.home ? pathname === href : pathname.startsWith(href);

            return (
              <Link
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                )}
                href={href}
                key={href}
              >
                <Icon />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            className="hidden items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground sm:inline-flex"
            onClick={onOpenCommandMenu}
            type="button"
          >
            <MagnifyingGlassIcon />
            <span>Search</span>
            <kbd className="ml-2 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd>
          </button>

          <ThemeToggle />

          <Button asChild size="sm">
            <Link href={routes.newDeck}>
              <PlusIcon />
              <span className="hidden sm:inline">New deck</span>
            </Link>
          </Button>
        </div>
      </div>

      <nav aria-label="Main (compact)" className="flex items-center gap-1 border-t border-border/70 px-4 py-2 md:hidden">
        {links.map(({ href, icon: Icon, label }) => {
          const active = href === routes.home ? pathname === href : pathname.startsWith(href);

          return (
            <Link
              className={cn(
                "inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors",
                active ? "bg-muted text-foreground" : "text-muted-foreground",
              )}
              href={href}
              key={href}
            >
              <Icon />
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
};

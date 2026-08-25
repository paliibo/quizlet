"use client";

import { type ReactNode, useState } from "react";

import { TooltipProvider } from "@/components/ui/tooltip";
import { useHotkey } from "@/hooks/use-hotkey";

import { CommandMenu } from "./command-menu";
import { ShortcutsDialog } from "./shortcuts-dialog";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export const AppShell = ({ children }: { children: ReactNode }) => {
  const [commandOpen, setCommandOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  useHotkey("mod+k", event => {
    event.preventDefault();
    setCommandOpen(current => !current);
  });

  useHotkey("/", event => {
    event.preventDefault();
    setCommandOpen(true);
  });

  useHotkey("shift+?", event => {
    event.preventDefault();
    setShortcutsOpen(current => !current);
  });

  return (
    <TooltipProvider delayDuration={200}>
      <div className="relative flex min-h-screen flex-col">
        <div aria-hidden className="aurora pointer-events-none fixed inset-0 -z-10" />
        <SiteHeader onOpenCommandMenu={() => setCommandOpen(true)} />
        <div className="flex-1">{children}</div>
        <SiteFooter />
        <CommandMenu onOpenChange={setCommandOpen} open={commandOpen} />
        <ShortcutsDialog onOpenChange={setShortcutsOpen} open={shortcutsOpen} />
      </div>
    </TooltipProvider>
  );
};

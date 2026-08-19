"use client";

import { DownloadIcon, ExclamationTriangleIcon, UploadIcon } from "@radix-ui/react-icons";
import { type ChangeEvent, useRef, useState } from "react";

import { Container } from "@/components/shared/container";
import { PageHeader } from "@/components/shared/page-header";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { Surface } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toast";
import { downloadBackup } from "@/lib/download";
import { pluralize } from "@/lib/format";
import { migrate } from "@/lib/migrate";
import type { AppState, Settings } from "@/lib/schema";
import { STORAGE_KEY } from "@/lib/storage";
import { eraseEverything, resetLibrary } from "@/store/actions";
import { useAppState, useMounted } from "@/store/hooks";
import { patchSettings, setState } from "@/store/store";

const toggles: Array<{ description: string; key: keyof Settings; label: string }> = [
  { description: "Present quiz cards in a different order each run.", key: "shuffleCards", label: "Shuffle cards" },
  { description: "Also shuffle the options within each question.", key: "shuffleOptions", label: "Shuffle options" },
  { description: "Skip the celebration animation on results.", key: "reducedConfetti", label: "Calmer results" },
];

const selectSummary = (state: AppState) => ({
  attempts: state.attempts.length,
  cards: state.decks.reduce((total, deck) => total + deck.cards.length, 0),
  decks: state.decks.length,
  reviews: state.reviews.length,
  settings: state.settings,
  state,
});

export const SettingsPanel = () => {
  const summary = useAppState(selectSummary);
  const mounted = useMounted();
  const fileInput = useRef<HTMLInputElement>(null);
  const [confirmReset, setConfirmReset] = useState<"erase" | "seed" | null>(null);

  const restore = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    file
      .text()
      .then(text => {
        const restored = migrate(JSON.parse(text));

        if (!restored) {
          toast("That file is not a Quizbrain backup.", "error");

          return;
        }

        setState(() => restored);
        toast(`Restored ${pluralize(restored.decks.length, "deck")}.`, "success");
      })
      .catch(() => toast("That file could not be read.", "error"));

    event.target.value = "";
  };

  return (
    <Container className="max-w-3xl">
      <PageHeader
        description="Quizbrain never sends your data anywhere — these controls act on this browser only."
        eyebrow="Settings"
        title="Preferences & data"
      />

      <Surface className="mt-8 p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold">Appearance</h2>
        <div className="mt-3 flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">Follow your system, or pin light or dark.</p>
          <ThemeToggle />
        </div>
      </Surface>

      <Surface className="mt-4 p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold">Study</h2>
        <ul className="mt-3 divide-y divide-border">
          {toggles.map(toggle => (
            <li className="flex items-center justify-between gap-4 py-3" key={toggle.key}>
              <div>
                <p className="font-medium">{toggle.label}</p>
                <p className="text-sm text-muted-foreground">{toggle.description}</p>
              </div>
              <Switch
                aria-label={toggle.label}
                checked={mounted ? Boolean(summary.settings[toggle.key]) : false}
                onCheckedChange={checked => patchSettings({ [toggle.key]: checked })}
              />
            </li>
          ))}
        </ul>
      </Surface>

      <Surface className="mt-4 p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold">Your data</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {mounted
            ? `${pluralize(summary.decks, "deck")} · ${pluralize(summary.cards, "card")} · ${pluralize(summary.attempts, "run")} · ${pluralize(summary.reviews, "scheduled card")}`
            : "Loading…"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Stored under <code className="font-mono">{STORAGE_KEY}</code> in this browser&rsquo;s local storage.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <input accept=".json,application/json" className="hidden" onChange={restore} ref={fileInput} type="file" />
          <Button onClick={() => downloadBackup(summary.state)} variant="outline">
            <DownloadIcon />
            Download backup
          </Button>
          <Button onClick={() => fileInput.current?.click()} variant="outline">
            <UploadIcon />
            Restore backup
          </Button>
        </div>
      </Surface>

      <Surface className="mt-4 border-danger/40 p-5 sm:p-6">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-danger">
          <ExclamationTriangleIcon />
          Danger zone
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">Both actions are immediate and cannot be undone.</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={() => setConfirmReset("seed")} variant="outline">
            Reset to starter decks
          </Button>
          <Button onClick={() => setConfirmReset("erase")} variant="danger">
            Erase everything
          </Button>
        </div>
      </Surface>

      <Dialog onOpenChange={open => !open && setConfirmReset(null)} open={confirmReset !== null}>
        <DialogContent>
          <DialogTitle>{confirmReset === "erase" ? "Erase everything?" : "Reset to starter decks?"}</DialogTitle>
          <DialogDescription>
            {confirmReset === "erase"
              ? "Every deck, run and review schedule in this browser will be removed."
              : "Your decks and history are replaced with the four decks Quizbrain ships with."}
          </DialogDescription>
          <DialogFooter>
            <Button onClick={() => setConfirmReset(null)} variant="ghost">
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (confirmReset === "erase") {
                  eraseEverything();
                  toast("Everything erased.", "success");
                } else {
                  resetLibrary();
                  toast("Starter decks restored.", "success");
                }

                setConfirmReset(null);
              }}
              variant="danger"
            >
              {confirmReset === "erase" ? "Erase everything" : "Reset library"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

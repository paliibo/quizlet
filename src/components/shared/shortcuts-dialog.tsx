"use client";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

const groups: Array<{ shortcuts: Array<{ keys: string[]; label: string }>; title: string }> = [
  {
    shortcuts: [
      { keys: ["⌘", "K"], label: "Open the command menu" },
      { keys: ["/"], label: "Search decks" },
      { keys: ["?"], label: "Show this list" },
      { keys: ["Esc"], label: "Close a dialog" },
    ],
    title: "Anywhere",
  },
  {
    shortcuts: [
      { keys: ["1", "–", "9"], label: "Pick an option" },
      { keys: ["←", "→"], label: "Previous / next question" },
      { keys: ["Enter"], label: "Continue, or finish on the last card" },
    ],
    title: "In a quiz",
  },
  {
    shortcuts: [
      { keys: ["Space"], label: "Flip the card" },
      { keys: ["1"], label: "Again — you forgot it" },
      { keys: ["2"], label: "Hard — you struggled" },
      { keys: ["3"], label: "Good — you recalled it" },
      { keys: ["4"], label: "Easy — instant recall" },
    ],
    title: "In flashcards",
  },
];

export const ShortcutsDialog = ({ onOpenChange, open }: { onOpenChange: (open: boolean) => void; open: boolean }) => (
  <Dialog onOpenChange={onOpenChange} open={open}>
    <DialogContent>
      <DialogTitle>Keyboard shortcuts</DialogTitle>
      <DialogDescription>Quizbrain is built to be driven without the mouse.</DialogDescription>

      <div className="mt-5 flex flex-col gap-5">
        {groups.map(group => (
          <section key={group.title}>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{group.title}</h3>
            <ul className="flex flex-col gap-1.5">
              {group.shortcuts.map(shortcut => (
                <li className="flex items-center justify-between gap-4 text-sm" key={shortcut.label}>
                  <span className="text-muted-foreground">{shortcut.label}</span>
                  <span className="flex shrink-0 items-center gap-1">
                    {shortcut.keys.map(key => (
                      <kbd
                        className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs"
                        key={`${shortcut.label}-${key}`}
                      >
                        {key}
                      </kbd>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </DialogContent>
  </Dialog>
);

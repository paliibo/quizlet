"use client";

import { useEffect, useRef } from "react";

const isTypingTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) return false;

  return target.isContentEditable || ["INPUT", "SELECT", "TEXTAREA"].includes(target.tagName);
};

export type HotkeyOptions = {
  /** Fire even while a text field has focus. Off by default. */
  allowInInputs?: boolean;
  enabled?: boolean;
};

/**
 * Bind a keyboard shortcut such as `mod+k`, `shift+?` or plain `Escape`.
 * `mod` maps to ⌘ on Apple platforms and Ctrl elsewhere.
 */
export const useHotkey = (combo: string, handler: (event: KeyboardEvent) => void, options: HotkeyOptions = {}): void => {
  const { allowInInputs = false, enabled = true } = options;
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!enabled) return;

    const parts = combo.toLowerCase().split("+");
    const key = parts[parts.length - 1] ?? "";
    const needsMod = parts.includes("mod");
    const needsShift = parts.includes("shift");
    const needsAlt = parts.includes("alt");

    const onKeyDown = (event: KeyboardEvent) => {
      if (!allowInInputs && isTypingTarget(event.target)) return;

      const mod = event.metaKey || event.ctrlKey;
      if (needsMod !== mod) return;
      if (needsShift !== event.shiftKey) return;
      if (needsAlt !== event.altKey) return;
      if (event.key.toLowerCase() !== key) return;

      handlerRef.current(event);
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [allowInInputs, combo, enabled]);
};

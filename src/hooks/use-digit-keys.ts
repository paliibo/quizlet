"use client";

import { useEffect, useRef } from "react";

const isTypingTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) return false;

  return target.isContentEditable || ["INPUT", "SELECT", "TEXTAREA"].includes(target.tagName);
};

/**
 * Call `handler` with a zero-based index when the learner presses 1–9. Ignored
 * while a text field has focus so typed answers are never intercepted.
 */
export const useDigitKeys = (handler: (index: number) => void, enabled = true): void => {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTypingTarget(event.target)) return;
      if (!/^[1-9]$/.test(event.key)) return;

      event.preventDefault();
      handlerRef.current(Number(event.key) - 1);
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enabled]);
};

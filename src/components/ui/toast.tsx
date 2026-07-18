"use client";

import { CheckCircledIcon, CrossCircledIcon, InfoCircledIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

import { cn } from "@/lib/cn";
import { createId } from "@/lib/id";

export type ToastTone = "error" | "info" | "success";

export type Toast = { id: string; message: string; tone: ToastTone };

type Listener = (toasts: Toast[]) => void;

let toasts: Toast[] = [];
const listeners = new Set<Listener>();

const emit = () => listeners.forEach(listener => listener(toasts));

const dismiss = (id: string) => {
  toasts = toasts.filter(item => item.id !== id);
  emit();
};

/** Fire-and-forget notification. Auto-dismisses after `duration` ms. */
export const toast = (message: string, tone: ToastTone = "info", duration = 3200): void => {
  const item: Toast = { id: createId("toast"), message, tone };

  toasts = [...toasts, item].slice(-4);
  emit();

  if (duration > 0) window.setTimeout(() => dismiss(item.id), duration);
};

const icons = {
  error: CrossCircledIcon,
  info: InfoCircledIcon,
  success: CheckCircledIcon,
} as const;

const tones: Record<ToastTone, string> = {
  error: "text-danger",
  info: "text-accent",
  success: "text-success",
};

export const Toaster = () => {
  const [items, setItems] = useState<Toast[]>([]);

  useEffect(() => {
    listeners.add(setItems);

    return () => {
      listeners.delete(setItems);
    };
  }, []);

  return (
    <div aria-live="polite" className="pointer-events-none fixed bottom-4 right-4 z-[60] flex flex-col gap-2">
      {items.map(item => {
        const Icon = icons[item.tone];

        return (
          <button
            className="pointer-events-auto flex animate-slide-up items-center gap-2.5 rounded-lg border border-border bg-surface px-4 py-3 text-sm shadow-raised"
            key={item.id}
            onClick={() => dismiss(item.id)}
            type="button"
          >
            <Icon className={cn("shrink-0", tones[item.tone])} />
            <span className="text-left">{item.message}</span>
          </button>
        );
      })}
    </div>
  );
};

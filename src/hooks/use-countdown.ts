"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type Countdown = {
  /** Milliseconds left; `Infinity` when no limit is set. */
  remaining: number;
  reset: () => void;
  running: boolean;
  stop: () => void;
};

/**
 * Wall-clock countdown. We store the deadline rather than decrementing a
 * counter, so a backgrounded tab that stops firing timers still reports the
 * right value when it wakes up.
 */
export const useCountdown = (seconds: number, onExpire?: () => void): Countdown => {
  const enabled = seconds > 0;
  const [deadline, setDeadline] = useState(() => Date.now() + seconds * 1000);
  const [remaining, setRemaining] = useState(enabled ? seconds * 1000 : Number.POSITIVE_INFINITY);
  const [running, setRunning] = useState(enabled);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    if (!enabled || !running) return;

    const tick = () => {
      const left = deadline - Date.now();

      if (left <= 0) {
        setRemaining(0);
        setRunning(false);
        onExpireRef.current?.();

        return;
      }

      setRemaining(left);
    };

    tick();
    const id = window.setInterval(tick, 250);

    return () => window.clearInterval(id);
  }, [deadline, enabled, running]);

  const reset = useCallback(() => {
    setDeadline(Date.now() + seconds * 1000);
    setRemaining(enabled ? seconds * 1000 : Number.POSITIVE_INFINITY);
    setRunning(enabled);
  }, [enabled, seconds]);

  const stop = useCallback(() => setRunning(false), []);

  return { remaining, reset, running, stop };
};

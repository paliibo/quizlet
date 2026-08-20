"use client";

import { useEffect } from "react";

import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="max-w-xl">
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <p aria-hidden className="text-6xl">
          ⚠️
        </p>
        <h1 className="font-display text-3xl font-semibold">Something broke</h1>
        <p className="text-muted-foreground">
          Your decks are safe in local storage. Try again, and if it keeps happening a reload usually clears it.
        </p>
        <Button className="mt-2" onClick={reset}>
          Try again
        </Button>
      </div>
    </Container>
  );
}

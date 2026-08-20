import Link from "next/link";

import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

export default function NotFound() {
  return (
    <Container className="max-w-xl">
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <p aria-hidden className="animate-float text-6xl">
          🧭
        </p>
        <h1 className="font-display text-3xl font-semibold">This page went missing</h1>
        <p className="text-muted-foreground">
          The deck you followed may have been deleted, or the link points somewhere Quizbrain does not have.
        </p>
        <Button asChild className="mt-2">
          <Link href={routes.home}>Back to your library</Link>
        </Button>
      </div>
    </Container>
  );
}

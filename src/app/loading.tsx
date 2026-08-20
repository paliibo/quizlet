import { Container } from "@/components/shared/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <Container>
      <Skeleton className="h-10 w-72" />
      <Skeleton className="mt-3 h-5 w-96" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton className="h-52 rounded-xl" key={index} />
        ))}
      </div>
    </Container>
  );
}

import { LayersIcon, RocketIcon, ShuffleIcon } from "@radix-ui/react-icons";
import Link from "next/link";

import { Surface } from "@/components/ui/card";
import { routes } from "@/lib/routes";

const modes = [
  {
    description: "Answer every card once and get a scored breakdown at the end.",
    href: routes.quiz,
    icon: RocketIcon,
    title: "Quiz",
  },
  {
    description: "Flip cards and grade your recall. Quizbrain schedules the next review.",
    href: routes.flashcards,
    icon: LayersIcon,
    title: "Flashcards",
  },
  {
    description: "Race the clock pairing prompts with their answers.",
    href: routes.match,
    icon: ShuffleIcon,
    title: "Match",
  },
];

export const StudyModePicker = ({ deckId }: { deckId: string }) => (
  <div className="grid gap-3 sm:grid-cols-3">
    {modes.map(({ description, href, icon: Icon, title }) => (
      <Surface className="group relative p-5" interactive key={title}>
        <Link className="outline-none" href={href(deckId)}>
          <span aria-hidden className="absolute inset-0 rounded-xl" />
          <span className="mb-3 grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <Icon />
          </span>
          <h3 className="font-semibold">{title}</h3>
        </Link>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </Surface>
    ))}
  </div>
);

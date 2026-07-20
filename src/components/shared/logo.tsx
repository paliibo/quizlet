import { cn } from "@/lib/cn";

export const Logo = ({ className }: { className?: string }) => (
  <span className={cn("inline-flex items-center gap-2", className)}>
    <span className="relative grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-glow">
      <svg aria-hidden fill="none" height="16" viewBox="0 0 24 24" width="16">
        <path
          d="M12 3c4.97 0 9 3.58 9 8 0 2.6-1.4 4.9-3.56 6.36L18 21l-3.6-2.16c-.78.1-1.58.16-2.4.16-4.97 0-9-3.58-9-8s4.03-8 9-8Z"
          fill="currentColor"
          opacity="0.9"
        />
        <path d="M9.2 9.6a2.9 2.9 0 1 1 4 2.7v1.2" stroke="hsl(var(--primary))" strokeLinecap="round" strokeWidth="1.8" />
        <circle cx="13.2" cy="16.1" fill="hsl(var(--primary))" r="0.95" />
      </svg>
    </span>
    <span className="font-display text-lg font-semibold tracking-tight">Quizbrain</span>
  </span>
);

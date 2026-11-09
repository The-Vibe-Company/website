import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/design-system";
import { DIRECTIONS, type DirectionId } from "./registry";

/**
 * A fixed pill at the foot of every direction preview, to jump between them
 * and back to the current homepage while comparing.
 */
export function DirectionSwitcher({ current }: { current: DirectionId }) {
  return (
    <nav
      aria-label="Directions"
      className="fixed bottom-4 left-1/2 z-[90] flex max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-1 overflow-x-auto whitespace-nowrap rounded-full border border-border-strong bg-popover/90 p-1 font-mono text-[11px] uppercase tracking-[0.14em] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.7)] backdrop-blur-xl"
    >
      <Link href="/" className="rounded-full px-3 py-2 text-muted-foreground transition-colors hover:text-foreground">
        Actuelle
      </Link>
      {DIRECTIONS.map((d) => (
        <Link
          key={d.id}
          href={`/directions/${d.id}`}
          aria-current={d.id === current ? "page" : undefined}
          className={cn(
            "rounded-full px-3 py-2 transition-colors",
            d.id === current ? "bg-foreground text-background" : "text-soft-foreground hover:text-foreground",
          )}
        >
          {d.letter} · {d.name}
        </Link>
      ))}
    </nav>
  );
}

import { Backers } from "@/components/home/Backers";

/**
 * The two backers, as on the homepage hero: Y Combinator W24 and France 2030.
 * Shared by the About page and the service landings, under their hero CTA.
 */
export function AboutBackers({ label }: { label: string }) {
  return (
    <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-border pt-7 md:mt-12">
      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </span>
      <Backers />
    </div>
  );
}

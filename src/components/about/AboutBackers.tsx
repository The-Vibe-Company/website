import Image from "next/image";

/**
 * The two backers, as on the homepage hero: Y Combinator W24 and France 2030.
 * Shared by the About page and the service landings, under their hero CTA.
 */
export function AboutBackers({ label }: { label: string }) {
  return (
    <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-border pt-7 md:mt-12">
      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </span>
      <a
        href="https://www.ycombinator.com/companies/quivr"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex transition-opacity hover:opacity-70"
      >
        <Image
          src="/images/partners/y-combinator.svg"
          alt="Y Combinator W24"
          width={154}
          height={38}
          className="h-8 w-auto"
        />
      </a>
      <span aria-hidden="true" className="h-8 w-px bg-border" />
      <Image
        src="/images/partners/france-2030.svg"
        alt="France 2030"
        width={52}
        height={52}
        className="h-10 w-auto"
      />
    </div>
  );
}

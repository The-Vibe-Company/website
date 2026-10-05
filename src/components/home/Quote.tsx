import { useTranslations } from "next-intl";

/**
 * A client's own words between the cases and the services, on phones only: an
 * ink band with a giant orange quotation mark hanging off its corner, and the
 * line that sums the work up picked out in orange.
 */
export function Quote() {
  const t = useTranslations("quote");

  return (
    <section data-surface="inverse" className="relative overflow-hidden bg-foreground px-6 pb-11 pt-14 text-background md:hidden">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-7 right-3 select-none text-[220px] font-black leading-none text-orange-500"
      >
        “
      </span>
      <figure className="relative m-0">
        {/* Étienne's own words, kept in French on every locale. */}
        <blockquote lang="fr" className="m-0 text-[22px] font-medium leading-[1.32] tracking-[-0.02em]">
          {t.rich("text", { em: (chunks) => <em className="not-italic text-orange-500">{chunks}</em> })}
        </blockquote>
        <figcaption className="mt-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-background/60">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/clients/monka.webp" alt="" aria-hidden="true" className="h-[22px] w-auto brightness-0 invert" />
          {t("author")}
        </figcaption>
      </figure>
    </section>
  );
}

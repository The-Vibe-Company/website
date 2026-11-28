import { clientLogoSize } from "@/lib/client-logos";
import { OFFER_INK_GLOW_QUOTE, OFFER_SECTION } from "./offer-styles";

/**
 * Full-width ink emphasis band carrying a verbatim client quote in warm
 * orange light, styled directly after LitQuote on the homepage.
 */
export function OfferEditorialQuote({
  quote,
  author,
  locale,
  logoSrc,
}: {
  quote: string;
  author: string;
  locale: string;
  logoSrc?: string;
}) {
  const formatted = locale === "fr" ? `« ${quote} »` : `“${quote}”`;

  return (
    <section className="relative overflow-hidden border-y border-border bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: OFFER_INK_GLOW_QUOTE }}
      />
      <figure className={`relative m-0 ${OFFER_SECTION} py-24 md:py-32 lg:py-36`}>
        <span
          aria-hidden="true"
          className="block font-bold leading-none text-brand text-[5.5rem] lg:text-[7.5rem]"
        >
          “
        </span>
        <blockquote className="m-0 -mt-8 max-w-[34ch] text-[clamp(1.5rem,3vw,2.75rem)] font-semibold leading-[1.18] tracking-[-0.03em] text-foreground lg:-mt-12">
          {formatted}
        </blockquote>
        <figcaption className="mt-10 flex flex-wrap items-center gap-4 font-mono text-[11px] uppercase tracking-[0.18em] text-soft-foreground">
          {logoSrc ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={logoSrc}
              alt=""
              aria-hidden="true"
              {...clientLogoSize(logoSrc)}
              className="h-6 w-auto brightness-0 invert"
              loading="lazy"
              decoding="async"
            />
          ) : null}
          <span>{author}</span>
        </figcaption>
      </figure>
    </section>
  );
}

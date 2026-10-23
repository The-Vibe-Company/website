"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Arrow, ButtonLink, Groove, SectionTitle } from "@/components/kit";
import { getCustomers, type ContentLocale, type Customer } from "@/lib/customers";
import { LOOP_COPIES, LOOP_NEXT_CLASS, LOOP_PREV_CLASS, useLoopCarousel } from "./useLoopCarousel";

// A card and a sliver of the next on phones, two cards flush from 768px.
const CARD_WIDTH = "w-[86%] shrink-0 snap-start sm:w-[70%] md:w-[calc(50%-12px)]";

type T = (key: string) => string;

/**
 * One case as a quiet clay piece: client logo and sector, the headline figure,
 * what was built, and the way in. The whole card is the link.
 */
function CaseStudyCard({ c, t, clone = false }: { c: Customer; t: T; clone?: boolean }) {
  return (
    <Link
      href={`/case-studies/${c.slug}?from=home`}
      tabIndex={clone ? -1 : undefined}
      className="clay-quiet lift group flex h-full flex-col rounded-plate p-5 no-underline md:px-8 md:pb-[26px] md:pt-[30px]"
    >
      <div className="flex flex-col items-start gap-3.5 md:flex-row md:items-center md:justify-between md:gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={c.logo}
          alt={c.client}
          className="h-7 w-auto max-w-full object-contain md:h-8"
          loading="lazy"
          decoding="async"
        />
        <span className="chip well min-w-0" title={c.sector}>
          <span className="truncate">{c.sector}</span>
        </span>
      </div>

      <Groove className="mt-5" />

      {c.metric ? (
        <>
          <p className="display m-0 mt-5 text-[clamp(2.75rem,2rem+2vw,4.25rem)] md:mt-6">{c.metric}</p>
          <p className="m-0 mt-2.5 text-[15.5px] leading-[1.45] text-muted-foreground">{c.metricLabel}</p>
        </>
      ) : null}

      <p className="m-0 mt-[18px] text-base leading-[1.55] text-ink-2 max-md:line-clamp-4">
        {c.summary}
      </p>

      {/* The list of what was built, from 768px. A phone shows the compact
          card (figure, the gist, the way in); the case page has the rest. */}
      <ul className="ticks mt-5 gap-[11px] max-md:hidden">
        {c.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>

      <span className="link-rim mt-auto self-start pt-[22px]">
        <span className="t">{t("readCase")}</span>
        <Arrow />
      </span>
    </Link>
  );
}

/**
 * The client cases, scrolled by hand (trackpad, swipe or the two round
 * buttons) in an infinite loop that wraps seamlessly in both directions (see
 * useLoopCarousel). The cards start where the title starts; the buttons sit
 * on either side of them, and the way to every case below.
 */
export function CaseStudy() {
  const t = useTranslations("caseStudy") as T;
  const locale = useLocale() as ContentLocale;
  // In alphabetical order of the client, as on the case studies page.
  const customers = [...getCustomers(locale)].sort((a, b) =>
    a.client.localeCompare(b.client, locale, { sensitivity: "base" }),
  );
  const { trackRef, scrollByCard } = useLoopCarousel(customers.length);

  return (
    <section id="cases" className="section">
      <div className="wrap">
        <SectionTitle kicker={t("kicker")} line1={t("titleLine1")} line2={t("titleLine2")} size="md" />

        {/* The hairline of a quiet piece is a shadow, so the track keeps one
            pixel of room on each side (and 8px above and below for the lift)
            instead of clipping it. */}
        {/* From 768px the arrows sit on either side of the cards, astride
            their edges, centred on their height. A phone swipes the track:
            the next card's edge already shows there is more. */}
        <div className="relative mt-9 md:mt-12">
          <div
            ref={trackRef}
            className="-mx-px -my-2 flex gap-3 overflow-x-auto px-px py-2 [-ms-overflow-style:none] [scrollbar-width:none] max-md:snap-x max-md:snap-mandatory md:gap-6 [&::-webkit-scrollbar]:hidden"
          >
            {LOOP_COPIES.flatMap((copy) =>
              customers.map((c) => (
                <div
                  key={`${copy}-${c.slug}`}
                  data-card
                  aria-hidden={copy !== 1 || undefined}
                  className={CARD_WIDTH}
                >
                  <CaseStudyCard c={c} t={t} clone={copy !== 1} />
                </div>
              )),
            )}
          </div>
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label={t("prev")}
            className={`${LOOP_PREV_CLASS} absolute left-0 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 max-md:hidden`}
          >
            <Arrow direction="left" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label={t("next")}
            className={`${LOOP_NEXT_CLASS} absolute right-0 top-1/2 z-10 translate-x-1/2 -translate-y-1/2 max-md:hidden`}
          >
            <Arrow />
          </button>
        </div>

        <div className="mt-6 flex justify-center md:mt-10">
          <ButtonLink href="/case-studies" variant="clay" arrow>
            {t("seeAll")}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

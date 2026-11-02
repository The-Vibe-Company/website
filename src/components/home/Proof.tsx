"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Arrow, Groove, LinkRim, SectionTitle } from "@/components/kit";
import { getProjects, type ContentLocale } from "@/lib/projects";
import { LOOP_COPIES, LOOP_NEXT_CLASS, LOOP_PREV_CLASS, useLoopCarousel } from "./useLoopCarousel";

const ORG_URL = "https://github.com/The-Vibe-Company";

// One row: four cards on wide screens, fewer as the track narrows (gap is 18px).
const CARD_WIDTH =
  "w-[78%] shrink-0 snap-start sm:w-[calc(50%-9px)] lg:w-[calc((100%-36px)/3)] xl:w-[calc((100%-54px)/4)]";

/**
 * The studio's own products, as a loop of quiet clay cards that start where
 * the title starts. Every card has the same four rows (kind, name, text, way
 * in), so the name and the logo tile sit at the same height in all of them.
 */
export function Proof() {
  const locale = useLocale() as ContentLocale;
  const t = useTranslations("proof");
  // In alphabetical order, as on the portfolio.
  const projects = [...getProjects(locale)].sort((a, b) =>
    a.name.localeCompare(b.name, locale, { sensitivity: "base" }),
  );
  const { trackRef, scrollByCard } = useLoopCarousel(projects.length);

  return (
    <section id="proof" className="section">
      <div className="wrap">
        <SectionTitle kicker={t("kicker")} line1={t("titleLine1")} line2={t("titleLine2")} size="md">
          {t("intro")}
        </SectionTitle>

        <div className="mt-12 flex items-center gap-4">
          <p className="kicker m-0 shrink-0 text-ink">
            <span>{t("barLeft")}</span>
          </p>
          <Groove className="flex-1" />
        </div>

        {/* The hairline of a quiet piece is a shadow, so the track keeps one
            pixel of room on each side (and 8px above and below for the lift)
            instead of clipping it. */}
        {/* From 768px the arrows sit on either side of the cards, astride
            their edges, centred on their height. A phone swipes the track:
            the next card's edge already shows there is more. */}
        <div className="relative mt-7">
          <div
            ref={trackRef}
            className="-mx-px -my-2 flex gap-[18px] overflow-x-auto px-px py-2 [-ms-overflow-style:none] [scrollbar-width:none] max-md:snap-x max-md:snap-mandatory [&::-webkit-scrollbar]:hidden"
          >
            {LOOP_COPIES.flatMap((copy) =>
              projects.map((p) => (
                <div
                  key={`${copy}-${p.slug}`}
                  data-card
                  aria-hidden={copy !== 1 || undefined}
                  className={CARD_WIDTH}
                >
                  <Link
                    href={`/portfolio/${p.slug}`}
                    tabIndex={copy !== 1 ? -1 : undefined}
                    className="clay-quiet lift flex h-full min-h-[310px] flex-col rounded-piece px-5 pb-6 pt-5 no-underline"
                  >
                    <span className="flex items-start justify-between gap-2.5">
                      <span className="flex min-w-0 items-center gap-2 font-mono text-xs uppercase leading-[1.3] tracking-[0.1em] text-muted-foreground">
                        <span aria-hidden="true" className="dot" />
                        <span className="truncate">{p.tag}</span>
                      </span>
                      <Arrow direction="up-right" className="h-[18px] w-[18px] flex-none" />
                    </span>

                    <span className="mt-[26px] flex items-center gap-3">
                      <span className="well grid h-10 w-10 flex-none place-items-center rounded-pebble">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.logo}
                          alt=""
                          aria-hidden="true"
                          width={24}
                          height={24}
                          className="h-6 w-6 rounded-[5px] object-contain"
                          loading="lazy"
                          decoding="async"
                        />
                      </span>
                      <span className="min-w-0 truncate text-2xl font-bold tracking-[-0.02em]">{p.name}</span>
                    </span>

                    <span className="mt-3.5 line-clamp-7 text-[14.5px] leading-[1.5] text-muted-foreground">
                      {p.description}
                    </span>
                  </Link>
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
          <LinkRim
            href={ORG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="justify-center"
          >
            {t("browseAll")}
          </LinkRim>
        </div>
      </div>
    </section>
  );
}

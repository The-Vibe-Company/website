"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getProjects, type ContentLocale } from "@/lib/projects";
import { LOOP_ARROW_CLASS, LOOP_COPIES, useLoopCarousel } from "./useLoopCarousel";

const ORG_URL = "https://github.com/The-Vibe-Company";

// One row: four cards on wide screens, fewer as the track narrows (gap is 20px).
const CARD_WIDTH =
  "w-[82%] shrink-0 sm:w-[calc(50%-10px)] lg:w-[calc((100%-40px)/3)] xl:w-[calc((100%-60px)/4)]";

export function Proof() {
  const locale = useLocale() as ContentLocale;
  const t = useTranslations("proof");
  const projects = getProjects(locale);
  const { trackRef, scrollByCard } = useLoopCarousel(projects.length, 20);

  return (
    <section
      id="proof"
      className="border-b border-border bg-background"
    >
      <div className="mx-auto max-w-[100rem] px-6 py-24 md:px-12 md:py-28">
        <div className="mb-12 md:mb-14">
          <span className="mb-6 block font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {t("kicker")}
          </span>
          <h2
            className="m-0 font-bold text-foreground"
            style={{
              fontSize: "clamp(44px, 6vw, 88px)",
              lineHeight: 0.92,
              letterSpacing: "-0.045em",
            }}
          >
            {t("titleLine1")}
            <br />
            <span
              style={{
                WebkitTextStroke: "1.5px var(--foreground)",
                color: "transparent",
              }}
            >
              {t("titleLine2")}
            </span>
          </h2>
          <p className="m-0 mt-7 max-w-[620px] text-lg leading-[1.5] text-muted-foreground">
            {t("intro")}
          </p>
        </div>

        <div className="mb-5 border-b border-border pb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          <span className="font-semibold text-foreground">
            {t("barLeft")}
          </span>
        </div>

        <div className="flex items-stretch gap-3 md:gap-4">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label={t("prev")}
            className={LOOP_ARROW_CLASS}
          >
            <ArrowLeft size={22} strokeWidth={2.25} aria-hidden="true" />
          </button>

          <div
            ref={trackRef}
            className="flex min-w-0 flex-1 gap-5 overflow-x-auto scroll-p-2 p-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {LOOP_COPIES.flatMap((copy) =>
              projects.map((p) => (
                <div
                  key={`${copy}-${p.slug}`}
                  data-card
                  aria-hidden={copy !== 1 || undefined}
                  inert={copy !== 1 || undefined}
                  className={CARD_WIDTH}
                >
                  <Link
                    href={`/portfolio/${p.slug}`}
                    tabIndex={copy !== 1 ? -1 : undefined}
                    // Each card borrows its project's accent (the same one its
                    // portfolio page uses) for the top rule, arrow and hover shadow.
                    style={{ "--card-accent": p.accent } as React.CSSProperties}
                    className="group relative flex h-full flex-col overflow-hidden border border-foreground bg-background no-underline transition-all duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_0_var(--card-accent)]"
                  >
                    <div className="h-[3px] w-full bg-[var(--card-accent)]" aria-hidden="true" />
                    <div className="flex flex-1 flex-col gap-3 p-6">
                      <div className="flex items-center justify-between gap-3">
                        <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                          <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--card-accent)]" />
                          {p.tag}
                        </span>
                        <span aria-hidden="true" className="text-lg text-foreground transition-transform duration-300 group-hover:translate-x-1">
                          →
                        </span>
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.logo}
                          alt=""
                          aria-hidden="true"
                          className="h-8 w-8 shrink-0 rounded-sm object-contain"
                          loading="lazy"
                          decoding="async"
                        />
                        <h3 className="m-0 font-mono text-2xl font-bold tracking-[-0.03em] text-foreground">
                          {p.name}
                        </h3>
                      </div>
                      <p className="m-0 min-h-[60px] text-sm leading-[1.5] text-muted-foreground">
                        {p.description}
                      </p>
                    </div>
                  </Link>
                </div>
              ))
            )}
          </div>

          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label={t("next")}
            className={LOOP_ARROW_CLASS}
          >
            <ArrowRight size={22} strokeWidth={2.25} aria-hidden="true" />
          </button>
        </div>

        <div className="mt-10 flex justify-start">
          <a
            href={ORG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground transition-opacity hover:opacity-70"
          >
            <span className="underline decoration-1 underline-offset-4">{t("browseAll")}</span>
            <span aria-hidden="true" className="text-lg">
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

import { getTranslations } from "next-intl/server";

import { BackLink } from "@/components/BackLink";
import { Footer } from "@/components/Footer";
import { TopNav } from "@/components/TopNav";
import { bookingLocation } from "@/lib/booking";
import {
  formatStars,
  QUIVR_BOOKING_URL,
  QUIVR_DOCS_URL,
  QUIVR_FAQ_KEYS,
  QUIVR_REPO_URL,
  QUIVR_SERVICE_KEYS,
  QUIVR_SERVICES_ID,
} from "@/lib/quivr";

import {
  AlertDiagram,
  FlowDiagram,
  PluginDiagram,
  TimelineDiagram,
} from "./QuivrDiagrams";

/**
 * The Quivr product page, served at /fr/portfolio/quivr and
 * /en/portfolio/quivr in place of the shared project template.
 *
 * Under the hero, the page explains Quivr with animated diagrams and short
 * captions (QuivrDiagrams.tsx); the longer answers are folded into the FAQ.
 * Every visual is drawn in code; no screenshots. Every fact comes from the
 * Quivr README or docs.quivr.thevibecompany.co (see src/lib/quivr.ts). The
 * star count is live, or a floor when GitHub does not answer.
 */

const SECTION = "mx-auto max-w-[100rem] px-6 md:px-12";
const H2 =
  "m-0 max-w-[22ch] font-bold text-foreground text-[clamp(32px,5vw,64px)] leading-[0.95] tracking-[-0.04em]";
const MONO =
  "font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground";
const PROSE = "m-0 text-[15px] leading-[1.6] text-muted-foreground md:text-base";
const TEXT_LINK =
  "inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground underline decoration-1 underline-offset-4 hover:text-muted-foreground";
const SLAB =
  "inline-flex items-center gap-3 border-2 border-foreground bg-foreground px-6 py-4 text-[15px] font-semibold text-background transition-all duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_var(--foreground)] md:px-7 md:py-5 md:text-[17px]";
const OUTLINE =
  "inline-flex items-center gap-3 border-2 border-foreground bg-background px-6 py-4 text-[15px] font-semibold text-foreground transition-all duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_var(--foreground)] md:px-7 md:py-5 md:text-[17px]";

const EXTERNAL = { target: "_blank", rel: "noopener noreferrer" } as const;

/** Quivr's mark, the favicon of its demo app, also used on the project card. */
const QUIVR_LOGO = "/projects/quivr-favicon.svg";

function SectionKicker({ index, label }: { index: string; label: string }) {
  return (
    <span className={`mb-6 flex items-center gap-3 ${MONO}`}>
      <span className="text-foreground">{index}</span>
      <span aria-hidden="true" className="h-px w-8 bg-border" />
      {label}
    </span>
  );
}

/** A section around one diagram: kicker, title, one short caption. */
function DiagramSection({
  id,
  index,
  kicker,
  title,
  caption,
  bordered = false,
  children,
}: {
  id?: string;
  index: string;
  kicker: string;
  title: string;
  caption?: string;
  bordered?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={`${SECTION} scroll-mt-24 py-14 md:py-24 ${bordered ? "border-t border-border" : ""}`}
    >
      <SectionKicker index={index} label={kicker} />
      <h2 className={H2}>{title}</h2>
      {caption ? <p className={`${PROSE} mt-4 max-w-[560px]`}>{caption}</p> : null}
      <div className="mt-10 md:mt-14">{children}</div>
    </section>
  );
}

function StarIcon() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
    </svg>
  );
}

export async function QuivrPage({
  locale,
  stars,
}: {
  locale: string;
  stars: number | null;
}) {
  const t = await getTranslations({ locale, namespace: "quivr" });
  const tPortfolio = await getTranslations({ locale, namespace: "portfolio" });
  const starsLabel = formatStars(stars, locale);

  return (
    <div
      data-variant="hybrid"
      className="flex min-h-screen flex-col bg-background text-foreground"
    >
      <TopNav />
      <main id="main-content" tabIndex={-1} className="flex-1">
        {/* 1 — Hero: the one H1, the plain-words sentence, the call, and an
            illustrated flow of what goes in and what comes out. */}
        <section className={`${SECTION} pb-14 pt-10 md:pb-20 md:pt-12`}>
          <BackLink href="/portfolio" label={tPortfolio("back")} />
          <div className="mt-10 grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-16">
            <div>
              <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-3">
                <span className={MONO}>{t("hero.kicker")}</span>
                <span className="inline-flex items-center gap-2 border border-foreground px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground">
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 rounded-full bg-orange-500 motion-safe:animate-[vc-pulse_2s_infinite]"
                  />
                  {t("hero.status")}
                </span>
              </div>

              <h1
                className="m-0 font-bold text-foreground"
                style={{ letterSpacing: "-0.045em" }}
              >
                <span
                  className="flex items-center gap-4 md:gap-6"
                  style={{ fontSize: "clamp(56px, 9vw, 136px)", lineHeight: 0.86 }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={QUIVR_LOGO}
                    alt=""
                    className="h-[0.72em] w-[0.72em] shrink-0"
                  />
                  {t("hero.titleLead")}
                </span>{" "}
                <span
                  className="mt-3 block max-w-[18ch] md:mt-4"
                  style={{ fontSize: "clamp(26px, 3.2vw, 44px)", lineHeight: 1 }}
                >
                  {t("hero.titleRest")}{" "}
                  <span className="whitespace-nowrap">(YC W24)</span>
                </span>
              </h1>

              <p className="m-0 mt-8 max-w-[620px] border-l-2 border-foreground pl-5 text-lg leading-[1.5] text-foreground md:pl-6 md:text-[21px]">
                {t("hero.lead")}
              </p>
              <p className="m-0 mt-4 max-w-[620px] pl-5 text-[15px] leading-[1.55] text-muted-foreground md:pl-6 md:text-base">
                {t("hero.forWhom")}
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4 md:mt-10">
                <a
                  href={QUIVR_BOOKING_URL}
                  {...bookingLocation("quivr_hero")}
                  className={SLAB}
                >
                  {t("hero.cta")}
                  <span aria-hidden="true" className="text-lg leading-none">
                    →
                  </span>
                </a>
                <a href={QUIVR_REPO_URL} {...EXTERNAL} className={OUTLINE}>
                  <StarIcon />
                  <span>
                    <span className="tabular-nums">{starsLabel}</span>
                    <span className="sr-only"> {t("hero.stars")}</span>
                  </span>
                  <span aria-hidden="true" className="h-5 w-px bg-border" />
                  {t("hero.repo")}
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
              <a href={QUIVR_DOCS_URL} {...EXTERNAL} className={`mt-6 ${TEXT_LINK}`}>
                {t("hero.docs")}
                <span aria-hidden="true">↗</span>
              </a>
            </div>

            <FlowCard
              title={t("hero.flow.title")}
              inLabel={t("hero.flow.in")}
              outLabel={t("hero.flow.out")}
              sources={t.raw("hero.flow.sources") as string[]}
              core={t("hero.flow.core")}
              coreNote={t("hero.flow.coreNote")}
              outputs={t.raw("hero.flow.outputs") as string[]}
            />
          </div>
        </section>

        {/* Stats band: the live star count, then what the README states. */}
        <section className="border-y border-border bg-background">
          <dl className="mx-auto m-0 grid max-w-[100rem] grid-cols-2 gap-px bg-border md:grid-cols-4">
            {[
              { value: starsLabel, label: t("hero.stars") },
              { value: "MIT", label: t("status.facts.license") },
              { value: "Go", label: t("hero.statsStack") },
              { value: t("status.facts.apiValue"), label: t("hero.statsApi") },
            ].map((fact) => (
              <div
                key={fact.label}
                className="flex flex-col-reverse gap-2 bg-background px-6 py-7 md:px-12 md:py-9"
              >
                <dt className={MONO}>{fact.label}</dt>
                <dd className="m-0 text-[36px] font-bold leading-none tracking-[-0.04em] text-foreground tabular-nums md:text-[52px]">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* 2 — How it works: the data flow, animated. */}
        <DiagramSection
          index="01"
          kicker={t("diagrams.flow.kicker")}
          title={t("diagrams.flow.title")}
          caption={t("diagrams.flow.caption")}
        >
          <FlowDiagram />
        </DiagramSection>

        {/* 3 — One example, played as a short sequence. */}
        <DiagramSection
          index="02"
          kicker={t("diagrams.alert.kicker")}
          title={t("diagrams.alert.title")}
          caption={t("diagrams.alert.caption")}
          bordered
        >
          <AlertDiagram />
        </DiagramSection>

        {/* 4 — Architecture: plugins snapping into the generic core. */}
        <DiagramSection
          id="architecture"
          index="03"
          kicker={t("diagrams.plugins.kicker")}
          title={t("diagrams.plugins.title")}
          caption={t("diagrams.plugins.caption")}
          bordered
        >
          <PluginDiagram />
        </DiagramSection>

        {/* 5 — The service: what The Vibe Company does around the engine. */}
        <section
          id={QUIVR_SERVICES_ID}
          data-surface="inverse"
          className="scroll-mt-16 border-y-2 border-foreground bg-foreground text-background"
        >
          <div className={`${SECTION} py-16 md:py-24`}>
            <span className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/55">
              <span className="text-background">04</span>
              <span aria-hidden="true" className="h-px w-8 bg-white/25" />
              {t("services.kicker")}
            </span>
            <h2
              className="m-0 font-bold text-background"
              style={{
                fontSize: "clamp(32px, 5vw, 64px)",
                lineHeight: 0.95,
                letterSpacing: "-0.04em",
              }}
            >
              {t("services.title")}
            </h2>
            <p className="m-0 mt-5 max-w-[560px] text-[15px] leading-[1.6] text-white/70 md:text-base">
              {t("services.intro")}
            </p>

            <ol className="m-0 mt-12 grid list-none grid-cols-1 gap-px border border-white/15 bg-white/15 p-0 md:mt-14 md:grid-cols-3">
              {QUIVR_SERVICE_KEYS.map((key, i) => (
                <li key={key} className="bg-foreground p-6 md:p-8">
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-orange-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="m-0 mt-4 text-[22px] font-bold leading-[1.05] tracking-[-0.03em] text-background md:text-[26px]">
                    {t(`services.items.${key}.title`)}
                  </h3>
                  <p className="m-0 mt-2 text-[15px] leading-[1.5] text-white/65">
                    {t(`services.items.${key}.caption`)}
                  </p>
                </li>
              ))}
            </ol>

            <a
              href={QUIVR_BOOKING_URL}
              {...bookingLocation("quivr_services")}
              className="mt-10 inline-flex items-center gap-3 border-2 border-background bg-background px-6 py-4 text-[15px] font-semibold text-foreground transition-all duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_rgba(255,255,255,0.35)] md:mt-12 md:px-7 md:py-5 md:text-[17px]"
            >
              {t("services.cta")}
              <span aria-hidden="true" className="text-lg leading-none">
                →
              </span>
            </a>
          </div>
        </section>

        {/* 6 — History: V1 to V2, a timeline that draws itself. */}
        <DiagramSection
          index="05"
          kicker={t("diagrams.timeline.kicker")}
          title={t("diagrams.timeline.title")}
        >
          <TimelineDiagram stars={stars} />
        </DiagramSection>

        {/* 7 — FAQ: the long answers live here, folded. Plain <details>, so
            every answer is in the HTML and works without JavaScript. */}
        <section className={`${SECTION} border-t border-border py-14 md:py-20`}>
          <SectionKicker index="06" label="FAQ" />
          <h2 className={H2}>{t("faq.title")}</h2>
          <div className="mt-10 border-t-2 border-foreground md:mt-12">
            {QUIVR_FAQ_KEYS.map((key) => (
              <details key={key} className="group border-b border-border">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-[19px] font-bold leading-[1.2] tracking-[-0.025em] text-foreground marker:hidden md:text-[22px] [&::-webkit-details-marker]:hidden">
                  {t(`faq.items.${key}.q`)}
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 shrink-0 items-center justify-center border border-foreground font-mono text-lg leading-none transition-transform duration-300 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className={`${PROSE} max-w-[72ch] pb-7`}>{t(`faq.items.${key}.a`)}</p>
              </details>
            ))}
          </div>
        </section>

        {/* 8 — Final call, on the same grid paper as the homepage's. */}
        <section className="relative overflow-hidden border-y-2 border-foreground bg-background">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{
              backgroundImage:
                "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              maskImage:
                "linear-gradient(to bottom, transparent 0%, #000 20%, #000 80%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, #000 20%, #000 80%, transparent 100%)",
            }}
          />
          <div className={`relative ${SECTION} py-20 md:py-28`}>
            <span className="mb-8 block font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {`// ${t("finalCta.kicker")}`}
            </span>
            <h2
              className="m-0 mb-10 flex flex-col font-bold text-foreground"
              style={{
                fontSize: "clamp(48px, 9vw, 144px)",
                lineHeight: 0.88,
                letterSpacing: "-0.05em",
              }}
            >
              <span>{t("finalCta.titleLine1")}</span>
              <span style={{ WebkitTextStroke: "2px var(--foreground)", color: "transparent" }}>
                {t("finalCta.titleLine2")}
              </span>
            </h2>
            <div className="flex flex-wrap items-center gap-4 border-t border-border pt-8">
              <a
                href={QUIVR_BOOKING_URL}
                {...bookingLocation("quivr_final")}
                className={SLAB}
              >
                {t("finalCta.cta")}
                <span aria-hidden="true" className="text-lg leading-none">
                  →
                </span>
              </a>
              <a href={QUIVR_REPO_URL} {...EXTERNAL} className={OUTLINE}>
                <StarIcon />
                {t("finalCta.repo")}
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

/**
 * The hero visual: what goes in, Quivr in the middle, what comes out. Drawn
 * in code so it stays sharp, translated and in the site's own style.
 */
function FlowCard({
  title,
  inLabel,
  outLabel,
  sources,
  core,
  coreNote,
  outputs,
}: {
  title: string;
  inLabel: string;
  outLabel: string;
  sources: string[];
  core: string;
  coreNote: string;
  outputs: string[];
}) {
  return (
    <figure className="m-0 border-2 border-foreground bg-background shadow-[8px_8px_0_0_var(--foreground)]">
      <figcaption
        data-surface="inverse"
        className="bg-foreground px-5 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-background"
      >
        {title}
      </figcaption>
      <div className="flex flex-col gap-3 p-5 md:p-6">
        <FlowRow label={inLabel} items={sources} />
        <FlowConnector />
        <div
          data-surface="inverse"
          className="flex items-center gap-4 border-2 border-foreground bg-foreground px-5 py-4 text-background"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={QUIVR_LOGO} alt="" className="h-10 w-10 shrink-0" />
          <div className="min-w-0">
            <div className="text-[24px] font-bold leading-none tracking-[-0.035em]">{core}</div>
            <div className="mt-1.5 font-mono text-[10px] uppercase leading-[1.5] tracking-[0.14em] text-background/65">
              {coreNote}
            </div>
          </div>
        </div>
        <FlowConnector />
        <FlowRow label={outLabel} items={outputs} highlight={1} />
      </div>
    </figure>
  );
}

function FlowRow({
  label,
  items,
  highlight,
}: {
  label: string;
  items: string[];
  /** Index of the item marked with the orange signal dot. */
  highlight?: number;
}) {
  return (
    <div>
      <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </span>
      <ul className="m-0 grid list-none grid-cols-2 gap-2 p-0">
        {items.map((item, i) => (
          <li
            key={item}
            className="flex items-center gap-2 border border-foreground px-3 py-2.5 text-[14px] font-semibold text-foreground"
          >
            <span
              aria-hidden="true"
              className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                i === highlight ? "bg-orange-500" : "bg-foreground"
              }`}
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** A vertical rule with a dot running down it, the direction of the flow. */
function FlowConnector() {
  return (
    <div aria-hidden="true" className="relative mx-auto h-7 w-px bg-foreground">
      <span className="absolute -left-[3px] top-0 h-[7px] w-[7px] rounded-full bg-foreground motion-safe:animate-[quivr-flow_1.6s_ease-in_infinite]" />
    </div>
  );
}

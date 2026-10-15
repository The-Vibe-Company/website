import { getTranslations } from "next-intl/server";

import { Footer } from "@/components/Footer";
import { TopNav } from "@/components/TopNav";
import { Link } from "@/i18n/navigation";
import { bookingLocation } from "@/lib/booking";
import {
  formatStars,
  formatStarsCompact,
  QUIVR_BOOKING_URL,
  QUIVR_DOCS_URL,
  QUIVR_FAQ_KEYS,
  QUIVR_FEATURES,
  QUIVR_FORMAT_PLUGINS,
  QUIVR_HISTORY_KEYS,
  QUIVR_OUTPUT_KEYS,
  QUIVR_PIPELINE_STEPS,
  QUIVR_PLUGINS_DOCS_URL,
  QUIVR_PROBLEM_KEYS,
  QUIVR_QUICKSTART_URL,
  QUIVR_REPO_URL,
  QUIVR_SERVICE_KEYS,
  QUIVR_SERVICES_ID,
  QUIVR_SOURCE_PLUGINS,
  QUIVR_STACK,
  QUIVR_STORY_ARTICLE_PATH,
  QUIVR_V1_URL,
} from "@/lib/quivr";

/**
 * The Quivr V2 page, served at /fr/quivr and /en/quivr.
 *
 * Every fact on it comes from the Quivr README or docs.quivr.thevibecompany.co
 * (see src/lib/quivr.ts). The star count is live, or a floor when GitHub does
 * not answer; nothing else on the page is a figure.
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

function SectionKicker({ index, label }: { index: string; label: string }) {
  return (
    <span className={`mb-6 flex items-center gap-3 ${MONO}`}>
      <span className="text-foreground">{index}</span>
      <span aria-hidden="true" className="h-px w-8 bg-border" />
      {label}
    </span>
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
  const starsLabel = formatStars(stars, locale);

  return (
    <div
      data-variant="hybrid"
      className="flex min-h-screen flex-col bg-background text-foreground"
    >
      <TopNav />
      <main id="main-content" tabIndex={-1} className="flex-1">
        {/* 1 — Hero: the one H1, the value sentence, the call and the repo. */}
        <section className={`${SECTION} pb-14 pt-12 md:pb-20 md:pt-16`}>
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-16">
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
                  className="block"
                  style={{ fontSize: "clamp(56px, 10vw, 152px)", lineHeight: 0.86 }}
                >
                  {t("hero.titleLead")}
                </span>{" "}
                <span
                  className="mt-3 block max-w-[18ch] md:mt-4"
                  style={{ fontSize: "clamp(26px, 3.4vw, 48px)", lineHeight: 1 }}
                >
                  {t("hero.titleRest")}{" "}
                  <span className="whitespace-nowrap">(YC W24)</span>
                </span>
              </h1>

              <p className="m-0 mt-8 max-w-[640px] border-l-2 border-foreground pl-5 text-lg leading-[1.5] text-foreground md:pl-6 md:text-[19px]">
                {t("hero.lede")}
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

            {/* The document pipeline, as the README names its steps. */}
            <figure className="m-0 border-2 border-foreground bg-background shadow-[8px_8px_0_0_var(--foreground)]">
              <div
                data-surface="inverse"
                className="flex items-center justify-between gap-4 bg-foreground px-5 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-background"
              >
                <span>{t("hero.pipelineTitle")}</span>
                <span className="hidden text-background/60 sm:inline">quivr · v0</span>
              </div>
              <ol className="m-0 list-none p-0">
                {QUIVR_PIPELINE_STEPS.map((step, i) => {
                  const last = i === QUIVR_PIPELINE_STEPS.length - 1;
                  return (
                    <li
                      key={step}
                      className="flex items-center gap-4 border-b border-border px-5 py-4 last:border-b-0 motion-safe:animate-[quivr-step_0.5s_cubic-bezier(0.16,1,0.3,1)_both]"
                      style={{ animationDelay: `${150 + i * 140}ms` }}
                    >
                      <span className="w-6 font-mono text-[11px] tracking-[0.1em] text-muted-foreground">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1 text-[15px] font-semibold tracking-[-0.01em] text-foreground md:text-base">
                        {t(`hero.steps.${step}`)}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`flex h-6 w-6 items-center justify-center border text-[12px] leading-none ${
                          last
                            ? "border-orange-500 bg-orange-500 text-white"
                            : "border-foreground text-foreground"
                        }`}
                      >
                        ✓
                      </span>
                    </li>
                  );
                })}
              </ol>
              <figcaption className="border-t-2 border-foreground px-5 py-4 text-[13px] leading-[1.5] text-muted-foreground">
                {t("hero.pipelineCaption")}
              </figcaption>
            </figure>
          </div>

          {/* Key facts strip: the live star count, then what the README states. */}
          <dl className="m-0 mt-14 grid grid-cols-2 border-l border-t border-border md:mt-16 md:grid-cols-4">
            {[
              { value: starsLabel, label: t("hero.stars") },
              { value: t("status.facts.licenseValue"), label: t("status.facts.license") },
              { value: "Go", label: "Postgres · S3 · Temporal" },
              {
                value: t("status.facts.apiValue"),
                label: `${t("status.facts.api")} · ${t("status.facts.stageValue")}`,
              },
            ].map((fact) => (
              <div
                key={fact.label}
                className="flex flex-col-reverse gap-2 border-b border-r border-border px-5 py-6 md:px-7 md:py-8"
              >
                <dt className={MONO}>{fact.label}</dt>
                <dd className="m-0 text-[36px] font-bold leading-none tracking-[-0.04em] text-foreground tabular-nums md:text-[52px]">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* 2 — The problem: content streams that must not be dropped. */}
        <section className={`${SECTION} border-t border-border py-14 md:py-20`}>
          <SectionKicker index="01" label={t("problem.kicker")} />
          <h2 className={H2}>{t("problem.title")}</h2>
          <p className={`${PROSE} mt-5 max-w-[720px]`}>{t("problem.intro")}</p>

          <div className="mt-10 grid grid-cols-1 border-t-2 border-foreground md:mt-14 md:grid-cols-3">
            {QUIVR_PROBLEM_KEYS.map((key, i) => (
              <article
                key={key}
                className="border-b border-border py-7 md:border-b-0 md:border-r md:px-7 md:py-9 md:first:pl-0 md:last:border-r-0"
              >
                <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="m-0 mt-4 text-[22px] font-bold leading-[1.1] tracking-[-0.03em] text-foreground md:text-[26px]">
                  {t(`problem.items.${key}.title`)}
                </h3>
                <p className={`${PROSE} mt-3`}>{t(`problem.items.${key}.desc`)}</p>
              </article>
            ))}
          </div>
        </section>

        {/* 3 — Features, each card pointing at its guide in the docs. */}
        <section className={`${SECTION} border-t border-border py-14 md:py-20`}>
          <SectionKicker index="02" label={t("features.kicker")} />
          <h2 className={H2}>{t("features.title")}</h2>

          <div className="mt-10 grid grid-cols-1 gap-5 md:mt-14 md:grid-cols-2 lg:grid-cols-3">
            {QUIVR_FEATURES.map((feature, i) => (
              <article
                key={feature.key}
                className="flex flex-col border border-foreground bg-background p-7 transition-[transform,box-shadow] duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_0_var(--foreground)]"
              >
                <div className="mb-7 flex items-start justify-between gap-3">
                  <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="border border-foreground px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground">
                    {t(`features.items.${feature.key}.tag`)}
                  </span>
                </div>
                <h3 className="m-0 mb-4 text-[24px] font-bold leading-[1.05] tracking-[-0.035em] text-foreground md:text-[28px]">
                  {t(`features.items.${feature.key}.title`)}
                </h3>
                <p className={`${PROSE} flex-1`}>
                  {t(`features.items.${feature.key}.desc`)}
                </p>
                <a href={feature.href} {...EXTERNAL} className={`mt-6 self-start ${TEXT_LINK}`}>
                  {t("features.guide")}
                  <span aria-hidden="true">↗</span>
                </a>
              </article>
            ))}

            {/* Sixth cell: the bridge to the architecture section. */}
            <a
              href="#architecture"
              data-surface="inverse"
              className="group flex flex-col justify-between gap-10 border border-foreground bg-foreground p-7 text-background transition-[transform,box-shadow] duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_0_var(--foreground)]"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-background/60">
                {t("architecture.kicker")}
              </span>
              <span className="text-[24px] font-bold leading-[1.05] tracking-[-0.035em] md:text-[28px]">
                {t("architecture.title")}
              </span>
              <span aria-hidden="true" className="text-2xl leading-none transition-transform duration-300 group-hover:translate-y-1">
                ↓
              </span>
            </a>
          </div>
        </section>

        {/* 4 — Architecture: generic core, plugins at the edges, self-hosted. */}
        <section
          id="architecture"
          className={`${SECTION} scroll-mt-24 border-t border-border py-14 md:py-20`}
        >
          <SectionKicker index="03" label={t("architecture.kicker")} />
          <h2 className={H2}>{t("architecture.title")}</h2>
          <p className={`${PROSE} mt-5 max-w-[720px]`}>{t("architecture.intro")}</p>

          <figure className="m-0 mt-10 md:mt-14">
            <figcaption className="sr-only">{t("architecture.diagramLabel")}</figcaption>
            <div className="grid grid-cols-1 items-stretch gap-3 lg:grid-cols-[minmax(0,1fr)_32px_minmax(0,1.25fr)_32px_minmax(0,1fr)] lg:gap-0">
              {/* In */}
              <div className="flex flex-col gap-3">
                <span className={MONO}>{t("architecture.in")}</span>
                <div className="flex-1 border border-foreground p-5">
                  <h3 className="m-0 text-lg font-bold tracking-[-0.02em] text-foreground">
                    {t("architecture.sources")}
                  </h3>
                  <p className="m-0 mt-2 text-sm leading-[1.5] text-muted-foreground">
                    {t("architecture.sourcesNote")}
                  </p>
                </div>
                <div className="flex-1 border border-foreground p-5">
                  <h3 className="m-0 text-lg font-bold tracking-[-0.02em] text-foreground">
                    {t("architecture.app")}
                  </h3>
                  <p className="m-0 mt-2 text-sm leading-[1.5] text-muted-foreground">
                    {t("architecture.appNote")}
                  </p>
                </div>
              </div>

              <Arrow />

              {/* Core, with its plugins underneath */}
              <div className="flex flex-col gap-3">
                <span className={`${MONO} hidden lg:invisible lg:block`} aria-hidden="true">
                  &nbsp;
                </span>
                <div
                  data-surface="inverse"
                  className="border-2 border-foreground bg-foreground p-6 text-background"
                >
                  <h3 className="m-0 text-[26px] font-bold leading-none tracking-[-0.035em]">
                    {t("architecture.core")}
                  </h3>
                  <p className="m-0 mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-background/60">
                    {t("architecture.coreNote")}
                  </p>
                  <ul className="m-0 mt-5 flex list-none flex-wrap gap-2 p-0">
                    {QUIVR_STACK.map((item) => (
                      <li
                        key={item}
                        className="border border-white/25 px-2 py-0.5 font-mono text-[11px] tracking-[0.06em] text-background"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div
                  aria-hidden="true"
                  className="flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
                >
                  <span className="h-5 w-px bg-foreground" />
                  HTTP
                  <span className="h-5 w-px bg-foreground" />
                </div>
                <div className="flex-1 border-2 border-dashed border-foreground p-5">
                  <h3 className="m-0 text-lg font-bold tracking-[-0.02em] text-foreground">
                    {t("architecture.plugins")}
                  </h3>
                  <p className="m-0 mt-1 text-sm leading-[1.5] text-muted-foreground">
                    {t("architecture.pluginsNote")}
                  </p>
                  <dl className="m-0 mt-4 grid grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-2">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {t("architecture.sources")}
                    </dt>
                    <dd className="m-0 text-sm font-semibold text-foreground">
                      {[...QUIVR_SOURCE_PLUGINS, t("architecture.xLists")].join(" · ")}
                    </dd>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {t("architecture.formats")}
                    </dt>
                    <dd className="m-0 text-sm font-semibold text-foreground">
                      {QUIVR_FORMAT_PLUGINS.join(" · ")}
                    </dd>
                  </dl>
                </div>
              </div>

              <Arrow />

              {/* Out */}
              <div className="flex flex-col gap-3">
                <span className={MONO}>{t("architecture.out")}</span>
                <ul className="m-0 flex flex-1 list-none flex-col border border-foreground p-0">
                  {QUIVR_OUTPUT_KEYS.map((key) => (
                    <li
                      key={key}
                      className="flex flex-1 items-center gap-3 border-b border-border px-5 py-4 text-[15px] font-semibold leading-[1.35] text-foreground last:border-b-0"
                    >
                      <span aria-hidden="true" className="font-mono text-muted-foreground">
                        →
                      </span>
                      {t(`architecture.${key}`)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </figure>

          <div className="mt-12 grid grid-cols-1 gap-10 border-t-2 border-foreground pt-10 md:mt-16 md:grid-cols-2 md:gap-16">
            {/* Quoted verbatim from the README, so in English on both pages. */}
            <blockquote className="m-0">
              <p lang="en" className="m-0 text-[24px] font-bold leading-[1.15] tracking-[-0.03em] text-foreground md:text-[32px]">
                “{t("architecture.rule")}”
              </p>
              <footer className={`mt-4 ${MONO}`}>— {t("architecture.ruleSource")}</footer>
            </blockquote>
            <div>
              <h3 className="m-0 text-[22px] font-bold leading-[1.1] tracking-[-0.03em] text-foreground md:text-[26px]">
                {t("architecture.selfHostTitle")}
              </h3>
              <p className={`${PROSE} mt-4`}>{t("architecture.selfHostDesc")}</p>
              <a href={QUIVR_PLUGINS_DOCS_URL} {...EXTERNAL} className={`mt-5 ${TEXT_LINK}`}>
                {t("architecture.pluginsLink")}
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>

        {/* 5 — Honest status: evaluation stage, API v0, where to start. */}
        <section className={`${SECTION} border-t border-border py-14 md:py-20`}>
          <SectionKicker index="04" label={t("status.kicker")} />
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:gap-16">
            <div>
              <h2 className={H2}>{t("status.title")}</h2>
              <p className={`${PROSE} mt-5 max-w-[640px]`}>{t("status.desc")}</p>
              <p className="m-0 mt-5 max-w-[640px] border-l-2 border-foreground pl-5 text-[15px] leading-[1.6] text-foreground md:text-base">
                {t("status.quickstartDesc")}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                <a href={QUIVR_QUICKSTART_URL} {...EXTERNAL} className={OUTLINE}>
                  {t("status.quickstart")}
                  <span aria-hidden="true">↗</span>
                </a>
                <a href={QUIVR_DOCS_URL} {...EXTERNAL} className={TEXT_LINK}>
                  {t("status.docs")}
                  <span aria-hidden="true">↗</span>
                </a>
                <a href={QUIVR_REPO_URL} {...EXTERNAL} className={TEXT_LINK}>
                  {t("status.repo")}
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
            <dl className="m-0 self-start border border-foreground">
              {(["stage", "api", "license", "runtime"] as const).map((key) => (
                <div
                  key={key}
                  className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-4 border-b border-border px-5 py-4 last:border-b-0 md:px-6"
                >
                  <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    {t(`status.facts.${key}`)}
                  </dt>
                  <dd className="m-0 flex items-center gap-2 text-[15px] font-semibold text-foreground">
                    {key === "stage" ? (
                      <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-orange-500" />
                    ) : null}
                    {t(`status.facts.${key}Value`)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* 6 — The service: what The Vibe Company does around the engine. */}
        <section
          id={QUIVR_SERVICES_ID}
          data-surface="inverse"
          className="scroll-mt-16 border-y-2 border-foreground bg-foreground text-background"
        >
          <div className={`${SECTION} py-16 md:py-24`}>
            <span className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/55">
              <span className="text-background">05</span>
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
            <p className="m-0 mt-5 max-w-[680px] text-[15px] leading-[1.6] text-white/70 md:text-base">
              {t("services.intro")}
            </p>

            <ol className="m-0 mt-12 grid list-none grid-cols-1 border-t border-white/15 p-0 md:mt-16 md:grid-cols-3">
              {QUIVR_SERVICE_KEYS.map((key, i) => (
                <li
                  key={key}
                  className="border-b border-white/15 py-8 md:border-b-0 md:border-r md:px-8 md:py-10 md:first:pl-0 md:last:border-r-0"
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-orange-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="m-0 mt-4 text-[24px] font-bold leading-[1.05] tracking-[-0.03em] text-background md:text-[28px]">
                    {t(`services.items.${key}.title`)}
                  </h3>
                  <p className="m-0 mt-4 text-[15px] leading-[1.6] text-white/70 md:text-base">
                    {t(`services.items.${key}.desc`)}
                  </p>
                </li>
              ))}
            </ol>

            <a
              href={QUIVR_BOOKING_URL}
              {...bookingLocation("quivr_services")}
              className="mt-12 inline-flex items-center gap-3 border-2 border-background bg-background px-6 py-4 text-[15px] font-semibold text-foreground transition-all duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_rgba(255,255,255,0.35)] md:mt-14 md:px-7 md:py-5 md:text-[17px]"
            >
              {t("services.cta")}
              <span aria-hidden="true" className="text-lg leading-none">
                →
              </span>
            </a>
          </div>
        </section>

        {/* 7 — History: V1, the move to The Vibe Company, V2. */}
        <section className={`${SECTION} py-14 md:py-20`}>
          <SectionKicker index="06" label={t("history.kicker")} />
          <h2 className={H2}>{t("history.title")}</h2>

          <ol className="m-0 mt-10 grid list-none grid-cols-1 p-0 md:mt-14 md:grid-cols-3">
            {QUIVR_HISTORY_KEYS.map((key) => (
              <li
                key={key}
                className="relative border-l-2 border-foreground pb-10 pl-6 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pr-10 md:pt-8"
              >
                <span
                  aria-hidden="true"
                  className={`absolute -left-[7px] top-0 h-3 w-3 border-2 border-foreground md:-top-[7px] md:left-0 ${
                    key === "v2" ? "bg-orange-500" : "bg-background"
                  }`}
                />
                <span className={MONO}>{t(`history.items.${key}.label`)}</span>
                <h3 className="m-0 mt-3 text-[22px] font-bold leading-[1.1] tracking-[-0.03em] text-foreground md:text-[26px]">
                  {t(`history.items.${key}.title`)}
                </h3>
                <p className={`${PROSE} mt-3`}>
                  {t(`history.items.${key}.desc`, {
                    stars: formatStarsCompact(stars, locale),
                  })}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-col gap-6 border border-foreground p-6 md:mt-14 md:flex-row md:items-center md:justify-between md:p-8">
            <div className="max-w-[640px]">
              <h3 className="m-0 text-[20px] font-bold tracking-[-0.03em] text-foreground md:text-[24px]">
                {t("history.communityTitle")}
              </h3>
              <p className={`${PROSE} mt-2`}>{t("history.communityDesc")}</p>
            </div>
            <div className="flex flex-col items-start gap-4">
              <a href={QUIVR_V1_URL} {...EXTERNAL} className={OUTLINE}>
                {t("history.v1Link")}
                <span aria-hidden="true">↗</span>
              </a>
              <Link href={QUIVR_STORY_ARTICLE_PATH} className={TEXT_LINK}>
                {t("history.storyLink")}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 8 — FAQ, plain HTML so every answer is crawlable. */}
        <section className={`${SECTION} border-t border-border py-14 md:py-20`}>
          <SectionKicker index="07" label="FAQ" />
          <h2 className={H2}>{t("faq.title")}</h2>

          <div className="mt-10 border-t-2 border-foreground md:mt-12">
            {QUIVR_FAQ_KEYS.map((key) => (
              <article
                key={key}
                className="grid grid-cols-1 gap-3 border-b border-border py-7 md:grid-cols-[minmax(0,420px)_1fr] md:gap-12 md:py-8"
              >
                <h3 className="m-0 text-[20px] font-bold leading-[1.15] tracking-[-0.03em] text-foreground md:text-[24px]">
                  {t(`faq.items.${key}.q`)}
                </h3>
                <p className={`${PROSE} max-w-[70ch]`}>{t(`faq.items.${key}.a`)}</p>
              </article>
            ))}
          </div>
        </section>

        {/* 9 — Final call, on the same grid paper as the homepage's. */}
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

function Arrow() {
  return (
    <div
      aria-hidden="true"
      className="flex items-center justify-center font-mono text-xl text-foreground lg:pt-7"
    >
      <span className="lg:hidden">↓</span>
      <span className="hidden lg:inline">→</span>
    </div>
  );
}

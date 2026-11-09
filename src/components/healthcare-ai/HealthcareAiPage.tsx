import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";

import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { TopNav } from "@/components/TopNav";
import { AboutBackers } from "@/components/about/AboutBackers";
import { AboutBookingCta } from "@/components/about/AboutBookingCta";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Link } from "@/i18n/navigation";
import { getCustomer, type ContentLocale } from "@/lib/customers";
import {
  HEALTHCARE_AUDIENCE_KEYS,
  HEALTHCARE_CASE_SLUG,
  HEALTHCARE_FAQ_KEYS,
  HEALTHCARE_HDS_KEYS,
  HEALTHCARE_HERO_KEYS,
  HEALTHCARE_METHOD_STEPS,
  HEALTHCARE_OFFER_KEYS,
  HEALTHCARE_SECONDARY_CASE_SLUG,
  healthcareHdsArticle,
  healthcarePageId,
} from "@/lib/healthcare-ai";
import {
  ABOUT_PATHS,
  AGENCY_PARIS_PATHS,
  HARDENING_PATHS,
  HEALTHCARE_AI_PATHS,
  localizedSocialMetadata,
  localizedUrl,
  splitPath,
  splitPathAlternates,
} from "@/lib/site";
import {
  breadcrumbList,
  faqPageSchema,
  serviceNode,
  webPageNode,
} from "@/lib/structured-data";
import { clientLogoSize } from "@/lib/client-logos";
import { BrandSquare } from "@/components/BrandSquare";
import { keepPunctuationAttached } from "@/lib/french-spacing";

// List marker drawn as a short rule rather than a dash character.
const DASH = "mt-[0.72em] h-px w-[0.6em] shrink-0 bg-muted-foreground";

/**
 * The healthcare AI landing, served at /fr/ia-sante-hds and
 * /en/healthcare-ai-hds. Both routes render this component; each declares the
 * other through hreflang.
 *
 * Drawn in the landing's theme, like the About page: the hero on the ink in
 * an orange bloom, then warm paper (lamp cards with lit numerals, the HDS
 * scope with the certified host under the lamp, the Monka case with lit
 * figures), the method as an ink band in the orange light, the FAQ and
 * further reading on paper, and the closing scene. The HDS certification is
 * the host's: the page never claims it.
 */

export async function healthcareAiMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "healthcareAi" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  const path = splitPath(HEALTHCARE_AI_PATHS, locale);

  return {
    // Absolute, not the layout template: the brand is already in the title.
    title: { absolute: title },
    description,
    alternates: splitPathAlternates(locale, HEALTHCARE_AI_PATHS),
    ...localizedSocialMetadata({ locale, path, title, description }),
  };
}

const SECTION = "mx-auto max-w-[90rem] px-6 md:px-10 lg:px-16";
const BAND = `${SECTION} py-20 md:py-28 lg:py-32`;
const H2 =
  "m-0 text-balance font-bold text-foreground text-[clamp(2.5rem,5.6vw,5.25rem)] leading-[0.92] tracking-[-0.045em]";
const MONO =
  "font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground";
const PROSE = "m-0 text-[15px] leading-[1.6] text-muted-foreground md:text-base";
const TEXT_LINK =
  "text-foreground underline decoration-1 underline-offset-4 transition-colors hover:text-brand";
const MONO_LINK =
  "inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground underline decoration-1 underline-offset-4 transition-colors hover:text-brand";
/** The orange bloom behind the hero, as on the About page. */
const BLOOM =
  "radial-gradient(closest-side, rgb(242 115 19 / 0.2), rgb(242 115 19 / 0.06) 55%, transparent)";
/** The soft orange light an emphasis ink band sits in. */
const GLOW =
  "radial-gradient(55% 70% at 12% 100%, rgb(242 115 19 / 0.18), rgb(242 115 19 / 0.05) 55%, transparent 80%)";
/** The short orange bar a lamp card hangs from, with its glow. */
const LAMP =
  "absolute left-1/2 top-0 h-1.5 w-16 -translate-x-1/2 bg-brand shadow-[0_0_40px_12px_rgba(242,115,19,0.45)]";

/** The FAQ answers' link tags, kept as plain text for the JSON-LD. */
const FAQ_PLAIN_TAGS = {
  hds: (chunks: string) => chunks,
  agency: (chunks: string) => chunks,
  hardening: (chunks: string) => chunks,
};

export async function HealthcareAiPage({ locale }: { locale: string }) {
  const contentLocale: ContentLocale = locale === "en" ? "en" : "fr";
  const t = await getTranslations({ locale, namespace: "healthcareAi" });
  const tAbout = await getTranslations({ locale, namespace: "about" });
  const tFooter = await getTranslations({ locale, namespace: "footer" });

  const pageUrl = localizedUrl(locale, splitPath(HEALTHCARE_AI_PATHS, locale));
  const page = healthcarePageId(locale);
  const hdsArticle = healthcareHdsArticle(locale);
  const monka = getCustomer(HEALTHCARE_CASE_SLUG, contentLocale);
  const secondary = getCustomer(HEALTHCARE_SECONDARY_CASE_SLUG, contentLocale);
  const monkaPath = `/case-studies/${HEALTHCARE_CASE_SLUG}`;
  const faqLinks = {
    hds: (chunks: ReactNode) => (
      <Link href={hdsArticle} className={TEXT_LINK}>
        {chunks}
      </Link>
    ),
    agency: (chunks: ReactNode) => (
      <Link href={splitPath(AGENCY_PARIS_PATHS, locale)} className={TEXT_LINK}>
        {chunks}
      </Link>
    ),
    hardening: (chunks: ReactNode) => (
      <Link href={splitPath(HARDENING_PATHS, locale)} className={TEXT_LINK}>
        {chunks}
      </Link>
    ),
  };

  const jsonLd = [
    webPageNode({
      url: pageUrl,
      name: t("title"),
      description: t("metaDescription"),
      language: locale,
    }),
    breadcrumbList([
      { name: tFooter("home"), url: localizedUrl(locale) },
      { name: t("breadcrumb"), url: pageUrl },
    ]),
    faqPageSchema(
      HEALTHCARE_FAQ_KEYS.map((key) => ({
        question: t(`faq.items.${key}.q`),
        // The answers' inline links, dropped to the text the reader sees.
        answer: t.markup(`faq.items.${key}.a`, FAQ_PLAIN_TAGS),
      })),
    ),
    serviceNode({
      url: pageUrl,
      name: t("service.name"),
      serviceType: "Healthcare AI product development under GDPR and HDS requirements",
      description: t("service.description"),
    }),
  ];

  return (
    <div
      data-variant="hybrid"
      className="flex min-h-screen flex-col bg-background text-foreground"
    >
      {jsonLd.map((node, i) => (
        <JsonLd key={i} data={node} />
      ))}
      <TopNav />
      <main id="main-content" tabIndex={-1} className="flex-1">
        {/* 1 — On the ink, in the hero's orange light: the one H1 on the
            page, the promise, the facts and the call. */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-72 -right-48 h-[900px] w-[1100px]"
            style={{ background: BLOOM }}
          />
          <div className={`relative ${SECTION} pb-20 pt-12 md:pb-28 lg:pt-[80px]`}>
            <span className="block font-mono text-[12px] uppercase tracking-[0.2em] text-soft-foreground">
              <BrandSquare />
              {t("kicker")}
            </span>
            <h1 className="m-0 mt-8 max-w-[19ch] text-balance text-[clamp(2.5rem,6vw,6rem)] font-bold leading-[0.92] tracking-[-0.05em] text-foreground lg:mt-10">
              {keepPunctuationAttached(t("title"))}
            </h1>
            <p className="m-0 mt-10 max-w-[760px] border-l border-border-strong pl-5 text-lg leading-[1.5] text-foreground md:pl-6 md:text-[19px]">
              {t("lede")}
            </p>

            <span className={`mt-12 block ${MONO}`}>{t("hero.label")}</span>
            <ul className="m-0 mt-4 grid max-w-[1100px] list-none grid-cols-1 gap-x-10 border-t border-border p-0 md:grid-cols-2">
              {HEALTHCARE_HERO_KEYS.map((key) => (
                <li
                  key={key}
                  className="flex gap-4 border-b border-border py-4 text-[15px] leading-[1.5] text-foreground md:text-base"
                >
                  <span aria-hidden="true" className="mt-[0.6em] h-1.5 w-1.5 shrink-0 bg-brand" />
                  {t(`hero.items.${key}`)}
                </li>
              ))}
            </ul>

            <AboutBookingCta
              page={page}
              location="cta_healthcare_ai_hero"
              namespace="healthcareAi"
            />
            <AboutBackers label={tAbout("backedBy")} />

            {/* The healthcare client already on the site, and no other logo. */}
            {monka ? (
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-border pt-7">
                <span className={MONO}>{t("hero.caseLabel")}</span>
                <Link
                  href={monkaPath}
                  className="group inline-flex items-center gap-4 text-foreground"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={monka.logo}
                    alt={monka.client}
                    {...clientLogoSize(monka.logo)}
                    className="logo-tone h-8 w-auto max-w-[160px] object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] underline decoration-1 underline-offset-4 transition-colors group-hover:text-brand">
                    {t("hero.caseLink")}
                    <span aria-hidden="true"> →</span>
                  </span>
                </Link>
              </div>
            ) : null}
          </div>
        </section>

        <div data-surface="paper">
          {/* 2 — Who it is for: the kinds of teams, then the signals. */}
          <section className={BAND}>
            <h2 className={H2}>{t("audience.title")}</h2>
            <p className={`${PROSE} mt-6 max-w-[680px]`}>{t("audience.intro")}</p>

            <div className="mt-12 grid grid-cols-1 gap-10 md:mt-16 md:grid-cols-2 md:gap-12">
              <div>
                <span className={MONO}>{t("audience.typesLabel")}</span>
                <ul className="m-0 mt-4 flex list-none flex-col border-t border-border p-0">
                  {HEALTHCARE_AUDIENCE_KEYS.map((key, i) => (
                    <li
                      key={key}
                      className="flex items-baseline gap-4 border-b border-border py-4 text-[17px] leading-[1.45] text-foreground"
                    >
                      <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{t(`audience.types.${key}`)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <span className={MONO}>{t("audience.signalsLabel")}</span>
                <ul className="m-0 mt-4 flex list-none flex-col border-t border-border p-0">
                  {(t.raw("audience.signals") as string[]).map((signal) => (
                    <li
                      key={signal}
                      className="flex gap-3 border-b border-border py-4 text-[17px] leading-[1.45] text-foreground"
                    >
                      <span aria-hidden="true" className={DASH} />
                      <span>{signal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* 3 — The offer: five building blocks, each under its lamp. The
              first card spans two columns so five cards fill two full rows. */}
          <section className={`${BAND} border-t border-border`}>
            <h2 className={`${H2} max-w-[20ch]`}>{t("offer.title")}</h2>
            <p className={`${PROSE} mt-6 max-w-[680px]`}>{t("offer.intro")}</p>

            <div className="mt-12 grid grid-cols-1 gap-4 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
              {HEALTHCARE_OFFER_KEYS.map((key, i) => (
                <article
                  key={key}
                  className={`lamp-card relative flex flex-col overflow-hidden border border-border p-7 md:p-9 ${
                    i === 0 ? "md:col-span-2" : ""
                  }`}
                >
                  <span aria-hidden="true" className={LAMP} />
                  <div className="relative mb-10 flex items-baseline justify-between gap-3">
                    <span className="text-lit text-[56px] font-bold leading-none tracking-[-0.05em]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-right font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {t(`offer.items.${key}.tag`)}
                    </span>
                  </div>
                  <h3 className="relative m-0 mb-4 text-[clamp(1.5rem,2.2vw,2rem)] font-bold leading-[1.05] tracking-[-0.03em] text-foreground">
                    {t(`offer.items.${key}.title`)}
                  </h3>
                  <p className={`relative ${PROSE} max-w-[60ch] text-soft-foreground`}>
                    {t(`offer.items.${key}.desc`)}
                  </p>
                </article>
              ))}
            </div>
          </section>

          {/* 4 — Who holds the HDS certification, and where we work: the
              certified host under the lamp, we build inside the client's
              perimeter. */}
          <section className={`${BAND} border-t border-border`}>
            <h2 className={`${H2} max-w-[20ch]`}>{t("hds.title")}</h2>
            <p className={`${PROSE} mt-6 max-w-[680px]`}>{t("hds.intro")}</p>

            <div className="mt-12 grid grid-cols-1 gap-10 md:mt-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
              <figure className="m-0 self-start border border-dashed border-border-strong p-5 md:p-7">
                <figcaption className={MONO}>{t("hds.scope.label")}</figcaption>
                <div className="lamp-card relative mt-5 overflow-hidden border border-border p-6 md:p-7">
                  <span aria-hidden="true" className={LAMP} />
                  <span className="relative font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    01
                  </span>
                  <p className="relative m-0 mt-3 text-[22px] font-bold leading-[1.1] tracking-[-0.03em] text-foreground md:text-[26px]">
                    {t("hds.scope.host.label")}
                  </p>
                  <p className={`relative ${PROSE} mt-2 text-soft-foreground`}>
                    {t("hds.scope.host.desc")}
                  </p>
                </div>
                <div className="mt-4 border border-border bg-card p-6 md:p-7">
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    02
                  </span>
                  <p className="m-0 mt-3 text-[22px] font-bold leading-[1.1] tracking-[-0.03em] text-foreground md:text-[26px]">
                    {t("hds.scope.us.label")}
                  </p>
                  <p className={`${PROSE} mt-2`}>{t("hds.scope.us.desc")}</p>
                </div>
              </figure>

              <div>
                <div className="border-t border-border">
                  {HEALTHCARE_HDS_KEYS.map((key, i) => (
                    <article
                      key={key}
                      className="grid grid-cols-1 gap-3 border-b border-border py-7 md:grid-cols-[80px_minmax(0,1fr)] md:gap-6 md:py-8"
                    >
                      <span className="text-lit self-start text-[36px] font-bold leading-none tracking-[-0.05em] md:text-[44px]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="m-0 text-[20px] font-bold leading-[1.15] tracking-[-0.03em] text-foreground md:text-[24px]">
                          {t(`hds.items.${key}.title`)}
                        </h3>
                        <p className={`${PROSE} mt-2 max-w-[68ch]`}>
                          {t(`hds.items.${key}.desc`)}
                        </p>
                        {key === "ai" ? (
                          <Link href={hdsArticle} className={`${MONO_LINK} mt-4`}>
                            {t("hds.articleLink")}
                            <span aria-hidden="true">→</span>
                          </Link>
                        ) : null}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 5 — Proof: the Monka case, facts from the published case study
              only, its figures lit, then one non-healthcare case for
              shipping pace. */}
          <section className={`${BAND} border-t border-border`}>
            <h2 className={`${H2} max-w-[20ch]`}>{t("proof.title")}</h2>
            <p className={`${PROSE} mt-6 max-w-[720px]`}>{t("proof.intro")}</p>

            {monka ? (
              <article className="mt-12 grid grid-cols-1 border border-border bg-card transition-colors duration-300 hover:border-border-strong md:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
                <div className="flex flex-col border-b border-border p-7 md:p-9 lg:border-b-0 lg:border-r">
                  <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
                    <h3 className="m-0">
                      {/* The logo is the card's title: its alt carries the client name. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={monka.logo}
                        alt={monka.client}
                        {...clientLogoSize(monka.logo)}
                        className="logo-tone h-8 w-auto max-w-[180px] object-contain object-left md:h-9"
                        loading="lazy"
                        decoding="async"
                      />
                    </h3>
                    <span className="text-right font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] text-muted-foreground">
                      {monka.sector}
                    </span>
                  </div>

                  <dl className="m-0 mt-10 grid grid-cols-2 border-l border-t border-border">
                    {monka.results.map((stat) => (
                      // The figure reads first on screen; the label stays first
                      // in the markup, as a term before its value.
                      <div
                        key={stat.label}
                        className="flex flex-col-reverse justify-end gap-2 border-b border-r border-border p-4 md:p-5"
                      >
                        <dt className="text-sm leading-[1.4] text-muted-foreground">{stat.label}</dt>
                        <dd className="m-0 text-[36px] font-bold leading-none tracking-[-0.05em] md:text-[48px]">
                          <span className="text-lit box-decoration-clone">{stat.value}</span>
                        </dd>
                      </div>
                    ))}
                  </dl>

                  {monka.quote ? (
                    <figure className="m-0 mt-10 border-l border-border-strong pl-5">
                      <blockquote className="m-0 text-[16px] leading-[1.6] text-foreground">
                        {locale === "fr" ? `« ${monka.quote.text} »` : `“${monka.quote.text}”`}
                      </blockquote>
                      {/* Not uppercased: the attribution reads exactly as written. */}
                      <figcaption className="mt-3 font-mono text-[12px] tracking-[0.04em] text-muted-foreground">
                        {t("proof.quoteAttribution", { author: monka.quote.author })}
                      </figcaption>
                    </figure>
                  ) : null}
                </div>
                <div className="flex flex-col p-7 md:p-9">
                  <ul className="m-0 flex list-none flex-col p-0">
                    {(t.raw("proof.points") as string[]).map((point) => (
                      <li
                        key={point}
                        className="flex gap-3 border-b border-border py-4 text-[15px] leading-[1.55] text-foreground last:border-b-0 md:text-base"
                      >
                        <span aria-hidden="true" className="font-mono text-brand">
                          →
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={monkaPath} className={`${MONO_LINK} mt-auto self-start pt-6`}>
                    {t("proof.readCase")}
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ) : null}

            {secondary ? (
              <div className="mt-4 grid grid-cols-1 gap-4 border border-border bg-card p-7 md:grid-cols-[minmax(0,260px)_1fr_auto] md:items-center md:gap-10 md:p-9">
                <span className={MONO}>{t("proof.otherLabel")}</span>
                <p className={`${PROSE} text-foreground`}>{t("proof.other")}</p>
                <Link
                  href={`/case-studies/${secondary.slug}`}
                  className={`${MONO_LINK} self-start md:self-center`}
                >
                  {t("proof.otherLink")}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            ) : null}
          </section>
        </div>

        {/* 6 — How a project starts: an ink band in the orange light, like
            the About process section, with the mid-page call. */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ background: GLOW }}
          />
          <div className={`relative ${BAND}`}>
            <h2 className={H2}>{t("method.title")}</h2>
            <p className={`${PROSE} mt-6 max-w-[680px]`}>{t("method.intro")}</p>

            <span className={`mt-14 block border-b border-border pb-4 md:mt-16 ${MONO}`}>
              {t("method.stepsLabel")}
            </span>
            <ol className="m-0 flex list-none flex-col p-0">
              {HEALTHCARE_METHOD_STEPS.map((step) => (
                <li
                  key={step.n}
                  className="grid grid-cols-1 gap-4 border-b border-border py-8 md:grid-cols-[220px_1fr] md:gap-12 md:py-10"
                >
                  <div className="flex flex-row items-baseline gap-4 md:flex-col md:items-start md:gap-3">
                    <span className="text-lit text-5xl font-bold leading-none tracking-[-0.05em] md:text-[72px]">
                      {step.n}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand">
                      {t(`method.steps.${step.key}.label`)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <h3 className="m-0 max-w-[560px] text-[22px] font-bold leading-[1.05] tracking-[-0.03em] text-foreground md:text-[30px]">
                      {t(`method.steps.${step.key}.title`)}
                    </h3>
                    <p className={`${PROSE} max-w-[560px]`}>
                      {t(`method.steps.${step.key}.desc`)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <AboutBookingCta
              page={page}
              location="cta_healthcare_ai_method"
              namespace="healthcareAi"
            />
          </div>
        </section>

        <div data-surface="paper">
          {/* 7 — FAQ, mirrored word for word in the FAQPage JSON-LD above. */}
          <section className={BAND}>
            <h2 className={H2}>{t("faq.title")}</h2>

            <div className="mt-12 border-t border-border md:mt-16">
              {HEALTHCARE_FAQ_KEYS.map((key) => (
                <article
                  key={key}
                  className="grid grid-cols-1 gap-3 border-b border-border py-8 md:grid-cols-[minmax(0,420px)_1fr] md:gap-12 md:py-10"
                >
                  <h3 className="m-0 text-[20px] font-bold leading-[1.15] tracking-[-0.03em] text-foreground md:text-[24px]">
                    {t(`faq.items.${key}.q`)}
                  </h3>
                  <p className={`${PROSE} max-w-[70ch]`}>{t.rich(`faq.items.${key}.a`, faqLinks)}</p>
                </article>
              ))}
            </div>
          </section>

          {/* 8 — Further reading and the sibling pages. */}
          <section className={`${BAND} border-t border-border`}>
            <h2 className={H2}>{t("further.title")}</h2>
            <div className="mt-12 grid grid-cols-1 gap-12 md:mt-16 md:grid-cols-2 md:gap-16">
              <div>
                <span className={MONO}>{t("further.readingLabel")}</span>
                <ul className="m-0 mt-4 list-none border-t border-border p-0">
                  {(
                    [
                      { key: "hds", href: hdsArticle },
                      { key: "monka", href: monkaPath },
                    ] as const
                  ).map((item) => (
                    <li key={item.key} className="border-b border-border">
                      <Link
                        href={item.href}
                        className="group flex items-baseline justify-between gap-4 py-5 text-[16px] leading-[1.45] text-foreground md:text-[17px]"
                      >
                        <span className="underline decoration-transparent decoration-1 underline-offset-4 transition-colors group-hover:decoration-foreground">
                          {t(`further.reading.${item.key}`)}
                        </span>
                        <span aria-hidden="true" className="shrink-0 text-brand">
                          →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <span className={MONO}>{t("further.alsoLabel")}</span>
                <div className="mt-4 grid grid-cols-1 gap-4">
                  {(
                    [
                      { key: "agency", href: splitPath(AGENCY_PARIS_PATHS, locale) },
                      { key: "about", href: splitPath(ABOUT_PATHS, locale) },
                      { key: "hardening", href: splitPath(HARDENING_PATHS, locale) },
                    ] as const
                  ).map((item) => (
                    <Link
                      key={item.key}
                      href={item.href}
                      className="group block border border-border bg-card p-6 transition-colors duration-300 hover:border-border-strong md:p-7"
                    >
                      <span className="flex items-baseline justify-between gap-4 text-[22px] font-bold leading-[1.1] tracking-[-0.03em] text-foreground">
                        {t(`further.${item.key}.title`)}
                        <span aria-hidden="true" className="text-lg text-brand">
                          →
                        </span>
                      </span>
                      <span className={`${PROSE} mt-2 block`}>
                        {t(`further.${item.key}.desc`)}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* The French page closes on its own line; the English one keeps the
            site-wide closing. */}
        <FinalCTA namespace={locale === "fr" ? "healthcareAi.finalCta" : undefined} />
      </main>
      <Footer />
    </div>
  );
}

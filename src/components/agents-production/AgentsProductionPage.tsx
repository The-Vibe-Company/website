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
import type { Locale } from "@/i18n/routing";
import {
  AGENTS_GUIDE_PATHS,
  AGENTS_PRODUCTION_CASE_SLUGS,
  AGENTS_PRODUCTION_FAQ_KEYS,
  AGENTS_PRODUCTION_HERO_KEYS,
  AGENTS_PRODUCTION_METHOD_STEPS,
  AGENTS_PRODUCTION_NOT_KEYS,
  AGENTS_PRODUCTION_OFFER_KEYS,
  AUTOMATION_GUIDE_PATHS,
  plainText,
  POC_CHECKLIST_PATHS,
  RAG_GUIDE_PATHS,
} from "@/lib/agents-production";
import { getCustomer, type ContentLocale } from "@/lib/customers";
import { AGENT_AUTHORITY_PATH, HDS_GUIDE_PATHS, localizedArticle } from "@/lib/hardening";
import {
  AGENCY_PARIS_PATHS,
  AGENTS_PRODUCTION_PATHS,
  HARDENING_PATHS,
  HEALTHCARE_AI_PATHS,
  MEDIA_AI_PATHS,
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
import { BrandSquare } from "@/components/BrandSquare";
import { keepPunctuationAttached } from "@/lib/french-spacing";

/**
 * The service landing on taking a company's AI agents from POC to production,
 * served at /fr/agents-ia-production and /en/ai-agents-in-production. Both
 * routes render this component; each declares the other through hreflang.
 *
 * Dressed like the homepage landing and the About page, like the hardening
 * and Paris landings: the hero on the ink in its orange bloom, warm paper for
 * the problem and the offer (each part under its lamp), the method as an ink
 * band in the orange light, paper again for proof, limits, FAQ and further
 * reading, and the FinalCTA.
 */

export async function agentsProductionMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "agentsProduction" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  const path = splitPath(AGENTS_PRODUCTION_PATHS, locale);

  return {
    // Absolute, not the layout template: the brand is already in the title.
    title: { absolute: title },
    description,
    alternates: splitPathAlternates(locale, AGENTS_PRODUCTION_PATHS),
    ...localizedSocialMetadata({ locale, path, title, description }),
  };
}

/** PostHog `page` property of the booking CTAs: the landing's own URL segment. */
export function agentsProductionPageId(locale: string): string {
  return splitPath(AGENTS_PRODUCTION_PATHS, locale).slice(1);
}

const SECTION = "mx-auto max-w-[90rem] px-6 md:px-10 lg:px-16";
const BAND = `${SECTION} py-20 md:py-28 lg:py-32`;
const H2 =
  "m-0 font-bold text-foreground text-[clamp(2.5rem,5.6vw,5.25rem)] leading-[0.92] tracking-[-0.045em]";
/** A heading that shares its row with the text, sized like the homepage's
    products heading so it holds in half the width. */
const H2_SPLIT =
  "m-0 max-w-[16ch] font-bold text-foreground text-[clamp(2.25rem,4.4vw,4rem)] leading-[0.95] tracking-[-0.04em]";
const MONO =
  "font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground";
const PROSE = "m-0 text-[15px] leading-[1.6] text-muted-foreground md:text-base";
const PROSE_INK = "m-0 text-[15px] leading-[1.6] text-foreground md:text-base";
const TEXT_LINK =
  "text-foreground underline decoration-1 underline-offset-4 transition-colors hover:text-brand";
const MONO_LINK =
  "inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground underline decoration-1 underline-offset-4 transition-colors hover:text-brand";
/** The short orange bar a lamp card hangs from, with its glow. */
const LAMP =
  "absolute left-1/2 top-0 h-1.5 w-16 -translate-x-1/2 bg-brand shadow-[0_0_40px_12px_rgba(242,115,19,0.45)]";
/** The hero's orange bloom, as on the About page. */
const HERO_BLOOM =
  "radial-gradient(closest-side, rgb(242 115 19 / 0.2), rgb(242 115 19 / 0.06) 55%, transparent)";
/** The light an ink band sits in, as on the homepage's client quote. */
const INK_GLOW =
  "radial-gradient(55% 70% at 12% 100%, rgb(242 115 19 / 0.18), rgb(242 115 19 / 0.05) 55%, transparent 80%)";

type PageLink = { label: string; href: string; locale: Locale };

export async function AgentsProductionPage({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "agentsProduction" });
  const tAbout = await getTranslations({ locale, namespace: "about" });
  const tFooter = await getTranslations({ locale, namespace: "footer" });
  const contentLocale: ContentLocale = locale === "en" ? "en" : "fr";
  const pageLocale = contentLocale as Locale;
  const pageUrl = localizedUrl(locale, splitPath(AGENTS_PRODUCTION_PATHS, locale));
  const page = agentsProductionPageId(locale);

  const guide = localizedArticle(AGENTS_GUIDE_PATHS, locale);
  const checklist = localizedArticle(POC_CHECKLIST_PATHS, locale);
  const automation = localizedArticle(AUTOMATION_GUIDE_PATHS, locale);
  const rag = localizedArticle(RAG_GUIDE_PATHS, locale);
  const hdsGuide = localizedArticle(HDS_GUIDE_PATHS, locale);
  const hardening = splitPath(HARDENING_PATHS, locale);

  const breadcrumb = breadcrumbList([
    { name: tFooter("home"), url: localizedUrl(locale) },
    { name: t("breadcrumb"), url: pageUrl },
  ]);
  const webPage = webPageNode({
    url: pageUrl,
    name: t("title"),
    description: t("metaDescription"),
    language: locale,
  });
  const service = serviceNode({
    url: pageUrl,
    name: t("service.name"),
    serviceType: "Enterprise AI agent deployment and production operations",
    description: t("service.description"),
  });
  // FAQPage carries the visible answer as plain text, with its inline link
  // tags stripped. An answer that names a client is left out by
  // `faqPageSchema` (see `isPublishable`).
  const faq = faqPageSchema(
    AGENTS_PRODUCTION_FAQ_KEYS.map((key) => ({
      question: t(`faq.items.${key}.q`),
      answer: plainText(t.raw(`faq.items.${key}.a`) as string),
    })),
  );

  const cases = AGENTS_PRODUCTION_CASE_SLUGS.map((slug) => getCustomer(slug, contentLocale)).filter(
    (customer) => customer !== undefined,
  );
  const [featured, ...others] = cases;

  // Links inside the FAQ answers (the French copy) and under them (the
  // English copy, which keeps a `faq.links` block). Each language only
  // renders the variant its messages define.
  const inlineLink = (href: string) => {
    const InlineLink = (chunks: ReactNode) => (
      <Link href={href} className={TEXT_LINK}>
        {chunks}
      </Link>
    );
    return InlineLink;
  };
  const faqTags = {
    automation: inlineLink(automation),
    health: inlineLink(splitPath(HEALTHCARE_AI_PATHS, locale)),
    hds: inlineLink(hdsGuide),
    guide: inlineLink(guide),
    hardening: inlineLink(hardening),
  };
  const faqLinks: Partial<Record<(typeof AGENTS_PRODUCTION_FAQ_KEYS)[number], PageLink[]>> =
    t.has("faq.links")
      ? {
          start: [{ label: t("faq.links.automation"), href: automation, locale: pageLocale }],
          timeline: [
            { label: t("faq.links.locservice"), href: "/case-studies/locservice", locale: pageLocale },
          ],
          data: [
            { label: t("faq.links.health"), href: splitPath(HEALTHCARE_AI_PATHS, locale), locale: pageLocale },
            { label: t("faq.links.hds"), href: hdsGuide, locale: pageLocale },
          ],
          article: [{ label: t("faq.links.guide"), href: guide, locale: pageLocale }],
          hardening: [{ label: t("faq.links.hardening"), href: hardening, locale: pageLocale }],
        }
      : {};

  // Card links, only where the language's copy defines a label. The authority
  // article exists in French only, so it is always linked there.
  const offerLinks: Partial<Record<(typeof AGENTS_PRODUCTION_OFFER_KEYS)[number], PageLink>> = {
    ...(t.has("offer.items.scope.link")
      ? { scope: { label: t("offer.items.scope.link"), href: automation, locale: pageLocale } }
      : {}),
    ...(t.has("offer.items.authority.link")
      ? {
          authority: {
            label: t("offer.items.authority.link"),
            href: AGENT_AUTHORITY_PATH,
            locale: "fr",
          },
        }
      : {}),
  };

  const reading: { key: string; href: string; locale: Locale }[] = [
    { key: "guide", href: guide, locale: pageLocale },
    { key: "checklist", href: checklist, locale: pageLocale },
    { key: "automation", href: automation, locale: pageLocale },
    { key: "authority", href: AGENT_AUTHORITY_PATH, locale: "fr" },
    { key: "hds", href: hdsGuide, locale: pageLocale },
    { key: "rag", href: rag, locale: pageLocale },
  ];
  const siblings = [
    { key: "hardening", href: hardening },
    { key: "agency", href: splitPath(AGENCY_PARIS_PATHS, locale) },
    { key: "health", href: splitPath(HEALTHCARE_AI_PATHS, locale) },
    { key: "media", href: splitPath(MEDIA_AI_PATHS, locale) },
  ] as const;

  return (
    <div
      data-variant="hybrid"
      className="flex min-h-screen flex-col bg-background text-foreground"
    >
      <JsonLd data={webPage} />
      <JsonLd data={breadcrumb} />
      <JsonLd data={service} />
      <JsonLd data={faq} />
      <TopNav />
      <main id="main-content" tabIndex={-1} className="flex-1">
        {/* 1 — On the ink, in the hero's orange light: the one H1, the
            promise, and the call. */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-72 -right-48 h-[900px] w-[1100px]"
            style={{ background: HERO_BLOOM }}
          />
          <div className={`relative ${SECTION} pb-20 pt-12 md:pb-28 lg:pt-[80px]`}>
            <span className="block font-mono text-[12px] uppercase tracking-[0.2em] text-soft-foreground">
              <BrandSquare />
              {t("kicker")}
            </span>
            <h1 className="m-0 mt-8 max-w-[20ch] text-[clamp(2.5rem,6.4vw,6.75rem)] font-bold leading-[0.92] tracking-[-0.05em] text-foreground lg:mt-10">
              {keepPunctuationAttached(t("title"))}
            </h1>
            <p className="m-0 mt-10 max-w-[720px] border-l border-border-strong pl-5 text-lg leading-[1.5] text-foreground md:pl-6 md:text-[19px]">
              {t("lede")}
            </p>

            <span className={`mt-12 block ${MONO}`}>{t("hero.label")}</span>
            <ul className="m-0 mt-4 grid max-w-[1100px] list-none grid-cols-1 gap-x-10 border-t border-border p-0 md:grid-cols-2">
              {AGENTS_PRODUCTION_HERO_KEYS.map((key) => (
                <li
                  key={key}
                  className="flex gap-4 border-b border-border py-4 text-[15px] leading-[1.5] text-foreground md:text-base"
                >
                  <span
                    aria-hidden="true"
                    className="mt-[0.6em] h-1.5 w-1.5 shrink-0 bg-brand"
                  />
                  {t(`hero.items.${key}`)}
                </li>
              ))}
            </ul>

            <AboutBookingCta
              page={page}
              location="cta_agents_production_hero"
              namespace="agentsProduction"
            />
            <AboutBackers label={tAbout("backedBy")} />
          </div>
        </section>

        <div data-surface="paper">
          {/* 2 — Why pilots stall: production, not the model. */}
          <section className={BAND}>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-16">
              <h2 className={H2_SPLIT}>{t("problem.title")}</h2>
              <div className="flex max-w-[68ch] flex-col gap-5 md:pt-3">
                <p className={PROSE}>{t("problem.p1")}</p>
                <p className={PROSE_INK}>{t("problem.p2")}</p>
                <p className={PROSE}>
                  {t.rich("problem.p3", {
                    link: (chunks: ReactNode) => (
                      <Link href={guide} className={TEXT_LINK}>
                        {chunks}
                      </Link>
                    ),
                  })}
                </p>
              </div>
            </div>
          </section>

          {/* 3 — The offer: what a deployment includes, each part under its
              lamp. */}
          <section className={`${BAND} border-t border-border`}>
            <h2 className={`${H2} max-w-[20ch]`}>{t("offer.title")}</h2>
            <p className={`${PROSE} mt-6 max-w-[680px]`}>{t("offer.intro")}</p>

            <div className="mt-12 grid grid-cols-1 gap-4 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
              {AGENTS_PRODUCTION_OFFER_KEYS.map((key, i) => {
                const link = offerLinks[key];
                return (
                  <article
                    key={key}
                    className="lamp-card flex flex-col overflow-hidden border border-border p-7 md:p-9"
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
                    <h3 className="relative m-0 mb-4 text-[clamp(1.5rem,2vw,1.9rem)] font-bold leading-[1.05] tracking-[-0.03em] text-foreground">
                      {t(`offer.items.${key}.title`)}
                    </h3>
                    <p className={`relative ${PROSE} text-soft-foreground`}>
                      {t(`offer.items.${key}.desc`)}
                    </p>
                    {link ? (
                      <Link
                        href={link.href}
                        locale={link.locale}
                        className={`relative ${MONO_LINK} mt-6 self-start`}
                      >
                        {link.label}
                        <span aria-hidden="true">→</span>
                      </Link>
                    ) : null}
                  </article>
                );
              })}
            </div>

            <p className="m-0 mt-12 max-w-[760px] border-l-2 border-brand pl-5 text-[15px] leading-[1.6] text-foreground md:pl-6 md:text-base">
              {t.rich("offer.complement", {
                hardening: (chunks: ReactNode) => (
                  <Link href={hardening} className={TEXT_LINK}>
                    {chunks}
                  </Link>
                ),
                authority: (chunks: ReactNode) => (
                  <Link href={AGENT_AUTHORITY_PATH} locale="fr" className={TEXT_LINK}>
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          </section>
        </div>

        {/* 4 — From POC to production: an ink band in the orange light,
            like the homepage's client quote, with the mid-page call. */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ background: INK_GLOW }}
          />
          <div className={`relative ${BAND}`}>
            <h2 className={H2}>{t("method.title")}</h2>
            {t.has("method.intro") ? (
              <p className={`${PROSE} mt-6 max-w-[680px]`}>{t("method.intro")}</p>
            ) : null}

            <span className={`mt-14 block border-b border-border pb-4 md:mt-16 ${MONO}`}>
              {t("method.stepsLabel")}
            </span>
            <ol className="m-0 flex list-none flex-col p-0">
              {AGENTS_PRODUCTION_METHOD_STEPS.map((step) => (
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

            <div className="mt-12 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-[220px_1fr] md:gap-12">
              <span aria-hidden="true" className="hidden md:block" />
              <div>
                {t.has("method.ctaTitle") ? (
                  <p className="m-0 max-w-[620px] text-lg leading-[1.45] text-foreground md:text-[21px]">
                    {t("method.ctaTitle")}
                  </p>
                ) : null}
                <AboutBookingCta
                  page={page}
                  location="cta_agents_production_method"
                  namespace="agentsProduction"
                />
                <Link href={checklist} className={`mt-8 ${MONO_LINK}`}>
                  {t("method.checklist")}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div data-surface="paper">
          {/* 5 — Proof: agents already running, published cases only, each
              under its lamp with its figure lit. */}
          <section className={BAND}>
            <h2 className={H2}>{t("proof.title")}</h2>
            {t.has("proof.intro") ? (
              <p className={`${PROSE} mt-6 max-w-[680px]`}>{t("proof.intro")}</p>
            ) : null}

            {featured ? (
              <article className="lamp-card mt-12 grid grid-cols-1 overflow-hidden border border-border md:mt-16 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
                <span aria-hidden="true" className={LAMP} />
                {/* One bench under one lamp: no rule between the halves on
                    a wide screen, so the light falls on the whole card. */}
                <div className="relative flex flex-col justify-between gap-6 border-b border-border p-7 md:border-b-0 md:p-10 md:pr-6">
                  <span className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-muted-foreground">
                    {featured.sector}
                  </span>
                  <div>
                    <span className="text-lit block pb-2 text-[clamp(4.5rem,11vw,10rem)] font-bold leading-none tracking-[-0.06em]">
                      {featured.metric}
                    </span>
                    <span className="mt-3 block max-w-[30ch] text-[15px] leading-[1.45] text-foreground md:text-base">
                      {featured.metricLabel}
                    </span>
                  </div>
                </div>
                <div className="relative flex flex-col p-7 md:p-10 md:pl-6">
                  <h3 className="m-0 text-[clamp(1.9rem,3vw,2.6rem)] font-bold leading-[1.05] tracking-[-0.035em] text-foreground">
                    {featured.client}
                  </h3>
                  <p className={`${PROSE_INK} mt-4 max-w-[60ch] flex-1`}>
                    {t(`proof.cases.${featured.slug}`)}
                  </p>
                  <Link
                    href={`/case-studies/${featured.slug}`}
                    className={`${MONO_LINK} mt-8 self-start`}
                  >
                    {t("proof.readCase", { client: featured.client })}
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ) : null}

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              {others.map((customer) => (
                <article
                  key={customer.slug}
                  className="lamp-card flex flex-col overflow-hidden border border-border p-7 md:p-9"
                >
                  <span aria-hidden="true" className={LAMP} />
                  <span className="relative font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-muted-foreground">
                    {customer.sector}
                  </span>
                  <h3 className="relative m-0 mt-4 text-[clamp(1.75rem,2.6vw,2.25rem)] font-bold leading-[1.05] tracking-[-0.035em] text-foreground">
                    {customer.client}
                  </h3>
                  <p className={`relative ${PROSE} mt-4 flex-1 text-soft-foreground`}>
                    {t(`proof.cases.${customer.slug}`)}
                  </p>
                  <Link
                    href={`/case-studies/${customer.slug}`}
                    className={`relative ${MONO_LINK} mt-6 self-start`}
                  >
                    {t("proof.readCase", { client: customer.client })}
                    <span aria-hidden="true">→</span>
                  </Link>
                </article>
              ))}
            </div>
          </section>

          {/* 6 — What this is not, to set expectations. */}
          <section className={`${BAND} border-t border-border`}>
            <h2 className={H2}>{t("not.title")}</h2>
            <div className="mt-12 grid grid-cols-1 border-l border-t border-border md:mt-16 md:grid-cols-2 lg:grid-cols-4">
              {AGENTS_PRODUCTION_NOT_KEYS.map((key, i) => (
                <article
                  key={key}
                  className="flex flex-col border-b border-r border-border bg-card p-7 md:p-8"
                >
                  <span className="text-lit text-[40px] font-bold leading-none tracking-[-0.05em]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="m-0 mt-6 text-[20px] font-bold leading-[1.15] tracking-[-0.03em] text-foreground md:text-[22px]">
                    {t.rich(`not.items.${key}.title`, { hardening: inlineLink(hardening) })}
                  </h3>
                  {t.has(`not.items.${key}.desc`) ? (
                    <p className={`${PROSE} mt-3`}>{t(`not.items.${key}.desc`)}</p>
                  ) : null}
                  {t.has(`not.items.${key}.link`) ? (
                    <Link href={hardening} className={`${MONO_LINK} mt-5 self-start`}>
                      {t("not.items.hardening.link")}
                      <span aria-hidden="true">→</span>
                    </Link>
                  ) : null}
                </article>
              ))}
            </div>
          </section>

          {/* 7 — FAQ, restated as plain text in the FAQPage JSON-LD above. */}
          <section className={`${BAND} border-t border-border`}>
            <h2 className={H2}>{t("faq.title")}</h2>

            <div className="mt-12 border-t border-border md:mt-16">
              {AGENTS_PRODUCTION_FAQ_KEYS.map((key) => (
                <article
                  key={key}
                  className="grid grid-cols-1 gap-3 border-b border-border py-8 md:grid-cols-[minmax(0,420px)_1fr] md:gap-12 md:py-10"
                >
                  <h3 className="m-0 text-[20px] font-bold leading-[1.15] tracking-[-0.03em] text-foreground md:text-[24px]">
                    {t(`faq.items.${key}.q`)}
                  </h3>
                  <div className="flex max-w-[70ch] flex-col gap-4">
                    <p className={PROSE}>{t.rich(`faq.items.${key}.a`, faqTags)}</p>
                    {faqLinks[key] ? (
                      <div className="flex flex-wrap gap-x-6 gap-y-3">
                        {faqLinks[key].map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            locale={link.locale}
                            className={MONO_LINK}
                          >
                            {link.label}
                            <span aria-hidden="true">→</span>
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* 8 — Further reading and the sibling landings. */}
          <section className={`${BAND} border-t border-border`}>
            <h2 className={H2}>{t("further.title")}</h2>
            <div className="mt-12 grid grid-cols-1 gap-12 md:mt-16 md:grid-cols-2 md:gap-16">
              <div>
                <span className={MONO}>{t("further.readingLabel")}</span>
                <ul className="m-0 mt-4 list-none border-t border-border p-0">
                  {reading.map((item) => (
                    <li key={item.key} className="border-b border-border">
                      <Link
                        href={item.href}
                        locale={item.locale}
                        className="group flex items-baseline justify-between gap-4 py-4 text-[15px] leading-[1.45] text-foreground md:text-base"
                      >
                        <span className="underline decoration-transparent decoration-1 underline-offset-4 transition-colors group-hover:decoration-foreground">
                          {t(`further.reading.${item.key}`)}
                        </span>
                        <span aria-hidden="true" className="shrink-0 transition-colors group-hover:text-brand">
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
                  {siblings.map((item) => (
                    <Link
                      key={item.key}
                      href={item.href}
                      className="group block border border-border bg-card p-6 transition-colors duration-300 hover:border-border-strong"
                    >
                      <span className="flex items-baseline justify-between gap-4 text-[22px] font-bold leading-[1.1] tracking-[-0.03em] text-foreground">
                        {t(`further.${item.key}.title`)}
                        <span aria-hidden="true" className="text-lg transition-colors group-hover:text-brand">
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

        {/* The French copy closes on its own question; English keeps the
            shared one. */}
        <FinalCTA
          namespace={t.has("finalCta") ? "agentsProduction.finalCta" : undefined}
        />
      </main>
      <Footer />
    </div>
  );
}

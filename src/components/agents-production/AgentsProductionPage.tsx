import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";

import { BrandSquare } from "@/components/BrandSquare";
import { ClientMark } from "@/components/ClientMark";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { ServiceHero } from "@/components/ServiceHero";
import { TopNav } from "@/components/TopNav";
import { AboutBookingCta } from "@/components/about/AboutBookingCta";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Clientele } from "@/components/home/landing/Clientele";
import { OfferFactsStrip, type OfferFactItem } from "@/components/offer/OfferFactsStrip";
import { OfferFaqSection } from "@/components/offer/OfferFaqSection";
import { OfferFurtherReading } from "@/components/offer/OfferFurtherReading";
import { OfferMethodBand } from "@/components/offer/OfferMethodBand";
import {
  OFFER_BAND,
  OFFER_H2,
  OFFER_H2_SPLIT,
  OFFER_INLINE_LINK,
  OFFER_MONO,
  OFFER_MONO_LINK,
  OFFER_PROSE,
  OFFER_PROSE_LEAD,
} from "@/components/offer/offer-styles";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import {
  AGENTS_GUIDE_PATHS,
  AGENTS_PRODUCTION_CASE_SLUGS,
  AGENTS_PRODUCTION_FAQ_KEYS,
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

/**
 * Service landing on taking enterprise AI agents from POC to daily production
 * (/fr/agents-ia-production, /en/ai-agents-in-production).
 */

export async function agentsProductionMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "agentsProduction" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  const path = splitPath(AGENTS_PRODUCTION_PATHS, locale);

  return {
    title: { absolute: title },
    description,
    alternates: splitPathAlternates(locale, AGENTS_PRODUCTION_PATHS),
    ...localizedSocialMetadata({ locale, path, title, description }),
  };
}

export function agentsProductionPageId(locale: string): string {
  return splitPath(AGENTS_PRODUCTION_PATHS, locale).slice(1);
}

type PageLink = { label: string; href: string; locale: Locale };

export async function AgentsProductionPage({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "agentsProduction" });
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

  const inlineLink = (href: string) => {
    const InlineLink = (chunks: ReactNode) => (
      <Link href={href} className={OFFER_INLINE_LINK}>
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

  const articles = [
    { key: "checklist", label: t("further.reading.checklist"), href: checklist, locale: pageLocale },
    { key: "guide", label: t("further.reading.guide"), href: guide, locale: pageLocale },
    { key: "automation", label: t("further.reading.automation"), href: automation, locale: pageLocale },
    { key: "authority", label: t("further.reading.authority"), href: AGENT_AUTHORITY_PATH, locale: "fr" as Locale },
    { key: "rag", label: t("further.reading.rag"), href: rag, locale: pageLocale },
    { key: "hds", label: t("further.reading.hds"), href: hdsGuide, locale: pageLocale },
  ];

  const siblingOffers = [
    {
      key: "hardening",
      title: t("further.hardening.title"),
      desc: t("further.hardening.desc"),
      href: hardening,
    },
    {
      key: "agency",
      title: t("further.agency.title"),
      desc: t("further.agency.desc"),
      href: splitPath(AGENCY_PARIS_PATHS, locale),
    },
    {
      key: "health",
      title: t("further.health.title"),
      desc: t("further.health.desc"),
      href: splitPath(HEALTHCARE_AI_PATHS, locale),
    },
    {
      key: "media",
      title: t("further.media.title"),
      desc: t("further.media.desc"),
      href: splitPath(MEDIA_AI_PATHS, locale),
    },
  ];

  const facts = t.raw("facts") as OfferFactItem[];

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
        <ServiceHero
          kicker={t("kicker")}
          title={t("title")}
          lede={t("lede")}
          cta={
            <AboutBookingCta
              page={page}
              location="cta_agents_production_hero"
              namespace="agentsProduction"
              lit
            />
          }
        />

        <div data-surface="paper">
          <Clientele />

          <OfferFactsStrip kicker={t("factsLabel")} items={facts} />

          {/* Why POCs stall: asymmetric split, no cards. */}
          <section className={OFFER_BAND}>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
              <div>
                <p className={`m-0 mb-5 inline-flex items-center ${OFFER_MONO}`}>
                  <BrandSquare />
                  {t("problem.kicker")}
                </p>
                <h2 className={OFFER_H2_SPLIT}>{t("problem.title")}</h2>
              </div>
              <div className="flex max-w-[66ch] flex-col gap-5 lg:pt-8">
                <p className={OFFER_PROSE_LEAD}>{t("problem.p1")}</p>
                <p className={OFFER_PROSE}>{t("problem.p2")}</p>
                <p className={OFFER_PROSE}>
                  {t.rich("problem.p3", {
                    link: (chunks: ReactNode) => (
                      <Link href={guide} className={OFFER_INLINE_LINK}>
                        {chunks}
                      </Link>
                    ),
                  })}
                </p>
              </div>
            </div>
          </section>

          {/* Proof early: agents already running in production, each under a warm lamp. */}
          <section className={`${OFFER_BAND} border-t border-border`}>
            <p className={`m-0 mb-5 inline-flex items-center ${OFFER_MONO}`}>
              <BrandSquare />
              {t("proof.kicker")}
            </p>
            <h2 className={`${OFFER_H2} max-w-[20ch]`}>{t("proof.title")}</h2>
            <p className={`${OFFER_PROSE_LEAD} mt-5 max-w-[60ch]`}>{t("proof.intro")}</p>

            {featured ? (
              <article className="lamp-card mt-12 grid grid-cols-1 overflow-hidden border border-border md:mt-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
                <div className="relative flex flex-col justify-between gap-8 border-b border-border p-7 md:p-10 lg:border-b-0 lg:border-r">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <ClientMark
                      logo={featured.logo}
                      client={featured.client}
                      className="h-8 w-auto max-w-[160px] object-contain object-left"
                      textClassName="text-[24px]"
                    />
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                      {featured.sector}
                    </span>
                  </div>
                  <div>
                    <span className="text-foreground block pb-2 text-[clamp(4rem,9vw,7.5rem)] font-bold leading-none tracking-[-0.06em]">
                      {featured.metric}
                    </span>
                    <span className="mt-2 block max-w-[32ch] text-[15px] leading-[1.5] text-soft-foreground">
                      {featured.metricLabel}
                    </span>
                  </div>
                </div>
                <div className="relative flex flex-col p-7 md:p-10">
                  <h3 className="m-0 text-[clamp(1.75rem,2.8vw,2.4rem)] font-bold leading-[1.05] tracking-[-0.035em] text-foreground">
                    {featured.client}
                  </h3>
                  <p className={`${OFFER_PROSE_LEAD} mt-5 max-w-[58ch] flex-1`}>
                    {t(`proof.cases.${featured.slug}`)}
                  </p>
                  <Link
                    href={`/case-studies/${featured.slug}`}
                    className={`${OFFER_MONO_LINK} mt-8 self-start`}
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
                  <div className="relative flex flex-wrap items-start justify-between gap-4">
                    <ClientMark
                      logo={customer.logo}
                      client={customer.client}
                      className="h-7 w-auto max-w-[160px] object-contain object-left"
                      textClassName="text-[22px]"
                    />
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                      {customer.sector}
                    </span>
                  </div>
                  <h3 className="relative m-0 mt-7 text-[clamp(1.6rem,2.4vw,2.1rem)] font-bold leading-[1.08] tracking-[-0.035em] text-foreground">
                    {customer.metric ?? customer.client}
                  </h3>
                  <p className={`relative ${OFFER_PROSE} mt-4 flex-1 text-soft-foreground`}>
                    {t(`proof.cases.${customer.slug}`)}
                  </p>
                  <Link
                    href={`/case-studies/${customer.slug}`}
                    className={`relative ${OFFER_MONO_LINK} mt-6 self-start`}
                  >
                    {t("proof.readCase", { client: customer.client })}
                    <span aria-hidden="true">→</span>
                  </Link>
                </article>
              ))}
            </div>
          </section>

          {/* The 6 production pillars as an architectural 2-column ruled index (not a card wall). */}
          <section className={`${OFFER_BAND} border-t border-border`}>
            <p className={`m-0 mb-5 inline-flex items-center ${OFFER_MONO}`}>
              <BrandSquare />
              {t("offer.kicker")}
            </p>
            <h2 className={`${OFFER_H2} max-w-[20ch]`}>{t("offer.title")}</h2>
            <p className={`${OFFER_PROSE_LEAD} mt-5 max-w-[62ch]`}>{t("offer.intro")}</p>

            <ol className="m-0 mt-12 grid list-none grid-cols-1 gap-x-12 p-0 md:mt-16 md:grid-cols-2 lg:gap-x-16">
              {AGENTS_PRODUCTION_OFFER_KEYS.map((key, i) => {
                const link = offerLinks[key];
                return (
                  <li
                    key={key}
                    className="flex flex-col border-t border-border py-8 md:py-9"
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="font-mono text-[13px] font-medium tracking-[0.18em] text-brand">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        {t(`offer.items.${key}.tag`)}
                      </span>
                    </div>
                    <h3 className="m-0 mt-4 text-[22px] font-bold leading-[1.1] tracking-[-0.03em] text-foreground md:text-[26px]">
                      {t(`offer.items.${key}.title`)}
                    </h3>
                    <p className={`${OFFER_PROSE} mt-3 max-w-[54ch] text-soft-foreground`}>
                      {t(`offer.items.${key}.desc`)}
                    </p>
                    {link ? (
                      <Link
                        href={link.href}
                        locale={link.locale}
                        className={`${OFFER_MONO_LINK} mt-5 self-start`}
                      >
                        {link.label}
                        <span aria-hidden="true">→</span>
                      </Link>
                    ) : null}
                  </li>
                );
              })}
            </ol>

            <p className="m-0 mt-8 max-w-[760px] border-l-2 border-brand pl-5 text-[15px] leading-[1.6] text-foreground md:pl-6 md:text-base">
              {t.rich("offer.complement", {
                hardening: (chunks: ReactNode) => (
                  <Link href={hardening} className={OFFER_INLINE_LINK}>
                    {chunks}
                  </Link>
                ),
                authority: (chunks: ReactNode) => (
                  <Link href={AGENT_AUTHORITY_PATH} locale="fr" className={OFFER_INLINE_LINK}>
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          </section>
        </div>

        {/* 6 steps from POC to daily run on ink. */}
        <OfferMethodBand
          kicker={t("method.stepsLabel")}
          title={t("method.title")}
          intro={t.has("method.intro") ? t("method.intro") : undefined}
          steps={AGENTS_PRODUCTION_METHOD_STEPS.map((step) => ({
            n: step.n,
            label: t(`method.steps.${step.key}.label`),
            title: t(`method.steps.${step.key}.title`),
            desc: t(`method.steps.${step.key}.desc`),
          }))}
          footer={
            <div>
              {t.has("method.ctaTitle") ? (
                <p className="m-0 max-w-[54ch] text-[18px] leading-[1.45] text-foreground md:text-[21px]">
                  {t("method.ctaTitle")}
                </p>
              ) : null}
              <AboutBookingCta
                page={page}
                location="cta_agents_production_method"
                namespace="agentsProduction"
                lit
              />
              <Link href={checklist} className={`mt-8 ${OFFER_MONO_LINK}`}>
                {t("method.checklist")}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          }
        />

        <div data-surface="paper">
          {/* Explicit scope boundaries: clean 4-column hairline ledger. */}
          <section className={OFFER_BAND}>
            <p className={`m-0 mb-5 inline-flex items-center ${OFFER_MONO}`}>
              <BrandSquare />
              {t("not.kicker")}
            </p>
            <h2 className={OFFER_H2}>{t("not.title")}</h2>
            <div className="mt-12 grid grid-cols-1 border-t border-border md:mt-16 md:grid-cols-2 lg:grid-cols-4">
              {AGENTS_PRODUCTION_NOT_KEYS.map((key, i) => (
                <article
                  key={key}
                  className={`flex flex-col border-b border-border py-7 md:py-8 ${
                    i > 0 ? "lg:border-l lg:pl-7" : ""
                  } ${i < AGENTS_PRODUCTION_NOT_KEYS.length - 1 ? "lg:pr-7" : ""}`}
                >
                  <span className="font-mono text-[12px] tracking-[0.18em] text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="m-0 mt-4 text-[19px] font-bold leading-[1.2] tracking-[-0.025em] text-foreground md:text-[21px]">
                    {t.rich(`not.items.${key}.title`, { hardening: inlineLink(hardening) })}
                  </h3>
                  <p className={`${OFFER_PROSE} mt-3`}>{t(`not.items.${key}.desc`)}</p>
                  {t.has(`not.items.${key}.link`) ? (
                    <Link href={hardening} className={`${OFFER_MONO_LINK} mt-5 self-start`}>
                      {t(`not.items.${key}.link`)}
                      <span aria-hidden="true">→</span>
                    </Link>
                  ) : null}
                </article>
              ))}
            </div>
          </section>

          <OfferFaqSection
            kicker={t("faq.kicker")}
            title={t("faq.title")}
            items={AGENTS_PRODUCTION_FAQ_KEYS.map((key) => ({
              key,
              question: t(`faq.items.${key}.q`),
              answer: t.rich(`faq.items.${key}.a`, faqTags),
            }))}
          />

          <OfferFurtherReading
            kicker={t("further.kicker")}
            title={t("further.title")}
            articlesLabel={t("further.readingLabel")}
            articles={articles}
            offersLabel={t("further.alsoLabel")}
            offers={siblingOffers}
          />
        </div>

        <FinalCTA namespace={t.has("finalCta") ? "agentsProduction.finalCta" : undefined} />
      </main>
      <Footer />
    </div>
  );
}

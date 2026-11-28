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
  OFFER_LIST_RULE,
  OFFER_MONO,
  OFFER_MONO_LINK,
  OFFER_PROSE,
  OFFER_PROSE_LEAD,
} from "@/components/offer/offer-styles";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getCustomer, type ContentLocale } from "@/lib/customers";
import {
  MEDIA_AUDIENCE_KEYS,
  MEDIA_CASE_SLUG,
  MEDIA_FAQ_KEYS,
  MEDIA_METHOD_STEPS,
  MEDIA_OFFER_KEYS,
  MEDIA_PROOF_KEYS,
  MEDIA_STAT_KEYS,
  mediaFundingArticle,
  mediaNewsroomsArticle,
  mediaPageId,
  mediaRagArticle,
} from "@/lib/media-ai";
import {
  ABOUT_PATHS,
  AGENCY_PARIS_PATHS,
  AGENTS_PRODUCTION_PATHS,
  CUSTOM_AI_APP_PATHS,
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
 * Media AI offer landing (/fr/ia-medias, /en/ai-for-media).
 *
 * Leads with the AFP / MediaGen proof right after the facts strip so newsroom
 * leaders immediately see real journalistic proof and honest consortium scope,
 * followed by audience fit, a balanced 2+3 deliverables grid, 4-step method on
 * ink, 6-question FAQ, further reading and the closing scene.
 */

export async function mediaAiMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "mediaAi" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  const path = splitPath(MEDIA_AI_PATHS, locale);

  return {
    title: { absolute: title },
    description,
    alternates: splitPathAlternates(locale, MEDIA_AI_PATHS),
    ...localizedSocialMetadata({ locale, path, title, description }),
  };
}

const FAQ_PLAIN_TAGS = {
  case: (chunks: string) => chunks,
  funding: (chunks: string) => chunks,
  agency: (chunks: string) => chunks,
  agents: (chunks: string) => chunks,
};

export async function MediaAiPage({ locale }: { locale: string }) {
  const contentLocale: ContentLocale = locale === "en" ? "en" : "fr";
  const pageLocale = contentLocale as Locale;
  const t = await getTranslations({ locale, namespace: "mediaAi" });
  const tFooter = await getTranslations({ locale, namespace: "footer" });

  const pageUrl = localizedUrl(locale, splitPath(MEDIA_AI_PATHS, locale));
  const page = mediaPageId(locale);
  const fundingArticle = mediaFundingArticle(locale);
  const newsroomsArticle = mediaNewsroomsArticle(locale);
  const ragArticle = mediaRagArticle(locale);
  const afp = getCustomer(MEDIA_CASE_SLUG, contentLocale);
  const afpPath = `/case-studies/${MEDIA_CASE_SLUG}`;

  const link = (href: string) =>
    function InlineLink(chunks: ReactNode) {
      return (
        <Link href={href} className={OFFER_INLINE_LINK}>
          {chunks}
        </Link>
      );
    };
  const faqLinks = {
    case: link(afpPath),
    funding: link(fundingArticle),
    agency: link(splitPath(AGENCY_PARIS_PATHS, locale)),
    agents: link(splitPath(AGENTS_PRODUCTION_PATHS, locale)),
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
      MEDIA_FAQ_KEYS.map((key) => ({
        question: t(`faq.items.${key}.q`),
        answer: t.markup(`faq.items.${key}.a`, FAQ_PLAIN_TAGS),
      })),
    ),
    serviceNode({
      url: pageUrl,
      name: t("service.name"),
      serviceType: "AI product development for media and newsrooms",
      description: t("service.description"),
    }),
  ];

  const facts = t.raw("facts") as OfferFactItem[];
  const [firstTwoOffers, lastThreeOffers] = [
    MEDIA_OFFER_KEYS.slice(0, 2),
    MEDIA_OFFER_KEYS.slice(2),
  ];

  const articles = [
    { key: "newsrooms", label: t("further.reading.newsrooms"), href: newsroomsArticle, locale: pageLocale },
    { key: "funding", label: t("further.reading.funding"), href: fundingArticle, locale: pageLocale },
    { key: "rag", label: t("further.reading.rag"), href: ragArticle, locale: pageLocale },
  ];

  const siblingOffers = [
    {
      key: "agency",
      title: t("further.agency.title"),
      desc: t("further.agency.desc"),
      href: splitPath(AGENCY_PARIS_PATHS, locale),
    },
    {
      key: "agents",
      title: t("further.agents.title"),
      desc: t("further.agents.desc"),
      href: splitPath(AGENTS_PRODUCTION_PATHS, locale),
    },
    {
      key: "custom",
      title: t("further.custom.title"),
      desc: t("further.custom.desc"),
      href: splitPath(CUSTOM_AI_APP_PATHS, locale),
    },
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
        <ServiceHero
          kicker={t("kicker")}
          display={t("displayTitle")}
          title={t("title")}
          lede={t("lede")}
          cta={<AboutBookingCta page={page} location="cta_media_ai_hero" namespace="mediaAi" lit />}
        />

        <div data-surface="paper">
          <Clientele exclude={["Softway Medical"]} />

          <OfferFactsStrip kicker={t("factsLabel")} items={facts} />

          {/* Proof first: AFP / MediaGen wide lamp bench + honest consortium boundaries. */}
          <section className={OFFER_BAND}>
            <p className={`m-0 mb-5 inline-flex items-center ${OFFER_MONO}`}>
              <BrandSquare />
              {t("afp.kicker")}
            </p>
            <h2 className={`${OFFER_H2} max-w-[20ch]`}>{t("afp.title")}</h2>
            <p className={`${OFFER_PROSE_LEAD} mt-5 max-w-[66ch]`}>{t("afp.intro")}</p>

            <article className="lamp-card mt-12 grid grid-cols-1 overflow-hidden border border-border md:mt-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
              <div className="relative flex flex-col border-b border-border p-7 md:p-10 lg:border-b-0 lg:border-r">
                {afp ? (
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <h3 className="m-0">
                      <ClientMark
                        logo={afp.logo}
                        client={afp.client}
                        className="h-8 w-auto max-w-[160px] object-contain object-left md:h-9"
                        textClassName="text-[24px]"
                      />
                    </h3>
                    <span className="text-right font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-muted-foreground">
                      {afp.sector}
                    </span>
                  </div>
                ) : null}

                <dl className="m-0 mt-10 border-t border-border">
                  {MEDIA_STAT_KEYS.map((key) => (
                    <div
                      key={key}
                      className="grid grid-cols-[minmax(0,130px)_minmax(0,1fr)] items-baseline gap-4 border-b border-border py-4"
                    >
                      <dt className={OFFER_MONO}>{t(`afp.stats.${key}.label`)}</dt>
                      <dd className="m-0 text-[24px] font-bold leading-[1.1] tracking-[-0.04em] text-foreground md:text-[30px]">
                        {t(`afp.stats.${key}.value`)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="relative flex flex-col p-7 md:p-10">
                <ul className="m-0 flex list-none flex-col p-0">
                  {(t.raw("afp.points") as string[]).map((point) => (
                    <li
                      key={point}
                      className="flex gap-3 py-3 text-[15px] leading-[1.55] text-foreground md:text-base"
                    >
                      <span aria-hidden="true" className="font-mono text-brand">
                        →
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <Link href={afpPath} className={`${OFFER_MONO_LINK} mt-auto self-start pt-6`}>
                  {t("afp.readCase")}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>

            {/* Honest consortium scope: 3 ruled rows right under the AFP bench. */}
            <div className="mt-12 border-t border-border pt-10 md:mt-16">
              <h3 className="m-0 text-[22px] font-bold leading-[1.15] tracking-[-0.03em] text-foreground md:text-[28px]">
                {t("proof.title")}
              </h3>
              <p className={`${OFFER_PROSE} mt-3 max-w-[64ch]`}>{t("proof.intro")}</p>
              <ol className="m-0 mt-7 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-3 md:gap-8">
                {MEDIA_PROOF_KEYS.map((key, i) => (
                  <li key={key} className="border-t border-border pt-5">
                    <span className="font-mono text-[12px] tracking-[0.18em] text-brand">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="m-0 mt-3 text-[15px] leading-[1.55] text-foreground md:text-base">
                      {t(`proof.items.${key}`)}
                    </p>
                  </li>
                ))}
              </ol>
              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
                <p className={OFFER_PROSE}>{t.rich("proof.funding", { link: link(fundingArticle) })}</p>
                <p className={OFFER_PROSE}>{t.rich("proof.case", { link: link(afpPath) })}</p>
              </div>
            </div>
          </section>

          {/* Audience fit: asymmetric 2-col split, no boxes. */}
          <section className={`${OFFER_BAND} border-t border-border`}>
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
              <div>
                <p className={`m-0 mb-5 inline-flex items-center ${OFFER_MONO}`}>
                  <BrandSquare />
                  {t("audience.kicker")}
                </p>
                <h2 className={OFFER_H2_SPLIT}>{t("audience.title")}</h2>
                <p className={`${OFFER_PROSE_LEAD} mt-5 max-w-[44ch]`}>{t("audience.intro")}</p>
              </div>
              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
                <div>
                  <span className={OFFER_MONO}>{t("audience.typesLabel")}</span>
                  <ul className="m-0 mt-4 flex list-none flex-col border-t border-border p-0">
                    {MEDIA_AUDIENCE_KEYS.map((key, i) => (
                      <li
                        key={key}
                        className="flex items-baseline gap-4 border-b border-border py-4 text-[16px] leading-[1.45] text-foreground"
                      >
                        <span className="font-mono text-xs tracking-[0.18em] text-brand">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span>{t(`audience.types.${key}`)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className={OFFER_MONO}>{t("audience.signalsLabel")}</span>
                  <ul className="m-0 mt-4 flex list-none flex-col border-t border-border p-0">
                    {(t.raw("audience.signals") as string[]).map((signal) => (
                      <li
                        key={signal}
                        className="flex gap-3 border-b border-border py-4 text-[16px] leading-[1.45] text-soft-foreground"
                      >
                        <span aria-hidden="true" className={OFFER_LIST_RULE} />
                        <span>{signal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* 5 deliverables in a mathematically balanced 2 + 3 layout. */}
          <section className={`${OFFER_BAND} border-t border-border`}>
            <p className={`m-0 mb-5 inline-flex items-center ${OFFER_MONO}`}>
              <BrandSquare />
              {t("offer.kicker")}
            </p>
            <h2 className={`${OFFER_H2} max-w-[20ch]`}>{t("offer.title")}</h2>
            <p className={`${OFFER_PROSE_LEAD} mt-5 max-w-[62ch]`}>{t("offer.intro")}</p>

            <div className="mt-12 grid grid-cols-1 gap-4 md:mt-16 md:grid-cols-2">
              {firstTwoOffers.map((key, i) => (
                <article
                  key={key}
                  className="lamp-card relative flex flex-col overflow-hidden border border-border p-7 md:p-9"
                >
                  <span className="text-foreground relative mb-8 self-start text-[48px] font-bold leading-none tracking-[-0.05em]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="relative m-0 mb-3 text-[clamp(1.45rem,2.1vw,1.9rem)] font-bold leading-[1.08] tracking-[-0.03em] text-foreground">
                    {t(`offer.items.${key}.title`)}
                  </h3>
                  <p className={`relative ${OFFER_PROSE} max-w-[56ch] text-soft-foreground`}>
                    {t(`offer.items.${key}.desc`)}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
              {lastThreeOffers.map((key, i) => (
                <article
                  key={key}
                  className="flex flex-col border border-border bg-card p-7 transition-colors duration-300 hover:border-border-strong md:p-9"
                >
                  <span className="text-foreground mb-8 self-start text-[44px] font-bold leading-none tracking-[-0.05em]">
                    {String(i + 3).padStart(2, "0")}
                  </span>
                  <h3 className="m-0 mb-3 text-[21px] font-bold leading-[1.1] tracking-[-0.03em] text-foreground md:text-[24px]">
                    {t(`offer.items.${key}.title`)}
                  </h3>
                  <p className={`${OFFER_PROSE} text-soft-foreground`}>
                    {t(`offer.items.${key}.desc`)}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>

        {/* 4-step method on ink. */}
        <OfferMethodBand
          kicker={t("method.kicker")}
          title={t("method.title")}
          steps={MEDIA_METHOD_STEPS.map((step) => ({
            n: step.n,
            title: t(`method.steps.${step.key}.title`),
            desc: t(`method.steps.${step.key}.desc`),
          }))}
          footer={
            <AboutBookingCta page={page} location="cta_media_ai_method" namespace="mediaAi" lit />
          }
        />

        <div data-surface="paper">
          <OfferFaqSection
            kicker={t("faq.kicker")}
            title={t("faq.title")}
            borderTop={false}
            items={MEDIA_FAQ_KEYS.map((key) => ({
              key,
              question: t(`faq.items.${key}.q`),
              answer: t.rich(`faq.items.${key}.a`, faqLinks),
            }))}
          />

          <OfferFurtherReading
            kicker={t("further.kicker")}
            title={t("further.title")}
            articlesLabel={t("further.readingLabel")}
            articles={articles}
            offersLabel={t("further.offersLabel")}
            offers={siblingOffers}
            note={t.rich("about", { link: link(splitPath(ABOUT_PATHS, locale)) })}
          />
        </div>

        <FinalCTA namespace="mediaAi.finalCta" />
      </main>
      <Footer />
    </div>
  );
}

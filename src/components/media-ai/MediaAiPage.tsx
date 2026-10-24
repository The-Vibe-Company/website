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
  MEDIA_AUDIENCE_KEYS,
  MEDIA_CASE_SLUG,
  MEDIA_FAQ_KEYS,
  MEDIA_HERO_KEYS,
  MEDIA_METHOD_STEPS,
  MEDIA_OFFER_KEYS,
  MEDIA_PROOF_KEYS,
  MEDIA_STAT_KEYS,
  mediaFundingArticle,
  mediaPageId,
} from "@/lib/media-ai";
import {
  ABOUT_PATHS,
  AGENCY_PARIS_PATHS,
  AGENTS_PRODUCTION_PATHS,
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
 * The media AI landing, served at /fr/ia-medias and /en/ai-for-media. Both
 * routes render this component; each declares the other through hreflang.
 *
 * Built from the About page and the other service landings (mono kicker, clamp
 * H1, bordered cards, ink slab, FAQ rows, FinalCTA), with no new visual
 * language. The proof is MediaGen, where we are one member of AFP's technical
 * consortium: the page says what that proves, and what it does not.
 */

export async function mediaAiMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "mediaAi" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  const path = splitPath(MEDIA_AI_PATHS, locale);

  return {
    // Absolute, not the layout template: the brand is already in the title.
    title: { absolute: title },
    description,
    alternates: splitPathAlternates(locale, MEDIA_AI_PATHS),
    ...localizedSocialMetadata({ locale, path, title, description }),
  };
}

const SECTION = "mx-auto max-w-[100rem] px-6 md:px-12";
const H2 =
  "m-0 font-bold text-foreground text-[clamp(32px,5vw,64px)] leading-[0.95] tracking-[-0.04em]";
const MONO =
  "font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground";
const PROSE = "m-0 text-[15px] leading-[1.6] text-muted-foreground md:text-base";
const TEXT_LINK =
  "text-foreground underline decoration-1 underline-offset-4 hover:text-muted-foreground";
const MONO_LINK =
  "inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground underline decoration-1 underline-offset-4 hover:text-muted-foreground";
const CARD_HOVER =
  "transition-[transform,box-shadow] duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_0_var(--foreground)]";

/** The FAQ answers' link tags, kept as plain text for the JSON-LD. */
const FAQ_PLAIN_TAGS = {
  case: (chunks: string) => chunks,
  funding: (chunks: string) => chunks,
  agency: (chunks: string) => chunks,
  agents: (chunks: string) => chunks,
};

export async function MediaAiPage({ locale }: { locale: string }) {
  const contentLocale: ContentLocale = locale === "en" ? "en" : "fr";
  const t = await getTranslations({ locale, namespace: "mediaAi" });
  const tAbout = await getTranslations({ locale, namespace: "about" });
  const tFooter = await getTranslations({ locale, namespace: "footer" });

  const pageUrl = localizedUrl(locale, splitPath(MEDIA_AI_PATHS, locale));
  const page = mediaPageId(locale);
  const fundingArticle = mediaFundingArticle(locale);
  const afp = getCustomer(MEDIA_CASE_SLUG, contentLocale);
  const afpPath = `/case-studies/${MEDIA_CASE_SLUG}`;
  const link = (href: string) =>
    function InlineLink(chunks: ReactNode) {
      return (
        <Link href={href} className={TEXT_LINK}>
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
    // Answers that name the client or MediaGen are left out by
    // `isPublishable`, like everywhere else on the site.
    faqPageSchema(
      MEDIA_FAQ_KEYS.map((key) => ({
        question: t(`faq.items.${key}.q`),
        // The answers' inline links, dropped to the text the reader sees.
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
        {/* 1 — The one H1 on the page, the promise, the facts and the call. */}
        <section className={`${SECTION} pb-14 pt-12 md:pb-20 md:pt-16`}>
          <span className={`mb-6 block ${MONO}`}>{t("kicker")}</span>
          <h1
            className="m-0 max-w-[24ch] font-bold text-foreground"
            style={{
              fontSize: "clamp(38px, 5.6vw, 84px)",
              lineHeight: 0.93,
              letterSpacing: "-0.045em",
            }}
          >
            {t("title")}
          </h1>
          <p className="m-0 mt-8 max-w-[760px] border-l-2 border-foreground pl-5 text-lg leading-[1.5] text-foreground md:pl-6 md:text-[19px]">
            {t("lede")}
          </p>

          <span className={`mt-10 block ${MONO}`}>{t("hero.label")}</span>
          <ul className="m-0 mt-4 grid max-w-[1100px] list-none grid-cols-1 gap-x-10 border-t border-border p-0 md:grid-cols-2">
            {MEDIA_HERO_KEYS.map((key) => (
              <li
                key={key}
                className="flex gap-4 border-b border-border py-4 text-[15px] leading-[1.5] text-foreground md:text-base"
              >
                <span
                  aria-hidden="true"
                  className="mt-[0.55em] h-2 w-2 shrink-0 bg-foreground"
                />
                {t(`hero.items.${key}`)}
              </li>
            ))}
          </ul>

          <AboutBookingCta page={page} location="cta_media_ai_hero" namespace="mediaAi" />
          <AboutBackers label={tAbout("backedBy")} />
        </section>

        {/* 2 — Who it is for: the kinds of organisations, then the signals. */}
        <section className={`${SECTION} border-t border-border py-14 md:py-20`}>
          <h2 className={H2}>{t("audience.title")}</h2>
          <p className={`${PROSE} mt-5 max-w-[680px]`}>{t("audience.intro")}</p>

          <div className="mt-10 grid grid-cols-1 gap-10 md:mt-14 md:grid-cols-2 md:gap-12">
            <div>
              <span className={MONO}>{t("audience.typesLabel")}</span>
              <ul className="m-0 mt-4 flex list-none flex-col border-t-2 border-foreground p-0">
                {MEDIA_AUDIENCE_KEYS.map((key, i) => (
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
              <ul className="m-0 mt-4 flex list-none flex-col border-t-2 border-foreground p-0">
                {(t.raw("audience.signals") as string[]).map((signal) => (
                  <li
                    key={signal}
                    className="flex gap-3 border-b border-border py-4 text-[17px] leading-[1.45] text-foreground"
                  >
                    <span aria-hidden="true" className="font-mono text-muted-foreground">
                      —
                    </span>
                    <span>{signal}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 3 — The offer: five building blocks. The first card spans two
            columns so five cards fill two full rows. */}
        <section className={`${SECTION} border-t border-border py-14 md:py-20`}>
          <h2 className={H2}>{t("offer.title")}</h2>
          <p className={`${PROSE} mt-5 max-w-[680px]`}>{t("offer.intro")}</p>

          <div className="mt-10 grid grid-cols-1 gap-5 md:mt-14 md:grid-cols-2 lg:grid-cols-3">
            {MEDIA_OFFER_KEYS.map((key, i) => (
              <article
                key={key}
                className={`flex flex-col border border-foreground bg-background p-7 ${CARD_HOVER} ${
                  i === 0 ? "md:col-span-2" : ""
                }`}
              >
                <span className="mb-7 font-mono text-xs tracking-[0.2em] text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="m-0 mb-4 text-[24px] font-bold leading-[1.05] tracking-[-0.035em] text-foreground md:text-[clamp(22px,2.2vw,28px)]">
                  {t(`offer.items.${key}.title`)}
                </h3>
                <p className={`${PROSE} max-w-[60ch]`}>{t(`offer.items.${key}.desc`)}</p>
              </article>
            ))}
          </div>
        </section>

        {/* 4 — What MediaGen proves, and the line it does not cross: we build
            the tools, we do not put together funding applications. */}
        <section className={`${SECTION} border-t border-border py-14 md:py-20`}>
          <h2 className={`${H2} max-w-[22ch]`}>{t("proof.title")}</h2>
          <p className={`${PROSE} mt-5 max-w-[680px]`}>{t("proof.intro")}</p>

          <div className="mt-10 border-t-2 border-foreground md:mt-14">
            {MEDIA_PROOF_KEYS.map((key, i) => (
              <article
                key={key}
                className="grid grid-cols-1 gap-3 border-b border-border py-6 md:grid-cols-[48px_minmax(0,1fr)] md:gap-6"
              >
                <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="m-0 max-w-[72ch] text-[17px] leading-[1.5] text-foreground md:text-lg">
                  {t(`proof.items.${key}`)}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <p className={PROSE}>{t.rich("proof.funding", { link: link(fundingArticle) })}</p>
            <p className={PROSE}>{t.rich("proof.case", { link: link(afpPath) })}</p>
          </div>
        </section>

        {/* 5 — The AFP card: figures and tools from the published case study
            only, and no fourth tool. */}
        <section className={`${SECTION} border-t border-border py-14 md:py-20`}>
          <h2 className={`${H2} max-w-[22ch]`}>{t("afp.title")}</h2>
          <p className={`${PROSE} mt-5 max-w-[720px]`}>{t("afp.intro")}</p>

          <article
            className={`mt-10 grid grid-cols-1 border border-foreground bg-background md:mt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] ${CARD_HOVER}`}
          >
            <div className="flex flex-col border-b border-foreground p-7 md:p-9 lg:border-b-0 lg:border-r">
              {afp ? (
                <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
                  <h3 className="m-0">
                    {/* The logo is the card's title: its alt carries the client name. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={afp.logo}
                      alt={afp.client}
                      className="h-8 w-auto max-w-[180px] object-contain object-left md:h-9"
                      loading="lazy"
                      decoding="async"
                    />
                  </h3>
                  <span className="border border-foreground px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground">
                    {afp.sector}
                  </span>
                </div>
              ) : null}

              <dl className="m-0 mt-8 border-t-2 border-foreground">
                {MEDIA_STAT_KEYS.map((key) => (
                  <div
                    key={key}
                    className="grid grid-cols-[minmax(0,140px)_minmax(0,1fr)] items-baseline gap-4 border-b border-border py-4"
                  >
                    <dt className={MONO}>{t(`afp.stats.${key}.label`)}</dt>
                    <dd className="m-0 text-[22px] font-bold leading-[1.1] tracking-[-0.03em] text-foreground md:text-[26px]">
                      {t(`afp.stats.${key}.value`)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="flex flex-col p-7 md:p-9">
              <ul className="m-0 flex list-none flex-col p-0">
                {(t.raw("afp.points") as string[]).map((point) => (
                  <li
                    key={point}
                    className="flex gap-3 border-b border-border py-3 text-[15px] leading-[1.5] text-foreground last:border-b-0"
                  >
                    <span aria-hidden="true" className="font-mono text-orange-500">
                      →
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <Link href={afpPath} className={`${MONO_LINK} mt-auto self-start pt-6`}>
                {t("afp.readCase")}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>
        </section>

        {/* 6 — How a project starts, on the same ink slab as the About
            process section, with the mid-page call. */}
        <section
          data-surface="inverse"
          className="border-y-2 border-foreground bg-foreground text-background"
        >
          <div className={`${SECTION} py-16 md:py-24`}>
            <h2
              className="m-0 font-bold text-background"
              style={{
                fontSize: "clamp(32px, 5vw, 64px)",
                lineHeight: 0.95,
                letterSpacing: "-0.04em",
              }}
            >
              {t("method.title")}
            </h2>

            <ol className="m-0 mt-12 flex list-none flex-col border-t border-white/15 p-0 md:mt-16">
              {MEDIA_METHOD_STEPS.map((step) => (
                <li
                  key={step.n}
                  className="grid grid-cols-1 gap-4 border-b border-white/15 py-7 md:grid-cols-[200px_1fr] md:gap-12 md:py-8"
                >
                  <span className="text-4xl font-bold leading-none tracking-[-0.05em] text-background md:text-[56px]">
                    {step.n}
                  </span>
                  <div className="flex flex-col gap-3">
                    <h3 className="m-0 max-w-[620px] text-[22px] font-bold leading-[1.05] tracking-[-0.03em] text-background md:text-[28px]">
                      {t(`method.steps.${step.key}.title`)}
                    </h3>
                    <p className="m-0 max-w-[620px] text-[15px] leading-[1.55] text-white/70 md:text-base">
                      {t(`method.steps.${step.key}.desc`)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <AboutBookingCta
              page={page}
              location="cta_media_ai_method"
              namespace="mediaAi"
              inverse
            />
          </div>
        </section>

        {/* 7 — FAQ; the publishable answers are restated in the FAQPage
            JSON-LD above. */}
        <section className={`${SECTION} py-14 md:py-20`}>
          <h2 className={H2}>{t("faq.title")}</h2>

          <div className="mt-10 border-t-2 border-foreground md:mt-12">
            {MEDIA_FAQ_KEYS.map((key) => (
              <article
                key={key}
                className="grid grid-cols-1 gap-3 border-b border-border py-7 md:grid-cols-[minmax(0,420px)_1fr] md:gap-12 md:py-8"
              >
                <h3 className="m-0 text-[20px] font-bold leading-[1.15] tracking-[-0.03em] text-foreground md:text-[24px]">
                  {t(`faq.items.${key}.q`)}
                </h3>
                <p className={`${PROSE} max-w-[70ch]`}>{t.rich(`faq.items.${key}.a`, faqLinks)}</p>
              </article>
            ))}
          </div>

          <p className={`${PROSE} mt-10 border-l-2 border-foreground pl-5`}>
            {t.rich("about", { link: link(splitPath(ABOUT_PATHS, locale)) })}
          </p>
        </section>

        <FinalCTA namespace="mediaAi.finalCta" />
      </main>
      <Footer />
    </div>
  );
}

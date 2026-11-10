import type { Metadata } from "next";
import { ServiceHero } from "@/components/ServiceHero";
import { Clientele } from "@/components/home/landing/Clientele";
import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";

import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { TopNav } from "@/components/TopNav";
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
import { clientLogoSize } from "@/lib/client-logos";
import { BrandSquare } from "@/components/BrandSquare";

// List marker drawn as a short rule rather than a dash character.
const DASH = "mt-[0.72em] h-px w-[0.6em] shrink-0 bg-muted-foreground";

/**
 * The media AI landing, served at /fr/ia-medias and /en/ai-for-media. Both
 * routes render this component; each declares the other through hreflang.
 *
 * Drawn in the landing's theme, like the About page: the hero on the ink in
 * an orange bloom, then warm paper bands (lamp cards with lit numerals, the
 * AFP card with lit figures), the method as an ink band in the orange light,
 * the FAQ on paper, and the closing scene. The proof is MediaGen, where we are
 * one member of AFP's technical consortium: the page says what that proves,
 * and what it does not.
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
/** The soft orange light an emphasis ink band sits in. */
const GLOW =
  "radial-gradient(55% 70% at 12% 100%, rgb(242 115 19 / 0.18), rgb(242 115 19 / 0.05) 55%, transparent 80%)";
/** The short orange bar a lamp card hangs from, with its glow. */
const LAMP =
  "absolute left-1/2 top-0 h-1.5 w-16 -translate-x-1/2 bg-brand shadow-[0_0_40px_12px_rgba(242,115,19,0.45)]";

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
        {/* 1 — On the ink, cut like the homepage's hero: the short headline,
            the full title as the H1's promise, the pitch and the call, the
            mascot standing in its light. */}
        <ServiceHero
          kicker={t("kicker")}
          display={t("displayTitle")}
          title={t("title")}
          lede={t("lede")}
          cta={<AboutBookingCta page={page} location="cta_media_ai_hero" namespace="mediaAi" />}
        />

        <div data-surface="paper">
          {/* The client logos running along the top of the paper, as on the
              homepage. */}
          <Clientele />

          {/* What the hero used to list, in short, at the top of the paper. */}
          <section className={`${SECTION} border-b border-border py-12 md:py-14`}>
            <span className={MONO}>
              <BrandSquare />
              {t("hero.label")}
            </span>
            <ul className="m-0 mt-6 grid max-w-[1100px] list-none grid-cols-1 gap-x-10 border-t border-border p-0 md:grid-cols-2">
              {MEDIA_HERO_KEYS.map((key) => (
                <li
                  key={key}
                  className="flex gap-4 border-b border-border py-4 text-[15px] leading-[1.5] text-foreground md:text-base"
                >
                  <span aria-hidden="true" className="mt-[0.6em] h-1.5 w-1.5 shrink-0 bg-brand" />
                  {t(`hero.items.${key}`)}
                </li>
              ))}
            </ul>
          </section>

          {/* 2 — Who it is for: the kinds of organisations, then the signals. */}
          <section className={BAND}>
            <h2 className={H2}>{t("audience.title")}</h2>
            <p className={`${PROSE} mt-6 max-w-[680px]`}>{t("audience.intro")}</p>

            <div className="mt-12 grid grid-cols-1 gap-10 md:mt-16 md:grid-cols-2 md:gap-12">
              <div>
                <span className={MONO}>{t("audience.typesLabel")}</span>
                <ul className="m-0 mt-4 flex list-none flex-col border-t border-border p-0">
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
              {MEDIA_OFFER_KEYS.map((key, i) => (
                <article
                  key={key}
                  className={`lamp-card relative flex flex-col overflow-hidden border border-border p-7 md:p-9 ${
                    i === 0 ? "md:col-span-2" : ""
                  }`}
                >
                  <span aria-hidden="true" className={LAMP} />
                  <span className="text-lit relative mb-10 self-start text-[56px] font-bold leading-none tracking-[-0.05em]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
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

          {/* 4 — What MediaGen proves, and the line it does not cross: we
              build the tools, we do not put together funding applications. */}
          <section className={`${BAND} border-t border-border`}>
            <h2 className={`${H2} max-w-[20ch]`}>{t("proof.title")}</h2>
            <p className={`${PROSE} mt-6 max-w-[680px]`}>{t("proof.intro")}</p>

            <div className="mt-12 border-t border-border md:mt-16">
              {MEDIA_PROOF_KEYS.map((key, i) => (
                <article
                  key={key}
                  className="grid grid-cols-1 gap-4 border-b border-border py-8 md:grid-cols-[160px_minmax(0,1fr)] md:items-baseline md:gap-12 md:py-10"
                >
                  <span className="text-lit self-start text-5xl font-bold leading-none tracking-[-0.05em] md:text-[64px]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="m-0 max-w-[60ch] text-[18px] leading-[1.45] tracking-[-0.01em] text-foreground md:text-[22px]">
                    {t(`proof.items.${key}`)}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-10 flex max-w-[760px] flex-col gap-3">
              <p className={PROSE}>{t.rich("proof.funding", { link: link(fundingArticle) })}</p>
              <p className={PROSE}>{t.rich("proof.case", { link: link(afpPath) })}</p>
            </div>
          </section>

          {/* 5 — The AFP card: figures and tools from the published case
              study only, and no fourth tool. */}
          <section className={`${BAND} border-t border-border`}>
            <h2 className={`${H2} max-w-[20ch]`}>{t("afp.title")}</h2>
            <p className={`${PROSE} mt-6 max-w-[720px]`}>{t("afp.intro")}</p>

            <article className="mt-12 grid grid-cols-1 border border-border bg-card transition-colors duration-300 hover:border-border-strong md:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
              <div className="flex flex-col border-b border-border p-7 md:p-9 lg:border-b-0 lg:border-r">
                {afp ? (
                  <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
                    <h3 className="m-0">
                      {/* The logo is the card's title: its alt carries the client name. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={afp.logo}
                        alt={afp.client}
                        {...clientLogoSize(afp.logo)}
                        className="logo-tone h-8 w-auto max-w-[180px] object-contain object-left md:h-9"
                        loading="lazy"
                        decoding="async"
                      />
                    </h3>
                    <span className="text-right font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] text-muted-foreground">
                      {afp.sector}
                    </span>
                  </div>
                ) : null}

                <dl className="m-0 mt-10 border-t border-border">
                  {MEDIA_STAT_KEYS.map((key) => (
                    <div
                      key={key}
                      className="grid grid-cols-[minmax(0,120px)_minmax(0,1fr)] items-baseline gap-4 border-b border-border py-5 md:grid-cols-[minmax(0,140px)_minmax(0,1fr)]"
                    >
                      <dt className={MONO}>{t(`afp.stats.${key}.label`)}</dt>
                      <dd className="m-0 text-[26px] font-bold leading-[1.05] tracking-[-0.04em] md:text-[34px]">
                        <span className="text-lit box-decoration-clone">
                          {t(`afp.stats.${key}.value`)}
                        </span>
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
                      className="flex gap-3 border-b border-border py-4 text-[15px] leading-[1.55] text-foreground last:border-b-0 md:text-base"
                    >
                      <span aria-hidden="true" className="font-mono text-brand">
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

            <ol className="m-0 mt-14 flex list-none flex-col border-t border-border p-0 md:mt-16">
              {MEDIA_METHOD_STEPS.map((step) => (
                <li
                  key={step.n}
                  className="grid grid-cols-1 gap-4 border-b border-border py-8 md:grid-cols-[220px_1fr] md:gap-12 md:py-10"
                >
                  <span className="text-lit self-start text-5xl font-bold leading-none tracking-[-0.05em] md:text-[72px]">
                    {step.n}
                  </span>
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

            <AboutBookingCta page={page} location="cta_media_ai_method" namespace="mediaAi" />
          </div>
        </section>

        <div data-surface="paper">
          {/* 7 — FAQ; the publishable answers are restated in the FAQPage
              JSON-LD above. */}
          <section className={BAND}>
            <h2 className={H2}>{t("faq.title")}</h2>

            <div className="mt-12 border-t border-border md:mt-16">
              {MEDIA_FAQ_KEYS.map((key) => (
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

            <p className={`${PROSE} mt-12 max-w-[760px] border-l border-border-strong pl-5`}>
              {t.rich("about", { link: link(splitPath(ABOUT_PATHS, locale)) })}
            </p>
          </section>
        </div>

        <FinalCTA namespace="mediaAi.finalCta" />
      </main>
      <Footer />
    </div>
  );
}

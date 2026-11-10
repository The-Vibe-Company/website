import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { TopNav } from "@/components/TopNav";
import { AboutBookingCta } from "@/components/about/AboutBookingCta";
import { Clientele } from "@/components/home/landing/Clientele";
import { ServiceHero } from "@/components/ServiceHero";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Link } from "@/i18n/navigation";
import { ABOUT_ORIGIN_ARTICLE_LOCALE, ABOUT_ORIGIN_ARTICLE_PATH } from "@/lib/about";
import {
  AGENCY_PARIS_ARTICLES,
  AGENCY_PARIS_CASE_SLUGS,
  AGENCY_PARIS_FAQ_KEYS,
  AGENCY_PARIS_OFFER_KEYS,
  AGENCY_PARIS_SECURITY_KEYS,
  AGENCY_PARIS_STEPS,
} from "@/lib/agency-paris";
import { getCustomer, type ContentLocale } from "@/lib/customers";
import {
  ABOUT_PATHS,
  AGENCY_PARIS_PATHS,
  AGENTS_PRODUCTION_PATHS,
  CUSTOM_AI_APP_PATHS,
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

/**
 * The commercial "AI agency in Paris" landing page, served at
 * /fr/agence-ia-paris and /en/ai-agency-paris. Both routes render this
 * component; each declares the other through hreflang.
 *
 * Dressed like the homepage landing and the About page: the hero on the ink
 * in its orange bloom, then warm paper (the offers and cases under their
 * lamps), the method as an ink band in the orange light, paper again for
 * security, team and FAQ, and the homepage FinalCTA. Every figure comes from
 * a published case study or article — see src/lib/agency-paris.ts.
 */

export async function agencyParisMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "agencyParis" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  const path = splitPath(AGENCY_PARIS_PATHS, locale);

  return {
    // Absolute: the brand is already in the title.
    title: { absolute: title },
    description,
    alternates: splitPathAlternates(locale, AGENCY_PARIS_PATHS),
    ...localizedSocialMetadata({ locale, path, title, description }),
  };
}

const SECTION = "mx-auto max-w-[90rem] px-6 md:px-10 lg:px-16";
const BAND = `${SECTION} py-20 md:py-28 lg:py-32`;
const H2 =
  "m-0 font-bold text-foreground text-[clamp(2.5rem,5.6vw,5.25rem)] leading-[0.92] tracking-[-0.045em]";
const MONO =
  "font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground";
const PROSE = "m-0 text-[15px] leading-[1.6] text-muted-foreground md:text-base";
const TEXT_LINK =
  "inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground underline decoration-1 underline-offset-4 transition-colors hover:text-brand";
// List marker drawn as a short rule rather than a dash character.
const DASH = "mt-[0.72em] h-px w-[0.6em] shrink-0 bg-muted-foreground";
/** The short orange bar a lamp card hangs from, with its glow. */
const LAMP =
  "absolute left-1/2 top-0 h-1.5 w-16 -translate-x-1/2 bg-brand shadow-[0_0_40px_12px_rgba(242,115,19,0.45)]";
/** The light an ink band sits in, as on the homepage's client quote. */
const INK_GLOW =
  "radial-gradient(55% 70% at 12% 100%, rgb(242 115 19 / 0.18), rgb(242 115 19 / 0.05) 55%, transparent 80%)";

export async function AgencyParisPage({ locale }: { locale: string }) {
  const contentLocale: ContentLocale = locale === "en" ? "en" : "fr";
  const t = await getTranslations({ locale, namespace: "agencyParis" });
  const tServices = await getTranslations({ locale, namespace: "services" });
  const tFooter = await getTranslations({ locale, namespace: "footer" });

  const pageUrl = localizedUrl(locale, splitPath(AGENCY_PARIS_PATHS, locale));
  // The CTA's PostHog `page` property: the landing's own URL segment.
  const page = splitPath(AGENCY_PARIS_PATHS, locale).slice(1);

  const cases = AGENCY_PARIS_CASE_SLUGS.map((slug) => getCustomer(slug, contentLocale)).filter(
    (customer) => customer !== undefined,
  );
  const [featured, ...others] = cases;
  const articles = AGENCY_PARIS_ARTICLES[contentLocale];

  const jsonLd = [
    webPageNode({
      url: pageUrl,
      name: t("metaTitle"),
      description: t("metaDescription"),
      language: locale,
    }),
    breadcrumbList([
      { name: tFooter("home"), url: localizedUrl(locale) },
      { name: t("breadcrumb"), url: pageUrl },
    ]),
    faqPageSchema(
      AGENCY_PARIS_FAQ_KEYS.map((key) => ({
        question: t(`faq.items.${key}.q`),
        answer: t(`faq.items.${key}.a`),
      })),
    ),
    serviceNode({
      url: pageUrl,
      name: t("serviceName"),
      serviceType: "AI product development, AI agents, AI training",
      city: "Paris",
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
          cta={<AboutBookingCta page={page} location="cta_agency_paris_hero" namespace="agencyParis" />}
        />

        <div data-surface="paper">
          {/* The client logos running along the top of the paper, as on the
              homepage. */}
          <Clientele />

          {/* Three sourced facts, in short. */}
          <section className={`${SECTION} border-b border-border py-12 md:py-14`}>
            <span className={MONO}>
              <BrandSquare />
              {t("factsLabel")}
            </span>
            <ul className="m-0 mt-6 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-3 md:gap-10">
              {t.raw("facts").map((fact: string) => (
                <li key={fact} className="flex gap-3 text-[16px] leading-[1.5] text-soft-foreground">
                  <span aria-hidden="true" className="mt-[0.55em] h-1.5 w-1.5 shrink-0 bg-brand" />
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 2 — The three offers, the homepage services, each under its
              lamp. */}
          <section className={BAND}>
            <h2 className={H2}>{t("offers.title")}</h2>
            <p className={`${PROSE} mt-6 max-w-[680px]`}>{t("offers.intro")}</p>

            <div className="mt-12 grid grid-cols-1 gap-4 md:mt-16 md:grid-cols-3">
              {AGENCY_PARIS_OFFER_KEYS.map((key, i) => (
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
                      {tServices(`items.${key}.tag`)}
                    </span>
                  </div>
                  <h3 className="relative m-0 mb-4 text-[clamp(1.6rem,2.2vw,2.1rem)] font-bold leading-[1.05] tracking-[-0.03em] text-foreground">
                    {t(`offers.items.${key}.label`)}
                    <span className="block text-muted-foreground">
                      {t(`offers.items.${key}.title`)}
                    </span>
                  </h3>
                  <p className={`relative ${PROSE} text-soft-foreground`}>
                    {t(`offers.items.${key}.desc`)}
                  </p>
                  {key === "build" || key === "operate" ? (
                    <Link
                      href={splitPath(
                        key === "build" ? CUSTOM_AI_APP_PATHS : AGENTS_PRODUCTION_PATHS,
                        locale,
                      )}
                      className={`relative ${TEXT_LINK} mt-6 self-start`}
                    >
                      {t(`offers.items.${key}.link`)}
                      <span aria-hidden="true">→</span>
                    </Link>
                  ) : null}
                </article>
              ))}
            </div>
          </section>

          {/* 3 — Who it is for: the signals, and the sectors already
              shipped. */}
          <section className={`${BAND} border-t border-border`}>
            <h2 className={H2}>{t("audience.title")}</h2>
            <p className={`${PROSE} mt-6 max-w-[680px]`}>{t("audience.intro")}</p>

            <div className="mt-12 grid grid-cols-1 gap-12 md:mt-16 md:grid-cols-2 md:gap-16">
              <div>
                <span className={MONO}>{t("audience.signalsLabel")}</span>
                <ul className="m-0 mt-4 flex list-none flex-col p-0">
                  {t.raw("audience.signals").map((signal: string) => (
                    <li
                      key={signal}
                      className="flex gap-3 py-4 text-[17px] leading-[1.45] text-foreground"
                    >
                      <span aria-hidden="true" className={DASH} />
                      <span>{signal}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <span className={MONO}>{t("audience.sectorsLabel")}</span>
                <ul className="m-0 mt-4 flex list-none flex-col p-0">
                  {cases.map((customer) => (
                    <li key={customer.slug} className="border-b border-border">
                      <Link
                        href={`/case-studies/${customer.slug}`}
                        className="group flex items-baseline justify-between gap-4 py-4 text-foreground"
                      >
                        <span className="text-[17px] leading-[1.45]">
                          {t(`audience.sectors.${customer.slug}`)}
                        </span>
                        <span className="inline-flex shrink-0 items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] underline decoration-1 underline-offset-4 transition-colors group-hover:text-brand">
                          {customer.client}
                          <span aria-hidden="true">→</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* 4 — How it goes: an ink band in the orange light, like the
            homepage's client quote, with the mid-page call. */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ background: INK_GLOW }}
          />
          <div className={`relative ${BAND}`}>
            <h2 className={H2}>{t("method.title")}</h2>
            <p className={`${PROSE} mt-6 max-w-[680px]`}>{t("method.intro")}</p>

            <span className={`mt-14 block border-b border-border pb-4 md:mt-16 ${MONO}`}>
              {t("method.stepsLabel")}
            </span>
            <ol className="m-0 flex list-none flex-col p-0">
              {AGENCY_PARIS_STEPS.map((step) => (
                <li
                  key={step.n}
                  className="grid grid-cols-1 gap-4 py-8 md:grid-cols-[220px_1fr] md:gap-12 md:py-10"
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
                    <h3 className="m-0 max-w-[620px] text-[22px] font-bold leading-[1.05] tracking-[-0.03em] text-foreground md:text-[30px]">
                      {t(`method.steps.${step.key}.title`)}
                    </h3>
                    <p className={`${PROSE} max-w-[620px]`}>
                      {t(`method.steps.${step.key}.desc`)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <AboutBookingCta
              page={page}
              location="cta_agency_paris_method"
              namespace="agencyParis"
            />
          </div>
        </section>

        <div data-surface="paper">
          {/* 5 — Proof: published cases only, each under its lamp with a
              figure it can back, lit like the homepage's. */}
          <section className={BAND}>
            <h2 className={H2}>{t("proof.title")}</h2>
            <p className={`${PROSE} mt-6 max-w-[680px]`}>{t("proof.intro")}</p>

            {featured ? (
              <article className="lamp-card mt-12 grid grid-cols-1 overflow-hidden border border-border md:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
                <span aria-hidden="true" className={LAMP} />
                {/* One bench under one lamp: no rule between the halves on
                    a wide screen, so the light falls on the whole card. */}
                <div className="relative flex flex-col border-b border-border p-7 md:p-9 lg:border-b-0 lg:pr-6">
                  <CaseHeader
                    logo={featured.logo}
                    client={featured.client}
                    sector={t(`proof.cases.${featured.slug}.sector`)}
                  />
                  <div className="text-lit mt-10 pb-1 text-[clamp(3.5rem,7vw,6rem)] font-bold leading-none tracking-[-0.05em]">
                    {t(`proof.cases.${featured.slug}.figure`)}
                  </div>
                  <div className="mt-3 text-sm leading-[1.5] text-muted-foreground">
                    {t(`proof.cases.${featured.slug}.figureLabel`)}
                  </div>
                  {featured.quote ? (
                    <figure className="m-0 mt-8 border-l border-border-strong pl-5 lg:mt-auto lg:pt-8">
                      <blockquote className="m-0 text-[15px] leading-[1.6] text-foreground">
                        {locale === "fr" ? `« ${featured.quote.text} »` : `“${featured.quote.text}”`}
                      </blockquote>
                      <figcaption className={`mt-3 ${MONO}`}>{featured.quote.author}</figcaption>
                    </figure>
                  ) : null}
                </div>
                <div className="relative flex flex-col p-7 md:p-9 lg:pl-6">
                  <CasePoints points={t.raw(`proof.cases.${featured.slug}.points`)} />
                  <CaseLink slug={featured.slug} label={t("proof.readCase", { name: featured.client })} />
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
                  <div className="relative">
                    <CaseHeader
                      logo={customer.logo}
                      client={customer.client}
                      sector={t(`proof.cases.${customer.slug}.sector`)}
                    />
                  </div>
                  <div className="text-lit relative mt-8 pb-1 text-[clamp(2.75rem,4.6vw,4rem)] font-bold leading-none tracking-[-0.05em]">
                    {t(`proof.cases.${customer.slug}.figure`)}
                  </div>
                  <div className="relative mt-3 text-sm leading-[1.5] text-muted-foreground">
                    {t(`proof.cases.${customer.slug}.figureLabel`)}
                  </div>
                  <div className="relative mt-6 flex flex-1 flex-col">
                    <CasePoints points={t.raw(`proof.cases.${customer.slug}.points`)} />
                    <CaseLink
                      slug={customer.slug}
                      label={t("proof.readCase", { name: customer.client })}
                    />
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* 6 — Security and compliance: what we work to, never a
              certification. */}
          <section className={`${BAND} border-t border-border`}>
            <h2 className={H2}>{t("security.title")}</h2>
            <p className={`${PROSE} mt-6 max-w-[680px]`}>{t("security.intro")}</p>

            <div className="mt-12 md:mt-16">
              {AGENCY_PARIS_SECURITY_KEYS.map((key, i) => (
                <article
                  key={key}
                  className="grid grid-cols-1 gap-3 py-8 md:grid-cols-[96px_minmax(0,420px)_1fr] md:gap-12 md:py-10"
                >
                  <span className="text-lit text-[40px] font-bold leading-none tracking-[-0.05em]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="m-0 text-[20px] font-bold leading-[1.15] tracking-[-0.03em] text-foreground md:text-[24px]">
                    {t(`security.items.${key}.title`)}
                  </h3>
                  <p className={`${PROSE} max-w-[70ch]`}>{t(`security.items.${key}.desc`)}</p>
                </article>
              ))}
            </div>

            <div className="mt-12">
              <span className={MONO}>{t("security.readLabel")}</span>
              <ul className="m-0 mt-4 flex list-none flex-col gap-3 p-0">
                {articles.map((article) => (
                  <li key={article.key}>
                    <Link
                      href={article.path}
                      className="inline-flex items-baseline gap-2 text-[17px] leading-[1.45] text-foreground underline decoration-1 underline-offset-4 transition-colors hover:text-brand"
                    >
                      {t(`security.articles.${article.key}`)}
                      <span aria-hidden="true">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* 7 — Who is behind it, in short; the About page has the rest. */}
          <section className={`${BAND} border-t border-border`}>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:gap-16">
              <h2 className={H2}>{t("team.title")}</h2>
              <div>
                <p className="m-0 text-[17px] leading-[1.6] text-foreground md:text-lg">
                  {t("team.desc")}
                </p>
                <p className={`${PROSE} mt-4`}>{t("team.notToConfuse")}</p>
                <div className="mt-8 flex flex-col items-start gap-3">
                  <Link href={splitPath(ABOUT_PATHS, locale)} className={TEXT_LINK}>
                    {t("team.aboutLink")}
                    <span aria-hidden="true">→</span>
                  </Link>
                  <Link
                    href={ABOUT_ORIGIN_ARTICLE_PATH}
                    locale={ABOUT_ORIGIN_ARTICLE_LOCALE}
                    className={TEXT_LINK}
                  >
                    {t("team.originLink")}
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* 8 — Buyer questions, mirrored word for word in the FAQPage
              JSON-LD above. */}
          <section className={`${BAND} border-t border-border`}>
            <h2 className={H2}>{t("faq.title")}</h2>

            <div className="mt-12 md:mt-16">
              {AGENCY_PARIS_FAQ_KEYS.map((key) => (
                <article
                  key={key}
                  className="grid grid-cols-1 gap-3 py-8 md:grid-cols-[minmax(0,420px)_1fr] md:gap-12 md:py-10"
                >
                  <h3 className="m-0 text-[20px] font-bold leading-[1.15] tracking-[-0.03em] text-foreground md:text-[24px]">
                    {t(`faq.items.${key}.q`)}
                  </h3>
                  <p className={`${PROSE} max-w-[70ch]`}>{t(`faq.items.${key}.a`)}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

function CaseHeader({ logo, client, sector }: { logo: string; client: string; sector: string }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
      <h3 className="m-0">
        {/* The logo is the card's title: its alt carries the client name. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logo}
          alt={client}
          {...clientLogoSize(logo)}
          className="logo-tone h-8 w-auto max-w-[180px] object-contain object-left md:h-9"
          loading="lazy"
          decoding="async"
        />
      </h3>
      <span className="max-w-[16rem] text-right font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-muted-foreground">
        {sector}
      </span>
    </div>
  );
}

function CasePoints({ points }: { points: string[] }) {
  return (
    <ul className="m-0 flex list-none flex-col p-0">
      {points.map((point) => (
        <li
          key={point}
          className="flex gap-3 py-3 text-[15px] leading-[1.5] text-foreground"
        >
          <span aria-hidden="true" className="font-mono text-brand">
            →
          </span>
          <span>{point}</span>
        </li>
      ))}
    </ul>
  );
}

function CaseLink({ slug, label }: { slug: string; label: string }) {
  return (
    <Link href={`/case-studies/${slug}`} className={`mt-auto pt-6 ${TEXT_LINK} self-start`}>
      {label}
      <span aria-hidden="true">→</span>
    </Link>
  );
}

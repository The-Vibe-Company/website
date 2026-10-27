import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { TopNav } from "@/components/TopNav";
import { AboutBookingCta } from "@/components/about/AboutBookingCta";
import { CLIENTS } from "@/components/home/Clients";
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
 * The commercial "AI agency in Paris" landing page, served at
 * /fr/agence-ia-paris and /en/ai-agency-paris. Both routes render this
 * component; each declares the other through hreflang.
 *
 * It is built from the About page's blocks (hero, cards, ink slab, FAQ) and
 * the homepage FinalCTA. Every figure comes from a published case study or
 * article — see src/lib/agency-paris.ts.
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

const SECTION = "mx-auto max-w-[100rem] px-6 md:px-12";
const H2 =
  "m-0 font-bold text-foreground text-[clamp(32px,5vw,64px)] leading-[0.95] tracking-[-0.04em]";
const MONO =
  "font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground";
const PROSE = "m-0 text-[15px] leading-[1.6] text-muted-foreground md:text-base";
const TEXT_LINK =
  "inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground underline decoration-1 underline-offset-4 hover:text-muted-foreground";
const CARD_HOVER =
  "transition-[transform,box-shadow] duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_0_var(--foreground)]";

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
        {/* 1 — The one H1 on the page, the pitch, three sourced facts and
            the call. */}
        <section className={`${SECTION} pb-14 pt-12 md:pb-20 md:pt-16`}>
          <span className={`mb-6 block ${MONO}`}>{t("kicker")}</span>
          <h1
            className="m-0 max-w-[24ch] font-bold text-foreground"
            style={{
              fontSize: "clamp(36px, 5.4vw, 80px)",
              lineHeight: 0.94,
              letterSpacing: "-0.045em",
            }}
          >
            {t("title")}
          </h1>

          <div className="mt-8 grid grid-cols-1 gap-8 md:mt-10 lg:grid-cols-[minmax(0,680px)_minmax(0,1fr)] lg:gap-16">
            <p className="m-0 self-start border-l-2 border-foreground pl-5 text-lg leading-[1.5] text-foreground md:pl-6 md:text-[19px]">
              {t("lede")}
            </p>
            <div>
              <span className={MONO}>{t("factsLabel")}</span>
              <ul className="m-0 mt-4 flex list-none flex-col p-0">
                {t.raw("facts").map((fact: string) => (
                  <li
                    key={fact}
                    className="flex gap-3 border-b border-border py-3 text-[15px] leading-[1.5] text-foreground first:border-t"
                  >
                    <span aria-hidden="true" className="font-mono text-muted-foreground">
                      —
                    </span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <AboutBookingCta page={page} location="cta_agency_paris_hero" namespace="agencyParis" />

          {/* The same two backers as the About page. */}
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-border pt-7 md:mt-12">
            <span className={MONO}>{t("backedBy")}</span>
            <a
              href="https://www.ycombinator.com/companies/quivr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex transition-opacity hover:opacity-70"
            >
              <Image
                src="/images/partners/y-combinator.svg"
                alt="Y Combinator W24"
                width={154}
                height={38}
                className="h-8 w-auto"
              />
            </a>
            <span aria-hidden="true" className="h-8 w-px bg-border" />
            <Image
              src="/images/partners/france-2030.svg"
              alt="France 2030"
              width={52}
              height={52}
              className="h-10 w-auto"
            />
          </div>

          {/* The client logos already on the homepage, nothing more. */}
          <div className="mt-8 border-t border-border pt-7">
            <span className={MONO}>{t("clientsLabel")}</span>
            <ul className="m-0 mt-6 flex list-none flex-wrap items-center gap-x-10 gap-y-6 p-0 md:gap-x-14">
              {CLIENTS.map((client) => (
                <li key={client.name} className="flex items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={client.src}
                    alt={client.name}
                    className={`${client.className} w-auto object-contain brightness-0`}
                    loading="lazy"
                    decoding="async"
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 2 — The three offers, the homepage services in card form. */}
        <section className={`${SECTION} border-t border-border py-14 md:py-20`}>
          <h2 className={H2}>{t("offers.title")}</h2>
          <p className={`${PROSE} mt-5 max-w-[680px]`}>{t("offers.intro")}</p>

          <div className="mt-10 grid grid-cols-1 gap-5 md:mt-14 md:grid-cols-3">
            {AGENCY_PARIS_OFFER_KEYS.map((key, i) => (
              <article
                key={key}
                className={`flex flex-col border border-foreground bg-background p-7 ${CARD_HOVER}`}
              >
                <div className="mb-7 flex items-start justify-between gap-3">
                  <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="border border-foreground px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground">
                    {tServices(`items.${key}.tag`)}
                  </span>
                </div>
                <h3 className="m-0 mb-4 text-[26px] font-bold leading-[1.05] tracking-[-0.035em] text-foreground md:text-[clamp(24px,2.6vw,32px)]">
                  {t(`offers.items.${key}.label`)}
                  <span className="block text-muted-foreground">
                    {t(`offers.items.${key}.title`)}
                  </span>
                </h3>
                <p className={PROSE}>{t(`offers.items.${key}.desc`)}</p>
                {key === "operate" ? (
                  <Link href={splitPath(AGENTS_PRODUCTION_PATHS, locale)} className={`${TEXT_LINK} mt-5`}>
                    {t("offers.items.operate.link")}
                    <span aria-hidden="true">→</span>
                  </Link>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        {/* 3 — Who it is for: the signals, and the sectors already shipped. */}
        <section className={`${SECTION} border-t border-border py-14 md:py-20`}>
          <h2 className={H2}>{t("audience.title")}</h2>
          <p className={`${PROSE} mt-5 max-w-[680px]`}>{t("audience.intro")}</p>

          <div className="mt-10 grid grid-cols-1 gap-10 md:mt-14 md:grid-cols-2 md:gap-12">
            <div>
              <span className={MONO}>{t("audience.signalsLabel")}</span>
              <ul className="m-0 mt-4 flex list-none flex-col border-t-2 border-foreground p-0">
                {t.raw("audience.signals").map((signal: string) => (
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
            <div>
              <span className={MONO}>{t("audience.sectorsLabel")}</span>
              <ul className="m-0 mt-4 flex list-none flex-col border-t-2 border-foreground p-0">
                {cases.map((customer) => (
                  <li key={customer.slug} className="border-b border-border">
                    <Link
                      href={`/case-studies/${customer.slug}`}
                      className="group flex items-baseline justify-between gap-4 py-4 text-foreground"
                    >
                      <span className="text-[17px] leading-[1.45]">
                        {t(`audience.sectors.${customer.slug}`)}
                      </span>
                      <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] underline decoration-1 underline-offset-4 group-hover:text-muted-foreground">
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

        {/* 4 — How it goes, on the same ink slab as the About page. */}
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
            <p className="m-0 mt-5 max-w-[680px] text-[15px] leading-[1.6] text-white/70 md:text-base">
              {t("method.intro")}
            </p>

            <span className="mt-12 block border-b border-white/15 pb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-white/55 md:mt-16">
              {t("method.stepsLabel")}
            </span>
            <ol className="m-0 flex list-none flex-col p-0">
              {AGENCY_PARIS_STEPS.map((step) => (
                <li
                  key={step.n}
                  className="grid grid-cols-1 gap-4 border-b border-white/15 py-7 md:grid-cols-[200px_1fr] md:gap-12 md:py-8"
                >
                  <div className="flex flex-row items-baseline gap-4 md:flex-col md:items-start md:gap-3">
                    <span className="text-4xl font-bold leading-none tracking-[-0.05em] text-background md:text-[56px]">
                      {step.n}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-orange-400">
                      {t(`method.steps.${step.key}.label`)}
                    </span>
                  </div>
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
              location="cta_agency_paris_method"
              namespace="agencyParis"
              inverse
            />
          </div>
        </section>

        {/* 5 — Proof: published cases only, each with a figure it can back. */}
        <section className={`${SECTION} py-14 md:py-20`}>
          <h2 className={H2}>{t("proof.title")}</h2>
          <p className={`${PROSE} mt-5 max-w-[680px]`}>{t("proof.intro")}</p>

          {featured ? (
            <article
              className={`mt-10 grid grid-cols-1 border border-foreground bg-background md:mt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] ${CARD_HOVER}`}
            >
              <div className="flex flex-col border-b border-foreground p-7 md:p-9 lg:border-b-0 lg:border-r">
                <CaseHeader
                  logo={featured.logo}
                  client={featured.client}
                  sector={t(`proof.cases.${featured.slug}.sector`)}
                />
                <div className="mt-8 text-[56px] font-bold leading-none tracking-[-0.05em] text-foreground md:text-[80px]">
                  {t(`proof.cases.${featured.slug}.figure`)}
                </div>
                <div className="mt-3 text-sm leading-[1.5] text-muted-foreground">
                  {t(`proof.cases.${featured.slug}.figureLabel`)}
                </div>
                {featured.quote ? (
                  <figure className="m-0 mt-8 border-l-2 border-foreground pl-5 lg:mt-auto lg:pt-8">
                    <blockquote className="m-0 text-[15px] leading-[1.6] text-foreground">
                      {locale === "fr" ? `« ${featured.quote.text} »` : `“${featured.quote.text}”`}
                    </blockquote>
                    <figcaption className={`mt-3 ${MONO}`}>{featured.quote.author}</figcaption>
                  </figure>
                ) : null}
              </div>
              <div className="flex flex-col p-7 md:p-9">
                <CasePoints points={t.raw(`proof.cases.${featured.slug}.points`)} />
                <CaseLink slug={featured.slug} label={t("proof.readCase", { name: featured.client })} />
              </div>
            </article>
          ) : null}

          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            {others.map((customer) => (
              <article
                key={customer.slug}
                className={`flex flex-col border border-foreground bg-background p-7 md:p-8 ${CARD_HOVER}`}
              >
                <CaseHeader
                  logo={customer.logo}
                  client={customer.client}
                  sector={t(`proof.cases.${customer.slug}.sector`)}
                />
                <div className="mt-7 text-[40px] font-bold leading-none tracking-[-0.04em] text-foreground md:text-[52px]">
                  {t(`proof.cases.${customer.slug}.figure`)}
                </div>
                <div className="mt-3 text-sm leading-[1.5] text-muted-foreground">
                  {t(`proof.cases.${customer.slug}.figureLabel`)}
                </div>
                <div className="mt-6 flex flex-1 flex-col">
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
        <section className={`${SECTION} border-t border-border py-14 md:py-20`}>
          <h2 className={H2}>{t("security.title")}</h2>
          <p className={`${PROSE} mt-5 max-w-[680px]`}>{t("security.intro")}</p>

          <div className="mt-10 border-t-2 border-foreground md:mt-14">
            {AGENCY_PARIS_SECURITY_KEYS.map((key, i) => (
              <article
                key={key}
                className="grid grid-cols-1 gap-3 border-b border-border py-7 md:grid-cols-[80px_minmax(0,420px)_1fr] md:gap-12 md:py-8"
              >
                <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="m-0 text-[20px] font-bold leading-[1.15] tracking-[-0.03em] text-foreground md:text-[24px]">
                  {t(`security.items.${key}.title`)}
                </h3>
                <p className={`${PROSE} max-w-[70ch]`}>{t(`security.items.${key}.desc`)}</p>
              </article>
            ))}
          </div>

          <div className="mt-10">
            <span className={MONO}>{t("security.readLabel")}</span>
            <ul className="m-0 mt-4 flex list-none flex-col gap-3 p-0">
              {articles.map((article) => (
                <li key={article.key}>
                  <Link
                    href={article.path}
                    className="inline-flex items-baseline gap-2 text-[17px] leading-[1.45] text-foreground underline decoration-1 underline-offset-4 hover:text-muted-foreground"
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
        <section className={`${SECTION} border-t border-border py-14 md:py-20`}>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:gap-16">
            <h2 className={H2}>{t("team.title")}</h2>
            <div>
              <p className="m-0 text-[17px] leading-[1.6] text-foreground md:text-lg">
                {t("team.desc")}
              </p>
              <p className={`${PROSE} mt-4`}>{t("team.notToConfuse")}</p>
              <div className="mt-6 flex flex-col items-start gap-3">
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
        <section className={`${SECTION} border-t border-border py-14 md:py-20`}>
          <h2 className={H2}>{t("faq.title")}</h2>

          <div className="mt-10 border-t-2 border-foreground md:mt-12">
            {AGENCY_PARIS_FAQ_KEYS.map((key) => (
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
          className="h-8 w-auto max-w-[180px] object-contain object-left md:h-9"
          loading="lazy"
          decoding="async"
        />
      </h3>
      <span className="border border-foreground px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground">
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
          className="flex gap-3 border-b border-border py-3 text-[15px] leading-[1.5] text-foreground last:border-b-0"
        >
          <span aria-hidden="true" className="font-mono text-orange-500">
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

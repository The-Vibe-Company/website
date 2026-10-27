import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { TopNav } from "@/components/TopNav";
import { CLIENTS } from "@/components/home/Clients";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Link } from "@/i18n/navigation";
import {
  ABOUT_EDGE_KEYS,
  ABOUT_FACT_KEYS,
  ABOUT_FAQ_KEYS,
  ABOUT_ORIGIN_ARTICLE_LOCALE,
  ABOUT_ORIGIN_ARTICLE_PATH,
  ABOUT_PROCESS_STEPS,
  ABOUT_SERVICE_KEYS,
  ABOUT_SOCIALS,
  ABOUT_TEAM,
  QUIVR_REPO_URL,
} from "@/lib/about";
import { BOOKING_URL, bookingLocation } from "@/lib/booking";
import {
  ABOUT_PATHS,
  AGENCY_PARIS_PATHS,
  localizedSocialMetadata,
  localizedUrl,
  SITE_URL,
  splitPath,
  splitPathAlternates,
} from "@/lib/site";
import { breadcrumbList, faqPageSchema } from "@/lib/structured-data";
import { AboutBackers } from "./AboutBackers";
import { AboutBookingCta } from "./AboutBookingCta";

/**
 * The About page, served at /fr/a-propos and /en/about. Both routes render
 * this component; each declares the other through hreflang.
 *
 * Every number on the page is sourced from work already published on the site
 * (case studies, homepage) or confirmed by the founders — see src/lib/about.ts.
 */

export async function aboutMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "about" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  const path = splitPath(ABOUT_PATHS, locale);

  return {
    // Absolute, not the layout template: the brand is already in the title,
    // and "… (YC W24) | The Vibe Company" would say it twice.
    title: { absolute: title },
    description,
    alternates: splitPathAlternates(locale, ABOUT_PATHS),
    ...localizedSocialMetadata({ locale, path, title, description }),
  };
}

const SECTION = "mx-auto max-w-[100rem] px-6 md:px-12";
const H2 =
  "m-0 font-bold text-foreground text-[clamp(32px,5vw,64px)] leading-[0.95] tracking-[-0.04em]";
const MONO =
  "font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground";
const PROSE = "m-0 text-[15px] leading-[1.6] text-muted-foreground md:text-base";

export async function AboutPage({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "about" });
  const tServices = await getTranslations({ locale, namespace: "services" });
  const tProcess = await getTranslations({ locale, namespace: "process" });
  const tFooter = await getTranslations({ locale, namespace: "footer" });
  const tAgency = await getTranslations({ locale, namespace: "agencyParis" });
  const breadcrumb = breadcrumbList([
    { name: tFooter("home"), url: localizedUrl(locale) },
    { name: tFooter("about"), url: localizedUrl(locale, splitPath(ABOUT_PATHS, locale)) },
  ]);
  const faq = faqPageSchema(
    ABOUT_FAQ_KEYS.map((key) => ({
      question: t(`faq.items.${key}.q`),
      answer: t(`faq.items.${key}.a`),
    })),
  );
  return (
    <div
      data-variant="hybrid"
      className="flex min-h-screen flex-col bg-background text-foreground"
    >
      <JsonLd data={breadcrumb} />
      <JsonLd data={faq} />
      <TopNav />
      <main id="main-content" tabIndex={-1} className="flex-1">
        {/* 1 — The one H1 on the page, the value sentence, and the call. */}
        <section className={`${SECTION} pb-14 pt-12 md:pb-20 md:pt-16`}>
          <span className={`mb-6 block ${MONO}`}>{t("kicker")}</span>
          <h1
            className="m-0 max-w-[22ch] font-bold text-foreground"
            style={{
              fontSize: "clamp(40px, 6vw, 88px)",
              lineHeight: 0.92,
              letterSpacing: "-0.045em",
            }}
          >
            {t("title")}
          </h1>
          <p className="m-0 mt-8 max-w-[680px] border-l-2 border-foreground pl-5 text-lg leading-[1.5] text-foreground md:pl-6 md:text-[19px]">
            {t("lede", { audience: t("audience") })}
          </p>

          <AboutBookingCta />

          {/* The same two backers as the homepage hero. */}
          <AboutBackers label={t("backedBy")} />
        </section>

        {/* 2 — What the company does: the three homepage services. */}
        <section className={`${SECTION} border-t border-border py-14 md:py-20`}>
          <h2 className={H2}>{t("services.title")}</h2>
          <p className={`${PROSE} mt-5 max-w-[680px]`}>{t("services.intro")}</p>

          <div className="mt-10 grid grid-cols-1 gap-5 md:mt-14 md:grid-cols-3">
            {ABOUT_SERVICE_KEYS.map((key, i) => (
              <article
                key={key}
                className="flex flex-col border border-foreground bg-background p-7 transition-[transform,box-shadow] duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_0_var(--foreground)]"
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
                  {tServices(`items.${key}.title`)}
                </h3>
                <p className={PROSE}>{t(`services.items.${key}.desc`)}</p>
              </article>
            ))}
          </div>

          <Link
            href={splitPath(AGENCY_PARIS_PATHS, locale)}
            className="mt-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground underline decoration-1 underline-offset-4 hover:text-muted-foreground"
          >
            {tAgency("aboutLink")}
            <span aria-hidden="true">→</span>
          </Link>
        </section>

        {/* 3 — What sets us apart, each claim carrying a figure we can source. */}
        <section className={`${SECTION} border-t border-border py-14 md:py-20`}>
          <h2 className={H2}>{t("edge.title")}</h2>
          <p className={`${PROSE} mt-5 max-w-[680px]`}>{t("edge.intro")}</p>

          <div className="mt-10 border-t-2 border-foreground md:mt-14">
            {ABOUT_EDGE_KEYS.map((key) => (
              <article
                key={key}
                className="grid grid-cols-1 gap-5 border-b border-border py-8 md:grid-cols-[minmax(0,320px)_1fr] md:gap-12 md:py-10"
              >
                <div>
                  <div className="text-[40px] font-bold leading-none tracking-[-0.04em] text-foreground md:text-[52px]">
                    {t(`edge.items.${key}.figure`)}
                  </div>
                  <div className="mt-3 text-sm leading-[1.5] text-muted-foreground">
                    {t(`edge.items.${key}.figureLabel`)}
                  </div>
                </div>
                <div>
                  <h3 className="m-0 max-w-[32ch] text-[22px] font-bold leading-[1.1] tracking-[-0.03em] text-foreground md:text-[28px]">
                    {t(`edge.items.${key}.title`)}
                  </h3>
                  <p className={`${PROSE} mt-4 max-w-[70ch]`}>
                    {t(`edge.items.${key}.desc`)}
                  </p>
                  {key === "openSource" ? (
                    <a
                      href={QUIVR_REPO_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground underline decoration-1 underline-offset-4 hover:text-muted-foreground"
                    >
                      github.com/The-Vibe-Company/quivr
                      <span aria-hidden="true">↗</span>
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 4 — Who works with us: the homepage logos, with descriptive alts. */}
        <section className={`${SECTION} border-t border-border py-14 md:py-20`}>
          <h2 className={H2}>{t("clients.title")}</h2>
          <p className={`${PROSE} mt-5 max-w-[680px]`}>{t("clients.intro")}</p>

          <ul className="m-0 mt-10 grid list-none grid-cols-2 border-l border-t border-border p-0 md:mt-12 md:grid-cols-3">
            {CLIENTS.map((client) => (
              <li
                key={client.name}
                className="flex items-center justify-center border-b border-r border-border px-6 py-9"
              >
                <a
                  href={client.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center transition-opacity duration-200 hover:opacity-50"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={client.src}
                    alt={t("clients.logoAlt", { name: client.name })}
                    className={`${client.className} w-auto object-contain brightness-0`}
                    loading="lazy"
                    decoding="async"
                  />
                </a>
              </li>
            ))}
          </ul>

          <Link
            href="/case-studies"
            className="mt-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground underline decoration-1 underline-offset-4 hover:text-muted-foreground"
          >
            {t("clients.seeCaseStudies")}
            <span aria-hidden="true">→</span>
          </Link>
        </section>

        {/* 5 — The team, and where the company comes from. */}
        <section className={`${SECTION} border-t border-border py-14 md:py-20`}>
          <h2 className={H2}>{t("team.title")}</h2>
          <p className={`${PROSE} mt-5 max-w-[680px]`}>{t("team.intro")}</p>
          <Link
            href={ABOUT_ORIGIN_ARTICLE_PATH}
            locale={ABOUT_ORIGIN_ARTICLE_LOCALE}
            className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground underline decoration-1 underline-offset-4 hover:text-muted-foreground"
          >
            {t("team.originLink")}
            <span aria-hidden="true">→</span>
          </Link>

          <div className="mt-10 grid grid-cols-1 gap-5 md:mt-14 md:grid-cols-2">
            {ABOUT_TEAM.map((member) => (
              <article
                key={member.key}
                className="flex flex-col border border-foreground bg-background p-7 md:p-8"
              >
                <span className={MONO}>{t("team.role")}</span>
                <h3 className="m-0 mt-3 text-[26px] font-bold leading-[1.05] tracking-[-0.035em] text-foreground md:text-[32px]">
                  {member.name}
                </h3>
                <p className={`${PROSE} mt-4`}>
                  {t(`team.members.${member.key}.bio`)}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-5">
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground underline decoration-1 underline-offset-4 hover:text-muted-foreground"
                  >
                    {t("team.linkedin")}
                    <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 6 — How working together goes, on the same ink slab as the
            homepage process section. */}
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
              {t("how.title")}
            </h2>
            <p className="m-0 mt-5 max-w-[680px] text-[15px] leading-[1.6] text-white/70 md:text-base">
              {t("how.intro")}
            </p>

            <span className="mt-12 block border-b border-white/15 pb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-white/55 md:mt-16">
              {t("how.stepsLabel")}
            </span>
            <ol className="m-0 flex list-none flex-col p-0">
              {ABOUT_PROCESS_STEPS.map((step) => (
                <li
                  key={step.n}
                  className="grid grid-cols-1 gap-4 border-b border-white/15 py-7 md:grid-cols-[200px_1fr] md:gap-12 md:py-8"
                >
                  <div className="flex flex-row items-baseline gap-4 md:flex-col md:items-start md:gap-3">
                    <span className="text-4xl font-bold leading-none tracking-[-0.05em] text-background md:text-[56px]">
                      {step.n}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-orange-400">
                      {tProcess(`steps.${step.key}.label`)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <h3 className="m-0 max-w-[540px] text-[22px] font-bold leading-[1.05] tracking-[-0.03em] text-background md:text-[28px]">
                      {tProcess(`steps.${step.key}.title`)}
                    </h3>
                    <p className="m-0 max-w-[540px] text-[15px] leading-[1.55] text-white/70 md:text-base">
                      {tProcess(`steps.${step.key}.desc`)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-12">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/55">
                {t("how.contactTitle")}
              </span>
              <dl className="m-0 mt-5 grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-12">
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">
                    {t("how.contactCall")}
                  </dt>
                  <dd className="m-0 mt-1">
                    <a
                      href={BOOKING_URL}
                      {...bookingLocation("about_contact")}
                      className="text-[15px] text-background underline decoration-1 underline-offset-4 wrap-anywhere hover:opacity-70"
                    >
                      cal.com/stangirard/thevibecompany
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">
                    {t("how.contactEmail")}
                  </dt>
                  <dd className="m-0 mt-1">
                    <a
                      href="mailto:founders@thevibecompany.co"
                      className="text-[15px] text-background underline decoration-1 underline-offset-4 hover:opacity-70"
                    >
                      founders@thevibecompany.co
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">
                    {t("how.contactResponse")}
                  </dt>
                  <dd className="m-0 mt-1 text-[15px] text-background">
                    {t("response")}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* 7 — Key facts, as a crawlable table. */}
        <section className={`${SECTION} py-14 md:py-20`}>
          <h2 className={H2}>{t("facts.title")}</h2>

          <div className="mt-10 border border-foreground md:mt-12">
            {/* `table-fixed`: on a phone, an auto-layout table refuses to
                shrink below the widest unbreakable word (the site URL), and
                pushes the page sideways. */}
            <table className="w-full table-fixed border-collapse text-left">
              <caption className="sr-only">{t("facts.caption")}</caption>
              <thead>
                <tr className="border-b-2 border-foreground">
                  <th
                    scope="col"
                    className="w-[42%] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground md:w-[38%] md:px-6"
                  >
                    {t("facts.columnFact")}
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground md:px-6"
                  >
                    {t("facts.columnValue")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {ABOUT_FACT_KEYS.map((key) => (
                  <tr key={key} className="border-b border-border last:border-b-0">
                    <th
                      scope="row"
                      className="break-words px-4 py-4 align-top font-mono text-[11px] font-normal uppercase tracking-[0.1em] text-muted-foreground md:px-6 md:tracking-[0.14em]"
                    >
                      {t(`facts.rows.${key}`)}
                    </th>
                    <td className="break-words px-4 py-4 align-top text-[15px] leading-[1.5] text-foreground md:px-6">
                      {key === "founders" ? (
                        <span className="inline-flex flex-wrap gap-x-2 gap-y-1">
                          {ABOUT_TEAM.map((member, i) => (
                            <span key={member.key}>
                              <a
                                href={member.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline decoration-1 underline-offset-4 hover:text-muted-foreground"
                              >
                                {member.name}
                              </a>
                              {i < ABOUT_TEAM.length - 1 ? "," : null}
                            </span>
                          ))}
                        </span>
                      ) : key === "site" ? (
                        <a
                          href={localizedUrl(locale)}
                          className="underline decoration-1 underline-offset-4 hover:text-muted-foreground"
                        >
                          {SITE_URL}
                        </a>
                      ) : key === "networks" ? (
                        <span className="inline-flex flex-wrap gap-x-4 gap-y-1">
                          {ABOUT_SOCIALS.map((social) => (
                            <a
                              key={social.label}
                              href={social.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline decoration-1 underline-offset-4 hover:text-muted-foreground"
                            >
                              {social.label}
                            </a>
                          ))}
                        </span>
                      ) : (
                        t(`facts.values.${key}`)
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 8 — Frequently asked questions, mirrored word for word in the
            FAQPage JSON-LD above (minus the answers that name a client). */}
        <section className={`${SECTION} border-t border-border py-14 md:py-20`}>
          <h2 className={H2}>{t("faq.title")}</h2>

          <div className="mt-10 border-t-2 border-foreground md:mt-12">
            {ABOUT_FAQ_KEYS.map((key) => (
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

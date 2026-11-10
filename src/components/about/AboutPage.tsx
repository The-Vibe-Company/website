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
import { clientLogoSize } from "@/lib/client-logos";
import { BrandSquare } from "@/components/BrandSquare";

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

const SECTION = "mx-auto max-w-[90rem] px-6 md:px-10 lg:px-16";
const BAND = `${SECTION} py-20 md:py-28 lg:py-32`;
const H2 =
  "m-0 font-bold text-foreground text-[clamp(2.5rem,5.6vw,5.25rem)] leading-[0.92] tracking-[-0.045em]";
const MONO =
  "font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground";
const PROSE = "m-0 text-[15px] leading-[1.6] text-muted-foreground md:text-base";
const LINK =
  "inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground underline decoration-1 underline-offset-4 transition-colors hover:text-brand";
/** The short orange bar a lamp card hangs from, with its glow. */
const LAMP =
  "absolute left-1/2 top-0 h-1.5 w-16 -translate-x-1/2 bg-brand shadow-[0_0_40px_12px_rgba(242,115,19,0.45)]";

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
        {/* 1 — On the ink, like the homepage: the one H1, the value
            sentence and the call, in the hero's orange light. */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-72 -right-48 h-[900px] w-[1100px]"
            style={{
              background:
                "radial-gradient(closest-side, rgb(242 115 19 / 0.2), rgb(242 115 19 / 0.06) 55%, transparent)",
            }}
          />
          <div className={`relative ${SECTION} pb-20 pt-12 md:pb-28 lg:pt-[80px]`}>
            <span className="block font-mono text-[12px] uppercase tracking-[0.2em] text-soft-foreground">
              <BrandSquare />
              {t("kicker")}
            </span>
            <h1 className="m-0 mt-8 max-w-[16ch] text-[clamp(3rem,8vw,8.5rem)] font-bold leading-[0.9] tracking-[-0.05em] text-foreground lg:mt-10">
              {t("title")}
            </h1>
            <p className="m-0 mt-10 max-w-[680px] border-l border-border-strong pl-5 text-lg leading-[1.5] text-foreground md:pl-6 md:text-[19px]">
              {t("lede", { audience: t("audience") })}
            </p>

            <AboutBookingCta />

            {/* The same two backers as the homepage hero. */}
            <AboutBackers label={t("backedBy")} />
          </div>
        </section>

        <div data-surface="paper">
          {/* 2 — What the company does: the three homepage services, each
              under its lamp. */}
          <section className={BAND}>
            <h2 className={H2}>{t("services.title")}</h2>
            <p className={`${PROSE} mt-6 max-w-[680px]`}>{t("services.intro")}</p>

            <div className="mt-12 grid grid-cols-1 gap-4 md:mt-16 md:grid-cols-3">
              {ABOUT_SERVICE_KEYS.map((key, i) => (
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
                    {tServices(`items.${key}.title`)}
                  </h3>
                  <p className={`relative ${PROSE} text-soft-foreground`}>{t(`services.items.${key}.desc`)}</p>
                </article>
              ))}
            </div>

            <Link href={splitPath(AGENCY_PARIS_PATHS, locale)} className={`mt-10 ${LINK}`}>
              {tAgency("aboutLink")}
              <span aria-hidden="true">→</span>
            </Link>
          </section>

          {/* 3 — What sets us apart, each claim carrying a figure we can
              source, the figure lit like the homepage's. */}
          <section className={`${BAND} border-t border-border`}>
            <h2 className={H2}>{t("edge.title")}</h2>
            <p className={`${PROSE} mt-6 max-w-[680px]`}>{t("edge.intro")}</p>

            <div className="mt-12 md:mt-16">
              {ABOUT_EDGE_KEYS.map((key) => (
                <article
                  key={key}
                  className="grid grid-cols-1 gap-5 py-9 md:grid-cols-[minmax(0,380px)_1fr] md:gap-12 md:py-12"
                >
                  <div>
                    <div className="text-lit text-[clamp(2.75rem,5vw,4.5rem)] font-bold leading-[0.95] tracking-[-0.05em]">
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
                        className={`mt-4 ${LINK}`}
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

          {/* 4 — Who works with us: the homepage logos, in the band's ink,
              with descriptive alts. */}
          <section className={`${BAND} border-t border-border`}>
            <h2 className={H2}>{t("clients.title")}</h2>
            <p className={`${PROSE} mt-6 max-w-[680px]`}>{t("clients.intro")}</p>

            <ul className="m-0 mt-12 grid list-none grid-cols-2 border-l border-t border-border p-0 md:mt-16 md:grid-cols-3">
              {CLIENTS.map((client) => (
                <li
                  key={client.name}
                  className="flex items-center justify-center border-b border-r border-border bg-card px-6 py-10"
                >
                  <a
                    href={client.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center opacity-80 transition-opacity duration-200 hover:opacity-100"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={client.src}
                      alt={t("clients.logoAlt", { name: client.name })}
                      {...clientLogoSize(client.src)}
                      className={`${client.className} logo-tone w-auto object-contain`}
                      loading="lazy"
                      decoding="async"
                    />
                  </a>
                </li>
              ))}
            </ul>

            <Link href="/case-studies" className={`mt-10 ${LINK}`}>
              {t("clients.seeCaseStudies")}
              <span aria-hidden="true">→</span>
            </Link>
          </section>

          {/* 5 — The team, and where the company comes from. */}
          <section className={`${BAND} border-t border-border`}>
            <h2 className={H2}>{t("team.title")}</h2>
            <p className={`${PROSE} mt-6 max-w-[680px]`}>{t("team.intro")}</p>
            <Link
              href={ABOUT_ORIGIN_ARTICLE_PATH}
              locale={ABOUT_ORIGIN_ARTICLE_LOCALE}
              className={`mt-5 ${LINK}`}
            >
              {t("team.originLink")}
              <span aria-hidden="true">→</span>
            </Link>

            <div className="mt-12 grid grid-cols-1 gap-4 md:mt-16 md:grid-cols-2">
              {ABOUT_TEAM.map((member) => (
                <article
                  key={member.key}
                  className="flex flex-col border border-border bg-card p-7 transition-colors duration-300 hover:border-border-strong md:p-9"
                >
                  <span className={MONO}>
                    <BrandSquare />
                    {t("team.role")}
                  </span>
                  <h3 className="m-0 mt-4 text-[clamp(1.75rem,2.6vw,2.4rem)] font-bold leading-[1.05] tracking-[-0.035em] text-foreground">
                    {member.name}
                  </h3>
                  <p className={`${PROSE} mt-4 text-soft-foreground`}>
                    {t(`team.members.${member.key}.bio`)}
                  </p>
                  <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-5">
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={LINK}
                    >
                      {t("team.linkedin")}
                      <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        {/* 6 — How working together goes: an ink band in the orange light,
            like the homepage's client quote. */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(55% 70% at 12% 100%, rgb(242 115 19 / 0.18), rgb(242 115 19 / 0.05) 55%, transparent 80%)",
            }}
          />
          <div className={`relative ${BAND}`}>
            <h2 className={H2}>{t("how.title")}</h2>
            <p className={`${PROSE} mt-6 max-w-[680px]`}>{t("how.intro")}</p>

            <span className={`mt-14 block border-b border-border pb-4 md:mt-16 ${MONO}`}>
              {t("how.stepsLabel")}
            </span>
            <ol className="m-0 flex list-none flex-col p-0">
              {ABOUT_PROCESS_STEPS.map((step) => (
                <li
                  key={step.n}
                  className="grid grid-cols-1 gap-4 py-8 md:grid-cols-[220px_1fr] md:gap-12 md:py-10"
                >
                  <div className="flex flex-row items-baseline gap-4 md:flex-col md:items-start md:gap-3">
                    <span className="text-lit text-5xl font-bold leading-none tracking-[-0.05em] md:text-[72px]">
                      {step.n}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand">
                      {tProcess(`steps.${step.key}.label`)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <h3 className="m-0 max-w-[560px] text-[22px] font-bold leading-[1.05] tracking-[-0.03em] text-foreground md:text-[30px]">
                      {tProcess(`steps.${step.key}.title`)}
                    </h3>
                    <p className={`${PROSE} max-w-[560px]`}>
                      {tProcess(`steps.${step.key}.desc`)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-14">
              <span className={MONO}>{t("how.contactTitle")}</span>
              <dl className="m-0 mt-5 grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-12">
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {t("how.contactCall")}
                  </dt>
                  <dd className="m-0 mt-1">
                    <a
                      href={BOOKING_URL}
                      {...bookingLocation("about_contact")}
                      className="text-[15px] text-foreground underline decoration-1 underline-offset-4 wrap-anywhere transition-colors hover:text-brand"
                    >
                      cal.com/stangirard/thevibecompany
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {t("how.contactEmail")}
                  </dt>
                  <dd className="m-0 mt-1">
                    <a
                      href="mailto:founders@thevibecompany.co"
                      className="text-[15px] text-foreground underline decoration-1 underline-offset-4 transition-colors hover:text-brand"
                    >
                      founders@thevibecompany.co
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {t("how.contactResponse")}
                  </dt>
                  <dd className="m-0 mt-1 text-[15px] text-foreground">
                    {t("response")}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <div data-surface="paper">
          {/* 7 — Key facts, as a crawlable table. */}
          <section className={BAND}>
            <h2 className={H2}>{t("facts.title")}</h2>

            <div className="mt-12 border border-border bg-card md:mt-16">
              {/* `table-fixed`: on a phone, an auto-layout table refuses to
                  shrink below the widest unbreakable word (the site URL), and
                  pushes the page sideways. */}
              <table className="w-full table-fixed border-collapse text-left">
                <caption className="sr-only">{t("facts.caption")}</caption>
                <thead>
                  <tr className="border-b border-border">
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
                                  className="underline decoration-1 underline-offset-4 hover:text-brand"
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
                            className="underline decoration-1 underline-offset-4 hover:text-brand"
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
                                className="underline decoration-1 underline-offset-4 hover:text-brand"
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
          <section className={`${BAND} border-t border-border`}>
            <h2 className={H2}>{t("faq.title")}</h2>

            <div className="mt-12 md:mt-16">
              {ABOUT_FAQ_KEYS.map((key) => (
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

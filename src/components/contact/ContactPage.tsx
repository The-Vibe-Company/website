import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { TopNav } from "@/components/TopNav";
import { AboutBookingCta } from "@/components/about/AboutBookingCta";
import { MarkedText } from "@/components/privacy/MarkedText";
import { Link } from "@/i18n/navigation";
import { ABOUT_TEAM } from "@/lib/about";
import { CONTACT_EMAIL } from "@/lib/booking";
import {
  ABOUT_PATHS,
  CONTACT_PATHS,
  localizedSocialMetadata,
  localizedUrl,
  PRIVACY_PATHS,
  splitPath,
  splitPathAlternates,
} from "@/lib/site";
import { breadcrumbList } from "@/lib/structured-data";
import { BrandSquare } from "@/components/BrandSquare";

/**
 * The contact page, served at /fr/contact and /en/contact. Server-rendered
 * text only, no reveal animation: who runs the site, how to write, where the
 * company is. One call to action, the cal.com booking slab.
 */

export async function contactMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "contact" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  const path = splitPath(CONTACT_PATHS, locale);

  return {
    // Absolute: the brand is already in the title.
    title: { absolute: title },
    description,
    alternates: splitPathAlternates(locale, CONTACT_PATHS),
    ...localizedSocialMetadata({ locale, path, title, description }),
  };
}

const SECTION = "mx-auto max-w-[90rem] px-6 md:px-10 lg:px-16";
const BAND = `${SECTION} py-20 md:py-28 lg:py-32`;
const H2 =
  "m-0 font-bold text-foreground text-[clamp(2rem,4.2vw,3.75rem)] leading-[0.95] tracking-[-0.045em]";
const MONO =
  "font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground";
const PROSE = "m-0 text-[15px] leading-[1.6] text-muted-foreground md:text-base";
const TEXT_LINK =
  "inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground underline decoration-1 underline-offset-4 transition-colors hover:text-brand";

const DETAIL_KEYS = ["company", "founders", "offices", "headquarters", "email"] as const;

export async function ContactPage({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "contact" });
  const tFooter = await getTranslations({ locale, namespace: "footer" });
  const breadcrumb = breadcrumbList([
    { name: tFooter("home"), url: localizedUrl(locale) },
    { name: t("breadcrumb"), url: localizedUrl(locale, splitPath(CONTACT_PATHS, locale)) },
  ]);

  return (
    <div
      data-variant="hybrid"
      className="flex min-h-screen flex-col bg-background text-foreground"
    >
      <JsonLd data={breadcrumb} />
      <TopNav />
      <main id="main-content" tabIndex={-1} className="flex-1">
        {/* 1 — On the ink, in the hero's orange light: who is behind the
            site, and the one call to action. */}
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
            <h1 className="m-0 mt-8 max-w-[16ch] text-[clamp(2.75rem,7vw,7rem)] font-bold leading-[0.92] tracking-[-0.05em] text-foreground lg:mt-10">
              {t("title")}
            </h1>
            <p className="m-0 mt-10 max-w-[680px] border-l border-border-strong pl-5 text-lg leading-[1.5] text-foreground md:pl-6 md:text-[19px]">
              {t("lede")}
            </p>

            <AboutBookingCta page="contact" location="cta_contact" namespace="contact" />
          </div>
        </section>

        <div data-surface="paper">
          {/* 2 — Writing to us, and the company's details as a crawlable list. */}
          <section className={BAND}>
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
              <div>
                <h2 className={H2}>{t("email.title")}</h2>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="mt-8 inline-block text-[clamp(22px,2.6vw,34px)] font-bold leading-[1.1] tracking-[-0.03em] text-foreground underline decoration-2 underline-offset-[6px] wrap-anywhere transition-colors hover:text-brand"
                >
                  {CONTACT_EMAIL}
                </a>
                <p className={`${PROSE} mt-6 max-w-[56ch]`}>{t("email.body")}</p>
              </div>

              <div>
                <h2 className={H2}>{t("details.title")}</h2>
                <dl
                  aria-label={t("details.caption")}
                  className="m-0 mt-8 border-t border-border"
                >
                  {DETAIL_KEYS.map((key) => (
                    <div
                      key={key}
                      className="grid grid-cols-[minmax(0,140px)_1fr] gap-4 border-b border-border py-4 md:grid-cols-[180px_1fr]"
                    >
                      <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                        {t(`details.rows.${key}`)}
                      </dt>
                      <dd className="m-0 text-[15px] leading-[1.5] text-foreground wrap-anywhere">
                        {key === "email" ? (
                          <MarkedText text={CONTACT_EMAIL} />
                        ) : (
                          <MarkedText text={t(`details.values.${key}`)} />
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </section>

          {/* 3 — The two founders, who answer. */}
          <section className={`${BAND} border-t border-border`}>
            <h2 className={H2}>{t("team.title")}</h2>
            <div className="mt-12 grid grid-cols-1 gap-4 md:mt-14 md:grid-cols-2">
              {ABOUT_TEAM.map((member) => (
                <article
                  key={member.key}
                  className="flex flex-col border border-border bg-card p-7 md:p-9"
                >
                  <span className={MONO}>
                    <BrandSquare />
                    {t("team.role")}
                  </span>
                  <h3 className="m-0 mt-4 text-[clamp(1.75rem,2.6vw,2.4rem)] font-bold leading-[1.05] tracking-[-0.035em] text-foreground">
                    {member.name}
                  </h3>
                  <p className={`${PROSE} mb-6 mt-4 text-soft-foreground`}>
                    {t(`team.members.${member.key}`)}
                  </p>
                  <div className="mt-auto border-t border-border pt-5">
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={TEXT_LINK}
                    >
                      LinkedIn
                      <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* 4 — What the company does, and where the data goes. */}
          <section className={`${BAND} border-t border-border`}>
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
              <div>
                <h2 className={H2}>{t("what.title")}</h2>
                <p className={`${PROSE} mt-5 max-w-[56ch]`}>{t("what.body")}</p>
                <Link href={splitPath(ABOUT_PATHS, locale)} className={`mt-6 ${TEXT_LINK}`}>
                  {t("what.link")}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
              <div>
                <h2 className={H2}>{t("data.title")}</h2>
                <p className={`${PROSE} mt-5 max-w-[56ch]`}>{t("data.body")}</p>
                <Link href={splitPath(PRIVACY_PATHS, locale)} className={`mt-6 ${TEXT_LINK}`}>
                  {t("data.link")}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

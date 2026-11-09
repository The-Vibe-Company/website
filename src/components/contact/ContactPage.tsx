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
const H2 =
  "m-0 font-bold text-foreground text-[clamp(28px,4vw,48px)] leading-[0.95] tracking-[-0.04em]";
const MONO =
  "font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground";
const PROSE = "m-0 text-[15px] leading-[1.6] text-muted-foreground md:text-base";
const TEXT_LINK =
  "inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground underline decoration-1 underline-offset-4 hover:text-muted-foreground";

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
        {/* 1 — Who is behind the site, and the one call to action. */}
        <section className={`${SECTION} pb-14 pt-12 md:pb-20 md:pt-16`}>
          <span className={`mb-6 block ${MONO}`}><BrandSquare />{t("kicker")}</span>
          <h1
            className="m-0 max-w-[18ch] font-bold text-foreground"
            style={{
              fontSize: "clamp(40px, 6vw, 88px)",
              lineHeight: 0.92,
              letterSpacing: "-0.045em",
            }}
          >
            {t("title")}
          </h1>
          <p className="m-0 mt-8 max-w-[680px] border-l border-border-strong pl-5 text-lg leading-[1.5] text-foreground md:pl-6 md:text-[19px]">
            {t("lede")}
          </p>

          <AboutBookingCta page="contact" location="cta_contact" namespace="contact" />
        </section>

        {/* 2 — Writing to us, and the company's details as a crawlable list. */}
        <section className={`${SECTION} border-t border-border py-14 md:py-20`}>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
            <div>
              <h2 className={H2}>{t("email.title")}</h2>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-6 inline-block text-[clamp(22px,2.6vw,34px)] font-bold leading-[1.1] tracking-[-0.03em] text-foreground underline decoration-2 underline-offset-[6px] wrap-anywhere hover:text-muted-foreground"
              >
                {CONTACT_EMAIL}
              </a>
              <p className={`${PROSE} mt-6 max-w-[56ch]`}>{t("email.body")}</p>
            </div>

            <div>
              <h2 className={H2}>{t("details.title")}</h2>
              <dl
                aria-label={t("details.caption")}
                className="m-0 mt-6 border-t border-border"
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
        <section className={`${SECTION} border-t border-border py-14 md:py-20`}>
          <h2 className={H2}>{t("team.title")}</h2>
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
            {ABOUT_TEAM.map((member) => (
              <article
                key={member.key}
                className="flex flex-col border border-border bg-background p-7 md:p-8"
              >
                <span className={MONO}>{t("team.role")}</span>
                <h3 className="m-0 mt-3 text-[26px] font-bold leading-[1.05] tracking-[-0.035em] text-foreground md:text-[32px]">
                  {member.name}
                </h3>
                <p className={`${PROSE} mt-4`}>{t(`team.members.${member.key}`)}</p>
                <div className="mt-6 border-t border-border pt-5">
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
        <section className={`${SECTION} border-t border-border py-14 md:py-20`}>
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
      </main>
      <Footer />
    </div>
  );
}

import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import { FinalCTA } from "@/components/home/FinalCTA";
import { JsonLd } from "@/components/JsonLd";
import { getCustomers, type ContentLocale } from "@/lib/customers";
import { localizedAlternates, localizedSocialMetadata, localizedUrl } from "@/lib/site";
import { breadcrumbList, webPageNode } from "@/lib/structured-data";
import { clientLogoSize } from "@/lib/client-logos";
import { BrandSquare } from "@/components/BrandSquare";
import { FitText } from "@/components/home/FitText";

const SECTION = "mx-auto max-w-[90rem] px-6 md:px-10 lg:px-16";
const BAND = `${SECTION} py-20 md:py-28 lg:py-32`;
const H2 =
  "m-0 font-bold text-foreground text-[clamp(2.25rem,4.6vw,4.25rem)] leading-[0.95] tracking-[-0.045em]";
const MONO =
  "block font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground";
/** The short orange bar a lamp card hangs from, with its glow. */
const LAMP =
  "absolute left-1/2 top-0 h-1.5 w-16 -translate-x-1/2 bg-brand shadow-[0_0_40px_12px_rgba(242,115,19,0.45)]";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "caseStudiesPage" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  return {
    title,
    description,
    alternates: localizedAlternates(locale, "/case-studies"),
    ...localizedSocialMetadata({
      locale,
      path: "/case-studies",
      title,
      description,
    }),
  };
}

export default async function CaseStudiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "caseStudiesPage" });
  const customers = getCustomers(locale as ContentLocale);
  const tFooter = await getTranslations({ locale, namespace: "footer" });
  const tNav = await getTranslations({ locale, namespace: "nav" });

  const pageUrl = localizedUrl(locale, "/case-studies");
  const jsonLd = [
    webPageNode({
      url: pageUrl,
      name: t("back"),
      description: t("metaDescription"),
      language: locale,
    }),
    breadcrumbList([
      { name: tFooter("home"), url: localizedUrl(locale) },
      { name: tNav("caseStudies"), url: pageUrl },
    ]),
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
        {/* 1 — On the ink, like the About page: the one H1 in the hero's
            orange light, its second line lit. */}
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
            <h1 className="m-0 mt-8 max-w-[18ch] text-[clamp(2.75rem,7vw,7rem)] font-bold leading-[0.92] tracking-[-0.05em] text-foreground lg:mt-10">
              {t("titleLine1")}
              <br />
              <span className="text-lit">{t("titleLine2")}</span>
            </h1>
            <p className="m-0 mt-10 max-w-[680px] border-l border-border-strong pl-5 text-lg leading-[1.5] text-foreground md:pl-6 md:text-[19px]">
              {t("subtitle")}
            </p>
          </div>
        </section>

        <div data-surface="paper">
          {/* 2 — The cases, each under its own lamp like the homepage's
              workbench: the client, the figure lit, the story in a line. */}
          <section className={BAND}>
            <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2">
              {customers.map((c, i) => {
                // An odd count opens on one wide bench, so the grid closes
                // without a gap; its figure and its story sit side by side.
                const wide = i === 0 && customers.length % 2 === 1;
                return (
                  <li key={c.slug} className={`flex ${wide ? "md:col-span-2" : ""}`}>
                    <Link
                      href={`/case-studies/${c.slug}?from=case-studies`}
                      className="lamp-card group relative flex w-full flex-col overflow-hidden border border-border p-7 no-underline transition-colors hover:border-border-strong md:p-9"
                    >
                      <span aria-hidden="true" className={LAMP} />
                      <div className="relative flex items-start justify-between gap-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={c.logo}
                          alt={c.client}
                          {...clientLogoSize(c.logo)}
                          className="logo-tone h-7 w-auto object-contain md:h-8"
                          loading="lazy"
                          decoding="async"
                        />
                        <span className="max-w-[14rem] text-right font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-muted-foreground">
                          {c.sector}
                        </span>
                      </div>

                      <div
                        className={`relative mt-auto pt-14 ${wide ? "md:grid md:grid-cols-2 md:items-end md:gap-12 lg:gap-16" : ""}`}
                      >
                        {c.metric ? (
                          <div>
                            {/* One line whatever its length, fitted to the
                                card like the homepage's figures. */}
                            <p className="m-0 font-bold leading-[0.95] [container-type:inline-size]">
                              <FitText max={wide ? 120 : 88} trackingEm={-0.05} className="text-lit">
                                {c.metric}
                              </FitText>
                            </p>
                            <p className="m-0 mt-3 max-w-[28rem] text-[15px] leading-[1.5] text-soft-foreground">
                              {c.metricLabel}
                            </p>
                          </div>
                        ) : null}

                        <div
                          className={`mt-6 border-t border-border pt-6 ${wide ? "md:mt-0 md:border-l md:border-t-0 md:pl-12 md:pt-0 lg:pl-16" : ""}`}
                        >
                          <p className="m-0 max-w-[36rem] text-[15px] leading-[1.55] text-muted-foreground">
                            {c.summary}
                          </p>
                          <span className="mt-7 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground">
                            <span className="underline decoration-1 underline-offset-4 group-hover:text-brand">
                              {t("readCase")}
                            </span>
                            <span aria-hidden="true" className="text-brand">
                              →
                            </span>
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* 3 — How the work goes, read on the paper. */}
          <section className={`${BAND} border-t border-border`}>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] md:gap-16">
              <div>
                <span className={MONO}>
                  <BrandSquare />
                  {t("about.kicker")}
                </span>
                <h2 className={`${H2} mt-6 max-w-[14ch]`}>{t("about.title")}</h2>
              </div>
              <div className="flex max-w-[720px] flex-col gap-6 text-lg leading-[1.6] text-soft-foreground md:pt-10">
                <p className="m-0">{t("about.p1")}</p>
                <p className="m-0">{t("about.p2")}</p>
                <p className="m-0">{t("about.p3")}</p>
              </div>
            </div>
          </section>
        </div>

        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

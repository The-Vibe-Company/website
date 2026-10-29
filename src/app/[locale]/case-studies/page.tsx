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
        <section className="mx-auto max-w-[100rem] px-6 pb-16 pt-12 md:px-12 md:pb-20 md:pt-16">
          <span className="mb-6 block font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {t("kicker")}
          </span>
          <h1
            className="m-0 max-w-[18ch] font-bold text-foreground"
            style={{
              fontSize: "clamp(44px, 6.4vw, 96px)",
              lineHeight: 0.92,
              letterSpacing: "-0.045em",
            }}
          >
            {t("titleLine1")}
            <br />
            <span
              style={{
                WebkitTextStroke: "1.5px var(--foreground)",
                color: "transparent",
              }}
            >
              {t("titleLine2")}
            </span>
          </h1>
          <p className="m-0 mt-8 max-w-[620px] text-lg leading-[1.5] text-muted-foreground">
            {t("subtitle")}
          </p>
        </section>

        <section className="mx-auto max-w-[100rem] px-6 pb-20 md:px-12 md:pb-28">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {customers.map((c) => (
              <Link
                key={c.slug}
                href={`/case-studies/${c.slug}?from=case-studies`}
                className="group flex flex-col border border-foreground bg-background p-7 no-underline transition-all duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_0_var(--foreground)] md:p-8"
              >
                <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.logo}
                    alt={c.client}
                    className="h-7 w-auto object-contain md:h-8"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="max-w-full border border-foreground px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-foreground md:shrink-0">
                    {c.sector}
                  </span>
                </div>

                {c.metric ? (
                  <div className="mt-6 border-t border-border pt-6">
                    <div className="text-[44px] font-bold leading-none tracking-[-0.04em] text-foreground md:text-[52px]">
                      {c.metric}
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      {c.metricLabel}
                    </div>
                  </div>
                ) : (
                  <div aria-hidden="true" className="mt-6 border-t border-border" />
                )}

                <p className="m-0 mt-6 text-[15px] leading-[1.55] text-foreground">
                  {c.summary}
                </p>

                <span className="mt-7 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground">
                  <span className="underline decoration-1 underline-offset-4 group-hover:no-underline">
                    {t("readCase")}
                  </span>
                  <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-t border-border">
          <div className="mx-auto grid max-w-[100rem] grid-cols-1 gap-8 px-6 py-16 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:gap-16 md:px-12 md:py-24">
            <div>
              <span className="mb-6 block font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {t("about.kicker")}
              </span>
              <h2 className="m-0 max-w-[16ch] text-[34px] font-bold leading-[1.02] tracking-[-0.035em] text-foreground md:text-[48px]">
                {t("about.title")}
              </h2>
            </div>
            <div className="flex max-w-[720px] flex-col gap-6 text-lg leading-[1.6] text-foreground">
              <p className="m-0">{t("about.p1")}</p>
              <p className="m-0">{t("about.p2")}</p>
              <p className="m-0">{t("about.p3")}</p>
            </div>
          </div>
        </section>

        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

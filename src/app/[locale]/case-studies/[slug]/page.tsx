import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import { BackLink } from "@/components/BackLink";
import { CaseStudyBackLink } from "@/components/CaseStudyBackLink";
import { FinalCTA } from "@/components/home/FinalCTA";
import { CaseStudyKeepReading } from "@/components/CaseStudyKeepReading";
import { CUSTOMER_SLUGS, getCustomer, getCustomers, type ContentLocale } from "@/lib/customers";
import { localizedAlternates, localizedSocialMetadata } from "@/lib/site";

export function generateStaticParams() {
  return CUSTOMER_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "caseStudiesPage" });
  const customer = getCustomer(slug, locale as ContentLocale);
  if (!customer) return { title: t("back") };
  const title = `${customer.client} · ${t("back")}`;
  const description = customer.summary;
  return {
    title,
    description,
    alternates: localizedAlternates(locale, `/case-studies/${slug}`),
    ...localizedSocialMetadata({
      locale,
      path: `/case-studies/${slug}`,
      title,
      description,
    }),
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "caseStudiesPage" });
  const customer = getCustomer(slug, locale as ContentLocale);
  if (!customer) notFound();

  const asideVisual = customer.visuals.find(
    (visual) => visual.placement === "aside",
  );
  const wideVisuals = customer.visuals.filter(
    (visual) => visual.placement === "wide",
  );

  // The other case studies, starting right after the current one (cyclic) so
  // every page suggests a different "next" case.
  const all = getCustomers(locale as ContentLocale);
  const index = all.findIndex((c) => c.slug === slug);
  const related = [...all.slice(index + 1), ...all.slice(0, index)].slice(0, 3);

  return (
    <div
      data-variant="hybrid"
      className="flex min-h-screen flex-col bg-background text-foreground"
    >
      <TopNav />
      <main id="main-content" tabIndex={-1} className="flex-1">
        <section className="mx-auto max-w-[80rem] px-6 pb-16 pt-10 md:px-12 md:pb-20 md:pt-12">
          <h1 className="sr-only">{customer.client} · {t("back")}</h1>
          <Suspense fallback={<BackLink href="/case-studies" label={t("back")} />}>
            <CaseStudyBackLink />
          </Suspense>

          <div className="mt-10 flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={customer.logo}
              alt={customer.client}
              className="h-9 w-auto object-contain md:h-11"
            />
            <span className="border border-foreground px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-foreground">
              {customer.sector}
            </span>
          </div>

          <div className="mt-10 border-t-2 border-foreground pt-8">
            <div className="text-[56px] font-bold leading-none tracking-[-0.04em] text-foreground md:text-[80px]">
              {customer.metric}
            </div>
            <div className="mt-3 text-lg text-muted-foreground">
              {customer.metricLabel}
            </div>
          </div>

          <div
            className={`mt-10 grid gap-10 ${asideVisual ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)] lg:items-start lg:gap-14" : ""}`}
          >
            <div>
              <p className="m-0 max-w-[720px] text-xl leading-[1.5] text-foreground md:text-2xl">
                {customer.overview}
              </p>

              {customer.quote && (
                <figure className="mt-10 max-w-[760px] border-l-2 border-orange-500 pl-6">
                  <blockquote className="m-0 text-lg font-medium leading-[1.5] text-foreground md:text-xl">
                    &ldquo;{customer.quote.text}&rdquo;
                  </blockquote>
                  <figcaption className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    {customer.quote.author}
                  </figcaption>
                </figure>
              )}
            </div>

            {asideVisual && (
              <div className="mx-auto w-full max-w-[360px] overflow-hidden border border-foreground">
                <Image
                  src={asideVisual.src}
                  alt={asideVisual.alt}
                  width={asideVisual.width}
                  height={asideVisual.height}
                  sizes="(max-width: 407px) calc(100vw - 3rem), 360px"
                  className="h-auto w-full"
                />
              </div>
            )}
          </div>
        </section>

        <section className="border-y border-border bg-background">
          {/* Every stat cell keeps the same width (the 4-up rhythm of the
              80rem container) whatever the count: the strip narrows and stays
              centered instead of stretching, so a study with 2 numbers reads
              like one with 4. Separators are real cell borders (left between
              columns, top between mobile rows) — sturdier than a gap-px
              hairline, which can vanish with browser zoom rounding. */}
          <div
            className={`mx-auto grid grid-cols-2 px-0 ${
              customer.results.length === 1
                ? "max-w-[20rem] md:grid-cols-1"
                : customer.results.length === 2
                  ? "max-w-[40rem] md:grid-cols-2"
                  : customer.results.length === 3
                    ? "max-w-[60rem] md:grid-cols-3"
                    : "max-w-[80rem] md:grid-cols-4"
            }`}
          >
            {customer.results.map((stat, index) => {
              const isLast = index === customer.results.length - 1;
              const fullWidthOnMobile =
                customer.results.length % 2 === 1 && isLast;
              return (
              <div
                key={stat.value}
                className={`flex flex-col gap-1 bg-background p-6 md:p-8 ${
                  fullWidthOnMobile ? "col-span-2 md:col-span-1" : ""
                } ${
                  index === 0
                    ? ""
                    : index % 2 === 1 && !fullWidthOnMobile
                      ? "border-l border-border"
                      : "md:border-l md:border-border"
                } ${index >= 2 ? "border-t border-border md:border-t-0" : ""}`}
              >
                <div className="text-[30px] font-bold leading-none tracking-[-0.03em] text-foreground md:text-[36px]">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm leading-snug text-muted-foreground">
                  {stat.label}
                </div>
              </div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-[80rem] px-6 py-16 md:px-12 md:py-20">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[240px_1fr] md:gap-16">
            <h2 className="m-0 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {t("whatWeDid")}
            </h2>
            <ul className="m-0 flex list-none flex-col gap-5 p-0">
              {customer.points.map((point) => (
                <li
                  key={point}
                  className="flex gap-4 border-b border-border pb-5 text-lg leading-[1.5] text-foreground last:border-b-0"
                >
                  <span aria-hidden="true" className="pt-1 font-mono text-orange-500">
                    →
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {(wideVisuals.length > 0 || customer.url) && (
          <section className="mx-auto max-w-[80rem] px-6 pb-20 md:px-12 md:pb-24">
            {wideVisuals.length > 0 && (
              <>
                <span className="mb-6 block font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {t("theProduct")}
                </span>
                <div className="flex flex-col gap-5">
                  {wideVisuals.map((visual) => (
                    <div key={visual.src} className="overflow-hidden border border-foreground">
                      <Image
                        src={visual.src}
                        alt={visual.alt}
                        width={visual.width}
                        height={visual.height}
                        sizes="(max-width: 767px) calc(100vw - 3rem), (max-width: 1279px) calc(100vw - 6rem), 1184px"
                        className="h-auto w-full"
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            {customer.url && (
              <a
                href={customer.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-3 border-2 border-foreground bg-background px-6 py-4 text-[15px] font-semibold text-foreground transition-all duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_var(--foreground)] ${wideVisuals.length > 0 ? "mt-8" : ""}`}
              >
                {t("visitClient", { name: customer.client })}
                <span aria-hidden="true" className="text-lg">
                  &#8599;
                </span>
              </a>
            )}
          </section>
        )}

        <CaseStudyKeepReading items={related} />

        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

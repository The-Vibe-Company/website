import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import { BackLink } from "@/components/BackLink";
import { CaseStudyBackLink } from "@/components/CaseStudyBackLink";
import { FinalCTA } from "@/components/home/FinalCTA";
import { CUSTOMER_SLUGS, getCustomer, type ContentLocale } from "@/lib/customers";

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
  const t = await getTranslations("caseStudiesPage");
  const customer = getCustomer(slug, locale as ContentLocale);
  if (!customer) return { title: t("back") };
  return {
    title: `${customer.client} · ${t("back")}`,
    description: customer.summary,
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("caseStudiesPage");
  const customer = getCustomer(slug, locale as ContentLocale);
  if (!customer) notFound();

  return (
    <div
      data-variant="hybrid"
      className="flex min-h-screen flex-col bg-background text-foreground"
    >
      <TopNav />
      <main className="flex-1">
        <section className="mx-auto max-w-[80rem] px-6 pb-16 pt-10 md:px-12 md:pb-20 md:pt-12">
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
            className={`mt-10 grid gap-10 ${customer.visuals[0] ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:items-start lg:gap-14" : ""}`}
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

            {/* One product visual beside the text (the first screenshot in
                customer.visuals). Nothing is rendered when there is no visual. */}
            {customer.visuals[0] && (
              <div className="flex flex-col gap-4">
                <div className="overflow-hidden border border-foreground">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={customer.visuals[0].src}
                    alt={customer.visuals[0].alt}
                    className="h-auto w-full"
                    loading="lazy"
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="border-y border-border bg-background">
          {/* Columns follow the stat count so a study with fewer numbers than
              Monka never shows empty gray cells (the gap-px bg-border trick
              paints every cell-less area). */}
          <div
            className={`mx-auto grid max-w-[80rem] grid-cols-2 gap-px bg-border px-0 ${
              customer.results.length === 1
                ? "md:grid-cols-1"
                : customer.results.length === 2
                  ? "md:grid-cols-2"
                  : customer.results.length === 3
                    ? "md:grid-cols-3"
                    : "md:grid-cols-4"
            }`}
          >
            {customer.results.map((stat, index) => (
              <div
                key={stat.value}
                className={`flex flex-col gap-1 bg-background p-6 md:p-8 ${
                  customer.results.length % 2 === 1 &&
                  index === customer.results.length - 1
                    ? "col-span-2 md:col-span-1"
                    : ""
                }`}
              >
                <div className="text-[30px] font-bold leading-none tracking-[-0.03em] text-foreground md:text-[36px]">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm leading-snug text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
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

        {(customer.visuals.length > 1 || customer.url) && (
          <section className="mx-auto max-w-[80rem] px-6 pb-20 md:px-12 md:pb-24">
            {customer.visuals.length > 1 && (
              <>
                <span className="mb-6 block font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {t("theProduct")}
                </span>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {customer.visuals.slice(1).map((visual) => (
                    <div key={visual.src} className="overflow-hidden border border-foreground">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={visual.src} alt={visual.alt} className="h-auto w-full" loading="lazy" />
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
                className={`inline-flex items-center gap-3 border-2 border-foreground bg-background px-6 py-4 text-[15px] font-semibold text-foreground transition-all duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_var(--foreground)] ${customer.visuals.length > 1 ? "mt-8" : ""}`}
              >
                {t("visit")} {customer.client}
                <span aria-hidden="true" className="text-lg">
                  &#8599;
                </span>
              </a>
            )}
          </section>
        )}

        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

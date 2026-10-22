import type { Metadata } from "next";
import Image from "next/image";
import { Suspense, type ReactNode } from "react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import { BackLink } from "@/components/BackLink";
import { CaseStudyBackLink } from "@/components/CaseStudyBackLink";
import { FinalCTA } from "@/components/home/FinalCTA";
import { CaseStudyKeepReading } from "@/components/CaseStudyKeepReading";
import { Arrow, ButtonLink, Groove, Kicker, Piece } from "@/components/kit";
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

/** A picture set into the clay like a glazed insert (white glaze, hairline ring). */
function Glaze({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-white after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:shadow-[inset_0_0_0_1px_rgba(11,11,12,0.1),inset_0_1px_0_rgba(255,255,255,0.5)] after:content-[''] ${className}`}
    >
      {children}
    </div>
  );
}

/** What was done: an open list, the black arrow badge in front of each line. */
function PointList({ points }: { points: string[] }) {
  return (
    <ul className="rows m-0 list-none p-0">
      {points.map((point) => (
        <li
          key={point}
          className="grid grid-cols-[30px_minmax(0,1fr)] items-start gap-4 py-6 first:pt-0 last:pb-0 md:grid-cols-[34px_minmax(0,1fr)] md:gap-[22px] md:py-7"
        >
          <span className="num mt-0.5" aria-hidden="true">
            <Arrow className="h-4 w-4" />
          </span>
          <p className="m-0 max-w-[56ch] text-[1.0625rem] leading-[1.5] text-ink md:text-xl">
            {point}
          </p>
        </li>
      ))}
    </ul>
  );
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

  // The headline reads as one sentence: the figure and what it counts, in the
  // kit's two-tone title, never a huge number with a caption under it.
  const headline = customer.metric ?? customer.client;

  return (
    <div
      data-variant="hybrid"
      className="flex min-h-screen flex-col bg-background text-foreground"
    >
      <TopNav />
      <main id="main-content" tabIndex={-1} className="flex-1">
        {/* THE CASE: client, headline, story, quote, the app */}
        <section className="pt-1 md:pt-3">
          <div className="wrap">
            <Suspense fallback={<BackLink href="/case-studies" label={t("back")} />}>
              <CaseStudyBackLink />
            </Suspense>

            <Piece
              tone="main"
              radius="xl"
              className="rise mt-2 p-5 pb-7 [--rim-angle:118deg] max-md:rounded-[28px] md:px-10 md:pb-12 md:pt-9 lg:px-14 lg:pb-[60px]"
            >
              <div className="flex flex-col items-start gap-4 pb-5 md:flex-row md:items-center md:justify-between md:pb-7">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={customer.logo}
                  alt={customer.client}
                  className="h-10 w-auto max-w-[60%] object-contain md:h-[54px]"
                />
                <span className="chip well h-auto min-h-8 !whitespace-normal py-1.5 leading-snug text-ink max-md:tracking-[0.04em]">
                  {customer.sector}
                </span>
              </div>
              <Groove />

              <div
                className={`mt-8 grid gap-10 md:mt-12 ${
                  asideVisual
                    ? "lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-x-[72px]"
                    : ""
                }`}
              >
                <div className="min-w-0">
                  <h1 className="display m-0 max-w-[16em] text-[clamp(2.125rem,1.1rem+2.4vw,3.375rem)] leading-[1]">
                    <span className="sr-only">
                      {customer.client} · {t("back")}:{" "}
                    </span>
                    {customer.metric ? (
                      <>
                        {customer.metric}
                        {customer.metricLabel ? (
                          <>
                            <br />
                            <span className="bisque">{customer.metricLabel}</span>
                          </>
                        ) : null}
                      </>
                    ) : (
                      headline
                    )}
                  </h1>

                  <p className="lede mt-8 md:mt-10">{customer.overview}</p>

                  {customer.quote && (
                    <figure className="lede-bar m-0 mt-8 md:mt-10">
                      <blockquote className="m-0 font-medium text-ink">
                        &ldquo;{customer.quote.text}&rdquo;
                      </blockquote>
                      <figcaption className="mt-4 font-mono text-xs font-medium uppercase leading-snug tracking-[0.1em] text-muted-foreground">
                        {customer.quote.author}
                      </figcaption>
                    </figure>
                  )}
                </div>

                {asideVisual && (
                  <Glaze className="mx-auto w-full max-w-[360px] rounded-[22px] lg:mx-0">
                    <Image
                      src={asideVisual.src}
                      alt={asideVisual.alt}
                      width={asideVisual.width}
                      height={asideVisual.height}
                      sizes="(max-width: 767px) calc(100vw - 4.5rem), 360px"
                      className="h-auto w-full"
                      priority
                    />
                  </Glaze>
                )}
              </div>
            </Piece>
          </div>
        </section>

        {/* RESULTS: the figures, quiet, on the page's own left edge */}
        {customer.results.length > 0 && (
          <section className="section-tight" aria-label={customer.client}>
            <div className="wrap">
              <Groove />
              <ul
                className={`m-0 mt-0 grid list-none grid-cols-2 gap-y-2 p-0 ${
                  customer.results.length === 1
                    ? "md:grid-cols-1"
                    : customer.results.length === 2
                      ? "md:grid-cols-2"
                      : customer.results.length === 3
                        ? "md:grid-cols-3"
                        : "md:grid-cols-4"
                }`}
              >
                {customer.results.map((stat, i) => {
                  const lastOdd =
                    customer.results.length % 2 === 1 && i === customer.results.length - 1;
                  return (
                    <li
                      key={stat.value + stat.label}
                      className={`flex min-w-0 flex-col gap-3 py-6 md:py-8 ${
                        lastOdd ? "col-span-2 md:col-span-1" : ""
                      } ${i > 0 ? "md:border-l md:border-border md:pl-8" : ""} ${
                        i % 2 === 1 ? "max-md:border-l max-md:border-border max-md:pl-5" : ""
                      }`}
                    >
                      <b className="display text-[clamp(1.75rem,1.2rem+1.4vw,2.5rem)] leading-[1.05]">
                        {stat.value}
                      </b>
                      <span className="max-w-[26ch] text-[0.9375rem] leading-snug text-ink-2">
                        {stat.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <Groove />
            </div>
          </section>
        )}

        {/* WHAT WE DID */}
        {customer.projects ? (
          customer.projects.map((project, i) => (
            <section key={project.name} className={i === 0 ? "section" : "section-tight"}>
              <div className="wrap">
                {i > 0 && <Groove className="mb-12 md:mb-[72px]" />}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-[240px_minmax(0,1fr)] md:gap-x-16">
                  <div>
                    <Kicker as="p" className="self-start">{t("projectLabel", { n: i + 1 })}</Kicker>
                    <h2 className="display d-xs m-0 mt-4 max-w-[14ch]">{project.name}</h2>
                  </div>
                  <div className="min-w-0">
                    <p className="lede mb-8 mt-0">{project.summary}</p>
                    <PointList points={project.points} />
                  </div>
                </div>
                {project.visual && (
                  <Piece tone="quiet" radius="xl" className="mt-12 p-2 md:p-3">
                    <Glaze className="rounded-[24px] max-md:rounded-2xl">
                      <Image
                        src={project.visual.src}
                        alt={project.visual.alt}
                        width={project.visual.width}
                        height={project.visual.height}
                        sizes="(max-width: 767px) calc(100vw - 4rem), (max-width: 1247px) calc(100vw - 7.5rem), 1176px"
                        className="h-auto w-full"
                      />
                    </Glaze>
                  </Piece>
                )}
              </div>
            </section>
          ))
        ) : (
          <section className="section">
            <div className="wrap">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-[240px_minmax(0,1fr)] md:gap-x-16">
                <Kicker as="h2" className="self-start md:pt-2.5">
                  {t("whatWeDid")}
                </Kicker>
                <PointList points={customer.points} />
              </div>
            </div>
          </section>
        )}

        {/* THE PRODUCT */}
        {(wideVisuals.length > 0 || customer.url) && (
          <section className="section">
            <div className="wrap">
              {wideVisuals.length > 0 && (
                <>
                  <Kicker as="h2">{t("theProduct")}</Kicker>
                  <div className="mt-6 flex flex-col gap-4 md:mt-7">
                    {wideVisuals.map((visual) => (
                      <Piece
                        key={visual.src}
                        tone="quiet"
                        radius="xl"
                        className="p-2 md:p-3"
                      >
                        <Glaze className="rounded-[24px] max-md:rounded-2xl">
                          <Image
                            src={visual.src}
                            alt={visual.alt}
                            width={visual.width}
                            height={visual.height}
                            sizes="(max-width: 767px) calc(100vw - 4rem), (max-width: 1247px) calc(100vw - 7.5rem), 1176px"
                            className="h-auto w-full"
                          />
                        </Glaze>
                      </Piece>
                    ))}
                  </div>
                </>
              )}

              {customer.url && (
                <ButtonLink
                  href={customer.url}
                  variant="clay"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`max-sm:w-full ${wideVisuals.length > 0 ? "mt-6 md:mt-8" : ""}`}
                >
                  {t("visitClient", { name: customer.client })}
                  <Arrow direction="up-right" />
                </ButtonLink>
              )}
            </div>
          </section>
        )}

        <CaseStudyKeepReading items={related} />

        <FinalCTA rail="narrow" />
      </main>
      <Footer />
    </div>
  );
}

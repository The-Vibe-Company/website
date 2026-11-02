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
import { Arrow, ButtonLink, Groove, Kicker, Piece } from "@/components/kit";
import { JsonLd } from "@/components/JsonLd";
import { CUSTOMER_SLUGS, getCustomer, getCustomers, type ContentLocale } from "@/lib/customers";
import { Link } from "@/i18n/navigation";
import {
  AGENCY_PARIS_PATHS,
  HEALTHCARE_AI_PATHS,
  MEDIA_AI_PATHS,
  localizedAlternates,
  localizedSocialMetadata,
  localizedUrl,
  splitPath,
} from "@/lib/site";
import { breadcrumbList, webPageNode } from "@/lib/structured-data";

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
  const title = customer.metaTitle ?? `${customer.client} · ${t("back")}`;
  const description = customer.metaDescription;
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

/** A sentence that points out of the case, on the lede bar. */
const CROSS_LINK = "lede-bar m-0 max-w-[680px] text-[15.5px] leading-[1.6] text-muted-foreground md:text-base";
const CROSS_LINK_A =
  "font-semibold text-ink underline decoration-rim decoration-2 underline-offset-4 hover:text-ink-2";

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
  const tAgency = await getTranslations({ locale, namespace: "agencyParis" });
  const tHealthcare = await getTranslations({ locale, namespace: "healthcareAi" });
  const tMedia = await getTranslations({ locale, namespace: "mediaAi" });
  const tFooter = await getTranslations({ locale, namespace: "footer" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const customer = getCustomer(slug, locale as ContentLocale);
  if (!customer) notFound();

  const pageUrl = localizedUrl(locale, `/case-studies/${slug}`);
  const pageName = `${customer.client} · ${t("back")}`;
  const jsonLd = [
    webPageNode({
      url: pageUrl,
      name: pageName,
      description: customer.summary,
      language: locale,
    }),
    breadcrumbList([
      { name: tFooter("home"), url: localizedUrl(locale) },
      { name: tNav("caseStudies"), url: localizedUrl(locale, "/case-studies") },
      { name: customer.client, url: pageUrl },
    ]),
  ];

  const asideVisual = customer.visuals.find(
    (visual) => visual.placement === "aside",
  );
  const wideVisuals = customer.visuals.filter(
    (visual) => visual.placement === "wide",
  );

  // The other case studies, starting right after the current one (cyclic) so
  // every page suggests a different "next" case, in the lists' alphabetical
  // order.
  const all = [...getCustomers(locale as ContentLocale)].sort((a, b) =>
    a.client.localeCompare(b.client, locale, { sensitivity: "base" }),
  );
  const index = all.findIndex((c) => c.slug === slug);
  const related = [...all.slice(index + 1), ...all.slice(0, index)].slice(0, 3);
  const guide = customer.related;

  // The headline reads as one sentence: the figure and what it counts, in the
  // kit's two-tone title, never a huge number with a caption under it.
  const headline = customer.metric ?? customer.client;

  // The story: overview, then the client's quote when there is one.
  const story = (
    <>
      <p className="lede m-0">{customer.overview}</p>

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
    </>
  );

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
        {/* THE CASE: client, headline, story, quote, the app */}
        <section className="pt-1 md:pt-3">
          <div className="wrap">
            <h1 className="sr-only">{pageName}</h1>
            <Suspense fallback={<BackLink href="/case-studies" label={t("back")} />}>
              <CaseStudyBackLink />
            </Suspense>

            <Piece
              tone="main"
              radius="xl"
              className="mt-2 p-5 pb-7 [--rim-angle:118deg] max-md:rounded-[28px] md:px-10 md:pb-12 md:pt-9 lg:px-14 lg:pb-[60px]"
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
                className={`mt-8 grid gap-10 md:mt-12 lg:items-start lg:gap-x-[72px] ${
                  asideVisual ? "lg:grid-cols-[minmax(0,1fr)_360px]" : "lg:grid-cols-2"
                }`}
              >
                <div className="min-w-0">
                  {/* The page's h1 is the client and "Case studies" (above, for
                      screen readers and search); the headline is the figure. */}
                  <p className="display m-0 max-w-[16em] text-[clamp(2.125rem,1.1rem+2.4vw,3.375rem)] leading-[1]">
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
                  </p>
                  {asideVisual && <div className="mt-8 md:mt-10">{story}</div>}
                </div>

                {/* Without a phone visual the story takes the second half of the slab. */}
                {!asideVisual && <div className="min-w-0">{story}</div>}

                {asideVisual && (
                  <div className="glaze mx-auto w-full max-w-[360px] lg:mx-0">
                    <Image
                      src={asideVisual.src}
                      alt={asideVisual.alt}
                      width={asideVisual.width}
                      height={asideVisual.height}
                      sizes="(max-width: 767px) calc(100vw - 4.5rem), 360px"
                      className="h-auto w-full"
                      priority
                    />
                  </div>
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
                    <div className="glaze">
                      <Image
                        src={project.visual.src}
                        alt={project.visual.alt}
                        width={project.visual.width}
                        height={project.visual.height}
                        sizes="(max-width: 767px) calc(100vw - 4rem), (max-width: 1247px) calc(100vw - 7.5rem), 1176px"
                        className="h-auto w-full"
                      />
                    </div>
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
                <div className="min-w-0">
                  {customer.approach && <p className="lede mb-8 mt-0">{customer.approach}</p>}
                  <PointList points={customer.points} />
                </div>
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
                        <div className="glaze">
                          <Image
                            src={visual.src}
                            alt={visual.alt}
                            width={visual.width}
                            height={visual.height}
                            sizes="(max-width: 767px) calc(100vw - 4rem), (max-width: 1247px) calc(100vw - 7.5rem), 1176px"
                            className="h-auto w-full"
                          />
                        </div>
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

        {/* Where to go from this case: the landing for its sector, a guide
            that tells it in more depth, the agency page. */}
        <section className="section-tight">
          <div className="wrap flex flex-col gap-4">
            {slug === "monka" ? (
              <p className={CROSS_LINK}>
                {tHealthcare.rich("caseLink", {
                  link: (chunks) => (
                    <Link href={splitPath(HEALTHCARE_AI_PATHS, locale)} className={CROSS_LINK_A}>
                      {chunks}
                    </Link>
                  ),
                })}
              </p>
            ) : null}
            {slug === "afp" ? (
              <p className={CROSS_LINK}>
                {tMedia.rich("caseLink", {
                  link: (chunks) => (
                    <Link href={splitPath(MEDIA_AI_PATHS, locale)} className={CROSS_LINK_A}>
                      {chunks}
                    </Link>
                  ),
                })}
              </p>
            ) : null}
            {guide ? (
              <p className={CROSS_LINK}>
                {t.rich("relatedArticle", {
                  title: guide.title,
                  link: (chunks) => (
                    <Link href={guide.href} className={CROSS_LINK_A}>
                      {chunks}
                    </Link>
                  ),
                })}
              </p>
            ) : null}
            <p className={CROSS_LINK}>
              {tAgency.rich("caseLink", {
                link: (chunks) => (
                  <Link href={splitPath(AGENCY_PARIS_PATHS, locale)} className={CROSS_LINK_A}>
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          </div>
        </section>

        <FinalCTA rail="narrow" />
      </main>
      <Footer />
    </div>
  );
}

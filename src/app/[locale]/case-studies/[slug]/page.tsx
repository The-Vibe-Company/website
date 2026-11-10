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
import {
  breadcrumbList,
  faqPageSchema,
  isPublishableInCaseStudyFaq,
  webPageNode,
} from "@/lib/structured-data";
import { clientLogoSize } from "@/lib/client-logos";
import { BrandSquare } from "@/components/BrandSquare";

/** The case pages keep their narrower reading rail. */
const SECTION = "mx-auto max-w-[80rem] px-6 md:px-10 lg:px-16";
const BAND = `${SECTION} py-20 md:py-28 lg:py-32`;
const H2 =
  "m-0 font-bold text-foreground text-[clamp(2.25rem,4.6vw,4.25rem)] leading-[0.95] tracking-[-0.045em]";
const MONO =
  "block font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground";
const LEAD = "m-0 max-w-[720px] text-lg leading-[1.5] text-foreground md:text-xl lg:text-[22px]";
const POINTS = "m-0 flex list-none flex-col p-0";
const POINT =
  "flex gap-4 py-5 text-[17px] leading-[1.55] text-soft-foreground md:text-lg";
const ASIDE =
  "m-0 max-w-[680px] border-l border-border-strong pl-5 text-[15px] leading-[1.6] text-muted-foreground md:text-base";
const INLINE_LINK =
  "font-semibold text-foreground underline decoration-1 underline-offset-4 transition-colors hover:text-brand";

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
  const faq = customer.faq?.length
    ? faqPageSchema(customer.faq, isPublishableInCaseStudyFaq)
    : null;
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
    ...(faq ? [faq] : []),
  ];

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
  const guide = customer.related;

  const story = (
    <>
      {customer.projects ? (
        customer.projects.map((project, index) => (
          <section
            key={project.name}
            className={`${BAND} ${index > 0 ? "border-t border-border" : ""}`}
          >
            <span className={MONO}>
              <BrandSquare />
              {t("projectLabel", { n: index + 1 })}
            </span>
            <h2 className={`${H2} mt-6 max-w-[20ch]`}>{project.name}</h2>
            <div className="mt-10 grid grid-cols-1 gap-10 md:mt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16">
              <p className={LEAD}>{project.summary}</p>
              <ul className={POINTS}>
                {project.points.map((point) => (
                  <li key={point} className={POINT}>
                    <span aria-hidden="true" className="pt-1 font-mono text-brand">
                      →
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            {project.visual && (
              <div className="mt-14 overflow-hidden border border-border bg-card">
                <Image
                  src={project.visual.src}
                  alt={project.visual.alt}
                  width={project.visual.width}
                  height={project.visual.height}
                  sizes="(max-width: 767px) calc(100vw - 3rem), (max-width: 1279px) calc(100vw - 6rem), 1184px"
                  className="h-auto w-full"
                />
              </div>
            )}
          </section>
        ))
      ) : (
        <section className={BAND}>
          <h2 className={H2}>
            {t("whatWeDid")}
          </h2>
          <div
            className={`mt-10 grid grid-cols-1 gap-10 md:mt-14 ${customer.approach ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16" : "max-w-[880px]"}`}
          >
            {customer.approach && <p className={LEAD}>{customer.approach}</p>}
            <ul className={POINTS}>
              {customer.points.map((point) => (
                <li key={point} className={POINT}>
                  <span aria-hidden="true" className="pt-1 font-mono text-brand">
                    →
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {(wideVisuals.length > 0 || customer.url) && (
        <section
          className={`${SECTION} pb-20 md:pb-28 lg:pb-32 ${wideVisuals.length > 0 ? "border-t border-border pt-20 md:pt-28 lg:pt-32" : "-mt-6 md:-mt-10 lg:-mt-12"}`}
        >
          {wideVisuals.length > 0 && (
            <>
              <span className={`mb-8 ${MONO}`}>
                <BrandSquare />
                {t("theProduct")}
              </span>
              <div className="flex flex-col gap-5">
                {wideVisuals.map((visual) => (
                  <div key={visual.src} className="overflow-hidden border border-border bg-card">
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
              className={`inline-flex items-center gap-3 rounded-[2px] border border-foreground bg-foreground px-6 py-4 text-[15px] font-semibold text-background transition-colors duration-300 hover:border-soft-foreground hover:bg-soft-foreground md:px-7 ${wideVisuals.length > 0 ? "mt-10" : ""}`}
            >
              {t("visitClient", { name: customer.client })}
              <span aria-hidden="true" className="text-lg leading-none">
                &#8599;
              </span>
            </a>
          )}
        </section>
      )}
    </>
  );

  // `divided`: the reading list opens with a hairline when it follows the
  // story on the same paper band.
  const more = (divided: boolean) => (
    <>
      <CaseStudyKeepReading items={related} divided={divided} />

      <section className={`${SECTION} pb-20 md:pb-28 lg:pb-32`}>
        {/* The healthcare case also points at the healthcare landing. */}
        {slug === "monka" ? (
          <p className={`mb-4 ${ASIDE}`}>
            {tHealthcare.rich("caseLink", {
              link: (chunks) => (
                <Link href={splitPath(HEALTHCARE_AI_PATHS, locale)} className={INLINE_LINK}>
                  {chunks}
                </Link>
              ),
            })}
          </p>
        ) : null}
        {/* The newsroom case also points at the media AI landing. */}
        {slug === "afp" ? (
          <p className={`mb-4 ${ASIDE}`}>
            {tMedia.rich("caseLink", {
              link: (chunks) => (
                <Link href={splitPath(MEDIA_AI_PATHS, locale)} className={INLINE_LINK}>
                  {chunks}
                </Link>
              ),
            })}
          </p>
        ) : null}
        {/* A case told in more depth in a guide points at it. */}
        {guide ? (
          <p className={`mb-4 ${ASIDE}`}>
            {t.rich("relatedArticle", {
              title: guide.title,
              link: (chunks) => (
                <Link href={guide.href} className={INLINE_LINK}>
                  {chunks}
                </Link>
              ),
            })}
          </p>
        ) : null}
        <p className={ASIDE}>
          {tAgency.rich("caseLink", {
            link: (chunks) => (
              <Link href={splitPath(AGENCY_PARIS_PATHS, locale)} className={INLINE_LINK}>
                {chunks}
              </Link>
            ),
          })}
        </p>
      </section>

      {customer.faq && customer.faq.length > 0 ? (
        <section className={`${BAND} border-t border-border`}>
          <h2 className={H2}>{t("faqTitle")}</h2>
          <div className="mt-12 md:mt-16">
            {customer.faq.map((item) => (
              <article
                key={item.question}
                className="grid grid-cols-1 gap-3 py-8 md:grid-cols-[minmax(0,420px)_1fr] md:gap-12 md:py-10"
              >
                <h3 className="m-0 text-[20px] font-bold leading-[1.15] tracking-[-0.03em] text-foreground md:text-[24px]">
                  {item.question}
                </h3>
                <p className="m-0 max-w-[70ch] text-[16px] leading-[1.65] text-muted-foreground md:text-[17px]">
                  {item.answer}
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
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
        {/* 1 — On the ink, in the hero's orange light: the client, the
            headline figure lit, the story in a paragraph, and the results. */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-48 -top-40 h-[900px] w-[1100px]"
            style={{
              background:
                "radial-gradient(closest-side, rgb(242 115 19 / 0.2), rgb(242 115 19 / 0.06) 55%, transparent)",
            }}
          />
          <div className={`relative ${SECTION} pb-20 pt-10 md:pb-28 md:pt-12`}>
            <h1 className="sr-only">{customer.client} · {t("back")}</h1>
            <Suspense fallback={<BackLink href="/case-studies" label={t("back")} />}>
              <CaseStudyBackLink />
            </Suspense>

            <div className="mt-12 flex flex-col items-start gap-5 md:mt-16 md:flex-row md:items-center md:justify-between">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={customer.logo}
                alt={customer.client}
                {...clientLogoSize(customer.logo)}
                className="logo-tone h-10 w-auto object-contain md:h-12"
              />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-soft-foreground">
                <BrandSquare />
                {customer.sector}
              </span>
            </div>

            {customer.metric && (
              <div className="mt-12 border-t border-border pt-10 md:mt-14">
                <p className="m-0 max-w-[14ch] text-[clamp(3.25rem,8.4vw,8rem)] font-bold leading-[0.92] tracking-[-0.05em]">
                  <span className="text-lit box-decoration-clone">{customer.metric}</span>
                </p>
                <p className="m-0 mt-5 max-w-[640px] text-lg leading-[1.45] text-soft-foreground md:text-xl">
                  {customer.metricLabel}
                </p>
              </div>
            )}

            <div
              className={`${customer.metric ? "mt-14 md:mt-16" : "mt-12 border-t border-border pt-10 md:mt-14"} grid gap-12 ${asideVisual ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)] lg:items-start lg:gap-16" : ""}`}
            >
              <p className="m-0 max-w-[720px] border-l border-border-strong pl-5 text-lg leading-[1.5] text-foreground md:pl-6 md:text-2xl">
                {customer.overview}
              </p>

              {asideVisual && (
                <div className="mx-auto w-full max-w-[360px] overflow-hidden border border-border">
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

            {customer.results.length > 0 && (
              /* Every stat cell keeps the same width (the 4-up rhythm of the
                 80rem rail) whatever the count: the strip narrows instead of
                 stretching, so a study with 2 numbers reads like one with 4.
                 Separators are real cell borders (left between columns, top
                 between mobile rows) — sturdier than a gap-px hairline,
                 which can vanish with browser zoom rounding. */
              <div
                className={`mt-16 grid grid-cols-2 border-y border-border md:mt-20 ${
                  customer.results.length === 1
                    ? "max-w-[20rem] md:grid-cols-1"
                    : customer.results.length === 2
                      ? "max-w-[40rem] md:grid-cols-2"
                      : customer.results.length === 3
                        ? "max-w-[60rem] md:grid-cols-3"
                        : "md:grid-cols-4"
                }`}
              >
                {customer.results.map((stat, index) => {
                  const isLast = index === customer.results.length - 1;
                  const fullWidthOnMobile =
                    customer.results.length % 2 === 1 && isLast;
                  return (
                    <div
                      key={stat.value}
                      className={`flex flex-col gap-1 py-6 pr-5 md:py-8 md:pr-8 ${
                        fullWidthOnMobile ? "col-span-2 md:col-span-1" : ""
                      } ${
                        index === 0
                          ? ""
                          : index % 2 === 1 && !fullWidthOnMobile
                            ? "border-l border-border pl-5 md:pl-8"
                            : "md:border-l md:border-border md:pl-8"
                      } ${index >= 2 ? "border-t border-border md:border-t-0" : ""}`}
                    >
                      <div className="text-lit text-[40px] font-bold leading-none tracking-[-0.045em] md:text-[52px]">
                        {stat.value}
                      </div>
                      <div className="mt-2 text-sm leading-snug text-muted-foreground">
                        {stat.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {customer.quote ? (
          <>
            <div data-surface="paper">{story}</div>

            {/* The client's words, an ink band in a pool of warm light like
                the homepage's quote. */}
            <section className="relative overflow-hidden">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(55% 75% at 22% 60%, rgb(242 115 19 / 0.16), rgb(242 115 19 / 0.04) 55%, transparent 80%)",
                }}
              />
              <figure className={`relative m-0 ${SECTION} py-24 md:py-32 lg:py-36`}>
                <span
                  aria-hidden="true"
                  className="block text-[6rem] font-bold leading-none text-brand lg:text-[8rem]"
                >
                  &ldquo;
                </span>
                <blockquote className="m-0 -mt-8 max-w-[30ch] text-[clamp(1.6rem,3vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.03em] text-foreground lg:-mt-12">
                  {customer.quote.text}
                </blockquote>
                <figcaption className="mt-10 flex flex-wrap items-center gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-soft-foreground">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={customer.logo}
                    alt=""
                    aria-hidden="true"
                    {...clientLogoSize(customer.logo)}
                    className="logo-tone h-6 w-auto"
                    loading="lazy"
                    decoding="async"
                  />
                  {customer.quote.author}
                </figcaption>
              </figure>
            </section>

            <div data-surface="paper">{more(false)}</div>
          </>
        ) : (
          <div data-surface="paper">
            {story}
            {more(true)}
          </div>
        )}

        <FinalCTA rail="narrow" />
      </main>
      <Footer />
    </div>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import { BackLink } from "@/components/BackLink";
import { FinalCTA } from "@/components/home/FinalCTA";
import { JsonLd } from "@/components/JsonLd";
import { QuivrFeedMock } from "@/components/quivr/QuivrFeedMock";
import { QuivrSections } from "@/components/quivr/QuivrSections";
import { PROJECT_SLUGS, getProject, type ContentLocale } from "@/lib/projects";
import { QUIVR_FAQ_KEYS, QUIVR_OG_IMAGE, QUIVR_SLUG } from "@/lib/quivr";
import { localizedAlternates, localizedSocialMetadata, localizedUrl } from "@/lib/site";
import { breadcrumbList, faqPageSchema } from "@/lib/structured-data";

export function generateStaticParams() {
  return PROJECT_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "portfolio" });
  const project = getProject(slug, locale as ContentLocale);
  if (!project) return { title: t("back") };

  // Quivr keeps its own search title (absolute, so the brand is not repeated
  // by the layout template) and social card.
  const tQuivr =
    slug === QUIVR_SLUG
      ? await getTranslations({ locale, namespace: "quivr" })
      : null;
  const title = tQuivr ? tQuivr("metaTitle") : `${project.name} · ${t("back")}`;
  const description = tQuivr ? tQuivr("metaDescription") : project.metaDescription;
  return {
    title: tQuivr ? { absolute: title } : title,
    description,
    alternates: localizedAlternates(locale, `/portfolio/${slug}`),
    ...localizedSocialMetadata({
      locale,
      path: `/portfolio/${slug}`,
      title,
      description,
      image: tQuivr
        ? {
            path: QUIVR_OG_IMAGE.url[locale === "en" ? "en" : "fr"],
            width: QUIVR_OG_IMAGE.width,
            height: QUIVR_OG_IMAGE.height,
            alt: tQuivr("product.alt"),
          }
        : project.cover
          ? { path: project.cover, alt: `${project.name} homepage` }
          : undefined,
    }),
  };
}

export default async function PortfolioProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "portfolio" });
  const project = getProject(slug, locale as ContentLocale);
  if (!project) notFound();
  // Quivr is an engine with an API, so on top of the shared template its
  // product is drawn in code (QuivrFeedMock) and explained further down
  // (QuivrSections).
  const isQuivr = slug === QUIVR_SLUG;
  const tFooter = await getTranslations({ locale, namespace: "footer" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const breadcrumb = breadcrumbList([
    { name: tFooter("home"), url: localizedUrl(locale) },
    { name: tNav("portfolio"), url: localizedUrl(locale, "/portfolio") },
    { name: project.name, url: localizedUrl(locale, `/portfolio/${slug}`) },
  ]);
  // The Quivr page shows a FAQ (QuivrSections); its markup repeats it.
  const tQuivr = isQuivr ? await getTranslations({ locale, namespace: "quivr" }) : null;
  const faq = tQuivr
    ? faqPageSchema(
        QUIVR_FAQ_KEYS.map((key) => ({
          question: tQuivr(`faq.items.${key}.q`),
          answer: tQuivr(`faq.items.${key}.a`),
        })),
      )
    : null;

  const meta = [
    { value: project.status, label: t("statusLabel") },
    { value: project.date, label: t("built") },
    { value: project.tag, label: t("typeLabel") },
  ];

  return (
    <div
      data-variant="hybrid"
      className="flex min-h-screen flex-col bg-background text-foreground"
    >
      <JsonLd data={breadcrumb} />
      <JsonLd data={faq} />
      <TopNav />
      <main id="main-content" tabIndex={-1} className="flex-1">
        <section className="mx-auto max-w-[80rem] px-6 pb-16 pt-10 md:px-12 md:pb-20 md:pt-12">
          <BackLink href="/portfolio" label={t("back")} />

          <div className="mt-10 border-t-2 border-foreground pt-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-6">
              <div className="flex min-w-0 items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.logo}
                  alt={`${project.name} logo`}
                  className="h-12 w-12 shrink-0 rounded-sm object-contain md:h-14 md:w-14"
                />
                <h1
                  className="m-0 text-[44px] font-bold leading-none tracking-[-0.04em] text-foreground md:text-[64px]"
                  style={{ textDecoration: "underline", textDecorationColor: project.accent, textUnderlineOffset: "0.12em", textDecorationThickness: "4px" }}
                >
                  {project.name}
                </h1>
              </div>
              <span className="shrink-0 self-start border border-foreground px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-foreground md:self-auto">
                {project.tag}
              </span>
            </div>
            <div className="mt-4 font-mono text-sm uppercase tracking-[0.15em] text-muted-foreground">
              {project.status} · {t("built")} {project.date}
            </div>
          </div>

          <p className="m-0 mt-10 max-w-[720px] text-xl leading-[1.5] text-foreground md:text-2xl">
            {project.description}
          </p>
        </section>

        <section className="border-y border-border bg-background">
          <div className="mx-auto grid max-w-[80rem] grid-cols-3 gap-px bg-border px-0">
            {meta.map((item) => (
              <div key={item.label} className="flex min-w-0 flex-col gap-1 bg-background p-4 sm:p-6 md:p-8">
                {/* Long type words ("Bibliothèque", "Recherche") hyphenate on
                    phones instead of pushing the band past the screen. */}
                <div className="hyphens-auto break-words text-[20px] font-bold leading-tight tracking-[-0.02em] text-foreground sm:text-[22px] md:text-[28px]">
                  {item.value}
                </div>
                <div className="mt-1 text-sm leading-snug text-muted-foreground">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[80rem] px-6 py-16 md:px-12 md:py-20">
          <span className="mb-6 block font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {t("theProduct")}
          </span>
          <div
            // Columns sized by image aspect (16:10 web, ~9:19.5 phone); the phone frame then stretches
            // to the row so both frames end on the same line.
            className={
              project.mobileCover
                ? "grid gap-6 md:grid-cols-[minmax(0,1.6fr)_minmax(0,0.455fr)] md:gap-8"
                : undefined
            }
          >
            {isQuivr ? (
              <QuivrFeedMock locale={locale} accent={project.accent} />
            ) : project.cover ? (
              <div className="self-start overflow-hidden border border-foreground">
                <div className="h-[3px] w-full" style={{ backgroundColor: project.accent }} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.cover}
                  alt={`${project.name} homepage`}
                  className="h-auto w-full"
                  loading="lazy"
                />
              </div>
            ) : null}
            {project.mobileCover && (
              <div className="mx-auto w-full max-w-[15rem] overflow-hidden border border-foreground md:flex md:max-w-none md:flex-col">
                <div className="h-[3px] w-full" style={{ backgroundColor: project.accent }} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.mobileCover}
                  alt={`${project.name} iPhone app`}
                  className="h-auto w-full md:min-h-0 md:flex-1 md:object-cover md:object-top"
                  loading="lazy"
                />
              </div>
            )}
          </div>

          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-3 border-2 border-foreground bg-background px-6 py-4 text-[15px] font-semibold text-foreground transition-all duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_var(--foreground)]"
          >
            {t("visitProject", { name: project.name })}
            <span aria-hidden="true" className="text-lg">
              &#8599;
            </span>
          </a>
        </section>

        {project.story ? (
          <section className="border-t border-border">
            <div className="mx-auto flex max-w-[80rem] flex-col gap-14 px-6 py-16 md:gap-16 md:px-12 md:py-20">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr] md:gap-16">
                <h2 className="m-0 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {t("storyWhy")}
                </h2>
                <p className="m-0 max-w-[720px] text-xl leading-[1.5] text-foreground">
                  {project.story.why}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr] md:gap-16">
                <h2 className="m-0 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {t("storyHow")}
                </h2>
                <ul className="m-0 flex max-w-[720px] list-none flex-col gap-5 p-0">
                  {project.story.how.map((step) => (
                    <li
                      key={step}
                      className="flex gap-4 border-b border-border pb-5 text-lg leading-[1.5] text-foreground last:border-b-0"
                    >
                      <span aria-hidden="true" className="pt-1 font-mono text-orange-500">
                        →
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr] md:gap-16">
                <h2 className="m-0 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {t("storyAudience")}
                </h2>
                <p className="m-0 max-w-[720px] text-lg leading-[1.6] text-foreground">
                  {project.story.audience}
                </p>
              </div>
            </div>
          </section>
        ) : null}

        {isQuivr ? <QuivrSections locale={locale} /> : null}

        <FinalCTA rail="narrow" />
      </main>
      <Footer />
    </div>
  );
}

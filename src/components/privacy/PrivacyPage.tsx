import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { TopNav } from "@/components/TopNav";
import {
  localizedSocialMetadata,
  localizedUrl,
  PRIVACY_PATHS,
  splitPath,
  splitPathAlternates,
} from "@/lib/site";
import { PRIVACY_SECTION_KEYS } from "@/lib/privacy";
import { breadcrumbList } from "@/lib/structured-data";
import { MarkedText } from "./MarkedText";

/**
 * The privacy policy, served at /fr/confidentialite and /en/privacy. Every
 * statement about what the site collects comes from its code (PostHog setup
 * in src/lib/posthog.ts, the cal.com webhook, the locale middleware, the
 * runner games' localStorage); anything the code cannot tell is written
 * "À CONFIRMER" / "TO BE CONFIRMED" in the copy and rendered as a marker.
 */

export async function privacyMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "privacy" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  const path = splitPath(PRIVACY_PATHS, locale);

  return {
    title: { absolute: title },
    description,
    alternates: splitPathAlternates(locale, PRIVACY_PATHS),
    ...localizedSocialMetadata({ locale, path, title, description }),
  };
}

type Table = { caption: string; columns: string[]; rows: string[][] };

type Section = {
  title: string;
  paragraphs?: string[];
  items?: { title: string; paragraphs: string[] }[];
  table?: Table;
  after?: string[];
};

const SECTION = "mx-auto max-w-[100rem] px-6 md:px-12";
const MONO =
  "font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground";
const PROSE = "m-0 max-w-[72ch] text-[15px] leading-[1.65] text-muted-foreground md:text-base";

/** "01", "02"…: sections are numbered "NN. Title" in the headings and the contents. */
function sectionNumber(index: number): string {
  return String(index + 1).padStart(2, "0");
}

function Paragraphs({ paragraphs }: { paragraphs?: string[] }) {
  if (!paragraphs?.length) return null;
  return (
    <div className="mt-5 flex flex-col gap-4">
      {paragraphs.map((text) => (
        <p key={text} className={PROSE}>
          <MarkedText text={text} />
        </p>
      ))}
    </div>
  );
}

/**
 * A real table for crawlers and screen readers. Below `md` each row stacks
 * into a card, every cell led by its column name, so a four-column table
 * never pushes a phone screen sideways.
 */
function DataTable({ table }: { table: Table }) {
  return (
    <div className="mt-8 border border-foreground">
      <table className="w-full border-collapse text-left md:table-fixed">
        <caption className="sr-only">{table.caption}</caption>
        <thead className="hidden md:table-header-group">
          <tr className="border-b-2 border-foreground">
            {table.columns.map((column) => (
              <th
                key={column}
                scope="col"
                className="px-5 py-3 font-mono text-[10px] font-normal uppercase tracking-[0.2em] text-muted-foreground"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row) => (
            <tr
              key={row[0]}
              className="block border-b border-border px-5 py-4 last:border-b-0 md:table-row md:p-0"
            >
              {row.map((cell, i) => {
                const Cell = i === 0 ? "th" : "td";
                return (
                  <Cell
                    key={table.columns[i]}
                    scope={i === 0 ? "row" : undefined}
                    data-label={table.columns[i]}
                    className={`block break-words py-1 align-top before:mb-1 before:block before:font-mono before:text-[10px] before:font-normal before:uppercase before:tracking-[0.2em] before:text-muted-foreground before:content-[attr(data-label)] md:table-cell md:px-5 md:py-4 md:before:hidden ${
                      i === 0
                        ? "font-mono text-[12px] font-normal tracking-[0.02em] text-foreground"
                        : "text-[14px] leading-[1.55] text-foreground md:text-[15px]"
                    }`}
                  >
                    <MarkedText text={cell} />
                  </Cell>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export async function PrivacyPage({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "privacy" });
  const tFooter = await getTranslations({ locale, namespace: "footer" });
  // Raw, not formatted: the copy holds literal `<project key>` placeholders
  // that ICU would read as rich-text tags.
  const sections = t.raw("sections") as Record<(typeof PRIVACY_SECTION_KEYS)[number], Section>;
  const breadcrumb = breadcrumbList([
    { name: tFooter("home"), url: localizedUrl(locale) },
    { name: t("breadcrumb"), url: localizedUrl(locale, splitPath(PRIVACY_PATHS, locale)) },
  ]);

  return (
    <div
      data-variant="hybrid"
      className="flex min-h-screen flex-col bg-background text-foreground"
    >
      <JsonLd data={breadcrumb} />
      <TopNav />
      <main id="main-content" tabIndex={-1} className="flex-1">
        <section className={`${SECTION} pb-12 pt-12 md:pb-16 md:pt-16`}>
          <div className={`mb-6 flex flex-wrap gap-x-4 gap-y-1 ${MONO}`}>
            <span>{t("kicker")}</span>
            <span aria-hidden="true">·</span>
            <span>{t("updated")}</span>
          </div>
          <h1
            className="m-0 max-w-[16ch] font-bold text-foreground"
            style={{
              fontSize: "clamp(40px, 6vw, 88px)",
              lineHeight: 0.92,
              letterSpacing: "-0.045em",
            }}
          >
            {t("title")}
          </h1>
          <p className="m-0 mt-8 max-w-[680px] border-l-2 border-foreground pl-5 text-lg leading-[1.5] text-foreground md:pl-6 md:text-[19px]">
            {t("lede")}
          </p>
          <p className="m-0 mt-8 max-w-[680px] border border-dashed border-foreground px-5 py-4 text-sm leading-[1.55] text-foreground">
            <MarkedText text={t.raw("tbcNote") as string} />
          </p>
        </section>

        <div
          className={`${SECTION} grid grid-cols-1 gap-10 border-t border-border pb-20 pt-12 md:pt-16 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16`}
        >
          {/* Table of contents: a plain list of anchors, pinned on desktop. */}
          <nav aria-label={t("tocLabel")} className="lg:sticky lg:top-24 lg:self-start">
            <span className={`block ${MONO}`}>{t("tocLabel")}</span>
            <ol className="m-0 mt-4 flex list-none flex-col gap-2 border-l-2 border-foreground p-0 pl-4">
              {PRIVACY_SECTION_KEYS.map((key, i) => (
                <li key={key}>
                  <a
                    href={`#${key}`}
                    className="flex gap-3 text-sm leading-[1.35] text-foreground hover:text-muted-foreground"
                  >
                    <span className="font-mono text-[11px] leading-[1.6] text-muted-foreground">
                      {`${sectionNumber(i)}.`}
                    </span>
                    <span>{sections[key].title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="flex min-w-0 flex-col">
            {PRIVACY_SECTION_KEYS.map((key, i) => {
              const section = sections[key];
              return (
                <section
                  key={key}
                  id={key}
                  aria-labelledby={`${key}-title`}
                  className="scroll-mt-24 border-b border-border py-10 first:pt-0 last:border-b-0 md:py-14"
                >
                  {/* One text node, "01. Title", so the number reads with the heading. */}
                  <h2
                    id={`${key}-title`}
                    className="m-0 font-bold text-foreground text-[clamp(26px,3.4vw,42px)] leading-[1] tracking-[-0.04em]"
                  >
                    {`${sectionNumber(i)}. ${section.title}`}
                  </h2>
                  <Paragraphs paragraphs={section.paragraphs} />

                  {section.items ? (
                    <div className="mt-8 flex flex-col gap-5">
                      {section.items.map((item) => (
                        <article
                          key={item.title}
                          className="border border-foreground bg-background p-6 md:p-8"
                        >
                          <h3 className="m-0 text-[20px] font-bold leading-[1.15] tracking-[-0.03em] text-foreground md:text-[24px]">
                            {item.title}
                          </h3>
                          <Paragraphs paragraphs={item.paragraphs} />
                        </article>
                      ))}
                    </div>
                  ) : null}

                  {section.table ? <DataTable table={section.table} /> : null}
                  <Paragraphs paragraphs={section.after} />
                </section>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

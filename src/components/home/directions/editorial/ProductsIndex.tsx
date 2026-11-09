import { useTranslations } from "next-intl";
import type { CSSProperties } from "react";
import { Link } from "@/i18n/navigation";
import { getProjects, type ContentLocale } from "@/lib/projects";

const ORG_URL = "https://github.com/The-Vibe-Company";

const COLUMNS = "md:grid-cols-[3rem_minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,9rem)_minmax(0,7rem)_2rem]";

/**
 * Our products as the index at the back of a magazine: one ruled line each,
 * name, category, status, date. Pointing at a line slides it right and draws
 * the product's own colour up its left edge.
 */
export function ProductsIndex({ locale }: { locale: ContentLocale }) {
  const t = useTranslations("proof");
  const projects = getProjects(locale);
  const head =
    locale === "fr"
      ? ["N°", "Produit", "Catégorie", "Statut", "Sortie"]
      : ["No.", "Product", "Category", "Status", "Released"];

  return (
    <div>
      <div
        aria-hidden="true"
        className={`hidden gap-6 border-b border-border-strong pb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground md:grid ${COLUMNS}`}
      >
        {head.map((h) => (
          <span key={h}>{h}</span>
        ))}
        <span />
      </div>
      <ul className="m-0 list-none p-0">
        {projects.map((p, i) => (
          <li key={p.slug} className="border-b border-border">
            <Link
              href={`/portfolio/${p.slug}`}
              style={{ "--accent": p.accent } as CSSProperties}
              className={`group relative grid grid-cols-[2.25rem_minmax(0,1fr)_1.5rem] items-center gap-x-4 gap-y-1 py-5 no-underline outline-offset-[-2px] md:gap-6 md:py-6 ${COLUMNS}`}
            >
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-0 top-0 w-[3px] origin-bottom scale-y-0 bg-[var(--accent)] transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100 group-focus-visible:scale-y-100"
              />
              <span className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground transition-transform duration-500 group-hover:translate-x-4 group-focus-visible:translate-x-4">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex min-w-0 items-center gap-3 transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-4 group-focus-visible:translate-x-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.logo} alt="" aria-hidden="true" className="h-7 w-7 shrink-0 rounded-[3px] object-contain" loading="lazy" decoding="async" />
                <span className="truncate text-[22px] font-bold tracking-[-0.03em] text-foreground md:text-[26px]">{p.name}</span>
              </span>
              <span className="col-start-2 text-[13px] text-muted-foreground md:col-start-auto md:text-[15px] md:text-soft-foreground">
                {p.tag}
              </span>
              <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground md:inline">
                {p.status}
              </span>
              <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground md:inline">
                {p.date}
              </span>
              <span
                aria-hidden="true"
                className="col-start-3 row-span-2 row-start-1 justify-self-end text-lg text-foreground transition-colors duration-300 group-hover:text-[var(--accent)] md:col-start-auto md:row-span-1 md:row-start-auto"
              >
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <a
        href={ORG_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-10 inline-flex min-h-11 items-center gap-2.5 font-mono text-[12px] uppercase tracking-[0.2em] text-foreground"
      >
        <span className="underline decoration-1 underline-offset-4">{t("browseAll")}</span>
        <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
          ↗
        </span>
      </a>
    </div>
  );
}

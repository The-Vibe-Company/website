import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { clientLogoSize } from "@/lib/client-logos";
import { getCustomers, type ContentLocale, type Customer } from "@/lib/customers";
import { cn } from "@/lib/design-system";
import { DISPLAY } from "./font";
import { CONTAINER, LitTitle, SUNLIT_TEXT } from "./shared";

/**
 * The cases in the afterglow. Each one is a panel of night with a sun buried
 * under its foot: at rest only its glow leaks over the edge; on hover or focus
 * it rises, the frame catches fire along the top, and the figure brightens.
 */
function CasePanel({ c, featured, readCase }: { c: Customer; featured: boolean; readCase: string }) {
  return (
    <Link
      href={`/case-studies/${c.slug}`}
      className={cn(
        "group relative isolate flex flex-col overflow-hidden border border-border bg-[#0c0c0d]/80 p-6 no-underline transition-colors duration-500 hover:border-[rgba(242,115,19,0.55)] focus-visible:border-[rgba(242,115,19,0.55)] md:p-8",
        featured && "md:row-span-2",
      )}
    >
      {/* The buried sun. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[70%] left-1/2 -z-10 aspect-square w-[130%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,170,90,0.55),rgba(242,115,19,0.32)_45%,rgba(242,115,19,0.06)_75%,transparent)] opacity-45 transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[14%] group-hover:opacity-100 group-focus-visible:-translate-y-[14%] group-focus-visible:opacity-100"
      />
      {/* The frame catching fire. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-[linear-gradient(90deg,transparent,#ffb067,transparent)] transition-transform duration-700 group-hover:scale-x-100 group-focus-visible:scale-x-100"
      />

      <div className="flex items-start justify-between gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={c.logo}
          alt={c.client}
          {...clientLogoSize(c.logo)}
          className="h-7 w-auto object-contain brightness-0 invert md:h-8"
          loading="lazy"
          decoding="async"
        />
        <span className="max-w-[60%] text-right font-mono text-[10px] uppercase leading-[1.5] tracking-[0.16em] text-muted-foreground">
          {c.sector}
        </span>
      </div>

      <div className={cn("mt-auto pt-10", featured && "md:pt-16")}>
        {c.metric ? (
          <p
            className={cn(
              DISPLAY,
              SUNLIT_TEXT,
              "m-0 pb-[0.06em] font-black leading-[0.84] tracking-[-0.01em] [text-wrap:balance] transition-[filter] duration-500 group-hover:drop-shadow-[0_0_30px_rgba(242,115,19,0.55)]",
              featured ? "text-[clamp(3.6rem,6.2vw,6.4rem)]" : "text-[clamp(2.6rem,3.6vw,4rem)]",
            )}
          >
            {c.metric}
          </p>
        ) : null}
        {c.metricLabel ? (
          <p className="m-0 mt-3 max-w-[30rem] text-[15px] leading-[1.5] text-soft-foreground">{c.metricLabel}</p>
        ) : null}

        {featured && c.results.length > 0 ? (
          <dl className="m-0 mt-8 grid grid-cols-2 gap-px border border-border bg-border">
            {c.results.map((r) => (
              <div key={r.label} className="bg-[#0c0c0d]/90 p-4">
                <dt className="sr-only">{r.label}</dt>
                <dd className={cn(DISPLAY, "m-0 text-[30px] font-black leading-none text-foreground")}>{r.value}</dd>
                <p aria-hidden="true" className="m-0 mt-2 text-[12px] leading-[1.35] text-muted-foreground">
                  {r.label}
                </p>
              </div>
            ))}
          </dl>
        ) : null}

        <span className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground">
          <span className="underline decoration-1 underline-offset-4">{readCase}</span>
          <span aria-hidden="true" className="text-brand transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}

export function Cases({ locale }: { locale: ContentLocale }) {
  const t = useTranslations("caseStudy");
  const customers = getCustomers(locale);

  return (
    <section id="eclipse-cases" className="relative scroll-mt-24 py-20 md:py-28">
      <div className={CONTAINER}>
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <LitTitle kicker={t("kicker")} line1={t("titleLine1")} line2={t("titleLine2")} />
          <Link
            href="/case-studies"
            className="inline-flex shrink-0 items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground underline decoration-1 underline-offset-4 transition-colors hover:text-brand md:mb-3"
          >
            {t("seeAll")} <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 md:mt-16 md:grid-cols-3 md:grid-rows-[minmax(300px,auto)_minmax(300px,auto)]">
          {customers.map((c, index) => (
            <CasePanel key={c.slug} c={c} featured={index === 0} readCase={t("readCase")} />
          ))}
        </div>
      </div>
    </section>
  );
}

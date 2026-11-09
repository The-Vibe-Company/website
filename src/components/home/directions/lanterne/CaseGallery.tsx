"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { type CSSProperties } from "react";
import { Link } from "@/i18n/navigation";
import { clientLogoSize } from "@/lib/client-logos";
import { getCustomers, type ContentLocale, type Customer } from "@/lib/customers";
import { cn } from "@/lib/design-system";
import { Kicker, LitTitle, Rim, rimHost, useLitOnce } from "./light";
import s from "./lantern.module.css";

/** Grid placement: Monka and AFP on the first wall, the other three below. */
const SPANS = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-4", "lg:col-span-4", "lg:col-span-4"];

function Panel({ c, index, readCase }: { c: Customer; index: number; readCase: string }) {
  const [ref, lit] = useLitOnce<HTMLElement>(0.45);
  const wide = index === 0;
  const visual = wide ? c.visuals.find((v) => v.placement === "wide") : undefined;
  // The headline figure is already on the panel: the ledger holds the others.
  const ledger = c.results.filter((r) => r.value !== c.metric && !c.metric?.startsWith(r.value)).slice(0, 3);
  // Lights come on along each wall, left to right.
  const delay = `${(index < 2 ? index : index - 2) * 260}ms`;

  return (
    <article
      ref={ref}
      data-lit={lit}
      onPointerMove={rimHost.onPointerMove}
      className={cn(s.panel, rimHost.className, "relative mt-10", SPANS[index], wide && "md:col-span-2")}
      style={{ "--delay": delay } as CSSProperties}
    >
      <span aria-hidden="true" className={s.fixture} />
      <div
        className="relative flex h-full flex-col overflow-hidden border border-[#242324] bg-[#0d0c0c]"
        style={{
          backgroundImage: "radial-gradient(ellipse 70% 55% at 50% 0%, rgb(255 170 90 / 0.13), transparent 72%)",
        }}
      >
        <span aria-hidden="true" className={s.cone} />
        <div className={cn(s.panelBody, "relative flex h-full flex-col p-6 md:p-8")}>
          <div className="flex items-start justify-between gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={c.logo}
              alt={c.client}
              {...clientLogoSize(c.logo)}
              className="h-7 w-auto max-w-[150px] object-contain object-left brightness-0 invert md:h-8"
              loading="lazy"
              decoding="async"
            />
            <span className="max-w-[16rem] text-right font-mono text-[10px] uppercase leading-[1.5] tracking-[0.18em] text-muted-foreground">
              {c.sector}
            </span>
          </div>

          <p
            className={cn(
              s.topLit,
              "m-0 mt-10 font-[800] leading-[0.9] tracking-[-0.045em]",
              wide ? "text-[clamp(3.2rem,6.6vw,6.5rem)]" : "text-[clamp(2.6rem,4.4vw,4.4rem)]",
            )}
          >
            {c.metric}
          </p>
          {c.metricLabel ? (
            <p className="m-0 mt-4 max-w-[30rem] text-[15px] leading-[1.55] text-[#a7a49d]">{c.metricLabel}</p>
          ) : null}

          {/* Panels without a screen show their results instead, as a lit ledger. */}
          {!visual && ledger.length > 0 ? (
            <dl className="m-0 mt-8 grid grid-cols-1 border-t border-[#2a2420]">
              {ledger.map((r) => (
                <div key={r.label} className="flex items-baseline justify-between gap-6 border-b border-[#211d1a] py-3">
                  <dt className="text-[13px] leading-[1.45] text-[#a7a49d]">{r.label}</dt>
                  <dd className="m-0 shrink-0 text-[17px] font-[750] tracking-[-0.02em] text-[#ffd7ad]">{r.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          {visual ? (
            <div className="relative mt-8 overflow-hidden border border-[#2a2928]">
              <Image
                src={visual.src}
                alt={visual.alt}
                width={visual.width}
                height={visual.height}
                sizes="(min-width: 1024px) 720px, 100vw"
                className="block h-[220px] w-full object-cover object-left-top opacity-80 md:h-[260px]"
              />
              {/* The screen is lit from the same lamp: bright at the top, falling off. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{ background: "linear-gradient(to bottom, rgb(255 180 110 / 0.12), rgb(7 7 7 / 0.1) 40%, rgb(7 7 7 / 0.78))" }}
              />
            </div>
          ) : null}

          <Link
            href={`/case-studies/${c.slug}`}
            className="mt-auto inline-flex items-center gap-2 self-start pt-10 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground underline decoration-1 underline-offset-4 transition-colors hover:text-[#ffb36b]"
          >
            {readCase}
            <span aria-hidden="true" className="text-[#ffb36b]">
              →
            </span>
          </Link>
        </div>
        <Rim />
      </div>
    </article>
  );
}

/**
 * The cases as a gallery at night: each one a panel under its own spotlight.
 * The lamps come on, with a tungsten stutter, as each wall scrolls into view;
 * the figure on each panel is lit from above like a label under a lamp.
 */
export function CaseGallery({ locale }: { locale: ContentLocale }) {
  const t = useTranslations("caseStudy");
  const customers = getCustomers(locale);

  return (
    <section id="cases" className="relative bg-[#070707] py-24 md:py-32">
      <div className="mx-auto max-w-[90rem] px-6 md:px-10 lg:px-16">
        <Kicker>{t("kicker")}</Kicker>
        <LitTitle line1={t("titleLine1")} line2={t("titleLine2")} className="mt-8" />

        <div className="mt-10 grid grid-cols-1 gap-x-5 gap-y-4 md:mt-14 md:grid-cols-2 lg:grid-cols-12">
          {customers.map((c, i) => (
            <Panel key={c.slug} c={c} index={i} readCase={t("readCase")} />
          ))}
        </div>

        <Link
          href="/case-studies"
          className="mt-14 inline-flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.2em] text-[#ffb36b] transition-colors hover:text-foreground"
        >
          {t("seeAll")}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}

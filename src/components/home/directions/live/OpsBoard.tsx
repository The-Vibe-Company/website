"use client";

import { useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRef, type CSSProperties, type ReactNode } from "react";
import { BrandSquare } from "@/components/BrandSquare";
import { Link } from "@/i18n/navigation";
import { clientLogoSize } from "@/lib/client-logos";
import { cn } from "@/lib/design-system";
import { CountUp, DOT, LivePulse, trackPointer, useRun } from "./primitives";
import s from "./live.module.css";

export interface OpsCase {
  slug: string;
  client: string;
  logo: string;
  sector: string;
  metric?: string;
  metricLabel?: string;
  results: { value: string; label: string }[];
  /** Short names of the tools or projects delivered, from the case's points. */
  parts: string[];
}

export interface OpsModule {
  name: string;
}

export interface OpsClient {
  name: string;
  src: string;
  url: string;
}

const COPY = {
  fr: { cases: "cas", trusted: "On travaille pour eux", you: "Vous ?" },
  en: { cases: "cases", trusted: "They work with us", you: "You?" },
};

/** "165 questions" → ["165", "questions"]; "87%" → ["87%", ""]; words only → null. */
function splitMetric(metric: string): [string, string] | null {
  const m = metric.match(/^([^\s]*\d[^\s]*(?:\s?[M€%]+)?)\s*(.*)$/);
  return m ? [m[1], m[2]] : null;
}

const LABEL = "font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground";

/** A secondary figure: dot-matrix number, its unit in plain type, the label under. */
function Readout({ value, label }: { value: string; label: string }) {
  const split = splitMetric(value);
  return (
    <div className="min-w-0">
      <p className="m-0 flex items-baseline gap-2 leading-none">
        <CountUp value={split ? split[0] : value} className={cn(DOT, "text-[34px] text-foreground md:text-[40px]")} />
        {split?.[1] ? <span className="text-[15px] font-medium text-soft-foreground">{split[1]}</span> : null}
      </p>
      <p className="m-0 mt-2 text-[13px] leading-[1.4] text-muted-foreground">{label}</p>
    </div>
  );
}

/** What the engagement put in production, as a short ruled list. */
function Modules({ items }: { items: string[] }) {
  return (
    <ol className="m-0 mt-9 list-none border-t border-border p-0">
      {items.map((item, i) => (
        <li key={item} className="flex items-center gap-4 border-b border-border py-3 text-[14px] text-soft-foreground">
          <span className="w-6 font-mono text-[10px] tracking-[0.14em] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
          <span className="min-w-0 flex-1 truncate">{item}</span>
          <span aria-hidden="true" className="h-1.5 w-1.5 bg-soft-foreground/70" />
        </li>
      ))}
    </ol>
  );
}

function Headline({ metric, label, size = "lg" }: { metric?: string; label?: string; size?: "lg" | "xl" }) {
  if (!metric) return null;
  const split = splitMetric(metric);
  return (
    <div className="mt-8">
      {split ? (
        <p className="m-0 flex flex-wrap items-end gap-x-4 gap-y-1">
          <CountUp
            value={split[0]}
            className={cn(
              DOT,
              "leading-[0.8] text-foreground",
              size === "xl" ? "text-[clamp(84px,10vw,156px)]" : "text-[clamp(64px,6.4vw,104px)]",
            )}
          />
          {split[1] ? <span className="pb-1 text-[20px] font-medium tracking-[-0.02em] text-soft-foreground">{split[1]}</span> : null}
        </p>
      ) : (
        <p className="m-0 text-[clamp(34px,3.4vw,52px)] font-bold leading-[0.95] tracking-[-0.04em] text-foreground">{metric}</p>
      )}
      {label ? <p className="m-0 mt-3 max-w-[40ch] text-[15px] leading-[1.5] text-muted-foreground">{label}</p> : null}
    </div>
  );
}

/* --------------------------------------------------------------- visuals */

/** One tick per app release, lit in order when the card scrolls in. */
function ReleaseStrip({ count, caption }: { count: number; caption: string }) {
  return (
    <div className="mt-8">
      <div className="flex h-10 items-end gap-[3px]">
        {Array.from({ length: count }, (_, i) => (
          <span
            key={i}
            className={cn(s.tick, "w-full", i === count - 1 ? "h-full bg-brand" : i % 15 === 14 ? "h-[70%] bg-soft-foreground" : "h-[45%] bg-border-strong")}
            style={{ "--i": i } as CSSProperties}
          />
        ))}
      </div>
      <p className={cn(LABEL, "m-0 mt-3")}>{caption}</p>
    </div>
  );
}

function Progress({ value }: { value: number }) {
  return (
    <div className="mt-8">
      <div className="relative h-2 bg-border">
        <span className={cn(s.fill, "absolute inset-0 bg-brand")} style={{ "--to": value } as CSSProperties} />
      </div>
      <div className={cn(LABEL, "mt-2 flex justify-between")}>
        <span>0</span>
        <span>100</span>
      </div>
    </div>
  );
}

/** The delivered tools, lit one after the other like a running pipeline. */
function PartChips({ parts }: { parts: string[] }) {
  return (
    <ol className="m-0 mt-7 flex list-none flex-wrap gap-2 p-0">
      {parts.map((part, i) => (
        <li
          key={part}
          className={cn(s.node, "border border-border-strong px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground")}
          style={{ "--i": i, "--steps": parts.length + 1 } as CSSProperties}
        >
          {String(i + 1).padStart(2, "0")} · {part}
        </li>
      ))}
    </ol>
  );
}

/** A specification diff, scanned top to bottom. */
function DiffScan() {
  const lines = [
    { mark: " ", w: "w-[72%]" },
    { mark: "−", w: "w-[58%]" },
    { mark: "+", w: "w-[64%]" },
    { mark: " ", w: "w-[80%]" },
    { mark: "+", w: "w-[46%]" },
    { mark: " ", w: "w-[66%]" },
  ];
  return (
    <div className="relative mt-7 overflow-hidden border border-border bg-background/60 px-4 py-3">
      <span aria-hidden="true" className={cn(s.scan, "absolute inset-x-0 top-0 h-[18%] bg-brand/10")} />
      {lines.map((line, i) => (
        <div key={i} className="flex items-center gap-3 py-[5px] font-mono text-[11px]">
          <span className={cn("w-3", line.mark === " " ? "text-muted" : "text-foreground")}>{line.mark}</span>
          <span className={cn("h-[6px]", line.w, line.mark === " " ? "bg-border" : "bg-soft-foreground/70")} />
        </div>
      ))}
    </div>
  );
}

/** Hundreds of developers, a few of them busy at any moment. */
function DevGrid() {
  return (
    <div aria-hidden="true" className="mt-7 grid grid-cols-[repeat(28,minmax(0,1fr))] gap-[3px]">
      {Array.from({ length: 168 }, (_, i) => (
        <span
          key={i}
          className={cn(s.cell, i % 23 === 5 && s.cellHot, "aspect-square bg-border")}
          style={{ "--i": (i * 7) % 31 } as CSSProperties}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ cards */

function Card({
  c,
  span,
  readCase,
  children,
}: {
  c: OpsCase;
  span: string;
  readCase: string;
  children: ReactNode;
}) {
  // Each card fills its bars and ticks the first time it is on screen.
  const inner = useRef<HTMLDivElement>(null);
  const seen = useInView(inner, { once: true, margin: "0px 0px -15% 0px" });
  return (
    <Link
      href={`/case-studies/${c.slug}?from=home`}
      onPointerMove={trackPointer}
      className={cn(
        s.spot,
        "group flex min-w-0 flex-col border border-border bg-background p-6 no-underline transition-colors duration-300 hover:border-border-strong hover:bg-card md:p-7",
        span,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={c.logo}
          alt={c.client}
          {...clientLogoSize(c.logo)}
          className="h-6 w-auto max-w-[45%] object-contain object-left brightness-0 invert md:h-7"
          loading="lazy"
          decoding="async"
        />
        <span className={cn(LABEL, "max-w-[55%] text-right")}>{c.sector}</span>
      </div>
      <div ref={inner} data-seen={seen} className="flex flex-col">
        {children}
      </div>
      <span className="mt-auto flex items-center justify-between pt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground">
        <span className="underline decoration-1 underline-offset-4 group-hover:no-underline">{readCase}</span>
        <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </span>
    </Link>
  );
}

function CaseCard({ c, readCase }: { c: OpsCase; readCase: string }) {
  const r = c.results;
  switch (c.slug) {
    case "monka": {
      const releases = r.find((x) => /^\d+$/.test(x.value) && Number(x.value) > 20 && x.value !== "165");
      const others = r.filter((x) => x.value !== "165");
      return (
        <Card c={c} span="md:col-span-2 lg:col-span-7 lg:row-span-2" readCase={readCase}>
          <Headline metric={c.metric} label={c.metricLabel} size="xl" />
          <div className="mt-9 grid grid-cols-3 gap-5 border-t border-border pt-6">
            {others.slice(0, 3).map((x) => (
              <Readout key={x.label} value={x.value} label={x.label} />
            ))}
          </div>
          {releases ? (
            <ReleaseStrip count={Number(releases.value)} caption={releases.label} />
          ) : null}
          {c.parts.length ? <Modules items={c.parts} /> : null}
        </Card>
      );
    }
    case "locservice": {
      const pct = c.metric?.match(/(\d+)\s?%/);
      const daily = r[1];
      return (
        <Card c={c} span="lg:col-span-5" readCase={readCase}>
          <Headline metric={c.metric} label={c.metricLabel} />
          {pct ? <Progress value={Number(pct[1]) / 100} /> : null}
          {daily ? (
            <p className="m-0 mt-5 flex items-center gap-3 text-[13px] text-soft-foreground">
              <LivePulse />
              <span>
                <span className="font-semibold text-foreground">{daily.value}</span> {daily.label.toLowerCase()}
              </span>
            </p>
          ) : null}
        </Card>
      );
    }
    case "afp": {
      const docs = r.find((x) => /M$/.test(x.value));
      const rest = r.filter((x) => x !== docs && /\d/.test(x.value));
      return (
        <Card c={c} span="lg:col-span-5" readCase={readCase}>
          {docs ? <Headline metric={docs.value} label={docs.label} /> : <Headline metric={c.metric} label={c.metricLabel} />}
          {c.parts.length ? (
            <>
              <p className={cn(LABEL, "m-0 mt-7")}>{c.metric}</p>
              <PartChips parts={c.parts} />
            </>
          ) : null}
          <div className="mt-6 grid grid-cols-2 gap-5 border-t border-border pt-5">
            {rest.slice(0, 2).map((x) => (
              <Readout key={x.label} value={x.value} label={x.label} />
            ))}
          </div>
        </Card>
      );
    }
    case "coup-de-pates": {
      const changes = r.find((x) => /^\d+$/.test(x.value));
      const rest = r.filter((x) => x !== changes);
      return (
        <Card c={c} span="lg:col-span-6" readCase={readCase}>
          {changes ? <Headline metric={changes.value} label={changes.label} /> : <Headline metric={c.metric} label={c.metricLabel} />}
          <DiffScan />
          <div className="mt-6 grid grid-cols-2 gap-5 border-t border-border pt-5">
            {rest.slice(0, 2).map((x) => (
              <div key={x.label} className="min-w-0">
                <p className="m-0 text-[20px] font-semibold tracking-[-0.02em] text-foreground">{x.value}</p>
                <p className="m-0 mt-1 text-[13px] leading-[1.4] text-muted-foreground">{x.label}</p>
              </div>
            ))}
          </div>
        </Card>
      );
    }
    case "theodo":
      return (
        <Card c={c} span="lg:col-span-6" readCase={readCase}>
          <Headline metric={c.metric} label={c.metricLabel} />
          <DevGrid />
        </Card>
      );
    default:
      return (
        <Card c={c} span="lg:col-span-6" readCase={readCase}>
          <Headline metric={c.metric} label={c.metricLabel} />
        </Card>
      );
  }
}

/**
 * The case studies as an ops board: every card is a running readout of what
 * the work produced, figures counting up as they arrive on screen.
 */
export function OpsBoard({ cases, clients, locale }: { cases: OpsCase[]; clients: OpsClient[]; locale: "fr" | "en" }) {
  const t = useTranslations("caseStudy");
  const ref = useRef<HTMLElement>(null);
  const run = useRun(ref);
  const c = COPY[locale];

  return (
    <section ref={ref} id="cases" data-run={run} className="bg-background">
      <div className="mx-auto max-w-[90rem] px-6 py-20 md:px-10 md:py-28 lg:px-16">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="mb-6 block font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <BrandSquare />
              {t("kicker")}
            </span>
            <h2 className="m-0 text-[clamp(40px,5.6vw,88px)] font-bold leading-[0.92] tracking-[-0.045em] text-foreground">
              {t("titleLine1")}
              <br />
              <span className="text-muted-foreground">{t("titleLine2")}</span>
            </h2>
          </div>
          <div className="flex items-center gap-6 font-mono text-[11px] uppercase tracking-[0.2em]">
            <span className="text-muted-foreground">
              <span className={cn(DOT, "mr-2 text-[22px] text-foreground")}>{String(cases.length).padStart(2, "0")}</span>
              {c.cases}
            </span>
            <Link
              href="/case-studies"
              className="text-foreground underline decoration-1 underline-offset-4 transition-colors hover:text-brand"
            >
              {t("seeAll")} →
            </Link>
          </div>
        </div>

        {/* Who the board runs for. Phones already have these logos at the
            foot of the poster hero. */}
        <div className="mt-16 hidden border-y border-border md:block">
          <p className={cn(LABEL, "m-0 border-b border-border py-3")}>{c.trusted}</p>
          <ul className="m-0 grid list-none grid-cols-2 p-0 sm:grid-cols-4 lg:grid-cols-8">
            {clients.map((client) => (
              <li key={client.name} className="border-b border-r border-border lg:border-b-0">
                <a
                  href={client.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-[72px] items-center justify-center px-4 opacity-70 transition-opacity hover:opacity-100"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={client.src}
                    alt={client.name}
                    {...clientLogoSize(client.src)}
                    className="max-h-[24px] w-auto max-w-[78%] object-contain brightness-0 invert"
                    loading="lazy"
                    decoding="async"
                  />
                </a>
              </li>
            ))}
            <li className="border-b border-border lg:border-b-0">
              <a
                href="#contact"
                className="flex h-[72px] items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-brand"
              >
                <span aria-hidden="true">+</span>
                {c.you}
              </a>
            </li>
          </ul>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 md:mt-8 md:grid-cols-2 lg:grid-cols-12 lg:gap-4">
          {cases.map((x) => (
            <CaseCard key={x.slug} c={x} readCase={t("readCase")} />
          ))}
        </div>
      </div>
    </section>
  );
}

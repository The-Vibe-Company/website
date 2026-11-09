"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRef, type CSSProperties } from "react";
import { BrandSquare } from "@/components/BrandSquare";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/design-system";
import { AGENCY_PARIS_PATHS, splitPath } from "@/lib/site";
import { DOT, useRun } from "./primitives";
import s from "./live.module.css";

type Locale = "fr" | "en";

const STAGES: Record<Locale, string[]> = {
  fr: ["Cadrage", "Cycle", "Review", "Prod"],
  en: ["Scope", "Cycle", "Review", "Prod"],
};

const FLOW: Record<Locale, { inputs: string[]; agent: string; draft: string; human: string }> = {
  fr: { inputs: ["Mail", "CRM", "Docs"], agent: "Agent", draft: "Brouillon", human: "Humain ✓" },
  en: { inputs: ["Mail", "CRM", "Docs"], agent: "Agent", draft: "Draft", human: "Human ✓" },
};

const ROAD: Record<Locale, string[]> = {
  fr: ["Audit", "Priorités", "Build / buy", "Formation", "En prod"],
  en: ["Audit", "Priorities", "Build / buy", "Training", "In prod"],
};

/** A build travelling through the stages of a short cycle, into production. */
function Pipeline({ locale }: { locale: Locale }) {
  const stages = STAGES[locale];
  return (
    <div className="flex h-full flex-col justify-center gap-5 px-5">
      <ol className="m-0 grid list-none grid-cols-4 gap-2 p-0">
        {stages.map((stage, i) => (
          <li
            key={stage}
            className={cn(s.node, "flex h-16 flex-col justify-between border border-border-strong bg-background px-2 py-2 font-mono text-[9px] uppercase tracking-[0.06em] text-muted-foreground")}
            style={{ "--i": i, "--steps": stages.length } as CSSProperties}
          >
            <span>{String(i + 1).padStart(2, "0")}</span>
            <span className="truncate">{stage}</span>
          </li>
        ))}
      </ol>
      {/* The build itself, carried along the line from stage to stage. */}
      <div aria-hidden="true" className="relative h-px bg-border-strong">
        <span className={cn(s.packet, "absolute top-0 -mt-[3px] -ml-[3px] h-[7px] w-[7px] bg-brand")} />
      </div>
    </div>
  );
}

/** Tools wired into an agent, whose draft a human signs off. */
function AgentFlow({ locale }: { locale: Locale }) {
  const f = FLOW[locale];
  const node = (i: number) => ({ "--i": i, "--steps": 5 }) as CSSProperties;
  const label = "fill-[var(--soft-foreground)] font-mono text-[9px] uppercase tracking-[0.08em]";
  return (
    <svg viewBox="0 0 320 150" className="h-full w-full" role="img" aria-label={`${f.inputs.join(", ")} → ${f.agent} → ${f.draft} → ${f.human}`}>
      {f.inputs.map((_, i) => (
        <path key={i} d={`M 70 ${27 + i * 48} C 105 ${27 + i * 48}, 105 75, 136 75`} className={cn(s.flow, "fill-none stroke-[var(--border-strong)]")} strokeWidth="1" />
      ))}
      <path d="M 184 75 C 200 75, 200 47, 216 47" className={cn(s.flow, "fill-none stroke-[var(--brand)]")} strokeWidth="1" />
      <path d="M 184 75 C 200 75, 200 103, 216 103" className={cn(s.flow, "fill-none stroke-[var(--border-strong)]")} strokeWidth="1" />
      {f.inputs.map((input, i) => (
        <g key={input}>
          <rect x="6" y={14 + i * 48} width="64" height="26" className={cn(s.svgNode, "fill-[var(--background)] stroke-[var(--border-strong)]")} style={node(0)} strokeWidth="1" />
          <text x="38" y={31 + i * 48} textAnchor="middle" className={label}>
            {input}
          </text>
        </g>
      ))}
      <rect x="136" y="53" width="48" height="44" className={cn(s.svgNode, "fill-[var(--background)] stroke-[var(--border-strong)]")} style={node(1)} strokeWidth="1" />
      <rect x="156" y="71" width="8" height="8" className="fill-[var(--brand)]" />
      <text x="160" y="112" textAnchor="middle" className={label}>
        {f.agent}
      </text>
      <rect x="216" y="34" width="98" height="26" className={cn(s.svgNode, "fill-[var(--background)] stroke-[var(--border-strong)]")} style={node(2)} strokeWidth="1" />
      <text x="265" y="51" textAnchor="middle" className={label}>
        {f.draft}
      </text>
      <rect x="216" y="90" width="98" height="26" className={cn(s.svgNode, "fill-[var(--background)] stroke-[var(--border-strong)]")} style={node(3)} strokeWidth="1" />
      <text x="265" y="107" textAnchor="middle" className={label}>
        {f.human}
      </text>
    </svg>
  );
}

/** An adoption roadmap filling up, milestone by milestone. */
function Roadmap({ locale }: { locale: Locale }) {
  const steps = ROAD[locale];
  const milestones = [s.m0, s.m1, s.m2, s.m3, s.m4];
  return (
    <div className="flex h-full items-center px-6">
      <div className="relative w-full">
        <div className="relative h-px bg-border-strong">
          <span aria-hidden="true" className={cn(s.road, "absolute inset-0 bg-brand")} />
        </div>
        <ol className="absolute inset-x-0 top-0 m-0 list-none p-0">
          {steps.map((step, i) => (
            <li
              key={step}
              className="absolute top-0 flex -translate-x-1/2 flex-col items-center"
              style={{ left: `${(i / (steps.length - 1)) * 100}%` }}
            >
              <span aria-hidden="true" className={cn(s.milestone, milestones[i], "-mt-[5px] h-[10px] w-[10px] border border-border-strong bg-background")} />
              <span
                className={cn(
                  "absolute whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.08em] text-soft-foreground",
                  i % 2 === 0 ? "top-4" : "-top-7",
                  i === 0 && "left-0 translate-x-[-4px]",
                  i === steps.length - 1 && "right-0 translate-x-[4px]",
                )}
              >
                {step}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

const ITEMS = [
  { key: "build", Diagram: Pipeline },
  { key: "operate", Diagram: AgentFlow },
  { key: "advise", Diagram: Roadmap },
] as const;

/**
 * The three services as three running machines: each panel's diagram plays
 * what the service does, the copy and lists sit under it.
 */
export function ServicesPanels() {
  const t = useTranslations("services");
  const tParis = useTranslations("agencyParis");
  const locale = (useLocale() === "fr" ? "fr" : "en") as Locale;
  const ref = useRef<HTMLElement>(null);
  const run = useRun(ref);

  return (
    <section ref={ref} id="services" data-run={run} className="border-t border-border bg-background">
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
          <Link
            href={splitPath(AGENCY_PARIS_PATHS, locale)}
            className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground underline decoration-1 underline-offset-4 transition-colors hover:text-brand"
          >
            {tParis("homeLink")} →
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 border border-border md:mt-16 lg:grid-cols-3">
          {ITEMS.map(({ key, Diagram }, i) => {
            const bullets = t.raw(`items.${key}.bullets`) as string[];
            return (
              <article
                key={key}
                className="flex flex-col border-b border-border last:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0"
              >
                <div className="flex items-center justify-between border-b border-border px-6 py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground md:px-7">
                  <span className={cn(DOT, "text-[22px] leading-none text-foreground")}>{String(i + 1).padStart(2, "0")}</span>
                  <span>{t(`items.${key}.tag`)}</span>
                </div>
                <div className="h-[168px] border-b border-border bg-card/40">
                  <Diagram locale={locale} />
                </div>
                <div className="flex flex-1 flex-col px-6 pb-8 pt-7 md:px-7">
                  <h3 className="m-0 text-[26px] font-bold leading-[1.05] tracking-[-0.03em] text-foreground">
                    {t(`items.${key}.title`)}
                  </h3>
                  <p className="m-0 mt-4 text-[15px] leading-[1.55] text-muted-foreground">{t(`items.${key}.desc`)}</p>
                  <ul className="m-0 mt-6 flex list-none flex-col gap-2.5 border-t border-border p-0 pt-5">
                    {bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3 text-[13px] leading-[1.5] text-soft-foreground">
                        <span aria-hidden="true" className="pt-[7px]">
                          <span className="block h-1 w-1 bg-muted-foreground" />
                        </span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

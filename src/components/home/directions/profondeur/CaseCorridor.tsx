"use client";

import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRef, useState, type CSSProperties } from "react";
import { BrandSquare } from "@/components/BrandSquare";
import { Link } from "@/i18n/navigation";
import { clientLogoSize } from "@/lib/client-logos";
import { cn } from "@/lib/design-system";
import { extrude } from "./extrude";
import { Horizon } from "./Horizon";
import { usePointer } from "./pointer";
import s from "./profondeur.module.css";

export interface DeepCase {
  slug: string;
  client: string;
  logo: string;
  sector: string;
  metric?: string;
  metricLabel?: string;
  results: { value: string; label: string }[];
}

const COPY = {
  fr: { travel: "Faites défiler pour avancer" },
  en: { travel: "Scroll to move forward" },
};

const METRIC_SHADOW = extrude({ dx: 0, dy: 1, steps: 10, unit: 0.85 });

function CaseBody({ c, readLabel, onFocus }: { c: DeepCase; readLabel: string; onFocus?: () => void }) {
  const numeric = /\d/.test(c.metric ?? "");
  return (
    <>
      <div className="flex items-start justify-between gap-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={c.logo}
          alt={c.client}
          {...clientLogoSize(c.logo)}
          className="h-7 w-auto max-w-[150px] object-contain object-left brightness-0 invert md:h-8"
          loading="lazy"
          decoding="async"
        />
        <span className="max-w-[22ch] text-right font-mono text-[10px] uppercase leading-[1.5] tracking-[0.16em] text-muted-foreground">
          {c.sector}
        </span>
      </div>
      {c.metric ? (
        <p
          className={cn(
            "m-0 mt-10 font-extrabold leading-[0.9] tracking-[-0.045em]",
            numeric ? "text-[clamp(3.5rem,6.2vw,6rem)]" : "text-[clamp(2.4rem,4vw,3.75rem)]",
          )}
        >
          <span className={s.extrude}>
            <span aria-hidden="true" className="text-background" style={{ textShadow: METRIC_SHADOW }}>
              {c.metric}
            </span>
            <span className={s.faceQuiet}>{c.metric}</span>
          </span>
        </p>
      ) : null}
      {c.metricLabel ? <p className="m-0 mt-4 max-w-[36ch] text-[15px] leading-[1.5] text-soft-foreground">{c.metricLabel}</p> : null}
      {c.results.length ? (
        <dl className="m-0 mt-7 grid grid-cols-2 gap-x-6 border-t border-border pt-5">
          {c.results.map((r) => (
            <div key={r.label} className="min-w-0">
              <dt className="sr-only">{r.label}</dt>
              <dd className="m-0 text-[22px] font-bold tracking-[-0.02em] text-foreground">{r.value}</dd>
              <dd className="m-0 mt-1 text-[12px] leading-[1.4] text-muted-foreground">{r.label}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      <Link
        href={`/case-studies/${c.slug}?from=home`}
        onFocus={onFocus}
        className="mt-8 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground underline decoration-1 underline-offset-4 transition-colors hover:text-brand"
      >
        {readLabel} <span aria-hidden="true" className="text-brand">→</span>
      </Link>
    </>
  );
}

/** One panel of the corridor, placed by its distance `d` from the camera's focus. */
function CorridorPanel({ c, index, p, readLabel, onFocus }: {
  c: DeepCase;
  index: number;
  p: MotionValue<number>;
  readLabel: string;
  onFocus: () => void;
}) {
  const side = index % 2 === 0 ? -1 : 1;
  const d = useTransform(p, (v) => index - v);
  // Ahead: far down the corridor, pushed toward its wall. Passed: flying past
  // the camera and fading.
  const transform = useTransform(d, (v) => {
    const z = -v * 1050;
    const x = side * (210 + Math.max(0, v) * 140);
    const ry = side * -12 * Math.min(1, Math.max(0, v));
    return `translate(-50%, -50%) translate3d(${x.toFixed(1)}px, 0px, ${z.toFixed(1)}px) rotateY(${ry.toFixed(2)}deg)`;
  });
  const opacity = useTransform(d, [-0.42, -0.1, 0, 2, 3.4], [0, 1, 1, 0.55, 0]);
  const filter = useTransform(d, (v) => `blur(${Math.min(9, Math.max(0, Math.abs(v) - 0.18) * 6).toFixed(2)}px)`);
  const visibility = useTransform(opacity, (o) => (o < 0.02 ? "hidden" : "visible"));
  const pointerEvents = useTransform(d, (v) => (Math.abs(v) < 0.45 ? "auto" : "none"));
  const edge = useTransform(d, (v) => Math.max(0.12, 1 - Math.abs(v) * 1.6));

  return (
    <motion.article
      style={{ transform, opacity, filter, visibility, pointerEvents, "--edge": edge } as unknown as CSSProperties}
      className={cn(s.lit, "absolute left-1/2 top-[61%] w-[min(540px,40vw)] p-8 shadow-[0_60px_120px_-40px_rgb(0_0_0/0.9),0_40px_80px_-50px_rgb(242_115_19/0.5)] will-change-transform")}
    >
      <CaseBody c={c} readLabel={readLabel} onFocus={onFocus} />
    </motion.article>
  );
}

/**
 * The case studies as a corridor you walk down: each case is a panel floating
 * in the dark, far ahead and blurred, coming into focus as you scroll, then
 * sliding past the camera. Panels alternate walls; the floor and the horizon
 * stay under them. Phones and reduced motion get the same panels as a list.
 */
export function CaseCorridor({ cases, locale }: { cases: DeepCase[]; locale: "fr" | "en" }) {
  const t = useTranslations("caseStudy");
  const ref = useRef<HTMLElement>(null);
  const n = cases.length;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useTransform(scrollYProgress, (v) => -0.45 + v * (n - 1 + 0.45));
  const { x: px, y: py } = usePointer();
  const rotateY = useTransform(px, (v) => v * 3.5);
  const rotateX = useTransform(py, (v) => v * -2.5);
  const travel = useTransform(scrollYProgress, [0, 1], [0, 2400]);
  const [current, setCurrent] = useState(0);
  useMotionValueEvent(p, "change", (v) => setCurrent(Math.min(n - 1, Math.max(0, Math.round(v)))));
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Tabbing onto a panel's link walks the camera to that panel.
  const focusCase = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const range = el.offsetHeight - window.innerHeight;
    const progress = (i + 0.45) / (n - 1 + 0.45);
    window.scrollTo({ top: top + progress * range, behavior: "instant" });
  };

  const heading = (compact: boolean) => (
    <>
      <p className="m-0 font-mono text-[11px] uppercase tracking-[0.2em] text-soft-foreground md:text-[12px]">
        <BrandSquare />
        {t("kicker")}
      </p>
      <h2
        className={cn(
          "m-0 mt-5 font-extrabold leading-[0.95] tracking-[-0.045em] text-foreground",
          compact ? "text-[clamp(2rem,3.3vw,3rem)]" : "text-[clamp(2.25rem,4.6vw,4rem)]",
        )}
      >
        {t("titleLine1")}
        <br />
        <span className="text-soft-foreground">{t("titleLine2")}</span>
      </h2>
    </>
  );

  return (
    <section
      ref={ref}
      id="cases"
      style={{ "--corridor": `${n * 95 + 40}vh` } as CSSProperties}
      className="relative md:h-[var(--corridor)] motion-reduce:h-auto md:motion-reduce:h-auto"
    >
      {/* The corridor, from md up and with motion allowed. */}
      <div className="sticky top-16 hidden h-[calc(100svh-64px)] overflow-hidden md:block lg:top-[84px] lg:h-[calc(100svh-84px)] motion-reduce:hidden!">
        <Horizon horizon="74%" px={px} travel={travel} glow={0.75} />
        <div className="relative z-10 mx-auto max-w-[90rem] px-10 pt-10 lg:px-16 lg:pt-10">{heading(true)}</div>

        <div className="absolute inset-0 [perspective:1100px] [perspective-origin:50%_52%]">
          <motion.div style={{ rotateX, rotateY }} className="absolute inset-0 [transform-style:preserve-3d]">
            {cases.map((c, i) => (
              <CorridorPanel key={c.slug} c={c} index={i} p={p} readLabel={t("readCase")} onFocus={() => focusCase(i)} />
            ))}
          </motion.div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 mx-auto flex max-w-[90rem] items-end justify-between gap-6 px-10 pb-8 lg:px-16">
          <div className="flex items-center gap-5 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            <span className="tabular-nums text-foreground">
              {String(current + 1).padStart(2, "0")} <span className="text-muted-foreground">/ {String(n).padStart(2, "0")}</span>
            </span>
            <span aria-hidden="true" className="relative block h-px w-40 bg-border">
              <motion.span style={{ width: bar }} className="absolute inset-y-0 left-0 bg-brand shadow-[0_0_10px_rgb(242_115_19/0.8)]" />
            </span>
            <span className="hidden lg:inline">{COPY[locale].travel}</span>
          </div>
          <Link
            href="/case-studies"
            className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground underline decoration-1 underline-offset-4 transition-colors hover:text-brand"
          >
            {t("seeAll")} <span aria-hidden="true" className="text-brand">→</span>
          </Link>
        </div>
      </div>

      {/* Phones and reduced motion: the same panels, one under the other. */}
      <div className="relative z-10 mx-auto max-w-[90rem] px-6 py-20 md:hidden md:px-10 lg:px-16 motion-reduce:block!">
        {heading(false)}
        <ol className="m-0 mt-10 grid list-none gap-6 p-0 md:grid-cols-2">
          {cases.map((c) => (
            <li key={c.slug} className={cn(s.lit, "relative p-7 md:p-9")}>
              <CaseBody c={c} readLabel={t("readCase")} />
            </li>
          ))}
        </ol>
        <Link
          href="/case-studies"
          className="mt-10 inline-flex font-mono text-[11px] uppercase tracking-[0.2em] text-foreground underline decoration-1 underline-offset-4"
        >
          {t("seeAll")} <span aria-hidden="true" className="ml-2 text-brand">→</span>
        </Link>
      </div>
    </section>
  );
}

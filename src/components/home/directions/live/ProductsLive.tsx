"use client";

import { useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { BrandSquare } from "@/components/BrandSquare";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/design-system";
import { LivePulse, ParisClock, trackPointer, useRun } from "./primitives";
import s from "./live.module.css";

export interface LogLine {
  stamp: string;
  verb: "ship" | "run";
  who: string;
  text: string;
}

export interface ProductTile {
  slug: string;
  name: string;
  logo: string;
  tag: string;
  date: string;
  status: string;
  kind: "live" | "oss" | "internal";
}

const ORG_URL = "https://github.com/The-Vibe-Company";

/** How many lines the journal shows at once. */
const VISIBLE = 15;
const CHAR_MS = 16;
const LINE_PAUSE_MS = 900;

/** One log line as plain text, columns padded, for the line being typed. */
function plain(line: LogLine) {
  return `${line.stamp.padEnd(11)}${line.verb.padEnd(6)}${line.who.padEnd(15)}${line.text}`;
}

function Line({ line }: { line: LogLine }) {
  return (
    <p className="m-0 overflow-hidden text-ellipsis whitespace-pre">
      <span className="text-muted">{line.stamp.padEnd(11)}</span>
      <span className={line.verb === "ship" ? "text-brand" : "text-soft-foreground"}>{line.verb.padEnd(6)}</span>
      <span className="text-foreground">{line.who.padEnd(15)}</span>
      <span className="text-muted-foreground">{line.text}</span>
    </p>
  );
}

/**
 * The workshop's journal: what shipped and what is running, typed in line by
 * line. The server renders the first screenful, so it reads complete without
 * script or with reduced motion; it only types while on screen.
 */
function Journal({ lines, title }: { lines: LogLine[]; title: string }) {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement>(null);
  const run = useRun(ref);
  const [shown, setShown] = useState(() => lines.slice(0, VISIBLE - 1));
  const [next, setNext] = useState(VISIBLE - 1);
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (reduce || !run || lines.length === 0) return;
    const target = plain(lines[next % lines.length]);
    const done = typed >= target.length;
    const id = window.setTimeout(
      () => {
        if (!done) {
          setTyped((n) => n + 1);
          return;
        }
        setShown((prev) => [...prev, lines[next % lines.length]].slice(-(VISIBLE - 1)));
        setNext((n) => n + 1);
        setTyped(0);
      },
      done ? LINE_PAUSE_MS : CHAR_MS,
    );
    return () => window.clearTimeout(id);
  }, [reduce, run, lines, next, typed]);

  const typing = lines.length ? plain(lines[next % lines.length]).slice(0, typed) : "";

  return (
    <div ref={ref} data-run={run} className="flex h-full flex-col border border-border bg-card/60">
      <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        <span className="flex items-center gap-3">
          <span aria-hidden="true" className="flex gap-1.5">
            <span className="h-2 w-2 border border-border-strong" />
            <span className="h-2 w-2 border border-border-strong" />
            <span className="h-2 w-2 bg-brand" />
          </span>
          {title}
        </span>
        <span className="flex items-center gap-2">
          <LivePulse />
          <ParisClock />
        </span>
      </div>
      <div className="flex-1 overflow-hidden px-4 py-4 font-mono text-[11px] leading-[1.9] md:text-[12px]" aria-live="off">
        {shown.map((line, i) => (
          <Line key={`${line.who}-${line.text}-${i}`} line={line} />
        ))}
        <p className="m-0 overflow-hidden whitespace-pre text-soft-foreground">
          {reduce ? null : typing}
          <span aria-hidden="true" className={s.caret} />
        </p>
      </div>
    </div>
  );
}

function StatusLight({ kind }: { kind: ProductTile["kind"] }) {
  if (kind === "live") return <LivePulse />;
  if (kind === "oss") return <span aria-hidden="true" className="h-2 w-2 bg-soft-foreground" />;
  return <span aria-hidden="true" className="h-2 w-2 border border-muted-foreground" />;
}

/**
 * Our own products: the journal of what we shipped beside the products
 * themselves, as app tiles with their status light.
 */
export function ProductsLive({ lines, products, locale }: { lines: LogLine[]; products: ProductTile[]; locale: "fr" | "en" }) {
  const t = useTranslations("proof");
  const ref = useRef<HTMLElement>(null);
  const run = useRun(ref);

  return (
    <section ref={ref} id="proof" data-run={run} className="border-t border-border bg-background">
      <div className="mx-auto max-w-[90rem] px-6 py-20 md:px-10 md:py-28 lg:px-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] md:items-end">
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
          <p className="m-0 text-[16px] leading-[1.6] text-muted-foreground">{t("intro")}</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-3 md:mt-16 lg:grid-cols-12 lg:gap-4">
          <div className="min-w-0 lg:col-span-5">
            <Journal lines={lines} title={locale === "fr" ? "journal de bord" : "ship log"} />
          </div>
          <ul className="m-0 grid min-w-0 list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:col-span-7 lg:gap-4">
            {products.map((p) => (
              <li key={p.slug} className="min-w-0">
                <Link
                  href={`/portfolio/${p.slug}`}
                  onPointerMove={trackPointer}
                  className={cn(
                    s.spot,
                    "group flex h-full flex-col border border-border bg-background p-4 no-underline transition-colors duration-300 hover:border-border-strong hover:bg-card md:p-5",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.logo} alt="" aria-hidden="true" className="h-9 w-9 rounded-md object-contain" loading="lazy" decoding="async" />
                    <span aria-hidden="true" className="text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-foreground">
                      ↗
                    </span>
                  </div>
                  <p className="m-0 mt-5 font-mono text-[16px] font-bold tracking-[-0.02em] text-foreground md:text-[17px]">{p.name}</p>
                  <p className="m-0 mt-1 text-[13px] leading-[1.4] text-muted-foreground">{p.tag}</p>
                  <p className="m-0 mt-auto flex items-center justify-between gap-2 pt-5 font-mono text-[10px] uppercase tracking-[0.14em] text-soft-foreground">
                    <span className="flex min-w-0 items-center gap-2">
                      <StatusLight kind={p.kind} />
                      <span className="truncate">{p.status}</span>
                    </span>
                    <span className="hidden shrink-0 text-muted-foreground sm:inline">{p.date}</span>
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <a
          href={ORG_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground underline decoration-1 underline-offset-4 transition-colors hover:text-brand"
        >
          {t("browseAll")}
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}

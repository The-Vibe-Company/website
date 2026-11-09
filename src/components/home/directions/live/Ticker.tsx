"use client";

import { Pause, Play } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/design-system";
import { LivePulse, useRun } from "./primitives";
import s from "./live.module.css";

export interface TickerFact {
  who: string;
  value: string;
  label: string;
}

const COPY = {
  fr: { live: "En direct", pause: "Mettre le fil en pause", play: "Relancer le fil", list: "Ce qui tourne chez nos clients et dans nos produits" },
  en: { live: "Live", pause: "Pause the feed", play: "Play the feed", list: "What is running for our clients and in our products" },
};

function Fact({ fact }: { fact: TickerFact }) {
  return (
    <li className="flex shrink-0 items-center gap-3 whitespace-nowrap px-7">
      <span aria-hidden="true" className="h-1.5 w-1.5 bg-soft-foreground/60" />
      <span className="text-soft-foreground">{fact.who}</span>
      <span aria-hidden="true" className="text-border-strong">
        /
      </span>
      <span className="font-semibold text-foreground">{fact.value}</span>
      <span className="text-muted-foreground">{fact.label}</span>
    </li>
  );
}

/**
 * The band under the hero: an endless feed of what is running, every fact
 * lifted from a case study or the product catalogue. It stops on hover, on
 * its pause button, when scrolled away, and does not move at all for reduced
 * motion (the row then scrolls sideways by hand).
 */
export function Ticker({ facts, locale }: { facts: TickerFact[]; locale: "fr" | "en" }) {
  const ref = useRef<HTMLElement>(null);
  const run = useRun(ref);
  const [paused, setPaused] = useState(false);
  const c = COPY[locale];

  return (
    <section
      ref={ref}
      aria-label={c.list}
      data-paused={paused || !run}
      className={cn(s.ticker, "border-y border-border bg-background")}
    >
      <div className="flex items-stretch font-mono text-[11px] uppercase tracking-[0.16em] md:text-[12px]">
        <p className="m-0 flex shrink-0 items-center gap-3 border-r border-border bg-background px-5 text-foreground md:px-8">
          <LivePulse />
          {c.live}
        </p>
        <div className={cn(s.tickerViewport, "relative min-w-0 flex-1 overflow-hidden motion-reduce:overflow-x-auto")}>
          <div className={cn(s.tickerTrack, "py-4")}>
            <ul className="m-0 flex list-none p-0">
              {facts.map((fact) => (
                <Fact key={`${fact.who}-${fact.label}`} fact={fact} />
              ))}
            </ul>
            {/* The same row again, so the loop has no seam; hidden from
                assistive technology, which reads the first copy once. */}
            <ul aria-hidden="true" className="m-0 flex list-none p-0 motion-reduce:hidden">
              {facts.map((fact) => (
                <Fact key={`copy-${fact.who}-${fact.label}`} fact={fact} />
              ))}
            </ul>
          </div>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent"
          />
        </div>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          aria-label={paused ? c.play : c.pause}
          className="flex w-12 shrink-0 cursor-pointer items-center justify-center border-l border-border text-muted-foreground transition-colors hover:text-foreground motion-reduce:hidden md:w-14"
        >
          {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
        </button>
      </div>
    </section>
  );
}

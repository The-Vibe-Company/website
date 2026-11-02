import type { CSSProperties, ReactNode } from "react";
import { getTranslations } from "next-intl/server";

import { QUIVR_REPO, QUIVR_REPO_URL } from "@/lib/quivr";

import { PlayOnView } from "./PlayOnView";
import { Headline, SourceIcon, type SourceKind } from "./QuivrStage";
import s from "./quivr.module.css";

/**
 * "How it works" on the Quivr project page: a feature grid planned with the
 * Stageshow skill's bento rules (.agents/skills/stageshow/references/bento.md).
 *
 *   Tile        Span   Kind        The one thing                     Moves
 *   Search      2 × 1  Hero UI     a query, the passage that matched  typed, then the result rises
 *   License     1 × 1  Statement   "MIT", on the one ink tile         holds still
 *   Versions    1 × 1  Component   an article and its correction      the old word is struck
 *   Sources     1 × 1  Collection  the four kinds of source           the pills drift in
 *   Outputs     1 × 1  Component   API, webhooks, change feed, MCP    the status dots light up
 *   YC          1 × 1  Statement   the Y Combinator W24 mark          holds still
 *   Self-host   2 × 1  Diagram     the engine and what it runs on     the wires draw in
 *
 * A ruled grid in the house style (one ink frame, hairlines between cells),
 * copy at the top of every tile, each picture pinned to its tile's foot.
 * Each tile plays its one beat once as it scrolls in, 110ms after the tile
 * before it in its row (--i). Every fact comes from the Quivr README
 * or docs.quivr.thevibecompany.co; the articles are samples.
 */

const MONO = "font-mono text-[10px] uppercase tracking-[0.16em]";
const SOURCES: SourceKind[] = ["feed", "mail", "x", "app"];

function Tile({
  area,
  index,
  title,
  body,
  dark = false,
  children,
}: {
  area: string;
  index: number;
  title: string;
  body: string;
  dark?: boolean;
  children: ReactNode;
}) {
  return (
    <PlayOnView
      className={`${s.tile} ${area} ${dark ? "bg-foreground text-background" : "bg-background text-foreground"}`}
      data-surface={dark ? "inverse" : undefined}
      style={{ "--i": index } as CSSProperties}
    >
      <div className="relative z-[1] max-w-[440px] px-6 pt-6 text-[19px] leading-[1.35] tracking-[-0.015em] md:px-7 md:pt-7 md:text-[20px]">
        <h3 className="m-0 inline text-[length:inherit] font-semibold">{title}</h3>{" "}
        <p className={`m-0 inline ${dark ? "text-white/65" : "text-muted-foreground"}`}>{body}</p>
      </div>
      {children}
    </PlayOnView>
  );
}

/** A placeholder line: filler, never where the eye lands. */
function Bar({ w, className = "bg-border" }: { w: number | string; className?: string }) {
  return <span className={`block h-1.5 shrink-0 ${className}`} style={{ width: w }} />;
}

function GitHubMark() {
  // GitHub's mark, from the Stageshow kit (kit/brands/github.svg, SVGL).
  return (
    <svg width="16" height="16" viewBox="0 0 1024 1024" aria-hidden="true" className="shrink-0">
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M512 0C229.12 0 0 229.12 0 512c0 226.56 146.56 417.92 350.08 485.76 25.6 4.48 35.2-10.88 35.2-24.32 0-12.16-.64-52.48-.64-95.36-128.64 23.68-161.92-31.36-172.16-60.16-5.76-14.72-30.72-60.16-52.48-72.32-17.92-9.6-43.52-33.28-.64-33.92 40.32-.64 69.12 37.12 78.72 52.48 46.08 77.44 119.68 55.68 149.12 42.24 4.48-33.28 17.92-55.68 32.64-68.48-113.92-12.8-232.96-56.96-232.96-252.8 0-55.68 19.84-101.76 52.48-137.6-5.12-12.8-23.04-65.28 5.12-135.68 0 0 42.88-13.44 140.8 52.48 40.96-11.52 84.48-17.28 128-17.28s87.04 5.76 128 17.28c97.92-66.56 140.8-52.48 140.8-52.48 28.16 70.4 10.24 122.88 5.12 135.68 32.64 35.84 52.48 81.28 52.48 137.6 0 196.48-119.68 240-233.6 252.8 18.56 16 34.56 46.72 34.56 94.72 0 68.48-.64 123.52-.64 140.8 0 13.44 9.6 29.44 35.2 24.32C877.44 929.92 1024 737.92 1024 512 1024 229.12 794.88 0 512 0"
      />
    </svg>
  );
}

export async function QuivrBento({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "quivr.features" });
  const sources = t.raw("sources.items") as string[];
  const outputs = t.raw("outputs.items") as { label: string; note: string }[];
  const stack = t.raw("selfHost.stack") as string[];

  const sourcePill = (i: number) => (
    <span
      key={`s-${i}`}
      className="inline-flex h-11 shrink-0 items-center gap-2.5 border border-foreground bg-background pl-2 pr-4 text-[14px] font-semibold"
    >
      <SourceIcon kind={SOURCES[i] ?? "feed"} />
      {sources[i]}
    </span>
  );
  const fillerPill = (key: string, w: number) => (
    <span key={key} className="inline-flex h-11 shrink-0 items-center gap-2.5 border border-border bg-background pl-2 pr-4" style={{ width: w }}>
      <span className="h-7 w-7 shrink-0 border border-border" />
      <Bar w="60%" />
    </span>
  );

  return (
    <div className={`${s.grid} gap-px border border-foreground bg-border`}>
      {/* Search: the hero. A query in the field, the passage that matched. */}
      <Tile area={s.search} index={0} title={t("search.title")} body={t("search.body")}>
        <div aria-hidden="true" className={`${s.picture} ${s.fadeFoot}`}>
          <div className="absolute inset-x-6 top-6 md:inset-x-7">
            <div className="flex h-12 items-center gap-3 border-2 border-foreground bg-background px-3.5">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0">
                <circle cx="7" cy="7" r="4.5" />
                <path d="m10.5 10.5 3.5 3.5" />
              </svg>
              <span className="flex min-w-0 items-center text-[15px] text-foreground">
                <span className={`truncate ${s.typed}`}>{t("search.query")}</span>
                <span className={`ml-0.5 h-5 w-px shrink-0 bg-foreground ${s.caret}`} />
              </span>
              <span className={`ml-auto hidden shrink-0 border border-border px-2 py-1 leading-none text-muted-foreground sm:inline ${MONO}`}>
                {t("search.mode")}
              </span>
            </div>
            <div className={`mt-3 border border-foreground bg-background p-4 ${s.result}`}>
              <div className="flex items-start gap-3">
                <SourceIcon kind="feed" />
                <div className="min-w-0">
                  <div className="text-[15px] font-semibold leading-[1.35]">{t("search.result.title")}</div>
                  <div className="mt-0.5 text-[12px] text-muted-foreground">{t("search.result.source")}</div>
                </div>
              </div>
              <p className="m-0 mt-3 border-l-2 border-orange-500 pl-3 text-[14px] leading-[1.55] text-foreground">
                <span className={s.passage}>{t("search.result.passage")}</span>
              </p>
            </div>
            {["58%", "46%"].map((w) => (
              <div key={w} className="mt-3 flex items-start gap-3 border border-border bg-background p-4">
                <span className="h-7 w-7 shrink-0 border border-border" />
                <div className="flex flex-1 flex-col gap-2.5 pt-1.5">
                  <Bar w={w} className="bg-foreground/20" />
                  <Bar w="30%" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Tile>

      {/* License: the one ink tile, the statement in large type. */}
      <Tile area={s.license} index={1} title={t("license.title")} body={t("license.body")} dark>
        <div className="mt-auto flex flex-col items-start px-6 pb-6 pt-8 md:px-7 md:pb-7">
          <span className={`text-white/55 ${MONO}`}>{t("license.label")}</span>
          {/* Sized to the tile (cqi), so it never runs past the gutter. */}
          <span
            className="mt-1 font-bold leading-[0.85] tracking-[-0.05em]"
            style={{ fontSize: "min(168px, calc((100cqi - 64px) / 1.7))" }}
          >
            {t("license.value")}
          </span>
          <a
            href={QUIVR_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex min-h-11 items-center gap-2 font-mono text-[13px] text-background underline decoration-1 underline-offset-4 hover:decoration-2"
          >
            <GitHubMark />
            {QUIVR_REPO}
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </Tile>

      {/* Versions: the earlier headline kept, the corrected one on top. */}
      <Tile area={s.versions} index={0} title={t("versions.title")} body={t("versions.body")}>
        <div aria-hidden="true" className={s.picture}>
          <div className="absolute inset-x-6 top-6 md:inset-x-7">
            <div className="border border-border bg-background px-4 py-3 text-muted-foreground">
              <span className={MONO}>v1</span>
              <p className="m-0 mt-1.5 text-[14px] leading-[1.4]">
                <Headline text={t("versions.before")} markClassName={s.strike} />
              </p>
            </div>
            <div className={`mt-3 border-2 border-foreground bg-background px-4 py-3 shadow-[6px_6px_0_0_var(--border)] ${s.later}`}>
              <div className="flex items-center gap-2">
                <span className={`text-foreground ${MONO}`}>v2</span>
                <span className={`border border-border px-1.5 leading-4 text-muted-foreground ${MONO}`}>
                  {t("versions.corrected")}
                </span>
              </div>
              <p className="m-0 mt-1.5 text-[15px] font-semibold leading-[1.4] text-foreground">
                <Headline text={t("versions.after")} markClassName="bg-orange-500/15 px-0.5" />
              </p>
              <div className="mt-3 flex flex-col gap-2">
                {["92%", "78%", "85%", "64%", "88%", "72%"].map((w) => (
                  <Bar key={w} w={w} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Tile>

      {/* Sources: the four kinds, among others, running off both sides. */}
      <Tile area={s.sources} index={1} title={t("sources.title")} body={t("sources.body")}>
        <div aria-hidden="true" className={`${s.picture} ${s.fadeSides}`}>
          <div className="absolute left-1/2 top-1/2 w-[560px] -translate-x-1/2 -translate-y-1/2">
            <div className={`flex flex-col items-center gap-3 ${s.drift}`}>
              <div className="flex gap-3">
                {fillerPill("a", 112)}
                {sourcePill(0)}
                {sourcePill(1)}
                {fillerPill("b", 120)}
              </div>
              <div className="flex gap-3 pl-16">
                {fillerPill("c", 96)}
                {sourcePill(2)}
                {sourcePill(3)}
                {fillerPill("d", 104)}
              </div>
              <div className="flex gap-3">
                {fillerPill("e", 128)}
                {fillerPill("f", 100)}
                {fillerPill("g", 116)}
                {fillerPill("h", 92)}
              </div>
            </div>
          </div>
        </div>
      </Tile>

      {/* Outputs: what your app and your agents connect to. */}
      <Tile area={s.outputs} index={2} title={t("outputs.title")} body={t("outputs.body")}>
        <div aria-hidden="true" className="px-6 pb-6 pt-6 md:px-7 md:pb-7">
          <div className="border border-foreground bg-background">
            {outputs.map((output, j) => (
              <div key={output.label} className="flex items-center gap-3 border-b border-border px-4 py-3 last:border-b-0">
                <span className="relative flex h-2.5 w-2.5 shrink-0 items-center justify-center rounded-full border border-border">
                  <span
                    className={`absolute -inset-px rounded-full bg-orange-500 ${s.light}`}
                    style={{ "--j": j } as CSSProperties}
                  />
                </span>
                <span className="text-[14px] font-semibold text-foreground">{output.label}</span>
                <span className={`ml-auto shrink-0 whitespace-nowrap text-right text-muted-foreground ${MONO}`}>{output.note}</span>
              </div>
            ))}
          </div>
        </div>
      </Tile>

      {/* YC: the real mark, at display size. */}
      <Tile area={s.yc} index={0} title={t("yc.title")} body={t("yc.body")}>
        <div className="mt-auto flex items-end gap-4 px-6 pb-6 pt-8 md:px-7 md:pb-7">
          {/* The mark's own square (the left 38px of the site's YC badge). */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/partners/y-combinator.svg"
            alt="Y Combinator"
            width={72}
            height={72}
            loading="lazy"
            decoding="async"
            className="h-[72px] w-[72px] shrink-0 object-cover object-left"
          />
          <span
            className="font-bold leading-[0.8] tracking-[-0.05em]"
            style={{ fontSize: "min(120px, calc((100cqi - 152px) / 2.15))" }}
          >
            W24
          </span>
        </div>
      </Tile>

      {/* Self-host: the engine on your servers, and what it runs on. */}
      <Tile area={s.selfhost} index={1} title={t("selfHost.title")} body={t("selfHost.body")}>
        <div aria-hidden="true" className="px-6 pb-6 pt-6 md:px-7 md:pb-7">
          <div className="border border-dashed border-foreground/40 px-4 pb-5 pt-3">
            <div className="flex items-center justify-between gap-3">
              <span className={`text-muted-foreground ${MONO}`}>{t("selfHost.servers")}</span>
              <code className="truncate font-mono text-[11px] text-foreground">$ {t("selfHost.command")}</code>
            </div>
            <div className="mt-4 flex justify-center">
              <div className="flex items-center gap-3 bg-foreground px-4 py-2.5 text-background">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/projects/quivr-favicon.svg" alt="" width={24} height={24} loading="lazy" className="h-6 w-6" />
                <span className="text-[16px] font-bold tracking-[-0.02em]">Quivr</span>
                <span className={`text-white/60 ${MONO}`}>{t("selfHost.core")}</span>
              </div>
            </div>
            {/* The wires: one down from the engine, a bus, one stub per service. */}
            <div className="relative h-8">
              <span className={`absolute left-[calc(50%-0.5px)] top-0 h-4 w-px bg-foreground ${s.wireY} ${s.wire}`} style={{ "--j": 0 } as CSSProperties} />
              <span
                className={`absolute top-4 h-px bg-foreground ${s.wire} left-[calc((100%-12px)/4)] right-[calc((100%-12px)/4)] sm:left-[calc((100%-36px)/8)] sm:right-[calc((100%-36px)/8)]`}
                style={{ "--j": 1 } as CSSProperties}
              />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stack.map((name, j) => (
                <div key={name} className="relative border border-foreground bg-background px-2 py-2.5 text-center text-[13px] font-semibold text-foreground">
                  <span
                    className={`absolute -top-4 left-[calc(50%-0.5px)] h-4 w-px bg-foreground ${s.wireY} ${s.wire} ${j > 1 ? "hidden sm:block" : ""}`}
                    style={{ "--j": 2 + j } as CSSProperties}
                  />
                  {name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Tile>
    </div>
  );
}

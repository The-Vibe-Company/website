import { getTranslations } from "next-intl/server";

import { PlayOnView } from "./PlayOnView";
import s from "./quivr.module.css";

/**
 * The Quivr V2 web app as a product shot, drawn in HTML/CSS in place of a
 * screenshot (after the Stageshow skill, .agents/skills/stageshow). One story:
 * a new article lands at the top of the live feed, the words that matched a
 * saved alert are underlined, and the alert arrives with the rule that
 * matched and the webhook sent to your app. The alert is the docs' own
 * example ("harbour strike" AND (ferry OR port)); the articles are samples.
 *
 * Real words only where the story is (the two matching articles and the
 * alert); the rest of the feed is placeholder bars. The window keeps the real
 * app's layout (sidebar, "Feed", filters) and runs off the stage's edges.
 * Rows keep the bleed (64px) as right padding, so the crop only ever cuts
 * filler. The stage has a fixed height, so nothing moves the page around it; the
 * still, shown without JavaScript or with reduced motion, is the final frame.
 *
 * One image to assistive tech (role="img" plus a translated label,
 * `stageAlt`; `alt` stays the social card's, which still shows the earlier
 * full-feed drawing). The caption says it is an illustration.
 */

export type SourceKind = "feed" | "mail" | "x" | "app";

/** "La [grève portuaire] bloque…": bracketed words are the matched ones. */
export function Headline({ text, markClassName }: { text: string; markClassName: string }) {
  return (
    <>
      {text.split(/\[([^\]]+)\]/).map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className={markClassName}>
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

const SOURCE_PATHS: Record<SourceKind, React.ReactNode> = {
  feed: (
    <>
      <circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <path d="M3 7.5a5.5 5.5 0 0 1 5.5 5.5M3 3a10 10 0 0 1 10 10" />
    </>
  ),
  mail: (
    <>
      <rect x="2" y="3.5" width="12" height="9" />
      <path d="m2 4.5 6 4.5 6-4.5" />
    </>
  ),
  x: <path d="m3 3 10 10M13 3 3 13" />,
  app: <path d="M6 4 2 8l4 4m4-8 4 4-4 4" />,
};

export function SourceIcon({ kind }: { kind: SourceKind }) {
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-foreground text-foreground">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
        {SOURCE_PATHS[kind]}
      </svg>
    </span>
  );
}

/** A placeholder line: the product's filler, never where the eye lands. */
function Bar({ w, className = "bg-border" }: { w: number | string; className?: string }) {
  return <span className={`block h-1.5 shrink-0 ${className}`} style={{ width: w }} />;
}

const MONO = "font-mono text-[10px] uppercase tracking-[0.16em]";

/** Placeholder rows under the two real articles; widths vary row to row. */
const FILLER = [
  { title: "62%", meta: 120 },
  { title: "48%", meta: 96 },
  { title: "70%", meta: 132 },
  { title: "55%", meta: 104 },
];

export async function QuivrStage({ locale, accent }: { locale: string; accent: string }) {
  const t = await getTranslations({ locale, namespace: "quivr.product" });
  const items = t.raw("mock.items") as { title: string; source: string; time: string }[];

  return (
    <figure className="m-0">
      {/* data-quivr-mock: what scripts/capture-quivr-og.sh captures. */}
      <PlayOnView
        data-quivr-mock
        role="img"
        aria-label={t("stageAlt")}
        className={`${s.stage} select-none border border-foreground`}
      >
        <div className={`${s.window} flex flex-col border border-foreground bg-background shadow-[8px_8px_0_0_var(--border)]`}>
          <div className="h-[3px] w-full shrink-0" style={{ backgroundColor: accent }} />
          <div className="flex min-h-0 flex-1">
            {/* Sidebar: the app's mark, then its sections (the feed is open). */}
            <div className="hidden w-[52px] shrink-0 flex-col items-center gap-3 border-r border-border py-4 md:flex">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/projects/quivr-favicon.svg" alt="" width={28} height={28} className="mb-2 h-7 w-7" />
              <span className="flex h-8 w-8 items-center justify-center bg-foreground text-background">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M3 4h10M3 8h10M3 12h6" />
                </svg>
              </span>
              {[0, 1].map((i) => (
                <span key={i} className="flex h-8 w-8 items-center justify-center">
                  <span className="h-3.5 w-3.5 border border-border" />
                </span>
              ))}
            </div>

            <div className="min-w-0 flex-1">
              {/* Title bar: the feed, live, and a search field kept quiet. */}
              <div className="flex h-12 items-center gap-4 border-b border-border px-4 md:px-5">
                <span className="text-[16px] font-bold tracking-[-0.02em] text-foreground">{t("mock.title")}</span>
                <span className={`inline-flex items-center gap-1.5 text-foreground ${MONO}`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                  {t("mock.live")}
                </span>
                <span className="ml-auto hidden h-8 w-[min(340px,40%)] items-center gap-2 border border-border px-3 text-muted-foreground sm:flex">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="7" cy="7" r="4.5" />
                    <path d="m10.5 10.5 3.5 3.5" />
                  </svg>
                  <Bar w="55%" />
                </span>
              </div>

              {/* Filters: only the one the story uses has words. */}
              <div className="flex h-12 items-center gap-2 border-b border-border px-4 md:px-5">
                <span className="h-6 w-12 border border-border" />
                <span className="h-6 w-16 border border-border" />
                <span className="inline-flex h-6 items-center gap-1.5 border border-foreground bg-foreground px-2.5 text-[12px] font-medium text-background">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                  {t("mock.alerts")}
                </span>
                <span className="hidden h-6 w-14 border border-border sm:block" />
              </div>

              <div className="overflow-hidden">
              <div className={s.track}>
                {items.map((item, i) => (
                  <div
                    key={item.title}
                    className={`flex items-start gap-3 border-b border-border bg-orange-500/[0.06] px-4 py-3 md:pl-5 md:pr-[88px] ${
                      i === 0 ? s.newRow : ""
                    }`}
                  >
                    <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                    <SourceIcon kind={i === 0 ? "feed" : "mail"} />
                    <div className="min-w-0 flex-1">
                      <p className="m-0 text-[14px] font-semibold leading-[1.35] text-foreground md:text-[15px]">
                        <Headline text={item.title} markClassName={i === 0 ? s.mark : "underline decoration-orange-500 decoration-2 underline-offset-[3px]"} />
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-muted-foreground">
                        <span>{item.source}</span>
                        <span aria-hidden="true">·</span>
                        <span>{item.time}</span>
                        <span className={`border border-orange-500 px-1.5 leading-4 text-orange-700 ${MONO} ${i === 0 ? s.newTag : ""}`}>
                          {t("mock.alertTag")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {FILLER.map((row, i) => (
                  <div key={i} className="flex items-start gap-3 border-b border-border px-4 py-4 md:px-5">
                    <span className="mt-3 h-1.5 w-1.5 shrink-0" />
                    <span className="h-7 w-7 shrink-0 border border-border" />
                    <div className="flex min-w-0 flex-1 flex-col gap-2.5 pt-1.5">
                      <Bar w={row.title} className="bg-foreground/20" />
                      <Bar w={row.meta} />
                    </div>
                  </div>
                ))}
              </div>
              </div>
            </div>
          </div>
        </div>

        {/* The alert: what the new article set off, and where it went. */}
        <div className={`${s.satellite} border-2 border-foreground bg-background p-4 shadow-[6px_6px_0_0_var(--foreground)]`}>
          <span className={`inline-flex items-center gap-1.5 text-orange-700 ${MONO}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
            {t("mock.alert.kicker")}
          </span>
          <div className="mt-2 text-[18px] font-bold leading-tight tracking-[-0.02em] text-foreground">
            {t("mock.alert.topic")}
          </div>
          <div className="mt-1 text-[13px] leading-snug text-muted-foreground">{t("mock.alert.count")}</div>
          <code className="mt-3 block border border-border bg-well px-2.5 py-2 font-mono text-[11px] leading-snug text-foreground md:whitespace-nowrap">
            {t("mock.alert.rule")}
          </code>
          <div className={`mt-3 flex items-center gap-2 text-[12px] leading-snug text-foreground ${s.sent}`}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" className="shrink-0">
              <path d="m2.5 8.5 3.5 3.5 7.5-8" />
            </svg>
            {t("mock.alert.sent")}
          </div>
        </div>
      </PlayOnView>
      <figcaption className="mt-4 font-mono text-[11px] leading-[1.6] tracking-[0.04em] text-muted-foreground">
        {t("caption")}
      </figcaption>
    </figure>
  );
}

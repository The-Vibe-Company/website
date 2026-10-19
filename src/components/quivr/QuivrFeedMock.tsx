import { getTranslations } from "next-intl/server";

/**
 * The Quivr V2 web app, drawn in code in place of a screenshot: the live
 * feed with its filters, two articles caught by a saved alert, one corrected
 * article, then trending topics and the last 7 days. It follows the real
 * app's layout (sidebar, "Fil" feed, filters, trending panel) but with sample
 * articles, so it stays legible at any width and never shows real news. The
 * alert is the docs' own example ("harbour strike" AND (ferry OR port)).
 *
 * Framed like the screenshots of the shared project template. It is one
 * image to assistive tech (role="img" plus a translated label); the caption
 * says it is an illustration.
 */

type SourceKind = "feed" | "mail" | "x" | "app";
type Tag = "alert" | "corrected";

/** What each sample article is, by position; its words live in messages. */
const ITEMS: { source: SourceKind; tag?: Tag; unread: boolean }[] = [
  { source: "feed", tag: "alert", unread: true },
  { source: "mail", tag: "alert", unread: true },
  { source: "x", unread: true },
  { source: "feed", tag: "corrected", unread: false },
  { source: "app", unread: false },
  { source: "feed", unread: false },
  { source: "x", unread: false },
  { source: "feed", unread: false },
];

/** Articles per trending topic over the last 7 days; the first is the alert's. */
const TOPIC_COUNTS = [64, 41, 33, 27, 19, 12, 9, 7];

/** Articles per day, oldest first; the last bar is today. */
const WEEK = [38, 22, 17, 46, 52, 61, 76];
const WEEK_TOTAL = WEEK.reduce((sum, n) => sum + n, 0);
const UNREAD = ITEMS.filter((item) => item.unread).length;

const MONO = "font-mono text-[10px] uppercase tracking-[0.16em]";
const CHIP =
  "inline-flex items-center gap-1.5 border px-2.5 py-1 text-[12px] font-medium leading-none";

/** "La [grève portuaire] bloque…": bracketed words are the alert's matches. */
function Headline({ text }: { text: string }) {
  return (
    <>
      {text.split(/\[([^\]]+)\]/).map((part, i) =>
        i % 2 === 1 ? (
          <span
            key={i}
            className="underline decoration-orange-500 decoration-2 underline-offset-[3px]"
          >
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

function SourceIcon({ kind }: { kind: SourceKind }) {
  const paths: Record<SourceKind, React.ReactNode> = {
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
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-foreground text-foreground">
      <svg
        width="14"
        height="14"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        {paths[kind]}
      </svg>
    </span>
  );
}

function Caret() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="m1.5 3 2.5 2.5L6.5 3" />
    </svg>
  );
}

export async function QuivrFeedMock({
  locale,
  accent,
}: {
  locale: string;
  accent: string;
}) {
  const t = await getTranslations({ locale, namespace: "quivr.product" });
  const items = t.raw("mock.items") as { title: string; source: string; time: string }[];
  const topics = t.raw("mock.trending.topics") as string[];
  const days = t.raw("mock.week.days") as string[];
  const maxTopic = Math.max(...TOPIC_COUNTS);
  const maxDay = Math.max(...WEEK);

  return (
    <figure className="m-0">
      {/* data-quivr-mock: what scripts/capture-quivr-og.sh captures. */}
      <div data-quivr-mock className="overflow-hidden border border-foreground">
        <div className="h-[3px] w-full" style={{ backgroundColor: accent }} />
        <div
          role="img"
          aria-label={t("alt")}
          className="relative grid select-none grid-cols-1 bg-background md:grid-cols-[52px_minmax(0,1fr)] lg:grid-cols-[56px_minmax(0,1fr)_300px]"
        >
          {/* Sidebar: the app's mark, then its sections (the feed is open). */}
          <div className="hidden flex-col items-center gap-3 border-r border-border py-4 md:flex">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/projects/quivr-favicon.svg" alt="" className="mb-2 h-7 w-7" />
            <span className="flex h-8 w-8 items-center justify-center bg-foreground text-background">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M3 4h10M3 8h10M3 12h6" />
              </svg>
            </span>
            {["M8 2.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Zm0 3a2.5 2.5 0 1 0 0 5", "M8 13V7M4 13V9m8 4V4"].map(
              (d) => (
                <span key={d} className="flex h-8 w-8 items-center justify-center text-muted-foreground">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d={d} />
                  </svg>
                </span>
              ),
            )}
          </div>

          {/* The feed. */}
          <div className="relative min-w-0">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-border px-4 py-3 md:px-5">
              <span className="text-[16px] font-bold tracking-[-0.02em] text-foreground">
                {t("mock.title")}
              </span>
              <span className={`inline-flex items-center gap-1.5 text-foreground ${MONO}`}>
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500 motion-safe:animate-[vc-pulse_2s_infinite]" />
                {t("mock.live")}
              </span>
              <span className="flex w-full items-center gap-2 border border-border px-3 py-1.5 text-[12px] text-muted-foreground sm:ml-auto sm:w-auto sm:min-w-[260px] lg:min-w-[340px]">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="7" cy="7" r="4.5" />
                  <path d="m10.5 10.5 3.5 3.5" />
                </svg>
                <span className="truncate">{t("mock.search")}</span>
                <span className="ml-auto border border-border px-1.5 font-mono text-[10px] leading-4">/</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3 md:px-5">
              <span className={`${CHIP} border-foreground bg-foreground text-background`}>
                {t("mock.filters.all")}
                <span className="font-mono text-[10px] text-background/70">{WEEK_TOTAL}</span>
              </span>
              <span className={`${CHIP} border-border text-foreground`}>
                {t("mock.filters.unread")}
                <span className="font-mono text-[10px] text-muted-foreground">{UNREAD}</span>
              </span>
              <span className={`${CHIP} border-border text-foreground`}>
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                {t("mock.filters.alerts")}
                <Caret />
              </span>
              <span className={`${CHIP} hidden border-border text-foreground sm:inline-flex`}>
                {t("mock.filters.date")}
                <Caret />
              </span>
              <span className={`${CHIP} hidden border-border text-foreground sm:inline-flex`}>
                {t("mock.filters.sources")}
                <Caret />
              </span>
              <span className="ml-auto hidden items-center gap-1.5 text-[11px] text-muted-foreground xl:inline-flex">
                <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m2.5 8.5 3.5 3.5 7.5-8" />
                </svg>
                {t("mock.markRead")}
              </span>
            </div>

            <div className={`flex items-center gap-2 px-4 pb-1 pt-4 text-muted-foreground md:px-5 ${MONO}`}>
              <Caret />
              {t("mock.group")}
              <span className="border border-border px-1.5 leading-4">{items.length}</span>
            </div>

            <ul className="m-0 list-none p-0">
              {items.map((item, i) => {
                const meta = ITEMS[i];
                return (
                  <li
                    key={item.title}
                    // Phones keep the first five articles.
                    className={`items-start gap-3 border-b border-border px-4 py-3 last:border-b-0 md:px-5 ${
                      i >= 5 ? "hidden sm:flex" : "flex"
                    } ${meta?.tag === "alert" ? "bg-orange-500/[0.06]" : ""}`}
                  >
                    <span
                      className={`mt-3 h-1.5 w-1.5 shrink-0 rounded-full ${
                        meta?.tag === "alert"
                          ? "bg-orange-500"
                          : meta?.unread
                            ? "bg-foreground"
                            : "bg-transparent"
                      }`}
                    />
                    <SourceIcon kind={meta?.source ?? "feed"} />
                    <div className="min-w-0 flex-1">
                      <p
                        className={`m-0 text-[14px] leading-[1.35] text-foreground md:text-[15px] ${
                          meta?.unread ? "font-semibold" : "font-medium"
                        }`}
                      >
                        <Headline text={item.title} />
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-muted-foreground">
                        <span>{item.source}</span>
                        <span aria-hidden="true">·</span>
                        <span>{item.time}</span>
                        {meta?.tag === "alert" ? (
                          <span className={`border border-orange-500 px-1.5 leading-4 text-orange-700 ${MONO}`}>
                            {t("mock.alertTag")}
                          </span>
                        ) : null}
                        {meta?.tag === "corrected" ? (
                          <span className={`border border-border px-1.5 leading-4 ${MONO}`}>
                            {t("mock.correctedTag")}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            {/* The feed goes on below the fold. */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-background to-transparent" />
          </div>

          {/* Trending topics and the last 7 days. */}
          <div className="hidden flex-col border-l border-border px-5 py-5 lg:flex">
            <div className={`flex items-baseline justify-between gap-3 ${MONO}`}>
              <span className="text-foreground">{t("mock.trending.title")}</span>
              <span className="text-muted-foreground">{t("mock.trending.period")}</span>
            </div>
            <ol className="m-0 mt-4 flex list-none flex-col gap-3.5 p-0">
              {topics.map((topic, i) => (
                <li key={topic}>
                  <div className="flex items-baseline gap-3 text-[13px]">
                    <span className="w-3 font-mono text-[10px] text-muted-foreground">{i + 1}</span>
                    <span className="font-semibold text-foreground">{topic}</span>
                    <span className="ml-auto font-mono text-[11px] tabular-nums text-muted-foreground">
                      {TOPIC_COUNTS[i]}
                    </span>
                  </div>
                  <div className="ml-6 mt-1.5 h-[3px] bg-border">
                    <div
                      className={`h-full ${i === 0 ? "bg-orange-500" : "bg-foreground"}`}
                      style={{ width: `${((TOPIC_COUNTS[i] ?? 0) / maxTopic) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ol>

            <div className={`mt-auto flex items-baseline justify-between gap-3 border-t border-border pt-5 ${MONO}`}>
              <span className="text-foreground">{t("mock.week.title")}</span>
              <span className="text-muted-foreground">
                {t("mock.week.total", { count: WEEK_TOTAL })}
              </span>
            </div>
            <div className="mt-4 grid h-28 grid-cols-7 items-end gap-2">
              {WEEK.map((count, i) => (
                <div
                  key={days[i]}
                  className={i === WEEK.length - 1 ? "bg-foreground" : "bg-foreground/15"}
                  style={{ height: `${(count / maxDay) * 100}%` }}
                />
              ))}
            </div>
            <div className="mt-2 grid grid-cols-7 gap-2">
              {days.map((day) => (
                <span key={day} className="text-center font-mono text-[9px] text-muted-foreground">
                  {day}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <figcaption className="mt-4 font-mono text-[11px] leading-[1.6] tracking-[0.04em] text-muted-foreground">
        {t("caption")}
      </figcaption>
    </figure>
  );
}

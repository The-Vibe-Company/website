"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import type { Check, Report } from "@/lib/agent-ready/types";
import {
  AGENT_READY_CATEGORIES,
  AGENT_READY_SPECS,
  buildAgentPrompt,
  fill,
  hostnameOf,
  isAgentReadyErrorCode,
  type AgentReadyCopy,
  type AgentReadyErrorCode,
} from "@/lib/agent-ready-ui";
import { BOOKING_URL, bookingLocation } from "@/lib/booking";
import { captureEvent, type EventProperties } from "@/lib/posthog";

/**
 * The agent-ready scanner's one client island: the form, and the report once
 * the API answers. Every string comes from the server-rendered page as
 * `copy`, so no message namespace is added to the client bundle of other
 * pages. Scanner evidence is rendered as text, never as HTML.
 *
 * Analytics only ever receive the hostname, never the path or query.
 */

const ENDPOINT = "/api/tools/agent-ready";
/** The route allows 30 s; past that, stop waiting and say so. */
const CLIENT_TIMEOUT_MS = 40_000;

type State =
  | { phase: "idle" }
  | { phase: "loading"; host: string }
  | { phase: "error"; code: AgentReadyErrorCode; seconds: number }
  | { phase: "done"; report: Report };

const MONO = "font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground";
const SLAB =
  "inline-flex items-center justify-center gap-3 rounded-[2px] border border-foreground bg-foreground px-6 py-4 text-[15px] font-semibold text-background transition-colors duration-300 hover:border-soft-foreground hover:bg-soft-foreground disabled:cursor-wait disabled:opacity-70 md:text-base";
const GHOST =
  "inline-flex items-center gap-2 rounded-[2px] border border-border-strong px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-foreground";

function isReport(value: unknown): value is Report {
  if (!value || typeof value !== "object") return false;
  const report = value as Partial<Report>;
  return (
    typeof report.url === "string" &&
    typeof report.score?.percentage === "number" &&
    Array.isArray(report.categories)
  );
}

function completedProperties(report: Report, domain: string): EventProperties {
  const properties: EventProperties = {
    domain,
    score: report.score.percentage,
    level: report.score.level,
  };
  for (const category of report.categories) {
    if (category.id === "commerce") continue;
    properties[`score_${category.id}`] = category.percentage;
    properties[`level_${category.id}`] = category.level;
  }
  return properties;
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function AgentReadyScanner({ copy }: { copy: AgentReadyCopy }) {
  const [input, setInput] = useState("");
  const [state, setState] = useState<State>({ phase: "idle" });
  const inputRef = useRef<HTMLInputElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const ids = useId();
  const inputId = `${ids}-url`;
  const hintId = `${ids}-hint`;
  const errorId = `${ids}-error`;

  useEffect(() => {
    if (state.phase === "done") headingRef.current?.focus();
  }, [state]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state.phase === "loading") return;
    const value = input.trim();
    const host = hostnameOf(value);
    if (!value || !host) {
      setState({ phase: "error", code: value ? "invalid_url" : "empty", seconds: 0 });
      inputRef.current?.focus();
      return;
    }

    setState({ phase: "loading", host });
    captureEvent("tool_agent_ready_scan_started", { domain: host });

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);
    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: value }),
        signal: controller.signal,
      });
      const body: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        const error = (body as { error?: unknown } | null)?.error;
        const code = isAgentReadyErrorCode(error)
          ? error
          : response.status === 429
            ? "rate_limited"
            : "scan_failed";
        const seconds = Number(response.headers.get("Retry-After")) || 60;
        setState({ phase: "error", code, seconds });
        return;
      }
      if (!isReport(body)) {
        setState({ phase: "error", code: "scan_failed", seconds: 0 });
        return;
      }
      setState({ phase: "done", report: body });
      captureEvent(
        "tool_agent_ready_scan_completed",
        completedProperties(body, hostnameOf(body.url) ?? host),
      );
    } catch (error) {
      const aborted = error instanceof DOMException && error.name === "AbortError";
      setState({ phase: "error", code: aborted ? "scan_failed" : "network", seconds: 0 });
    } finally {
      clearTimeout(timer);
    }
  }

  function reset() {
    setState({ phase: "idle" });
    setInput("");
    inputRef.current?.focus();
  }

  const loading = state.phase === "loading";
  const error = state.phase === "error" ? fill(copy.errors[state.code], { seconds: state.seconds }) : null;
  const announcement =
    state.phase === "loading"
      ? fill(copy.form.progress, { host: state.host })
      : state.phase === "done"
        ? fill(copy.report.ready, { score: state.report.score.percentage, level: state.report.score.level })
        : "";

  return (
    <div className="mt-10 md:mt-12">
      <form onSubmit={onSubmit} noValidate className="max-w-[760px]">
        <label htmlFor={inputId} className={`${MONO} block text-soft-foreground`}>
          {copy.form.label}
        </label>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            ref={inputRef}
            id={inputId}
            name="url"
            type="text"
            inputMode="url"
            autoComplete="url"
            autoCapitalize="none"
            spellCheck={false}
            required
            placeholder={copy.form.placeholder}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${errorId} ${hintId}` : hintId}
            className="min-w-0 flex-1 rounded-[2px] border border-border-strong bg-card px-5 py-4 text-base text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-brand md:text-[17px]"
          />
          <button type="submit" disabled={loading} className={SLAB}>
            {loading ? copy.form.scanning : copy.form.submit}
            {!loading && (
              <span aria-hidden="true" className="text-lg leading-none">
                →
              </span>
            )}
          </button>
        </div>
        <p id={hintId} className="m-0 mt-3 text-sm leading-[1.5] text-muted-foreground">
          {copy.form.hint}
        </p>
        {error && (
          <p
            id={errorId}
            role="alert"
            className="m-0 mt-4 border-l-2 border-brand pl-4 text-[15px] leading-[1.5] text-foreground"
          >
            {error}
          </p>
        )}
      </form>

      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>

      {loading && (
        // Reserves the report's room as soon as the scan starts (inside the
        // input's grace window), so the answer does not shift the page.
        <div aria-hidden="true" className="mt-12 min-h-[70vh] border-t border-border pt-10">
          <p className={`${MONO} m-0 motion-safe:animate-pulse`}>
            {fill(copy.form.progress, { host: state.host })}
          </p>
        </div>
      )}

      {state.phase === "done" && (
        <ReportView report={state.report} copy={copy} headingRef={headingRef} onReset={reset} />
      )}
    </div>
  );
}

function StatusBadge({ check, copy }: { check: Check; copy: AgentReadyCopy }) {
  const tone =
    check.status === "fail"
      ? "border-brand text-brand"
      : check.status === "pass"
        ? "border-border-strong text-foreground"
        : "border-border text-muted-foreground";
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-2 rounded-[2px] border px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.14em] ${tone}`}
    >
      {check.status === "fail" && <span aria-hidden="true" className="h-1.5 w-1.5 bg-brand" />}
      {copy.status[check.status]}
    </span>
  );
}

function LevelSquares({ level }: { level: number }) {
  return (
    <span aria-hidden="true" className="inline-flex gap-1">
      {[1, 2, 3, 4, 5].map((step) => (
        <span
          key={step}
          className={`h-2.5 w-2.5 ${step <= level ? "bg-brand" : "border border-border-strong"}`}
        />
      ))}
    </span>
  );
}

function ReportView({
  report,
  copy,
  headingRef,
  onReset,
}: {
  report: Report;
  copy: AgentReadyCopy;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  onReset: () => void;
}) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const prompt = buildAgentPrompt(report, copy);
  const host = hostnameOf(report.url) ?? report.url;
  const byId = new Map(report.categories.map((category) => [category.id, category]));
  const headingId = useId();

  async function onCopy() {
    if (!prompt) return;
    setCopyState((await copyText(prompt)) ? "copied" : "failed");
  }

  return (
    <section aria-labelledby={headingId} className="mt-12 border-t border-border pt-10 md:mt-16 md:pt-14">
      <h2
        id={headingId}
        ref={headingRef}
        tabIndex={-1}
        className="m-0 text-[clamp(1.75rem,3.4vw,3rem)] font-bold leading-[1] tracking-[-0.04em] text-foreground wrap-anywhere focus:outline-none"
      >
        {fill(copy.report.heading, { host })}
      </h2>

      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,360px)_1fr]">
        <div className="lamp-card relative overflow-hidden border border-border p-7 md:p-9">
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-0 h-1.5 w-16 -translate-x-1/2 bg-brand shadow-[0_0_40px_12px_rgba(242,115,19,0.45)]"
          />
          <div className="relative">
            <span className={MONO}>{copy.report.scoreLabel}</span>
            <p className="m-0 mt-4 flex items-baseline gap-2">
              <span className="text-lit text-[clamp(4rem,9vw,6.5rem)] font-bold leading-[0.9] tracking-[-0.05em]">
                {report.score.percentage}
              </span>
              <span className="text-xl font-semibold text-muted-foreground">/100</span>
            </p>
            <p className="m-0 mt-5 flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.18em] text-soft-foreground">
              <LevelSquares level={report.score.level} />
              {fill(copy.report.level, { level: report.score.level })}
            </p>
          </div>
        </div>

        <ul className="m-0 grid list-none grid-cols-1 gap-px border border-border bg-border p-0 sm:grid-cols-2">
          {AGENT_READY_CATEGORIES.filter(({ id }) => id !== "commerce" && byId.has(id)).map(({ id }) => {
            const category = byId.get(id)!;
            return (
              <li key={id} className="flex flex-col gap-3 bg-card p-6">
                <span className="text-lg font-bold tracking-[-0.02em] text-foreground">
                  {copy.categories[id].name}
                </span>
                <span className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-soft-foreground">
                  <LevelSquares level={category.level} />
                  {fill(copy.report.level, { level: category.level })}
                </span>
                <span className="block h-1 w-full bg-border" aria-hidden="true">
                  <span className="block h-full bg-brand" style={{ width: `${category.percentage}%` }} />
                </span>
                <span className="text-sm text-muted-foreground">
                  {fill(copy.report.categoryScore, { percentage: category.percentage })}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-14 flex flex-col gap-14">
        {AGENT_READY_CATEGORIES.filter(({ id }) => byId.has(id)).map(({ id, checks }) => {
          const category = byId.get(id)!;
          const found = new Map(category.checks.map((check) => [check.id, check]));
          const ordered = [
            ...checks.map((checkId) => found.get(checkId)).filter((check): check is Check => !!check),
            ...category.checks.filter((check) => !checks.includes(check.id)),
          ];
          const informative = id === "commerce";
          return (
            <div key={id}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-border pb-4">
                <h3 className="m-0 text-[clamp(1.5rem,2.4vw,2rem)] font-bold leading-[1.05] tracking-[-0.035em] text-foreground">
                  {copy.categories[id].name}
                </h3>
                <span className={MONO}>
                  {informative
                    ? copy.report.informative
                    : `${fill(copy.report.level, { level: category.level })} · ${fill(copy.report.categoryScore, { percentage: category.percentage })}`}
                </span>
              </div>
              <ul className="m-0 list-none p-0">
                {ordered.map((check) => {
                  const text = copy.checks[check.id];
                  return (
                    <li key={check.id} className="grid grid-cols-1 gap-3 border-b border-border py-6 md:grid-cols-[minmax(0,320px)_1fr] md:gap-10">
                      <div className="flex flex-wrap items-start gap-3">
                        <h4 className="m-0 text-[17px] font-bold leading-[1.25] tracking-[-0.02em] text-foreground">
                          {text?.name ?? check.id}
                        </h4>
                        <StatusBadge check={check} copy={copy} />
                      </div>
                      <div className="flex flex-col gap-3 text-[15px] leading-[1.6] text-soft-foreground">
                        {text && <p className="m-0">{text.explain}</p>}
                        {text && check.status === "fail" && !check.informative && (
                          <p className="m-0 border-l-2 border-brand pl-4 text-foreground">
                            <strong className="font-semibold">{copy.report.fix}</strong>{" "}
                            {text.fix}
                          </p>
                        )}
                        <details className="group">
                          <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground">
                            {copy.report.evidence}
                          </summary>
                          <p className="m-0 mt-2 break-words font-mono text-[12px] leading-[1.6] text-muted-foreground">
                            {check.details}
                          </p>
                          <a
                            href={AGENT_READY_SPECS[check.id]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-block font-mono text-[11px] uppercase tracking-[0.16em] text-foreground underline underline-offset-4 hover:text-brand"
                          >
                            {copy.report.spec} ↗
                          </a>
                        </details>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="mt-14 border border-border bg-card p-7 md:p-9">
        {prompt ? (
          <>
            <button type="button" onClick={onCopy} className={GHOST}>
              {copy.report.copy}
            </button>
            <p className="m-0 mt-3 text-sm text-muted-foreground">{copy.report.copyHint}</p>
            <p aria-live="polite" className="m-0 mt-3 min-h-[1.5em] text-sm text-foreground">
              {copyState === "copied" ? copy.report.copied : copyState === "failed" ? copy.report.copyFailed : ""}
            </p>
            {copyState === "failed" && (
              <textarea
                readOnly
                value={prompt}
                aria-label={copy.report.copy}
                rows={10}
                className="mt-2 w-full rounded-[2px] border border-border-strong bg-background p-4 font-mono text-[12px] leading-[1.5] text-foreground"
                onFocus={(event) => event.currentTarget.select()}
              />
            )}
          </>
        ) : (
          <p className="m-0 text-[15px] leading-[1.6] text-foreground">{copy.report.allGood}</p>
        )}
      </div>

      <div className="mt-14 flex flex-col gap-6 border-t border-border pt-10 md:flex-row md:items-end md:justify-between">
        <div className="max-w-[560px]">
          <p className="m-0 text-[clamp(1.5rem,2.6vw,2.25rem)] font-bold leading-[1.05] tracking-[-0.035em] text-foreground">
            {copy.report.ctaTitle}
          </p>
          <p className="m-0 mt-3 text-[15px] leading-[1.6] text-muted-foreground">{copy.report.ctaBody}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <button type="button" onClick={onReset} className={GHOST}>
            {copy.report.again}
          </button>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            {...bookingLocation("agent_ready_report")}
            onClick={() =>
              captureEvent("cta_cal_click", { location: "agent_ready_report" }, { send_instantly: true })
            }
            className={SLAB}
          >
            {copy.report.ctaButton}
            <span aria-hidden="true" className="text-lg leading-none">
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

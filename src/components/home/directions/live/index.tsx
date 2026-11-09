import { CLIENTS } from "../../Clients";
import { HeroMobile } from "../../HeroMobile";
import { MobileBookingBar } from "../../MobileBookingBar";
import { getCustomers, type ContentLocale } from "@/lib/customers";
import { getProjects } from "@/lib/projects";
import type { RunnerItem } from "@/lib/runner-worlds";
import { LiveCTA } from "./LiveCTA";
import { LiveHero } from "./LiveHero";
import { LiveQuote } from "./LiveQuote";
import { OpsBoard, type OpsCase } from "./OpsBoard";
import { ProductsLive, type LogLine, type ProductTile } from "./ProductsLive";
import { ServicesPanels } from "./ServicesPanels";
import { Ticker, type TickerFact } from "./Ticker";

/** Statuses from the catalogue, sorted into the three lights a tile shows. */
function statusKind(status: string): ProductTile["kind"] {
  if (/open source/i.test(status)) return "oss";
  if (/interne|internal/i.test(status)) return "internal";
  return "live";
}

/** Alternates two lists: a, b, a, b… then whatever is left of the longer. */
function interleave<T>(a: T[], b: T[]): T[] {
  const out: T[] = [];
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (a[i]) out.push(a[i]);
    if (b[i]) out.push(b[i]);
  }
  return out;
}

/**
 * Direction B · Live: the agency as an ops room that is running right now.
 * Everything that moves carries a real fact from the case studies or the
 * product catalogue; the data is shaped here, on the server, so only what
 * each section shows reaches the client.
 */
export function DirectionHome({ locale }: { locale: ContentLocale; runnerItems: RunnerItem[] }) {
  const customers = getCustomers(locale);
  const projects = getProjects(locale);

  const cases: OpsCase[] = customers.map((c) => ({
    slug: c.slug,
    client: c.client,
    logo: c.logo,
    sector: c.sector,
    metric: c.metric,
    metricLabel: c.metricLabel,
    results: c.results,
    // Short names of what was delivered: each point up to its colon, or up
    // to the clause that starts explaining it.
    parts:
      c.slug === "afp" || c.slug === "monka"
        ? c.points.map((p) => p.split(/\s?:\s|,\s(?:qui|pour|so|which)\s|\s(?:that|which)\s/)[0].trim())
        : [],
  }));

  const caseFacts: TickerFact[] = customers.flatMap((c) =>
    c.results.filter((r) => /\d/.test(r.value)).map((r) => ({ who: c.client, value: r.value, label: r.label })),
  );
  const productFacts: TickerFact[] = [...projects].reverse().map((p) => ({ who: p.name, value: p.status, label: p.tag }));
  const facts = interleave(caseFacts, productFacts);

  const shipped: LogLine[] = [...projects].reverse().map((p) => ({
    stamp: p.date,
    verb: "ship",
    who: p.slug,
    text: `${p.status} · ${p.tag}`,
  }));
  const running: LogLine[] = caseFacts.map((f) => ({
    stamp: "prod",
    verb: "run",
    who: f.who.toLowerCase().replace(/\s+/g, "-"),
    text: `${f.value} · ${f.label}`,
  }));
  const lines = interleave(shipped, running);

  const products: ProductTile[] = projects.map((p) => ({
    slug: p.slug,
    name: p.name,
    logo: p.logo,
    tag: p.tag,
    date: p.date,
    status: p.status,
    kind: statusKind(p.status),
  }));

  return (
    <>
      <HeroMobile />
      <LiveHero />
      <Ticker facts={facts} locale={locale} />
      <OpsBoard cases={cases} clients={CLIENTS.map(({ name, src, url }) => ({ name, src, url }))} locale={locale} />
      <LiveQuote locale={locale} />
      <ServicesPanels />
      <ProductsLive lines={lines} products={products} locale={locale} />
      <LiveCTA locale={locale} />
      <MobileBookingBar />
    </>
  );
}

import { CLIENTS } from "../../Clients";
import { getCustomers, type ContentLocale } from "@/lib/customers";
import { getProjects } from "@/lib/projects";
import type { RunnerItem } from "@/lib/runner-worlds";
import { AbyssBackdrop } from "./AbyssBackdrop";
import { CaseCorridor, type DeepCase } from "./CaseCorridor";
import { ClientsDepth } from "./ClientsDepth";
import { ClosingHorizon } from "./ClosingHorizon";
import { DeepHero } from "./DeepHero";
import { ProductsField } from "./ProductsField";
import { QuoteFog } from "./QuoteFog";
import { ServicesFloat } from "./ServicesFloat";

/**
 * Direction E · Profondeur: the black as a space you look into. A floor runs
 * back to an orange horizon under the mascot; scrolling moves the camera down
 * into it, past the cases floating in a corridor, through fog, to the horizon
 * again at the bottom. The data is shaped here, on the server.
 */
export function DirectionHome({ locale }: { locale: ContentLocale; runnerItems: RunnerItem[] }) {
  const cases: DeepCase[] = getCustomers(locale).map((c) => ({
    slug: c.slug,
    client: c.client,
    logo: c.logo,
    sector: c.sector,
    metric: c.metric,
    metricLabel: c.metricLabel,
    // Two figures under the headline one, never the one it already shows.
    results: c.results.filter((r) => /\d/.test(r.value) && !c.metric?.startsWith(r.value)).slice(0, 2),
  }));

  const products = getProjects(locale).map((p) => ({
    slug: p.slug,
    name: p.name,
    logo: p.logo,
    accent: p.accent,
    tag: p.tag,
    status: p.status,
    date: p.date,
  }));

  return (
    <>
      <DeepHero locale={locale} />
      <div className="relative">
        <AbyssBackdrop locale={locale} />
        <ClientsDepth clients={CLIENTS.map(({ name, src, className }) => ({ name, src, className }))} />
        <CaseCorridor cases={cases} locale={locale} />
        <QuoteFog />
        <ServicesFloat />
        <ProductsField products={products} />
      </div>
      <ClosingHorizon />
    </>
  );
}

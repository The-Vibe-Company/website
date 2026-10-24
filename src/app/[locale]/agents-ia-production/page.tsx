import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import {
  AgentsProductionPage,
  agentsProductionMetadata,
} from "@/components/agents-production/AgentsProductionPage";
import { permanentRedirect } from "@/i18n/navigation";
import { AGENTS_PRODUCTION_PATHS } from "@/lib/site";

/**
 * The French "agents in production" landing. Mirror of
 * /[locale]/ai-agents-in-production: each language owns its own URL segment,
 * and the other language's segment redirects here rather than rendering a
 * second copy of the page.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return agentsProductionMetadata(locale);
}

export default async function AgentsIaProductionRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "fr") {
    permanentRedirect({ href: AGENTS_PRODUCTION_PATHS.en, locale: "en" });
  }

  setRequestLocale(locale);
  return <AgentsProductionPage locale={locale} />;
}

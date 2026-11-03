import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import {
  AgentsProductionPage,
  agentsProductionMetadata,
} from "@/components/agents-production/AgentsProductionPage";
import { permanentRedirect } from "@/i18n/navigation";
import { AGENTS_PRODUCTION_PATHS } from "@/lib/site";

/**
 * The English "agents in production" landing. The URL segment is translated,
 * so French readers get the same page at /fr/agents-ia-production;
 * /fr/ai-agents-in-production redirects there, which keeps the language
 * switcher working.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return agentsProductionMetadata(locale);
}

export default async function AiAgentsInProductionRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "en") {
    permanentRedirect({ href: AGENTS_PRODUCTION_PATHS.fr, locale: "fr" });
  }

  setRequestLocale(locale);
  return <AgentsProductionPage locale={locale} />;
}

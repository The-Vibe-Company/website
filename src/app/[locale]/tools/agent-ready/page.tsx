import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { AgentReadyPage, agentReadyMetadata } from "@/components/tools/AgentReadyPage";

/**
 * The agent-ready scanner. Same segment in both languages
 * (/fr/tools/agent-ready, /en/tools/agent-ready); the scan itself runs
 * through POST /api/tools/agent-ready.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return agentReadyMetadata(locale);
}

export default async function AgentReadyRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AgentReadyPage locale={locale} />;
}

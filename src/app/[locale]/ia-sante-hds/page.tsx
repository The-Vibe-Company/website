import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { HealthcareAiPage, healthcareAiMetadata } from "@/components/healthcare-ai/HealthcareAiPage";
import { permanentRedirect } from "@/i18n/navigation";
import { HEALTHCARE_AI_PATHS } from "@/lib/site";

/**
 * The French healthcare AI landing. Mirror of /[locale]/healthcare-ai-hds:
 * each language owns its own URL segment, and the other language's segment
 * redirects here rather than rendering a second copy of the page.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return healthcareAiMetadata(locale);
}

export default async function IaSanteHdsRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "fr") {
    permanentRedirect({ href: HEALTHCARE_AI_PATHS.en, locale: "en" });
  }

  setRequestLocale(locale);
  return <HealthcareAiPage locale={locale} />;
}

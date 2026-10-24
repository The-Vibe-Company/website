import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { HealthcareAiPage, healthcareAiMetadata } from "@/components/healthcare-ai/HealthcareAiPage";
import { permanentRedirect } from "@/i18n/navigation";
import { HEALTHCARE_AI_PATHS } from "@/lib/site";

/**
 * The English healthcare AI landing. The URL segment is translated, so French
 * readers get the same page at /fr/ia-sante-hds; /fr/healthcare-ai-hds
 * redirects there, which keeps the language switcher working.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return healthcareAiMetadata(locale);
}

export default async function HealthcareAiHdsRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "en") {
    permanentRedirect({ href: HEALTHCARE_AI_PATHS.fr, locale: "fr" });
  }

  setRequestLocale(locale);
  return <HealthcareAiPage locale={locale} />;
}

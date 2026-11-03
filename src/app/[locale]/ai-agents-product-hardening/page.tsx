import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { HardeningPage, hardeningMetadata } from "@/components/hardening/HardeningPage";
import { permanentRedirect } from "@/i18n/navigation";
import { HARDENING_PATHS } from "@/lib/site";

/**
 * The English hardening landing. The URL segment is translated, so French
 * readers get the same page at /fr/agents-ia-securite-produit; /fr/ai-agents-
 * product-hardening redirects there, which keeps the language switcher working.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return hardeningMetadata(locale);
}

export default async function AiAgentsProductHardeningRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "en") {
    permanentRedirect({ href: HARDENING_PATHS.fr, locale: "fr" });
  }

  setRequestLocale(locale);
  return <HardeningPage locale={locale} />;
}

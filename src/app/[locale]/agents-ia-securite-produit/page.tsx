import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { HardeningPage, hardeningMetadata } from "@/components/hardening/HardeningPage";
import { permanentRedirect } from "@/i18n/navigation";
import { HARDENING_PATHS } from "@/lib/site";

/**
 * The French hardening landing. Mirror of /[locale]/ai-agents-product-hardening:
 * each language owns its own URL segment, and the other language's segment
 * redirects here rather than rendering a second copy of the page.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return hardeningMetadata(locale);
}

export default async function AgentsIaSecuriteProduitRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "fr") {
    permanentRedirect({ href: HARDENING_PATHS.en, locale: "en" });
  }

  setRequestLocale(locale);
  return <HardeningPage locale={locale} />;
}

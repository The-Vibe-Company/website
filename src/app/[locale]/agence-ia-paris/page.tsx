import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { AgencyParisPage, agencyParisMetadata } from "@/components/agency-paris/AgencyParisPage";
import { permanentRedirect } from "@/i18n/navigation";
import { AGENCY_PARIS_PATHS } from "@/lib/site";

/**
 * The French "agence IA à Paris" landing page. Mirror of
 * /[locale]/ai-agency-paris: /en/agence-ia-paris redirects to the English
 * page, which keeps the language switcher working from either side.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return agencyParisMetadata(locale);
}

export default async function AgenceIaParisRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "fr") {
    permanentRedirect({ href: AGENCY_PARIS_PATHS.en, locale: "en" });
  }

  setRequestLocale(locale);
  return <AgencyParisPage locale={locale} />;
}

import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { AgencyParisPage, agencyParisMetadata } from "@/components/agency-paris/AgencyParisPage";
import { permanentRedirect } from "@/i18n/navigation";
import { AGENCY_PARIS_PATHS } from "@/lib/site";

/**
 * The English "AI agency in Paris" landing page. The URL segment is
 * translated, so French readers get the same page at /fr/agence-ia-paris —
 * /fr/ai-agency-paris redirects there.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return agencyParisMetadata(locale);
}

export default async function AiAgencyParisRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "en") {
    permanentRedirect({ href: AGENCY_PARIS_PATHS.fr, locale: "fr" });
  }

  setRequestLocale(locale);
  return <AgencyParisPage locale={locale} />;
}

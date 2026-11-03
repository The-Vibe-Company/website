import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { PrivacyPage, privacyMetadata } from "@/components/privacy/PrivacyPage";
import { permanentRedirect } from "@/i18n/navigation";
import { PRIVACY_PATHS } from "@/lib/site";

/**
 * The French privacy policy. Mirror of /[locale]/privacy: /en/confidentialite
 * redirects to /en/privacy rather than rendering a second copy.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return privacyMetadata(locale);
}

export default async function ConfidentialiteRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "fr") {
    permanentRedirect({ href: PRIVACY_PATHS.en, locale: "en" });
  }

  setRequestLocale(locale);
  return <PrivacyPage locale={locale} />;
}

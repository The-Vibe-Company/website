import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { PrivacyPage, privacyMetadata } from "@/components/privacy/PrivacyPage";
import { permanentRedirect } from "@/i18n/navigation";
import { PRIVACY_PATHS } from "@/lib/site";

/**
 * The English privacy policy. The URL segment is translated: French readers
 * get the same page at /fr/confidentialite, and /fr/privacy redirects there,
 * which also keeps the language switcher working from either side.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return privacyMetadata(locale);
}

export default async function PrivacyRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "en") {
    permanentRedirect({ href: PRIVACY_PATHS.fr, locale: "fr" });
  }

  setRequestLocale(locale);
  return <PrivacyPage locale={locale} />;
}

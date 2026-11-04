import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { CustomAiAppPage, customAiAppMetadata } from "@/components/custom-ai-app/CustomAiAppPage";
import { permanentRedirect } from "@/i18n/navigation";
import { CUSTOM_AI_APP_PATHS } from "@/lib/site";

/**
 * The English custom AI application landing. The URL segment is translated,
 * so French readers get the same page at
 * /fr/developpement-application-ia-sur-mesure; /fr/custom-ai-app-development
 * redirects there.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return customAiAppMetadata(locale);
}

export default async function CustomAiAppDevelopmentRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "en") {
    permanentRedirect({ href: CUSTOM_AI_APP_PATHS.fr, locale: "fr" });
  }

  setRequestLocale(locale);
  return <CustomAiAppPage locale={locale} />;
}

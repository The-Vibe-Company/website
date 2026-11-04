import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { CustomAiAppPage, customAiAppMetadata } from "@/components/custom-ai-app/CustomAiAppPage";
import { permanentRedirect } from "@/i18n/navigation";
import { CUSTOM_AI_APP_PATHS } from "@/lib/site";

/**
 * The French custom AI application landing. Mirror of
 * /[locale]/custom-ai-app-development: each language owns its own URL segment,
 * and the other language's segment redirects here rather than rendering a
 * second copy of the page.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return customAiAppMetadata(locale);
}

export default async function DeveloppementApplicationIaSurMesureRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "fr") {
    permanentRedirect({ href: CUSTOM_AI_APP_PATHS.en, locale: "en" });
  }

  setRequestLocale(locale);
  return <CustomAiAppPage locale={locale} />;
}

import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { MediaAiPage, mediaAiMetadata } from "@/components/media-ai/MediaAiPage";
import { permanentRedirect } from "@/i18n/navigation";
import { MEDIA_AI_PATHS } from "@/lib/site";

/**
 * The French media AI landing. Mirror of /[locale]/ai-for-media: each language
 * owns its own URL segment, and the other language's segment redirects here
 * rather than rendering a second copy of the page.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return mediaAiMetadata(locale);
}

export default async function IaMediasRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "fr") {
    permanentRedirect({ href: MEDIA_AI_PATHS.en, locale: "en" });
  }

  setRequestLocale(locale);
  return <MediaAiPage locale={locale} />;
}

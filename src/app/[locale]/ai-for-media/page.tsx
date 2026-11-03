import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { MediaAiPage, mediaAiMetadata } from "@/components/media-ai/MediaAiPage";
import { permanentRedirect } from "@/i18n/navigation";
import { MEDIA_AI_PATHS } from "@/lib/site";

/**
 * The English media AI landing. The URL segment is translated, so French
 * readers get the same page at /fr/ia-medias; /fr/ai-for-media redirects
 * there, which keeps the language switcher working.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return mediaAiMetadata(locale);
}

export default async function AiForMediaRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "en") {
    permanentRedirect({ href: MEDIA_AI_PATHS.fr, locale: "fr" });
  }

  setRequestLocale(locale);
  return <MediaAiPage locale={locale} />;
}

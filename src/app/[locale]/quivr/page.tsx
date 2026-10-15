import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { QuivrPage } from "@/components/quivr/QuivrPage";
import { getQuivrStars, QUIVR_PATH } from "@/lib/quivr";
import { localizedAlternates, localizedSocialMetadata } from "@/lib/site";

// Keep in sync with QUIVR_STARS_REVALIDATE (segment config must be a literal).
export const revalidate = 3600;

/**
 * The Quivr V2 page, at /fr/quivr and /en/quivr. Same path in both languages,
 * each canonical on its own URL, French as x-default.
 *
 * The GitHub star count is fetched with ISR (see QUIVR_STARS_REVALIDATE), so
 * the page shows the live figure without a request per visit.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "quivr" });
  const title = t("metaTitle");
  const description = t("metaDescription");

  return {
    // Absolute, not the layout template: "| The Vibe Company" would push the
    // title past what search results show.
    title: { absolute: title },
    description,
    alternates: localizedAlternates(locale, QUIVR_PATH, { xDefault: true }),
    ...localizedSocialMetadata({ locale, path: QUIVR_PATH, title, description }),
  };
}

export default async function QuivrRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const stars = await getQuivrStars();
  return <QuivrPage locale={locale} stars={stars} />;
}

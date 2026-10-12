import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { AboutPage, aboutMetadata } from "@/components/about/AboutPage";
import { permanentRedirect } from "@/i18n/navigation";
import { ABOUT_PATHS } from "@/lib/site";

/**
 * The English About page. The URL segment is translated, so French readers get
 * the same page at /fr/a-propos — /fr/about redirects there, which also keeps
 * the language switcher working from either side.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return aboutMetadata(locale);
}

export default async function AboutRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "en") {
    permanentRedirect({ href: ABOUT_PATHS.fr, locale: "fr" });
  }

  setRequestLocale(locale);
  return <AboutPage locale={locale} />;
}

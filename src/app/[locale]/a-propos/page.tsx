import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { AboutPage, aboutMetadata } from "@/components/about/AboutPage";
import { permanentRedirect } from "@/i18n/navigation";
import { ABOUT_PATHS } from "@/lib/site";

/**
 * The French About page. Mirror of /[locale]/about: each language owns its own
 * URL segment, and the other language's segment redirects here rather than
 * rendering a second copy of the page.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return aboutMetadata(locale);
}

export default async function AProposRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "fr") {
    permanentRedirect({ href: ABOUT_PATHS.en, locale: "en" });
  }

  setRequestLocale(locale);
  return <AboutPage locale={locale} />;
}

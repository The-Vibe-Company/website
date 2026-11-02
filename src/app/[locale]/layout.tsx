import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { preload } from "react-dom";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { WebMcp } from "@/components/WebMcp";
import { ClientProviders } from "@/components/ClientProviders";
import { JsonLd } from "@/components/JsonLd";
import { ConditionalGridOverlay } from "@/components/resources/ConditionalGridOverlay";
import { routing } from "@/i18n/routing";
import { defaultSocialMetadata, localizedAlternates, SITE_ICONS, SITE_NAME, SITE_URL } from "@/lib/site";
import { PRELOADED_FONT_URLS } from "@/lib/fonts";
import { siteGraph } from "@/lib/structured-data";
import "../globals.css";

// Porcelaine type: Bricolage Grotesque for the page, Geist Mono for metadata,
// kickers and chips, Geist for the desktop runner's canvas and as a fallback.
// All four are self-hosted and declared in globals.css (src/lib/fonts.ts): with
// next/font their @font-face rules came in extra render-blocking stylesheets.
//
// Bricolage is self-hosted as two instances of the Google variable font, built
// by scripts/fonts/build-bricolage.py, because the full latin file (wght, opsz
// and wdth axes, ~130 KB) weighed on the mobile LCP. Together they are ~74 KB,
// both preloaded below, with Geist Mono, so the swap never shifts the hero:
// - display (titles): wdth 92 and opsz 96 fixed, weights 600-700, ~34 KB;
// - text: wdth 100, opsz fixed at 16, weights 300-800, ~39 KB.
// Latin only: no page text uses a latin-ext glyph.

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const description = t("description");
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: SITE_NAME,
      template: `%s | ${SITE_NAME}`,
    },
    description,
    icons: SITE_ICONS,
    manifest: "/manifest.webmanifest",
    alternates: localizedAlternates(locale),
    ...defaultSocialMetadata(locale),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Enable static rendering for this locale (next-intl).
  setRequestLocale(locale);

  for (const href of PRELOADED_FONT_URLS) {
    preload(href, { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  }

  return (
    <html lang={locale} data-scroll-behavior="smooth">
      <head>
        <link rel="ai-catalog" href="/.well-known/ai-catalog.json" />
      </head>
      <body className="antialiased">
        <JsonLd data={siteGraph(locale)} />
        <NextIntlClientProvider>
          <ClientProviders />
          <WebMcp />
          <ConditionalGridOverlay />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

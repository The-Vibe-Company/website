import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { WebMcp } from "@/components/WebMcp";
import { ClientProviders } from "@/components/ClientProviders";
import { JsonLd } from "@/components/JsonLd";
import { ConditionalGridOverlay } from "@/components/resources/ConditionalGridOverlay";
import { routing } from "@/i18n/routing";
import { defaultSocialMetadata, localizedAlternates, SITE_ICONS, SITE_NAME, SITE_URL } from "@/lib/site";
import { siteGraph } from "@/lib/structured-data";
import "../globals.css";

// Porcelaine type: Bricolage Grotesque for the page, Geist Mono for metadata,
// kickers and chips. Geist stays loaded as the canvas runner's sans and as the
// fallback.
//
// Bricolage is self-hosted as two instances of the Google variable font, built
// by scripts/fonts/build-bricolage.py, because the full latin file (wght, opsz
// and wdth axes, ~130 KB) weighed on the mobile LCP. Latin only: no page text
// uses a latin-ext glyph.
// - text (here, preloaded on every page): wdth 100, opsz fixed at 16, weights
//   300-800, ~39 KB;
// - display (titles: wdth 92 and opsz 96 fixed, weights 600-700, ~34 KB):
//   declared in globals.css and preloaded page by page, see src/lib/fonts.ts.
const bricolage = localFont({
  src: "../fonts/bricolage-text-latin.woff2",
  variable: "--font-bricolage",
  weight: "300 800",
  display: "swap",
});

// Not preloaded: the page text is set in Bricolage, so Geist only serves the
// desktop runner's canvas and the odd fallback glyph.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

// Not preloaded either: the mono only sets short one-line labels (kickers,
// chips, metadata), so the swap from its metric-matched fallback moves
// nothing, and its preload competed with the text cut and the CSS for the
// first frame (Lighthouse mobile, project pages: LCP 3.3 -> 2.6 s without it).
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

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

  return (
    // The font variables sit on <html> so the root-level --font-ui / --font-code
    // tokens in globals.css can resolve them.
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={`${bricolage.variable} ${geistSans.variable} ${geistMono.variable}`}
    >
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

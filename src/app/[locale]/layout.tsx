import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
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

// Porcelaine type: Bricolage Grotesque for the page (its width and optical-size
// axes carry the display titles), Geist Mono for metadata, kickers and chips.
// Geist stays loaded as the canvas runner's sans and as the fallback.
// Only the latin subset of Bricolage is preloaded: with its two axes it is
// ~130 KB, and latin-ext (~55 KB more, loaded on demand through its
// unicode-range) has no place on the mobile critical path. It stays
// preloaded: without it the swap from the Arial fallback, which cannot take the
// display titles' 92% width, shifted the hero (CLS 0.06 in CI).
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
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

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
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

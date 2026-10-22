import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ClientProviders } from "@/components/ClientProviders";
import { ConditionalGridOverlay } from "@/components/resources/ConditionalGridOverlay";
import { routing } from "@/i18n/routing";
import { localizedAlternates, SITE_NAME, SITE_URL } from "@/lib/site";
import "../globals.css";

// Porcelaine type: Bricolage Grotesque for the page (its width and optical-size
// axes carry the display titles), Geist Mono for metadata, kickers and chips.
// Geist stays loaded as the canvas runner's sans and as the fallback.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin", "latin-ext"],
  axes: ["opsz", "wdth"],
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
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
    icons: {
      icon: "/favicon.svg",
    },
    alternates: localizedAlternates(locale),
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
      className={`${bricolage.variable} ${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="antialiased">
        <NextIntlClientProvider>
          <ClientProviders />
          <ConditionalGridOverlay />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

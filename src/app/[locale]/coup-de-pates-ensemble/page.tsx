import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { setRequestLocale } from "next-intl/server";

import { EnsembleLanding } from "@/components/coup-de-pates/EnsembleLanding";
import { permanentRedirect } from "@/i18n/navigation";
import { ENSEMBLE_PATH } from "@/lib/coup-de-pates-ensemble";
import { localizedUrl } from "@/lib/site";
import "./ensemble.css";

// The client's display face. Scoped to this page through its CSS variable, so
// the rest of the site keeps loading Geist only.
const montserrat = Montserrat({
  variable: "--cdpe-font-display",
  subsets: ["latin"],
  display: "swap",
});

const TITLE = "Coup de Pates Ensemble, l’application des collaborateurs";
const DESCRIPTION =
  "Téléchargez Coup de Pates Ensemble et partageons ensemble les moments qui font vivre notre entreprise.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  // Unlisted by agreement: reachable by link, absent from search results.
  // The route stays crawlable in robots.txt so engines can actually read these
  // directives (https://developers.google.com/search/docs/crawling-indexing/block-indexing).
  robots: {
    index: false,
    follow: false,
    noimageindex: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
  // French-only: no English alternate, unlike every other page of the site.
  alternates: { canonical: localizedUrl("fr", ENSEMBLE_PATH) },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: localizedUrl("fr", ENSEMBLE_PATH),
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default async function CoupDePatesEnsemblePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // The page exists in French only. The middleware already sends every other
  // variant here; this is the backstop for anything that reaches the route
  // without passing through it.
  if (locale !== "fr") {
    permanentRedirect({ href: ENSEMBLE_PATH, locale: "fr" });
  }

  setRequestLocale(locale);

  return <EnsembleLanding fontClassName={montserrat.variable} />;
}

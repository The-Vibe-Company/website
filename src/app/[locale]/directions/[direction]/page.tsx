import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { Footer } from "@/components/Footer";
import { TopNav } from "@/components/TopNav";
import { DirectionSwitcher } from "@/components/home/directions/DirectionSwitcher";
import { DirectionHome as Atelier } from "@/components/home/directions/atelier";
import { DirectionHome as Cinetique } from "@/components/home/directions/cinetique";
import { DirectionHome as Eclipse } from "@/components/home/directions/eclipse";
import { DirectionHome as Editorial } from "@/components/home/directions/editorial";
import { DirectionHome as Lanterne } from "@/components/home/directions/lanterne";
import { DirectionHome as Live } from "@/components/home/directions/live";
import { DirectionHome as Profondeur } from "@/components/home/directions/profondeur";
import { DIRECTIONS, isDirectionId } from "@/components/home/directions/registry";
import { routing } from "@/i18n/routing";
import { getRunnerItems } from "@/lib/runner-worlds";

const HOMES = {
  editorial: Editorial,
  live: Live,
  cinetique: Cinetique,
  lanterne: Lanterne,
  profondeur: Profondeur,
  eclipse: Eclipse,
  atelier: Atelier,
} as const;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => DIRECTIONS.map((d) => ({ locale, direction: d.id })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ direction: string }>;
}): Promise<Metadata> {
  const { direction } = await params;
  const entry = DIRECTIONS.find((d) => d.id === direction);
  return {
    title: `Direction ${entry?.letter ?? ""} · ${entry?.name ?? ""}`,
    robots: { index: false, follow: false },
  };
}

// Homepage design directions under review. Not linked, not in the sitemap.
export default async function DirectionPage({
  params,
}: {
  params: Promise<{ locale: string; direction: string }>;
}) {
  const { locale, direction } = await params;
  if (!isDirectionId(direction)) notFound();
  setRequestLocale(locale);
  const contentLocale = locale === "fr" ? "fr" : "en";
  const Home = HOMES[direction];

  return (
    <div data-variant="hybrid" className="flex min-h-screen flex-col bg-background text-foreground">
      <TopNav />
      <main id="main-content" tabIndex={-1} className="flex-1">
        <Home locale={contentLocale} runnerItems={getRunnerItems(contentLocale)} />
      </main>
      <Footer />
      <DirectionSwitcher current={direction} />
    </div>
  );
}

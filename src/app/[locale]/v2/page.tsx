import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import { VibeRunner } from "@/components/home/runner/VibeRunner";
import { Services } from "@/components/home/Services";
import { Process } from "@/components/home/Process";
import { Proof } from "@/components/home/Proof";
import { FinalCTA } from "@/components/home/FinalCTA";
import { BOOKING_URL } from "@/lib/booking";
import { localizedAlternates } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "AI-native agency — run through our worlds",
    description:
      "An AI-native agency from the team behind Quivr. Press space and run through our worlds — products, services, and the work.",
    alternates: localizedAlternates(locale, "/v2"),
    robots: {
      index: false,
      follow: true,
    },
  };
}

// Preview of the homepage with the playable runner as its hero. Same design
// system as / (TopNav, porcelaine surface, Footer, sections, one rail); only
// the static hero is swapped for the game. The booking action carries the
// site-wide label, read from the messages like everywhere else.
export default async function V2Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "finalCta" });

  return (
    <div data-variant="hybrid" className="flex min-h-screen flex-col bg-background text-foreground">
      <TopNav />
      <main id="main-content" tabIndex={-1} className="flex-1">
        <VibeRunner bookLabel={t("bookCall")} bookUrl={BOOKING_URL} />
        <Services />
        <Process />
        <Proof />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

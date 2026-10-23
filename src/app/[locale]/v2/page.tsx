import type { Metadata } from "next";
import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import { VibeRunner } from "@/components/home/runner/VibeRunner";
import { Services } from "@/components/home/Services";
import { Process } from "@/components/home/Process";
import { Proof } from "@/components/home/Proof";
import { FinalCTA } from "@/components/home/FinalCTA";
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

// Preview of the existing homepage with the playable runner as its hero.
// Same design system as / (TopNav, warm-paper hybrid theme, Footer, sections);
// only the static hero is swapped for the game.
export default function V2Home() {
  return (
    <div data-variant="hybrid" className="flex min-h-screen flex-col bg-background text-foreground">
      <TopNav />
      <main id="main-content" tabIndex={-1} className="flex-1">
        <VibeRunner />
        <Services />
        <Process />
        <Proof />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

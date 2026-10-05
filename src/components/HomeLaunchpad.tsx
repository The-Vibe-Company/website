import { getRunnerItems } from "@/lib/runner-worlds";
import type { ContentLocale } from "@/lib/customers";
import { TopNav } from "./TopNav";
import { Footer } from "./Footer";
import { Hero } from "./home/Hero";
import { HeroMobile } from "./home/HeroMobile";
import { MobileBookingBar } from "./home/MobileBookingBar";
import { Quote } from "./home/Quote";
import { Services } from "./home/Services";
import { CaseStudy } from "./home/CaseStudy";
import { Proof } from "./home/Proof";
import { Clients } from "./home/Clients";
import { FinalCTA } from "./home/FinalCTA";

export function HomeLaunchpad({ locale }: { locale: ContentLocale }) {
  // Built on the server so the case-study and project catalogues never reach
  // the client bundle whole.
  const runnerItems = getRunnerItems(locale);

  return (
    <div data-variant="hybrid" className="flex min-h-screen flex-col bg-background text-foreground">
      <TopNav />
      <main id="main-content" tabIndex={-1} className="flex-1">
        {/* Below 768px the page is laid out as a poster (see DESIGN.md):
            HeroMobile replaces Hero and the logo marquee, and the client
            quote and the booking bar exist on phones only. */}
        <HeroMobile />
        <Hero runnerItems={runnerItems} />
        <Clients />
        <CaseStudy />
        <Quote />
        <Services />
        <Proof />
        <FinalCTA />
      </main>
      <Footer />
      <MobileBookingBar />
    </div>
  );
}

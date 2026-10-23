import { getRunnerItems } from "@/lib/runner-worlds";
import type { ContentLocale } from "@/lib/customers";
import { TopNav } from "./TopNav";
import { Footer } from "./Footer";
import { Hero } from "./home/Hero";
import { MobileBookingBar } from "./home/MobileBookingBar";
import { Quote } from "./home/Quote";
import { Services } from "./home/Services";
import { CaseStudy } from "./home/CaseStudy";
import { Proof } from "./home/Proof";
import { Clients } from "./home/Clients";
import { FinalCTA } from "./home/FinalCTA";
import { Reveal } from "./kit";

export function HomeLaunchpad({ locale }: { locale: ContentLocale }) {
  // Built on the server so the case-study and project catalogues never reach
  // the client bundle whole.
  const runnerItems = getRunnerItems(locale);

  return (
    <div data-variant="hybrid" className="flex min-h-screen flex-col bg-background text-foreground">
      <TopNav />
      <main id="main-content" tabIndex={-1} className="flex-1">
        {/* One hero from phone to desktop: the clay slab, then the runner on
            its lacquer band where there is a keyboard, then the three ways in.
            The client quote and the booking bar exist on phones only. */}
        <Hero runnerItems={runnerItems} />
        <Clients />
        {/* Below the fold, each band slides in once as it enters the screen
            (never for reduced motion, no-JS or an automated browser). */}
        <Reveal>
          <CaseStudy />
        </Reveal>
        <Reveal>
          <Quote />
        </Reveal>
        <Services />
        <Reveal from="right">
          <Proof />
        </Reveal>
        <Reveal from="scale">
          <FinalCTA />
        </Reveal>
        {/* Inside main, so the mobile menu makes it inert with the rest of
            the page while it is open. */}
        <MobileBookingBar />
      </main>
      <Footer showPriorityArticles />
    </div>
  );
}

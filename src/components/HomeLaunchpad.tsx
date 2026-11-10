import { getRunnerItems } from "@/lib/runner-worlds";
import type { ContentLocale } from "@/lib/customers";
import { TopNav } from "./TopNav";
import { Footer } from "./Footer";
import { Landing } from "./home/landing";
import { MobileBookingBar } from "./home/MobileBookingBar";

export function HomeLaunchpad({ locale }: { locale: ContentLocale }) {
  // Built on the server so the case-study and project catalogues never reach
  // the client bundle whole.
  const runnerItems = getRunnerItems(locale);

  return (
    <div data-variant="hybrid" className="flex min-h-screen flex-col bg-background text-foreground">
      <TopNav />
      <main id="main-content" tabIndex={-1} className="flex-1">
        <Landing runnerItems={runnerItems} />
        {/* Inside main, so the mobile menu makes it inert with the rest of
            the page while it is open. */}
        <MobileBookingBar />
      </main>
      <Footer showPriorityArticles />
    </div>
  );
}

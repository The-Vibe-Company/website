import { TopNav } from "./TopNav";
import { Footer } from "./Footer";
import { VibeWorlds } from "./home/VibeWorlds";
import { HomeEvidence } from "./home/HomeEvidence";
import { HomeMethod } from "./home/HomeMethod";
import { HomeProducts } from "./home/HomeProducts";
import { HomeFinalCTA } from "./home/HomeFinalCTA";

export function HomeLaunchpad() {
  return (
    <div data-variant="hybrid" className="flex min-h-screen flex-col bg-background text-foreground">
      <TopNav />
      <main id="main-content" tabIndex={-1} className="flex-1">
        <VibeWorlds />
        <HomeEvidence />
        <HomeMethod />
        <HomeProducts />
        <HomeFinalCTA />
      </main>
      <Footer />
    </div>
  );
}

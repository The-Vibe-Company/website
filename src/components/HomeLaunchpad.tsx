import { TopNav } from "./TopNav";
import { Footer } from "./Footer";
import { Hero } from "./home/Hero";
import { Services } from "./home/Services";
import { Process } from "./home/Process";
import { Proof } from "./home/Proof";
import { FinalCTA } from "./home/FinalCTA";

export function HomeLaunchpad() {
  return (
    <div data-variant="hybrid" className="flex min-h-screen flex-col bg-background text-foreground">
      <TopNav />
      <main className="flex-1">
        <Hero />
        <Services />
        <Process />
        <Proof />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

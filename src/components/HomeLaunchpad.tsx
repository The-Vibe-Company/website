import { TopNav } from "./TopNav";
import { Footer } from "./Footer";
import { Hero } from "./home/Hero";
import { Services } from "./home/Services";
import { CaseStudy } from "./home/CaseStudy";
import { Proof } from "./home/Proof";
import { Clients } from "./home/Clients";
import { FinalCTA } from "./home/FinalCTA";

export function HomeLaunchpad({
  caseStudyVariant = "default",
}: {
  caseStudyVariant?: "default" | "peek";
} = {}) {
  return (
    <div data-variant="hybrid" className="flex min-h-screen flex-col bg-background text-foreground">
      <TopNav />
      <main className="flex-1">
        <Hero />
        <Clients />
        <CaseStudy variant={caseStudyVariant} />
        <Services />
        <Proof />
        <FinalCTA step="02" />
      </main>
      <Footer />
    </div>
  );
}

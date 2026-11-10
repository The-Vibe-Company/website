import type { RunnerItem } from "@/lib/runner-worlds";
import { FinalCTA } from "../FinalCTA";
import { PaintedFlag } from "../PaintedFlag";
import { Clientele } from "./Clientele";
import { LandingHero } from "./LandingHero";
import { LitQuote } from "./LitQuote";
import { Offers } from "./Offers";
import { Tools } from "./Tools";
import { Workbench } from "./Workbench";

/**
 * The homepage: the hero with the mascot alone on the ink, then the page
 * turns to warm paper with a clean cut at the mascot's floor, the client
 * quote as one ink band in the middle, and the closing scene full width. The
 * runner game is hidden in the hero: the mascot jumps into it.
 */
export function Landing({ runnerItems }: { runnerItems: RunnerItem[] }) {
  return (
    <>
      <PaintedFlag />
      <div aria-hidden="true" className="landing-grain" />
      <LandingHero runnerItems={runnerItems} />
      <div data-surface="paper">
        <Clientele />
        <Offers />
        <Workbench />
      </div>
      <LitQuote />
      <div data-surface="paper">
        <Tools />
      </div>
      <FinalCTA />
    </>
  );
}

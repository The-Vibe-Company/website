"use client";

import { CLIENTS } from "../../Clients";
import { VelocityBand } from "./VelocityBand";

const VERBS = {
  fr: ["On construit", "On déploie", "On forme"],
  en: ["We build", "We deploy", "We train"],
};

/**
 * Two bands of giant words laid across each other like tape on a poster: the
 * verbs on a paper strip, the clients in outline on the ink, drifting in
 * opposite directions and leaning into the scroll.
 */
export function TapeCross({ locale }: { locale: "fr" | "en" }) {
  return (
    <section aria-label={locale === "fr" ? "Ce qu’on fait, pour qui" : "What we do, for whom"} className="relative overflow-hidden bg-background py-16 md:py-28">
      <div className="relative -mx-[6vw] -rotate-[3deg]">
        <VelocityBand
          words={VERBS[locale]}
          variant="tape"
          separator="square"
          direction={1}
          speed={2.6}
          textClassName="py-[0.12em] text-[clamp(52px,9vw,148px)]"
        />
      </div>
      <div className="relative -mx-[6vw] -mt-[2vw] rotate-[2deg]">
        <VelocityBand
          words={CLIENTS.map((c) => (c.name === "Agence France-Presse" ? "AFP" : c.name))}
          variant="outline"
          separator="slash"
          direction={-1}
          speed={2}
          textClassName="py-[0.1em] text-[clamp(52px,9vw,148px)]"
        />
      </div>
    </section>
  );
}

/** A single band of the three offers' tags, solid paper on the ink. */
export function TagBand({ tags }: { tags: string[] }) {
  return (
    <div aria-hidden="true" className="overflow-hidden border-y border-border bg-background py-6 md:py-8">
      <VelocityBand words={tags} variant="solid" separator="dot" direction={1} speed={1.6} textClassName="text-[clamp(40px,6vw,96px)]" />
    </div>
  );
}

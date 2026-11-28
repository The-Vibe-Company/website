import type { ReactNode } from "react";
import { BrandSquare } from "@/components/BrandSquare";
import { Backers } from "@/components/home/Backers";
import { MascotCutout } from "@/components/home/MascotCutout";
import { keepPunctuationAttached } from "@/lib/french-spacing";

const SECTION = "mx-auto max-w-[90rem] px-6 md:px-10 lg:px-16";

/**
 * The opening of a service landing, cut like the homepage's hero: a mono
 * kicker, the page's full H1 set directly in giant display type, then the
 * pitch, the call and the backers on the left, and the mascot standing on the
 * right in its orange light, cut at the chest by the paper band that follows.
 */
export function ServiceHero({
  kicker,
  title,
  lede,
  cta,
  response,
}: {
  kicker: string;
  /** The page's full title and sole H1, matching metaTitle without the brand suffix. */
  title: string;
  /** The pitch: one paragraph, or a few short ones. */
  lede: string | readonly string[];
  /** The booking call, already wired to its location. Left out when the
   *  page places its call after the value instead. */
  cta?: ReactNode;
  /** The response time, set in mono beside the backers, when the call does
   *  not already carry it. */
  response?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-72 -right-48 h-[900px] w-[1100px]"
        style={{
          background:
            "radial-gradient(closest-side, rgb(242 115 19 / 0.24), rgb(242 115 19 / 0.07) 55%, transparent)",
        }}
      />

      <div className={`relative ${SECTION}`}>
        <p className="m-0 inline-flex items-center pt-12 font-mono text-[12px] uppercase tracking-[0.2em] text-soft-foreground lg:pt-[80px]">
          <BrandSquare />
          {kicker}
        </p>

        <h1 className="relative z-20 m-0 mt-7 text-balance text-[clamp(2.35rem,5.8vw,5.5rem)] font-bold leading-[0.94] tracking-[-0.048em] text-foreground lg:mt-9">
          {keepPunctuationAttached(title)}
        </h1>

        <div className="mt-4 grid grid-cols-1 lg:mt-6 lg:grid-cols-[minmax(0,36rem)_minmax(0,1fr)]">
          <div className="relative z-20 pb-10 lg:pb-[72px]">
            {(typeof lede === "string" ? [lede] : lede).map((paragraph) => (
              <p
                key={paragraph}
                className="m-0 mt-6 max-w-[35rem] text-[17px] leading-[1.6] text-soft-foreground md:text-[19px]"
              >
                {paragraph}
              </p>
            ))}
            {cta}
            <div className="mt-12 flex flex-wrap items-center justify-between gap-x-10 gap-y-5 border-t border-border pt-7">
              <Backers className="flex-wrap gap-x-10" />
              {response ? (
                <span className="font-mono text-[12px] uppercase tracking-[0.18em] text-muted-foreground">{response}</span>
              ) : null}
            </div>
          </div>

          {/* Phones: the mascot under the pitch, cut by the paper. */}
          <div aria-hidden="true" className="relative h-[300px] lg:hidden">
            <MascotCutout variant="phone" />
          </div>

          {/* Desktop: the mascot in the right column, running out of the
              section, cut at the chest by the paper. */}
          <div aria-hidden="true" className="relative hidden lg:block">
            <div className="absolute left-1/2 top-0 w-[min(440px,34vw)] -translate-x-[28%] xl:top-2">
              <MascotCutout variant="desktop" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

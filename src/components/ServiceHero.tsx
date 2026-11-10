import Image from "next/image";
import type { ReactNode } from "react";
import { BrandSquare } from "@/components/BrandSquare";
import { Backers } from "@/components/home/Backers";
import { FitText } from "@/components/home/FitText";
import { keepPunctuationAttached } from "@/lib/french-spacing";

const SECTION = "mx-auto max-w-[90rem] px-6 md:px-10 lg:px-16";

/**
 * The opening of a service landing, cut like the homepage's hero: a mono
 * kicker, a short headline set to fill the content width, the page's full
 * title beneath it as the promise, then the pitch, the call and the backers
 * on the left, and the mascot standing on the right in its orange light,
 * cut at the chest by the paper band that follows.
 *
 * The short headline sits just before the h1, outside it and hidden from
 * assistive technology; the h1 holds only the page's full title, so the
 * heading search engines and screen readers see is that title alone.
 */
export function ServiceHero({
  kicker,
  display,
  title,
  lede,
  cta,
  response,
}: {
  kicker: string;
  /** A few words, set width-filling: "Agence IA Paris." */
  display: string;
  /** The page's full title, the one search engines see. */
  title: string;
  lede: string;
  /** The booking call, already wired to its location. */
  cta: ReactNode;
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

        <p
          aria-hidden="true"
          className="mt-8 block font-bold leading-[0.86] text-foreground [container-type:inline-size] lg:mt-10"
        >
          <FitText trackingEm={-0.055} className="-ml-[0.04em] transition-none">
            {display}
          </FitText>
        </p>
        <h1 className="m-0 font-bold text-foreground">
          <span className="relative z-20 mt-10 block max-w-[24ch] text-[clamp(1.6rem,2.5vw,2.25rem)] font-medium leading-[1.12] tracking-[-0.03em] lg:mt-[58px]">
            {keepPunctuationAttached(title)}
          </span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,34rem)_minmax(0,1fr)]">
          <div className="relative z-20 pb-10 lg:pb-[72px]">
            <p className="m-0 mt-6 max-w-[33rem] text-[17px] leading-[1.6] text-muted-foreground md:text-[19px]">{lede}</p>
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
            <Image
              src="/images/home/mascot-cutout.webp"
              alt=""
              width={488}
              height={672}
              priority
              fetchPriority="high"
              sizes="(min-width: 1024px) 0px, 280px"
              className="absolute left-1/2 top-0 w-[280px] max-w-none -translate-x-1/2 landing-float"
            />
          </div>

          {/* Desktop: the mascot in the right column, running out of the
              section, cut at the chest by the paper. */}
          <div aria-hidden="true" className="relative hidden lg:block">
            <div className="absolute -top-28 left-1/2 w-[min(470px,36vw)] -translate-x-[24%] xl:-top-[132px]">
              <Image
                src="/images/home/mascot-cutout.webp"
                alt=""
                width={488}
                height={672}
                priority
                sizes="(min-width: 1024px) 470px, 0px"
                className="h-auto w-full landing-float"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

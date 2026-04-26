"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { typography, spacing, cn } from "@/lib/design-system";
import { Marquee } from "./Marquee";

type SlabTheme = "light" | "dark" | "charcoal";

const slabThemes: Record<
  SlabTheme,
  {
    wrapper: string;
    metaText: string;
    metaBorder: string;
    arrow: string;
    hoverShadow: string;
    numberColor: string;
  }
> = {
  light: {
    wrapper: "bg-background text-foreground border-b-2 border-foreground",
    metaText: "text-muted-foreground",
    metaBorder: "border-foreground/30",
    arrow: "text-foreground/60 group-hover:text-foreground",
    hoverShadow: "8px 8px 0px 0px var(--foreground)",
    numberColor: "text-foreground/10",
  },
  dark: {
    wrapper: "bg-foreground text-background border-b-2 border-foreground",
    metaText: "text-background/60",
    metaBorder: "border-background/30",
    arrow: "text-background/60 group-hover:text-background",
    hoverShadow: "8px 8px 0px 0px rgba(255,255,255,0.55)",
    numberColor: "text-background/10",
  },
  charcoal: {
    wrapper: "bg-zinc-800 text-zinc-100 border-b-2 border-zinc-800",
    metaText: "text-zinc-300",
    metaBorder: "border-zinc-300/30",
    arrow: "text-zinc-300 group-hover:text-zinc-50",
    hoverShadow: "8px 8px 0px 0px rgba(255,255,255,0.45)",
    numberColor: "text-zinc-100/10",
  },
};

interface SlabProps {
  href: string;
  number: string;
  title: string;
  description: string;
  gate: string;
  status: string;
  theme: SlabTheme;
  fromLeft: boolean;
  delay: number;
  reduceMotion: boolean;
}

function Slab({
  href,
  number,
  title,
  description,
  gate,
  status,
  theme,
  fromLeft,
  delay,
  reduceMotion,
}: SlabProps) {
  const t = slabThemes[theme];
  const initialX = reduceMotion ? "0%" : fromLeft ? "-12%" : "12%";

  return (
    <motion.div
      initial={{ opacity: 0, x: initialX }}
      whileInView={{ opacity: 1, x: "0%" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        whileHover={{ x: 8, boxShadow: t.hoverShadow }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        className={cn("group relative", t.wrapper)}
      >
        <Link
          href={href}
          className={cn(
            "relative flex items-center min-h-[22vh] md:min-h-[26vh]",
            spacing.page.x
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "absolute left-2 md:left-8 top-1/2 -translate-y-1/2 select-none pointer-events-none font-bold tracking-tighter leading-none text-[14vw] md:text-[10vw]",
              t.numberColor
            )}
          >
            {number}
          </span>

          <div className="relative z-10 flex flex-1 items-center gap-4 md:gap-12 pl-[18vw] md:pl-[14vw]">
            <div className="flex-1 min-w-0">
              <h3 className="text-[clamp(1.5rem,5.5vw,4.5rem)] font-bold tracking-tighter leading-[0.95]">
                {title}
              </h3>
              <p
                className={cn(
                  typography.label.mono,
                  "mt-2 md:mt-3 hidden sm:block",
                  t.metaText
                )}
              >
                {description}
              </p>
            </div>

            <div className="hidden md:flex items-center gap-3 shrink-0">
              <span
                className={cn(
                  typography.label.mono,
                  t.arrow,
                  "transition-colors"
                )}
              >
                ENTER
              </span>
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={cn(
                  t.arrow,
                  "transition-all duration-300 group-hover:translate-x-2"
                )}
                aria-hidden="true"
              >
                <path
                  d="M5 12h14M13 5l7 7-7 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div
              className={cn(
                "hidden md:flex flex-col gap-1 border-l-2 pl-4 shrink-0",
                t.metaBorder,
                t.metaText
              )}
            >
              <span className={cn(typography.label.mono)}>GATE {gate}</span>
              <span className={cn(typography.label.mono)}>{status}</span>
            </div>
          </div>

          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={cn(
              "md:hidden absolute right-4 top-1/2 -translate-y-1/2 transition-transform duration-300 group-hover:translate-x-1",
              t.arrow
            )}
            aria-hidden="true"
          >
            <path
              d="M5 12h14M13 5l7 7-7 7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </motion.div>
    </motion.div>
  );
}

export function HomeNextSection() {
  const shouldReduceMotion = useReducedMotion() ?? false;

  return (
    <section
      className="snap-start min-h-full w-full bg-background flex flex-col"
      aria-label="Where to next"
    >
      <div className="bg-foreground text-background border-y-2 border-foreground">
        <Marquee>
          <span
            className={cn(
              typography.label.mono,
              "px-6 inline-flex items-center gap-3"
            )}
          >
            <span aria-hidden="true">▓</span> DEPARTURES{" "}
            <span aria-hidden="true">·</span> 03 ROUTES{" "}
            <span aria-hidden="true">·</span> STATUS LIVE{" "}
            <span aria-hidden="true">·</span> UPDATED 2026{" "}
            <span aria-hidden="true">·</span> BUILT IN PUBLIC{" "}
            <span aria-hidden="true">·</span> SHIPPING DAILY{" "}
            <span aria-hidden="true">·</span>
          </span>
        </Marquee>
      </div>

      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "flex-1 flex flex-col justify-center py-10 md:py-16",
          spacing.page.x
        )}
      >
        <span
          className={cn(
            typography.label.mono,
            "text-muted-foreground mb-3 md:mb-6"
          )}
        >
          ↓ NOW BOARDING
        </span>
        <h2 className="font-bold tracking-tighter leading-[0.85] text-[clamp(3rem,12vw,12rem)]">
          WHERE TO
          <br />
          NEXT
          <motion.span
            initial={{ rotate: 0 }}
            whileInView={{ rotate: shouldReduceMotion ? 0 : -4 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block origin-bottom-left"
          >
            ?
          </motion.span>
        </h2>
      </motion.div>

      <div className="flex flex-col">
        <Slab
          href="/portfolio"
          number="01"
          title="WHAT WE BUILT."
          description="PRODUCT SHOWCASE · DISTINCT IDENTITIES"
          gate="01 / 03"
          status="STATUS: SHIPPED"
          theme="light"
          fromLeft={true}
          delay={0.1}
          reduceMotion={shouldReduceMotion}
        />
        <Slab
          href="/resources"
          number="02"
          title="WHAT WE LEARNED."
          description="TUTORIALS · BUILD LOGS · RAW LEARNINGS"
          gate="02 / 03"
          status="STATUS: SHIPPING"
          theme="dark"
          fromLeft={false}
          delay={0.2}
          reduceMotion={shouldReduceMotion}
        />
        <Slab
          href="/agency"
          number="03"
          title="WHO WE ARE."
          description="A TINY TEAM · FAST · LOUD · IN PUBLIC"
          gate="03 / 03"
          status="STATUS: HIRING"
          theme="charcoal"
          fromLeft={true}
          delay={0.3}
          reduceMotion={shouldReduceMotion}
        />
      </div>

      <div className="bg-foreground text-background border-y-2 border-foreground">
        <Marquee reverse>
          <span
            className={cn(
              typography.label.mono,
              "px-6 inline-flex items-center gap-3"
            )}
          >
            <span aria-hidden="true">▓</span> ALL SYSTEMS GO{" "}
            <span aria-hidden="true">·</span> GMT+1{" "}
            <span aria-hidden="true">·</span> THE VIBE COMPANY{" "}
            <span aria-hidden="true">·</span> YC W24{" "}
            <span aria-hidden="true">·</span> BUILDING IN PUBLIC{" "}
            <span aria-hidden="true">·</span>
          </span>
        </Marquee>
      </div>
    </section>
  );
}

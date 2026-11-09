"use client";

import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRef, type PointerEvent } from "react";
import { BrandSquare } from "@/components/BrandSquare";
import { BOOKING_URL, CONTACT_EMAIL, bookingLocation } from "@/lib/booking";
import { captureEvent } from "@/lib/posthog";
import { DISPLAY } from "./font";

/**
 * The closing call. Its two lines slide in from opposite sides and unfold on
 * the width axis as the section scrolls up; the booking slab leans toward the
 * pointer like a magnet; the mascot climbs in from the right edge, in the same
 * orange bloom as the hero.
 */
export function Closing() {
  const t = useTranslations("finalCta");
  const reduceMotion = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 25%"] });
  const p = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: 0.4 });
  const line1X = useTransform(p, [0, 1], ["-18%", "0%"]);
  const line2X = useTransform(p, [0, 1], ["22%", "0%"]);
  const stretch = useTransform(p, [0, 1], ["50%", "92%"]);
  const mascotX = useTransform(p, [0.2, 1], ["60%", "0%"]);
  const mascotRotate = useTransform(p, [0.2, 1], [18, -10]);

  // Magnet: the slab drifts a third of the way toward the pointer.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 220, damping: 18, mass: 0.5 });
  const sy = useSpring(my, { stiffness: 220, damping: 18, mass: 0.5 });
  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const box = event.currentTarget.getBoundingClientRect();
    mx.set((event.clientX - (box.left + box.width / 2)) * 0.32);
    my.set((event.clientY - (box.top + box.height / 2)) * 0.32);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <section ref={ref} id="contact" className="relative overflow-hidden border-t border-border bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-72 -right-48 h-[760px] w-[1000px]"
        style={{
          background:
            "radial-gradient(closest-side, rgb(242 115 19 / 0.17), rgb(242 115 19 / 0.05) 55%, transparent)",
        }}
      />

      <motion.div
        aria-hidden="true"
        style={{ x: mascotX, rotate: mascotRotate }}
        className="pointer-events-none motion-reduce:transform-none! absolute -bottom-28 -right-20 w-[220px] origin-bottom mix-blend-lighten md:-bottom-52 md:-right-16 md:w-[380px] lg:w-[440px]"
      >
        <Image
          src="/images/home/mascot-glow.webp"
          alt=""
          width={516}
          height={716}
          sizes="(min-width: 1024px) 520px, (min-width: 768px) 440px, 240px"
          className="w-full"
        />
      </motion.div>

      <div className="relative mx-auto max-w-[90rem] px-6 pb-40 pt-20 md:px-10 md:pb-36 md:pt-32 lg:px-16">
        <span className="block font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <BrandSquare />
          {t("kicker")}
        </span>

        <h2
          className={`${DISPLAY} m-0 mt-8 font-extrabold uppercase leading-[0.82] tracking-[-0.02em] text-foreground`}
          style={{ fontSize: "clamp(40px, 12.5vw, 220px)" }}
        >
          <motion.span
            className="block whitespace-nowrap motion-reduce:transform-none! motion-reduce:[font-stretch:88%]!"
            style={{ x: line1X, fontStretch: stretch }}
          >
            {t("titleLine1")}
          </motion.span>
          <motion.span
            className="block whitespace-nowrap text-transparent [-webkit-text-stroke:2px_var(--foreground)] motion-reduce:transform-none! motion-reduce:[font-stretch:88%]!"
            style={{ x: line2X, fontStretch: stretch }}
          >
            {t("titleLine2")}
          </motion.span>
        </h2>

        <div className="mt-14 flex flex-col items-start gap-10 md:mt-20 md:flex-row md:items-center md:gap-16">
          {/* The magnet's reach: a generous pad around the slab. */}
          <div onPointerMove={onMove} onPointerLeave={onLeave} className="-m-8 p-8">
            <motion.a
              href={BOOKING_URL}
              {...bookingLocation("cta_final")}
              onClick={() => captureEvent("contact_cta_clicked", { location: "final_cta" })}
              style={{ x: sx, y: sy }}
              className="group inline-flex h-[72px] items-center gap-4 rounded-[2px] bg-foreground px-9 text-[19px] font-medium text-background transition-colors hover:bg-soft-foreground"
            >
              {t("bookCall")}
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1.5">
                →
              </span>
            </motion.a>
          </div>
          <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground">
            <dt className="text-muted-foreground">{t("responseLabel")}</dt>
            <dd className="m-0">{t("responseValue")}</dd>
            <dt className="text-muted-foreground">{t("emailLabel")}</dt>
            <dd className="m-0">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                onClick={() => captureEvent("get_in_touch_clicked", { location: "final_cta" })}
                className="normal-case tracking-[0.05em] underline decoration-1 underline-offset-4 hover:text-brand"
              >
                {CONTACT_EMAIL}
              </a>
            </dd>
          </dl>
        </div>
      </div>
    </section>
  );
}

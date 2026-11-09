"use client";

import { useTranslations } from "next-intl";
import { BOOKING_URL, bookingLocation } from "@/lib/booking";
import { captureEvent } from "@/lib/posthog";
import { Backers } from "./Backers";
import { CLIENTS } from "./Clients";
import { FitText } from "./FitText";
import { clientLogoSize } from "@/lib/client-logos";

const MONO = "font-mono text-[11px] uppercase tracking-[0.18em]";

/**
 * The phone hero is a poster: two lines of type set to the full screen width,
 * the claim, one call to action, and the client logos as a grid at its foot.
 * It replaces both the desktop hero and the logo marquee below 768px.
 */
export function HeroMobile() {
  const t = useTranslations("hero");
  const tFooter = useTranslations("footer");
  const tClients = useTranslations("clients");
  const poster = t.raw("poster") as string[];

  return (
    <section
      id="hero-mobile"
      className="border-b border-border bg-background px-6 pt-5 md:hidden"
    >
      <div className={`flex items-center justify-between gap-3 whitespace-nowrap text-muted-foreground ${MONO}`}>
        <span className="inline-flex items-center gap-2.5 text-soft-foreground">
          <span aria-hidden="true" className="h-2 w-2 bg-brand" />
          {tFooter("openToProjects")}
        </span>
        <span>Paris</span>
      </div>

      {/* Tracking in px, not em: an em value here would resolve against the
          heading's own 16px, not the fitted lines, and that -1px is the
          approved look. */}
      <h1 className="m-0 mt-7 font-extrabold leading-[0.84] tracking-[-1px] text-foreground [container-type:inline-size]">
        {/* Both lines solid paper, as the desktop slab: the poster is one
            block of type, not a headline and its echo. */}
        <FitText>{poster[0]}</FitText>
        <FitText>{poster[1]}</FitText>
        <span className="mt-7 block max-w-[20ch] text-[22px] font-medium leading-[1.2] tracking-[-0.025em]">
          {t("titleLine2")}
        </span>
      </h1>

      <p className="m-0 mt-3.5 max-w-[32ch] text-base leading-normal text-muted-foreground">
        {t("subtitle")}
      </p>

      {/* The same compact slab as on desktop: a full-width bar read as a
          shove on a phone. */}
      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3">
        <a
          href={BOOKING_URL}
          {...bookingLocation("hero")}
          onClick={() => captureEvent("discovery_call_clicked", { location: "hero" })}
          className="inline-flex items-center gap-3 rounded-[2px] bg-foreground px-6 py-4 text-[15px] font-medium text-background"
        >
          {t("bookCall")}
          <span aria-hidden="true" className="text-lg leading-none">
            →
          </span>
        </a>
        <span className={`text-muted-foreground ${MONO}`}>{t("response")}</span>
      </div>

      {/* The backers, as on desktop. */}
      <Backers className="mt-8 flex-wrap gap-x-8" />

      {/* A fixed gap, not pinned to the foot of the screen: pinned, it opened
          a hole of several hundred pixels on any phone taller than the
          content. */}
      <div className="-mx-6 mt-10 border-t border-border">
        <p className={`m-0 flex justify-between border-b border-border px-6 py-3 text-muted-foreground ${MONO}`}>
          <span>{tClients("trustedBy")}</span>
          <span aria-hidden="true">{String(CLIENTS.length).padStart(2, "0")}</span>
        </p>
        <ul className="m-0 grid list-none grid-cols-3 p-0">
          {CLIENTS.map((client) => (
            <li
              key={client.name}
              className="border-b border-r border-border [&:nth-child(3n)]:border-r-0 [&:nth-child(3n+1):nth-last-child(-n+3)]:border-b-0 [:nth-child(3n+1):nth-last-child(-n+3)~&]:border-b-0"
            >
              <a
                href={client.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={client.name}
                className="flex h-[76px] items-center justify-center"
              >
                {/* Lazy: React preloads every eager <img> in <head>, where
                    these seven logos competed with the poster's fonts and CSS.
                    Plain <img> rather than next/image: they are SVG or small
                    WebP/PNG already, and a srcset per logo would weigh more in
                    the HTML than it saves. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={client.src}
                  alt={client.name}
                  {...clientLogoSize(client.src)}
                  className="max-h-[26px] w-auto max-w-[72%] object-contain brightness-0 invert"
                  loading="lazy"
                  decoding="async"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

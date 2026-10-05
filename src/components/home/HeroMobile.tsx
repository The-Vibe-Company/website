"use client";

import { useTranslations } from "next-intl";
import { BOOKING_URL } from "@/lib/booking";
import { captureEvent } from "@/lib/posthog";
import { CLIENTS } from "./Clients";
import { FitText } from "./FitText";

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
      className="border-b-2 border-foreground bg-background px-6 pt-5 md:hidden"
    >
      <div className={`flex items-center justify-between gap-3 whitespace-nowrap text-muted-foreground ${MONO}`}>
        <span className="inline-flex items-center gap-2 text-foreground">
          <span aria-hidden="true" className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-500 opacity-60 motion-reduce:hidden" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
          </span>
          {tFooter("openToProjects")}
        </span>
        <span>
          <span className="max-[359px]:hidden">Paris · </span>YC W24
        </span>
      </div>

      {/* Tracking in px, not em: an em value here would resolve against the
          heading's own 16px, not the fitted lines, and that -1px is the
          approved look. */}
      <h1 className="m-0 mt-7 font-extrabold leading-[0.84] tracking-[-1px] text-foreground [container-type:inline-size]">
        <FitText>{poster[0]}</FitText>
        {/* The second line is drawn in outline, so the pair reads as one
            poster rather than two stacked headlines. */}
        <FitText className="text-transparent [-webkit-text-stroke:2px_var(--foreground)]">{poster[1]}</FitText>
        <span className="mt-6 block max-w-[20ch] text-[21px] font-semibold leading-[1.25] tracking-[-0.02em]">
          <span
            className="[box-decoration-break:clone] [-webkit-box-decoration-break:clone]"
            style={{
              backgroundImage: "linear-gradient(to top, rgb(249 115 22 / 0.3) 0.35em, transparent 0.35em)",
            }}
          >
            {t("titleLine2")}
          </span>
        </span>
      </h1>

      <p className="m-0 mt-3.5 max-w-[32ch] text-base leading-normal text-muted-foreground">
        {t("subtitle")}
      </p>

      <a
        href={BOOKING_URL}
        onClick={() => captureEvent("discovery_call_clicked", { location: "hero" })}
        className="mt-6 flex items-center justify-between bg-foreground px-[22px] py-5 text-[17px] font-semibold text-background"
      >
        {t("bookCall")}
        <span aria-hidden="true" className="text-[22px] leading-none">
          →
        </span>
      </a>
      <p className={`m-0 mt-3 text-muted-foreground ${MONO}`}>{t("response")}</p>

      {/* A fixed gap, not pinned to the foot of the screen: pinned, it opened
          a hole of several hundred pixels on any phone taller than the
          content. */}
      <div className="-mx-6 mt-10 border-t-2 border-foreground">
        <p className={`m-0 flex justify-between border-b border-border px-6 py-3 text-muted-foreground ${MONO}`}>
          <span>{tClients("trustedBy")}</span>
          <span aria-hidden="true">{String(CLIENTS.length).padStart(2, "0")}</span>
        </p>
        <ul className="m-0 grid list-none grid-cols-3 p-0">
          {CLIENTS.map((client) => (
            <li
              key={client.name}
              className="border-b border-r border-border [&:nth-child(3n)]:border-r-0 [&:nth-last-child(-n+3)]:border-b-0"
            >
              <a
                href={client.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={client.name}
                className="flex h-[76px] items-center justify-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={client.src}
                  alt={client.name}
                  className="max-h-[26px] w-auto max-w-[72%] object-contain brightness-0"
                  loading="eager"
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

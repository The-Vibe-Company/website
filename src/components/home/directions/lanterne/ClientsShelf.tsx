"use client";

import { useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useRef, type CSSProperties } from "react";
import { clientLogoSize } from "@/lib/client-logos";
import { CLIENTS } from "../../Clients";
import { Kicker } from "./light";

/**
 * The clients on a shelf in the dark. A beam travels slowly along it, picking
 * the logos out one after another; a mouse takes the beam over. Every logo
 * stays legible in the dim (the dark only takes them down to two-fifths).
 */
export function ClientsShelf() {
  const t = useTranslations("clients");
  const shelfRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;

  useEffect(() => {
    const shelf = shelfRef.current;
    if (!shelf || reduce) return;
    let frame = 0;
    let visible = false;
    let pointer: number | null = null;
    let x = 0;
    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      const w = shelf.clientWidth;
      const target = pointer ?? (Math.sin(now / 2600) * 0.5 + 0.5) * w;
      x += (target - x) * (pointer === null ? 1 : 0.12);
      shelf.style.setProperty("--beam", `${x}px`);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(shelf);
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer = e.clientX - shelf.getBoundingClientRect().left;
    };
    const onLeave = () => {
      pointer = null;
    };
    shelf.addEventListener("pointermove", onMove);
    shelf.addEventListener("pointerleave", onLeave);
    frame = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      shelf.removeEventListener("pointermove", onMove);
      shelf.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce]);

  return (
    <section aria-label={t("trustedBy")} className="relative bg-[#070707] pb-6 pt-16 md:pb-10 md:pt-24">
      <div className="mx-auto max-w-[90rem] px-6 md:px-10 lg:px-16">
        <Kicker>{t("trustedBy")}</Kicker>
      </div>
      <div
        ref={shelfRef}
        className="relative mt-8 border-y border-border"
        style={{ "--beam": "50%" } as CSSProperties}
      >
        <ul className="relative m-0 mx-auto grid max-w-[90rem] list-none grid-cols-3 p-0 px-6 md:grid-cols-7 md:px-10 lg:px-16">
          {CLIENTS.map((client) => (
            <li key={client.name} className="flex h-[84px] items-center justify-center md:h-[120px]">
              <a
                href={client.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={client.name}
                className="flex h-full w-full items-center justify-center transition-transform duration-300 hover:-translate-y-0.5"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={client.src}
                  alt={client.name}
                  {...clientLogoSize(client.src)}
                  className="max-h-[24px] w-auto max-w-[72%] object-contain brightness-0 invert md:max-h-[32px]"
                  loading="lazy"
                  decoding="async"
                />
              </a>
            </li>
          ))}
        </ul>
        {/* The dark over the shelf, with the beam cut out of it. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 motion-reduce:hidden"
          style={{
            background:
              "radial-gradient(340px 170px at var(--beam) 50%, transparent 0%, transparent 30%, rgb(7 7 7 / 0.6) 100%)",
          }}
        />
        {/* The beam's warmth on the shelf itself. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 mix-blend-screen"
          style={{
            background:
              "radial-gradient(300px 150px at var(--beam) 50%, rgb(255 160 80 / 0.2), rgb(242 115 19 / 0.06) 50%, transparent 80%)",
          }}
        />
      </div>
    </section>
  );
}

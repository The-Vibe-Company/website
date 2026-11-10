"use client";

import { useTranslations } from "next-intl";
import { CLIENTS } from "../Clients";
import { clientLogoSize } from "@/lib/client-logos";
import { cn } from "@/lib/design-system";

/**
 * The client logos running in a loop along the top edge of the paper, with
 * no heading: the names speak for themselves. The list is drawn twice so the
 * loop is seamless; the copy is hidden from assistive technology, and the
 * band stops when hovered (and never moves with reduced motion).
 */
export function Clientele() {
  const t = useTranslations("clients");
  return (
    <section aria-label={t("trustedBy")} className="border-b border-border bg-background">
      <div className={cn("group relative overflow-hidden py-10 md:py-12", "landing-edges")}>
        <div className={cn("flex w-max", "landing-marquee")}>
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              aria-hidden={copy === 1 || undefined}
              className="m-0 flex shrink-0 list-none items-center gap-16 p-0 pr-16 md:gap-24 md:pr-24"
            >
              {CLIENTS.map((client) => (
                <li key={client.name} className="shrink-0">
                  <a
                    href={client.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={client.name}
                    tabIndex={copy === 1 ? -1 : undefined}
                    className="block opacity-80 transition-opacity hover:opacity-100"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={client.src}
                      alt={copy === 1 ? "" : client.name}
                      {...clientLogoSize(client.src)}
                      className={cn(client.className, "w-auto object-contain logo-tone")}
                      loading="lazy"
                      decoding="async"
                    />
                  </a>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}

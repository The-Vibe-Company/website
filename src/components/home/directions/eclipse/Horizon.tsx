import { useTranslations } from "next-intl";
import { clientLogoSize } from "@/lib/client-logos";
import { CLIENTS } from "../../Clients";
import { CONTAINER } from "./shared";

/**
 * Where the sun went down: the clients stand on the horizon, a burning line
 * that is brightest under the middle of the row and cools to nothing at the
 * edges, with the last of the light spilling up behind them.
 */
export function Horizon() {
  const t = useTranslations("clients");

  return (
    <section aria-label={t("trustedBy")} className="relative overflow-hidden pb-20 pt-16 md:pb-28 md:pt-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-[4.5rem] h-56 bg-[radial-gradient(50%_100%_at_50%_100%,rgba(242,115,19,0.32),rgba(242,115,19,0.08)_55%,transparent_80%)] md:bottom-[6.5rem]"
      />
      <div className={CONTAINER}>
        <p className="m-0 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          <span>{t("trustedBy")}</span>
          <span aria-hidden="true">{String(CLIENTS.length).padStart(2, "0")}</span>
        </p>
        <ul className="m-0 mt-10 grid list-none grid-cols-3 items-end gap-x-6 gap-y-10 p-0 sm:grid-cols-4 md:mt-14 md:flex md:justify-between">
          {CLIENTS.map((client) => (
            <li key={client.name} className="flex justify-center md:block">
              <a
                href={client.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={client.name}
                className="inline-flex opacity-80 transition-[opacity,filter] duration-300 hover:opacity-100 hover:drop-shadow-[0_0_14px_rgba(242,115,19,0.75)] focus-visible:opacity-100"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={client.src}
                  alt={client.name}
                  {...clientLogoSize(client.src)}
                  className={`${client.className} w-auto max-w-[110px] object-contain brightness-0 invert md:max-w-none`}
                  loading="lazy"
                  decoding="async"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
      {/* The horizon itself. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-[4.5rem] h-px bg-[linear-gradient(90deg,transparent,rgba(242,115,19,0.4)_18%,#ffb067_50%,rgba(242,115,19,0.4)_82%,transparent)] shadow-[0_0_24px_2px_rgba(242,115,19,0.6)] md:bottom-[6.5rem]"
      />
    </section>
  );
}

import { useTranslations } from "next-intl";
import { clientLogoSize } from "@/lib/client-logos";
import { CLIENTS } from "../../Clients";

/**
 * The clients as a still masthead line rather than a marquee: a mono label,
 * then every logo in its own hairlined cell. Phones have the same logos as a
 * grid at the foot of the hero, so this is desktop only.
 */
export function ClientsLedger() {
  const t = useTranslations("clients");
  return (
    <section aria-label={t("trustedBy")} className="hidden md:block">
      <div className="mx-auto max-w-[90rem] px-10 lg:px-16">
        <div className="grid grid-cols-[13rem_minmax(0,1fr)] items-stretch border-t border-border lg:gap-14">
          <p className="m-0 flex flex-col justify-center gap-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            <span className="text-soft-foreground">{String(CLIENTS.length).padStart(2, "0")}</span>
            {t("trustedBy")}
          </p>
          <ul className="m-0 grid list-none grid-cols-7 p-0">
            {CLIENTS.map((client) => (
              <li key={client.name} className="border-l border-border">
                <a
                  href={client.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={client.name}
                  className="flex h-28 items-center justify-center px-4 opacity-70 transition-opacity duration-300 hover:opacity-100"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={client.src}
                    alt={client.name}
                    {...clientLogoSize(client.src)}
                    className="max-h-8 w-auto max-w-full object-contain brightness-0 invert"
                    loading="lazy"
                    decoding="async"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

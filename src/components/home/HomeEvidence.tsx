"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getCustomers, type ContentLocale } from "@/lib/customers";

const CLIENTS = [
  { name: "Agence France-Presse", src: "/images/clients/afp.svg", url: "https://www.afp.com" },
  { name: "Coup de Pates", src: "/images/clients/coup-de-pates.svg", url: "https://www.coupdepates.fr" },
  { name: "Monka", src: "/images/clients/monka.webp", url: "https://www.monka.care" },
  { name: "Trusk", src: "/images/clients/trusk.svg", url: "https://www.trusk.com" },
  { name: "LocService", src: "/images/clients/locservice.png", url: "https://www.locservice.fr" },
  { name: "Zapa", src: "/images/clients/zapa.svg", url: "https://www.zapa.fr" },
] as const;

export function HomeEvidence() {
  const locale = useLocale() as ContentLocale;
  const t = useTranslations("homeEvidence");
  const customer = getCustomers(locale).find((item) => item.slug === "monka")!;
  const [mobileVisual, desktopVisual] = customer.visuals;

  return (
    <section id="client-proof" className="scroll-mt-16 border-b-2 border-foreground bg-background">
      <div className="border-b border-border px-6 py-5 md:px-12 lg:px-24">
        <div className="mx-auto grid max-w-[100rem] gap-5 lg:grid-cols-[180px_1fr] lg:items-center">
          <p className="m-0 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            {t("trustedBy")}
          </p>
          <div className="grid grid-cols-3 items-center gap-x-6 gap-y-7 md:grid-cols-6">
            {CLIENTS.map((client) => (
              <a
                key={client.name}
                href={client.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={client.name}
                className="flex min-h-11 items-center justify-center transition-opacity hover:opacity-55"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={client.src} alt="" className="max-h-8 max-w-full object-contain brightness-0" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[100rem] px-6 py-20 md:px-12 md:py-28 lg:px-24">
        <div className="mb-12 grid gap-8 border-t-2 border-foreground pt-5 md:grid-cols-[1fr_1.2fr] md:items-end">
          <div>
            <p className="m-0 font-mono text-[10px] uppercase tracking-[0.18em] text-orange-800">
              {t("kicker")}
            </p>
            <h2 className="m-0 mt-4 max-w-[9ch] text-[clamp(48px,7vw,108px)] font-bold leading-[0.86] tracking-[-0.06em]">
              {t("title")}
            </h2>
          </div>
          <p className="m-0 max-w-[58ch] text-base leading-[1.55] text-muted-foreground md:justify-self-end md:text-lg">
            {customer.summary}
          </p>
        </div>

        <div className="grid items-stretch gap-0 border-2 border-foreground lg:grid-cols-[0.76fr_1.24fr]">
          <div className="relative min-h-[430px] overflow-hidden border-b-2 border-foreground bg-[#f3f0ea] p-6 lg:min-h-[680px] lg:border-b-0 lg:border-r-2">
            <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:32px_32px]" />
            <div className="absolute left-[10%] top-[8%] h-[82%] w-[48%] -rotate-3 overflow-hidden border border-foreground bg-white shadow-[8px_8px_0_#0a0a0a]">
              <Image src={mobileVisual.src} alt={mobileVisual.alt} fill sizes="(max-width: 1024px) 48vw, 28vw" className="object-cover object-top" />
            </div>
            <div className="absolute bottom-[10%] right-[7%] w-[45%] rotate-2 border border-foreground bg-background p-4 shadow-[6px_6px_0_#f97316]">
              <div className="text-[clamp(38px,5vw,76px)] font-bold leading-none tracking-[-0.06em]">{customer.metric}</div>
              <p className="m-0 mt-2 text-sm leading-[1.35] text-muted-foreground">{customer.metricLabel}</p>
            </div>
          </div>

          <div className="flex min-w-0 flex-col bg-foreground text-background">
            <div className="border-b border-white/20 p-5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
              {customer.client} · {customer.sector}
            </div>
            <div className="relative m-5 aspect-[16/9] overflow-hidden border border-white/25 bg-white md:m-8">
              <Image src={desktopVisual.src} alt={desktopVisual.alt} fill sizes="(max-width: 1024px) 90vw, 50vw" className="object-cover object-top" />
            </div>
            <div className="mt-auto grid gap-6 border-t border-white/20 p-5 md:grid-cols-[1fr_auto] md:items-end md:p-8">
              <ul className="m-0 grid list-none gap-3 p-0">
                {customer.points.slice(0, 2).map((point) => (
                  <li key={point} className="flex max-w-[58ch] gap-3 text-sm leading-[1.5] text-white/72">
                    <span aria-hidden="true" className="text-orange-500">→</span>
                    {point}
                  </li>
                ))}
              </ul>
              <Link
                href={`/case-studies/${customer.slug}?from=home`}
                className="inline-flex min-h-11 items-center gap-3 border border-background px-4 py-2 text-sm font-semibold text-background no-underline transition-colors hover:bg-background hover:text-foreground focus-visible:!outline-background focus-visible:outline-offset-4"
              >
                {t("readCase")} <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

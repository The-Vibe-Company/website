import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/design-system";
import { AGENCY_PARIS_PATHS, splitPath } from "@/lib/site";
import { DISPLAY } from "./font";
import { CONTAINER, LitTitle } from "./shared";

const ITEMS = ["build", "operate", "advise"] as const;

/**
 * Where the moon sits over the sun in each phase, as a share of the disc:
 * a first bite, totality, and the last sliver before it lets go (the moon
 * always sits right of the sun, so the glyph never spills over the column). Hovering a
 * column slides the moon off and the full sun comes through.
 */
const PHASES = [
  "translate-x-[42%] -translate-y-[12%]",
  "translate-x-0 translate-y-0",
  "translate-x-[64%] translate-y-[30%]",
] as const;

function PhaseGlyph({ phase }: { phase: string }) {
  return (
    <span aria-hidden="true" className="relative block h-24 w-24 md:h-28 md:w-28">
      <span className="absolute inset-[-40%] rounded-full bg-[radial-gradient(closest-side,rgba(242,115,19,0.35),transparent)] opacity-60 transition-opacity duration-700 group-hover:opacity-100 group-focus-within:opacity-100" />
      <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_40%_35%,#ffd09a,#f27313_55%,#a8360a)] shadow-[0_0_30px_6px_rgba(242,115,19,0.45)]" />
      <span
        className={cn(
          "absolute inset-[-1px] rounded-full bg-[#0c0c0d] shadow-[0_0_0_1px_rgba(255,176,103,0.35)] transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[118%] group-hover:-translate-y-[22%] group-focus-within:translate-x-[118%] group-focus-within:-translate-y-[22%]",
          phase,
        )}
      />
    </span>
  );
}

export function Services() {
  const t = useTranslations("services");
  const tParis = useTranslations("agencyParis");
  const locale = useLocale();

  return (
    <section id="services" className="relative scroll-mt-24 py-20 md:py-28">
      <div className={CONTAINER}>
        <LitTitle kicker={t("kicker")} line1={t("titleLine1")} line2={t("titleLine2")} />

        <ol className="m-0 mt-14 grid list-none grid-cols-1 border-y border-border p-0 md:mt-20 md:grid-cols-3">
          {ITEMS.map((key, index) => {
            const bullets = t.raw(`items.${key}.bullets`) as string[];
            return (
              // The eclipse on hover is decoration only: every word is visible
              // at rest, so nothing here needs to be reachable by keyboard.
              <li
                key={key}
                className="group relative flex flex-col gap-6 border-b border-border px-1 py-10 last:border-b-0 md:border-b-0 md:border-r md:px-8 md:py-12 md:last:border-r-0 md:first:pl-0"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-2/3 bg-[radial-gradient(60%_70%_at_30%_0%,rgba(242,115,19,0.16),transparent)] opacity-0 transition-opacity duration-700 group-hover:opacity-100 group-focus-within:opacity-100"
                />
                <div className="flex items-start justify-between gap-6">
                  <PhaseGlyph phase={PHASES[index]} />
                  <span className={cn(DISPLAY, "text-[56px] font-black leading-none text-border-strong transition-colors duration-500 group-hover:text-brand group-focus-within:text-brand")}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div>
                  <span className="inline-block border border-border-strong px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-soft-foreground">
                    {t(`items.${key}.tag`)}
                  </span>
                  <h3 className="m-0 mt-4 text-[26px] font-bold leading-[1.1] tracking-[-0.025em] text-foreground">
                    {t(`items.${key}.title`)}
                  </h3>
                  <p className="m-0 mt-3 text-[15px] leading-[1.6] text-soft-foreground">{t(`items.${key}.desc`)}</p>
                </div>
                <ul className="m-0 flex list-none flex-col gap-2.5 p-0 text-[14px] leading-[1.45] text-muted-foreground">
                  {bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3">
                      <span aria-hidden="true" className="mt-[0.6em] h-px w-3 shrink-0 bg-brand" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ol>

        <Link
          href={splitPath(AGENCY_PARIS_PATHS, locale)}
          className="mt-8 flex items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground transition-colors hover:text-brand"
        >
          <span className="underline decoration-1 underline-offset-4">{tParis("homeLink")}</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}

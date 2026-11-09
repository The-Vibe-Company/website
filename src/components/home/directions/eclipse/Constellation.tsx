import { useTranslations } from "next-intl";
import type { CSSProperties } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/design-system";
import { getProjects, type ContentLocale } from "@/lib/projects";
import styles from "./eclipse.module.css";
import { CONTAINER, LitTitle } from "./shared";

const ORG_URL = "https://github.com/The-Vibe-Company";

/** Where each product sits in the sky (percent of the sky's box), in release order. */
const POSITIONS: [number, number][] = [
  [7, 66],
  [17, 30],
  [29, 58],
  [40, 24],
  [51, 52],
  [61, 20],
  [71, 60],
  [82, 30],
  [92, 64],
];

/** Faint background stars, from a fixed seed so server and client agree. */
function backgroundStars(count: number) {
  let seed = 7;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  return Array.from({ length: count }, () => ({
    x: rand() * 100,
    y: rand() * 100,
    r: 0.6 + rand() * 1.1,
    o: 0.15 + rand() * 0.5,
  }));
}
const STARS = backgroundStars(110);

/**
 * Night has fallen: our products come out as a constellation, joined in the
 * order we shipped them. Each star is a link; its name is always written under
 * it, its category and status come up on hover or focus. Phones get the same
 * products as a plain list.
 */
export function Constellation({ locale }: { locale: ContentLocale }) {
  const t = useTranslations("proof");
  const projects = getProjects(locale);
  const points = projects.map((_, i) => POSITIONS[i % POSITIONS.length]);

  return (
    <section className="relative py-20 md:py-28">
      <div className={CONTAINER}>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12">
          <LitTitle kicker={t("kicker")} line1={t("titleLine1")} line2={t("titleLine2")} />
          <p className="m-0 max-w-[26rem] text-[16px] leading-[1.6] text-soft-foreground md:mb-3">{t("intro")}</p>
        </div>

        {/* The sky (tablet and up). */}
        <div className="relative mt-14 hidden h-[520px] border-y border-border md:block">
          <div aria-hidden="true" className="absolute inset-0">
            {STARS.map((s, i) => (
              <span
                key={i}
                className={cn("absolute rounded-full bg-foreground", i % 5 === 0 && styles.twinkle)}
                style={
                  {
                    left: `${s.x}%`,
                    top: `${s.y}%`,
                    width: `${s.r * 2}px`,
                    height: `${s.r * 2}px`,
                    opacity: s.o,
                    animationDelay: `${(i % 9) * 0.7}s`,
                  } as CSSProperties
                }
              />
            ))}
          </div>
          <svg aria-hidden="true" className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polyline
              points={points.map(([x, y]) => `${x},${y}`).join(" ")}
              fill="none"
              stroke="rgba(242,115,19,0.45)"
              strokeWidth="1"
              strokeDasharray="2 5"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <ul className="m-0 list-none p-0">
            {projects.map((p, i) => {
              const [x, y] = points[i];
              return (
                <li key={p.slug} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${x}%`, top: `${y}%` }}>
                  <Link
                    href={`/portfolio/${p.slug}`}
                    className="group flex flex-col items-center gap-3 no-underline outline-none"
                    style={{ "--accent": p.accent } as CSSProperties}
                  >
                    <span
                      className={cn(
                        "relative grid h-14 w-14 place-items-center rounded-full border border-[rgba(255,176,103,0.35)] bg-[#0c0c0d] shadow-[0_0_24px_4px_rgba(242,115,19,0.35)] transition-[box-shadow,border-color,transform] duration-500 group-hover:scale-110 group-hover:border-[var(--accent)] group-hover:shadow-[0_0_40px_10px_color-mix(in_oklab,var(--accent)_55%,transparent)] group-focus-visible:scale-110 group-focus-visible:border-[var(--accent)] group-focus-visible:shadow-[0_0_40px_10px_color-mix(in_oklab,var(--accent)_55%,transparent)]",
                        styles.starGlow,
                      )}
                      style={{ animationDelay: `${i * 0.45}s` } as CSSProperties}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.logo} alt="" aria-hidden="true" className="h-7 w-7 rounded-md object-contain" loading="lazy" decoding="async" />
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground">{p.name}</span>
                    <span className="pointer-events-none absolute top-full mt-1 w-max max-w-[14rem] -translate-y-1 text-center font-mono text-[10px] uppercase leading-[1.5] tracking-[0.16em] text-muted-foreground opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                      {p.tag}
                      <br />
                      {p.status} · {p.date}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Phones: the same products, listed. */}
        <ul className="m-0 mt-10 list-none border-t border-border p-0 md:hidden">
          {projects.map((p) => (
            <li key={p.slug} className="border-b border-border">
              <Link href={`/portfolio/${p.slug}`} className="flex items-center gap-4 py-4 no-underline">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[rgba(255,176,103,0.35)] shadow-[0_0_18px_2px_rgba(242,115,19,0.3)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.logo} alt="" aria-hidden="true" className="h-6 w-6 rounded object-contain" loading="lazy" decoding="async" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-[12px] uppercase tracking-[0.18em] text-foreground">{p.name}</span>
                  <span className="mt-1 block text-[13px] text-muted-foreground">
                    {p.tag} · {p.status}
                  </span>
                </span>
                <span aria-hidden="true" className="text-brand">→</span>
              </Link>
            </li>
          ))}
        </ul>

        <a
          href={ORG_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground underline decoration-1 underline-offset-4 transition-colors hover:text-brand"
        >
          {t("browseAll")} <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}

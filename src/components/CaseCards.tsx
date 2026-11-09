import { FitText, FitTextGroup } from "@/components/home/FitText";
import { Link } from "@/i18n/navigation";
import { clientLogoSize } from "@/lib/client-logos";
import type { Customer } from "@/lib/customers";
import { cn } from "@/lib/design-system";

/** The short orange bar a lamp card hangs from, with its glow. */
const LAMP =
  "absolute left-1/2 top-0 h-1.5 w-16 -translate-x-1/2 bg-brand shadow-[0_0_40px_12px_rgba(242,115,19,0.45)]";

/**
 * The client cases as lamp cards, on the homepage and the case studies page
 * alike. With an odd count the first case opens on a wide card, its figure
 * and its story side by side, so the grid closes without a gap.
 *
 * Everything lines up from card to card: the header is one height, every
 * figure shares one size (the largest at which the longest still fits its
 * card on one line), each caption keeps room for two lines, and the "read"
 * link sits at the foot of the card.
 */
export function CaseCards({
  cases,
  from,
  readLabel,
}: {
  cases: Customer[];
  /** Where the case is opened from, for its back link. */
  from: "home" | "case-studies";
  readLabel: string;
}) {
  return (
    <FitTextGroup texts={cases.map((c) => c.metric ?? "")}>
      <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2">
        {cases.map((c, i) => {
          const wide = i === 0 && cases.length % 2 === 1;
          return (
            <li key={c.slug} className={cn("flex", wide && "md:col-span-2")}>
              <Link
                href={`/case-studies/${c.slug}?from=${from}`}
                className="lamp-card group relative flex w-full flex-col overflow-hidden border border-border p-7 no-underline transition-colors hover:border-border-strong md:p-9"
              >
                <span aria-hidden="true" className={LAMP} />
                <div className="relative flex min-h-8 items-start justify-between gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.logo}
                    alt={c.client}
                    {...clientLogoSize(c.logo)}
                    className="logo-tone h-7 w-auto object-contain md:h-8"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="line-clamp-2 max-w-[16rem] text-right font-mono text-[10px] uppercase leading-[1.6] tracking-[0.16em] text-muted-foreground">
                    {c.sector}
                  </span>
                </div>

                <div
                  className={cn(
                    "relative mt-12 flex flex-1 flex-col",
                    wide && "md:grid md:grid-cols-2 md:items-start md:gap-12 lg:gap-16",
                  )}
                >
                  <div>
                    <p className="m-0 font-bold leading-[0.95] tracking-[-0.05em] [container-type:inline-size]">
                      <FitText max={88} trackingEm={-0.05} className="text-lit transition-none">
                        {c.metric ?? ""}
                      </FitText>
                    </p>
                    <p className="m-0 mt-3 min-h-[3em] max-w-[28rem] text-[15px] leading-[1.5] text-soft-foreground">
                      {c.metricLabel}
                    </p>
                  </div>

                  <div
                    className={cn(
                      "mt-6 flex flex-1 flex-col border-t border-border pt-6",
                      wide && "md:mt-0 md:h-full md:border-l md:border-t-0 md:pl-12 md:pt-0 lg:pl-16",
                    )}
                  >
                    <p className="m-0 max-w-[36rem] text-[15px] leading-[1.55] text-muted-foreground">{c.summary}</p>
                    <span className="mt-auto inline-flex items-center gap-2 pt-7 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground">
                      <span className="underline decoration-1 underline-offset-4 group-hover:text-brand">{readLabel}</span>
                      <span aria-hidden="true" className="text-brand">
                        →
                      </span>
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </FitTextGroup>
  );
}

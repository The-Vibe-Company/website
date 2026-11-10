import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

import type { Customer } from "@/lib/customers";
import { clientLogoSize } from "@/lib/client-logos";
import { BrandSquare } from "@/components/BrandSquare";

/** The short orange bar a lamp card hangs from, with its glow. */
const LAMP =
  "absolute left-1/2 top-0 h-1.5 w-16 -translate-x-1/2 bg-brand shadow-[0_0_40px_12px_rgba(242,115,19,0.45)]";

/**
 * "Keep reading" block for case studies — same editorial format as the
 * articles' KeepReading: one featured "Next" case with a large pane and
 * summary, followed by up to two compact cards. Case studies have no cover
 * images, so the panes show the client logo instead, the featured one under a
 * lamp like the cards on the case-studies index; the compact ones are plain
 * cards. Drawn against the tokens, so it reads on ink or on a paper band.
 */
export async function CaseStudyKeepReading({
  items,
  divided = false,
}: {
  items: Customer[];
  /** Open with a hairline, when the block follows other content on its band. */
  divided?: boolean;
}) {
  if (items.length === 0) return null;

  const t = await getTranslations("caseStudiesPage");
  const [featured, ...rest] = items;
  const secondary = rest.slice(0, 2);

  return (
    <section
      className={`mx-auto max-w-[80rem] px-6 py-20 md:px-10 md:py-28 lg:px-16 lg:py-32 ${divided ? "border-t border-border" : ""}`}
    >
      <span className="mb-10 block font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground md:mb-12">
        <BrandSquare />
        {t("keepReading")}
      </span>

      <Link href={`/case-studies/${featured.slug}`} className="group block no-underline">
        <article className="flex flex-col overflow-hidden border border-border bg-card transition-colors hover:border-border-strong md:flex-row">
          {/* The client's logo hangs under the lamp. */}
          <div className="lamp-card relative flex aspect-[16/10] shrink-0 items-center justify-center overflow-hidden border-b border-border p-10 md:aspect-auto md:w-[44%] md:border-b-0 md:border-r">
            <span aria-hidden="true" className={LAMP} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={featured.logo}
              alt={featured.client}
              {...clientLogoSize(featured.logo)}
              className="logo-tone relative h-10 w-auto max-w-[70%] object-contain md:h-12"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="flex flex-1 flex-col justify-center p-7 md:p-9">
            <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground">
                <BrandSquare />
                {t("next")}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {featured.sector}
              </span>
            </div>
            <h3 className="m-0 mb-3 text-[clamp(1.75rem,2.6vw,2.4rem)] font-bold leading-[1.05] tracking-[-0.035em] text-foreground">
              {featured.client}
            </h3>
            <p className="m-0 mb-6 line-clamp-2 max-w-xl text-[15px] leading-[1.55] text-muted-foreground md:text-base">
              {featured.summary}
            </p>
            <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground">
              <span className="underline decoration-1 underline-offset-4 group-hover:text-brand">
                {t("readCase")}
              </span>
              <span aria-hidden="true" className="text-brand">
                &rarr;
              </span>
            </span>
          </div>
        </article>
      </Link>

      {secondary.length > 0 && (
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {secondary.map((c) => (
            <Link
              key={c.slug}
              href={`/case-studies/${c.slug}`}
              className="group flex gap-5 border border-border bg-card p-5 no-underline transition-colors hover:border-border-strong md:p-6"
            >
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden border border-border p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.logo}
                  alt={c.client}
                  {...clientLogoSize(c.logo)}
                  className="logo-tone max-h-full max-w-full object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="m-0 mb-1 line-clamp-2 text-lg font-bold leading-snug tracking-[-0.02em] text-foreground decoration-1 underline-offset-4 group-hover:underline">
                  {c.client}
                </h4>
                <p className="m-0 mb-2 line-clamp-2 text-sm leading-snug text-muted-foreground">
                  {c.summary}
                </p>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {c.sector}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

import type { Customer } from "@/lib/customers";

/**
 * "Keep reading" block for case studies — same editorial format as the
 * articles' KeepReading: one featured "Next" case with a large pane and
 * summary, followed by up to two compact cards. Case studies have no cover
 * images, so the panes show the client logo instead.
 */
export async function CaseStudyKeepReading({ items }: { items: Customer[] }) {
  if (items.length === 0) return null;

  const t = await getTranslations("caseStudiesPage");
  const [featured, ...rest] = items;
  const secondary = rest.slice(0, 2);

  return (
    <section className="mx-auto max-w-[80rem] border-t border-border px-6 py-24 md:px-12">
      <div className="mb-10">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {t("keepReading")}
        </span>
      </div>

      <Link href={`/case-studies/${featured.slug}`} className="group block no-underline">
        <article className="flex flex-col overflow-hidden rounded-lg border border-border bg-background transition-colors hover:border-foreground/35 md:flex-row">
          <div className="flex aspect-[16/10] shrink-0 items-center justify-center border-b border-border p-10 md:aspect-auto md:w-[44%] md:border-b-0 md:border-r">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={featured.logo}
              alt={featured.client}
              className="h-10 w-auto max-w-[70%] object-contain transition-transform duration-300 group-hover:scale-105 md:h-12"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="flex flex-1 flex-col justify-center p-7 md:p-9">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full border border-orange-500/40 bg-orange-500/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-orange-600">
                {t("next")}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {featured.sector}
              </span>
            </div>
            <h3 className="mb-3 text-2xl font-bold leading-tight tracking-tighter text-foreground decoration-1 underline-offset-4 group-hover:underline md:text-3xl">
              {featured.client}
            </h3>
            <p className="mb-5 line-clamp-2 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
              {featured.summary}
            </p>
            <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-foreground">
              {t("readCase")}
              <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
            </span>
          </div>
        </article>
      </Link>

      {secondary.length > 0 && (
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {secondary.map((c) => (
            <Link
              key={c.slug}
              href={`/case-studies/${c.slug}`}
              className="group flex gap-4 rounded-lg border border-border bg-background p-4 no-underline transition-colors hover:border-foreground/35"
            >
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.logo}
                  alt={c.client}
                  className="max-h-full max-w-full object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="mb-1 line-clamp-2 text-sm font-bold leading-snug tracking-tight text-foreground decoration-1 underline-offset-2 group-hover:underline">
                  {c.client}
                </h4>
                <p className="mb-2 line-clamp-2 text-xs leading-snug text-muted-foreground">
                  {c.summary}
                </p>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
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

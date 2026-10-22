import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

import { Arrow, Kicker } from "@/components/kit";
import type { Customer } from "@/lib/customers";

/**
 * "Keep reading" block for case studies: one featured "Next" case (a quiet
 * clay piece, the client's logo on a pressed tile) followed by up to two
 * smaller ones. Case studies have no cover images, so the tiles show the
 * client logo instead. Every piece is a link and rises under the pointer.
 */
export async function CaseStudyKeepReading({ items }: { items: Customer[] }) {
  if (items.length === 0) return null;

  const t = await getTranslations("caseStudiesPage");
  const [featured, ...rest] = items;
  const secondary = rest.slice(0, 2);

  return (
    <section className="section">
      <div className="wrap">
        <Kicker as="h2">{t("keepReading")}</Kicker>

        <Link
          href={`/case-studies/${featured.slug}`}
          className="group clay-quiet lift mt-6 grid grid-cols-1 gap-2 rounded-plate p-3 no-underline md:mt-7 md:grid-cols-[5fr_6fr]"
        >
          <span className="flex min-h-[132px] items-center justify-center rounded-piece bg-[linear-gradient(180deg,#ececea,#f2f2f0)] p-8 md:min-h-[230px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={featured.logo}
              alt=""
              className="h-10 w-auto max-w-[70%] object-contain md:h-12"
              loading="lazy"
              decoding="async"
            />
          </span>
          <span className="flex min-w-0 flex-col items-start px-3 pb-2 pt-5 md:px-7 md:pb-3 md:pt-6">
            <span className="flex max-w-full flex-wrap items-center gap-x-4 gap-y-2">
              <span className="chip well">
                <span className="dot dot-rim" aria-hidden="true" />
                {t("next")}
              </span>
              <span className="min-w-0 max-w-full truncate font-mono text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
                {featured.sector}
              </span>
            </span>
            <h3 className="display m-0 mt-4 text-[clamp(2rem,1.5rem+1.4vw,2.5rem)] leading-none decoration-rim decoration-2 underline-offset-[6px] group-hover:underline">
              {featured.client}
            </h3>
            <p className="mb-4 mt-3.5 line-clamp-2 max-w-[56ch] text-base leading-normal text-muted-foreground md:text-[1.0625rem]">
              {featured.summary}
            </p>
            <span className="link-rim mt-auto">
              <span className="t">{t("readCase")}</span>
              <Arrow />
            </span>
          </span>
        </Link>

        {secondary.length > 0 && (
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {secondary.map((c) => (
              <Link
                key={c.slug}
                href={`/case-studies/${c.slug}`}
                className="group clay-quiet lift flex items-start gap-3 rounded-piece p-3.5 no-underline md:gap-[18px] md:p-4"
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] bg-[linear-gradient(180deg,#ececea,#f3f3f1)] p-2 md:h-[84px] md:w-[84px] md:rounded-2xl md:p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.logo}
                    alt=""
                    className="max-h-full max-w-full object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                </span>
                <span className="flex min-w-0 flex-1 flex-col items-start">
                  <h3 className="display m-0 text-[1.1875rem] font-[650] leading-tight decoration-rim decoration-2 underline-offset-4 group-hover:underline">
                    {c.client}
                  </h3>
                  <p className="m-0 mt-1.5 line-clamp-2 text-[0.9375rem] leading-snug text-muted-foreground">
                    {c.summary}
                  </p>
                  <span className="mt-2.5 max-w-full truncate font-mono text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
                    {c.sector}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

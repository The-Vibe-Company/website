import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BrandSquare } from "@/components/BrandSquare";
import { getCustomers } from "@/lib/customers";
import { CaseCards } from "@/components/CaseCards";

/**
 * The client work as lit benches: each case under its own warm lamp, the
 * figure first, laid out exactly as on the case studies page.
 */
export function Workbench() {
  const t = useTranslations("caseStudy");
  const locale = useLocale() === "en" ? "en" : "fr";
  const cases = getCustomers(locale).slice(0, 5);

  return (
    <section aria-labelledby="cas-clients-title" className="bg-background">
      <div className="mx-auto max-w-[90rem] px-6 py-24 md:px-10 lg:px-16 lg:py-32">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-muted-foreground">
              <BrandSquare />
              {t("kicker")}
            </span>
            <h2
              id="cas-clients-title"
              className="m-0 mt-6 text-[clamp(2.75rem,6.4vw,6rem)] font-bold leading-[0.92] tracking-[-0.045em] text-foreground"
            >
              {t("titleLine1")}
              <br />
              <span className="text-lit">{t("titleLine2")}</span>
            </h2>
          </div>
          <Link
            href="/case-studies"
            className="shrink-0 font-mono text-[11px] uppercase tracking-[0.2em] text-soft-foreground underline decoration-1 underline-offset-4 transition-colors hover:text-foreground"
          >
            {t("seeAll")} →
          </Link>
        </div>

        <div className="mt-14">
          <CaseCards cases={cases} from="home" readLabel={t("readCase")} />
        </div>
      </div>
    </section>
  );
}

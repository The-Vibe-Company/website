import { useLocale, useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { AGENCY_PARIS_PATHS, splitPath } from "@/lib/site";

/**
 * A discreet ruled strip under the homepage services, pointing at the
 * "AI agency in Paris" landing page. The home keeps its own title and hero;
 * this link is what tells search engines which page carries that query.
 */
export function AgencyParisLink() {
  const t = useTranslations("agencyParis");
  const locale = useLocale();

  return (
    <div className="mx-auto max-w-[100rem] px-6 pb-12 md:px-12 md:pb-16 md:-mt-12">
      <Link
        href={splitPath(AGENCY_PARIS_PATHS, locale)}
        className="flex items-center justify-between gap-4 border-y border-border py-4 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground transition-colors hover:text-muted-foreground"
      >
        <span className="underline decoration-1 underline-offset-4">{t("homeLink")}</span>
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}

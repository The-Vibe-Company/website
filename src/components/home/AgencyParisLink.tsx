import { useLocale, useTranslations } from "next-intl";

import { LinkRim } from "@/components/kit";
import { AGENCY_PARIS_PATHS, splitPath } from "@/lib/site";

/**
 * A discreet rim link under the homepage services, pointing at the
 * "AI agency in Paris" landing page. The home keeps its own title and hero;
 * this link is what tells search engines which page carries that query.
 */
export function AgencyParisLink() {
  const t = useTranslations("agencyParis");
  const locale = useLocale();

  return (
    <div className="wrap mt-6 md:mt-8">
      <LinkRim href={splitPath(AGENCY_PARIS_PATHS, locale)}>{t("homeLink")}</LinkRim>
    </div>
  );
}

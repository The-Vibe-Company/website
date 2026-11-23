"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { BackLink } from "@/components/BackLink";
import { backLinkLeadsHome } from "@/lib/case-study-links";
import { cardOriginFor } from "@/lib/case-study-origin";

/**
 * Names the back link after where the visitor came from. It renders the
 * case studies index by default (server and first client render), then
 * switches to the home page on mount when the visitor came from home: a case
 * card clicked on the home page, or a full page load referred by it.
 * No URL param and no dynamic API, so the case-study page stays static.
 */
export function CaseStudyBackLink() {
  const t = useTranslations("caseStudiesPage");
  const [fromHome, setFromHome] = useState(false);

  useEffect(() => {
    const navigation = performance.getEntriesByType("navigation")[0];
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads browser-only navigation context once after hydration
    setFromHome(
      backLinkLeadsHome({
        cardOriginPath: cardOriginFor(window.location.pathname),
        referrer: document.referrer,
        currentUrl: window.location.href,
        initialDocumentUrl: navigation?.name ?? null,
      }),
    );
  }, []);

  return fromHome ? (
    <BackLink href="/" label={t("backHome")} />
  ) : (
    <BackLink href="/case-studies" label={t("back")} />
  );
}

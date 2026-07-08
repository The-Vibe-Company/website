"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { BackLink } from "@/components/BackLink";

/**
 * Names the back link after where the visitor came from, read client-side.
 * Keeping this on the client lets the case-study page stay statically
 * prerendered (reading `searchParams` on the server would force dynamic
 * rendering and break the SSG page at runtime).
 */
export function CaseStudyBackLink() {
  const from = useSearchParams().get("from");
  const t = useTranslations("caseStudiesPage");

  return from === "home" ? (
    <BackLink href="/" label={t("backHome")} />
  ) : (
    <BackLink href="/case-studies" label={t("back")} />
  );
}

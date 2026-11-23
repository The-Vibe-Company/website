"use client";

import type { ReactNode } from "react";

import { Link } from "@/i18n/navigation";
import { rememberCardClick } from "@/lib/case-study-origin";

/** A case card's link: notes the page it is clicked from, for the back link. */
export function CaseCardLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  return (
    <Link href={href} className={className} onClick={(event) => rememberCardClick(window.location.pathname, event.currentTarget.pathname)}>
      {children}
    </Link>
  );
}

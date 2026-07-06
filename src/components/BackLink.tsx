"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface BackLinkProps {
  /** Where to go when there is no in-app history to go back to. */
  fallbackHref: string;
  label: string;
}

export function BackLink({ fallbackHref, label }: BackLinkProps) {
  const router = useRouter();

  return (
    <Link
      href={fallbackHref}
      onClick={(event) => {
        // If the visitor came from another page on the site (homepage or the
        // case-studies index), go back there. Otherwise use the fallback.
        if (typeof window !== "undefined" && window.history.length > 1) {
          event.preventDefault();
          router.back();
        }
      }}
      className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
    >
      <span
        aria-hidden="true"
        className="transition-transform duration-200 group-hover:-translate-x-1"
      >
        &larr;
      </span>
      {label}
    </Link>
  );
}

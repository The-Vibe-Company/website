import { Link } from "@/i18n/navigation";

interface BackLinkProps {
  /** Destination to return to (named by the page via its label). */
  href: string;
  label: string;
}

export function BackLink({ href, label }: BackLinkProps) {
  return (
    <Link
      href={href}
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

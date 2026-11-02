import { Arrow } from "@/components/kit";
import { Link } from "@/i18n/navigation";

interface BackLinkProps {
  /** Destination to return to (named by the page via its label). */
  href: string;
  label: string;
}

export function BackLink({ href, label }: BackLinkProps) {
  return (
    <Link href={href} className="back">
      <Arrow direction="left" />
      {label}
    </Link>
  );
}

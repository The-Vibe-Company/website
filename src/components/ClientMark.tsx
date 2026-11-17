import { clientLogoSize } from "@/lib/client-logos";
import { cn } from "@/lib/design-system";

/**
 * A client's mark: its logo when the site has one, otherwise its name set in
 * type at the logo's height, in the band's ink like `logo-tone`. Some clients
 * have no logo under `public/images/clients/`; their name stands in for it
 * rather than a missing image.
 */
export function ClientMark({
  logo,
  client,
  className,
  textClassName,
  decorative = false,
  lazy = true,
  wrap = false,
}: {
  logo?: string;
  client: string;
  /** Classes for the `<img>`: height, width, fit. */
  className?: string;
  /** Classes for the name when there is no logo: its size, to match the logo's height. */
  textClassName?: string;
  /** The client is named next to the mark: hide it from assistive tech. */
  decorative?: boolean;
  lazy?: boolean;
  /** Let the name break onto two lines, for a narrow box. */
  wrap?: boolean;
}) {
  if (!logo) {
    return (
      <span
        aria-hidden={decorative || undefined}
        className={cn(
          "inline-block max-w-full font-bold text-foreground",
          wrap ? "leading-tight tracking-[-0.01em]" : "whitespace-nowrap leading-none tracking-[-0.03em]",
          textClassName,
        )}
      >
        {client}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logo}
      alt={decorative ? "" : client}
      aria-hidden={decorative || undefined}
      {...clientLogoSize(logo)}
      className={cn("logo-tone", className)}
      loading={lazy ? "lazy" : undefined}
      decoding={lazy ? "async" : undefined}
    />
  );
}

/**
 * The small orange square that opens every eyebrow label ("■ OUVERT AUX
 * PROJETS"): the site's one status mark, inline so it sits on the label's
 * first line whatever its layout.
 */
export function BrandSquare() {
  return <span aria-hidden="true" className="mr-3 inline-block h-2 w-2 shrink-0 bg-brand align-[0.05em]" />;
}

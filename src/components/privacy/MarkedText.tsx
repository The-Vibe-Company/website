import { Fragment } from "react";

import { CONTACT_EMAIL } from "@/lib/booking";

/** Written in the copy wherever a fact is still missing. */
export const TBC_MARKERS = ["À CONFIRMER", "TO BE CONFIRMED"] as const;

const CNIL = "www.cnil.fr";

const TOKEN = new RegExp(
  `(${[...TBC_MARKERS, CONTACT_EMAIL, CNIL].map((s) => s.replace(/\./g, "\\.")).join("|")})`,
);

/**
 * Plain copy from the messages, with the contact address and the CNIL site
 * turned into links, and every "to be confirmed" marker set apart so nobody
 * mistakes a missing fact for a stated one.
 */
export function MarkedText({ text }: { text: string }) {
  return (
    <>
      {text.split(TOKEN).map((part, i) => {
        if (!part) return null;
        if ((TBC_MARKERS as readonly string[]).includes(part)) {
          return (
            <span
              key={i}
              className="whitespace-nowrap border border-dashed border-foreground px-1.5 py-px font-mono text-[0.78em] uppercase tracking-[0.08em] text-foreground"
            >
              {part}
            </span>
          );
        }
        if (part === CONTACT_EMAIL) {
          return (
            <a
              key={i}
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-foreground underline decoration-1 underline-offset-4 hover:text-muted-foreground"
            >
              {part}
            </a>
          );
        }
        if (part === CNIL) {
          return (
            <a
              key={i}
              href={`https://${CNIL}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline decoration-1 underline-offset-4 hover:text-muted-foreground"
            >
              {part}
            </a>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

import { Fragment } from "react";

import { CONTACT_EMAIL } from "@/lib/booking";

const CNIL = "www.cnil.fr";

const TOKEN = new RegExp(
  `(${[CONTACT_EMAIL, CNIL].map((s) => s.replace(/\./g, "\\.")).join("|")})`,
);

/**
 * Plain copy from the messages, with the contact address and the CNIL site
 * turned into links.
 */
export function MarkedText({ text }: { text: string }) {
  return (
    <>
      {text.split(TOKEN).map((part, i) => {
        if (!part) return null;
        if (part === CONTACT_EMAIL) {
          return (
            <a
              key={i}
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-foreground underline decoration-1 underline-offset-4 transition-colors hover:text-brand"
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
              className="text-foreground underline decoration-1 underline-offset-4 transition-colors hover:text-brand"
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

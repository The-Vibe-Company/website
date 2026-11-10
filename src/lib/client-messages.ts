/**
 * The message namespaces read by client components. The locale layout hands
 * only these to NextIntlClientProvider: every message passed there is
 * serialized into the HTML of every page (the RSC payload), and the whole
 * catalogue weighed about 100 KB, two thirds of the homepage's HTML.
 *
 * Server components read their messages on the server and are not limited by
 * this list. `client-messages.test.ts` walks the client module graph and fails
 * when a client component reads a namespace missing from here, or reads one
 * it does not name literally.
 */
export const CLIENT_MESSAGE_NAMESPACES = [
  "nav",
  "accessibility",
  "footer",
  "hero",
  "runner",
  "finalCta",
  "caseStudiesPage",
  "resources",
  "services",
  "proof",
  "process",
] as const;

export function pickClientMessages<T extends Record<string, unknown>>(messages: T): Partial<T> {
  const picked: Record<string, unknown> = {};
  for (const ns of CLIENT_MESSAGE_NAMESPACES) {
    if (ns in messages) picked[ns] = messages[ns];
  }
  return picked as Partial<T>;
}

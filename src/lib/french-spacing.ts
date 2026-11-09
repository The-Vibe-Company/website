/**
 * French sets a space before ":", ";", "?" and "!". On a narrow screen a
 * plain space lets the mark wrap to the start of the next line, alone.
 * Joining it to the word before with a no-break space keeps them together.
 * For display only: the messages, and the titles built from them for search
 * engines, keep their plain spaces.
 */
export function keepPunctuationAttached(text: string): string {
  return text.replace(/ ([:;?!])/g, " $1");
}

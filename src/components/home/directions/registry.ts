/**
 * Homepage design directions under review, each a full homepage below the
 * shared nav, served at /[locale]/directions/<id> (noindex, out of the
 * sitemap). The one chosen replaces the sections in HomeLaunchpad; the others
 * are deleted.
 */
export const DIRECTIONS = [
  { id: "editorial", letter: "A", name: "Éditorial" },
  { id: "live", letter: "B", name: "Live" },
  { id: "cinetique", letter: "C", name: "Cinétique" },
  { id: "lanterne", letter: "D", name: "Lanterne" },
  { id: "profondeur", letter: "E", name: "Profondeur" },
  { id: "eclipse", letter: "F", name: "Éclipse" },
  { id: "atelier", letter: "G", name: "Atelier" },
] as const;

export type DirectionId = (typeof DIRECTIONS)[number]["id"];

export function isDirectionId(value: string): value is DirectionId {
  return DIRECTIONS.some((d) => d.id === value);
}

import { getCustomers, type ContentLocale } from "./customers";
import { getProjects } from "./projects";

/**
 * What the hero runner shows in the corner of each world.
 *
 * The list is built from the real case studies and projects, so adding a
 * customer to `customers.ts` or a project to `projects.ts` adds a world to the
 * game without touching the game.
 */
export type RunnerItemKind = "client" | "project" | "badge";

export interface RunnerItem {
  kind: RunnerItemKind;
  name: string;
  /** One short line: sector for a client, category for a project. */
  detail: string;
}

const BADGES: RunnerItem[] = [
  { kind: "badge", name: "Y Combinator", detail: "W24" },
  { kind: "badge", name: "France 2030", detail: "Bpifrance" },
];

/** Round-robin, so two worlds in a row never show the same kind of thing. */
function interleave(groups: RunnerItem[][]): RunnerItem[] {
  const longest = Math.max(0, ...groups.map((group) => group.length));
  const out: RunnerItem[] = [];
  for (let i = 0; i < longest; i++) {
    for (const group of groups) {
      if (i < group.length) out.push(group[i]);
    }
  }
  return out;
}

export function getRunnerItems(locale: ContentLocale): RunnerItem[] {
  const clients: RunnerItem[] = getCustomers(locale).map((customer) => ({
    kind: "client",
    name: customer.client,
    // Sectors read "Santé · Accompagnement des aidants"; the game only has
    // room for the first half.
    detail: customer.sector.split("·")[0].trim(),
  }));

  const projects: RunnerItem[] = getProjects(locale).map((project) => ({
    kind: "project",
    name: project.name,
    detail: project.tag,
  }));

  return interleave([clients, projects, BADGES]);
}

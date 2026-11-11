export interface RobotsGroup { agents: string[]; rules: { allow: boolean; path: string }[] }
export function parseRobots(text: string): RobotsGroup[] {
  const groups: RobotsGroup[] = [];
  let group: RobotsGroup | undefined;
  let directives = false;
  for (const line of text.split(/\r?\n/)) {
    // Split on the first colon instead of one regex with lazy and trailing
    // whitespace groups, which backtracks quadratically on long hostile lines.
    const comment = line.indexOf("#");
    const clean = comment < 0 ? line : line.slice(0, comment);
    const colon = clean.indexOf(":");
    if (colon < 0) continue;
    const rawKey = clean.slice(0, colon).trim();
    if (!/^[\w-]+$/.test(rawKey)) continue;
    const value = clean.slice(colon + 1).trim();
    const key = rawKey.toLowerCase();
    if (key === "user-agent" && value) {
      if (!group || directives) { group = { agents: [], rules: [] }; groups.push(group); directives = false; }
      group.agents.push(value.toLowerCase());
    } else if (group && ["allow", "disallow"].includes(key)) {
      directives = true;
      if (value) group.rules.push({ allow: key === "allow", path: value });
    }
  }
  return groups;
}
export function botAllowed(groups: RobotsGroup[], bot: string, path = "/") {
  const explicit = groups.filter((g) => g.agents.includes(bot.toLowerCase()));
  const applicable = explicit.length ? explicit : groups.filter((g) => g.agents.includes("*"));
  const rules = applicable.flatMap((g) => g.rules).filter((r) => {
    const pattern = r.path.split("*").map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join(".*").replace(/\\\$$/, "$");
    return new RegExp(`^${pattern}`).test(path);
  }).sort((a, b) => b.path.length - a.path.length || Number(b.allow) - Number(a.allow));
  return { covered: applicable.length > 0, allowed: rules[0]?.allow ?? true };
}

export interface RobotsGroup { agents: string[]; rules: { allow: boolean; path: string }[] }
export function parseRobots(text: string): RobotsGroup[] {
  const groups: RobotsGroup[] = [];
  let group: RobotsGroup | undefined;
  let directives = false;
  for (const line of text.split(/\r?\n/)) {
    const match = line.replace(/#.*$/, "").match(/^\s*([\w-]+)\s*:\s*(.*?)\s*$/);
    if (!match) continue;
    const [, rawKey, value] = match;
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

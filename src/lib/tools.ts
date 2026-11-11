import { AGENT_READY_PATHS, type SplitPaths } from "@/lib/site";

/**
 * The free tools listed on /[locale]/tools, in display order. Each entry's
 * copy lives in the `tools.items.<key>` messages (name, description); add a
 * tool by adding its route, an entry here and those two messages.
 */
export type Tool = { key: string; paths: SplitPaths };

export const TOOLS = [{ key: "agentReady", paths: AGENT_READY_PATHS }] as const satisfies readonly Tool[];

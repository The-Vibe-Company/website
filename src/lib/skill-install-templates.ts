import type { SkillMeta } from '@/lib/content-source';

export const AI_INSTALL_TARGETS = [
  { id: 'claude-code', label: 'Claude Code' },
  { id: 'cursor', label: 'Cursor' },
  { id: 'codex', label: 'Codex' },
  { id: 'generic', label: 'Generic agent' },
] as const;

export type AIInstallTargetId = (typeof AI_INSTALL_TARGETS)[number]['id'];

export interface SkillInstallContext {
  slug: string;
  title: string;
  summary: string;
  canonicalUrl: string;
  kind: SkillMeta['kind'];
  allowedTools?: string[];
  trigger?: string;
  sourceUrl?: string;
  sourcePath?: string;
}

function toolsClause(allowedTools?: string[]): string {
  if (!allowedTools || allowedTools.length === 0) return '';
  return `\n  allowed-tools: [${allowedTools.join(', ')}]`;
}

function externalReferenceClause(ctx: SkillInstallContext): string {
  if (ctx.kind !== 'external' || !ctx.sourceUrl) return '';
  const subPath = ctx.sourcePath ? ` (subpath: ${ctx.sourcePath})` : '';
  return `\nThe canonical implementation lives at ${ctx.sourceUrl}${subPath}. Prefer pulling the latest version from there if accessible.`;
}

function triggerClause(trigger?: string): string {
  return trigger ? `\nTrigger phrases for invocation: ${trigger}.` : '';
}

function sourceFetchStep(ctx: SkillInstallContext): string {
  if (ctx.kind === 'external' && ctx.sourceUrl) {
    const subPath = ctx.sourcePath ? ` Use the subpath "${ctx.sourcePath}" if the repository contains multiple skills.` : '';
    return `Fetch the canonical skill implementation from ${ctx.sourceUrl}.${subPath} Use ${ctx.canonicalUrl} only as the listing page for metadata.`;
  }
  return `Fetch the skill page at ${ctx.canonicalUrl} and extract the markdown body. That body IS the skill prompt.`;
}

const templates: Record<AIInstallTargetId, (ctx: SkillInstallContext) => string> = {
  'claude-code': (ctx) => `Install the "${ctx.title}" skill from The Vibe Company.

1. ${sourceFetchStep(ctx)}
2. Save it as ~/.claude/skills/${ctx.slug}/SKILL.md, creating the directory if needed.
3. Use this YAML frontmatter:
  ---
  name: ${ctx.slug}
  description: "${ctx.summary.replace(/"/g, '\\"')}"
  user-invocable: true${toolsClause(ctx.allowedTools)}
  ---
${triggerClause(ctx.trigger)}${externalReferenceClause(ctx)}

4. Confirm installation with a one-line summary and stop.`,

  cursor: (ctx) => `Install the "${ctx.title}" skill from The Vibe Company into Cursor.

1. ${sourceFetchStep(ctx)}
2. In the current workspace, create .cursor/rules/${ctx.slug}.mdc.
3. Use this frontmatter (Cursor MDC format):
  ---
  description: "${ctx.summary.replace(/"/g, '\\"')}"
  globs: []
  alwaysApply: false
  ---
4. Paste the fetched skill content underneath as the rule content.
${triggerClause(ctx.trigger)}${externalReferenceClause(ctx)}

5. Confirm the file is created and stop.`,

  codex: (ctx) => `Install the "${ctx.title}" skill from The Vibe Company into Codex.

1. ${sourceFetchStep(ctx)}
2. Append it to ~/.codex/instructions.md under a heading "## ${ctx.title}".
3. Above the body, add a one-line trigger: "Use when: ${ctx.trigger ?? ctx.summary}".${externalReferenceClause(ctx)}

4. Confirm installation with a one-line summary and stop.`,

  generic: (ctx) => `Install the "${ctx.title}" skill from The Vibe Company.

1. ${sourceFetchStep(ctx)}
2. Save the fetched skill content somewhere your agent runtime reads (system prompt, rules file, or a SKILL.md equivalent).
3. Make sure the agent invokes it when the user asks: "${ctx.trigger ?? ctx.summary}".${externalReferenceClause(ctx)}

4. Confirm installation and stop.`,
};

export function buildAIInstallPrompt(target: AIInstallTargetId, ctx: SkillInstallContext): string {
  const template = templates[target] ?? templates.generic;
  return template(ctx);
}

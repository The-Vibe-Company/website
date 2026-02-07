/**
 * Maps Notion property names/values to our content model.
 */

const TYPE_MAP: Record<string, string> = {
  'Daily Learning': 'daily',
  Daily: 'daily',
  Tutorial: 'tutorial',
  Article: 'article',
  'Tool Focus': 'tool-focus',
  'Concept Focus': 'concept-focus',
}

const DOMAIN_MAP: Record<string, string> = {
  Development: 'dev',
  Dev: 'dev',
  Design: 'design',
  Operations: 'ops',
  Ops: 'ops',
  Business: 'business',
  'AI & Automation': 'ai-automation',
  AI: 'ai-automation',
  Marketing: 'marketing',
}

export function mapContentType(notionType: string): string {
  return TYPE_MAP[notionType] ?? 'article'
}

export function mapDomain(notionDomain: string): string | null {
  return DOMAIN_MAP[notionDomain] ?? null
}

export function mapDomains(notionDomains: string[]): string[] {
  return notionDomains.map(mapDomain).filter((d): d is string => d !== null)
}

export function mapLanguage(notionLanguage: string): 'fr' | 'en' {
  const lower = notionLanguage.toLowerCase()
  if (lower === 'en' || lower === 'english') return 'en'
  return 'fr'
}

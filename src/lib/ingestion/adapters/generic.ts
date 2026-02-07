import type { IngestionAdapter, RawContent } from './types'

interface GenericIngestPayload {
  source: string
  title: string
  body: string
  type: string
  summary: string
  domain?: string[]
  tools?: string[]
  concepts?: string[]
  language?: 'fr' | 'en'
  externalId?: string
}

/**
 * Generic adapter for direct API ingestion (CLI, Slack, Browser, etc).
 * Accepts pre-structured payloads from the POST /api/content/ingest endpoint.
 */
export function createGenericAdapter(sourceName: string): IngestionAdapter {
  return {
    name: sourceName,

    async extract(payload: unknown): Promise<RawContent> {
      const data = payload as GenericIngestPayload
      return {
        title: data.title,
        markdown: data.body,
        type: data.type as RawContent['type'],
        summary: data.summary,
        domain: data.domain,
        tools: data.tools,
        concepts: data.concepts,
        language: data.language,
        externalId: data.externalId,
      }
    },

    validate(raw: RawContent) {
      const errors: string[] = []
      if (!raw.title) errors.push('title is required')
      if (!raw.markdown) errors.push('body is required')
      if (!raw.type) errors.push('type is required')
      if (!raw.summary) errors.push('summary is required')
      return { valid: errors.length === 0, errors }
    },
  }
}

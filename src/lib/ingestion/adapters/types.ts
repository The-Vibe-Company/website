/**
 * Standardized content format that all adapters must produce.
 * This is the universal intermediate representation between any source and Payload.
 */
export interface RawContent {
  title: string
  markdown: string
  type: 'daily' | 'tutorial' | 'article' | 'tool-focus' | 'concept-focus'
  summary: string
  domain?: string[]
  tools?: string[] // Tool slugs to resolve to IDs
  concepts?: string[]
  language?: 'fr' | 'en'
  externalId?: string
  sourceUrl?: string
  metadata?: Record<string, unknown>
}

/**
 * Interface that all source adapters must implement.
 */
export interface IngestionAdapter {
  /** Adapter name for logging */
  name: string

  /** Extract structured content from raw source payload */
  extract(payload: unknown): Promise<RawContent>

  /** Validate extracted content, return errors if any */
  validate(raw: RawContent): { valid: boolean; errors: string[] }
}

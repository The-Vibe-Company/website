import { Client } from '@notionhq/client'
import type { IngestionAdapter, RawContent } from '../types'
import { blocksToMarkdown } from './blocks-to-markdown'
import { mapContentType, mapDomains, mapLanguage } from './property-mapper'

interface NotionWebhookPayload {
  source?: { type?: string }
  data?: {
    page_id?: string
    properties?: Record<string, unknown>
  }
}

/**
 * Extracts title from Notion's title property format.
 */
function extractTitle(prop: unknown): string {
  if (!prop || typeof prop !== 'object') return ''
  const p = prop as { title?: Array<{ plain_text?: string }> }
  return p.title?.map((t) => t.plain_text ?? '').join('') ?? ''
}

/**
 * Extracts plain text from Notion's rich_text property format.
 */
function extractRichText(prop: unknown): string {
  if (!prop || typeof prop !== 'object') return ''
  const p = prop as { rich_text?: Array<{ plain_text?: string }> }
  return p.rich_text?.map((t) => t.plain_text ?? '').join('') ?? ''
}

/**
 * Extracts select value from Notion's select property format.
 */
function extractSelect(prop: unknown): string {
  if (!prop || typeof prop !== 'object') return ''
  const p = prop as { select?: { name?: string } }
  return p.select?.name ?? ''
}

/**
 * Extracts multi_select values from Notion's multi_select property format.
 */
function extractMultiSelect(prop: unknown): string[] {
  if (!prop || typeof prop !== 'object') return []
  const p = prop as { multi_select?: Array<{ name: string }> }
  return p.multi_select?.map((s) => s.name) ?? []
}

/**
 * Notion adapter for the ingestion pipeline.
 * Receives Notion automation webhook payloads, fetches full page content,
 * and converts to our RawContent format.
 */
export const notionAdapter: IngestionAdapter = {
  name: 'notion',

  async extract(payload: unknown): Promise<RawContent> {
    const webhook = payload as NotionWebhookPayload
    const properties = webhook.data?.properties ?? {}
    const pageId = webhook.data?.page_id ?? ''

    // Extract properties
    const title = extractTitle(properties.Title || properties.Name || properties.title)
    const summary = extractRichText(properties.Summary || properties.summary)
    const typeRaw = extractSelect(properties.Type || properties.type)
    const domainsRaw = extractMultiSelect(properties.Domain || properties.domain || properties.Domains)
    const languageRaw = extractSelect(properties.Language || properties.language)
    const concepts = extractMultiSelect(properties.Concepts || properties.Tags || properties.concepts)
    const tools = extractMultiSelect(properties.Tools || properties.tools)

    // Fetch full page content from Notion API
    let markdown = summary
    const notionApiKey = process.env.NOTION_API_KEY
    if (pageId && notionApiKey) {
      const client = new Client({ auth: notionApiKey })
      const pageContent = await blocksToMarkdown(client, pageId)
      if (pageContent) {
        markdown = pageContent
      }
    }

    return {
      title,
      markdown: markdown || title,
      type: mapContentType(typeRaw) as RawContent['type'],
      summary: summary || title,
      domain: mapDomains(domainsRaw),
      tools: tools.map((t) =>
        t.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      ),
      concepts,
      language: mapLanguage(languageRaw),
      externalId: pageId,
      sourceUrl: pageId
        ? `https://notion.so/${pageId.replace(/-/g, '')}`
        : undefined,
    }
  },

  validate(raw: RawContent) {
    const errors: string[] = []
    if (!raw.title) errors.push('No title found in Notion page')
    if (!raw.markdown) errors.push('No content found in Notion page')
    return { valid: errors.length === 0, errors }
  },
}

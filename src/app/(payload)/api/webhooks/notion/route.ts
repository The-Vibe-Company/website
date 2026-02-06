import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { generateSlug } from '@/lib/ingestion/slug'
import { markdownToLexical } from '@/lib/ingestion/markdown-to-lexical'

interface NotionWebhookPayload {
  source?: {
    type?: string
  }
  data?: {
    page_id?: string
    properties?: {
      Title?: { title?: Array<{ plain_text?: string }> }
      Type?: { select?: { name?: string } }
      Summary?: { rich_text?: Array<{ plain_text?: string }> }
      Domain?: { multi_select?: Array<{ name: string }> }
      Language?: { select?: { name?: string } }
    }
  }
}

const TYPE_MAP: Record<string, string> = {
  'Daily Learning': 'daily',
  Tutorial: 'tutorial',
  Article: 'article',
  'Tool Focus': 'tool-focus',
  'Concept Focus': 'concept-focus',
}

const DOMAIN_MAP: Record<string, string> = {
  Development: 'dev',
  Design: 'design',
  Operations: 'ops',
  Business: 'business',
  'AI & Automation': 'ai-automation',
  Marketing: 'marketing',
}

async function fetchNotionPageContent(pageId: string): Promise<string | null> {
  const notionApiKey = process.env.NOTION_API_KEY
  if (!notionApiKey) return null

  try {
    const response = await fetch(
      `https://api.notion.com/v1/blocks/${pageId}/children?page_size=100`,
      {
        headers: {
          Authorization: `Bearer ${notionApiKey}`,
          'Notion-Version': '2022-06-28',
        },
      },
    )

    if (!response.ok) return null

    const data = (await response.json()) as {
      results: Array<{
        type: string
        paragraph?: { rich_text: Array<{ plain_text: string }> }
        heading_1?: { rich_text: Array<{ plain_text: string }> }
        heading_2?: { rich_text: Array<{ plain_text: string }> }
        heading_3?: { rich_text: Array<{ plain_text: string }> }
        bulleted_list_item?: { rich_text: Array<{ plain_text: string }> }
        numbered_list_item?: { rich_text: Array<{ plain_text: string }> }
        code?: { rich_text: Array<{ plain_text: string }>; language: string }
      }>
    }

    const lines: string[] = []

    for (const block of data.results) {
      const richText =
        block[block.type as keyof typeof block] as
          | { rich_text?: Array<{ plain_text: string }> }
          | undefined

      if (richText?.rich_text) {
        const text = richText.rich_text.map((t) => t.plain_text).join('')

        switch (block.type) {
          case 'heading_1':
            lines.push(`# ${text}`)
            break
          case 'heading_2':
            lines.push(`## ${text}`)
            break
          case 'heading_3':
            lines.push(`### ${text}`)
            break
          case 'bulleted_list_item':
            lines.push(`- ${text}`)
            break
          case 'numbered_list_item':
            lines.push(`1. ${text}`)
            break
          case 'code':
            lines.push(`\`\`\`${block.code?.language ?? ''}\n${text}\n\`\`\``)
            break
          default:
            lines.push(text)
        }
      }
    }

    return lines.join('\n\n')
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const payload = await getPayload({ config })

  let webhookPayload: NotionWebhookPayload
  try {
    webhookPayload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const properties = webhookPayload.data?.properties
  const pageId = webhookPayload.data?.page_id

  // Extract title
  const title =
    properties?.Title?.title?.map((t) => t.plain_text).join('') ?? ''
  if (!title) {
    return NextResponse.json(
      { error: 'Missing title in Notion webhook payload' },
      { status: 400 },
    )
  }

  // Extract properties
  const notionType = properties?.Type?.select?.name ?? ''
  const type = TYPE_MAP[notionType] ?? 'article'
  const summary =
    properties?.Summary?.rich_text?.map((t) => t.plain_text).join('') ?? ''
  const domains =
    properties?.Domain?.multi_select
      ?.map((d) => DOMAIN_MAP[d.name] ?? d.name)
      .filter(Boolean) ?? []
  const languageRaw = properties?.Language?.select?.name?.toLowerCase() ?? 'fr'
  const language = languageRaw === 'en' ? 'en' : 'fr'

  // Create ingestion log
  const log = await payload.create({
    collection: 'ingestion-logs',
    data: {
      sourceType: 'notion',
      status: 'received',
      contentTitle: title,
      externalId: pageId,
      rawPayload: webhookPayload as unknown as Record<string, unknown>,
    },
  })

  try {
    await payload.update({
      collection: 'ingestion-logs',
      id: log.id,
      data: { status: 'processing' },
    })

    // Optionally fetch full page content from Notion API
    let bodyContent = summary
    if (pageId) {
      const pageContent = await fetchNotionPageContent(pageId)
      if (pageContent) {
        bodyContent = pageContent
      }
    }

    const slug = generateSlug(title, type)
    const lexicalBody = markdownToLexical(bodyContent || title)

    const content = await payload.create({
      collection: 'content',
      data: {
        title,
        slug,
        type,
        status: 'draft',
        summary: summary || title,
        body: lexicalBody,
        domain: domains,
        language,
        source: {
          type: 'notion',
          externalId: pageId,
        },
      },
    })

    const processingTimeMs = Date.now() - startTime
    await payload.update({
      collection: 'ingestion-logs',
      id: log.id,
      data: {
        status: 'success',
        content: content.id,
        processingTimeMs,
      },
    })

    return NextResponse.json({ success: true, content }, { status: 201 })
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    const processingTimeMs = Date.now() - startTime

    await payload.update({
      collection: 'ingestion-logs',
      id: log.id,
      data: {
        status: 'failed',
        error: errorMessage,
        processingTimeMs,
      },
    })

    return NextResponse.json(
      { error: 'Notion ingestion failed', details: errorMessage },
      { status: 500 },
    )
  }
}

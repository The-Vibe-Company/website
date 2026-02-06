import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { generateSlug } from '@/lib/ingestion/slug'
import { markdownToLexical } from '@/lib/ingestion/markdown-to-lexical'

const VALID_SOURCES = ['notion', 'cli', 'slack', 'browser', 'meeting'] as const
const VALID_TYPES = ['daily', 'tutorial', 'article', 'tool-focus', 'concept-focus'] as const

type Source = (typeof VALID_SOURCES)[number]
type ContentType = (typeof VALID_TYPES)[number]

interface IngestRequestBody {
  source: Source
  title: string
  body: string
  type: ContentType
  summary: string
  domain?: string[]
  tools?: string[]
  concepts?: string[]
  language?: 'fr' | 'en'
  externalId?: string
}

async function validateApiKey(
  payload: Awaited<ReturnType<typeof getPayload>>,
  apiKey: string | null,
): Promise<boolean> {
  if (!apiKey) return false

  const result = await payload.find({
    collection: 'api-keys',
    where: {
      key: { equals: apiKey },
      active: { equals: true },
    },
    limit: 1,
  })

  if (result.docs.length === 0) return false

  // Update lastUsedAt
  await payload.update({
    collection: 'api-keys',
    id: result.docs[0].id,
    data: {
      lastUsedAt: new Date().toISOString(),
    },
  })

  return true
}

async function resolveToolIds(
  payload: Awaited<ReturnType<typeof getPayload>>,
  toolSlugs: string[],
): Promise<number[]> {
  const ids: number[] = []

  for (const slug of toolSlugs) {
    const result = await payload.find({
      collection: 'tools',
      where: {
        slug: { equals: slug },
      },
      limit: 1,
    })
    if (result.docs.length > 0) {
      ids.push(result.docs[0].id as number)
    }
  }

  return ids
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const payload = await getPayload({ config })

  // Validate API key
  const apiKey = request.headers.get('x-api-key')
  const isValid = await validateApiKey(payload, apiKey)

  if (!isValid) {
    return NextResponse.json(
      { error: 'Invalid or missing API key' },
      { status: 401 },
    )
  }

  let body: IngestRequestBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 },
    )
  }

  // Validate required fields
  const { source, title, body: markdownBody, type, summary } = body

  if (!source || !title || !markdownBody || !type || !summary) {
    return NextResponse.json(
      { error: 'Missing required fields: source, title, body, type, summary' },
      { status: 400 },
    )
  }

  if (!VALID_SOURCES.includes(source)) {
    return NextResponse.json(
      { error: `Invalid source. Must be one of: ${VALID_SOURCES.join(', ')}` },
      { status: 400 },
    )
  }

  if (!VALID_TYPES.includes(type)) {
    return NextResponse.json(
      { error: `Invalid type. Must be one of: ${VALID_TYPES.join(', ')}` },
      { status: 400 },
    )
  }

  // Create ingestion log entry
  const log = await payload.create({
    collection: 'ingestion-logs',
    data: {
      sourceType: source,
      status: 'received',
      contentTitle: title,
      externalId: body.externalId,
      rawPayload: body as unknown as Record<string, unknown>,
    },
  })

  try {
    // Update log to processing
    await payload.update({
      collection: 'ingestion-logs',
      id: log.id,
      data: { status: 'processing' },
    })

    // Generate slug
    const slug = generateSlug(title, type)

    // Transform markdown to Lexical
    const lexicalBody = markdownToLexical(markdownBody)

    // Resolve tool slugs to IDs
    const toolIds = body.tools ? await resolveToolIds(payload, body.tools) : []

    // Create content document
    const content = await payload.create({
      collection: 'content',
      data: {
        title,
        slug,
        type,
        status: 'draft',
        summary,
        body: lexicalBody,
        domain: body.domain,
        tools: toolIds,
        concepts: body.concepts,
        language: body.language ?? 'fr',
        source: {
          type: source,
          externalId: body.externalId,
        },
      },
    })

    // Update log with success
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

    return NextResponse.json(
      { success: true, content },
      { status: 201 },
    )
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    const processingTimeMs = Date.now() - startTime

    // Update log with failure
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
      { error: 'Ingestion failed', details: errorMessage },
      { status: 500 },
    )
  }
}

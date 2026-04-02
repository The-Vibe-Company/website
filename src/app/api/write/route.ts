import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import config from '@payload-config'

type PublicEntryType = 'article' | 'learning'

type WritePayload = {
  title?: unknown
  body?: unknown
  type?: unknown
  summary?: unknown
  status?: unknown
  slug?: unknown
  publishedAt?: unknown
}

function unauthorized() {
  return NextResponse.json(
    {
      error: 'Unauthorized',
      message: 'Send Authorization: Bearer <CONTENT_WRITE_TOKEN>.',
    },
    { status: 401 },
  )
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function stripMarkdown(value: string): string {
  return value
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_~>#-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function inferSummary(body: string): string {
  return stripMarkdown(body).slice(0, 180).trim()
}

function mapEntryType(value: unknown): 'article' | 'daily' | null {
  if (value === 'article') return 'article'
  if (value === 'learning') return 'daily'
  return null
}

function normalizeStatus(value: unknown): 'draft' | 'published' {
  return value === 'published' ? 'published' : 'draft'
}

function textToLexical(body: string) {
  const paragraphs = body
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: null,
      children: paragraphs.length
        ? paragraphs.map((paragraph) => ({
            type: 'paragraph',
            format: '',
            indent: 0,
            version: 1,
            direction: null,
            textFormat: 0,
            textStyle: '',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: paragraph,
                version: 1,
              },
            ],
          }))
        : [
            {
              type: 'paragraph',
              format: '',
              indent: 0,
              version: 1,
              direction: null,
              textFormat: 0,
              textStyle: '',
              children: [],
            },
          ],
    },
  }
}

function validatePayload(input: WritePayload) {
  const title = typeof input.title === 'string' ? input.title.trim() : ''
  const body = typeof input.body === 'string' ? input.body.trim() : ''
  const type = mapEntryType(input.type)
  const summary =
    typeof input.summary === 'string' && input.summary.trim().length > 0
      ? input.summary.trim()
      : inferSummary(body)
  const status = normalizeStatus(input.status)
  const slug =
    typeof input.slug === 'string' && input.slug.trim().length > 0
      ? slugify(input.slug)
      : undefined
  const publishedAt =
    typeof input.publishedAt === 'string' && input.publishedAt.trim().length > 0
      ? input.publishedAt
      : undefined

  const errors: string[] = []

  if (!title) errors.push('title is required')
  if (!body) errors.push('body is required')
  if (!type) errors.push('type must be "article" or "learning"')

  return {
    errors,
    data: {
      title,
      body,
      type,
      summary,
      status,
      slug,
      publishedAt,
    },
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/write',
    method: 'POST',
    auth: 'Authorization: Bearer <CONTENT_WRITE_TOKEN>',
    accepts: {
      title: 'string, required',
      body: 'string, required',
      type: '"article" | "learning", required',
      summary: 'string, optional',
      status: '"draft" | "published", optional, defaults to "draft"',
      slug: 'string, optional',
      publishedAt: 'ISO date string, optional',
    },
    example: {
      title: 'What shipped this week',
      type: 'article',
      body: 'We simplified the CMS and removed the extra layers.',
      summary: 'A short recap of the simplification work.',
      status: 'published',
    },
  })
}

export async function POST(request: Request) {
  const token = process.env.CONTENT_WRITE_TOKEN
  const authHeader = request.headers.get('authorization')

  if (!token) {
    return NextResponse.json(
      {
        error: 'Server misconfigured',
        message: 'CONTENT_WRITE_TOKEN is not set.',
      },
      { status: 500 },
    )
  }

  if (authHeader !== `Bearer ${token}`) {
    return unauthorized()
  }

  let json: WritePayload

  try {
    json = (await request.json()) as WritePayload
  } catch {
    return NextResponse.json(
      {
        error: 'Invalid JSON',
      },
      { status: 400 },
    )
  }

  const { errors, data } = validatePayload(json)
  if (errors.length > 0 || !data.type) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        details: errors,
      },
      { status: 400 },
    )
  }

  const payload = await getPayload({ config })
  const doc = await payload.create({
    collection: 'content',
    data: {
      title: data.title,
      slug: data.slug,
      type: data.type,
      summary: data.summary,
      status: data.status,
      publishedAt: data.publishedAt,
      body: textToLexical(data.body),
    },
  })

  return NextResponse.json(
    {
      ok: true,
      entry: {
        id: doc.id,
        title: doc.title,
        slug: doc.slug,
        type: data.type === 'daily' ? 'learning' : 'article',
        status: doc.status,
        url: `/resources/${data.type === 'daily' ? 'learnings' : 'articles'}/${doc.slug}`,
        adminUrl: `/admin/collections/content/${doc.id}`,
      },
    },
    { status: 201 },
  )
}

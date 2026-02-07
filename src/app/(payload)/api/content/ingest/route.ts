import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { validateApiKey } from '@/lib/auth/validate-api-key'
import { defaultPipeline } from '@/lib/ingestion/pipeline'
import { createGenericAdapter } from '@/lib/ingestion/adapters/generic'

const VALID_SOURCES = ['notion', 'cli', 'slack', 'browser', 'meeting'] as const

export async function POST(request: NextRequest) {
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

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 },
    )
  }

  // Basic source validation
  const source = body.source as string
  if (!source || !VALID_SOURCES.includes(source as (typeof VALID_SOURCES)[number])) {
    return NextResponse.json(
      { error: `Invalid source. Must be one of: ${VALID_SOURCES.join(', ')}` },
      { status: 400 },
    )
  }

  // Use the pipeline with a generic adapter
  const adapter = createGenericAdapter(source)
  const result = await defaultPipeline.execute(adapter, body, payload)

  if (result.success) {
    return NextResponse.json(
      { success: true, content: result.content, logId: result.logId },
      { status: 201 },
    )
  }

  return NextResponse.json(
    { error: 'Ingestion failed', details: result.error, logId: result.logId },
    { status: 500 },
  )
}

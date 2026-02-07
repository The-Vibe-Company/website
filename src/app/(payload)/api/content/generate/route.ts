import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { validateApiKey } from '@/lib/auth/validate-api-key'
import { defaultPipeline } from '@/lib/ingestion/pipeline'
import { aiAdapter } from '@/lib/ingestion/adapters/ai'
import { AiNotConfiguredError } from '@/lib/ai/client'
import { VALID_TYPES } from '@/lib/ai/prompts'

export async function POST(request: NextRequest) {
  const payload = await getPayload({ config })

  // Authenticate via API key
  const apiKey = request.headers.get('x-api-key')
  const isValid = await validateApiKey(payload, apiKey)
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid or missing API key' }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  // Validate required fields
  const rawText = body.raw_text as string
  const type = body.type as string

  if (!rawText?.trim()) {
    return NextResponse.json({ error: 'raw_text is required' }, { status: 400 })
  }

  if (!type || !VALID_TYPES.includes(type as (typeof VALID_TYPES)[number])) {
    return NextResponse.json(
      { error: `type must be one of: ${VALID_TYPES.join(', ')}` },
      { status: 400 },
    )
  }

  try {
    const result = await defaultPipeline.execute(aiAdapter, body, payload)

    if (result.success) {
      return NextResponse.json(
        { success: true, content: result.content, logId: result.logId },
        { status: 201 },
      )
    }

    return NextResponse.json(
      { error: 'AI generation failed', details: result.error, logId: result.logId },
      { status: 500 },
    )
  } catch (err: unknown) {
    if (err instanceof AiNotConfiguredError) {
      return NextResponse.json({ error: err.message }, { status: 503 })
    }
    throw err
  }
}

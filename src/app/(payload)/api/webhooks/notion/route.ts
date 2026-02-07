import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { validateApiKey } from '@/lib/auth/validate-api-key'
import { defaultPipeline } from '@/lib/ingestion/pipeline'
import { notionAdapter } from '@/lib/ingestion/adapters/notion'

export async function POST(request: NextRequest) {
  const payload = await getPayload({ config })

  // Authenticate via API key
  const apiKey = request.headers.get('x-api-key')
  const isValid = await validateApiKey(payload, apiKey)
  if (!isValid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let webhookPayload: unknown
  try {
    webhookPayload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  // Use the pipeline with the Notion adapter
  const result = await defaultPipeline.execute(notionAdapter, webhookPayload, payload)

  if (result.success) {
    return NextResponse.json(
      { success: true, content: result.content, logId: result.logId },
      { status: 201 },
    )
  }

  // Return 200 even on errors to prevent webhook retries for known issues
  const isDuplicate = result.error?.startsWith('DUPLICATE:')
  if (isDuplicate) {
    return NextResponse.json(
      { success: false, duplicate: true, details: result.error, logId: result.logId },
      { status: 200 },
    )
  }

  return NextResponse.json(
    { error: 'Notion ingestion failed', details: result.error, logId: result.logId },
    { status: 500 },
  )
}

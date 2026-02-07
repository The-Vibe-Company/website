'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import { defaultPipeline } from '@/lib/ingestion/pipeline'
import { aiAdapter } from '@/lib/ingestion/adapters/ai'
import { AiNotConfiguredError } from '@/lib/ai/client'
import { VALID_TYPES } from '@/lib/ai/prompts'

export interface GenerateResult {
  success: boolean
  content?: {
    id: string | number
    title: string
    summary: string
    type: string
    slug: string
    domain: string[]
    concepts: string[]
    aiMetadata?: {
      qualityScore: number
      autoTags: string[]
      detectedLanguage: string
    }
  }
  error?: string
  logId?: string | number
}

export async function generateContentAction(
  rawText: string,
  type: string,
  language: 'fr' | 'en',
): Promise<GenerateResult> {
  const payload = await getPayload({ config })

  // Verify admin session
  const headers = await getHeaders()
  const { user } = await payload.auth({ headers })
  if (!user) {
    return { success: false, error: 'Non authentifié. Connectez-vous.' }
  }

  // Validate inputs
  if (!rawText?.trim()) {
    return { success: false, error: 'Le texte est requis.' }
  }
  if (!VALID_TYPES.includes(type as (typeof VALID_TYPES)[number])) {
    return { success: false, error: `Type invalide: ${type}` }
  }

  try {
    const result = await defaultPipeline.execute(
      aiAdapter,
      { raw_text: rawText, type, language },
      payload,
    )

    if (result.success && result.content) {
      const content = result.content as Record<string, unknown>
      const aiMeta = content.aiMetadata as Record<string, unknown> | undefined
      return {
        success: true,
        content: {
          id: content.id as string | number,
          title: content.title as string,
          summary: content.summary as string,
          type: content.type as string,
          slug: content.slug as string,
          domain: (content.domain as string[]) ?? [],
          concepts: (content.concepts as string[]) ?? [],
          aiMetadata: aiMeta
            ? {
                qualityScore: aiMeta.qualityScore as number,
                autoTags: (aiMeta.autoTags as string[]) ?? [],
                detectedLanguage: (aiMeta.detectedLanguage as string) ?? 'fr',
              }
            : undefined,
        },
        logId: result.logId,
      }
    }

    return {
      success: false,
      error: result.error || 'La génération a échoué.',
      logId: result.logId,
    }
  } catch (err: unknown) {
    if (err instanceof AiNotConfiguredError) {
      return {
        success: false,
        error: 'ANTHROPIC_API_KEY non configuré. Ajoutez-le dans .env.local.',
      }
    }
    const message = err instanceof Error ? err.message : 'Erreur inconnue'
    return { success: false, error: message }
  }
}

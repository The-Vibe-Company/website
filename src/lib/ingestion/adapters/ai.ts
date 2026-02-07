import type { IngestionAdapter, RawContent } from './types'
import { generateContent, type GenerateContentInput } from '../../ai/generate-content'

interface AiGeneratePayload {
  raw_text: string
  type: string
  language?: 'fr' | 'en'
}

/**
 * AI generation adapter for the ingestion pipeline.
 * Takes raw messy text, calls Claude to structure it,
 * then produces standard RawContent for the pipeline.
 */
export const aiAdapter: IngestionAdapter = {
  name: 'ai-generate',

  async extract(payload: unknown): Promise<RawContent> {
    const data = payload as AiGeneratePayload

    const input: GenerateContentInput = {
      rawText: data.raw_text,
      type: data.type as RawContent['type'],
      language: data.language,
    }

    const generated = await generateContent(input)

    return {
      title: generated.title,
      markdown: generated.markdown,
      type: data.type as RawContent['type'],
      summary: generated.summary,
      domain: generated.domain,
      tools: generated.tools,
      concepts: generated.concepts,
      language: generated.detectedLanguage ?? data.language ?? 'fr',
      metadata: {
        aiGenerated: true,
        qualityScore: generated.qualityScore,
        sourceType: 'ai-generate',
      },
    }
  },

  validate(raw: RawContent) {
    const errors: string[] = []
    if (!raw.title?.trim()) errors.push('AI failed to generate a title')
    if (!raw.markdown?.trim()) errors.push('AI failed to generate body content')
    if (!raw.summary?.trim()) errors.push('AI failed to generate a summary')
    return { valid: errors.length === 0, errors }
  },
}

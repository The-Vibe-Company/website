import { getAnthropicClient } from './client'
import { getSystemPrompt, getPromptConfig, buildUserPrompt, VALID_DOMAINS } from './prompts'
import type { RawContent } from '../ingestion/adapters/types'

export interface GenerateContentInput {
  rawText: string
  type: RawContent['type']
  language?: 'fr' | 'en'
}

export interface GenerateContentOutput {
  title: string
  summary: string
  markdown: string
  domain: string[]
  tools: string[]
  concepts: string[]
  detectedLanguage: 'fr' | 'en'
  qualityScore: number
}

export async function generateContent(
  input: GenerateContentInput,
): Promise<GenerateContentOutput> {
  const client = getAnthropicClient()
  const config = getPromptConfig(input.type)
  const lang = input.language ?? 'fr'

  const userPrompt = buildUserPrompt(input.rawText, input.type, lang)

  const response = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: config.maxTokens,
    system: getSystemPrompt(),
    messages: [{ role: 'user', content: userPrompt }],
  })

  const textBlock = response.content.find((b) => b.type === 'text')
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('AI response contained no text content')
  }

  const parsed = parseAiResponse(textBlock.text)

  // Validate domains against canonical list
  parsed.domain = (parsed.domain ?? []).filter((d: string) =>
    (VALID_DOMAINS as readonly string[]).includes(d),
  )

  // Normalize tool slugs (same pattern as notion adapter)
  parsed.tools = (parsed.tools ?? []).map((t: string) =>
    t
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, ''),
  )

  // Ensure qualityScore is in range
  parsed.qualityScore = Math.max(0, Math.min(1, parsed.qualityScore ?? 0.5))

  return parsed
}

function parseAiResponse(text: string): GenerateContentOutput {
  const trimmed = text.trim()

  // Try direct JSON parse
  try {
    return JSON.parse(trimmed)
  } catch {
    // Try extracting from markdown code block
    const jsonMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (jsonMatch?.[1]) {
      return JSON.parse(jsonMatch[1].trim())
    }
    throw new Error(`Failed to parse AI response as JSON: ${trimmed.slice(0, 200)}...`)
  }
}

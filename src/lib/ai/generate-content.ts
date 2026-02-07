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

const STRUCTURED_CONTENT_TOOL = {
  name: 'save_structured_content' as const,
  description:
    'Save the structured content generated from raw notes. Always call this tool with the generated content.',
  input_schema: {
    type: 'object' as const,
    required: ['title', 'summary', 'markdown', 'domain', 'tools', 'concepts', 'detectedLanguage', 'qualityScore'] as string[],
    properties: {
      title: { type: 'string' as const, description: 'Catchy descriptive title' },
      summary: { type: 'string' as const, description: 'Concise summary, max 160 characters' },
      markdown: { type: 'string' as const, description: 'Well-formatted markdown body (without the title)' },
      domain: {
        type: 'array' as const,
        items: { type: 'string' as const, enum: [...VALID_DOMAINS] as string[] },
        description: 'Content domains',
      },
      tools: {
        type: 'array' as const,
        items: { type: 'string' as const },
        description: 'Tool slugs (lowercase with dashes)',
      },
      concepts: {
        type: 'array' as const,
        items: { type: 'string' as const },
        description: 'Concept tags',
      },
      detectedLanguage: { type: 'string' as const, enum: ['fr', 'en'] as string[] },
      qualityScore: {
        type: 'number' as const,
        minimum: 0,
        maximum: 1,
        description: 'Quality score: 0.7+ = ready to publish',
      },
    },
  },
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
    tools: [STRUCTURED_CONTENT_TOOL],
    tool_choice: { type: 'tool', name: 'save_structured_content' },
  })

  if (response.stop_reason === 'max_tokens') {
    throw new Error(
      'AI response was truncated (output too long). Try shorter input or a simpler content type.',
    )
  }

  const toolBlock = response.content.find((b) => b.type === 'tool_use')
  if (!toolBlock || toolBlock.type !== 'tool_use') {
    throw new Error('AI response contained no structured content')
  }

  const parsed = toolBlock.input as GenerateContentOutput

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

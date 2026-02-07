import Anthropic from '@anthropic-ai/sdk'

let cachedClient: Anthropic | null = null

export class AiNotConfiguredError extends Error {
  constructor() {
    super(
      'ANTHROPIC_API_KEY is not configured. Set it in .env.local to enable AI content generation.',
    )
    this.name = 'AiNotConfiguredError'
  }
}

export function getAnthropicClient(): Anthropic {
  if (cachedClient) return cachedClient

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new AiNotConfiguredError()
  }

  cachedClient = new Anthropic({ apiKey })
  return cachedClient
}

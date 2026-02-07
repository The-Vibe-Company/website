import type { Payload } from 'payload'
import { verifyApiKey } from './api-key-hash'

/**
 * Validate an API key against the api-keys collection.
 * Supports both hashed keys (keyHash field) and legacy plaintext keys (key field).
 * Updates lastUsedAt on successful validation.
 */
export async function validateApiKey(
  payload: Payload,
  apiKey: string | null,
): Promise<boolean> {
  if (!apiKey) return false

  // Try hashed key lookup first
  const allKeys = await payload.find({
    collection: 'api-keys',
    where: {
      active: { equals: true },
    },
    limit: 100,
  })

  const matchedKey = allKeys.docs.find((doc) => {
    // Check hashed key
    if (doc.keyHash) {
      return verifyApiKey(apiKey, doc.keyHash as string)
    }
    // Fallback: legacy plaintext comparison (pre-migration)
    if (doc.key) {
      return doc.key === apiKey
    }
    return false
  })

  if (!matchedKey) return false

  // Update lastUsedAt
  await payload.update({
    collection: 'api-keys',
    id: matchedKey.id,
    data: {
      lastUsedAt: new Date().toISOString(),
    },
  })

  return true
}

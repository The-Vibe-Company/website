import { createHash, randomBytes, timingSafeEqual } from 'crypto'

/**
 * Hash an API key using SHA-256.
 */
export function hashApiKey(plainKey: string): string {
  return createHash('sha256').update(plainKey).digest('hex')
}

/**
 * Generate a new API key with a tvco_ prefix.
 * Returns the plaintext key (to show once) and the hash (to store).
 */
export function generateApiKey(): { plain: string; hash: string } {
  const plain = `tvco_${randomBytes(32).toString('hex')}`
  const hash = hashApiKey(plain)
  return { plain, hash }
}

/**
 * Verify a plaintext API key against a stored hash using timing-safe comparison.
 */
export function verifyApiKey(plainKey: string, storedHash: string): boolean {
  const inputHash = hashApiKey(plainKey)
  try {
    const a = Buffer.from(inputHash, 'hex')
    const b = Buffer.from(storedHash, 'hex')
    return a.length === b.length && timingSafeEqual(a, b)
  } catch {
    return false
  }
}

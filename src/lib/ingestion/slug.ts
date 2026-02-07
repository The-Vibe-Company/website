/**
 * Generates a URL-safe slug from a title.
 * For 'daily' type content, prepends the current date (YYYY-MM-DD).
 */
export function generateSlug(title: string, type: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  if (type === 'daily') {
    const today = new Date().toISOString().slice(0, 10)
    return `${today}-${base}`
  }

  return base
}

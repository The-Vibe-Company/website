import dimensionsJson from '@/generated/og-image-dimensions.json'

export type OgImageDimensions = { width: number; height: number }

const dimensions = dimensionsJson as Record<string, OgImageDimensions>

export function getOgImageDimensions(sourceUrl: string | undefined): OgImageDimensions | null {
  if (!sourceUrl) return null
  return dimensions[sourceUrl] ?? null
}

// House cover format (bun run cover:generate writes 1536x1024).
const DEFAULT_COVER_DIMENSIONS: OgImageDimensions = { width: 1536, height: 1024 }

/**
 * Intrinsic size of an article cover, for the width/height attributes that let
 * the browser reserve its box before the image loads. Read from the manifest
 * written by scripts/validate-content-images.ts, keyed by the source URL.
 */
export function getCoverImageDimensions(sourceUrl: string | undefined): OgImageDimensions {
  return getOgImageDimensions(sourceUrl) ?? DEFAULT_COVER_DIMENSIONS
}

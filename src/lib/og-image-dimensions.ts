import dimensionsJson from '@/generated/og-image-dimensions.json'

export type OgImageDimensions = { width: number; height: number }

const dimensions = dimensionsJson as Record<string, OgImageDimensions>

export function getOgImageDimensions(sourceUrl: string | undefined): OgImageDimensions | null {
  if (!sourceUrl) return null
  return dimensions[sourceUrl] ?? null
}

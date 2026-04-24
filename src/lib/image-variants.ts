import imageVariants from '@/generated/image-variants.json'

const variants = imageVariants as Record<string, string>

export function getOptimizedImageUrl(url: string): string {
  return variants[url] ?? url
}

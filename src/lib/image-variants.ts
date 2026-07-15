import imageVariants from '@/generated/image-variants.json'

const variants = imageVariants as Record<string, string>

// Une même image peut avoir deux variantes : webp pour la page (clé nue) et
// PNG recompressé pour la vignette de partage (clé « og: »), car les
// plateformes sociales ne lisent pas toutes le webp.
export function getOptimizedImageUrl(url: string, kind: 'content' | 'og' = 'content'): string {
  const key = kind === 'og' ? `og:${url}` : url
  return variants[key] ?? url
}

import { cache } from 'react'
import fs from 'fs'
import path from 'path'

import {
  CONTENT_TYPES,
  getContentTypeByUrlSlug,
  getUrlSlugForDbType,
  type ContentTypeConfig,
} from '@/lib/content-types'
import { getOptimizedImageUrl } from '@/lib/image-variants'
import { parseFrontmatter } from '@/lib/parse-frontmatter'

export type ContentLanguage = 'fr' | 'en'

/** Order used wherever the language versions of an article are listed. */
const LANGUAGE_ORDER: ContentLanguage[] = ['fr', 'en']

export type SkillKind = 'native' | 'external'

export interface SkillInstallCommand {
  label: string
  command: string
}

export interface SkillMeta {
  kind: SkillKind
  author?: string
  authorUrl?: string
  allowedTools?: string[]
  trigger?: string
  creatorNote?: string
  sourceUrl?: string
  sourcePath?: string
  installCommands?: SkillInstallCommand[]
}

export interface ContentEntry {
  id: string
  slug: string
  title: string
  summary: string
  body: string
  type: string
  publishedAt: string
  language: ContentLanguage
  /** Shared identifier linking the language versions of the same article. */
  translationKey?: string
  complexity?: string
  series?: string
  seriesDay?: number
  focus?: boolean
  tool?: boolean
  topics?: string[]
  featuredImage?: {
    url: string
    sourceUrl?: string
    alt?: string
    sizes?: {
      card?: {
        url: string
      }
    }
  } | null
  ogImage?: {
    url: string
    sourceUrl: string
    alt?: string
  } | null
  skill?: SkillMeta
}

const CONTENT_ROOT = path.join(process.cwd(), 'content')

function readDirectoryEntries(type: ContentTypeConfig): ContentEntry[] {
  const directory = path.join(CONTENT_ROOT, getUrlSlugForDbType(type.slug))

  if (!fs.existsSync(directory)) return []

  return fs
    .readdirSync(directory)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const fullPath = path.join(directory, file)
      const raw = fs.readFileSync(fullPath, 'utf8')
      const { data, body } = parseFrontmatter(raw)
      const slug = data.slug || file.replace(/\.md$/, '')
      const title = data.title || slug
      const publishedAt = data.publishedAt || new Date().toISOString().slice(0, 10)
      const summary = data.summary || body.split('\n').find(Boolean)?.trim() || ''
      const coverImage = data.coverImage || ''
      const optimizedCoverImage = coverImage ? getOptimizedImageUrl(coverImage) : ''
      const coverAlt = data.coverAlt || title
      const ogImage = data.ogImage || ''
      const optimizedOgImage = ogImage ? getOptimizedImageUrl(ogImage, 'og') : ''
      const topics = (data.topics || '')
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean)
      const language: ContentLanguage = data.language === 'fr' ? 'fr' : 'en'

      const skill = type.slug === 'skill' ? parseSkillMeta(data) : undefined

      return {
        id: `${type.slug}:${slug}`,
        slug,
        title,
        summary,
        body,
        type: type.slug,
        publishedAt,
        language,
        translationKey: data.translationKey?.trim() || undefined,
        complexity: data.complexity || undefined,
        series: data.series?.trim() || undefined,
        seriesDay: parseSeriesDay(data.seriesDay),
        focus: data.focus?.trim() === 'true',
        tool: data.tool?.trim() === 'true',
        topics,
        featuredImage: coverImage
          ? {
              url: optimizedCoverImage,
              sourceUrl: coverImage,
              alt: coverAlt,
              sizes: {
                card: {
                  url: optimizedCoverImage,
                },
              },
            }
          : null,
        ogImage: ogImage
          ? {
              url: optimizedOgImage,
              sourceUrl: ogImage,
              alt: coverAlt,
            }
          : null,
        skill,
      }
    })
}

function parseSkillMeta(data: Record<string, string>): SkillMeta {
  const kind: SkillKind = data.kind === 'external' ? 'external' : 'native'

  const allowedTools = stripYamlBrackets(data.allowedTools || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)

  let installCommands: SkillInstallCommand[] | undefined
  if (data.installCommands) {
    try {
      const parsed = JSON.parse(data.installCommands)
      if (Array.isArray(parsed)) {
        installCommands = parsed
          .filter((entry): entry is SkillInstallCommand =>
            typeof entry === 'object' &&
            entry !== null &&
            typeof entry.label === 'string' &&
            typeof entry.command === 'string',
          )
      }
    } catch {
      installCommands = undefined
    }
  }

  return {
    kind,
    author: data.author || undefined,
    authorUrl: normalizeExternalUrl(data.authorUrl),
    allowedTools: allowedTools.length > 0 ? allowedTools : undefined,
    trigger: data.trigger || undefined,
    creatorNote: data.creatorNote || undefined,
    sourceUrl: normalizeExternalUrl(data.sourceUrl),
    sourcePath: data.sourcePath || undefined,
    installCommands,
  }
}

function normalizeExternalUrl(value?: string): string | undefined {
  if (!value) return undefined
  try {
    const url = new URL(value)
    return url.protocol === 'https:' ? url.toString() : undefined
  } catch {
    return undefined
  }
}

function stripYamlBrackets(value: string): string {
  const trimmed = value.trim()
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    return trimmed.slice(1, -1)
  }
  return trimmed
}

function parseSeriesDay(value?: string): number | undefined {
  if (value == null || value.trim() === '') return undefined
  const day = Number(value)
  return Number.isFinite(day) ? day : undefined
}

function sortByPublishedAtDesc(items: ContentEntry[]): ContentEntry[] {
  return [...items].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}

export const getAllContent = cache((): ContentEntry[] => {
  const entries = CONTENT_TYPES.flatMap((type) => readDirectoryEntries(type))
  return sortByPublishedAtDesc(entries)
})

export const getContentCounts = cache((): Record<string, number> => {
  const counts: Record<string, number> = {}

  for (const item of getAllContent()) {
    counts[item.type] = (counts[item.type] || 0) + 1
  }

  return counts
})

export const getContentByType = cache((type: string): ContentEntry[] => {
  return getAllContent().filter((item) => item.type === type)
})

export const getContentByTypeUrlSlug = cache((typeUrlSlug: string): ContentEntry[] => {
  const contentType = getContentTypeByUrlSlug(typeUrlSlug)
  if (!contentType) return []
  return getContentByType(contentType.slug)
})

export const getContentItem = cache((type: string, slug: string): ContentEntry | null => {
  return getAllContent().find((item) => item.type === type && item.slug === slug) ?? null
})

/** Site path of a content entry, without the `/fr` or `/en` language prefix. */
export function contentPath(item: Pick<ContentEntry, 'type' | 'slug'>): string {
  return `/resources/${getUrlSlugForDbType(item.type)}/${item.slug}`
}

/**
 * Entries sharing a `translationKey` are the same article in two languages.
 * An entry without one is alone in its group, so an article that was never
 * translated keeps behaving exactly as before.
 */
function translationGroupKey(item: ContentEntry): string {
  return item.translationKey ? `${item.type}:key:${item.translationKey}` : item.id
}

const getTranslationGroups = cache((): Map<string, ContentEntry[]> => {
  const groups = new Map<string, ContentEntry[]>()

  for (const item of getAllContent()) {
    const key = translationGroupKey(item)
    const group = groups.get(key)
    if (group) group.push(item)
    else groups.set(key, [item])
  }

  for (const group of groups.values()) {
    group.sort(
      (a, b) => LANGUAGE_ORDER.indexOf(a.language) - LANGUAGE_ORDER.indexOf(b.language),
    )
  }

  return groups
})

/**
 * Every language version of an entry, itself included, ordered fr then en.
 * Returns a single entry for an article that has no translation.
 */
export const getContentTranslations = cache((type: string, slug: string): ContentEntry[] => {
  const item = getContentItem(type, slug)
  if (!item) return []
  return getTranslationGroups().get(translationGroupKey(item)) ?? [item]
})

/**
 * The version a given language should serve for this article, when the one
 * being asked for is not it. Returns null when the article is already in that
 * language, or has no version in it — in both cases the request is served
 * as-is rather than redirected somewhere the reader did not ask for.
 */
export const getContentForLanguage = cache(
  (type: string, slug: string, language: ContentLanguage): ContentEntry | null => {
    const item = getContentItem(type, slug)
    if (!item || item.language === language) return null
    return getContentTranslations(type, slug).find((v) => v.language === language) ?? null
  },
)

/**
 * One entry per article: the version written in `language` when it exists,
 * otherwise the only version that was published. This is what listings render,
 * so a translated article shows up as a single card instead of two.
 */
export const getContentByTypeForLanguage = cache(
  (type: string, language: ContentLanguage): ContentEntry[] => {
    const picked = [...getTranslationGroups().values()]
      .filter((group) => group[0].type === type)
      .map((group) => group.find((item) => item.language === language) ?? group[0])

    return sortByPublishedAtDesc(picked)
  },
)

export const getRelatedContent = cache((type: string, slug: string, limit = 3): ContentEntry[] => {
  const current = getContentItem(type, slug)
  if (!current) return []

  // One suggestion per article, in the language being read, and never the
  // article itself nor its own translation.
  const currentKey = translationGroupKey(current)
  const pool = getContentByTypeForLanguage(type, current.language).filter(
    (item) => translationGroupKey(item) !== currentKey,
  )

  // Keep the reader in the same lane: a Victor's Story article suggests other
  // Victor's Story articles, a classic article suggests other classic ones.
  const isVictorStory = current.series === 'victor-story'
  const sameCategory = pool.filter((item) => (item.series === 'victor-story') === isVictorStory)

  return (sameCategory.length > 0 ? sameCategory : pool).slice(0, limit)
})

export const searchContent = cache((query: string): ContentEntry[] => {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return []

  return getAllContent().filter((item) => {
    const haystack = `${item.title}\n${item.summary}\n${item.body}`.toLowerCase()
    return haystack.includes(normalized)
  })
})

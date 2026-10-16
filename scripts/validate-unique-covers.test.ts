import { describe, expect, test } from 'bun:test'

import { articleGroup, findDuplicateCovers, type CoverReference } from './validate-unique-covers'

function ref(file: string, group: string, url: string, hash: string): CoverReference {
  return { file, group, field: 'coverImage', url, hash }
}

describe('articleGroup', () => {
  test('pairs translations by translationKey, falls back to the slug', () => {
    expect(articleGroup({ translationKey: 'hds-health-data', slug: 'a' }, 'a.md')).toBe(
      'translationKey:hds-health-data',
    )
    expect(articleGroup({ slug: 'my-slug' }, 'other.md')).toBe('slug:my-slug')
    expect(articleGroup({}, 'content/articles/from-file.md')).toBe('slug:from-file')
  })
})

describe('findDuplicateCovers', () => {
  test('allows the FR and EN versions of one article to share a path', () => {
    const fr = ref('fr.md', 'translationKey:k', '/images/a/cover.webp', 'h1')
    const en = ref('en.md', 'translationKey:k', '/images/a/cover.webp', 'h1')
    expect(findDuplicateCovers([fr, en])).toEqual([])
  })

  test('allows distinct bytes everywhere', () => {
    const a = ref('a.md', 'slug:a', '/images/a/cover.webp', 'h1')
    const b = ref('b.md', 'slug:b', '/images/b/cover.webp', 'h2')
    expect(findDuplicateCovers([a, b])).toEqual([])
  })

  test('rejects different paths with identical bytes across articles', () => {
    const a = ref('a.md', 'slug:a', '/images/a/cover.webp', 'h1')
    const b = ref('b.md', 'translationKey:k', '/images/b/cover.webp', 'h1')
    const failures = findDuplicateCovers([a, b])
    expect(failures).toHaveLength(1)
    expect(failures[0].file).toBe('a.md, b.md')
    expect(failures[0].reason).toContain('2 different articles')
  })

  test('rejects the same path used by unrelated articles', () => {
    const a = ref('a.md', 'slug:a', '/images/shared/cover.webp', 'h1')
    const b = ref('b.md', 'slug:b', '/images/shared/cover.webp', 'h1')
    expect(findDuplicateCovers([a, b])).toHaveLength(1)
  })

  test('rejects a byte-for-byte copy under another path within one article', () => {
    const fr = ref('fr.md', 'translationKey:k', '/images/a/cover.webp', 'h1')
    const en = ref('en.md', 'translationKey:k', '/images/a/cover-copy.webp', 'h1')
    const failures = findDuplicateCovers([fr, en])
    expect(failures).toHaveLength(1)
    expect(failures[0].reason).toContain('stored under 2 paths')
  })
})

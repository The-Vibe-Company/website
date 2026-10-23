import { expect, test } from 'bun:test'
import { getContentByType, getContentItem } from './content-source'

test('article body links use a locale and the target article canonical URL', () => {
  const invalid: string[] = []
  for (const article of getContentByType('article')) {
    // Images are assets, not page links. Also check HTML and reference-style links.
    const links = [
      ...article.body.matchAll(/(?<!!)\[[^\]\n]*\]\((\/[^\s)]+)\)/g),
      ...article.body.matchAll(/<a\b[^>]*\bhref=["'](\/[^"']+)["']/gi),
      ...article.body.matchAll(/^\s*\[[^\]]+\]:\s*(\/\S+)/gm),
    ]
    for (const [, href] of links) {
      if (href.startsWith('//')) continue
      if (!/^\/(fr|en)(\/|[?#]|$)/.test(href)) {
        invalid.push(`${article.slug}: ${href} lacks locale`)
        continue
      }
      const match = href.match(/^\/(fr|en)\/resources\/articles\/([^?#]+)/)
      if (match) {
        const target = getContentItem('article', match[2])
        if (!target || target.language !== match[1]) {
          invalid.push(`${article.slug}: ${href} is not canonical`)
        }
      }
    }
  }
  expect(invalid).toEqual([])
})

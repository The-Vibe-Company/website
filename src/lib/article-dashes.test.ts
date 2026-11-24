import { expect, test } from 'bun:test'
import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'

// Site rule (THE-2471): no em dash (U+2014) or en dash (U+2013) in article content.
const FORBIDDEN_DASHES = /[–—]/
const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles')

test('articles contain no em/en dashes outside fenced code blocks', () => {
  const offenders: string[] = []
  for (const file of readdirSync(ARTICLES_DIR).filter((name) => name.endsWith('.md')).sort()) {
    const lines = readFileSync(path.join(ARTICLES_DIR, file), 'utf8').split('\n')
    let fence: string | null = null
    lines.forEach((line, index) => {
      const marker = line.match(/^\s*(`{3,}|~{3,})/)?.[1]
      if (marker) {
        if (fence === null) fence = marker
        else if (marker[0] === fence[0] && marker.length >= fence.length) fence = null
        return
      }
      if (fence === null && FORBIDDEN_DASHES.test(line)) offenders.push(`${file}:${index + 1}`)
    })
  }
  expect(offenders).toEqual([])
})

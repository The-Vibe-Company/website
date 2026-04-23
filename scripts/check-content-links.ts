import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const contentRoot = path.join(root, 'content')
const publicRoot = path.join(root, 'public')

type Resource = {
  type: string
  slug: string
  filePath: string
}

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return []

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) return walk(fullPath)
    return [fullPath]
  })
}

function parseSlug(markdown: string, filePath: string): string {
  const match = markdown.match(/^---\n([\s\S]*?)\n---/)
  const frontmatter = match?.[1] ?? ''
  const slugLine = frontmatter
    .split('\n')
    .find((line) => line.trim().startsWith('slug:'))

  if (!slugLine) return path.basename(filePath, '.md')

  return slugLine
    .slice(slugLine.indexOf(':') + 1)
    .trim()
    .replace(/^["']|["']$/g, '')
}

function collectResources(): Resource[] {
  return walk(contentRoot)
    .filter((filePath) => filePath.endsWith('.md'))
    .map((filePath) => {
      const relative = path.relative(contentRoot, filePath)
      const [type] = relative.split(path.sep)
      const markdown = fs.readFileSync(filePath, 'utf8')

      return {
        type,
        slug: parseSlug(markdown, filePath),
        filePath,
      }
    })
}

function extractLinks(markdown: string): string[] {
  const links: string[] = []
  const linkPattern = /(?<!!)\[[^\]]+\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g
  const htmlHrefPattern = /href=["']([^"']+)["']/g

  for (const match of markdown.matchAll(linkPattern)) {
    links.push(match[1])
  }

  for (const match of markdown.matchAll(htmlHrefPattern)) {
    links.push(match[1])
  }

  return links
}

function stripHash(url: string): string {
  return url.split('#')[0]
}

function main() {
  const resources = collectResources()
  const routes = new Set<string>(['/resources'])

  for (const resource of resources) {
    routes.add(`/resources/${resource.type}`)
    routes.add(`/resources/${resource.type}/${resource.slug}`)
  }

  const failures: string[] = []

  for (const resource of resources) {
    const markdown = fs.readFileSync(resource.filePath, 'utf8')
    const links = extractLinks(markdown)

    for (const rawLink of links) {
      if (!rawLink.startsWith('/')) continue

      const link = stripHash(rawLink)
      if (!link || link === '/') continue

      if (link.startsWith('/images/')) {
        const assetPath = path.join(publicRoot, link)
        if (!fs.existsSync(assetPath)) {
          failures.push(`${resource.filePath}: missing asset ${rawLink}`)
        }
        continue
      }

      if (link.startsWith('/resources')) {
        if (!routes.has(link)) {
          failures.push(`${resource.filePath}: missing resource route ${rawLink}`)
        }
      }
    }
  }

  if (failures.length) {
    console.error('Content link check failed:')
    for (const failure of failures) console.error(`- ${failure}`)
    process.exit(1)
  }

  console.log(`Content link check passed for ${resources.length} markdown files.`)
}

main()

import { renderMarkdown } from '@/lib/markdown'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
}

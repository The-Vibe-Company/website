import { renderMarkdown } from '@/lib/markdown'
import { LazyAudioLoader } from './LazyAudioLoader'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <>
      <div className={className} dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
      <LazyAudioLoader />
    </>
  )
}

import { renderMarkdown } from '@/lib/markdown'
import { bookingLocation } from '@/lib/booking'
import { LazyAudioLoader } from './LazyAudioLoader'

interface MarkdownRendererProps {
  content: string
  className?: string
  /** `location` reported by `booking_link_clicked` for cal.com links in the body. */
  trackingLocation?: string
}

export function MarkdownRenderer({ content, className, trackingLocation }: MarkdownRendererProps) {
  return (
    <>
      <div
        className={className}
        {...(trackingLocation ? bookingLocation(trackingLocation) : {})}
        dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
      />
      <LazyAudioLoader />
    </>
  )
}

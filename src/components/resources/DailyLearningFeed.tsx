import { MarkdownRenderer } from '@/components/resources/MarkdownRenderer';
import { normalizeMarkdownBody } from '@/lib/markdown';

interface DailyLearningFeedItem {
  id: string;
  title: string;
  summary?: string | null;
  body?: unknown;
  publishedAt?: string | null;
}

interface DailyLearningFeedProps {
  items: DailyLearningFeedItem[];
  titleClassName?: string;
  itemClassName?: string;
  emptyClassName?: string;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function DailyLearningFeed({
  items,
  titleClassName = 'text-2xl font-bold tracking-tight text-res-text leading-tight',
  itemClassName = 'py-6 border-b border-res-border/70 last:border-b-0',
  emptyClassName = 'py-6 text-sm text-res-text-muted',
}: DailyLearningFeedProps) {
  if (items.length === 0) {
    return <div className={emptyClassName}>No learnings yet.</div>;
  }

  return (
    <div>
      {items.map((item) => (
        <article key={item.id} className={itemClassName}>
          <div className="mb-3">
            {item.publishedAt && (
              <p className="text-[10px] font-mono uppercase tracking-widest text-res-text-muted mb-2">
                {formatDate(item.publishedAt)}
              </p>
            )}
            <h2 className={titleClassName}>{item.title}</h2>
          </div>

          {normalizeMarkdownBody(item.body).trim().length > 0 ? (
            <MarkdownRenderer
              content={normalizeMarkdownBody(item.body)}
              className="prose-vibe prose-vibe-warm max-w-none text-[15px]"
            />
          ) : item.summary ? (
            <p className="text-sm text-res-text-muted leading-relaxed whitespace-pre-wrap">
              {item.summary}
            </p>
          ) : (
            <p className="text-sm text-res-text-muted leading-relaxed">
              No content yet.
            </p>
          )}
        </article>
      ))}
    </div>
  );
}

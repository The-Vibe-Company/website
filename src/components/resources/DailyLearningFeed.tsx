import type { SerializedEditorState } from 'lexical';
import { RichTextRenderer } from '@/components/resources/RichTextRenderer';

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

function hasLexicalBody(body: unknown): body is SerializedEditorState {
  if (!body || typeof body !== 'object') return false;
  const root = (body as { root?: { children?: unknown[] } }).root;
  return Boolean(root?.children && root.children.length > 0);
}

export function DailyLearningFeed({
  items,
  titleClassName = 'text-2xl font-bold tracking-tight text-res-text leading-tight',
  itemClassName = 'py-6 border-b border-res-border/70 last:border-b-0',
  emptyClassName = 'py-6 text-sm text-res-text-muted',
}: DailyLearningFeedProps) {
  if (items.length === 0) {
    return <div className={emptyClassName}>No daily learnings yet.</div>;
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

          {hasLexicalBody(item.body) ? (
            <RichTextRenderer
              data={item.body}
              className="prose-vibe prose-vibe-warm max-w-none text-[15px]"
            />
          ) : typeof item.body === 'string' && item.body.trim().length > 0 ? (
            <p className="text-sm text-res-text-muted leading-relaxed whitespace-pre-wrap">
              {item.body}
            </p>
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

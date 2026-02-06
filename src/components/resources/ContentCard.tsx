'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { createTransition } from '@/lib/design-system';

interface ContentCardProps {
  title: string;
  summary: string;
  type: string;
  slug: string;
  domain?: string[];
  publishedAt?: string;
}

const typeLabels: Record<string, string> = {
  daily: 'Daily',
  tutorial: 'Tutorial',
  article: 'Article',
  'tool-focus': 'Tool Focus',
  'concept-focus': 'Concept Focus',
};

const domainLabels: Record<string, string> = {
  dev: 'Dev',
  design: 'Design',
  ops: 'Ops',
  business: 'Business',
  'ai-automation': 'AI',
  marketing: 'Marketing',
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function ContentCard({
  title,
  summary,
  type,
  slug,
  domain,
  publishedAt,
}: ContentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={createTransition(0.5)}
    >
      <Link href={`/resources/${type}/${slug}`} className="group block h-full">
        <article className="h-full p-6 border border-foreground/10 hover:border-foreground/30 transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-2 py-0.5 bg-foreground text-background text-[10px] font-mono uppercase tracking-widest">
              {typeLabels[type] || type}
            </span>
            {publishedAt && (
              <span className="text-[11px] font-mono text-muted-foreground">
                {formatDate(publishedAt)}
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold tracking-tight mb-2 group-hover:translate-x-0.5 transition-transform duration-300 leading-snug">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {summary}
          </p>
          {domain && domain.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-foreground/5">
              {domain.map((d) => (
                <span
                  key={d}
                  className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/50"
                >
                  {domainLabels[d] || d}
                </span>
              ))}
            </div>
          )}
        </article>
      </Link>
    </motion.div>
  );
}

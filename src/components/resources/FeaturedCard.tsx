'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  typography,
  components,
  animations,
  cn,
  createTransition,
} from '@/lib/design-system';

interface FeaturedCardProps {
  title: string;
  summary: string;
  type: string;
  slug: string;
  domain?: string[];
  publishedAt?: string;
  readingTime?: number;
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
  'ai-automation': 'AI & Automation',
  marketing: 'Marketing',
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function FeaturedCard({
  title,
  summary,
  type,
  slug,
  domain,
  publishedAt,
  readingTime,
}: FeaturedCardProps) {
  return (
    <motion.div
      initial={animations.variants.fadeInUp.initial}
      animate={animations.variants.fadeInUp.animate}
      transition={createTransition(0.6)}
    >
      <Link
        href={`/resources/${type}/${slug}`}
        className="block group"
      >
        <div className="border-2 border-foreground p-8 md:p-12 lg:p-16 transition-all hover:shadow-[12px_12px_0px_0px_var(--foreground)]">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className={components.badge.solid}>
              {typeLabels[type] || type}
            </span>
            {publishedAt && (
              <span className={cn(typography.label.mono, 'text-muted-foreground')}>
                {formatDate(publishedAt)}
              </span>
            )}
            {readingTime && (
              <span className={cn(typography.label.mono, 'text-muted-foreground')}>
                {readingTime} MIN READ
              </span>
            )}
          </div>

          <h2 className={cn(
            'text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-[0.95] mb-6',
            'group-hover:text-muted-foreground transition-colors'
          )}>
            {title}
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mb-8">
            {summary}
          </p>

          {domain && domain.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {domain.map((d) => (
                <span key={d} className={components.badge.default}>
                  {domainLabels[d] || d}
                </span>
              ))}
            </div>
          )}

          <div className={cn(
            typography.label.mono,
            'text-muted-foreground mt-8 group-hover:text-foreground transition-colors flex items-center gap-2'
          )}>
            READ MORE
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform group-hover:translate-x-1"
            >
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

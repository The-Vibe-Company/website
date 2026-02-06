'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { createTransition } from '@/lib/design-system';

interface DailyCardProps {
  title: string;
  summary: string;
  slug: string;
  publishedAt?: string;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function DailyCard({ title, slug, publishedAt }: DailyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={createTransition(0.3)}
    >
      <Link
        href={`/resources/daily/${slug}`}
        className="group flex items-baseline gap-6 py-3.5 border-b border-foreground/8 hover:bg-foreground/[0.02] transition-colors -mx-3 px-3 rounded-sm"
      >
        {publishedAt && (
          <span className="text-[11px] font-mono text-muted-foreground/60 shrink-0 w-14 tabular-nums">
            {formatDate(publishedAt)}
          </span>
        )}
        <span className="text-[15px] font-medium tracking-tight group-hover:text-muted-foreground transition-colors truncate flex-1">
          {title}
        </span>
        <span className="text-xs text-muted-foreground/30 shrink-0 group-hover:text-muted-foreground/60 transition-colors hidden sm:block">
          &rarr;
        </span>
      </Link>
    </motion.div>
  );
}

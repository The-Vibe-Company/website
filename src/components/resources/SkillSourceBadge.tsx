import Link from 'next/link';
import { resourcesTheme } from '@/lib/resources-theme';
import type { SkillKind } from '@/lib/content-source';

interface SkillSourceBadgeProps {
  kind: SkillKind;
  sourceUrl?: string;
  /** When true, renders a non-link span (useful inside an outer link wrapper). */
  displayOnly?: boolean;
}

export function SkillSourceBadge({ kind, sourceUrl, displayOnly = false }: SkillSourceBadgeProps) {
  if (kind === 'external' && sourceUrl) {
    const content = (
      <>
        <GitHubMark />
        <span>GitHub</span>
        {!displayOnly && <ArrowOut />}
      </>
    );

    if (displayOnly) {
      return (
        <span className={resourcesTheme.skill.sourceBadgeExternal} aria-label="External GitHub source">
          {content}
        </span>
      );
    }

    return (
      <Link
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={resourcesTheme.skill.sourceBadgeExternal}
      >
        {content}
      </Link>
    );
  }

  return (
    <span className={resourcesTheme.skill.sourceBadgeNative}>
      <NativeDot />
      <span>Native</span>
    </span>
  );
}

function GitHubMark() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12.005c0 5.084 3.292 9.395 7.864 10.918.575.105.785-.25.785-.555 0-.273-.01-1.176-.015-2.13-3.196.694-3.872-1.36-3.872-1.36-.523-1.327-1.276-1.68-1.276-1.68-1.043-.713.08-.7.08-.7 1.153.082 1.76 1.184 1.76 1.184 1.025 1.756 2.69 1.249 3.345.954.103-.74.4-1.249.728-1.535-2.55-.29-5.232-1.276-5.232-5.677 0-1.254.448-2.28 1.183-3.083-.119-.29-.513-1.46.112-3.043 0 0 .965-.31 3.16 1.177a10.99 10.99 0 0 1 2.876-.387c.976.005 1.96.132 2.876.387 2.193-1.487 3.156-1.177 3.156-1.177.628 1.583.234 2.753.115 3.043.737.803 1.18 1.83 1.18 3.083 0 4.413-2.687 5.383-5.246 5.667.412.355.78 1.054.78 2.124 0 1.534-.014 2.77-.014 3.146 0 .308.207.665.79.553C20.213 21.395 23.5 17.087 23.5 12.005 23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

function ArrowOut() {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}

function NativeDot() {
  return <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" aria-hidden="true" />;
}

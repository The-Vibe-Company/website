'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { resourcesTheme } from '@/lib/resources-theme';

type Variant = 'default' | 'primary';
type Status = 'idle' | 'copied' | 'failed';

interface CopyButtonProps {
  value: string;
  label?: string;
  copiedLabel?: string;
  variant?: Variant;
  className?: string;
  ariaLabel?: string;
  onCopy?: () => void;
}

/** Older browsers and non-secure pages have no clipboard API: select and copy. */
function copyWithSelection(value: string): boolean {
  const field = document.createElement('textarea');
  field.value = value;
  field.setAttribute('readonly', '');
  field.style.position = 'fixed';
  field.style.opacity = '0';
  document.body.appendChild(field);
  field.select();
  try {
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    document.body.removeChild(field);
  }
}

export function CopyButton({
  value,
  label,
  copiedLabel,
  variant = 'default',
  className,
  ariaLabel,
  onCopy,
}: CopyButtonProps) {
  const t = useTranslations('resources');
  const [status, setStatus] = useState<Status>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resolvedLabel = label ?? t('copy');
  const resolvedCopiedLabel = copiedLabel ?? t('copied');
  const failedLabel = t('copyFailed');
  const copied = status === 'copied';
  const failed = status === 'failed';
  const buttonLabel = copied
    ? t('copiedStatus', { label: resolvedCopiedLabel })
    : failed
      ? failedLabel
      : (ariaLabel ?? resolvedLabel);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const settle = useCallback((next: Status) => {
    setStatus(next);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setStatus('idle'), next === 'failed' ? 3200 : 1600);
  }, []);

  const handleCopy = useCallback(async () => {
    let done = false;
    try {
      await navigator.clipboard.writeText(value);
      done = true;
    } catch {
      done = copyWithSelection(value);
    }
    if (done) {
      onCopy?.();
      settle('copied');
    } else {
      settle('failed');
    }
  }, [value, onCopy, settle]);

  const baseClass = copied
    ? resourcesTheme.skill.copyButtonSuccess
    : failed
      ? `${resourcesTheme.skill.copyButton} !text-danger`
      : variant === 'primary'
        ? resourcesTheme.skill.copyButtonPrimary
        : resourcesTheme.skill.copyButton;

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={buttonLabel}
      className={[baseClass, className].filter(Boolean).join(' ')}
    >
      <CopyIcon status={status} />
      <span>{copied ? resolvedCopiedLabel : failed ? failedLabel : resolvedLabel}</span>
    </button>
  );
}

function CopyIcon({ status }: { status: Status }) {
  if (status === 'copied') {
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    );
  }
  if (status === 'failed') {
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    );
  }
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="11" height="11" rx="1.5" />
      <path d="M5 15V5a1 1 0 0 1 1-1h10" />
    </svg>
  );
}

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { resourcesTheme } from '@/lib/resources-theme';

type Variant = 'default' | 'primary';

interface CopyButtonProps {
  value: string;
  label?: string;
  copiedLabel?: string;
  variant?: Variant;
  className?: string;
  ariaLabel?: string;
  onCopy?: () => void;
}

export function CopyButton({
  value,
  label = 'Copy',
  copiedLabel = 'Copied',
  variant = 'default',
  className,
  ariaLabel,
  onCopy,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const buttonLabel = copied
    ? `Copied: ${copiedLabel}`
    : (ariaLabel ?? label);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      onCopy?.();
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }, [value, onCopy]);

  const baseClass = copied
    ? resourcesTheme.skill.copyButtonSuccess
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
      <CopyIcon copied={copied} />
      <span>{copied ? copiedLabel : label}</span>
    </button>
  );
}

function CopyIcon({ copied }: { copied: boolean }) {
  if (copied) {
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 6 9 17l-5-5" />
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

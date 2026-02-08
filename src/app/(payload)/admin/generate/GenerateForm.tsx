'use client'

import { useState, useTransition, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { generateContentAction, type GenerateResult } from './actions'

interface ContentTypeOption {
  label: string
  value: string
}

// Fallback if API fetch fails
const FALLBACK_TYPES: ContentTypeOption[] = [
  { label: 'Daily Learning', value: 'daily' },
  { label: 'Article', value: 'article' },
  { label: 'Tutorial', value: 'tutorial' },
  { label: 'Tool Focus', value: 'tool-focus' },
  { label: 'Concept Focus', value: 'concept-focus' },
]

function QualityBadge({ score }: { score: number }) {
  const pct = Math.round(score * 100)
  let className = 'generate-result__badge '
  if (score >= 0.7) className += 'generate-result__badge--quality-high'
  else if (score >= 0.5) className += 'generate-result__badge--quality-medium'
  else className += 'generate-result__badge--quality-low'

  return <span className={className}>Quality {pct}%</span>
}

function ElapsedTimer() {
  const [seconds, setSeconds] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(interval)
  }, [])
  return <span className="generate-loading__timer">{seconds}s</span>
}

export function GenerateForm() {
  const [rawText, setRawText] = useState('')
  const [type, setType] = useState('daily')
  const [language, setLanguage] = useState<'fr' | 'en'>('fr')
  const [result, setResult] = useState<GenerateResult | null>(null)
  const [isPending, startTransition] = useTransition()
  const [contentTypes, setContentTypes] = useState<ContentTypeOption[]>(FALLBACK_TYPES)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()

  // Fetch content types from CMS on mount
  useEffect(() => {
    fetch('/api/content-types?sort=sortOrder&limit=100')
      .then((r) => r.json())
      .then((data) => {
        if (data?.docs?.length) {
          setContentTypes(
            data.docs.map((ct: { name: string; slug: string }) => ({
              label: ct.name,
              value: ct.slug,
            })),
          )
        }
      })
      .catch(() => {
        // Keep fallback
      })
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!rawText.trim() || isPending) return
    setResult(null)
    startTransition(async () => {
      const res = await generateContentAction(rawText, type, language)
      setResult(res)
    })
  }

  const handleReset = () => {
    setResult(null)
    setRawText('')
    textareaRef.current?.focus()
  }

  return (
    <div className="generate-form">
      <form onSubmit={handleSubmit}>
        <div className="generate-form__field">
          <label htmlFor="raw-text">Texte brut</label>
          <textarea
            ref={textareaRef}
            id="raw-text"
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Collez vos notes, idées, texte brut ici... Claude va le transformer en contenu structuré."
            rows={8}
            disabled={isPending}
          />
        </div>

        <div className="generate-form__row">
          <div className="generate-form__field">
            <label htmlFor="content-type">Type de contenu</label>
            <select
              id="content-type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              disabled={isPending}
            >
              {contentTypes.map((ct) => (
                <option key={ct.value} value={ct.value}>
                  {ct.label}
                </option>
              ))}
            </select>
          </div>

          <div className="generate-form__field">
            <label htmlFor="language">Langue</label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'fr' | 'en')}
              disabled={isPending}
            >
              <option value="fr">Fran&#231;ais</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        <div className="generate-form__submit">
          <button
            type="submit"
            className="btn btn--style-primary btn--size-medium"
            disabled={isPending || !rawText.trim()}
          >
            {isPending ? 'G\u00e9n\u00e9ration en cours...' : 'G\u00e9n\u00e9rer avec Claude'}
          </button>
        </div>
      </form>

      {isPending && (
        <div className="generate-loading">
          <div className="generate-loading__spinner" />
          <span className="generate-loading__text">
            Claude structure votre contenu...
          </span>
          <ElapsedTimer />
        </div>
      )}

      {result?.success && result.content && (
        <div className="generate-result">
          <div className="generate-result__header">
            <h2 className="generate-result__title">{result.content.title}</h2>
            {result.content.aiMetadata && (
              <QualityBadge score={result.content.aiMetadata.qualityScore} />
            )}
          </div>
          <p className="generate-result__summary">{result.content.summary}</p>

          <div className="generate-result__meta">
            <span className="generate-result__badge generate-result__badge--type">
              {contentTypes.find((ct) => ct.value === result.content!.type)?.label ??
                result.content.type}
            </span>
            {result.content.domain.map((d) => (
              <span key={d} className="generate-result__badge generate-result__badge--domain">
                {d}
              </span>
            ))}
            {result.content.concepts.map((c) => (
              <span key={c} className="generate-result__badge generate-result__badge--concept">
                {c}
              </span>
            ))}
          </div>

          <div className="generate-result__actions">
            <button
              type="button"
              className="btn btn--style-primary btn--size-medium"
              onClick={() => router.push(`/admin/collections/content/${result.content!.id}`)}
            >
              Modifier le draft
            </button>
            <button
              type="button"
              className="btn btn--style-secondary btn--size-medium"
              onClick={handleReset}
            >
              G&#233;n&#233;rer un autre
            </button>
          </div>
        </div>
      )}

      {result && !result.success && (
        <div className="generate-error">
          <strong>Erreur :</strong> {result.error}
          <button
            type="button"
            className="btn btn--style-secondary btn--size-small"
            onClick={() => setResult(null)}
            style={{ marginLeft: '1rem' }}
          >
            R&#233;essayer
          </button>
        </div>
      )}
    </div>
  )
}

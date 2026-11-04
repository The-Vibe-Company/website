import { describe, expect, test } from 'bun:test'

import { directivesToPlainMarkdown, renderMarkdown } from './markdown'

describe('renderMarkdown container directives', () => {
  test('summary renders a kicker, its text and anchor chips with letter avatars', () => {
    const html = renderMarkdown(
      [':::summary{title="En bref"}', 'Six acteurs.', '- [Theodo](#theodo)', '- [Mistral AI](#mistral-ai)', ':::'].join('\n'),
    )

    expect(html).toContain('<aside class="prose-vibe-brief" aria-label="En bref">')
    expect(html).toContain('<p>Six acteurs.</p>')
    expect(html).toContain('<a class="prose-vibe-chip" href="#theodo">')
    expect(html).toContain('<span class="prose-vibe-avatar prose-vibe-avatar--sm" aria-hidden="true">M</span>')
    expect(html).not.toContain(':::')
  })

  test('picker splits each row on the arrow and links the target', () => {
    const html = renderMarkdown(
      [':::picker{title="Quelle agence"}', '- Grand groupe → [Theodo](#theodo)', ':::'].join('\n'),
    )

    expect(html).toContain('data-surface="inverse"')
    expect(html).toContain('<span class="prose-vibe-picker__case">Grand groupe</span>')
    expect(html).toContain('<a class="prose-vibe-picker__pick" href="#theodo">')
  })

  test('compare turns marks into icons with screen-reader text and rows into row headers', () => {
    const html = renderMarkdown(
      [
        ':::compare{caption="Comparatif" yes="Oui" no="Non" legend="Lecture."}',
        '| Acteur | Taille | Stratégie |',
        '|---|---|---|',
        '| [Theodo](#theodo) | 800+ | [x] |',
        '| [Galadrim](#galadrim) | 40 | [ ] |',
        ':::',
      ].join('\n'),
    )

    expect(html).toContain('role="region" aria-label="Comparatif" tabindex="0"')
    expect(html).toContain('<th scope="row" class="prose-vibe-compare__lead">')
    expect(html).toContain('<a href="#theodo">Theodo</a>')
    expect(html).toContain('<span class="prose-vibe-sr">Oui</span>')
    expect(html).toContain('<span class="prose-vibe-sr">Non</span>')
    expect(html).toContain('<th scope="col" class="prose-vibe-compare__mark-col">Stratégie</th>')
    expect(html).toContain('Lecture.')
    expect(html).not.toContain('[x]')
    expect(html).not.toContain('[ ]')
  })

  test('agency renders an anchored card, a fact list and a choose/avoid verdict', () => {
    const html = renderMarkdown(
      [
        ':::agency{name="Mistral AI" tagline="Modèles" choose="Choisir si" avoid="Limites : ne pas choisir si"}',
        '- **Pour qui** : Les entreprises.',
        '- **Sources** : [mistral.ai/services](https://mistral.ai/services)',
        '- **Choisir si** : Vous alignez un modèle.',
        '- **Limites : ne pas choisir si** : Petit projet.',
        ':::',
      ].join('\n'),
    )

    expect(html).toContain('<article class="prose-vibe-agency" id="mistral-ai" aria-labelledby="mistral-ai-name">')
    expect(html).toContain('<h3 id="mistral-ai-name">Mistral AI</h3>')
    expect(html).toContain('<div><dt>Pour qui</dt><dd>Les entreprises.</dd></div>')
    expect(html).toContain('<a href="https://mistral.ai/services" target="_blank" rel="noopener noreferrer">')
    expect(html).toContain('<div class="prose-vibe-agency__choose">')
    expect(html).toContain('<div class="prose-vibe-agency__avoid">')
    expect(html).not.toContain('<dt>Choisir si</dt>')
  })

  test('directive attributes are escaped', () => {
    const html = renderMarkdown([':::agency{name="<img src=x onerror=alert(1)>"}', '- **A** : B', ':::'].join('\n'))

    expect(html).not.toContain('<img src=x')
    expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;')
  })

  test('callout renders an aside with its Markdown body', () => {
    const html = renderMarkdown([':::callout{title="Transparence"}', 'On travaille **aussi** en renfort.', ':::'].join('\n'))

    expect(html).toContain('<aside class="prose-vibe-callout" aria-label="Transparence">')
    expect(html).toContain('<strong>aussi</strong>')
  })

  test('an unclosed or unknown directive stays ordinary text', () => {
    expect(renderMarkdown(':::callout{title="T"}\nTexte')).toContain('<p>:::callout{title="T"}<br />Texte</p>')
    expect(renderMarkdown(':::unknown\nTexte\n:::')).toContain('<p>:::unknown<br />Texte<br />:::</p>')
  })

  test('articles without directives render exactly as before', () => {
    expect(renderMarkdown('Paragraphe.\n\n| A | B |\n|---|---|\n| 1 | 2 |')).toBe(
      '<p>Paragraphe.</p>\n<div class="prose-vibe-table-wrap"><table><thead><tr><th scope="col">A</th><th scope="col">B</th></tr></thead><tbody><tr><td>1</td><td>2</td></tr></tbody></table></div>',
    )
  })
})

describe('directivesToPlainMarkdown', () => {
  test('flattens fences into headings and labels, and marks into words', () => {
    const markdown = [
      ':::agency{name="Theodo" tagline="Grand groupe"}',
      '- **Pour qui** : Grands groupes.',
      ':::',
      '',
      ':::compare{yes="Oui" no="Non" legend="Lecture."}',
      '| Acteur | Stratégie |',
      '|---|---|',
      '| Theodo | [x] |',
      '| Galadrim | [ ] |',
      ':::',
    ].join('\n')

    const plain = directivesToPlainMarkdown(markdown)

    expect(plain).toContain('### Theodo')
    expect(plain).toContain('*Grand groupe*')
    expect(plain).toContain('| Theodo | Oui |')
    expect(plain).toContain('| Galadrim | Non |')
    expect(plain).toContain('Lecture.')
    expect(plain).not.toContain(':::')
  })

  test('leaves Markdown without directives untouched', () => {
    const markdown = '## Titre\n\nTexte avec [lien](/fr).'
    expect(directivesToPlainMarkdown(markdown)).toBe(markdown)
  })
})

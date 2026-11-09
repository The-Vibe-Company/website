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

  test('agency logo replaces the letter avatar and is reused by chips, picker and compare', () => {
    const logo = '/images/resources/x/logos/theodo.webp'
    const html = renderMarkdown(
      [
        ':::summary{title="En bref"}',
        '- [Theodo](#theodo)',
        '- [Galadrim](#galadrim)',
        ':::',
        ':::picker{title="Cas"}',
        '- Grand groupe → [Theodo](#theodo)',
        ':::',
        ':::compare{caption="Comparatif"}',
        '| Acteur | Taille |',
        '|---|---|',
        '| [Theodo](#theodo) | 800+ |',
        ':::',
        `:::agency{name="Theodo" logo="${logo}"}`,
        '- **Pour qui** : Les grands groupes.',
        ':::',
        ':::agency{name="Galadrim"}',
        '- **Pour qui** : Les produits web.',
        ':::',
      ].join('\n'),
    )

    // Card: the logo stands for the company, so its alt is the company name.
    expect(html).toContain(
      `<header class="prose-vibe-agency__head"><span class="prose-vibe-avatar prose-vibe-avatar--logo"><img src="${logo}" alt="Theodo" width="44" height="44" loading="lazy" decoding="async" /></span>`,
    )
    // Chip, picker and compare row: the same file, decorative next to the visible name.
    const smallLogo = `<span class="prose-vibe-avatar prose-vibe-avatar--logo prose-vibe-avatar--sm" aria-hidden="true"><img src="${logo}" alt="" width="22" height="22"`
    expect(html.split(smallLogo).length - 1).toBe(3)
    // No logo attribute: the letter avatar stays, in the card and in its chip.
    expect(html).toContain('<header class="prose-vibe-agency__head"><span class="prose-vibe-avatar" aria-hidden="true">G</span>')
    expect(html).toContain('<span class="prose-vibe-avatar prose-vibe-avatar--sm" aria-hidden="true">G</span>')
    expect(html).not.toContain('aria-hidden="true">T</span>')
  })

  test('agency logo only accepts a site-relative image path', () => {
    for (const logo of ['https://evil.example/x.png', '//evil.example/x.png', '/\\evil.example/x.png', 'javascript:alert(1)', '/images/x.html']) {
      const html = renderMarkdown([`:::agency{name="Theodo" logo="${logo}"}`, '- **A** : B', ':::'].join('\n'))
      expect(html).not.toContain('<img')
      expect(html).toContain('<span class="prose-vibe-avatar" aria-hidden="true">T</span>')
    }
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

  test('a fenced code block inside a directive does not close it', () => {
    const html = renderMarkdown([':::callout{title="Syntaxe"}', '```', ':::', '```', 'Fin.', ':::'].join('\n'))

    expect(html).toContain('<aside class="prose-vibe-callout" aria-label="Syntaxe">')
    expect(html).toContain('<pre><code>:::</code></pre>')
    expect(html).toContain('<p>Fin.</p>')
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

  test('leaves directive syntax shown inside a code block untouched', () => {
    const markdown = ['```md', ':::callout{title="T"}', 'Texte', ':::', '```'].join('\n')
    expect(directivesToPlainMarkdown(markdown)).toBe(markdown)
  })

  test('leaves Markdown without directives untouched', () => {
    const markdown = '## Titre\n\nTexte avec [lien](/fr).'
    expect(directivesToPlainMarkdown(markdown)).toBe(markdown)
  })
})

describe('renderMarkdown image variants', () => {
  const src = '/images/resources/example/schema.png'

  test('a plain image keeps the default figure class', () => {
    const html = renderMarkdown(`![A schema](${src})`)

    expect(html).toContain('<figure class="prose-vibe-image">')
    expect(html).not.toContain('prose-vibe-image--diagram')
  })

  test('{.diagram} opts the figure into the capped, centred diagram variant', () => {
    const html = renderMarkdown(`![A schema](${src}){.diagram}`)

    expect(html).toContain('<figure class="prose-vibe-image prose-vibe-image--diagram">')
    expect(html).toContain('alt="A schema"')
    expect(html).not.toContain('{.diagram}')
  })

  test('a diagram keeps its title as the figcaption', () => {
    const html = renderMarkdown(`![A schema](${src} "Three steps"){.diagram}`)

    expect(html).toContain('<figure class="prose-vibe-image prose-vibe-image--diagram">')
    expect(html).toContain('<figcaption>Three steps</figcaption>')
  })

  test('an unknown variant is not rendered as a figure', () => {
    expect(renderMarkdown(`![A schema](${src}){.huge}`)).not.toContain('<figure')
  })
})

describe('directivesToPlainMarkdown image variants', () => {
  test('strips the {.diagram} suffix so agents get standard Markdown', () => {
    const markdown = '![A schema](/images/x.png "Caption"){.diagram}'

    expect(directivesToPlainMarkdown(markdown)).toBe('![A schema](/images/x.png "Caption")')
  })

  test('leaves fenced code untouched', () => {
    const markdown = ['```md', '![A](/images/x.png){.diagram}', '```'].join('\n')

    expect(directivesToPlainMarkdown(markdown)).toBe(markdown)
  })
})

import type { RawContent } from '../ingestion/adapters/types'

export const VALID_TYPES: RawContent['type'][] = [
  'daily',
  'tutorial',
  'article',
  'tool-focus',
  'concept-focus',
]

export const VALID_DOMAINS = [
  'dev',
  'design',
  'ops',
  'business',
  'ai-automation',
  'marketing',
] as const

interface PromptConfig {
  structureGuidance: string
  maxTokens: number
}

const SYSTEM_PROMPT = `Tu es un rédacteur expert pour The Vibe Company, une plateforme de knowledge sur le développement AI-native et le "vibe coding".

Tu reçois des notes brutes et tu dois les transformer en contenu structuré et bien rédigé.

RÈGLES ABSOLUES :
- Réponds UNIQUEMENT avec du JSON valide, sans texte avant ou après
- Le markdown dans le champ "markdown" ne doit PAS inclure le titre (il est dans le champ "title" séparé)
- Le summary fait MAX 160 caractères
- Les domaines doivent être parmi : ${VALID_DOMAINS.join(', ')}
- Les tools sont des slugs lowercase avec tirets (ex: "cursor", "claude-code", "v0")
- Les concepts sont des tags lisibles (ex: "Vibe Coding", "Prompt Engineering")
- qualityScore entre 0 et 1 (0.7+ = prêt à publier, en dessous = brouillon à retravailler)

FORMAT DE RÉPONSE (JSON strict) :
{
  "title": "Titre accrocheur et descriptif",
  "summary": "Résumé concis de max 160 caractères",
  "markdown": "## Section\\n\\nContenu en markdown bien formaté...",
  "domain": ["dev"],
  "tools": ["cursor"],
  "concepts": ["Vibe Coding"],
  "detectedLanguage": "fr",
  "qualityScore": 0.85
}`

const TYPE_CONFIGS: Record<RawContent['type'], PromptConfig> = {
  daily: {
    structureGuidance: `Type: DAILY LEARNING — Journal d'apprentissage quotidien.

Style : Court, punchy, énergie "today I learned".
Longueur : 300-600 mots max.
Structure du markdown :
- 2-3 paragraphes d'explication
- Liste à puces des points clés découverts
- Section "## À retenir" avec 1-3 takeaways concrets

Ton : Conversationnel, première personne. Comme un dev qui partage une découverte avec ses collègues.`,
    maxTokens: 2048,
  },

  article: {
    structureGuidance: `Type: ARTICLE — Contenu long-form, structuré et approfondi.

Style : Autoritaire mais accessible.
Longueur : 800-2000 mots.
Structure du markdown :
- Paragraphe d'intro (le "hook")
- 3-5 sections avec des titres H2
- Exemples de code si pertinent
- Section conclusion

Ton : Expert qui vulgarise. Pas de jargon inutile, mais technique quand nécessaire.`,
    maxTokens: 4096,
  },

  tutorial: {
    structureGuidance: `Type: TUTORIAL — Guide step-by-step.

Style : Instructionnel, clair, progressif.
Longueur : 600-1500 mots.
Structure du markdown :
- "## Prérequis" (ce qu'il faut avant de commencer)
- "## Ce qu'on va construire" (résultat attendu)
- Étapes numérotées avec H2 ("## Étape 1 : ...")
- Code blocks avec le langage spécifié
- "## Résultat" (ce qu'on obtient à la fin)

Ton : Prof bienveillant. Chaque étape est claire et autonome.`,
    maxTokens: 4096,
  },

  'tool-focus': {
    structureGuidance: `Type: TOOL FOCUS — Review approfondie d'un outil.

Style : Avis éditorial, équilibré mais opinioné.
Longueur : 500-1200 mots.
Structure du markdown :
- "## C'est quoi ?" (description rapide)
- "## Pourquoi l'utiliser" (use cases, avantages)
- "## Pour commencer" (quick start, premier pas)
- "## Points forts / Points faibles" (liste à puces)
- "## Verdict" (recommandation finale)

Le champ tools[] DOIT contenir le slug de l'outil reviewé.
Ton : Testeur honnête. Pas de pub, du vécu.`,
    maxTokens: 3072,
  },

  'concept-focus': {
    structureGuidance: `Type: CONCEPT FOCUS — Explication pédagogique d'un concept.

Style : Éducatif, complexité progressive.
Longueur : 500-1200 mots.
Structure du markdown :
- "## C'est quoi ?" (définition accessible)
- "## Pourquoi c'est important" (impact concret)
- "## Comment l'appliquer" (mise en pratique)
- "## Pour aller plus loin" (ressources, liens)

Le champ concepts[] DOIT contenir le concept expliqué.
Ton : Pédagogue. Utilise des analogies pour les concepts complexes.`,
    maxTokens: 3072,
  },
}

export function getSystemPrompt(): string {
  return SYSTEM_PROMPT
}

export function getPromptConfig(type: RawContent['type']): PromptConfig {
  return TYPE_CONFIGS[type]
}

export function buildUserPrompt(
  rawText: string,
  type: RawContent['type'],
  language: 'fr' | 'en',
): string {
  const config = getPromptConfig(type)
  const langLabel = language === 'fr' ? 'Français' : 'English'

  return `${config.structureGuidance}

Langue de rédaction : ${langLabel}

---
NOTES BRUTES À TRANSFORMER :

${rawText}
---

Génère le contenu structuré. Réponds UNIQUEMENT avec le JSON, rien d'autre.`
}

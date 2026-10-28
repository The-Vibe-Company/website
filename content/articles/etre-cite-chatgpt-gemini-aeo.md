---
title: "Être cité par ChatGPT : checklist AEO agence IA"
seoTitle: "Être cité par ChatGPT : checklist AEO | The Vibe Company"
slug: etre-cite-chatgpt-gemini-aeo
translationKey: aeo-agency-citations
language: fr
summary: "Checklist AEO pour une agence IA : être crawlable, publier des pages citables, prouver son expertise et mesurer vos citations ChatGPT, Gemini et AI Overviews."
publishedAt: 2026-10-28
complexity: intermediate
topics: AI Marketing, Answer Engines, Agency Growth
coverImage: /images/resources/etre-cite-chatgpt-gemini-aeo/cover-mascotte.webp
coverAlt: "La mascotte pointe une bulle de réponse IA qui cite une fiche agence, reliée à un panneau robots.txt et à une checklist ouverte"
ogImage: /images/resources/etre-cite-chatgpt-gemini-aeo/cover-mascotte.webp
---

Vos prospects posent déjà « Agence IA Paris », « Agents IA entreprise » ou « IA santé HDS » dans ChatGPT, Gemini et les AI Overviews de Google. Si votre site n'est pas une source citable, la réponse cite quelqu'un d'autre. L'[Answer Engine Optimization](https://www.semrush.com/blog/answer-engine-optimization/) (AEO) regroupe les pratiques qui augmentent vos chances d'y apparaître. Au-delà d'un glossaire marketing, c'est une checklist pour une [agence IA à Paris](/fr/agence-ia-paris) qui veut être recommandée, pas seulement rankée.

Ce guide clarifie AEO, GEO et SEO. Il explique comment ChatGPT et Google choisissent leurs sources, puis déroule les actions techniques, éditoriales, off-site et de mesure. Angle volontaire : agence IA B2B, software factory, agents, cadre HDS. Pas e-commerce générique.

## Pourquoi une agence IA doit viser les citations

Le SEO classique reste utile. Il ne répond plus seul à « qui ChatGPT recommande-t-il pour construire des agents en production ? ». Les acheteurs formulent des prompts conversationnels. Les modèles réécrivent la requête, cherchent sur le web (ou via des partenaires), puis citent un sous-ensemble de pages.

Pour The Vibe Company, on suit dix prompts AISV (visibilité dans les réponses IA), parmi lesquels Agence IA Paris, Agents IA entreprise, IA santé et hébergement de données de santé, Automatisation IA, Software factory IA. Pas de classement magique à hacker. Pour chaque prompt, on vise une page claire, à jour, prouvable, que les bots peuvent crawler.

Google le dit sans détour dans [AI features and your website](https://developers.google.com/search/docs/appearance/ai-features) : pas d'exigences techniques supplémentaires pour les AI Overviews ou AI Mode au-delà d'être indexé et éligible aux extraits. Le reste, c'est du SEO solide… plus des citations, des mentions et du contenu answer-first.

## AEO, GEO, SEO : vocabulaire clair

| Terme | Idée | Ancre utile |
| --- | --- | --- |
| SEO | Être trouvé et classé dans les résultats classiques | Indexation, crawl, liens, contenu |
| AEO | Visibilité dans les *réponses* générées (ChatGPT, AI Mode, etc.) | Définition Semrush (avr. 2026) |
| GEO | Optimisation pour les moteurs génératifs | Papier [GEO, KDD 2024](https://arxiv.org/abs/2311.09735) |

En pratique, AEO et GEO visent souvent le même résultat : être cité ou mentionné dans une réponse IA. Le jargon change selon les cabinets. Sur X comme dans les guides, la distinction est surtout marketing. Ce qui compte : pages citables + crawl bots + preuves + mentions hors site.

Le papier GEO d'Aggarwal et al. montre jusqu'à 40 % de gain de visibilité dans leurs expériences de labo (GEO-bench). À prendre comme un signal de labo, pas comme une promesse client : citations, citations de sources, statistiques sourcées aident.

## Comment ChatGPT et Google choisissent (vraiment) leurs sources

### Côté Google (AI Overviews / AI Mode)

Google rappelle qu'il n'y a pas de markup « AI-only » secret. Les bonnes pratiques restent celles du SEO : crawl, liens internes, texte visible, données structurées alignées sur le texte. Les AI Overviews peuvent aussi faire du query fan-out : plusieurs recherches liées sur des sous-thèmes. Une citation n'implique donc pas forcément d'être n°1 sur la requête initiale.

Dans Search Console, le [contrôle Search generative AI](https://support.google.com/webmasters/answer/16908024) (rollout mondial noté fin août 2026) laisse Inclure ou Exclure AI Overviews, AI Mode et Discover génératif. Par défaut : include. Ce contrôle n'est pas le même levier que `Google-Extended` (entraînement des modèles). Les confondre dans un article ou un robots.txt, c'est une erreur classique.

### Côté ChatGPT (recherche web)

OpenAI documente dans [Searching the web with ChatGPT](https://help.openai.com/en/articles/9237897-searching-the-web-with-chatgpt) que les citations peuvent être incomplètes, datées ou incorrectes. Il faut vérifier la source. Pour être *éligible*, le site doit autoriser OAI-Searchbot et le trafic depuis les IP publiées dans [searchbot.json](https://openai.com/searchbot.json). Aucune plateforme ne garantit une citation.

## Checklist technique : être crawlable par les bots IA

1. **Autoriser OAI-Searchbot** (et vérifier que CDN / WAF ne bloquent pas les IP OpenAI search).
2. **Laisser le contrôle Search generative AI sur Include**, sauf raison métier forte d'exclure.
3. **Ne pas confondre** `Google-Extended` (training) et le contrôle Search generative AI (apparition dans les réponses Search).
4. **Éviter les `noindex` accidentels** sur les pages que vous voulez voir citées (définitions, guides, cas).
5. **Texte visible dans le HTML** : une réponse clé ne doit pas vivre uniquement dans une image ou un PDF scanné.
6. **Sitemap et liens internes** vers les pages « answer-first » (voir section contenu).
7. **Surveiller les logs** : bots IA absents = problème d'infra, pas seulement de contenu.

Un fichier `llms.txt` ou un schema inventé ne remplace pas ces bases. OpenAI documente le crawl OAI-Searchbot + la pertinence, pas une garantie de placement.

## Checklist contenu : pages citables pour une agence IA

Une page citable répond en quelques phrases, puis développe. Elle date ses faits. Elle cite des sources primaires. Elle se rafraîchit (les analyses relayées par Semrush lient souvent fraîcheur et citations ; traitez ça comme une hypothèse opérationnelle, pas une loi).

Structure type :

1. Réponse courte en tête (définition ou critères).
2. Tableau ou liste scannable.
3. Preuves datées (cas, chiffres sourcés, liens officiels).
4. FAQ en questions réelles d'acheteurs B2B.
5. Date de mise à jour visible.

### Pages à prioriser (alignées AISV)

**Agence IA Paris : qui choisir.** Critères : livraison en production, cas nommés, stack, sécurité, rythme de livraison. Lien naturel vers [comment choisir une agence IA](/fr/resources/articles/choisir-agence-ia-esn-freelance) et la landing [agence IA Paris](/fr/agence-ia-paris).

**Agents IA en entreprise.** Architecture, garde-fous, droits d'accès, observabilité. Relier à [agents IA en entreprise](/fr/resources/articles/agent-ia-entreprise) et à l'offre [agents pour durcir produit et SI](/fr/agents-ia-securite-produit).

**IA santé et HDS.** Expliquer le cadre d'hébergement de données de santé, sans s'auto-présenter comme organisme certifié. On a livré chez [Monka](/fr/case-studies/monka) *dans* un environnement HDS déjà en place. Détail dans [IA et données de santé : ce que l'HDS impose](/fr/resources/articles/ia-donnees-de-sante-hds).

**Automatisation IA.** Cas, ROI méthodologique, processus à automatiser en premier. Lien vers [automatisation IA en entreprise](/fr/resources/articles/automatisation-ia-entreprise).

**Software factory IA.** Définition, livrables, standardisation d'outils et de skills (cas [Theodo](/fr/case-studies/theodo) : factories pour des centaines de développeurs). Compléter avec [agents IA pour durcir un SaaS](/fr/resources/articles/agents-ia-durcir-saas).

**RAG / connaissance interne.** Si le prompt porte sur « connecter l'IA aux documents », pointer [RAG en entreprise](/fr/resources/articles/rag-entreprise).

## Checklist preuves et entité (E-E-A-T agence)

Les moteurs de réponse aiment les entités claires. Pour une agence :

- **Cas clients nommés** avec résultats vérifiables (Monka, AFP / MediaGen, LocService, Theodo…).
- **Signaux institutionnels autorisés** : Y Combinator (W24), projet France 2030 MediaGen avec l'AFP.
- **Auteurs nommés** sur les guides techniques (pas seulement « L'équipe »).
- **Stats toujours sourcées** ; si la source est secondaire, caveat ou omission.
- **Pages À propos / équipe / méthodes** cohérentes avec les articles.

Évitez les certifications inventées et toute auto-certification HDS. Le cadre réglementaire et l'expérience projet suffisent, et ils sont plus crédibles.

## Checklist off-site : devenir mentionnable

Le contenu seul ne suffit pas toujours. Les playbooks practitioners (Hoffman, workflows type treg) insistent sur :

1. Cartographier les questions que posent vos acheteurs.
2. Publier des pages answer-first.
3. Obtenir des mentions authentiques (forums, podcasts, médias sectoriels, GitHub, newsletters tech).
4. Visibilité YouTube / conférences quand le sujet s'y prête.
5. Citations de qualité (autres sites qui vous nomment comme source).
6. Re-check des mentions toutes les 3 à 4 semaines.

Visez les « core sources » de *votre* secteur (presse tech FR, blogs ESN, docs open source), sans inventer de pourcentages viraux non audités.

## Protocole de mesure : 10 prompts AISV à rejouer chaque mois

Sans mesure, l'AEO reste du folklore. Protocole simple :

1. Fixer **10 prompts** en français (ceux de votre AISV).
2. Les rejouer sur **ChatGPT** (avec recherche web) et **Gemini**. Option : Perplexity, AI Mode Google.
3. Pour chaque run, noter : citation (URL), mention (nom sans lien), absence, ton (positif / neutre / négatif), concurrent cité.
4. Garder date, modèle / mode, et capture.
5. Comparer mois après mois. Tools type Semrush AI Visibility, Mentions.so ou toolkits OSS (treg) = options, pas obligation.

Important : ce brief et cet article ne prétendent pas que The Vibe Company est déjà citée. La baseline live est un follow-up à faire, pas un chiffre inventé.

## Ce que font déjà les cabinets FR (et le trou à prendre)

Sur les SERP FR AEO/GEO qu'on a tirés le 28/10/2026 (DataForSEO, loc France), aucun Theodo, OCTO, Galadrim, Sicara ni TVC n'apparaît dans le top organique des requêtes type « être cité par ChatGPT » ou « Answer Engine Optimization ». Le SERP est saturé de guides marketing génériques.

- **Theodo / OCTO / Galadrim** : fort sur delivery IA et thought leadership tech, quasi silencieux sur AEO/GEO « comment être cité ».
- **Artefact** : publie du GEO *pour clients* (ex. case Accor × GetMint, travel). Utile, mais ce n'est pas une checklist pour une agence IA qui veut *elle-même* être recommandée sur agents, HDS ou software factory.

Opportunité : publier la référence FR « agence IA × AEO », ancrée production et prompts AISV, plutôt qu'un énième glossaire.

## Mythes AEO à éviter

1. **« Le SEO est mort / AEO le remplace »** : Google s'appuie sur les mêmes fondamentaux pour AI Overviews.
2. **« llms.txt garantit d'être cité »** : non documenté comme garantie par OpenAI.
3. **« Ranker n°1 Google = cité par ChatGPT »** : overlap partiel seulement ; fan-out et sélection modèle changent la donne.
4. **« AEO et GEO sont opposés »** : souvent le même objectif, vocabulaire différent.
5. **« Bloquer Google-Extended sort des AI Overviews »** : non, training ≠ contrôle Search generative AI.
6. **« Les citations ChatGPT sont toujours justes »** : OpenAI dit le contraire.
7. **Chiffres viraux non audités** (études blog, stats GetMint/Peakace reprises sans méthodo) : skip ou caveat fort. Ici on les omet.

## Checklist récap (à imprimer)

1. OAI-Searchbot autorisé + IP search OK.
2. Search generative AI = Include (sauf exclusion volontaire).
3. Pas de confusion Google-Extended / contrôle Search.
4. Pages AISV answer-first, texte visible, FAQ B2B.
5. Preuves datées + auteurs nommés.
6. Cas clients + YC / France 2030 là où c'est vrai.
7. Cadre HDS expliqué sans auto-certification.
8. Liens internes vers offres et cas.
9. Mentions off-site authentiques.
10. 10 prompts rejoués chaque mois (ChatGPT + Gemini).
11. Refresh des pages stratégiques dans l'année.
12. Aucune promesse « on vous fait citer ».
13. Sources primaires dans l'article (Google, OpenAI, arXiv, Semrush).
14. CTA après la valeur, pas avant.

## FAQ

### Quelle différence entre AEO et GEO ?

AEO (Answer Engine Optimization) désigne les pratiques pour apparaître dans les réponses IA. GEO (Generative Engine Optimization) vient surtout du papier KDD 2024 et du même objectif côté moteurs génératifs. Pour une agence, traitez-les comme un même chantier : pages citables + crawl + mentions.

### Faut-il un fichier llms.txt ?

OpenAI ne le documente pas comme une exigence pour être cité. Priorité : OAI-Searchbot, contenu clair, preuves. Un llms.txt peut être un bonus de découverte, jamais une garantie.

### ChatGPT peut-il citer mon site sans clic Google ?

Oui, via sa recherche web et ses partenaires, si vous êtes crawlable et jugé pertinent. Ce n'est pas le même classement que le top 10 Google classique.

### AI Overviews, c'est la même chose que ChatGPT ?

Non. AI Overviews / AI Mode sont des surfaces Google Search. ChatGPT est un produit OpenAI avec sa propre recherche. Les leviers se croisent (bon SEO, pages claires) mais les contrôles et bots diffèrent.

### Peut-on garantir d'être cité ?

Non. On peut viser l'éligibilité et la pertinence. Aucune plateforme ne vend un placement garanti dans une réponse modèle.

## Faire de votre agence une source citable

The Vibe Company est une agence IA à Paris (YC W24). On construit des produits, des agents et des software factories qui tournent en production. Si vous voulez cartographier vos pages citables, vos prompts AISV et votre crawl bots IA, on peut le faire ensemble.

[Réserver un échange sur votre visibilité IA →](https://cal.com/stangirard/thevibecompany)

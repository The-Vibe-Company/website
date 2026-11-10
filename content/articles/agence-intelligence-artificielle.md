---
title: "Agence intelligence artificielle : 3 étapes d'une mission"
seoTitle: "Agence intelligence artificielle : 3 étapes d'une mission"
slug: agence-intelligence-artificielle
translationKey: what-an-ai-agency-does
language: fr
summary: "Agence IA : audit, prototype, mise en production. Rôles, livrables (code, prompts, évals) et cas Monka quand il faut ralentir."
publishedAt: 2026-11-06
complexity: beginner
topics: AI Adoption, Strategy, AI Agents
coverImage: /images/resources/agence-intelligence-artificielle/cover-mascotte.webp
coverAlt: "La mascotte The Vibe Company déroule un plan de mission IA : audit, prototype, puis mise en production"
ogImage: /images/resources/agence-intelligence-artificielle/cover-mascotte.webp
---

En France, selon l'[Insee](https://www.insee.fr/fr/statistiques/9025878), en 2025, 15 % des entreprises de 10 à 49 salariés utilisent au moins une technologie d'IA, contre 31 % de 50 à 249 salariés et 58 % au-delà. Parmi celles qui ne l'utilisent pas, 54 % citent le manque d'expertise (champ : entreprises de 10 salariés ou plus). C'est ce manque qu'une agence vient combler.

Une agence d'intelligence artificielle (ou agence IA) conçoit, construit et met en production des outils d'IA pour une entreprise. Elle identifie les cas d'usage, prototype, intègre l'outil au système existant, puis mesure sa qualité dans le temps.

Chez [Monka](/fr/case-studies/monka), l'app des aidants est partie en production le 10 mai, deux mois après le démarrage. Et pourtant on a dû ralentir, parce qu'on allait trop vite pour eux. C'est tout le travail d'une agence IA : savoir livrer vite, et savoir quand freiner.

:::summary{title="En bref"}
- Trois étapes, dans l'ordre : audit et cadrage, prototype, mise en production.
- À exiger par écrit : le code, les prompts, les jeux d'évaluation, la documentation et les accès.
- Le prototype sert à tester l'idée avec le métier.
- Le goulot se trouve souvent chez le client, du côté du référent métier.
:::

## C'est quoi une agence IA : elle conçoit, construit et déploie pour d'autres entreprises

Une **agence d'intelligence artificielle** (ou agence IA) est une équipe qui prend un besoin métier et le transforme en système IA utilisable : agent, RAG sur documents, automatisation branchée sur vos outils, produit complet. Elle travaille pour d'autres entreprises.

| | Ce qu'elle fait |
|---|---|
| Agence IA | Conçoit, construit et déploie, pour d'autres entreprises |
| ESN | Surtout des profils en régie pour renforcer vos équipes |
| Cabinet de conseil | Stratégie, gouvernance, multi-pays, rarement le code en production |
| Freelance | Fort sur une tâche précise, limité quand il faut front, back, infra et sécurité ensemble |
| « AI automation agency » (Make/Zapier) | Des scénarios no-code. Utile pour des flux simples. Pas le même métier qu'une agence qui intègre des LLM, des agents et votre SI |

En 2026, l'IA en entreprise repose surtout sur des modèles existants : selon [Menlo Ventures](https://menlovc.com/perspective/2026-the-state-of-enterprise-ai/), seuls 10 % des équipes qui construisent des produits IA dans les entreprises américaines post-entraînent leurs propres modèles. Une agence IA intègre donc le plus souvent des LLM du marché (API, open source) plutôt que d'entraîner les siens. Elle les branche (RAG, agents, outils) sur vos données et vos process.

Pour Paris et le positionnement local, voir aussi [Agence IA à Paris](/fr/agence-ia-paris).

Une mission d'agence IA se déroule en trois étapes. Il faut aussi savoir quand ralentir.

![Mission d'agence IA en 3 étapes : audit et cadrage, prototype, mise en production, et quand ralentir. Détaillé ci-dessous.](/images/resources/agence-intelligence-artificielle/mission-agence-ia-3-etapes.png){.diagram}

1. Audit et cadrage : cas d'usage priorisés, critères de succès.
2. Prototype : testé avec le métier, sur vos vraies données. Si le métier n'est pas prêt, on ralentit (cas Monka).
3. Mise en production : intégration SI, évaluation, monitoring. Sans ça, vous avez une démo, pas un outil.

## Audit et cadrage : l'étape 1 clarifie le problème avant le code

On clarifie d'abord le problème. Dans les 65 entretiens menés par la [RAND](https://www.rand.org/pubs/research_reports/RRA2680-1.html) auprès d'ingénieurs IA expérimentés, la cause d'échec la plus fréquente est un problème mal compris ou mal transmis entre le métier et l'équipe technique. Le cadrage pose donc ces questions typiques :

1. Quel processus métier concrètement (pas « on veut de l'IA ») ?
2. Quelles données existent, où, avec quels droits d'accès ?
3. Qui décide si le résultat est bon (métier, support, juridique) ?
4. L'IA doit-elle lire, proposer, préparer, ou exécuter ?
5. Quel critère de succès mesurable après le premier lot ?

Le cadrage livre en général des cas d'usage priorisés, un périmètre et un hors périmètre, une esquisse d'architecture, une estimation et des critères de succès. Les parcours publics suivent souvent la même logique (audit, priorisation, prototype, développement), par exemple [celui résumé par Jayd](https://www.jayd.ai/meilleures-agences-ia-france-2026).

Bpifrance subventionne un [Diag Data IA](https://www.bpifrance.fr/catalogue-offres/diag-data-ia) de 8 jours avec un expert agréé. Le devis est plafonné à 10 000 € HT, avec 40 % de subvention, soit 6 000 € HT de reste à charge, pour les PME et ETI de 10 à 2 000 ETP qui font au moins 1 M€ de chiffre d'affaires et ont plus d'un an d'existence. Rapporté aux 8 jours, ce plafond donne 10 000 / 8 = 1 250 € HT par jour (calcul fait par TVC, non publié par Bpifrance). C'est un étalon utile pour juger le prix d'un cadrage.

Si le cadrage ne produit rien de testable, vous payez de la procrastination.

## Prototype : l'étape 2 teste l'idée avec le métier, sur vos données

On montre au métier un parcours cliquable ou un agent limité à un périmètre réel. Il tourne sur de vraies données (ou un échantillon représentatif), avec de vrais utilisateurs et un critère de succès écrit à l'avance.

Ce qu'on valide :

- le métier comprend-il et utilise-t-il le flux ?
- la qualité du modèle, mesurée sur un jeu public, tient-elle aussi sur vos cas ?
- qu'est-ce qui doit rester humain (validation, envoi, décision irréversible) ?

La charge, toute l'intégration SI et le monitoring long terme attendent l'étape suivante. Quand c'est utile, **on prototype avant de tout coder**, pour ne pas solidifier un mauvais process.

Les chiffres d'échec qui circulent ne mesurent pas la même chose. [Gartner](https://www.gartner.com/en/newsroom/press-releases/2024-07-29-gartner-predicts-30-percent-of-generative-ai-projects-will-be-abandoned-after-proof-of-concept-by-end-of-2025) prévoyait en 2024 qu'au moins 30 % des projets d'IA générative seraient abandonnés après le POC fin 2025. En janvier 2026, [il constatait](https://www.gartner.com/en/articles/genai-project-failure) « at least 50% ». La [RAND](https://www.rand.org/pubs/research_reports/RRA2680-1.html), souvent citée pour « 80 % », ne fait que reprendre une estimation. Sa matière propre, ce sont les 65 entretiens cités plus haut.

:::callout{title="Ce qu'on a appris chez Monka"}
Chez [Monka](/fr/case-studies/monka) (accompagnement des aidants), on a démarré le 9 mars. L'app des aidants est partie en production le 10 mai, avec le CRM des infirmières à côté. On a appris un truc : **on allait trop vite pour eux**. On a dû ralentir pour laisser à leur équipe le temps de travailler le métier. Un prototype a servi à tester l'idée avant de tout figer.

L'adoption suit son propre rythme. Un bon partenaire sait accélérer les commits, et il sait aussi freiner quand le métier n'est pas prêt.
:::

## Mise en production : l'étape 3 branche l'outil sur votre SI

En production, l'outil se branche sur votre CRM, votre ticketing, le SSO et vos API internes, avec de vrais droits. Côté données, il faut régler l'hébergement, les logs, les environnements de test et les sous-traitants modèles. L'outil tourne sur un jeu de tests versionné, avec des seuils et quelqu'un qui signe la recette. Le monitoring suit la dérive de qualité et les coûts d'appels modèles, avec des alertes.

Restent les droits de l'IA. Pour chaque action, on choisit entre lire, proposer, préparer et exécuter. L'irréversible reste à un humain.

Côté loi, l'obligation de maîtrise de l'IA (article 4 de l'AI Act) s'applique depuis le 2 février 2025 à toute entreprise qui déploie un outil d'IA. Selon la [FAQ de la Commission](https://digital-strategy.ec.europa.eu/en/faqs/ai-literacy-questions-answers), l'article 4 modifié demande de prendre des mesures, sans fixer de niveau. Les autorités nationales contrôlent son application depuis le 2 août 2026. Demandez à l'agence ce qu'elle prévoit pour former vos utilisateurs. Ceci ne vaut pas avis juridique.

## Équipe type : sans référent métier, le prototype meurt en adoption

Côté client, il faut un **référent métier** disponible. Sans lui, le prototype « marche » en labo et meurt en adoption.

Côté agence, une mission sérieuse réunit en général un **profil produit**, un **ingénieur IA** et des **devs**. Le profil produit tient le cadrage, la priorisation et le critère de succès. L'ingénieur IA s'occupe du RAG, des agents, des évaluations et des prompts. Les devs couvrent le front, le back, l'infra et la sécurité. Un designer s'ajoute parfois, quand l'interface compte.

## Agence IA pour PME/ETI ou grand groupe : l'équipe et la gouvernance changent

Le champ de l'Insee couvre les entreprises de 10 salariés ou plus des secteurs principalement marchands, hors secteurs agricole, financier et d'assurance.

- **PME / ETI** : un cas d'usage clair, une petite équipe qui livre de bout en bout, peu de comités. C'est là que The Vibe Company est le plus utile.
- **Grand groupe** : souvent plusieurs équipes, gouvernance, sécurité, parfois plusieurs pays. Des acteurs comme Theodo ou Artefact sont armés pour ça. On intervient aussi en **renfort technique** ou en conseil (architecture, RAG, agents, évaluation), sans remplacer un programme multi-équipes.

On ne dénigre personne. Un mauvais match perd du temps des deux côtés. Le détail « qui pour quel projet » est dans le [comparatif honnête d'agences IA](/fr/resources/articles/meilleure-agence-ia-comparatif). Pour le local, voyez [Agence IA à Paris](/fr/agence-ia-paris).

## Choisir son agence IA : 6 questions

Pour choisir le partenaire, posez ces 6 questions, tirées du guide [Agence IA, ESN ou freelance : comment choisir](/fr/resources/articles/choisir-agence-ia-esn-freelance).

1. Quels projets avez-vous mis en production, et depuis combien de temps tournent-ils ?
2. Qui, nommément, travaillera sur mon projet ?
3. Quel premier résultat utilisable, et quand ?
4. Que deviennent les données (hébergement, modèles, logs, tests) ?
5. À qui appartiennent le code, les prompts, les tests et la documentation ?
6. Quel point d'arrêt explicite après le premier lot, si les critères ne sont pas atteints ?

Méfiez-vous des classements où l'auteur est n°1. Ils servent seulement à découvrir des noms.

Méfiez-vous aussi des « agents » rebaptisés. [Gartner](https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027) appelle ça l'« agent washing » : des chatbots ou des automatisations renommés sans vraie capacité d'agent. Il estime qu'environ 130 éditeurs sur des milliers proposent de vrais agents. Demandez à voir l'agent agir dans un de vos outils.

## Livrables à exiger : code, prompts et évals appartiennent au client

Exigez ces livrables noir sur blanc :

1. **Le code** (repo, accès, propriété) ;
2. **Les prompts et skills** versionnés ;
3. **Les jeux d'évaluation** (cas réels anonymisés, seuils) ;
4. **La documentation** (architecture, runbook, qui fait quoi) ;
5. **Les accès** (hébergement, clés, logs) et la **réversibilité**.

Quelle que soit l'agence, le code, les prompts et les jeux d'évaluation appartiennent au client. Si on vous répond « on garde les prompts », cherchez ailleurs. C'est un verrou.

## FAQ

### Qu'est-ce qu'une agence IA ?

Une agence IA est une équipe externe. Elle transforme un besoin métier en système IA utilisable, comme un agent, un RAG sur documents, une automatisation branchée sur vos outils ou un produit complet. Elle conçoit, construit et déploie pour d'autres entreprises, et mène un cas d'usage jusqu'à l'outil en production, avec intégration au système existant et suivi de la qualité.

### Une agence IA entraîne-t-elle des modèles ?

Le plus souvent, non : elle intègre des modèles existants (RAG, agents, outils). L'entraînement ou le fine-tuning lourd est l'exception, souvent chez l'éditeur de modèles ou un labo dédié.

### Combien de temps dure le cadrage ?

Ça dépend du besoin. Ce qui compte, c'est d'avoir un livrable testable à la fin, quel que soit le nombre de semaines.

### Quelle différence avec une agence d'automatisation no-code ?

Une agence d'automatisation enchaîne surtout des outils no-code (Make, Zapier…). Une agence IA d'ingénierie construit des systèmes branchés sur vos données et votre SI (agents, RAG, évaluations). Les deux peuvent coexister. Risque et propriété diffèrent.

## Parler de votre cas d'usage

The Vibe Company est une agence IA à Paris. On travaille surtout avec des PME et ETI qui veulent un outil en production, et en renfort technique pour les grands groupes. En 30 minutes, on vous dit si une agence est le bon format, même si la réponse est non.

[Réserver 30 minutes →](https://cal.com/stangirard/thevibecompany)

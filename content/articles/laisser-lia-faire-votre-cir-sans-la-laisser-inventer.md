---
title: "Laisser l'IA faire votre CIR, sans la laisser inventer"
slug: laisser-lia-faire-votre-cir-sans-la-laisser-inventer
summary: "Un playbook concret pour transformer Linear, GitHub, Notion, Drive et vos exports en dossier CIR/CII vérifiable. Pas avec un prompt magique, mais avec un atelier de preuves."
publishedAt: 2026-04-23
complexity: advanced
topics: AI Operations, Research Tax Credit, Agent Workflows
coverImage: /images/resources/le-cir-ne-secrit-pas-il-se-compile/cover-proof-compiler.svg
coverAlt: "Un atelier de preuves transforme les traces de travail en dossier CIR/CII"
ogImage: /images/resources/le-cir-ne-secrit-pas-il-se-compile/cover-proof-compiler.png
---

Le problème du CIR n'est pas d'écrire cent pages.

Le problème, c'est de prouver que ces cent pages reposent sur du travail réel.

Les tickets sont dans Linear. Les commits sont dans GitHub. Les specs sont dans Notion ou Drive. Les temps sont dans des tableurs. Les décisions sont dans des comptes rendus. Les échecs sont dans la tête des ingénieurs.

Et quelques semaines avant la deadline, quelqu'un essaie de transformer tout ça en dossier fiscal défendable.

C'est là que beaucoup d'équipes se trompent avec l'IA.

Elles demandent :

```text
Écris-moi notre dossier CIR.
```

Mauvaise idée.

Un agent peut très bien écrire un texte fluide sur votre R&D. Ça ne veut pas dire que ce texte est vrai, sourcé, vérifiable, ou utile face à un expert.

Le bon prompt n'est pas "écris le dossier".

Le bon système, c'est :

```text
Voici les traces réelles de notre entreprise.
Retrouve les preuves.
Classe-les.
Dis-nous ce qui est CIR, ce qui est CII, ce qui est hors sujet,
et ce qui doit être validé par un humain.
Ensuite seulement, aide-nous à rédiger.
```

Ce playbook explique comment faire.

## ce qu'on construit vraiment

On ne construit pas un générateur de prose.

On construit un atelier de preuve.

À la fin, vous voulez pouvoir prendre une phrase du dossier et remonter vers une source : ticket Linear, commit GitHub, spec Notion, benchmark, export financier, métrique produit, interview interne, ou validation humaine.

Si une phrase ne peut revenir vers aucune preuve, elle ne doit pas être dans le dossier final. Ou alors elle doit être marquée "à valider".

C'est la règle.

## étape 1 : créer un repo atelier

Ne commencez pas dans un document Word.

Créez un repo dédié au dossier.

```text
cir-cii/
  CLAUDE.md ou AGENTS.md
  TODO.md
  context/
  sources/
  evidence/
  dossier/
  output/sections/
  .claude/skills/ ou .agents/skills/
```

Le repo sert à séparer les choses :

- `context/` contient l'historique : anciens dossiers, éléments administratifs, cadrage, contexte produit ;
- `sources/` contient les exports ou liens bruts ;
- `evidence/` contient les preuves normalisées ;
- `dossier/` contient les analyses intermédiaires ;
- `output/sections/` contient les sections finales ;
- `TODO.md` contient tout ce que l'agent ne sait pas encore.

La règle la plus importante tient en une ligne :

```text
N'invente jamais rien.
Pose des questions.
Découpe en sous-tâches dans TODO.md.
```

C'est court, mais ça change tout.

Vous ne demandez pas à l'agent d'avoir raison tout seul. Vous lui demandez de rendre visibles les preuves, les trous, et les prochaines questions.

## étape 2 : brancher les sources qui prouvent le travail

Un dossier CIR/CII solide naît du croisement des sources.

| Source | Ce qu'elle prouve |
| --- | --- |
| Linear | Projets, tickets, dates, owners, statuts, commentaires, chronologie |
| GitHub / GitLab | Commits, PRs, releases, auteurs, code réellement livré |
| Notion / Drive | Specs, ADR, benchmarks, décisions, notes d'expérimentation |
| Tableurs finance | Temps, coûts, périodes, personnes, valorisation |
| Dashboards produit | Résultats, qualité, métriques, limites observées |
| Emails / comptes rendus | Décisions, validations, échanges experts |
| Interviews internes | Raisons tacites, échecs, arbitrages non documentés |

Avec des MCP, l'agent peut explorer directement Linear, GitHub, Notion ou d'autres outils. Sans MCP, vous pouvez commencer avec des exports propres.

Ce qui compte, ce n'est pas la sophistication du connecteur.

Ce qui compte, c'est de donner à l'agent des traces de travail, pas seulement des documents finis.

## étape 3 : lancer une première passe de cadrage

La première passe ne doit pas produire le dossier.

Elle doit produire une carte.

Voici le prompt de départ :

```text
Tu es un agent de compilation CIR/CII.

Ton objectif n'est pas d'écrire le dossier final maintenant.
Ton objectif est de comprendre le contexte, identifier les lots candidats,
chercher l'état de l'art, puis produire une analyse initiale vérifiable.

Contexte disponible :
- lis le dossier context/ ;
- lis les sources déjà présentes dans sources/ ;
- si tu as accès à Linear, GitHub/GitLab, Notion/Drive ou aux exports, explore-les ;
- utilise Linear pour retrouver projets, issues, statuts, dates, assignees et commentaires ;
- utilise GitHub/GitLab pour retrouver commits, PRs, releases et auteurs ;
- utilise Notion/Drive pour retrouver specs, ADR, benchmarks et décisions ;
- cherche l'état de l'art pertinent dans les sources disponibles ou sur le web ;
- n'utilise que des éléments sourcés.

Livrables attendus :
1. Crée dossier/00_analyse_initiale.md avec :
   - résumé de l'entreprise et du produit ;
   - liste des lots R&D ou innovation candidats ;
   - hypothèse CIR, CII, hors périmètre ou à valider pour chaque lot ;
   - premiers verrous techniques ou nouveautés produit ;
   - sources utilisées ;
   - questions ouvertes.

2. Crée evidence/source_manifest.md avec :
   - toutes les sources disponibles ;
   - ce que chaque source peut prouver ;
   - les accès manquants ;
   - les risques de confidentialité.

3. Mets à jour TODO.md avec :
   - les documents manquants ;
   - les interviews à faire ;
   - les points comptables à valider ;
   - les points fiscaux à faire relire.

Contraintes :
- n'invente jamais une preuve ;
- si une information manque, écris "à valider" ;
- sépare clairement faits, hypothèses et questions ;
- ne rédige pas encore les sections finales.
```

Cette passe doit être imparfaite, mais utile.

Elle sert à provoquer une discussion : oui, ce lot est bon ; non, celui-ci est hors périmètre ; là il manque une preuve ; là le verrou est mal formulé.

## étape 4 : découper le travail en agents spécialisés

Le système marche mieux quand on évite le prompt géant.

Dans notre repo, la méthode était découpée en rôles.

| Agent | Mission |
| --- | --- |
| `linear-explorer` | Extraire les projets, issues, dates, assignees, commentaires et estimations |
| `github-explorer` | Transformer commits, PRs et changements de code en preuves datées |
| `competitive-research` | Chercher l'état de l'art, les concurrents et leurs limites |
| `synthesizer` | Fusionner Linear, GitHub, Notion, interviews et recherche web |
| `session-writer` | Transformer un lot validé en section finale |
| `archiver` | Sauvegarder preuves et versions intermédiaires |
| `interview-conductor` | Faire sortir les raisons tacites, les échecs et les arbitrages |

Ce découpage est important.

Un agent qui explore Linear ne doit pas rédiger la conclusion fiscale. Un agent qui rédige une section finale ne doit pas inventer des preuves manquantes. Un agent qui fait l'état de l'art ne doit pas décider seul de la valorisation.

Chaque rôle a une sortie attendue.

Exemple pour Linear :

```text
Pour chaque issue pertinente, extrais :
- issue id ;
- titre ;
- description ;
- assignee ;
- date de création ;
- date de complétion ;
- projet ;
- commentaires techniques ;
- estimation ou effort ;
- lien avec un lot CIR/CII potentiel.
```

Exemple pour GitHub :

```text
Pour chaque preuve pertinente, extrais :
- commit hash ;
- auteur ;
- date ;
- message ;
- fichiers modifiés ;
- PR associée ;
- résumé du changement ;
- lien avec un lot CIR/CII potentiel.
```

Vous obtenez alors un pipeline, pas un brouillon magique.

## étape 5 : construire la matrice de preuve

Avant d'écrire, forcez l'agent à remplir une matrice.

```markdown
| Lot | Qualification | Objectif | Incertitude / nouveauté | Approches testées | Échecs / limites | Résultat | Preuves disponibles | Preuves manquantes | Personnes | Période | Niveau de confiance | Questions à valider |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Lot 01 — <nom du chantier> | CIR / CII / hors périmètre / à valider | <problème à résoudre> | <pourquoi ce n'était pas trivial> | <solutions explorées> | <ce qui n'a pas marché> | <solution retenue ou apprentissage> | <tickets Linear, PR GitHub, specs, exports, métriques> | <preuves absentes ou faibles> | <personnes impliquées> | <dates ou période> | fort / moyen / faible | <points fiscal, comptable ou technique à relire> |
```

Une ligne fictive, pour montrer le niveau attendu :

```markdown
| Lot 01 — Automatisation d'un workflow métier | À valider CIR/CII | Réduire le traitement manuel d'un cas complexe | Les règles métier changent selon le contexte et les données disponibles sont hétérogènes | Règles déterministes, modèle LLM seul, orchestration règles + LLM | Le modèle seul produit des réponses instables ; les règles seules ne couvrent pas assez de cas | Workflow hybride avec garde-fous et validation humaine | Linear PROJ-123, PR #456, spec Notion "workflow v2", export métrique avril | Temps exact par personne, validation expert fiscal | Équipe produit + backend | T2 2025 | moyen | Ce lot relève-t-il du CIR, du CII, ou seulement d'une industrialisation produit ? |
```

Ce n'est pas le dossier.

C'est la table de décision.

Elle vous dit quels lots méritent une section, quels lots sont faibles, quels lots doivent sortir, et quelles validations humaines restent nécessaires.

## étape 6 : séparer CIR et CII

Ne mettez pas tout dans une grande histoire d'innovation.

Le CIR et le CII ne prouvent pas la même chose.

Pour le CIR, cherchez :

- une incertitude technique ou scientifique ;
- un état de l'art insuffisant ;
- des verrous ;
- une démarche expérimentale ;
- des échecs ;
- des résultats.

Pour le CII, cherchez :

- une nouveauté produit ;
- une différenciation marché ;
- une supériorité fonctionnelle ;
- des intégrations ;
- de l'ergonomie ;
- des usages réels.

Une bonne relance CII ressemble à ça :

```text
La partie CIR est maintenant cadrée.
Il faut compléter la partie CII.

Cherche dans Linear et Notion les tickets, projets et documents liés aux innovations produit :
- interfaces nouvelles ;
- intégrations ;
- workflows ;
- outils internes ;
- automatisations ;
- configuration self-serve ;
- différenciation marché.

Pour chaque innovation trouvée, explique :
1. ce qui est nouveau pour l'utilisateur ;
2. ce qui existait déjà sur le marché ;
3. pourquoi ce n'est pas simplement du développement standard ;
4. quelles preuves Linear, GitHub ou Notion existent ;
5. quelles questions restent à valider.

Pose des questions si une preuve manque.
```

Cette relance empêche l'agent de recycler mécaniquement les lots CIR en CII.

## étape 7 : rédiger lot par lot

Quand la matrice est validée, vous pouvez rédiger.

Mais toujours lot par lot.

```text
À partir de evidence/matrice_preuves.md, rédige un brouillon Markdown
pour le lot 01 uniquement.

Crée dossier/lots/lot-01.md.

Structure attendue :
1. objectif du lot ;
2. état de l'art ou contexte existant ;
3. verrou scientifique ou nouveauté produit ;
4. démarches testées ;
5. échecs et limites rencontrées ;
6. solution retenue ;
7. résultats ;
8. preuves citées ;
9. points à valider.

Chaque affirmation importante doit pointer vers une source.
Si une preuve manque, écris "preuve manquante" au lieu d'inventer.
```

Ensuite seulement :

```text
Transforme dossier/lots/lot-01.md en section finale.

Crée output/sections/lot-01.tex ou output/sections/lot-01.md.

Conserve la structure logique.
Retire les notes de travail.
Garde les citations ou références de sources.
N'ajoute pas de claim nouveau.
```

Le point important : la rédaction finale ne doit jamais ajouter de substance.

Elle doit seulement rendre lisible ce qui a déjà été prouvé.

## étape 8 : garder les humains aux bons endroits

L'IA peut accélérer la collecte, la structuration, la synthèse et la rédaction.

Elle ne doit pas remplacer les validations sensibles.

Gardez au minimum :

- validation fiscale CIR/CII ;
- validation comptable des montants, temps et coûts ;
- relecture technique par les personnes qui ont vraiment travaillé ;
- contrôle des données confidentielles ;
- vérification des claims trop forts ;
- liste finale des points non prouvés.

Un bon système ne cache pas les incertitudes.

Il les rend visibles assez tôt pour qu'on puisse les traiter.

## ce que vous devez ressentir à la fin

À la fin, vous ne devriez pas avoir seulement un PDF.

Vous devriez avoir un graphe de preuves.

Vous devriez pouvoir dire : cette phrase vient de ce ticket, ce commit, cette spec, cette métrique, cet export, cette validation.

Et là, le vrai déclic arrive.

On se rend compte que le CIR n'était pas un exercice de rédaction. C'était un problème de mémoire d'entreprise.

Les preuves existaient déjà. Elles étaient juste dispersées.

La réaction qu'on cherche à provoquer est simple :

```text
On a laissé notre CIR se faire à la main, alors que tout était déjà dans nos outils.
```

Une fois qu'on voit ça, on ne revient pas en arrière.

## ce que The Vibe Company peut faire pour vous

Chez The Vibe Company, on aide les entreprises à construire ce type de système.

Pas un prompt magique.

Un vrai atelier de preuve : connexions aux outils, extraction des traces, matrice CIR/CII, rédaction contrôlée, garde-fous humains, et livrable final propre.

L'objectif n'est pas seulement de gagner quelques jours sur un dossier.

L'objectif est de transformer ce que votre entreprise sait déjà en dossiers, audits, rapports, due diligence, documents de conformité et livrables qui tiennent debout.

Si ce sujet vous parle, on peut vous aider à faire la même chose chez vous.

## note importante

Cette méthode ne remplace pas un expert fiscal, un expert-comptable ou un conseil juridique.

Elle sert à arriver devant eux avec un dossier mieux préparé, mieux sourcé, plus honnête, et beaucoup plus facile à valider.

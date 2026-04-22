---
title: "Le CIR ne s'écrit pas. Il se compile."
slug: le-cir-ne-secrit-pas-il-se-compile
summary: "On a automatisé la création d'un dossier CIR/CII de 100 pages. Pas en demandant à une IA d'inventer un rapport, mais en construisant une chaîne qui transforme Linear, GitHub, Notion et les exports internes en preuves vérifiables."
publishedAt: 2026-04-22
complexity: advanced
topics: AI Operations, Research Tax Credit, Agent Workflows
coverImage: /images/resources/le-cir-ne-secrit-pas-il-se-compile/cover-proof-compiler.svg
coverAlt: "Evidence compiler turning operational traces into a structured CIR/CII dossier"
---

Un soir de février, j'ai relu un premier draft de notre dossier CIR.

Il était propre.

Trop propre.

De longues phrases. Des sections bien rangées. Le ton d'un rapport qui essaie de sonner sérieux.

Le problème, c'est qu'un dossier CIR ne doit pas sonner sérieux.

Il doit être défendable.

J'ai construit Quivr, YC W24, un produit RAG open-source. Je ne découvrais pas le sujet depuis un slide. On avait vraiment fait le travail : évaluation automatique, workflows, prédiction de confiance, intégrations, automatisation du support, des mois d'itérations.

Et pourtant, le premier document généré avec de l'IA n'était pas concluant.

C'est là que j'ai compris le vrai sujet.

Le problème n'était pas d'écrire le dossier.

Le problème était de reconstruire la preuve.

![Une chaîne de preuve transforme les outils de travail en dossier CIR/CII](/images/resources/le-cir-ne-secrit-pas-il-se-compile/evidence-pipeline.svg "Le PDF arrive à la fin. Le vrai système est la chaîne de preuve.")

## le mauvais prompt

Le mauvais prompt ressemble à ça :

> Écris-moi un dossier CIR sur notre R&D.

Ça donne souvent quelque chose de fluide.

Et c'est précisément le piège.

Le texte paraît cohérent, mais il ne sait pas d'où viennent ses affirmations. Il mélange le produit, la recherche, la mémoire du fondateur, le marketing, deux souvenirs de réunion et trois intuitions jamais vérifiées.

Pour un article de blog, ça peut passer.

Pour un dossier CIR/CII, c'est mort.

Un dossier de recherche ne vaut pas par son style. Il vaut par sa capacité à répondre à une question simple :

si quelqu'un conteste cette phrase dans six mois, où est la preuve ?

Cette question a changé toute la méthode.

On a arrêté de demander à l'IA de rédiger.

On lui a donné un autre rôle : compiler.

## le repo atelier

On a créé un repo interne pour le dossier.

Pas un document.

Un atelier.

Il y avait un dossier `context/` pour l'historique, les anciens dossiers, les notes de cadrage.

Un dossier `dossier/` pour les explorations intermédiaires : Linear, GitHub, Notion, état de l'art, valorisation, lots candidats.

Un dossier `latex_output/sections/` pour les sections finales.

Un `TODO.md` pour les inconnues.

Et surtout, des instructions très simples pour l'agent :

```text
N'invente jamais rien.
Pose des questions.
Découpe en sous-tâches.
Travaille par section.
```

Ce n'est pas spectaculaire, mais c'est la différence entre un agent qui hallucine 100 pages et un agent qui converge.

Le repo forçait une discipline.

Avant d'écrire une section finale, il fallait passer par les sources. Avant de faire une conclusion, il fallait classer les preuves. Avant de raconter une innovation, il fallait retrouver le ticket, le commit, la spec ou la métrique.

Le PDF était la dernière étape.

Pas le centre du système.

## les sources

La vraie matière était déjà dans l'entreprise.

Elle était juste éparpillée.

Linear disait ce qu'on avait voulu construire : projets, tickets, statuts, dates, personnes, chronologie.

GitHub disait ce qui avait vraiment changé : commits, PRs, fichiers, releases, auteurs.

Notion disait pourquoi on avait pris certaines décisions : specs, ADR, benchmarks, notes d'expérimentation.

Les exports tableurs donnaient les périodes, les temps, la valorisation.

L'état de l'art donnait le contexte : pourquoi le problème n'était pas trivial, quelles solutions existaient, où elles s'arrêtaient.

Et les traces produit donnaient le réel : pas une R&D abstraite dans un laboratoire imaginaire, mais des contraintes d'intégration, de latence, de workflows et de qualité.

Chaque source avait un rôle.

Linear donne l'intention.

GitHub donne l'exécution.

Notion donne la raison.

Les exports donnent le coût.

Les métriques donnent le résultat.

Quand les sources se recoupent, le dossier devient solide.

## la matrice de preuve

La pièce centrale n'était pas le rapport de 100 pages.

C'était la matrice de preuve.

Pour chaque lot, on voulait pouvoir répondre à dix questions :

```text
Quel était l'objectif technique ?
Quel verrou ou quelle nouveauté justifiait le travail ?
Quelles approches ont été testées ?
Qu'est-ce qui a échoué ?
Quelle solution a été retenue ?
Où sont les preuves dans Linear ?
Où sont les preuves dans GitHub ?
Où sont les specs ou décisions dans Notion ?
Qui a travaillé dessus ?
Quelle partie relève du CIR, quelle partie relève du CII ?
```

Cette grille fait mal, mais elle nettoie tout.

Elle empêche de transformer une feature pratique en "innovation" juste parce qu'elle a pris du temps.

Elle empêche aussi de cacher les échecs.

Et dans un dossier CIR, les échecs sont souvent la meilleure preuve.

Si vous avez testé trois approches standard et qu'elles n'ont pas marché, ce n'est pas un détail embarrassant. C'est exactement ce qui montre qu'il y avait une incertitude technique.

Le dossier devient plus fort quand il arrête de faire semblant que tout était évident depuis le début.

## cir et cii ne racontent pas la même histoire

Un autre problème classique : tout mélanger.

Le CIR et le CII ne demandent pas la même preuve.

Le CIR demande une incertitude scientifique ou technique : état de l'art insuffisant, verrou, expérimentation, échecs, résultat.

Le CII demande une nouveauté produit : différenciation marché, usage, ergonomie, intégration, industrialisation.

Sur un même projet, les deux peuvent coexister.

La recherche peut porter sur l'évaluation automatique d'une réponse, la prédiction de confiance ou l'orchestration de workflows complexes.

L'innovation produit peut porter sur l'interface, le self-serve, les connecteurs, le routing par intent, la façon dont le système devient utilisable par une équipe métier.

Mais si on ne sépare pas les deux, tout devient flou.

Et un dossier flou est un dossier faible.

## ce que les agents ont vraiment fait

Les agents n'ont pas "fait le CIR".

Cette phrase serait fausse.

Ils ont fait quelque chose de plus intéressant.

Ils ont exploré des centaines de traces, relié des tickets à des PRs, transformé des specs en décisions, extrait les thèmes R&D, repéré les trous, puis compilé des sections qui restaient vérifiables.

Ils étaient bons sur les tâches de lecture large :

```text
Trouve les projets R&D dans Linear.
Relie ces tickets aux changements GitHub.
Classe les preuves par lot.
Liste les affirmations non sourcées.
Réécris cette section sans perdre les références.
```

Les humains ont gardé les arbitrages :

```text
Est-ce vraiment du CIR ?
Est-ce plutôt du CII ?
Est-ce que le temps est correct ?
Est-ce qu'on peut publier cette information ?
Est-ce qu'un expert fiscal validerait ce raisonnement ?
```

C'est ce couplage qui marche.

L'IA seule produit un texte.

L'IA branchée aux preuves, avec des humains aux points de décision, produit un dossier.

## la méthode que je referais demain

Si je devais refaire ce travail pour une autre boîte, je ne commencerais pas par un document.

Je commencerais par un repo.

Structure minimale :

```text
cir-cii/
  AGENTS.md
  TODO.md
  context/
  sources/
  dossier/
  latex_output/sections/
```

Ensuite, je brancherais les sources :

```text
Linear      tickets, projets, chronologie
GitHub      commits, PRs, releases
Notion      specs, ADR, decisions
Exports     temps, coûts, assignations
Dashboards  métriques, qualité, résultats
Interviews  raisons tacites, échecs, arbitrages
```

Puis je forcerais cet ordre :

```text
sources brutes
extraction
matrice de preuve
qualification CIR/CII
draft markdown
section finale
validation humaine
PDF
```

Jamais l'inverse.

Le document final arrive tard.

Très tard.

Avant ça, on construit la capacité à justifier chaque phrase.

## ce que ça dit sur les agents

Ce projet m'a fait changer d'avis sur une partie des agents.

Je ne crois pas beaucoup aux agents qui "font de la stratégie" depuis une page blanche.

Je crois beaucoup aux agents qui opèrent dans un environnement riche : fichiers, tickets, commits, specs, exports, métriques, contraintes, validations.

La plupart des fonctions internes ont ce problème.

Finance.

Juridique.

R&D.

Conformité.

Reporting.

Audit.

Dans toutes ces fonctions, les preuves existent déjà. Elles sont juste dispersées dans les outils de travail.

Le boulot n'est pas d'inventer.

Le boulot est de retrouver, classer, relier, vérifier, puis rédiger.

C'est moins magique.

C'est beaucoup plus utile.

## la prise

On n'a pas automatisé notre dossier CIR/CII en demandant à une IA d'écrire 100 pages.

On a automatisé la chaîne qui transforme les traces réelles d'une entreprise en preuve structurée.

C'est plus dur.

Et c'est exactement pour ça que ça vaut quelque chose.

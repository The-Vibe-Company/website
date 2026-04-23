---
title: "Comment on a écrit notre CIR pour récupérer 150 000 euros grâce à l'IA"
slug: comment-on-a-ecrit-notre-cir-pour-recuperer-150-000-euros-grace-a-lia
summary: "Comment on a transformé Linear, GitHub, Notion, Google Drive et nos exports internes en dossier CIR/CII de 100 pages. Pas avec un prompt magique, mais avec une vraie chaîne de preuve."
publishedAt: 2026-04-22
complexity: advanced
topics: AI Operations, Research Tax Credit, Agent Workflows
coverImage: /images/resources/le-cir-ne-secrit-pas-il-se-compile/cover-proof-compiler.svg
coverAlt: "Une chaîne d'IA transforme les traces de travail en dossier CIR/CII documenté"
ogImage: /images/resources/le-cir-ne-secrit-pas-il-se-compile/cover-proof-compiler.png
---

Le CIR, c'est un sujet assez bête au fond : le travail a déjà été fait, mais il faut réussir à le prouver.

Dans notre cas, il y avait environ 150 000 euros à récupérer. Donc on ne pouvait pas se contenter d'un joli document écrit à la va-vite avec ChatGPT. À ce niveau, un dossier faible ne coûte pas seulement du temps. Il peut coûter toute la créance.

Il fallait un dossier qui tienne debout : les bons lots, les bonnes dates, les bonnes personnes, les bons tickets, les bons commits, et une explication claire de ce qui relevait du CIR ou du CII.

On partait avec un avantage : Quivr, YC W24, était un produit RAG open-source utilisé par de vraies équipes. La matière existait déjà. Il y avait des mois de tickets Linear, des PRs GitHub, des specs Notion, des exports, des documents Drive, des traces clients, des décisions d'architecture.

Le problème, c'est que rien de tout ça ne ressemble spontanément à un dossier fiscal.

Ce qu'on a fait avec l'IA, ce n'est pas "écris notre CIR". Ce qu'on a fait, c'est brancher des agents aux traces réelles de l'entreprise pour reconstruire la preuve.

![Une chaîne de preuve transforme les outils de travail en dossier CIR/CII](/images/resources/le-cir-ne-secrit-pas-il-se-compile/evidence-pipeline.svg "Le PDF arrive à la fin. Le vrai système est la chaîne de preuve.")

## le mauvais usage de l'IA

Le mauvais prompt, c'est :

> Écris notre dossier CIR sur notre R&D.

Ça produit souvent un texte propre. Trop propre. Le modèle raconte une histoire cohérente, mais on ne sait pas vraiment d'où viennent les phrases.

Pour un post de blog, ce n'est pas très grave. Pour un dossier CIR/CII, c'est le problème central. Si quelqu'un lit une phrase dans six mois et demande "où est la preuve ?", il faut pouvoir répondre autre chose que "l'IA l'a formulé comme ça".

Donc on a inversé le rôle de l'IA.

Elle n'était pas là pour inventer le récit. Elle était là pour retrouver les pièces.

## ce qu'on a branché

La vraie valeur du système venait des accès. Pas d'un prompt magique.

On a connecté les agents aux endroits où le travail avait vraiment vécu :

| Source | Ce que ça apportait |
| --- | --- |
| Linear / API / MCP | les projets, les tickets, les statuts, les dates, les personnes |
| GitHub | les PRs, les commits, les fichiers modifiés, la réalité du code |
| Notion | les specs, les décisions, les notes de cadrage, les arbitrages |
| Google Drive / Sheets | les exports, les documents, les temps, les fichiers partagés |
| Traces produit et clients | les contraintes réelles, les intégrations, les usages |

Chaque outil disait un truc différent.

Linear disait ce qu'on avait essayé de construire. GitHub disait ce qui avait vraiment changé. Notion expliquait pourquoi certaines décisions avaient été prises. Les exports donnaient les périodes et les coûts. Drive ramenait les pièces qu'on oublie presque toujours quand on écrit un dossier à la main.

Et quand plusieurs sources racontent la même chose, là ça devient intéressant. Ce n'est plus une affirmation. C'est une preuve qui se recoupe.

## le repo était la machine

On a mis tout ça dans un repo dédié. Pas dans un Google Doc géant. Pas dans une conversation ChatGPT qui finit par partir dans tous les sens.

Le repo avait une structure simple :

```text
cir-cii/
  context/
  dossier/
  latex_output/
  TODO.md
  AGENTS.md
```

`context/` gardait les éléments de départ. `dossier/` contenait les explorations : Linear, GitHub, état de l'art, lots candidats, valorisation. `latex_output/` servait uniquement pour les sections prêtes à partir dans le document final. `TODO.md` listait les trous.

C'est bête, mais ça change tout.

L'agent avait des consignes claires : ne jamais inventer, poser des questions quand il manque une info, travailler par section, garder les sources, signaler les affirmations faibles. En gros : aider, mais ne jamais faire semblant de savoir.

## le coeur du truc : la matrice de preuve

Le document de 100 pages n'était pas le coeur du système. Le coeur, c'était une matrice de preuve.

Pour chaque lot, on voulait remplir la même grille :

- quel était l'objectif ;
- quel était le verrou technique ou la nouveauté produit ;
- quelles approches ont été testées ;
- ce qui a échoué ;
- ce qui a été gardé ;
- où sont les preuves dans Linear, GitHub, Notion ou Drive ;
- qui a travaillé dessus ;
- quelle partie relève du CIR, quelle partie relève du CII.

Cette grille est chiante. Mais elle nettoie tout.

Elle empêche de prendre une feature longue à développer et de l'appeler "R&D" juste parce qu'elle a coûté cher. Elle oblige aussi à parler des échecs. Et dans un dossier CIR, les échecs sont souvent de très bonnes preuves, parce qu'ils montrent que le problème n'était pas trivial.

## un exemple concret

Un des lots portait sur l'autosend : comment savoir, avant même de générer une réponse, si un ticket support peut être traité automatiquement sans prendre un risque absurde.

Dit comme ça, ça ressemble à une feature produit.

Mais quand on reconstruit la preuve, on voit autre chose. Linear montrait le besoin opérationnel : automatiser seulement les zones stables. Notion gardait les hypothèses et les essais : embeddings, transformers, modèles decoder-only, puis feature engineering. GitHub montrait les changements réels. Et les résultats montraient pourquoi on avait fini par converger vers une approche plus classique, type XGBoost, avec un objectif de précision plus adapté au support.

Dans le dossier, ce lot ne devient pas "on a fait de l'IA pour le support". Il devient : comment prédire ex ante la fiabilité d'une réponse LLM dans des contextes clients hétérogènes, avec assez de confiance pour automatiser seulement certains segments.

C'est ça la différence entre raconter une innovation et documenter une incertitude technique.

## là où les agents ont été forts

Dans notre extraction, les agents ont passé en revue des dizaines de projets Linear. On avait une base avec environ 70 projets analysés, des tickets CII déjà classés, d'autres tickets à requalifier, et toute la matière GitHub / Notion à remettre en face.

C'est exactement le genre de boulot où un humain se fatigue vite.

L'agent, lui, peut faire les passes larges :

- retrouver les projets liés à la R&D ;
- relier un ticket Linear à une PR GitHub ;
- extraire les décisions importantes d'une spec ;
- classer les lots par thème ;
- repérer les phrases non sourcées ;
- dire "là, il manque une preuve".

Par contre, l'agent ne décide pas à notre place.

La qualification finale reste humaine. Est-ce vraiment du CIR ? Plutôt du CII ? Est-ce que le raisonnement est défendable ? Est-ce qu'on peut exposer ce détail ? Est-ce que le temps valorisé est cohérent ? C'est là qu'on doit garder la main.

## la séparation CIR / CII

Un point qui a beaucoup aidé : on a arrêté de dire "innovation" partout.

Le CIR et le CII ne racontent pas la même histoire. Le CIR parle d'incertitude technique : état de l'art insuffisant, verrou, expérimentation, échecs, résultat. Le CII parle davantage de nouveauté produit : usage, différenciation, ergonomie, intégration, mise sur le marché.

Sur Quivr, les deux existaient. Par exemple, certains sujets touchaient à l'évaluation automatique des réponses, à la prédiction de confiance, à l'orchestration de workflows complexes ou à la fiabilité d'un système RAG en contexte réel. D'autres sujets étaient plus proches du produit : self-serve, connecteurs, interface admin, routing par intention, intégrations clients.

Tout mettre dans le même sac aurait affaibli le dossier. Le fait de séparer les lots a rendu le document beaucoup plus clair.

## la méthode qu'on referait

Si on devait refaire ça demain pour une autre boîte, on suivrait exactement cet ordre :

1. Créer un repo dédié au dossier.
2. Brancher Linear/Jira, GitHub/GitLab, Notion/Confluence, Drive/Sheets et les exports internes.
3. Demander aux agents d'extraire les traces, pas de rédiger.
4. Construire une matrice de preuve par lot.
5. Qualifier humainement CIR, CII ou hors scope.
6. Rédiger seulement à la fin, avec les sources sous les yeux.

Le point important, c'est l'ordre. Si on rédige d'abord, on fait du storytelling. Si on extrait d'abord, on construit un dossier.

Le résultat, chez nous, c'est un dossier d'environ 100 pages. Pas parce que l'IA a rempli du vide, mais parce qu'elle a aidé à remettre en ordre une année de travail réel.

## ce que ça nous a appris

Les agents utiles en entreprise ne sont pas ceux qui écrivent des pavés depuis une page blanche. Ce sont ceux qui travaillent dans un environnement riche : accès aux outils, sources fiables, consignes strictes, structure de repo, et humains aux endroits où il faut juger.

Dans le CIR/CII, comme dans beaucoup de sujets finance, juridique, audit ou conformité, les preuves existent déjà. Elles sont juste dispersées.

Ces 150 000 euros ne dépendaient pas d'une belle formulation. Ils dépendaient de notre capacité à transformer une année de travail dispersé en preuve défendable.

Ce n'est pas l'IA qui a inventé le dossier. Le travail existait déjà. Les preuves existaient déjà.

Ce qu'on a construit, c'est la machine qui les rend lisibles.

C'est moins spectaculaire qu'une démo où l'IA génère cent pages en une minute. Mais c'est beaucoup plus proche de là où les agents vont vraiment créer de la valeur : transformer le travail réel en livrables qu'on peut assumer.

Si ce sujet vous parle, on peut vous aider à faire la même chose chez vous. C'est exactement ce qu'on construit chez The Vibe Company : des systèmes d'agents branchés aux vrais outils de l'entreprise, capables de transformer les traces de travail en dossiers, audits, rapports et livrables qui tiennent debout.

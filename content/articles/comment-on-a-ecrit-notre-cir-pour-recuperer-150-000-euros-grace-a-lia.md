---
title: "Comment on a écrit notre CIR pour récupérer 150 000 euros grâce à l'IA"
slug: comment-on-a-ecrit-notre-cir-pour-recuperer-150-000-euros-grace-a-lia
summary: "Retour d'expérience sur la manière dont on a automatisé la production d'un dossier CIR/CII de 100 pages, non pas en demandant à une IA d'inventer un rapport, mais en la branchant aux preuves réelles de l'entreprise : Linear, GitHub, Notion, exports et documents internes."
publishedAt: 2026-04-22
complexity: advanced
topics: AI Operations, Research Tax Credit, Agent Workflows
coverImage: /images/resources/le-cir-ne-secrit-pas-il-se-compile/cover-proof-compiler.svg
coverAlt: "Une chaîne d'IA transforme les traces de travail en dossier CIR/CII documenté"
---

Quand on a commencé à préparer notre dossier CIR/CII, l'enjeu n'était pas théorique : il y avait environ 150 000 euros à récupérer, et donc un vrai besoin de produire un dossier sérieux. Pas un document joli, pas une histoire réécrite après coup, pas un rapport qui sonne "innovation" parce qu'il utilise les bons mots. Un dossier CIR ou CII doit tenir devant quelqu'un qui pose des questions précises : qu'est-ce qui a été tenté, pourquoi ce n'était pas évident, qui a travaillé dessus, où sont les preuves, et comment on distingue la R&D de la simple feature produit.

Le premier réflexe avec l'IA aurait été de lui demander d'écrire le dossier. C'est exactement le mauvais usage. Un modèle peut produire vingt pages très propres sur "les verrous techniques d'un système RAG", mais si les affirmations ne sont pas reliées à des tickets, des commits, des specs, des tests ou des décisions, le texte ne vaut pas grand-chose. Ce qui a marché pour nous, c'est d'arrêter de traiter l'IA comme un rédacteur fiscal et de la traiter comme un compilateur de preuves.

J'ai construit Quivr, YC W24, un produit RAG open-source utilisé par de vraies équipes. On avait donc une matière riche : des mois d'itérations, des workflows, des évaluations automatiques, des connecteurs, de la prédiction de confiance, des systèmes d'automatisation du support, des choix d'architecture et beaucoup de travail qui ne rentre pas proprement dans une brochure marketing. Le sujet n'était pas de rendre tout ça plus impressionnant. Le sujet était de reconstituer proprement ce qui s'était passé, avec assez de détails pour que le dossier soit défendable.

![Une chaîne de preuve transforme les outils de travail en dossier CIR/CII](/images/resources/le-cir-ne-secrit-pas-il-se-compile/evidence-pipeline.svg "Le PDF arrive à la fin. Le vrai système est la chaîne de preuve.")

## partir des traces, pas du récit

La vraie différence entre un dossier faible et un dossier solide, c'est l'ordre dans lequel on travaille. Si on commence par le récit, on finit presque toujours par chercher des preuves après coup pour justifier ce qu'on a déjà écrit. C'est confortable, mais dangereux, parce que le texte prend le dessus sur la réalité opérationnelle.

On a donc fait l'inverse. On est partis des traces laissées par l'entreprise pendant l'année : Linear pour les projets, tickets, statuts, dates et personnes ; GitHub pour les commits, PRs, fichiers modifiés et releases ; Notion pour les specs, décisions, benchmarks et notes de travail ; les exports et tableurs pour les périodes, temps, coûts et assignations ; et les documents internes pour tout ce qui vivait dans les dossiers partagés. Quand des informations passaient par Google Sheets ou Drive, elles étaient traitées comme des sources à part entière, pas comme de simples pièces jointes qu'on regarderait à la fin.

Chaque outil racontait une partie différente de la vérité. Linear disait ce qu'on voulait construire et dans quel ordre. GitHub montrait ce qui avait réellement été implémenté. Notion expliquait pourquoi certaines décisions avaient été prises. Les exports donnaient la partie financière et temporelle. Les métriques produit montraient ce qui avait changé dans le système réel. À partir du moment où ces sources se recoupaient, le dossier commençait à devenir solide.

## le repo était l'atelier

On a créé un repo dédié au dossier, parce qu'un travail comme celui-là ne doit pas vivre dans un Google Doc géant. Le repo contenait les instructions de l'agent, les sources, les explorations intermédiaires, les sections finales, les tâches ouvertes et les exports LaTeX. Cette structure paraît simple, mais elle a joué un rôle énorme : elle a transformé une rédaction floue en pipeline de production.

Le dossier `context/` servait à stocker l'historique, les anciens éléments, les notes de cadrage et les documents de référence. Le dossier `dossier/` accueillait les analyses intermédiaires : extraction Linear, exploration GitHub, état de l'art, qualification CIR/CII, valorisation et lots candidats. Le dossier `latex_output/sections/` recevait uniquement les sections prêtes à entrer dans le document final. Et le `TODO.md` forçait à lister les trous au lieu de les masquer dans une belle formulation.

Les instructions données à l'agent étaient volontairement strictes : ne jamais inventer, poser des questions quand une information manque, découper le travail par section, garder les sources visibles et signaler les affirmations non vérifiées. Ce n'est pas spectaculaire, mais c'est exactement ce qui évite le problème classique des dossiers générés par IA : un texte fluide, crédible en surface, mais impossible à auditer.

## ce que l'IA faisait vraiment

L'IA n'a pas "fait le CIR" à notre place. Cette phrase serait à la fois fausse et dangereuse. Elle a fait une partie beaucoup plus utile : lire large, classer vite, relier des traces entre elles et produire des versions de travail que l'on pouvait vérifier.

Concrètement, les agents servaient à explorer les projets Linear, identifier les tickets liés à de la R&D ou à de l'innovation, rapprocher ces tickets des changements GitHub, extraire les décisions importantes depuis Notion, regrouper les preuves par lot, repérer les zones non sourcées et reformuler les sections sans perdre la traçabilité. C'est là que l'IA est très forte : elle peut parcourir une grande quantité de matière opérationnelle et construire une première carte du terrain beaucoup plus vite qu'un humain.

Les humains gardaient les arbitrages importants. Est-ce vraiment du CIR ou plutôt du CII ? Est-ce une incertitude technique ou seulement une difficulté d'implémentation ? Est-ce que le temps valorisé est cohérent ? Est-ce qu'on peut exposer ce détail dans un dossier ? Est-ce qu'un expert fiscal comprendrait la logique ? L'automatisation ne remplace pas ce jugement ; elle lui donne une base beaucoup plus complète.

## la matrice de preuve

La pièce centrale du système n'était pas le rapport de 100 pages. C'était la matrice de preuve. Pour chaque lot de travail, on voulait être capables de répondre aux mêmes questions, toujours dans le même ordre : objectif technique, verrou ou nouveauté, approches testées, échecs, solution retenue, preuves Linear, preuves GitHub, specs Notion, personnes impliquées, période, valorisation, qualification CIR ou CII.

Cette matrice a eu deux effets. D'abord, elle a empêché de transformer une feature longue à développer en "innovation" juste parce qu'elle avait coûté cher. Ensuite, elle a rendu les échecs visibles. Dans un dossier CIR, les échecs sont souvent très importants, parce qu'ils montrent qu'il existait une vraie incertitude technique. Si vous avez testé plusieurs approches standard et qu'elles n'ont pas marché, ce n'est pas une faiblesse du dossier ; c'est souvent le coeur de la preuve.

La matrice servait aussi à repérer les trous. Un lot pouvait être techniquement intéressant mais manquer de commits identifiables, de dates ou de justification produit. Dans ce cas, l'agent ne devait pas broder. Il devait signaler le problème, demander une source complémentaire, ou faire descendre le niveau de confiance. C'est cette discipline qui a permis de produire un dossier long sans perdre le lien avec les faits.

## séparer CIR et CII

Une autre raison pour laquelle le dossier a marché : on a séparé le CIR et le CII au lieu de tout raconter dans un même bloc "innovation". Le CIR et le CII ne demandent pas exactement la même preuve. Le CIR cherche une incertitude scientifique ou technique : état de l'art insuffisant, verrou, expérimentation, échecs, résultat. Le CII cherche plutôt une nouveauté produit : usage, différenciation, ergonomie, intégration, industrialisation, mise sur le marché.

Sur un produit comme Quivr, les deux dimensions peuvent coexister. La recherche peut porter sur l'évaluation automatique des réponses, la prédiction de confiance, l'orchestration de workflows complexes ou la façon de rendre un système RAG fiable dans des contextes réels. L'innovation produit peut porter sur les interfaces, le self-serve, les connecteurs, le routing par intention, l'expérience admin ou l'intégration dans les outils clients.

Le piège serait de tout mélanger parce que tout appartient au même produit. En pratique, il faut isoler les lots. Certains relèvent plutôt d'une incertitude technique. D'autres relèvent plutôt d'une nouveauté fonctionnelle ou d'une amélioration d'usage. D'autres encore ne doivent pas être retenus. L'IA aide beaucoup à préparer cette séparation, mais la qualification finale doit rester humaine.

## pourquoi ça a produit un dossier de 100 pages

Le dossier final faisait environ 100 pages parce qu'il ne partait pas d'une page blanche. Il partait d'un graphe de preuves. Chaque section pouvait être reliée à des éléments concrets : tickets, PRs, specs, décisions, exports, chronologie et personnes. Le volume n'était pas créé par du remplissage, mais par la densité réelle du travail effectué pendant l'année.

La méthode change aussi la manière d'écrire. Au lieu de dire "nous avons développé une architecture innovante", on peut expliquer quel problème existait, pourquoi les solutions disponibles ne suffisaient pas, quelles approches ont été testées, ce qui a échoué, ce qui a été retenu et où se trouvent les traces. Le style devient moins marketing, mais beaucoup plus crédible.

C'est précisément ce qui rend le dossier défendable. Une belle phrase ne protège pas une entreprise. Une chaîne de preuve, oui. Et l'IA devient utile quand elle sert cette chaîne, pas quand elle essaie de produire seule le document final.

## comment le refaire

Si je devais refaire ce travail pour une autre entreprise, je ne commencerais pas par ouvrir un document. Je commencerais par créer un espace de travail dédié, idéalement un repo, avec des règles explicites pour les agents et une structure qui sépare les sources brutes, les analyses intermédiaires et les sections finales. Ensuite, je brancherais les outils qui contiennent déjà la mémoire de l'entreprise : Linear ou Jira, GitHub ou GitLab, Notion ou Confluence, Google Drive, exports RH/temps, tableurs financiers, dashboards produit et notes d'entretien.

La séquence importante est toujours la même : rassembler les sources, extraire les traces, construire la matrice de preuve, qualifier les lots CIR/CII, rédiger les sections, faire valider par un humain, puis seulement produire le PDF. Si on inverse cet ordre, l'IA devient un générateur de storytelling. Si on respecte cet ordre, elle devient un outil de reconstruction documentaire.

Ce projet m'a surtout appris une chose : les agents les plus utiles ne sont pas ceux qui "réfléchissent" dans le vide. Ce sont ceux qui opèrent dans un environnement riche, avec des droits d'accès, des sources fiables, des consignes strictes et des humains aux points de décision. Dans beaucoup de fonctions internes, finance, juridique, conformité, R&D, audit, le problème est le même : les preuves existent déjà, mais elles sont dispersées dans les outils de travail.

On n'a donc pas récupéré 150 000 euros grâce à un prompt magique. On a construit une chaîne qui transforme les traces réelles d'une entreprise en dossier défendable. C'est moins spectaculaire qu'une démo d'IA qui écrit cent pages en une minute, mais c'est infiniment plus utile. Et c'est probablement là que se trouve la vraie valeur des agents dans les entreprises : pas dans l'invention, mais dans la capacité à retrouver, relier, vérifier et produire un livrable qu'un humain peut assumer.

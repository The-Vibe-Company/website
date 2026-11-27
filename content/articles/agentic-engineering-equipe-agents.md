---
title: "Agentic engineering : ma méthode pour piloter 5 à 25 agents"
seoTitle: "Agentic engineering : ma méthode pour piloter 5 à 25 agents"
seoDescription: "Agentic engineering pas à pas : Grill Me, Skillpack, Armada, Open Board et Captain pour piloter 5 à 25 agents. Exemples réels, chiffres git et limites."
slug: agentic-engineering-equipe-agents
translationKey: agentic-engineering-agent-fleet
language: fr
summary: "Ma méthode d'agentic engineering en six étapes reproductibles, ce qu'elle a donné sur Armada, Quivr et Open Board, les problèmes qui ont fait naître chaque brique, puis ses limites."
publishedAt: 2026-11-27
complexity: intermediate
topics: Agentic Engineering, AI Agents, Claude Code, Armada
author: stan-girard
coverImage: /images/resources/agentic-engineering-equipe-agents/cover.webp
coverAlt: "La mascotte The Vibe Company, sur un quai au coucher du soleil, montre du doigt une flotte de petits voiliers"
ogImage: /images/resources/agentic-engineering-equipe-agents/cover.webp
---

L'agentic engineering est une façon de produire du logiciel : un humain fixe l'objectif, des agents de code livrent les pull requests. Chez moi, il se reproduit en six étapes, des questions en amont jusqu'à l'orchestrateur. Sur le repo public d'Armada, le rythme est passé de 7,9 à 110,5 commits par jour sur `main`.

Rien d'automatique là-dedans. « C'est pas automatique, il y a quand même moi derrière, je lui donne un objectif. »

Voici la méthode étape par étape, ce qu'elle a donné sur trois projets, les problèmes qui ont fait naître chaque brique, puis ses limites. L'orchestrateur s'appelle Captain, un skill de la bibliothèque Skillpack de The Vibe Company. Les étapes 1 à 4 reposent sur des outils publics. Captain, à l'étape 5, n'est pas public : ses règles principales et les garde-fous de l'étape 6 sont décrits ici, pour que vous les repreniez dans votre propre coordinateur.

*Mis à jour le 27 novembre 2026. J'ai compté les commits le 27 novembre 2026 sur des repos publics et décrit Captain dans sa version 0.2.0.*

## Qu'est-ce que l'agentic engineering, dans ma méthode ?

Dans ma méthode, l'agentic engineering tient en six étapes : des questions en amont, des skills, une sandbox par ticket, un tableau qui ancre l'objectif, un orchestrateur, et un humain qui fixe le cap. Entre l'humain et les agents, l'orchestrateur répartit le travail.

« Software factory » est mon mot pour l'ensemble. « Mon dernier skill […] s'appelle Captain, et c'est la méthode que j'utilise pour faire ma software factory, enfin une partie de la méthode. » Le mot « factory » trompe un peu, car il évoque une chaîne qui tourne seule. Une [software factory IA](/fr/resources/articles/software-factory-ia-tests-rapides) commence d'ailleurs par des tests rapides.

Mon temps passe en amont. Je ne lis plus les plans des agents. Je réponds aux questions qui fixent l'objectif, et le reste de la chaîne s'appuie sur ces réponses.

## Quelles étapes suivre pour reproduire la méthode ?

Six étapes, dans cet ordre. Chacune répond à un problème rencontré, raconté plus bas.

### 1. Faire griller l'objectif avant le premier ticket

[Grill Me](https://github.com/mattpocock/skills) est un skill de Matt Pocock. Il interroge par séries de questions, jusqu'à ce qu'aucune décision ne reste implicite. Pour la V2 de Quivr, j'ai répondu à environ 200 questions. Un autre skill de Matt Pocock a ensuite transformé ces réponses en tickets.

« Le concept de se poser plein de questions en amont est hyper important, parce que quand l'IA fait une version 2 meilleure, elle peut partir dans tous les sens si tu ne contrôles pas. »

Captain reprend ce principe dans son mode `plan`. Il tranche les décisions avec le skill `grilling`, puis publie un DAG de tâches atomiques : un graphe où chaque tâche déclare ses prérequis avec `needs`. Chaque tâche liste aussi les chemins qu'elle a le droit d'écrire.

### 2. Donner des skills aux agents

[Skillpack](/fr/portfolio/skillpack) permet aux agents d'utiliser beaucoup de skills. Son CLI, présenté sur [skillpack.app](https://skillpack.app), installe et publie des skills d'agents portables. Captain en est un. Il dépend de deux autres, `grilling` et `ship-pr-dev`.

### 3. Lancer une sandbox équipée par ticket

« Armada permet d'avoir des sandbox. Dans les sandbox, tu peux connecter des MCP, ajouter des variables d'environnement, pré-installer des CLI. » Le code d'[Armada est public sur GitHub](https://github.com/The-Vibe-Company/armada), sous licence MIT.

La préparation passe par un snapshot. Selon le README, sa construction clone les repos et exécute un script `--setup` optionnel. Les commandes `--init`, elles, tournent à chaque lancement, après le pull. Un agent part ensuite avec `armada new <snapshot> --provider boat|modal --agent claude|codex`, et `--connections` branche les MCP. Les variables et les secrets se gèrent dans le dashboard ou par l'API du coffre.

La règle de Captain : une sandbox = un ticket = une PR, arrêtée dès le merge. Selon le skill, réutiliser une sandbox d'un ticket à l'autre laisse fuir un état git périmé et des caches de build. Ces machines préparées font partie de l'[agent harness](/fr/resources/articles/agent-harness-entreprise), l'équipement autour du modèle.

### 4. Ancrer l'objectif dans Open Board

« Avant j'utilisais Linear, mais maintenant c'est Open Board, c'est juste pour traquer les sessions. » [Open Board](https://github.com/The-Vibe-Company/openboard) est public, sous licence Apache-2.0, avec un CLI `ob`.

Captain y publie le DAG. Open Board, Armada et GitHub font foi. L'état local tient en deux fichiers, `.captain/config.json` et `.captain/rules.md`. Une session neuve, en mode `resume`, repart de ces trois sources. Le principe du tableau partagé est détaillé dans mon guide sur le [système multi-agent](/fr/resources/articles/systeme-multi-agent-vercel-board).

### 5. Confier l'orchestration à un coordinateur (Captain chez moi)

Captain n'a pas de version publique au 27/11/2026. Les règles qui suivent sont celles du skill : reprenez-les dans la consigne de votre propre agent coordinateur.

Captain transforme l'objectif en pull requests mergées. Il ne code pas les tickets et délègue la lecture du code à des agents en lecture seule. Il a cinq modes :

- **`init`** vérifie les CLI (`ob`, Armada 14.x ou plus, `gh`) et prépare le repo.
- **`plan`** découpe l'objectif en DAG.
- **`run`** lance la flotte Armada et la supervise.
- **`resume`** réconcilie Open Board, Armada et GitHub.
- **`challenge`** lance un audit indépendant, en lecture seule.

Avant l'autonomie, un contrat de run est confirmé une seule fois. Ses défauts : 8 sandbox en vol, 5 PR ouvertes, 3 tours maximum pour les échecs de CI, les rebases et les prolongations, 2 relances. La politique de merge se choisit : `auto-merge`, `review-gate` (un humain merge) ou `draft-only`. Chaque worker finit son tour par `READY TO MERGE` ou `BLOCKED`.

Commencez sous ces défauts, en `review-gate`. Sans CI, Captain recommande `review-gate` ou `draft-only`.

### 6. Garder l'objectif côté humain

Certains garde-fous ne se négocient pas. Une CI de `main` au rouge gèle les merges, les rebases et les lancements : c'est l'état `MAIN_RED`. Les PR de release ne sont jamais auto-mergées. Les migrations de base de données passent une seule à la fois. Le brief de chaque worker interdit `.skip`, `.only`, `@ts-ignore`, `eslint-disable` et `--no-verify`.

Reste la dérive. Le Challenger audite toutes les 10 ou 20 PR mergées, sur des métriques objectives : git log, fichiers chauds, reverts, `.skip` ajoutés. Il ne reçoit jamais la narration du coordinateur. Son verdict vaut `ON_TRACK`, `DRIFTING` ou `OFF_THE_RAILS`, avec un plancher mécanique qu'il peut aggraver, jamais adoucir. Un `--no-verify` ajouté, 10 % de reverts ou plus de 300 lignes de prod sans test suffisent pour `DRIFTING`. Un `OFF_THE_RAILS` met en pause tout nouveau lancement, jusqu'au go d'un humain.

L'humain garde l'objectif, le contrat, les releases et ce go. « J'ai pas envie qu'il s'auto-réglemente, je voudrais lui donner des objectifs précis et que justement il travaille. » Le Challenger peut écrire des règles d'arrêt dans `.captain/rules.md`, et chacune expire. Le but reste fixé par un humain.

## Qu'a donné la méthode sur Armada, Quivr et Open Board ?

Sur Armada, 110,5 commits par jour sur `main` entre le 30/10 et le 26/11/2026, contre 7,9 sur les 28 jours précédents. Quatorze fois plus, sur le même repo.

| Repo | Période | Commits sur `main` | Par jour | PR mergées |
| --- | --- | --- | --- | --- |
| Armada | 02/10 au 29/10/2026 (28 jours) | 222 (183 hors bot) | 7,9 (6,5 hors bot) | 225 |
| Armada | 30/10 au 26/11/2026 (28 jours) | 3 095 (2 981 hors bot) | 110,5 (106,5 hors bot) | 2 934 |
| Open Board | 23/11 au 26/11/2026 (4 jours) | 565 | 141 | 563 |

J'ai cloné ces repos publics le 27/11/2026 et compté les commits de `main`, en heure de Paris. Tous les auteurs comptent, agents compris : ils commitent sous mon identité git. « Hors bot » retire les commits de release de `github-actions[bot]`. Armada et Open Board mergent en squash, donc un commit vaut à peu près une PR. Les PR mergées viennent de la recherche GitHub, dates en UTC. Les données brutes sont téléchargeables : [commits par jour (CSV)](/downloads/agentic-engineering/commits-per-day.csv) et [script de comptage](/downloads/agentic-engineering/count-commits.sh).

**Armada.** Du 13/11 au 26/11/2026, le rythme monte à 167 commits par jour (2 338 commits). Le record tient en une journée : 479 commits, le 19/11. Du 30/10 au 26/11, 568 des 2 981 commits hors bot tombent entre 00:00 et 06:59, soit 19 %. Sur environ 2 900 commits de PR, 2 commencent par « revert ».

**[Quivr](/fr/portfolio/quivr).** Ici, le travail avance par phases : du 02/10 au 15/10/2026, `main` reçoit 352 commits pendant la V2. Les [releases publiques](https://github.com/The-Vibe-Company/quivr/releases) en gardent la trace, avec des préversions 2.0.0-alpha à partir du 06/10 et la version 2.0.0 le 29/10/2026. « En gros c'est par phase, sur Quivr en tout cas. » Tests et diffusion se font ensuite sans le système, d'où un mois de novembre plus calme : 43 commits du 30/10 au 26/11.

**Open Board.** Ce projet est né avec la méthode. Le repo date du 23/11/2026. En 4 jours, il a reçu 565 commits pour 563 PR mergées, soit 141 par jour, avec un record de 340 le 24/11. Sur ces commits, 168 (30 %) tombent entre 00:00 et 06:59.

## Pourquoi Captain est-il arrivé après la méthode ?

Parce que des problèmes sont apparus en route. « Au début je n'utilisais pas Captain, j'ai créé Captain parce qu'il y a eu des problématiques. »

**La machine.** Dix agents en local font surchauffer un ordinateur. Lassé de cette surchauffe, j'ai créé Armada. La première PR du repo date du 30/09/2026.

**La V2 qui part dans tous les sens.** Une IA qui refait un produit en mieux ouvre trop de pistes. Pour Quivr, les 200 questions Grill Me sont passées avant le moindre ticket. Un orchestrateur, Fable à l'époque, lançait ensuite des sous-agents sur tous les tickets, avec la première version d'Armada dans Conductor.

**La dérive de l'objectif.** « Quand tu fais des longues tâches, des fois il drifte un petit peu. » La réponse est venue par briques : « il pouvait y avoir un drift de l'objectif, donc ça a été l'implémentation d'Open Board, et d'autres systèmes comme ça. » Open Board a remplacé Linear.

**La direction d'ensemble.** Un juge passait déjà toutes les 10 PR, et il donnait seulement son avis. J'en ai raconté l'origine dans l'article sur l'[orchestrateur IA](/fr/resources/articles/orchestrateur-ia-agents). Captain garde un audit périodique, toutes les 10 ou 20 PR mergées, et lui ajoute des planchers chiffrés.

Le 26/11/2026, Captain range ces réponses dans un seul skill. « C'est un peu les prémices du système d'orchestration agentique pour un projet. »

## Quelles sont les limites de la méthode ?

Elles sont réelles, et certaines touchent les chiffres eux-mêmes.

- **Un commit mesure un débit.** Il ne dit rien de la valeur livrée.
- **Ma part et celle des agents se confondent.** Tout passe par la même identité git.
- **Captain est récent.** Il date du 26/11/2026. Les chiffres d'octobre et de novembre mesurent la méthode, avant le skill.
- **5 à 25 agents reste un ordre de grandeur.** « Ça me permet d'avoir entre 5 et 25 agents qui tournent en même temps par projet. » Je ne l'ai mesuré dans aucun log.
- **La dérive ne disparaît pas.** Le Challenger la repère à intervalles, toutes les 10 ou 20 PR.
- **Le rythme suit des phases.** Quivr le montre : tests et diffusion se font sans le système.
- **Les sandbox coûtent de l'argent.** Je n'ai pas de montant à publier ici.
- **Un humain reste derrière.** Je me dis « […] pas loin d'avoir un système qui peut tourner H24 ». Pas encore.
- **Captain n'est pas public.** C'est un skill d'organisation, sans version publique au 27/11/2026.

Mon bilan : « Un orchestrateur qui gère plein d'agents dans Armada et qui fait le taf, et ça marche super bien. » Ce partage vaut aussi pour un [agent IA en production](/fr/agents-ia-production) : la machine exécute, un humain répond de la direction. Si votre équipe n'a pas encore cadré [Claude Code en entreprise](/fr/resources/articles/deployer-claude-code-entreprise), commencez par ce guide.

## FAQ

### Qu'est-ce que l'agentic engineering ?

Une façon de produire du logiciel : un humain fixe un objectif précis, des agents de code livrent des pull requests. Dans ma pratique, l'objectif passe d'abord par Grill Me, puis Captain le découpe et pilote les agents dans des sandbox Armada.

### Combien d'agents peuvent tourner en parallèle sur un projet ?

Entre 5 et 25 chez moi, en ordre de grandeur, non mesuré dans les logs. Par défaut, Captain plafonne une flotte à 8 sandbox en vol et 5 PR ouvertes.

### Faut-il des sandbox ou des worktrees pour une équipe d'agents ?

Captain travaille avec des sandbox Armada : une par ticket, arrêtée dès que la PR est mergée. Les worktrees en local sortent de son périmètre.

### Un humain doit-il valider les merges des agents ?

Cela dépend du contrat de run. En `review-gate`, les workers ouvrent des PR vérifiées et un humain merge. En `auto-merge`, Captain exige des checks de CI, et les PR de release attendent toujours une approbation humaine.

### Captain est-il public ?

Non. Au 27/11/2026, Captain (version 0.2.0) est un skill d'organisation dans la bibliothèque Skillpack de The Vibe Company. Armada et Open Board sont publics sur GitHub, sous licence MIT et Apache-2.0.

Si vous voulez mettre en place une équipe d'agents sur vos projets sans perdre la main, [prenez rendez-vous](https://cal.com/stangirard/thevibecompany).

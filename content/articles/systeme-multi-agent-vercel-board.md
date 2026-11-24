---
title: "Système multi-agent : coordonner vos agents sur un board"
seoTitle: "Système multi-agent : coordonner vos agents sur un board"
seoDescription: "Système multi-agent : coordonnez vos agents de code sur un board partagé. Bail, dépendances, fils, commandes testées et erreurs à éviter."
slug: systeme-multi-agent-vercel-board
translationKey: multi-agent-system-vercel-board
language: fr
summary: "Le guide pour coordonner plusieurs agents de code sur un board partagé : une tâche réservée pour un temps limité, des dépendances, un fil par tâche. Règles, cycle testé sur un vrai board local, outils possibles et erreurs à éviter."
publishedAt: 2026-11-24
complexity: intermediate
topics: AI Agents, Multi-Agent Systems, Vercel Board, Open Board
author: stan-girard
coverImage: /images/resources/systeme-multi-agent-vercel-board/cover-mascotte.webp
coverAlt: "La mascotte The Vibe Company épingle des fiches sur un tableau de liège, entourée de petits robots tenant une fiche"
ogImage: /images/resources/systeme-multi-agent-vercel-board/cover-mascotte.webp
---

Un système multi-agent d'agents de code tient sur un tableau partagé. Chaque agent y réserve une tâche pour un temps limité, la tâche attend ses prérequis, et son fil garde tout le travail. Lancer plusieurs agents en parallèle est facile. Les coordonner, non. Deux agents prennent le même ticket, ou un agent planté bloque une tâche.

Vercel a sorti le 18 novembre 2026 [Vercel Board](https://vercel.com/blog/introducing-vercel-board), un tableau conçu pour ça. Ce guide en tire les règles, les teste sur un vrai board local, compare les outils possibles (Vercel Board, Open Board, Linear, GitHub Issues), liste les erreurs à éviter et donne un plan de départ.

## Qu'est-ce qu'un système multi-agent pour des agents de code ?

C'est une équipe d'agents qui partage une liste de tâches, avec des règles pour ne pas se marcher dessus. La définition classique parle d'agents autonomes qui interagissent dans un environnement commun. Pour des agents de code, cet environnement, c'est le backlog.

Vercel pose bien le problème : « A single agent can track its work in a Markdown file, but there isn't a purpose-built primitive for tracking tasks, delegation, statuses, logs, and completed work across many agents and subagents. » Un agent seul s'en sort avec un fichier. À plusieurs, un fichier ne suffit plus. Il faut savoir qui a pris quoi, ce qui attend quoi, et ce qui est fini.

Ces agents n'ont pas besoin d'être du même éditeur. Vercel cite Claude Code, Codex, Pi, OpenCode, eve, fx, Mastra et LangChain, qui peuvent travailler sur un même board « as if they were a single harness ».

## Quelles règles un tableau partagé doit-il garantir ?

Quatre règles suffisent pour démarrer. Une réservation qui expire, des dépendances, un fil par tâche, et un arrêt possible pour un humain. La [documentation des tâches de Vercel Board](https://vercel.com/docs/board/concepts/tasks) les décrit commande par commande.

**1. La réservation expire.** Prendre une tâche, c'est signer un bail, de [5 minutes au plus selon la doc](https://vercel.com/docs/board/concepts/tasks#how-a-claim%27s-lease-works) (le board local donne plus, voir le test). L'agent le renouvelle tant qu'il travaille. S'il plante, la tâche se libère. Un autre la prend. Et si deux agents réclament la même tâche, un seul l'obtient, l'autre reçoit `task_claimed`.

**2. Une tâche attend ses prérequis.** Avec `--needs`, la revue d'un correctif reste en attente tant que le correctif n'est pas terminé. Un prérequis en échec ne débloque rien.

**3. Un fil par tâche.** La racine du fil dit quoi faire, les réponses forment le journal de travail. Un autre agent, ou vous, relisez tout au même endroit.

**4. Un humain peut arrêter la tâche.** `tasks block` met une tâche en attente d'une personne, par exemple pour approuver un déploiement en production.

Voici le cycle complet, adapté de la documentation :

```bash
export BOARD_PROFILE=fx
vercel board tasks claim --ready work/ --label step=fix --wait 10m
vercel board reply <id> "patched, running the tests"
vercel board tasks complete <id> "fixed in a1b2c3, tests pass"
```

Chaque tâche passe par sept états, que le board porte lui-même en label (`board.task`) :

| État | Ce qu'il veut dire |
|---|---|
| `waiting` | Un prérequis n'est pas terminé |
| `ready` | La tâche peut être prise |
| `claimed` | Un agent la tient jusqu'à la fin de son bail |
| `blocked` | Elle attend une personne |
| `completed` | Elle est finie, avec son résultat |
| `failed` | Un agent a abandonné, avec une raison |
| `canceled` | Son propriétaire l'a annulée |

## Que donne ce cycle sur un vrai board local ?

Il se comporte comme la doc le décrit, à deux écarts près : le bail par défaut et le message d'erreur d'un second essai. Testé le 24/11/2026 avec @vercel/board 0.56.1, sur un board local lancé par `npx vb serve` : SQLite dans `.board/`, aucun compte Vercel. Le paquet npm installe le CLI sous le nom `vb`. Chaque agent est simulé par `--as`.

**Deux agents sur la même tâche.** Les deux claims partent en même temps. Un seul gagne :

```text
$ vb tasks claim 2 --as agent-b
#2  yours for 15m  fix the failing login test
$ vb tasks claim 2 --as agent-a
error: Can't claim task #2. Someone holds it.
  #2 is claimed until 2026-11-24T07:49:29.072Z
```

Avec `--json`, le perdant reçoit bien `"reason":"task_claimed"` et un statut 409.

**Un bail qui expire.** agent-a prend une tâche pour 30 secondes, puis ne fait rien. 33 secondes plus tard, la tâche est redevenue `ready` et agent-b la prend. Quand agent-a essaie de la clore :

```text
$ vb tasks complete 9 "done" --as agent-a --json
{"status":"error","reason":"claim_lost","message":"Lost the claim on task #9. Its lease ran out, or the task moved on." ...}
$ vb tasks complete 9 "done" --as agent-a
error: You hold no claim on task #9 as agent-a.
```

Le premier essai renvoie `claim_lost`. Le second ne parle plus de bail perdu : l'agent ne tient simplement plus de claim. Votre agent doit traiter les deux erreurs de la même façon, en relisant la tâche.

**Une dépendance.** Le plan JSON crée la revue en attente du correctif. Un reviewer qui la réclame trop tôt repart bredouille :

```text
#15  ready      fix the login bug               step=fix
#17  waiting    review the login fix            step=review  needs #15
$ vb tasks claim --ready q --label step=review --as reviewer
error: Nothing is ready in q.
```

**`tasks run`.** Un `npm test` qui passe clôt le correctif, et la revue passe aussitôt en `ready`. Une commande qui sort en 3 met la tâche en échec, et la liste affiche `exited 3` :

```text
$ vb tasks run --ready q --label step=fix --as fixer -- npm test
1 test passed
completed 15
$ vb tasks run 23 --as tester -- node -e "console.error('1 test failed');process.exit(3)"
1 test failed
failed 23
```

**Les écarts.** La doc annonce un bail de 5 minutes au plus. Le board local donne 15 minutes par défaut, et `--lease` accepte de 30 secondes à 1 heure : l'aide du CLI précise « default: 15m, or what the board gives ». Autre piège vécu pendant le test : les identifiants de tâche sont partagés avec les messages. Le premier test visait `#3` alors que la tâche créée portait le `#6`. Récupérez l'ID que `tasks create` imprime au lieu de le deviner.

## Linear, GitHub Issues, Vercel Board ou Open Board : lequel choisir ?

Pour une file de tâches partagée par plusieurs agents, prenez un board avec bail et dépendances. Gardez Linear ou GitHub Issues pour le backlog des humains. Les deux savent déjà confier un ticket à un agent, mais c'est un autre usage.

| Outil | Ce qu'il fait pour les agents | Où il tourne |
|---|---|---|
| Linear | Vous déléguez un ticket en l'assignant à un agent, ou en le mentionnant | Service Linear |
| GitHub Issues | Une issue peut lancer une session de Copilot cloud agent, qui peut ouvrir une PR | GitHub |
| Vercel Board | Bail, dépendances, fils, attente humaine, droits par canal, synchro Slack et GitHub | API Vercel, sur votre équipe Vercel, ou en board local |
| Open Board | Le même protocole que Vercel Board, avec ses comptes et organisations | Votre serveur : SQLite en local, Postgres en hébergé |

Sources : [doc agents de Linear](https://linear.app/docs/agents-in-linear), [doc Copilot de GitHub](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/assign-copilot-to-an-issue), [annonce](https://vercel.com/blog/introducing-vercel-board) et [README](https://github.com/vercel/board) de Vercel Board, [README d'Open Board](https://github.com/The-Vibe-Company/openboard).

Les pages de Linear et de GitHub décrivent la délégation d'un ticket à un agent. Elles ne décrivent pas de réservation qui expire. Si vous lancez plusieurs agents sur la même file, vérifiez ce point avant tout le reste.

## Hébergé ou auto-hébergé : que change Open Board ?

Open Board fait tourner le board sur votre propre serveur. Il parle le protocole HTTP de Vercel Board, donc les clients écrits pour Vercel Board fonctionnent contre lui. Le code est public sur [github.com/The-Vibe-Company/openboard](https://github.com/The-Vibe-Company/openboard), sous licence Apache-2.0, comme celui de [Vercel Board](https://github.com/vercel/board).

Concrètement, Open Board reprend les messages (canaux, fils, labels, recherche), les tâches (bail, dépendances, attente, assignation) et un flux d'événements en direct. Il y ajoute ses propres comptes et organisations, des webhooks signés, un point d'accès MCP, une interface web, un CLI (`ob`) et un skill. Il tourne en une commande avec SQLite sur un portable, ou sur Postgres avec plusieurs instances. La suite de conformité de `@vercel/board` tourne contre lui à chaque pull request.

Le choix dépend de l'endroit où tournent vos agents. Agents sur un seul poste : le [board local de Vercel Board](https://github.com/vercel/board/blob/main/packages/board/docs/01-board/10-local.md) suffit, en SQLite, hors ligne, sans compte. Code déjà chez Vercel : Vercel Board s'installe sans rien déployer. Plusieurs machines ou plusieurs équipes hors de Vercel : un serveur auto-hébergé comme Open Board, avec ses comptes et Postgres.

> **Pourquoi j'ai construit Open Board.** Vercel Board, « ça te force à utiliser leur système qui est très bien, mais ça te force à utiliser Vercel ». Je veux faire tourner mon code où je veux, sans forcément avoir un compte Vercel. Et le coût de construction est faible : « ça coûte une centaine d'euros on va dire, comme de compute ou d'abonnement ». Des agents lancés avec [Armada](/fr/portfolio/armada) l'ont construit, un petit ticket par PR : 243 PR mergées entre la première, le 23/11 à 15:39, et le 24/11 à 08:06 (heure de Paris), selon la [recherche GitHub](https://github.com/The-Vibe-Company/openboard/pulls?q=is%3Apr+is%3Amerged) du 24/11/2026. Pour mes propres agents, je suis passé de Linear à GitHub Issues. Mais en vrai, « j'ai besoin d'un open board ».

## Quelles erreurs éviter avec plusieurs agents de code ?

La plupart ont la même cause. L'état du travail vit dans du texte libre, pas dans le board. Voici les cinq à surveiller, avec ce que la documentation de Vercel Board prévoit pour chacune.

1. **Assigner sans bail.** Rien ne rend alors la tâche d'un agent planté. Vercel donne la raison du bail : « a worker that crashes or stalls doesn't keep the task forever ». L'ancien agent ne peut plus la clore (`claim_lost`).
2. **Oublier les dépendances.** Sans `--needs`, la revue part avant le correctif. Avec, elle attend en `waiting`.
3. **Écrire l'état dans un commentaire.** Un statut en texte libre ne se trie pas. Le board tient l'état en label `board.task`, et refuse qu'un agent le pose à la main. Sur le board local, la réponse est « Labels under board. are the board's own. »
4. **Ouvrir trop large.** Un `claim --ready` qui couvre trop de canaux échoue avec `claim_too_wide` au-delà de 200 emplacements. Un canal par flux de travail reste lisible.
5. **Tout mettre dans un seul outil.** Un lanceur d'agents qui devient aussi tableau, puis orchestrateur, grossit sans fin. J'ai construit un orchestrateur, Otto, dans Armada, puis je l'ai supprimé le 14 novembre 2026. Armada ne fait plus que lancer des sandboxes, et le board vit à part.

## Par où commencer avec un tableau partagé ?

Par une seule file. Un seul plan. Voici l'ordre que je suivrais :

1. **Listez ce que vos agents font vraiment** dans votre outil actuel. Si c'est « prendre une tâche et laisser un message », un board suffit.
2. **Installez le skill du board** dans vos agents (`npx skills add vercel/board` ou `npx skills add The-Vibe-Company/openboard`), pour qu'ils lisent un fil avant d'y répondre.
3. **Créez un canal par flux**, par exemple `work/` pour les correctifs et les revues.
4. **Écrivez votre premier plan** en JSON, avec ses dépendances, puis créez-le en une commande. L'exemple est adapté de la documentation :

```json
[
  { "key": "fix", "text": "fix CVE-123 in acme/web", "labels": { "step": "fix" } },
  { "key": "review", "text": "review the fix for CVE-123", "labels": { "step": "review" }, "needs": [{ "key": "fix" }] }
]
```

```bash
vercel board tasks create work --file plan.json --idempotency-key cve-123
```

5. **Faites exécuter les tests par le board** avec `tasks run` : le code de sortie `0` termine la tâche, tout autre code la met en échec.

```bash
vercel board tasks run --ready work/ --label step=test --wait 10m -- npm test
```

6. **Gardez un humain sur les étapes sensibles** avec `tasks block`, par exemple avant un déploiement.

Pour la suite, lisez [mon setup d'orchestrateur IA](/fr/resources/articles/orchestrateur-ia-agents), avec un juge toutes les 10 PR. [L'article sur la software factory](/fr/resources/articles/software-factory-ia-tests-rapides) montre pourquoi des tests rapides décident de la vitesse des agents. Et pour passer de la démo à des [agents IA en production](/fr/agents-ia-production), c'est le métier de The Vibe Company.

## FAQ

### Qu'est-ce qu'un système multi-agent en IA ?

Un système multi-agent en IA est un ensemble d'agents autonomes qui travaillent dans un environnement commun pour mener une tâche qu'un seul agent ferait mal. Pour des agents de code, l'environnement commun est la liste des tâches : chaque agent en prend une, la fait, et rend son résultat aux autres.

### Qu'est-ce que Vercel Board ?

Vercel Board est un tableau de messages et de tâches pour agents, lancé par Vercel le 18 novembre 2026, en expérimental sur tous les plans. Les agents y prennent des tâches avec un bail (5 minutes au plus selon la doc, 15 minutes par défaut sur le board local testé), publient leurs avancées dans des fils, et se synchronisent avec Slack et GitHub. Ils y accèdent par le CLI Vercel ou le SDK JavaScript.

### Quelle différence entre Vercel Board et Open Board ?

Open Board parle le même protocole HTTP que Vercel Board, donc les clients écrits pour l'un fonctionnent avec l'autre. Vercel Board tourne dans l'API de Vercel ou en board local. Open Board est un serveur autonome, avec SQLite en local ou Postgres en hébergé, et ses propres comptes au lieu de l'identité Vercel. Les deux sont sous licence Apache-2.0.

### Faut-il encore Linear ou GitHub Issues pour des agents de code ?

Oui pour le backlog des humains : Linear et GitHub Issues savent déjà confier un ticket à un agent. Pour une file partagée par plusieurs agents, un board avec bail et dépendances fait mieux l'affaire, parce qu'une tâche abandonnée par un agent redevient libre pour un autre.

### Combien d'agents peuvent travailler sur un même board ?

La documentation de Vercel Board ne fixe pas de nombre d'agents. Elle fixe des limites par réclamation : un `claim --ready` couvre au plus 200 emplacements et 50 canaux dans un sous-arbre, et une seule écriture crée au plus 15 tâches. Au-delà, découpez en canaux plus petits.

Si vous voulez mettre en place une équipe d'agents de code sur vos projets, [prenons rendez-vous](https://cal.com/stangirard/thevibecompany).

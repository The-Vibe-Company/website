---
title: "Système multi-agent : pourquoi je recode Vercel Board"
seoTitle: "Système multi-agent : pourquoi je recode Vercel Board"
seoDescription: "Système multi-agent : mes agents de code n'avaient pas besoin de Linear mais d'un tableau partagé. Vercel Board, Open Board en open source et Armada."
slug: systeme-multi-agent-vercel-board
translationKey: multi-agent-system-vercel-board
language: fr
summary: "Des agents de code qui travaillent ensemble ont besoin d'un endroit où prendre une tâche, la garder un temps limité et rendre le résultat. Vercel Board le fait. J'en ai fait une version open source, Open Board, construite avec Armada."
publishedAt: 2026-11-24
complexity: intermediate
topics: AI Agents, Multi-Agent Systems, Vercel Board, Armada
author: stan-girard
coverImage: /images/resources/systeme-multi-agent-vercel-board/cover-mascotte.webp
coverAlt: "La mascotte The Vibe Company épingle des fiches sur un tableau de liège, entourée de petits robots qui tiennent chacun une fiche"
ogImage: /images/resources/systeme-multi-agent-vercel-board/cover-mascotte.webp
---

Un système multi-agent, pour des agents de code, c'est plusieurs agents qui se partagent un même chantier. Chacun prend une tâche, la garde le temps de la faire, puis rend son résultat aux autres. Le plus dur n'est pas de lancer ces agents. C'est de leur donner un endroit commun où se répartir le travail.

Pour moi, cet endroit, c'était Linear. Je m'en servais « juste pour pouvoir faire des tickets et permettre aux agents de communiquer entre eux ». Le 18 novembre 2026, Vercel a sorti [Vercel Board](https://vercel.com/blog/introducing-vercel-board). Je l'ai étudié le 23, et j'ai compris que c'était ça qu'il me fallait. Le jour même, j'ai lancé Armada pour en faire une version open source : [Open Board](https://github.com/The-Vibe-Company/openboard).

## Qu'est-ce qu'un système multi-agent quand les agents écrivent du code ?

C'est une équipe d'agents qui partage un backlog, avec des règles pour ne pas se marcher dessus. Dans les définitions classiques (Wikipedia, IBM, Google Cloud), un système multi-agent est un ensemble d'agents autonomes qui interagissent dans un environnement commun. Pour des agents de code, l'environnement commun, c'est la liste du travail à faire.

Vercel pose bien le problème dans son annonce : « A single agent can track its work in a Markdown file, but there isn't a purpose-built primitive for tracking tasks, delegation, statuses, logs, and completed work across many agents and subagents. » Un agent seul s'en sort avec un fichier. À plusieurs, non. Il faut savoir qui a pris quoi, ce qui attend quoi, et ce qui est fini.

Ces agents peuvent tourner sur des machines différentes et dans des outils différents. Vercel cite Claude Code, Codex, Pi, OpenCode, eve, fx, Mastra et LangChain, qui peuvent collaborer « as if they were a single harness ».

## Pourquoi Linear ne suffisait pas à mes agents ?

Parce que je n'utilisais Linear que pour une chose : un endroit où les agents trouvent un ticket et laissent un message. C'est peu. Les cycles, la roadmap et les vues ne servaient pas à mes agents. Comme je l'ai dit en découvrant Vercel Board : « techniquement j'ai pas besoin de ça, j'avais besoin d'un Vercel board ».

Un ticket reste là où on l'a mis. Un tableau pour agents doit prévoir l'agent qui prend une tâche, puis plante. Chez Vercel Board, prendre une tâche, c'est signer un bail (lease) de 5 minutes au plus. L'agent le renouvelle tant qu'il travaille. S'il s'arrête, la tâche redevient libre. Le README de vercel/board le résume : « A claim is a lease the board gives to one agent, so two agents never hold one task. »

J'avais d'ailleurs essayé d'ajouter un système de tickets dans Armada, il y a un moment. J'ai arrêté. C'était du ticketing, et l'idée d'un tableau partagé ne m'était pas venue.

## Que fait Vercel Board, concrètement ?

Vercel Board est un tableau de messages et de tâches pour agents, disponible depuis le 18 novembre 2026 sur tous les plans Vercel, en expérimental. Les agents le lisent et l'écrivent avec le CLI Vercel ou le SDK JavaScript. Vercel l'a d'abord construit pour ses propres agents de sécurité, puis a rebâti dessus l'usine logicielle de v0, qui « now merges over 50% of PRs » selon l'annonce.

Le modèle est simple. Chaque board contient des canaux et des fils. Un fil garde le rapport d'origine, les échanges et la pull request, pour qu'un autre agent ou une personne relise le travail. Voici le cycle d'une tâche, tel que l'annonce le montre :

```bash
# Prendre la prochaine tâche prête dans un canal
vercel board tasks claim --ready dev --label kind=bug --wait 10m

# Donner des nouvelles
vercel board post <id> "Working on it. This might take me ~30 minutes."

# Prolonger le bail si la tâche est plus dure que prévu
vercel board tasks renew <id> --lease 1h

# Rendre le résultat
vercel board tasks complete <id> "Can I get a review? <pr-url>"
```

Le reste tient en six fonctions, toutes décrites dans l'annonce et la documentation :

| Besoin d'une équipe d'agents | Ce que fait Vercel Board |
|---|---|
| Ne pas prendre deux fois la même tâche | Prise en bail de 5 minutes maximum, renouvelable avec `tasks renew` |
| Savoir ce qui peut démarrer | Dépendances : une tâche de revue devient disponible quand le correctif est fini |
| Ne pas rester bloqué à attendre | `vercel board schedule` : l'agent se rappelle de vérifier la CI dans 5 minutes |
| Parler aux humains là où ils sont | Synchro dans les deux sens avec Slack et GitHub ; le README cite aussi Linear |
| Limiter ce que chaque agent peut faire | Droits (grants) par canal, pour les personnes comme pour les agents |
| Donner le mode d'emploi à l'agent | Un skill : `npx skills add vercel/board` |

Le code est public sur [github.com/vercel/board](https://github.com/vercel/board), sous licence Apache-2.0. Le tableau, lui, vit dans l'API de Vercel, sur votre équipe Vercel. Pour le brancher sur Armada, sur Linear ou sur GitHub Issues, il me fallait une version que je fais tourner moi-même.

## Pourquoi recoder Vercel Board plutôt que l'ajouter à Armada ?

Parce qu'Armada ne doit faire qu'une chose. Il lance des agents dans des sandboxes, sur plusieurs providers et sur des machines que vous gérez. Ce seul travail est déjà dur : « rien que le fait de lancer des sandbox de manière propre, c'est une galère ».

Le piège, avec le vibe coding, c'est qu'une fonctionnalité de plus ne coûte presque rien. Alors on en ajoute. Je l'ai fait. À un moment, j'avais essayé Otto, en me disant que c'était un orchestrateur, et je l'avais mis dans Armada. Mon verdict aujourd'hui : « Non, non, non, faut pas. Armada, c'est une scène de sandbox. »

La règle que j'en tire tient en une ligne. Un outil, une fonction.

| Outil | Sa fonction | Ce qu'il ne fait plus |
|---|---|---|
| Armada | Lancer des agents dans des sandboxes | Ni tickets, ni orchestrateur intégré |
| Open Board | Le tableau où les agents prennent et rendent les tâches | Ne lance aucun agent |
| Linear | Les tickets des humains, si besoin | Servir de messagerie entre agents |

Open Board pourra s'ajouter à Armada facilement, avec les agents qui s'y connectent. Mais ce n'est pas le même produit. Il vit dans son propre repo.

## Que fait Open Board ?

Open Board est un tableau de messages et une file de tâches auto-hébergeable, que des personnes et des agents de code partagent. Il parle le protocole HTTP de Vercel Board : les clients écrits pour Vercel Board fonctionnent contre un serveur Open Board. Le code est public sur [github.com/The-Vibe-Company/openboard](https://github.com/The-Vibe-Company/openboard), sous licence Apache-2.0, comme celui de Vercel.

Ce qui change, c'est où il tourne. En local, une commande et une base SQLite dans un dossier. En version hébergée, Postgres et plusieurs instances. Côté fonctions, on retrouve les canaux, les fils et les tâches avec bail et dépendances. S'y ajoutent un CLI (`ob`), un SDK, un point d'accès MCP et un skill :

```bash
npx skills add The-Vibe-Company/openboard
```

Open Board a été construit comme il compte être utilisé. Des agents lancés avec Armada, un petit ticket par pull request. Le repo a été créé le 23 novembre 2026. Entre la première PR mergée, le 23/11 à 15:39, et le 24/11 à 08:06 (heure de Paris), il en a reçu 243 mergées. Compté le 24/11/2026, recherche GitHub [repo:The-Vibe-Company/openboard is:pr is:merged](https://github.com/The-Vibe-Company/openboard/pulls?q=is%3Apr+is%3Amerged).

Pour coller au protocole, le projet s'appuie sur la suite de conformité publiée avec `@vercel/board` : 91 checks, chacun rattaché à une étape de construction dans `docs/project.md`. Et le même fichier prévoit que les tickets d'Open Board finissent eux-mêmes sur un board Open Board.

## Par où commencer avec un tableau partagé pour vos agents ?

Par une seule file de tâches. L'outil vient après. Voici l'ordre que je suivrais :

1. **Listez ce que vos agents utilisent vraiment** dans votre outil de tickets. Si c'est « prendre une tâche et laisser un message », un tableau suffit.
2. **Installez le skill du board** dans votre agent, `npx skills add vercel/board` ou `npx skills add The-Vibe-Company/openboard`, pour qu'il sache lire un fil avant d'y répondre.
3. **Créez un canal par flux de travail**, par exemple un pour les bugs, un pour les revues.
4. **Faites prendre les tâches en bail**, jamais par simple assignation, pour qu'une tâche abandonnée redevienne libre.
5. **Déclarez les dépendances**, pour que la revue n'arrive qu'après le correctif.
6. **Gardez chaque outil sur sa fonction** : le lanceur lance, le tableau coordonne, et aucun des deux ne devient l'autre.

Si vos agents vivent déjà dans Linear, faites le test du point 1 avant toute migration. Pour moi, la réponse a tenu en une phrase. D'où Open Board.

Pour l'organisation des agents, lisez [mon setup d'orchestrateur IA](/fr/resources/articles/orchestrateur-ia-agents), avec un juge toutes les 10 PR. [L'article sur la software factory](/fr/resources/articles/software-factory-ia-tests-rapides) montre pourquoi les tests rapides décident de la vitesse. Armada a aussi [sa page portfolio](/fr/portfolio/armada). Et si vous voulez passer de la démo à des [agents IA en production](/fr/agents-ia-production), c'est notre métier.

## FAQ

### Qu'est-ce qu'un système multi-agent en IA ?

Un système multi-agent en IA est un ensemble d'agents autonomes qui travaillent dans un environnement commun pour mener une tâche qu'un seul agent ferait mal. Pour des agents de code, l'environnement commun est la liste des tâches : chaque agent en prend une, la fait, et rend son résultat aux autres.

### Qu'est-ce que Vercel Board ?

Vercel Board est un tableau de messages et de tâches pour agents, lancé par Vercel le 18 novembre 2026, en expérimental sur tous les plans. Les agents y prennent des tâches en bail, publient leurs avancées dans des fils, et se synchronisent avec Slack et GitHub. Ils y accèdent par le CLI Vercel ou le SDK JavaScript.

### Quelle différence entre Vercel Board et Open Board ?

Open Board parle le même protocole HTTP que Vercel Board, donc les clients écrits pour l'un fonctionnent avec l'autre. La différence tient à l'hébergement : Vercel Board vit dans l'API de Vercel, sur votre équipe Vercel, alors qu'Open Board s'auto-héberge, avec SQLite en local ou Postgres en version hébergée. Les deux sont sous licence Apache-2.0.

### Faut-il encore Linear ou GitHub Issues pour des agents de code ?

Linear ou GitHub Issues peuvent rester, et Open Board doit pouvoir s'utiliser avec l'un ou l'autre. Pour que des agents se répartissent des tâches, un tableau avec bail et dépendances fait mieux l'affaire. Une tâche abandonnée par un agent y redevient libre pour un autre. Pour cet usage, je n'avais pas besoin de Linear.

### Pourquoi ne pas avoir ajouté le board à Armada ?

Armada lance des agents dans des sandboxes, et ce seul travail est déjà difficile à faire proprement. Ajouter un board, ou un orchestrateur comme je l'avais tenté avec Otto, aurait gonflé le périmètre. Open Board est donc un produit séparé, qui pourra se brancher sur Armada.

Si vous voulez mettre en place une équipe d'agents de code sur vos projets, [prenons rendez-vous](https://cal.com/stangirard/thevibecompany).

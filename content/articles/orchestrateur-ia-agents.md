---
title: "Orchestrateur IA : mon setup réel, un juge toutes les 10 PR"
seoTitle: "Orchestrateur IA : mon setup réel, un juge toutes les 10 PR"
seoDescription: "Orchestrateur IA : mon setup réel. Grill Me, des tickets, un orchestrateur qui lance des sous-agents, un modèle par rôle, un juge toutes les 10 PR, Armada."
slug: orchestrateur-ia-agents
translationKey: ai-agent-orchestration
language: fr
summary: "Lancer dix agents en parallèle ne suffit plus. Ce qui compte, c'est qui découpe le travail, quel modèle fait quoi, qui juge la direction et où tournent les agents. Mon setup réel avec Armada."
publishedAt: 2026-11-23
complexity: intermediate
topics: AI Agents, Agent Orchestration, Claude Code, Armada
author: stan-girard
coverImage: /images/resources/orchestrateur-ia-agents/cover-mascotte.webp
coverAlt: "La mascotte The Vibe Company dirige depuis un pupitre une flotte de petits bateaux, chacun dans son propre bassin"
ogImage: /images/resources/orchestrateur-ia-agents/cover-mascotte.webp
---

Un orchestrateur IA est un agent qui découpe le travail, lance des sous-agents (des agents secondaires qui reçoivent chacun une tâche) sur chaque morceau et vérifie que l'ensemble va dans la bonne direction. Pendant longtemps, la question était de savoir combien d'agents vous pouviez lancer en même temps. Aujourd'hui, la vraie question est de savoir comment vous les orchestrez.

Je travaille vraiment comme ça tous les jours. Entre le 9 et le 22 novembre 2026, le repo GitHub d'[Armada](https://github.com/The-Vibe-Company/armada), l'outil que j'ai créé pour faire tourner ces agents, a reçu 2 584 pull requests, dont 2 543 mergées. Hors 79 PR de release automatique, elles viennent des agents que j'orchestre. Compté le 23/11/2026, recherche GitHub [repo:The-Vibe-Company/armada is:pr created:2026-11-09..2026-11-22](https://github.com/The-Vibe-Company/armada/pulls?q=is%3Apr+created%3A2026-11-09..2026-11-22).

Voici le setup, rôle par rôle, avec ce qui marche et ce qui déraille encore.

## Pourquoi lancer plus d'agents ne suffit plus ?

Parce qu'au-delà de quelques agents, c'est vous qui devenez le goulot. Avant, je parlais à plein d'agents à la fois, quatre, cinq, six, parfois dix en parallèle. Je passais mon temps à changer de contexte, d'une conversation à l'autre. Ça a marché un temps.

Puis les modèles sont devenus bien meilleurs pour manager d'autres agents. Ma lecture : Claude Code a mis les sous-agents en avant, puis l'apprentissage par renforcement chez Anthropic, OpenAI et les autres a rendu les modèles plus forts en orchestration. Les nouveaux modèles comme Opus 5.5 ou Fable le sont encore plus.

D'où ma conviction actuelle : « la problématique n'est plus combien d'agents tu peux lancer à la fois, mais c'est plutôt comment est-ce que tu orchestres bien ces agents ».

Concrètement, orchestrer, c'est répondre à quatre questions. Qui découpe le travail ? Quel modèle fait quoi ? Qui vérifie la direction ? Où tournent les agents ? C'est exactement ce qu'il faut régler pour passer d'une démo à des [agents IA en production](/fr/agents-ia-production).

## Quivr V2 : de Grill Me aux tickets, en trois temps

Un interrogatoire, des tickets, puis un orchestrateur qui distribue. La première fois que j'ai travaillé comme ça à grande échelle, c'était pour la V2 de Quivr.

**1. Se faire cuisiner.** J'ai lancé [Grill Me](https://github.com/mattpocock/skills/blob/main/docs/productivity/grill-me.md), un skill de Matt Pocock. L'agent vous interroge, round après round, jusqu'à ce qu'aucune décision ne reste implicite. J'ai répondu à environ 200 questions.

**2. Transformer les réponses en tickets.** Un autre skill de Matt Pocock m'a ensuite aidé à transformer ces réponses en tickets. Chaque ticket portait une décision déjà prise. Les agents n'avaient plus à la deviner. Pour que des agents se répartissent ces tickets, un tableau partagé fait mieux l'affaire que Linear : je l'explique dans [l'article sur le système multi-agent et Vercel Board](/fr/resources/articles/systeme-multi-agent-vercel-board).

**3. Laisser un orchestrateur distribuer.** J'ai dit à un agent, sur Fable à l'époque, de lancer plein de sous-agents et de faire tous les tickets. Une première version d'Armada pilotait alors ces agents dans Conductor.

L'étape 1 compte plus qu'elle n'en a l'air. Chaque réponse donnée en amont est une question qu'aucun sous-agent n'aura à trancher seul, en plein milieu d'une PR.

De Quivr V2 à aujourd'hui, les étapes :

- **Quivr V2** : Grill Me (environ 200 questions), puis des tickets, puis un orchestrateur qui lance des sous-agents.
- **30/09/2026** : première PR sur le repo Armada.
- **Du 9 au 22/11/2026** : 2 584 PR sur Armada, dont 2 543 mergées.
- **Aujourd'hui** : test Opus 5.5, Sol 6.2 et Fable.

Restait un problème très physique.

## Où faire tourner dix agents sans faire fondre son PC ?

Dans des sandboxes, des environnements isolés qui tournent hors de votre machine. Si vous lancez dix agents sur votre poste, il surchauffe. J'en ai eu marre, et c'est pour ça que j'ai créé Armada.

Les sandboxes ont un défaut : elles coûtent de l'argent. Il existe beaucoup de providers. J'aime bien [Boat](https://boat.dev), il y a aussi [Modal](https://modal.com). Selon le besoin, j'ai besoin de l'un ou de l'autre, ou d'une machine que j'héberge moi-même.

[Armada](/fr/portfolio/armada) règle ça. D'après son README, c'est un projet open source sous licence MIT qui donne à chaque tâche de code sa propre machine :

- **Plusieurs providers.** Les sandboxes tournent sur un compte Boat ou Modal connecté, ou sur un hôte Docker que vous enregistrez vous-même.
- **Un agent, un modèle.** Vous lancez Claude Code, Codex ou OpenCode avec le modèle et l'effort de raisonnement que vous choisissez. Armada ne remplace jamais le modèle demandé.
- **Une tâche, une sandbox.** Chaque lancement reçoit sa propre sandbox, avec seulement les identifiants de cet agent.
- **Un point de départ prêt.** Un snapshot garde vos repos et votre setup. Chaque lancement en repart et récupère les derniers commits.
- **Du pilotage en direct.** Vous suivez les événements, vous redirigez l'agent en cours de route, vous l'arrêtez et vous reprenez plus tard.

Le CLI s'installe avec `npm install -g @the-vibe-company/armada`. Il y a aussi un dashboard web et un serveur MCP, tous branchés sur le même serveur Armada. C'est ce dernier point qui compte pour l'orchestration : un agent orchestrateur peut lui-même lancer et suivre d'autres agents.

Si vos tests mettent des heures, réglez ça d'abord. J'en parle dans [l'article sur la software factory IA](/fr/resources/articles/software-factory-ia-tests-rapides) : un orchestrateur ne va jamais plus vite que la suite de tests qui valide ses merges.

Une fois les machines réglées, reste à choisir qui fait quoi.

## Quel modèle pour quel rôle dans une équipe d'agents ?

Le meilleur modèle pour chaque rôle, et le plus cher seulement là où il sert. Voici le setup que je teste en ce moment.

| Rôle | Modèle (mon setup actuel) | Pourquoi |
| --- | --- | --- |
| Orchestrateur | Opus 5.5 | Il découpe, lance les sous-agents et suit l'avancement |
| Sous-agents backend | Sol 6.2 (OpenAI) | À mon avis, il est meilleur pour le backend |
| Sous-agents frontend | Opus 5.5 | À mon avis, il est très bon pour le front |
| Juge, toutes les 10 PR | Fable | Un modèle très intelligent appelé de temps en temps, pour vérifier la direction |

Statut : en test depuis environ deux semaines, résultat pas encore connu.

Le juge est la pièce la plus intéressante. Toutes les dix PR, l'orchestrateur lance un sous-agent sur Fable. Ce sous-agent regarde ce que les autres sous-agents ont produit et dit si le projet va dans la bonne direction.

Pourquoi ne pas tout confier au modèle le plus intelligent ? Pour le coût. Je ne veux pas dépenser trop de tokens avec Opus en tant qu'orchestrateur. Le juge sur Fable n'intervient qu'une fois toutes les dix PR, et il apporte un regard très intelligent sur la direction.

Ce setup peut sembler contredire [l'article sur l'agent harness](/fr/resources/articles/agent-harness-entreprise), qui conseille un seul agent avant l'essaim. Dans son [article sur les systèmes multi-agents](https://claude.com/blog/building-multi-agent-systems-when-and-how-to-use-them), Anthropic déconseille de découper les agents par type de travail, mais garde des exceptions : un frontend et un backend qui avancent en parallèle quand un contrat d'API bien défini les sépare, et le sous-agent de vérification, utile pour imposer des points de contrôle explicites. Mon découpage backend et frontend peut relever de la première, à condition qu'un contrat d'API sépare les deux. Mon juge toutes les dix PR se rapproche de la seconde, même s'il donne un avis sur la direction plutôt qu'un contrôle contre des critères. Et ma raison de coût rejoint le chiffre d'Anthropic : les systèmes multi-agents consomment en général 3 à 10 fois plus de tokens qu'un agent unique pour une tâche équivalente.

Ce juge, je l'ai ajouté pour une raison précise.

## Pourquoi les agents partent-ils en cacahuète, et à quoi sert le juge ?

Parce qu'un orchestrateur seul, face à un gros objectif, peut partir dans le mauvais sens. Depuis quelques semaines, je fais un test : Armada travaille à s'améliorer tout seul, en autonomie. J'y passe une demi-heure à une heure chaque soir, pas plus.

Ce que j'ai vu jusqu'ici :

- **C'est un peu plus lent** que quand je suis derrière pour faire avancer les choses.
- **Des agents partent en cacahuète.** Vous donnez un objectif important à l'orchestrateur, il crée plein de tickets et il y va. Il passe du temps à corriger, et il met parfois en place trop de choses inefficaces.

Le juge toutes les dix PR est ma réponse à ce deuxième point. Il donne seulement son avis sur la direction, sans écrire de code. Si l'orchestrateur s'est mis à empiler des choses inutiles, c'est là que je compte le repérer. Le test dira si ça marche.

Si vous utilisez Claude Code, une partie de ce setup existe déjà dans l'outil.

## Les subagents de Claude Code suffisent-ils pour orchestrer ?

Dans une seule session, oui : les sous-agents de Claude Code (les « subagents ») gèrent les tâches annexes dans leur propre contexte et ne renvoient qu'un résumé. D'après [la documentation de Claude Code](https://code.claude.com/docs/en/sub-agents), chaque sous-agent tourne dans sa propre fenêtre de contexte, avec son prompt système, ses outils et ses permissions.

Trois points utiles pour orchestrer :

- **Vous les définissez dans des fichiers.** Un fichier Markdown dans `.claude/agents/` pour un projet, ou dans `~/.claude/agents/` pour tous vos projets.
- **Vous choisissez le modèle par sous-agent.** Le champ `model` accepte `sonnet`, `opus`, `haiku`, `fable`, un ID complet comme `claude-opus-5-5`, ou `inherit`.
- **Ils comptent dans vos limites.** Leurs requêtes comptent dans les mêmes limites d'usage que la conversation principale.

Pour une session, c'est ce qu'il faut. La doc précise que les sous-agents travaillent dans une seule session. Pour lancer beaucoup de sessions indépendantes en parallèle, elle renvoie aux background agents, et pour une équipe de sessions que Claude lance et supervise, aux agent teams. Armada entre en jeu quand il faut en plus plusieurs machines et des modèles de plusieurs éditeurs. Pour le cadrage côté entreprise, voyez aussi comment [déployer Claude Code en entreprise](/fr/resources/articles/deployer-claude-code-entreprise).

## Par où commencer avec un orchestrateur IA ?

Par le découpage, avant les machines. Voici l'ordre que je suivrais aujourd'hui :

1. **Faites-vous cuisiner** sur le projet avec Grill Me, jusqu'à ce qu'il ne reste plus de décision implicite.
2. **Transformez les réponses en tickets** courts, chacun avec sa décision.
3. **Vérifiez que vos tests tournent en minutes**, sinon l'orchestrateur attendra.
4. **Donnez un modèle à chaque rôle** : orchestrateur, backend, frontend.
5. **Ajoutez un juge périodique** sur un modèle très intelligent, par exemple toutes les dix PR.
6. **Sortez les agents de votre machine** dès que vous en lancez plus de quelques-uns.

## FAQ

### Qu'est-ce qu'un orchestrateur IA ?

C'est un agent qui reçoit un objectif, le découpe en tâches, lance des sous-agents sur chacune et suit leur avancement. Dans mon setup, il tourne sur Opus 5.5 et lance des sous-agents via Armada.

### Quelle différence entre un orchestrateur IA et des agents lancés en parallèle ?

Avec des agents en parallèle, c'est vous qui découpez, suivez et changez de contexte entre les conversations. Avec un orchestrateur, un agent fait ce travail de coordination à votre place, et vous intervenez sur la direction.

### Faut-il utiliser le même modèle pour tous les agents ?

Non. Je donne un modèle à chaque rôle : Opus 5.5 pour l'orchestrateur et le frontend, Sol 6.2 d'OpenAI pour le backend, et Fable comme juge toutes les dix PR, pour ne pas brûler trop de tokens Opus.

### Pouvez-vous faire tourner dix agents sur votre ordinateur ?

Vous pouvez essayer, mais la machine surchauffe. Les sandboxes règlent le problème, mais elles coûtent de l'argent. Armada permet de lancer les agents sur Boat, sur Modal ou sur un hôte Docker que vous gérez.

### Que sont les sous-agents de Claude Code ?

Ce sont des assistants spécialisés, définis dans `.claude/agents/`, qui travaillent chacun dans leur propre fenêtre de contexte et renvoient un résumé. Ils fonctionnent à l'intérieur d'une seule session Claude Code.

Si vous voulez mettre en place ce type d'orchestration sur vos projets, [prenons rendez-vous](https://cal.com/stangirard/thevibecompany).

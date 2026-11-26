---
title: "Context engineering : un ticket sans question pour le PO"
seoTitle: "Context engineering : un ticket sans question pour le PO"
seoDescription: "Context engineering pour vos agents de code : un ticket complet, Grill Me avant le code, un skill pour découper, un board pour suivre. Le guide concret."
slug: context-engineering-agents-ia
translationKey: context-engineering-ai-agents
language: fr
summary: "Un agent de code ne peut pas inventer ce qui manque au ticket. Le guide pour lui faciliter le travail : un ticket prêt pour un agent, Grill Me avant d'écrire, un skill pour découper, un dépôt léger et un board pour suivre."
publishedAt: 2026-11-26
complexity: intermediate
topics: Context Engineering, AI Agents, Claude Code, Grill Me
author: stan-girard
coverImage: /images/resources/context-engineering-agents-ia/cover.webp
coverAlt: "La mascotte The Vibe Company pose la dernière pièce d'un ticket avant de le confier aux agents"
ogImage: /images/resources/context-engineering-agents-ia/cover.webp
---

Le context engineering consiste à choisir ce qu'un agent IA a sous les yeux quand il travaille. Pour un agent de code, ce contexte commence au ticket. L'agent ne peut pas inventer ce que vous n'y avez pas écrit. Le travail tient en un ticket complet, des décisions prises avant le code, un découpage propre et un board de suivi.

Vous confiez déjà des tickets à Claude Code ou à Codex. La PR revient propre, tests au vert. Le résultat, lui, tombe à côté de ce que vous vouliez. Avant d'accuser le modèle, relisez le ticket. Ce qui manque dedans, l'agent l'a décidé à votre place.

Le test : le PO aurait-il encore une question en lisant ce ticket ?

Ma règle tient en une phrase : « Aujourd'hui, si tu veux donner des tâches aux agents, il faut prendre le temps. »

## Qu'est-ce que le context engineering pour un agent de code ?

Pour un agent de code, le context engineering revient à décider ce que l'agent lit avant d'écrire sa première ligne. Cela couvre le ticket et le dépôt, instructions de démarrage comprises.

Anthropic, dans [son article du 29 septembre 2025](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents), présente le context engineering comme la suite naturelle du prompt engineering. Le contexte y désigne l'ensemble des tokens fournis au modèle. Le prompt en fait partie. Le ticket aussi.

Le ticket est la part du contexte que votre équipe produit écrit tous les jours. Je commence par lui, avant de toucher au prompt.

## Pourquoi un agent ne peut-il pas deviner ce qui manque au ticket ?

Parce qu'il démarre sans rien de ce que votre équipe sait sans l'avoir écrit. Il lit le ticket et le dépôt. Rien d'autre.

Prenez un ticket d'une ligne : « Ajouter l'export CSV des factures ». Un développeur de l'équipe sait quelles colonnes la comptabilité attend et qui a le droit d'exporter. Le PO en a parlé en réunion, il s'en souvient. L'agent a une ligne. Alors il choisit seul les colonnes et les droits. La PR est plausible, et vous découvrez un choix produit en lisant un diff.

Ma formule est moins polie : « Les agents, ils ne peuvent pas inventer les choses ». Je l'ai vu en situation réelle. Un agent comble les trous avec ce qu'il a.

## À quoi ressemble un ticket prêt pour un agent ?

Un ticket prêt pour un agent contient tout le besoin et ne laisse aucune question ouverte pour le PO. Deux tests, à passer avant de le confier.

L'idée vient du terrain, chez un client. Là-bas, « Ready for Agent mesure juste si tout le besoin a bien été retranscrit dans un ticket, et s'il n'y a pas de question pour le PO ».

Matt Pocock a un label proche dans son skill [triage](https://github.com/mattpocock/skills/blob/main/docs/engineering/triage.md) : `ready-for-agent`, pour un ticket entièrement spécifié, avec un brief pour l'agent. Le contrôle vu chez ce client va plus loin : zéro question ouverte pour le PO.

Ce contrôle compare aussi le travail de l'agent à celui de quelqu'un qui saurait tout ce que l'équipe sait. « Ready for Agent mesure la divergence entre ce que tu as écrit dans le plan et ce qui est fait vraiment, avec ce qu'il aurait fait s'il avait eu le contexte d'un humain. »

Vous pouvez le faire à la main. Relisez le ticket comme quelqu'un qui n'a assisté à aucune réunion. Cette personne aurait une question pour le PO ? La réponse doit entrer dans le ticket.

Les équipes Scrum connaissent la definition of ready. Un agent n'a personne à qui poser la question dans le couloir : son ticket doit tout dire.

| Critère | Question à poser | Signe qu'il manque |
| --- | --- | --- |
| Besoin entier | Tout ce que le PO a dit à l'oral figure-t-il dans le ticket ? | Le ticket renvoie à une réunion ou à « comme d'habitude » |
| Zéro question ouverte | Quelqu'un qui découvre le sujet aurait-il une question pour le PO ? | Vous découvrez un choix produit en relisant la PR |
| Décisions écrites | Chaque choix est-il tranché, y compris ce que vous refusez ? | Des « à voir » ou des « ou bien » dans le texte |
| Tranche verticale | Le ticket traverse-t-il le schéma, l'API, l'UI et les tests ? | Un ticket ne couvre qu'une couche, par exemple tout le schéma |
| Taille | Tient-il dans une fenêtre de contexte neuve ? | Il faut avoir lu d'autres tickets pour le comprendre |
| Dépendances | Quels tickets doivent être finis avant celui-ci ? | L'ordre n'existe que dans votre tête |
| Critères d'acceptation | Une vérification peut-elle dire que le ticket est fini ? | « Ça marche » sans test ni démonstration |

Les deux premières lignes viennent du contrôle vu chez ce client. Celles sur la tranche, la taille et les dépendances reprennent la documentation de to-tickets, présentée plus bas. Les formulations sont les miennes.

Réécrit, le ticket d'export liste les colonnes et les rôles autorisés. Le format du fichier y figure, tout comme ce qui reste hors périmètre. Le ticket est plus long. C'est normal. Le gabarit ci-dessous, sur un exemple fictif, se copie tel quel :

```markdown
<!-- Exemple fictif : remplacez chaque [crochet] par votre contenu -->
## Export CSV des factures

**Besoin** : [qui veut quoi, et pour quel usage]
**Colonnes** : [liste exacte, dans l'ordre, avec le format de chaque champ]
**Qui peut exporter** : [rôles autorisés ; rôles explicitement exclus]
**Format** : [encodage, séparateur, nom du fichier]
**Hors périmètre** : [ce que ce ticket ne fait pas]
**Dépendances** : [tickets à finir avant celui-ci, ou « aucune »]
**Critères d'acceptation** :
- [ ] [vérification 1, testable]
- [ ] [vérification 2, testable]

**Questions ouvertes pour le PO** : aucune
```

## Pourquoi passer par Grill Me avant d'écrire le ticket ?

Parce que Grill Me fait sortir les décisions que vous n'avez pas encore prises, avant qu'un agent les prenne pour vous. C'est le moyen le plus direct que je connaisse pour fermer les questions ouvertes.

Matt Pocock a écrit ce skill. D'après [sa documentation](https://github.com/mattpocock/skills/blob/main/docs/productivity/grill-me.md), vous le lancez en tapant `/grill-me`, et l'agent ne le lance pas seul. Le skill vous interroge par rounds. Il n'écrit aucun fichier. La même page conseille de laisser le mode plan désactivé, et j'ai déjà raconté [pourquoi je suis passé du mode plan à Grill Me](/fr/resources/articles/claude-code-mode-plan).

La doc de grill-me conseille de compter les rounds, pas les questions. Sa [section Common questions](https://github.com/mattpocock/skills/blob/main/docs/productivity/grill-me.md#common-questions) donne un repère : 46 questions en 4 rounds, c'est une session ordinaire. Si la session monte à 200 questions, la cause est en général un scope trop large. Elle conseille alors de demander à l'agent de découper le travail en morceaux plus petits, puis de passer chaque morceau au grill.

Le piège s'appelle la passivité. Répondre « agreed » quarante fois de suite ne décide rien, parce que c'est vous qui possédez le scope. L'agent pose les questions.

Je mets ce temps de réflexion au même rang que le ticket : « C'est la même chose quand tu fais un Grill Me, quand tu te fais aider des skills pour découper les tickets, pour faire une réflexion : c'est hyper important. »

Une fois les décisions prises, le skill [to-spec](https://github.com/mattpocock/skills/blob/main/docs/engineering/to-spec.md) publie une spec. Si rien n'est encore décidé, sa doc renvoie vers grill-with-docs.

## Faut-il découper les tickets avec un skill ?

Oui, dès que le travail dépasse ce qu'un agent peut faire en une session. En dessous, le skill ne sert à rien.

Ce skill s'appelle [to-tickets](https://github.com/mattpocock/skills/blob/main/docs/engineering/to-tickets.md), toujours chez Matt Pocock. Dans sa doc, [chaque ticket est un tracer bullet](https://github.com/mattpocock/skills/blob/main/docs/engineering/to-tickets.md#tracer-bullets-not-layers) : une tranche verticale qui traverse le schéma, l'API, l'UI et les tests. Le skill le dimensionne pour une fenêtre de contexte neuve. Le ticket déclare aussi ses dépendances, les blocking edges, soit les tickets qui doivent finir avant lui.

Cette doc cite un cas qui calme. Une équipe avait découpé son travail en 26 tickets, par couche. Elle a compté environ 20 runs d'agent par ticket fermé, dont trois quarts de reprise. Je ne l'ai pas observé moi-même.

Découper par couche reste pourtant le réflexe naturel : tout le schéma d'abord, puis toute l'API. Pour l'export des factures, une tranche verticale serait par exemple l'export d'une seule colonne, du bouton jusqu'au fichier, test compris. Elle se vérifie seule.

Le skill ne publie rien sans votre accord. Vous recevez d'abord son découpage, sous forme de quiz. Profitez-en. Le sur-découpage est [le problème le plus signalé](https://github.com/mattpocock/skills/blob/main/docs/engineering/to-tickets.md#common-questions) avec ce skill. Et si tout tient dans une fenêtre de contexte, vous n'avez pas besoin du skill.

## Que doit trouver l'agent dans le dépôt ?

Ce qui sert à chaque session, et le moins possible au-delà. Le reste va dans le ticket.

La raison est un coût. D'après la [documentation writing-for-agents](https://github.com/mattpocock/skills/blob/main/docs/productivity/writing-for-agents.md#common-questions), `CLAUDE.md` se charge à chaque session. Ce qui sert une session sur dix coûte du contexte dans les neuf autres.

Gardez dans `CLAUDE.md` les règles valables pour tout le dépôt. Une précision qui ne concerne qu'une tâche a sa place dans le ticket de cette tâche. C'est la logique du ticket complet, vue depuis le dépôt.

Les réglages d'équipe sont dans [le guide pour déployer Claude Code en entreprise](/fr/resources/articles/deployer-claude-code-entreprise).

## Qui suit ce que font vos agents ?

Un board partagé, que les agents et les humains lisent au même endroit. Avec des tickets complets et bien découpés, vous lancez plusieurs agents. Il faut alors savoir qui tient quoi et ce qui est fini.

Côté suivi, j'ai bougé moi aussi. Pour mes agents, je suis passé de Linear à GitHub Issues. Puis Vercel a sorti Vercel Board, le [18 novembre 2026](https://vercel.com/blog/introducing-vercel-board). L'idée me plaît, avec une réserve : « ça te force à utiliser leur système qui est très bien, mais ça te force à utiliser Vercel ». Je veux faire tourner mon code où je veux.

J'ai construit Open Board pour ça : les agents et les humains y suivent le travail des agents, sur un board qui tourne chez vous. Le code est public sur [github.com/The-Vibe-Company/openboard](https://github.com/The-Vibe-Company/openboard), sous licence Apache-2.0. Open Board parle le protocole HTTP de Vercel Board et gère des messages, des tâches (bail, dépendances, attente, assignation) et un flux d'événements. S'y ajoutent ses comptes, des webhooks signés, un point d'accès MCP, une interface web, un CLI (`ob`) et un skill. Le tout tourne sur SQLite ou sur Postgres.

Le détail est dans [mon guide pour coordonner vos agents sur un board](/fr/resources/articles/systeme-multi-agent-vercel-board). Un ticket complet dit à l'agent quoi faire. Le board vous dit ce qu'il en a fait.

*Mis à jour le 26 novembre 2026. Les repères sur Grill Me, to-tickets, to-spec et writing-for-agents viennent de la documentation de mattpocock/skills, lue le 26 novembre 2026.*

Commencez petit. Prenez votre prochain ticket et passez-le au tableau plus haut. Lancez l'agent quand le PO n'aurait plus aucune question.

Pour mettre vos tickets et vos [agents IA en production](/fr/agents-ia-production) à ce niveau, [prenons rendez-vous](https://cal.com/stangirard/thevibecompany).

## FAQ

### Quelle différence entre context engineering et prompt engineering ?

Le prompt engineering travaille la formulation des instructions. Le context engineering s'occupe de tout ce que le modèle reçoit : Anthropic définit le contexte comme l'ensemble des tokens fournis au modèle, et présente le context engineering comme la suite naturelle du prompt engineering. Pour un agent de code, le ticket et le dépôt en font partie.

### Qu'est-ce qu'une definition of ready pour un agent IA ?

Une definition of ready pour un agent IA tient en deux tests : tout le besoin est écrit dans le ticket, et il ne reste aucune question pour le PO. Viennent ensuite les décisions tranchées et les dépendances déclarées. Des critères d'acceptation vérifiables ferment la liste.

### Qu'est-ce que Grill Me ?

Grill Me est un skill de Matt Pocock qui vous interroge sur une idée, par rounds de questions. Vous le lancez vous-même en tapant `/grill-me` : l'agent ne le lance pas seul. Grill Me n'écrit aucun fichier, et sa documentation conseille de laisser le mode plan désactivé.

### Combien de questions compte une session Grill Me ?

La documentation de Grill Me conseille de compter les rounds plutôt que les questions : 46 questions en 4 rounds, c'est une session ordinaire. À 200 questions, le scope est en général trop large. Découpez alors le travail, puis passez chaque morceau au grill.

### Faut-il un ticket par session d'agent ?

Oui, c'est la règle de to-tickets : chaque ticket est dimensionné pour une fenêtre de contexte neuve et déclare ses dépendances. Si tout le changement tient dans une seule fenêtre de contexte, vous n'avez pas besoin de le découper.

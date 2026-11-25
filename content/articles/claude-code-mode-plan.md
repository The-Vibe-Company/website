---
title: "Le mode plan de Claude Code : un rituel qui rassure, pas un outil qui protège"
seoTitle: "Claude Code plan mode : un rituel qui rassure, sans protéger"
seoDescription: "Le mode plan de Claude Code rassure plus qu'il ne protège. Pourquoi je ne relis plus les plans et passe mon temps sur le ticket, avec Grill Me."
slug: claude-code-mode-plan
translationKey: claude-code-plan-mode
language: fr
summary: "J'ai longtemps demandé un plan à l'IA avant chaque ligne de code. Aujourd'hui je ne les regarde plus : je passe mon temps sur le ticket, avec Grill Me."
publishedAt: 2026-11-19
complexity: intermediate
topics: Claude Code, AI Agents, Engineering
author: stan-girard
coverImage: /images/resources/claude-code-mode-plan/cover-mascotte.webp
coverAlt: "La mascotte The Vibe Company écrit sur un ticket vierge, entourée de bulles de questions, pendant qu'un plan roulé et scellé prend la poussière à côté"
ogImage: /images/resources/claude-code-mode-plan/cover-mascotte.webp
---

Le mode plan de Claude Code rassure plus qu'il ne protège. Vous demandez un plan à l'agent, vous le lisez, vous l'approuvez, et vous avez le sentiment d'avoir gardé la main. Je l'ai fait pendant longtemps. J'ai d'abord relu, puis écrit des skills pour payer les plans moins cher, avant de remonter sur le ticket avec Grill Me. Aujourd'hui je ne regarde plus les plans du tout, et le travail qui compte se passe avant le code.

## Ce que fait le mode plan de Claude Code

Le mode plan (le « plan mode » en anglais) est un mode de permission de Claude Code. D'après [la documentation officielle](https://code.claude.com/docs/en/common-workflows), Claude lit les fichiers et propose un plan, mais ne modifie rien tant que vous ne l'avez pas approuvé.

Pour l'activer, lancez `claude --permission-mode plan`. En cours de session, appuyez sur `Shift+Tab` jusqu'à ce que la barre d'état affiche « plan mode on ».

L'idée est saine. Avant que l'agent touche au disque, vous voyez ce qu'il compte faire et vous pouvez corriger le tir. Sur le papier, c'est une barrière entre l'agent et votre code.

## J'ai relu des plans, de moins en moins bien

À une époque, je demandais toujours un plan à l'IA avant qu'elle code. Puis je le relisais. Au début, ligne par ligne. Ensuite en diagonale. À la fin, je cherchais deux ou trois mots qui m'auraient inquiété, et je validais.

Un plan bien formaté a l'air sérieux. Il a ses étapes numérotées, il cite vos fichiers, il parle le vocabulaire de votre code. À force, je n'avais plus l'attention qu'il faudrait pour y trouver l'erreur. Et l'erreur, quand elle existe, se cache rarement dans les étapes. Elle se cache dans ce que personne n'a décidé avant.

C'est là que le rituel prend le dessus. J'approuvais parce que j'avais lu, pas parce que j'avais vérifié.

## Puis j'ai essayé de rendre les plans moins chers

Ma réponse suivante a été d'outiller. J'ai écrit des skills pour aider l'agent à produire ses plans et pour en réduire le coût. C'est le réflexe que je défends dans [l'article sur les skills](/fr/resources/articles/les-skills) : quand une tâche revient, je l'encode plutôt que de réécrire le prompt.

Les plans sortaient plus vite et coûtaient moins. Mais j'optimisais une étape que je ne lisais déjà plus vraiment. Un plan moins cher que je survole reste un plan que je survole.

## Le vrai travail est remonté sur le ticket

Alors je suis remonté d'un cran dans la chaîne. Aujourd'hui, je passe mon temps sur le ticket. Je réfléchis fort au sujet et je le structure, et pour ça j'utilise [Grill Me](https://github.com/mattpocock/skills/tree/main/skills/productivity/grill-me), un skill de Matt Pocock.

Grill Me fait une chose simple : il vous interroge. Vous le lancez vous-même avec `/grill-me`, l'agent ne le déclenche jamais seul. Il pose ses questions par vagues, jusqu'à ce que vous ayez pris chaque décision. Il n'écrit aucun fichier. Ce qui en sort, c'est une idée plus claire, que je range ensuite dans le ticket.

Une fois le ticket posé comme ça, l'IA est assez intelligente pour implémenter le sujet presque à chaque fois. Le plan qu'elle produirait ne m'apprendrait rien que je n'aie déjà tranché pendant l'interrogatoire. Il lui faut seulement des tests qui répondent pendant qu'elle travaille, sur la machine, comme je l'explique dans [l'article sur la software factory IA](/fr/resources/articles/software-factory-ia-tests-rapides).

Sans ce travail, une session dérive. Vous ouvrez Claude Code avec un objectif flou, et des dizaines de prompts plus tard l'agent a refait la moitié du module. Un ticket bien interrogé avant de commencer reste la façon la plus simple de ne pas en arriver là.

## Matt Pocock éteint le mode plan pour interroger

Ce qui m'a frappé, c'est que [la documentation de Grill Me](https://github.com/mattpocock/skills/blob/main/docs/productivity/grill-me.md) le dit noir sur blanc. Matt Pocock y recommande de laisser le mode plan désactivé pendant l'interrogatoire : il pousse l'agent à se dépêcher de produire un plan, alors que vous voulez qu'il continue à poser des questions.

La même page décrit le piège où je tombais. Répondez « d'accord » quarante fois de suite et vous ressortez avec un plan que l'agent a écrit et que vous avez seulement approuvé d'un hochement de tête. Ça a l'air productif parce que c'était long. Vous n'avez rien décidé. C'est exactement ce que je faisais en relisant mes plans de moins en moins bien.

Tout tient dans le sens de la question. Avec le mode plan, l'agent propose et vous validez. Avec Grill Me, l'agent demande et vous décidez. Le premier vous laisse passif devant un texte convaincant, le second vous oblige à vous mouiller.

| | Mode plan | Grill Me |
| --- | --- | --- |
| Qui pose les questions | L'agent, en cours de route, puis il propose son plan | L'agent, par vagues, jusqu'à ce que vous ayez tout décidé |
| Qui décide | Vous, en approuvant le plan | Vous, question après question |
| Quand | Avant que l'agent touche au code | Avant même le plan, sur le ticket |
| Ce qui reste | Un plan écrit à relire | Des décisions dans votre tête, puis dans le ticket |

## Anthropic dit de lire le plan, et de vous faire interroger

L'objection la plus juste vient d'Anthropic. Dans [Claude Academy](https://academy.claude.com/fr/courses/claude-code-in-action/steering-long-sessions), la leçon sur les sessions longues dit : « Lorsque vous recevez ce plan, lisez-le réellement. Ne le survolez pas. »

Je suis d'accord avec l'intention. Un plan que personne ne lit ne sert à rien. Mon point, c'est autre chose : même une lecture honnête arrive trop tard si vous n'avez rien décidé avant.

Et Anthropic le dit aussi, dans ses [best practices Claude Code](https://code.claude.com/docs/en/best-practices) : « Ask Claude to interview you instead. » Quand vous ne savez pas encore exactement ce que vous voulez, faites-vous interroger. C'est exactement le mouvement que Grill Me force, et la raison pour laquelle le temps que je passais à relire des plans est remonté sur le ticket.

## Alors, faut-il utiliser le mode plan ?

Le plan, c'est ce que vous gardez quand vous voulez un contrôle humain à cet endroit précis. Si vous [déployez Claude Code dans une équipe](/fr/resources/articles/deployer-claude-code-entreprise) qui découvre les agents, voir le plan avant les modifications peut aider à prendre confiance. Ne le confondez simplement pas avec une protection.

En pratique, je m'en fiche complètement. Aujourd'hui je ne regarde plus les plans du tout. Je passe beaucoup de temps dans Grill Me sur le ticket, et c'est tout.

Si vous voulez que je regarde vos tickets avec vous plutôt que vos plans, [prenez rendez-vous](https://cal.com/stangirard/thevibecompany).

## FAQ

### Qu'est-ce que le mode plan de Claude Code ?

C'est un mode de permission dans lequel Claude lit les fichiers et propose un plan, sans rien modifier tant que vous ne l'avez pas approuvé.

### Comment activer le mode plan dans Claude Code ?

Lancez `claude --permission-mode plan`, ou appuyez sur `Shift+Tab` en cours de session jusqu'à voir « plan mode on » dans la barre d'état.

### Faut-il utiliser le mode plan ?

Oui si vous voulez un contrôle humain avant chaque modification. Mais relire un plan protège peu. Le temps est mieux placé sur le ticket, par exemple avec Grill Me.

### Grill Me remplace-t-il le mode plan ?

Ils ne font pas la même chose. Le mode plan fait proposer un plan par l'agent. Grill Me vous interroge jusqu'à ce que vous ayez pris chaque décision, et sa documentation conseille de laisser le mode plan désactivé pendant la session.

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

Le mode plan de Claude Code rassure plus qu'il ne protège. On demande un plan à l'agent, on le lit, on l'approuve, et on a le sentiment d'avoir gardé la main. Je l'ai fait pendant longtemps. Aujourd'hui je ne regarde plus les plans du tout, et le travail qui compte se passe avant : sur le ticket.

## Ce que fait le mode plan de Claude Code

Le mode plan (le « plan mode » en anglais) est un mode de permission de Claude Code. D'après [la documentation officielle](https://code.claude.com/docs/en/common-workflows), Claude lit les fichiers et propose un plan, mais ne modifie rien tant que vous ne l'avez pas approuvé.

Pour l'activer, lancez `claude --permission-mode plan`. En cours de session, appuyez sur `Shift+Tab` jusqu'à ce que la barre d'état affiche « plan mode on ».

L'idée est saine. Avant que l'agent touche au disque, vous voyez ce qu'il compte faire et vous pouvez corriger le tir. Sur le papier, c'est une barrière entre l'agent et votre code.

## J'ai relu des plans, de moins en moins bien

À une époque, je demandais toujours un plan à l'IA avant qu'elle code. Puis je le relisais. Au début, ligne par ligne. Ensuite en diagonale. À la fin, je cherchais deux ou trois mots qui m'auraient inquiété, et je validais.

Un plan bien formaté a l'air sérieux. Il a ses étapes numérotées, il cite vos fichiers, il parle le vocabulaire de votre code. Au vingtième, on n'a plus l'attention qu'il faudrait pour y trouver l'erreur. Et l'erreur, quand elle existe, se cache rarement dans les étapes. Elle se cache dans ce que personne n'a décidé avant.

C'est là que le rituel prend le dessus. On approuve parce qu'on a lu, pas parce qu'on a vérifié.

## Puis j'ai essayé de rendre les plans moins chers

Ma réponse suivante a été d'outiller. J'ai écrit des skills pour aider l'agent à produire ses plans et pour en réduire le coût. C'est le réflexe que je défends dans [l'article sur les skills](/fr/resources/articles/les-skills) : quand une tâche revient, on l'encode plutôt que de réécrire le prompt.

Les plans sortaient plus vite et coûtaient moins. Mais j'optimisais une étape que je ne lisais déjà plus vraiment. Un plan moins cher que je survole reste un plan que je survole.

## Le vrai travail est remonté sur le ticket

Alors je suis remonté d'un cran dans la chaîne. Aujourd'hui, je passe mon temps sur le ticket. Je réfléchis fort au sujet et je le structure, et pour ça j'utilise [Grill Me](https://github.com/mattpocock/skills/tree/main/skills/productivity/grill-me), un skill de Matt Pocock.

Grill Me fait une chose simple : il vous interroge. Vous le lancez vous-même avec `/grill-me`, l'agent ne le déclenche jamais seul. Il pose ses questions par vagues, jusqu'à ce que chaque décision soit prise. Il n'écrit aucun fichier. Ce qui en sort, c'est une idée plus claire, que je range ensuite dans le ticket.

Une fois le ticket posé comme ça, l'IA est assez intelligente pour implémenter le sujet presque à chaque fois. Le plan qu'elle produirait ne m'apprendrait rien que je n'aie déjà tranché pendant l'interrogatoire.

Sans ce travail, une session dérive. On ouvre Claude Code avec un objectif flou, et des dizaines de prompts plus tard on a refait la moitié du module. On a construit [VibeDrift](/fr/portfolio/vibedrift) pour voir ce moment arriver, commit par commit. Un ticket bien interrogé avant de commencer reste la façon la plus simple de ne pas en arriver là.

## Matt Pocock conseille d'éteindre le mode plan

Ce qui m'a frappé, c'est que [la documentation de Grill Me](https://github.com/mattpocock/skills/blob/main/docs/productivity/grill-me.md) le dit noir sur blanc. Matt Pocock y recommande de laisser le mode plan désactivé : il pousse l'agent à se dépêcher de produire un plan, alors qu'on veut qu'il continue à poser des questions.

La même page décrit le piège où je tombais. Répondez « d'accord » quarante fois de suite et vous ressortez avec un plan que l'agent a écrit et que vous avez seulement approuvé d'un hochement de tête. Ça a l'air productif parce que c'était long. Vous n'avez rien décidé. C'est exactement ce que je faisais en relisant mes plans de moins en moins bien.

Tout tient dans le sens de la question. Avec le mode plan, l'agent propose et vous validez. Avec Grill Me, l'agent demande et vous décidez. Le premier vous laisse passif devant un texte convaincant, le second vous oblige à vous mouiller.

## Ce qui protège, c'est une porte après le code

Si le plan ne protège pas, qu'est-ce qui protège ? Pas un document qu'on lit avant. Un contrôle qui s'applique après, sur ce qui a vraiment été livré.

Dans une AI Factory que The Vibe Company fait tourner pour un client, cette protection se trouve à l'étape « Ready for QA ». Un juge IA y vérifie chaque critère d'acceptation du ticket et signale le code qui sort du périmètre. Il propose, il n'écrit rien dans l'outil de tickets.

Ce juge ne vérifie que les critères qu'on a écrits. Le temps passé dans Grill Me n'est donc pas perdu : c'est lui qui produit ces critères. Même logique qu'avec [des tests qui tournent en quelques minutes](/fr/resources/articles/software-factory-ia-tests-rapides) : ce qui protège, c'est ce qui vérifie, pas ce qui rassure. J'ai décrit ce qui entoure l'agent une fois le ticket écrit dans l'article sur [le harnais d'agents en entreprise](/fr/resources/articles/agent-harness-entreprise).

## Alors, faut-il utiliser le mode plan ?

Le plan, c'est ce qu'on garde quand on veut un contrôle humain à cet endroit précis. Si vous [déployez Claude Code dans une équipe](/fr/resources/articles/deployer-claude-code-entreprise) qui découvre les agents, voir le plan avant les modifications peut aider à prendre confiance. Ne le confondez simplement pas avec une protection.

En pratique, je m'en fiche complètement. Aujourd'hui je ne regarde plus les plans du tout. Je passe beaucoup de temps dans Grill Me sur le ticket, et c'est tout.

Si vous voulez qu'on regarde ensemble vos tickets plutôt que vos plans, [prenez rendez-vous](https://cal.com/stangirard/thevibecompany).

## FAQ

### Qu'est-ce que le mode plan de Claude Code ?

C'est un mode de permission dans lequel Claude lit les fichiers et propose un plan, sans rien modifier tant que vous ne l'avez pas approuvé.

### Comment activer le mode plan dans Claude Code ?

Lancez `claude --permission-mode plan`, ou appuyez sur `Shift+Tab` en cours de session jusqu'à voir « plan mode on » dans la barre d'état.

### Faut-il utiliser le mode plan ?

Oui si vous voulez un contrôle humain avant chaque modification. Mais relire un plan protège peu. Le temps est mieux placé sur le ticket, par exemple avec Grill Me, puis sur un contrôle du code livré contre ses critères d'acceptation.

### Grill Me remplace-t-il le mode plan ?

Ils ne font pas la même chose. Le mode plan fait proposer un plan par l'agent. Grill Me vous interroge jusqu'à ce que chaque décision soit prise, et sa documentation conseille de laisser le mode plan désactivé pendant la session.

---
title: "Comment mon travail se documente tout seul"
slug: mon-travail-se-documente-tout-seul
language: fr
summary: "Je ne tiendrai jamais un journal à la main. Alors j'ai monté un système qui documente mon parcours tout seul : un filet qui garde la trace de tout ce que je touche, et une couche qui relit mes conversations pour en tirer le pourquoi, déclenchée à chaque jalon. Sans que j'aie rien à remplir. Et en écrivant cet article, je l'ai encore amélioré."
publishedAt: 2026-07-03
series: victor-story
seriesDay: 7
focus: true
topics: AI Journey, Documentation, Automatisation
coverImage: /images/resources/mon-travail-se-documente-tout-seul/cover.png
coverAlt: "Mon avatar, café en main, et la mascotte VB devant un carnet qui se remplit tout seul de traces de travail, dans la direction artistique maison"
ogImage: /images/resources/mon-travail-se-documente-tout-seul/cover.png
---

Mes premiers jours chez The Vibe Company, je n'ai rien documenté. Je construisais mon premier site, la tête dans le guidon.

Puis Stan et Antoine m'ont dit une chose simple. Ce que tu fais là, il faudrait le raconter, et ce serait bien de montrer deux versions du site, l'avant et l'après.

Sauf que je n'avais jamais gardé la première version, une simple liste d'animés toute brute. Elle n'existait plus à l'écran.

J'ai réussi à la retrouver en fouillant sur GitHub, là où mon code est archivé au fil du temps, juste à temps. Mais je me suis fait une promesse, plus jamais ça.

![Mon avatar, café en main, et la mascotte VB devant un carnet qui se remplit tout seul de traces de travail](/images/resources/mon-travail-se-documente-tout-seul/cover.png "Mon travail qui se capte et s'archive tout seul, pendant que je regarde.")

Le problème, ce n'est pas que j'oublie ce que je fais. Je sais très bien sur quoi j'ai passé ma semaine.

Ce que je ne ferai jamais, c'est tenir un journal à la main, garder une image de chaque version, noter chaque étape et pourquoi je l'ai prise. Sur quatre mois de parcours à raconter, ce serait un travail de fourmi.

Alors je l'ai automatisé. Entièrement. J'ai mis en place un skill dont le seul rôle est de documenter mon parcours à ma place.

Un skill, c'est le mode d'emploi que je donne à l'IA pour qu'elle refasse une tâche toujours de la même façon.

Le mot important, c'est « à ma place ». Je ne remplis rien, je ne note rien. Ça tourne pendant que je travaille.

Voici comment. Et comment, au passage, j'ai trouvé des trous dans ce système et je les ai bouchés.

## Deux couches, dont aucune n'est moi

Documenter tout seul a un piège. Si le système enregistre tout bêtement, je me noie sous des lignes qui ne veulent rien dire. S'il essaie de tout résumer, il rate l'essentiel.

D'où deux couches. La première attrape les traces, le quoi et le quand. La seconde attrape le sens, le pourquoi.

Les deux tournent sans moi.

![Schéma des deux couches : le filet capte le quoi et le quand, la couche du sens capte le pourquoi à chaque jalon, le tout automatique](/images/resources/mon-travail-se-documente-tout-seul/schema-deux-couches.png "Les deux couches en un coup d'œil : le filet pour le quoi et le quand, le sens pour le pourquoi.")

## La première couche : le filet qui n'oublie rien

Elle repose sur un hook. Un hook, c'est une règle qui se déclenche toute seule sur une action précise, sans que personne ne la lance. Celui-là se réveille dès qu'un fichier est créé ou modifié.

```json
"PostToolUse": [
  {
    "matcher": "Edit|Write|MultiEdit|NotebookEdit",
    "hooks": [
      { "command": "node journey-project-activity.mjs --touch" }
    ]
  }
]
```

Chaque fois que l'IA touche un fichier, quel que soit le chat et quel que soit le projet, une ligne s'ajoute dans un journal. Date, projet, fichier. Rien de plus.

Ça ne raconte rien, mais ça ne perd rien.

Deux autres traces s'ajoutent au filet, toujours sans moi. Les skills, inventoriés par un script qui lit leur nom et leur date de création. Et mes livraisons, ces fameuses PR (des demandes d'intégration de mon code, datées et gardées sur GitHub), qu'un autre script remonte toutes.

Au moment d'écrire, je relis ce filet, regroupé par projet et par jour :

```
node journey-project-activity.mjs --rollup --days 14
```

Ce que ça me sort ressemble à ça :

```
## TVC
- 2026-07-02 · 3 éditions, 3 fichiers
    reviews/08-comment-je-documente/article.md, website/content/articles/veille.md
```

Même après une semaine à rallonge, j'ai sous les yeux ce qui a réellement bougé. Sans avoir rien noté.

Voilà pour le quoi et le quand. Le pourquoi, lui, se capte autrement, et c'est la partie qui a le plus bougé sous mes yeux, en écrivant cet article.

## La deuxième couche : le pourquoi, et le trou que j'ai trouvé

Le filet sait le quoi et le quand. Il ne sait pas le pourquoi. Un fichier qui change un mardi ne dit pas que j'étais bloqué, ni pourquoi j'ai tranché comme ça.

Ce pourquoi est à un seul endroit, la conversation que je viens d'avoir avec l'IA. C'est le plus précieux, et le plus dur à attraper.

Au début, ma règle était simple. À chaque fois que je livre une PR, l'IA relit le chat depuis la précédente et en écrit le sens. Le titre de la PR donne le quoi, le chat donne le pourquoi.

Sauf qu'en écrivant cet article, je suis tombé sur un premier trou. Ma règle était molle.

L'IA était censée y penser, mais rien ne la forçait, donc elle pouvait l'oublier. C'est exactement ce qui me faisait des trous.

Alors on l'a rendue mécanique, comme le filet des fichiers. Toutes mes PR passent par une commande, `gh pr create`. Un hook la guette et déclenche la capture à coup sûr.

```json
{ "matcher": "Bash", "hooks": [{ "command": "node journey-chat-capture.mjs" }] }
```

Plus aucun oubli possible. À chaque PR, tout le chat depuis la précédente est déposé dans un fichier. Automatique, et gratuit, parce que c'est juste une lecture, sans intelligence à ce stade.

Puis un deuxième trou est apparu. Certains projets ne sont pas encore sur GitHub.

En ce moment je travaille sur The Vibe Experience, qui vit encore sur Linear, notre outil de suivi, sans la moindre PR. Donc rien à capturer ?

On a ajouté exactement la même règle, branchée cette fois sur les mises à jour de tickets Linear, les fiches de tâches du projet.

Et là, dans la foulée, sans que je fasse quoi que ce soit, un fichier de capture est apparu : « Ticket Linear : Rattrapage, The Vibe Experience », tout le fil de la conversation où je bossais dessus, prêt à devenir un jalon. Le système marchait déjà, pendant qu'on en parlait.

Et il restait un troisième trou, le plus savoureux. Modifier un skill, comme je le fais tout le temps, ne captait pas la conversation autour. Le filet notait bien quel fichier avait changé, mais pas le pourquoi de ce changement.

Alors je l'ai ajouté aussi. Maintenant, dès que je touche à un skill, le chat est capturé, exactement comme pour une PR ou un ticket.

```
// dans journey-chat-capture : si le fichier édité est un skill,
// on capte le chat, comme pour une PR ou un ticket.
if (/[/\\]skills[/\\]/.test(fichier)) capturer();
```

Autrement dit, même le système qui me documente se documente lui-même quand je l'améliore. Y compris à l'instant, en écrivant ces lignes.

Je mesure ce que je viens de faire. En rédigeant ce seul article, en une soirée, j'ai modifié ce système trois fois, en direct : une règle molle rendue mécanique, la capture des tickets Linear, puis celle des skills.

C'est exactement ça, un skill qui n'est jamais fini. Et c'est pour ça qu'il finit par tout attraper.

## Le sens, écrit par l'IA, jamais par moi

Une fois le chat capturé, il faut en tirer le sens. Ça, aucun script bête ne peut l'inventer, il faut comprendre ce qui s'est dit. C'est l'IA qui le fait, à partir de la matière brute, dans une note courte, toujours la même trame.

Voici celle qu'elle a écrite ce soir, sur le trou qu'on venait juste de boucher :

```
Pourquoi ça compte : je ratais des captures, ma règle reposait sur la bonne volonté de l'IA.
Ce qui a changé : un hook sur gh pr create, la capture ne dépend plus de personne.
Le raisonnement : rendre mécanique ce qui était mou, comme le filet des fichiers.
Le rôle de l'IA : c'est elle qui écrit ce sens, moi je ne remplis rien.
Ce que j'ai appris : une règle qu'on doit penser à appliquer finit toujours par sauter.
```

Le seul moment où je remets la main à la pâte, c'est quand j'écris un article comme celui-ci. Le skill de rédaction lit tout ce qui a été capturé, en tire le récit, et me pose quelques questions ciblées pour ce qui lui manque. Là, je réponds.

Pour la documentation elle-même, je ne remplis jamais rien.

## Ce que j'en retiens

On peut faire en sorte que son travail se documente vraiment tout seul. Un filet mécanique pour les traces, une couche qui relit les conversations pour le sens, déclenchée à chaque jalon, une PR ou un ticket. Sans lever le petit doigt.

Le vrai gain, c'est le temps et la charge mentale. Documenter quatre mois de parcours à la main, étape par étape, m'aurait pris un temps fou et fait avancer deux fois moins de projets.

Et surtout, le système n'est jamais figé. Rien qu'en écrivant cet article, j'ai trouvé trois trous et je les ai bouchés. C'est le principe, chaque fois que quelque chose passe à travers, ça devient un filet de plus.

Pour une entreprise, ça veut dire que le savoir, ce qui a été fait et pourquoi, ne s'évapore pas quand un chat se ferme ou quand quelqu'un oublie. Il reste écrit, daté, réutilisable.

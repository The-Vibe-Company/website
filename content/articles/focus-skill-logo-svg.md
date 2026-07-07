---
title: "Comment créer un logo épuré avec l'IA"
slug: focus-skill-logo-svg
language: fr
summary: "Je ne suis pas designer, mais notre produit avait besoin d'un logo. Plutôt que de demander à une IA une image clinquante et inutilisable, j'ai fait un skill qui regarde un logo que j'aime, en tire l'idée sans copier la forme, et me sort un logo épuré et net à toute taille, prêt à l'emploi."
publishedAt: 2026-07-07
series: victor-story
seriesDay: 9
focus: true
topics: AI Journey, Design, Skills
coverImage: /images/resources/focus-skill-logo-svg/cover.png
coverAlt: "Mon avatar et la mascotte VB devant un logo épuré en noir et blanc, dans la direction artistique maison"
ogImage: /images/resources/focus-skill-logo-svg/cover.png
---

[Companion](https://www.thecompanion.sh/), un de nos produits, avait besoin d'une nouvelle identité. Et une identité, ça commence par un logo.

Je ne suis pas designer. Je n'allais pas ouvrir un logiciel de graphisme que je ne sais pas utiliser.

Mon premier réflexe a été de demander un logo à une IA qui génère des images. À chaque fois, le même genre de résultat, un dégradé, une forme brillante, un pictogramme clinquant. Joli deux secondes, inutilisable pour de vrai.

Je voulais quelque chose de solide et de cohérent, pas un coup de chance impossible à refaire. Alors j'ai fait un skill pour ça.

Un skill, c'est le mode d'emploi que je donne à l'IA pour qu'elle refasse une tâche toujours de la même façon. Je lui ai dit ce que je cherchais, un logo tout simple et sobre, dans l'esprit de deux logos qu'on aime, The Vibe Company (le nôtre) et Nike.

![Les deux logos que j'ai donnés au skill en référence, The Vibe Company et Nike](/images/resources/focus-skill-logo-svg/references.png "Les deux logos que j'aime et que j'ai donnés au skill en référence, The Vibe Company et Nike")

## Le principe, pas la copie

Le cœur du skill tient en deux lignes :

« Le skill ne copie jamais un logo existant. Il en extrait le principe, l'idée de conception, pas la forme. »

En clair, je lui donne un ou deux logos que j'aime. Il regarde bien leur forme, mais pas pour la recopier. Il s'en sert pour comprendre l'idée qui les rend forts, et c'est cette idée qu'il réutilise pour inventer le nôtre.

Voici comment il a lu mes deux premières références, mot pour mot dans le skill :

```
Nike : le mouvement capturé en un seul geste continu, une virgule qui accélère.
The Vibe Company : un bloc simple aux angles arrondis qui tient un motif fin et rythmé à l'intérieur.
```

On garde l'idée, on invente notre propre dessin.

## Le goût, mis en dur dans le skill

Ce qui fait qu'un logo tient la route, je l'ai écrit dans le skill comme des règles qui ne bougent jamais. En voici quatre, copiées telles quelles :

« Simple et épuré. Un logo, une idée. Si on ne peut pas le décrire en une phrase, il est trop chargé. »

« Noir et blanc d'abord. Il doit marcher en noir sur clair et en blanc sur foncé, la couleur vient après. »

« Du vide. L'espace négatif fait autant le logo que la forme. »

« Lisible en tout petit. Test favicon 16 px : si un détail disparaît ou devient une bouillie, on l'enlève. »

Ma préférée, c'est la dernière. Le favicon, c'est la petite icône dans l'onglet du navigateur, une quinzaine de pixels de côté. On voulait un logo qui survive même à cette taille miniature.

## Ce qu'il refuse de faire

J'ai aussi listé les tics du logo « fait par IA », ceux qu'il doit fuir. C'est exactement ce que me sortaient les générateurs d'images :

1. Le dégradé, l'ombre portée, le reflet, la 3D.
2. Trois idées entassées dans un seul symbole.
3. Le cliché littéral, une ampoule pour « idée », un cerveau pour « intelligence artificielle ».

En lui interdisant tout ça, je le force à faire simple. C'est là que les logos deviennent propres.

## Un dessin qui est en fait du code

La grande différence avec un générateur d'images, c'est la sortie. Un générateur me rend une image figée, faite de points de couleur, floue dès qu'on l'agrandit. Le skill, lui, me rend un logo vectoriel.

Un logo vectoriel, c'est littéralement du code, une suite d'instructions de dessin. Dans le skill, j'ai même figé comment ce code doit s'écrire :

```
viewBox carré, par exemple 0 0 100 100
fill="currentColor"   (le logo prend la couleur du texte autour)
une seule couleur, fond transparent
pas de filtre, pas de dégradé, pas d'effet lumineux
```

La ligne qui compte le plus, c'est `fill="currentColor"`. Elle laisse le logo prendre la couleur de ce qui l'entoure, au lieu d'une couleur figée dans le fichier.

Et comme tout reste du code, le logo est net à n'importe quelle taille et s'édite après coup.

## Comment ça se passe, concrètement

Quand je lance le skill, il commence par comprendre la marque. Je lui donne le lien de notre site, il l'analyse pour saisir ce qu'on fait et l'impression qu'on veut donner. Puis il lit les logos que je lui donne en référence et en tire les principes.

Ensuite il propose deux ou trois concepts vraiment différents, pas des variantes du même trait, et me les montre côte à côte, en grand et en tout petit. Je choisis, il affine, et il me livre les fichiers, une version noire et une blanche.

## Le logo de Companion

Je l'ai lancé pour de vrai dans Claude Design, sur l'identité de Companion. Premier essai, cinq logos, déclinés à partir de deux ou trois idées. Un nous plaisait, on tenait l'idée, mais on sentait qu'on pouvait viser plus juste.

Alors j'ai fait une chose que je trouve amusante. J'ai ajouté ce logo au skill, comme troisième référence, à côté de The Vibe Company et de Nike. Une ligne de plus dans la même liste :

```
Stack : trois barres arrondies empilées, une couche décalée qui crée le rythme. L'empilement propre, une seule idée.
```

Le skill apprenait de son propre résultat, et cette ligne, c'est ce qui l'a poussé vers le bon logo.

![Le logo qu'on aimait au premier essai, trois barres arrondies empilées](/images/resources/focus-skill-logo-svg/stack-logo.png "Le logo du premier essai, trois lignes empilées, qu'on a ajouté au skill comme référence")

Nouvelle conversation, même demande. Cette fois, il a sorti le bon, un C, celui de Companion, dessiné avec trois lignes, en noir et blanc.

Une fois ce dessin validé, je lui ai demandé des variantes en couleur. C'est comme ça qu'on a trouvé la version finale.

![Le logo Companion, un C formé de trois lignes courbes en dégradé orange, suivi du mot Companion](/images/resources/focus-skill-logo-svg/companion-logo.png "Le logo final de Companion, le C à trois lignes en couleur")

## Ce que j'en retiens

Une IA à qui on demande juste « un beau logo » recrache la moyenne de tout ce qu'elle a vu, donc du générique. Ce skill vise le principe plutôt que la copie, et c'est ce qui sépare une image jetable d'un logo qu'on garde.

Mon rôle, dans tout ça, c'est de juger, pas de dessiner. Je donne les références, je tranche, le goût est déjà écrit dans le skill.

---
title: "Le skill qui me dessine un logo épuré"
slug: focus-skill-logo-svg
language: fr
summary: "Je ne suis pas designer, mais notre produit avait besoin d'un logo. Plutôt que de demander à une IA une image clinquante et inutilisable, j'ai fait un skill qui part d'un logo que j'aime, en extrait le principe et pas la forme, et me sort un logo épuré et net à toute taille, prêt à l'emploi."
publishedAt: 2026-07-07
series: victor-story
seriesDay: 9
focus: true
topics: AI Journey, Design, Skills
coverImage: /images/resources/focus-skill-logo-svg/cover.png
coverAlt: "Mon avatar et la mascotte VB devant un logo épuré en noir et blanc, dans la direction artistique maison"
ogImage: /images/resources/focus-skill-logo-svg/cover.png
---

Companion, notre produit, avait besoin d'une nouvelle identité. Et une identité, ça commence par un logo.

Je ne suis pas designer. Je n'allais pas ouvrir un logiciel de graphisme que je ne sais pas utiliser.

Mon premier réflexe a été de demander un logo à une IA qui génère des images. À chaque fois, le même genre de résultat, un dégradé, une forme brillante, un pictogramme clinquant. Joli deux secondes, inutilisable pour de vrai.

Je voulais quelque chose de solide et de cohérent, pas un coup de chance impossible à refaire. Alors j'ai fait un skill pour ça.

Un skill, c'est le mode d'emploi que je donne à l'IA pour qu'elle refasse une tâche toujours de la même façon. Je lui ai dit ce que je cherchais, un logo tout simple et sobre, dans l'esprit de deux logos qu'on aime, The Vibe Company et Nike.

## Le principe, pas la forme

Le cœur du skill tient en une phrase, écrite dans son mode d'emploi :

« Le skill ne copie jamais un logo existant. Il en extrait le principe, l'idée de conception, pas la forme. »

En clair, je lui donne un ou deux logos que j'aime, il ne les recopie pas. Il nomme d'abord ce qui les rend forts, puis il s'en sert pour inventer autre chose.

Le skill garde même des exemples de cette lecture. Pour Nike, il retient « le mouvement capturé en un seul geste continu, une virgule qui accélère ».

Ce n'est pas une description de la forme, c'est une idée. On garde l'idée, on jette le dessin, on invente le nôtre.

## Le goût, mis en dur dans le skill

Ce qui fait qu'un logo tient la route, je l'ai écrit dans le skill comme des règles qui ne bougent jamais. En voici quatre, copiées telles quelles :

« Simple et épuré. Un logo, une idée. Si on ne peut pas le décrire en une phrase, il est trop chargé. »

« Noir et blanc d'abord. Il doit marcher en noir sur clair et en blanc sur foncé, la couleur vient après. »

« Du vide. L'espace négatif fait autant le logo que la forme. »

« Lisible en tout petit. Test favicon 16 px : si un détail disparaît ou devient une bouillie, on l'enlève. »

Ma préférée, c'est la dernière. Le favicon, c'est la petite icône dans l'onglet du navigateur, une quinzaine de pixels de côté. Un logo qui ne survit pas à cette taille n'est pas un bon logo.

## Ce qu'il refuse de faire

J'ai aussi listé les tics du logo « fait par IA », ceux qu'il doit fuir. C'est exactement ce que me sortaient les générateurs d'images :

1. Le dégradé, l'ombre portée, le reflet, la 3D.
2. Trois idées empilées dans un seul symbole.
3. Le cliché littéral, une ampoule pour « idée », un cerveau pour « intelligence artificielle ».

En lui interdisant tout ça, je le force à faire simple. C'est là que les logos deviennent propres.

## Un dessin qui est en fait du texte

La grande différence avec un générateur d'images, c'est la sortie. Un générateur me rend une image figée, faite de points de couleur, floue dès qu'on l'agrandit. Le skill, lui, me rend un logo vectoriel.

Un logo vectoriel, c'est littéralement du texte, une suite d'instructions de dessin. C'est pour ça qu'il reste net à n'importe quelle taille, du tout petit jusqu'à une grande affiche, et qu'il s'édite après coup.

Ce texte contient par exemple ce petit réglage :

fill="currentColor"

Il dit au logo de prendre tout seul la couleur du texte autour de lui. Un dessin, deux usages.

## Comment ça se passe, concrètement

Quand je lance le skill, il suit toujours le même chemin :

1. Il cadre. Ce que représente la marque, ce qu'elle doit dégager en un mot, où vivra le logo.
2. Il lit mes références et en tire les principes.
3. Il propose deux ou trois concepts vraiment différents, chacun résumable en une phrase, pas trois variantes du même trait.
4. Il les dessine et me les montre côte à côte, sur fond clair, sur fond foncé, et en tout petit.
5. Je choisis, il affine, et il livre les fichiers finaux, une version noire, une version blanche.

## Le logo de Companion

Je l'ai lancé pour de vrai dans Claude Design, sur l'identité de Companion. Premier essai, cinq logos, déclinés à partir de deux ou trois idées. Un nous plaisait, on tenait l'idée, mais on sentait qu'on pouvait viser plus juste.

Alors j'ai fait une chose que je trouve amusante. J'ai ajouté ce logo qu'on venait d'obtenir dans le skill, comme troisième référence, à côté de The Vibe Company et de Nike. Le skill apprenait de son propre résultat.

![Le logo qu'on aimait au premier essai, trois barres arrondies empilées](/images/resources/focus-skill-logo-svg/stack-logo.png "Le logo du premier essai, trois lignes empilées, qu'on a ajouté au skill comme référence")

Nouvelle conversation, même demande. Cette fois, il a sorti le bon, un C, celui de Companion, dessiné avec trois lignes, en noir et blanc.

Une fois ce dessin validé, je lui ai demandé des variantes en couleur. C'est comme ça qu'on a trouvé la version finale.

![Le logo Companion, un C formé de trois arcs en dégradé orange, suivi du mot Companion](/images/resources/focus-skill-logo-svg/companion-logo.png "Le logo final de Companion, le C à trois lignes en couleur")

## Ce que j'en retiens

Une IA à qui on demande juste « un beau logo » recrache la moyenne de tout ce qu'elle a vu, donc du générique. Ce skill vise le principe plutôt que la copie, et c'est ce qui sépare une image jetable d'un logo qu'on garde.

Mon rôle, dans tout ça, c'est de juger, pas de dessiner. Je donne les références, je tranche, le goût est déjà écrit dans le skill.

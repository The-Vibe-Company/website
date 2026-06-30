---
title: "Le secret d'une DA maison : un skill qui verrouille notre style"
slug: focus-skill-images
language: fr
summary: "Comment un skill verrouille notre direction artistique et génère nos images, extraits de l'outil à l'appui, sans que je sois graphiste ni codeur."
publishedAt: 2026-07-01
series: victor-story
seriesDay: 5
focus: true
topics: AI Journey, Skills, Direction artistique
coverImage: /images/resources/focus-skill-images/cover.png
coverAlt: "La mascotte The Vibe Company dans un atelier, en train de peindre une image dans la direction artistique maison"
ogImage: /images/resources/focus-skill-images/cover.png
---

Il fallait des visuels pour nos articles et nos posts LinkedIn. Ceux qui existaient quand je suis arrivé n'étaient pas de moi, et Antoine et Stan ne les aimaient pas trop : un peu banals, l'air « IA », jamais tout à fait raccord d'un article au suivant.

Comme j'allais m'occuper des visuels, c'était le bon moment pour tout refaire. Avec Antoine et Stan, on a décidé de se donner une direction artistique à nous, un style qui nous ressemble.

Le secret pour qu'elle tienne sur tous nos visuels sans que je sois graphiste, c'est un skill qui la verrouille.

Un mot d'abord sur ce qu'est un skill. C'est un petit outil que je me fabrique pour une tâche précise, avec ses propres règles, et que l'IA applique ensuite à ma place sans que j'aie à tout réexpliquer.

## D'où vient le style

La direction artistique était déjà presque posée quand je m'y suis mis. Antoine avait généré un visuel qui nous a tous plu, un renard guerrier, celui qu'on retrouve sur mon premier article.

On est tous les trois gamers, alors on a eu envie de construire la patte autour de ça : un rendu 3D stylisé, quelque part entre l'univers de Pixar et l'art des jeux comme Clash of Clans. Nos avatars sont nés avec ce même style.

Mon vrai travail n'a pas été d'inventer la DA, mais de l'outiller. La rendre reproductible, l'itérer, et la verrouiller pour qu'elle tienne partout sans que je la réexplique à chaque fois.

## Ce que le skill verrouille

Le cœur de l'outil, image-generator, repose sur une idée simple : séparer ce qui ne change jamais de ce qui varie.

Ce qui ne change jamais, c'est notre rendu. Dans le skill, je l'ai écrit noir sur blanc, sept règles qui ne bougent pas d'une image à l'autre :

1. un rendu 3D stylisé, façon key art de jeu mobile premium, entre Pixar et Clash of Clans.
2. une matière douce et mate, des surfaces lisses et arrondies, un léger effet pâte à modeler.
3. des proportions amicales, un peu exagérées, des traits expressifs.
4. une lumière douce et cinématographique, sans ombres dures.
5. une palette chaude, riche et saturée.
6. une finition très propre, des détails nets, zéro artefact.
7. une ambiance positive et vivante.

Concrètement, le skill colle ce bloc en tête de chaque demande d'image. Je l'ai écrit en anglais, parce que les modèles d'image obéissent mieux dans cette langue :

```
Stylized 3D render, premium mobile game key art, blending Pixar character
appeal with Clash of Clans / Clash Royale game art. Soft matte clay-like
sculpted surfaces, smooth rounded clean forms, slightly exaggerated friendly
proportions, expressive readable features. Warm rich saturated color palette.
Soft cinematic studio lighting, gentle global illumination, subtle rim light,
soft ambient occlusion, no harsh shadows. Crisp polished details, professional
high-end finish. Charming, heroic, lively mood.
```

Chaque morceau a un rôle :

- « Stylized 3D render, premium mobile game key art » fixe le style général.
- « Soft matte clay-like sculpted surfaces » donne la matière pâte à modeler lisse.
- « Warm rich saturated color palette » verrouille les couleurs chaudes.
- « Soft cinematic studio lighting » et « no harsh shadows » imposent une lumière douce.

Je n'ai plus jamais à retaper tout ça, le skill le fait à ma place, à chaque image.

Il y a même une liste de ce qu'on ne veut surtout pas, ce qu'on appelle le negative prompt :

```
photorealistic, realistic photo, flat 2D vector, harsh lighting, gritty
realism, muddy desaturated colors, low detail, blurry, noisy, ugly
proportions, deformed, text, watermark, signature
```

Ça repousse le modèle loin de tout ce qui casserait la patte : le rendu photo, le plat, les couleurs ternes, et le texte. Ce dernier, j'y reviens, c'est un vrai problème.

Ce qui varie, c'est tout le reste : le sujet, le décor, le cadrage, l'accent de couleur. Le fond, par exemple, ne fait pas partie de la signature. Il change à chaque image, accordé au sujet de l'article. Le skill assemble toujours dans le même ordre : le bloc de style, puis le sujet, puis le décor, le cadrage, et le format.

## Deux façons de lancer

Soit je lui donne des instructions précises sur ce que je veux. Soit je lui dis juste « fais le visuel de l'article 4 », et il lit l'article pour choisir lui-même l'image qui colle.

## Du prompt à l'image finie

Tout ça, image-generator le fait, mais il s'arrête à une description, un texte. Pas encore une image.

Pour fabriquer le fichier, un deuxième skill prend le relais, vibe-generate-image. Il envoie la description à un modèle d'image hébergé chez Microsoft sur Azure, et récupère l'image. En pratique, ça tient en une commande, que je n'ai même pas à taper moi-même :

```
generate.py "<la description composée>" -o cover.png -a 16:9 --input-image mascotte.png
```

Vite traduit : entre guillemets, la description complète ; -o, le fichier à écrire ; -a 16:9, le format, ici paysage pour un en-tête d'article ; et --input-image, une image de référence que le modèle doit respecter.

Ce dernier bout, --input-image, c'est ce qui garde nos personnages identiques d'une image à l'autre. J'y reviens avec la mascotte.

Et le troisième skill, da-image, c'est le chef d'orchestre. Il enchaîne les deux : image-generator écrit la description dans notre style, vibe-generate-image fabrique l'image. Je demande, je récupère une image finie, déjà dans la patte, en une seule fois.

## La mascotte, la dernière pièce

La mascotte, c'est le dernier élément qu'on a fixé. Avant elle, on avait déjà posé nos bases : la palette orange et cyan, et ce fond riche qui change selon le sujet.

On voulait un personnage récurrent, présent dans tous nos visuels, pour qu'on nous reconnaisse. Et là, grosse itération. On a essayé plein de pistes : un robot, un oiseau, un esprit lumineux, un petit lutin, des versions avec des ailes façon emblème de la marque.

![Quelques pistes explorées pour la mascotte avant de trancher](/images/resources/focus-skill-images/mascotte-idees.png "Les idées de mascotte explorées")

Le robot, Antoine et Stan l'ont trouvé trop générique. Les ailes, jolies, mais trop compliquées à remettre en scène proprement à chaque image. On a fini par trancher : un petit personnage tout lisse qu'on a appelé VB, qui porte l'emblème de la marque directement sur la tête. Reconnaissable, et facile à décliner, dont une version noir et blanc qu'on a validée.

C'est là que le --input-image dont je parlais reprend tout son sens. Décrite seulement avec des mots, la mascotte dérivait, sa tête changeait d'une image à l'autre. En lui passant une image de référence à chaque génération, elle reste exactement la même partout.

## Reprendre tous les visuels, et me mettre dans la scène

Une fois les outils en place, on a repris les visuels des articles déjà publiés pour tout repasser dans la nouvelle patte.

Le point de départ, ça a été l'image de mon post LinkedIn sur le premier site. Une scène habitée, une pièce chaleureuse, cette lumière orange et ces touches de bleu froid, plein de détails. Elle nous a servi de mètre étalon.

Sur cette image, j'ai pris une décision : remplacer le personnage lambda par mon propre avatar. D'un coup, ce n'était plus n'importe qui devant l'écran, c'était moi.

![Avant, une personne lambda devant l'écran. Après, mon propre avatar dans la même scène](/images/resources/focus-skill-images/avatar-avant-apres.png "Remplacer la personne lambda par mon avatar")

Et on n'arrive pas du premier coup. Sur une même image, on itère plusieurs versions avant de tomber juste.

![Quatre versions d'une même cover, jusqu'à ce qu'elle tombe juste](/images/resources/focus-skill-images/iteration-4versions.png "On itère une même image sur plusieurs versions")

Avant, mes images étaient minimalistes, un objet posé seul sur un fond dégradé. Propre, mais pauvre. Après, des scènes habitées, avec la mascotte, et mon avatar quand l'article parle de moi.

Ce qui m'a le plus surpris, c'est la précision. Très souvent, la première image sortie est la bonne. Elle fait presque exactement ce qu'on voulait, je n'ai rien à reprendre. Pour quelqu'un qui s'attend à enchaîner dix versions, c'est un vrai changement.

Reste deux limites. Le texte dans les images n'est pas fiable, le modèle écrit souvent du charabia, une fois il m'a sorti un « PERSONAL WATCHLIST » écrit n'importe comment. C'est pour ça que le negative prompt bannit le mot text, et que je conçois des visuels qui ne dépendent d'aucun texte lisible. Et il faut penser à varier le décor entre deux articles voisins pour ne pas se répéter.

## Ce que j'en retiens

Le skill est plus fiable, et il sert à nous trois, pas seulement à moi. On le règle une fois, et on arrête de tout réexpliquer à chaque image.

Penser un outil en « ce qui ne change jamais, ce qui varie » m'a débloqué bien au-delà des images. C'est une façon de ranger un problème qui sert partout.

Pour une entreprise, c'est ça l'intérêt : un profil non technique peut tenir une vraie identité visuelle, avec ses personnages, sans repasser par un graphiste à chaque image. Et le premier jet est souvent le bon.

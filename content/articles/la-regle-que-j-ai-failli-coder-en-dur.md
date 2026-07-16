---
title: "J'ai codé notre règle en dur, il fallait laisser le champ ouvert"
slug: la-regle-que-j-ai-failli-coder-en-dur
language: fr
summary: "On avait une règle maison pour ranger nos skills, et je l'ai codée en dur dans une branche de Companion, notre produit. Deux PR, des tests tout verts, une revue de code sans rien à redire. Puis la review de Stan a tout arrêté : un produit fait pour d'autres entreprises ne doit imposer aucune règle de chez nous. J'ai tout fermé et j'ai fait en sorte que notre règle devienne notre configuration."
publishedAt: 2026-07-15
series: victor-story
seriesDay: 12
topics: AI Journey, Produit, Skills
coverImage: /images/resources/la-regle-que-j-ai-failli-coder-en-dur/cover.png
coverAlt: "Mon avatar glissant une règle gravée dans la fente du produit, la mascotte VB tendant une autre tuile, dans la direction artistique maison"
ogImage: /images/resources/la-regle-que-j-ai-failli-coder-en-dur/cover.png
---

Chez The Vibe Company, on construit [Companion](https://www.thecompanion.sh/), un espace où n'importe quelle team peut ranger et partager ses skills, pas seulement la nôtre. [Un skill](/resources/articles/les-skills), c'est un fichier de consignes qu'on donne à l'IA pour qu'elle refasse une tâche toujours de la même façon.

On l'utilise nous-mêmes tous les jours. Notre maigre catalogue ne comporte pour le moment que dix-huit skills, mais il grossit toutes les semaines, et sans règle de nommage, ça devient vite le bazar.

On avait par exemple un skill baptisé « improve ». Improve quoi, pourquoi, pour qui, mystère.

## Une règle maison en trois blocs

Alors on a posé une règle maison : chaque skill prend un nom en anglais, en trois blocs, un verbe, un objet, un domaine. Comme track-expenses-admin pour [le tableau des dépenses](/resources/articles/focus-skill-compta-qonto) : track pour suivre, expenses pour les dépenses, admin pour le domaine. Et chacun se range dans un des six dossiers racines, dev, marketing, admin, clients, project, tools.

Pour la faire respecter, j'ai d'abord créé un skill gardien : on le lance dans une conversation avec l'IA au moment d'ajouter un skill, et elle range le nouveau venu dans la bonne racine et réécrit son nom à la convention.

Mais un gardien ne marche que si on pense à le lancer. Et la règle ne valait pas que pour l'existant : chaque nouveau skill devait arriver bien nommé, dès l'ajout. Alors je me suis dit que si la règle comptait, c'était au produit lui-même de la tenir.

## Le verrou dans le produit

J'ai donc codé la convention en dur, dans une copie de travail du code, à côté du vrai Companion. J'ai posé un garde-fou sur les trois portes d'entrée du catalogue : l'import, la création, le partage d'un skill. Un skill mal nommé ou sans dossier ? Refusé, avec un message d'erreur.

J'en ai tiré deux PR, ces paquets de modifications qu'on propose avant qu'ils n'entrent dans le produit. Les tests sont ressortis tout verts, et la revue de code automatique n'avait rien à redire. Il ne manquait qu'un merge, le dernier geste, et notre règle s'appliquait à toutes les équipes qui utiliseront Companion.

## Puis Stan a relu

On était à côté au bureau. Je lui ai lancé : « Tiens, j'ai fait la PR pour Companion, faut que tu regardes. » Stan a lu, et son retour a tout arrêté. Il tenait en deux phrases : « Là, tu codes en dur, tout le monde aura notre setup. Il faut que n'importe quelle organisation puisse mettre sa propre règle. »

Dit comme ça, c'était une évidence : ma convention en trois blocs n'appartient qu'à The Vibe Company.

Ça ne fait jamais plaisir de partir sur une mauvaise piste. J'ai fermé mes deux PR et leurs tests tout verts. Honnêtement, l'erreur n'a pas coûté cher : je les avais montés vite, en vibe codant.

## La règle passe dans les réglages

Cette fois dans le bon sens : j'ai fait en sorte que notre règle devienne notre configuration, à nous. J'ai ajouté à Companion un champ dans ses réglages, « Skill naming policy », où chaque organisation écrit sa propre politique de nommage.

Nous, on y a mis nos trois blocs et nos six dossiers. Une autre boîte peut y écrire tout autre chose, ou rien du tout.

Mon garde-fou codé en dur, lui, n'est jamais entré dans le produit. À la place, j'ai rendu le skill gardien générique : c'est dans ce champ qu'il vient lire la politique, avant de l'appliquer à chaque ajout qui passe par lui.

Et si quelqu'un ajoute un skill sans lancer le gardien ? On l'assume : au pire, un mauvais nom entre dans le catalogue, et on le renomme après. C'est notre règle de rangement, à nous de la tenir, plus au produit.

J'ai proposé le champ de réglages dans une nouvelle PR, et elle est passée. C'est Stan qui l'a mergée.

## Le même résultat, un produit neutre

Au final, chez nous, le résultat est celui que je visais avec mon verrou. Dans la foulée, j'ai briefé un agent dans une conversation [Claude](https://claude.com), et il a renommé et rangé les dix-huit d'un coup : « improve » est devenu improve-skill-tools, et on sait enfin ce qu'il fait.

Mais le produit est resté neutre : la convention qu'une équipe croisera sur Companion sera la sienne, jamais la nôtre.

## Ce que j'en retiens

Avant de coder une règle dans un produit, il faut se demander à qui elle appartient. Si elle n'appartient qu'à vous, c'est de la configuration, pas du produit.

L'autre leçon pique un peu plus : des tests qui passent prouvent que le code fait ce qu'on a décidé, mais ils ne disent rien de la décision elle-même. Ce jugement-là, il a fallu Stan pour le porter.

Aujourd'hui, c'est le gardien qui applique notre règle. Le code de Companion, lui, ne la connaît pas.

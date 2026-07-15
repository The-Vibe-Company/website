---
title: "La règle que j'ai failli coder en dur dans notre produit"
slug: la-regle-que-j-ai-failli-coder-en-dur
language: fr
summary: "On avait une règle maison pour ranger nos skills, et je l'ai codée en dur dans une branche de Companion, notre produit. Deux PR, des tests tout verts, une revue de code sans rien à redire. Puis la review de Stan a tout arrêté : un produit fait pour d'autres entreprises ne doit imposer aucune règle de chez nous. J'ai tout fermé et j'ai fait en sorte que notre règle devienne notre configuration."
publishedAt: 2026-07-15
series: victor-story
seriesDay: 12
topics: AI Journey, Produit, Skills
coverImage: /images/resources/la-regle-que-j-ai-failli-coder-en-dur/cover.png
coverAlt: "Mon avatar et la mascotte VB devant un mur de briques à moitié monté, dans la direction artistique maison"
ogImage: /images/resources/la-regle-que-j-ai-failli-coder-en-dur/cover.png
---

Chez The Vibe Company, on construit Companion, un espace où une team peut ranger et partager ses skills. Un skill, c'est un fichier de consignes qu'on donne à l'IA pour qu'elle refasse une tâche toujours de la même façon.

On utilise Companion nous-mêmes tous les jours. Notre maigre catalogue ne comporte pour le moment que dix-huit skills, mais il grossit toutes les semaines, et sans règle de nommage, ça devient vite le bazar.

On avait par exemple un skill baptisé « improve ». Improve quoi, pourquoi, pour qui, mystère.

## Une règle maison en trois blocs

Alors on a posé une règle maison : chaque skill prend un nom en trois blocs, en anglais, un verbe, un objet, un domaine. Comme track-expenses-admin pour le tableau des dépenses : l'action, l'objet, le domaine. Et chacun se range dans un des six dossiers racines, dev, marketing, admin, clients, project, tools.

Pour la faire respecter, j'ai d'abord créé un skill gardien : au moment d'ajouter un skill au catalogue, c'est l'IA qui range le nouveau venu dans la bonne racine et réécrit son nom à la convention.

Mais un gardien ne marche que si on pense à le lancer. Alors j'ai voulu verrouiller pour de bon : si la règle compte, c'est au produit lui-même de la tenir.

## Verrouiller pour de bon

J'ai donc codé la convention en dur, dans le code même du produit, sur une copie de travail à côté du vrai Companion. Un garde-fou sur les trois portes d'entrée du catalogue : importer un skill, en créer un, partager un skill perso avec l'équipe. Un skill mal nommé ou sans dossier ? Refusé, avec un message d'erreur.

J'en ai tiré deux PR, ces paquets de modifications qu'on propose avant qu'ils n'entrent dans le produit. Tests tout verts, revue de code automatique sans rien à redire. Il ne manquait qu'un merge, le dernier geste, et notre règle s'appliquait à tout le monde.

## Le retour de Stan a tout arrêté

C'est là que Stan a relu les PR, et son retour a tout arrêté. Il tenait en deux phrases : « Là, tu codes en dur, tout le monde aura notre setup. Il faut que n'importe quelle organisation puisse mettre sa propre règle. »

Dit comme ça, c'était une évidence. Companion n'est pas fait que pour nous, et ma convention en trois blocs n'appartient qu'à The Vibe Company.

Ça ne fait jamais plaisir de partir sur une mauvaise piste. J'ai fermé mes deux PR et leurs tests tout verts. Honnêtement, l'erreur n'a pas coûté cher : je les avais montés vite, en vibe codant, et la nouvelle version m'a pris une conversation ou deux avec l'IA.

## Notre règle devient notre configuration

Cette fois dans le bon sens : j'ai fait en sorte que notre règle devienne notre configuration, à nous. J'ai ajouté à Companion un champ dans ses réglages, où chaque organisation écrit sa propre politique de nommage.

Nous, on y a mis nos trois blocs et nos six dossiers. Une autre boîte peut y écrire tout autre chose, ou rien du tout.

Mon garde-fou codé en dur, lui, n'est jamais entré dans le produit. À la place, j'ai rendu le skill gardien générique : il lit la politique dans les réglages de Companion et l'applique à chaque ajout.

Et si quelqu'un ajoute un skill sans lancer le gardien ? On l'assume : au pire, un mauvais nom entre dans le catalogue, et on le renomme après. C'est notre règle de rangement, à nous de la tenir, plus au produit.

J'ai reproposé cette version dans une nouvelle PR, et elle est passée. C'est Stan qui l'a mergée.

## Le même résultat, un produit neutre

Au final, chez nous, le résultat est exactement le même. Dans la foulée, on a renommé et rangé les dix-huit skills : « improve » est devenu improve-skill-tools, et on sait enfin ce qu'il fait.

Mais le produit est resté neutre : la convention qu'une équipe croisera sur Companion sera la sienne, jamais la nôtre.

## Ce que j'en retiens

Avant de coder une règle dans un produit, il faut se demander à qui elle appartient. Si elle n'appartient qu'à vous, c'est de la configuration, pas du produit.

L'autre leçon pique un peu plus : des tests qui passent prouvent que le code fait ce qu'on a décidé, mais ils ne disent rien de la décision elle-même. Ce jugement-là, il a fallu Stan pour le porter.

Le gardien applique notre règle tous les jours. Le code de Companion, lui, ne la connaît pas.

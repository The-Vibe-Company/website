---
title: "Mon premier vrai blocage, ce n'était pas de créer le site"
slug: premier-blocage-terminal
language: fr
summary: "Créer le site, ça allait. Mon vrai blocage est venu du terminal : coller des commandes que je ne comprenais pas, sans rien voir bouger à l'écran. Comment j'ai tenu, et le déclic quand un push a mis le site à jour tout seul."
publishedAt: 2026-06-26
series: victor-story
seriesDay: 3
topics: AI Journey, Apprentissage, Terminal
coverImage: /images/resources/premier-blocage-terminal/cover.png
coverAlt: "Mon avatar pensif devant un terminal plein de commandes, avec la mascotte The Vibe Company, dans un atelier"
ogImage: /images/resources/premier-blocage-terminal/cover.png
---

Créer mon premier site, au fond, ça allait. À chaque demande, je voyais quelque chose apparaître : une page, un bouton, une liste de mangas qui s'affiche.

Le progrès était directement visible, et c'est ça qui me tenait.

Mon premier vrai blocage est venu d'ailleurs, là où je ne voyais plus rien avancer.

![Mon avatar pensif devant un terminal plein de commandes, avec la mascotte The Vibe Company](/images/resources/premier-blocage-terminal/cover.png "Ces écrans mystérieux du terminal, et la mascotte qui m'accompagne.")

## Quitter l'écran pour le terminal

Mon objectif, ce n'était pas juste d'avoir une page en ligne. Je voulais automatiser et brancher les outils entre eux pour que l'IA puisse avancer seule une fois la direction posée.

Sauf que pour ça, il a fallu quitter la partie visible du site. Connecter des outils entre eux, ça ne se passe pas sur la page, mais dans le terminal.

Je me suis retrouvé à coller des commandes que je ne comprenais pas pour installer des outils dont je n'avais jamais entendu parler : Homebrew, GitHub CLI, la CLI de Supabase, et j'en passe.

Pendant une heure ou deux, j'avais l'impression de suivre une recette sans en voir le bout.

## Le plus dur, c'était de ne rien voir

Le plus déstabilisant, ce n'était pas la difficulté en soi. C'était l'absence de résultat à l'écran.

Quand je modifie une interface, l'effet est immédiat, je vois tout de suite si ça marche.

Là, j'étais dans une phase invisible : installer, connecter, configurer. Je tapais des commandes, du moins je les collais, et des lignes défilaient tandis que le site, lui, ne bougeait pas d'un pixel.

En fait, je me retrouvais face à ces écrans mystérieux que je voyais chez les développeurs de mon ancienne boîte.

C'est exactement le genre de moment où une petite voix te dit que ce n'est peut-être pas pour toi.

## Comprendre pourquoi, pour tenir

Ce qui m'a aidé à ne pas lâcher, c'est d'avoir compris à quoi tout ça servait.

Ce setup, c'était un investissement. Pénible sur le moment, mais nécessaire pour que tout aille plus vite ensuite.

Et c'est là que le rôle de l'IA a changé pour moi. Elle ne servait plus seulement à écrire du code.

Elle me guidait dans un setup que je n'aurais jamais réussi à faire seul. Et elle ne me donnait pas juste des commandes à copier : à chaque fois, elle me disait pourquoi. Cette ligne-là, c'est pour connecter Codex à GitHub. Celle-ci, pour relier GitHub à Vercel.

Je ne subissais plus les commandes, je commençais à voir la logique derrière.

## Le moment où l'invisible a pris vie

Le déclic est arrivé un peu après. Le site était déjà en ligne grâce à Vercel.

Ce que je voulais, c'était simple : qu'un push sur main mette le site à jour tout seul.

Avec l'IA, on a travaillé sur une branche à part, le temps d'ajouter des fonctionnalités sans toucher à la version en ligne. Une fois la branche validée, j'ai dit : c'est bon, tu peux push sur main.

Et là, sans que j'aie à faire quoi que ce soit de plus, tout s'est enchaîné jusqu'au site final. Vercel est relié à mon dépôt GitHub : dès qu'il voit un push sur main, il récupère le code, le reconstruit et publie la nouvelle version en ligne.

Mon seul geste, c'était de valider et de lancer le push. Le build et la mise en ligne, eux, se faisaient sans moi.

C'était un premier exemple concret de l'automatisation que je cherchais depuis le début, et ça m'a donné une vraie sensation de contrôle.

## Ce que j'en retiens

Une commande dans un terminal obscur peut être utile même quand son effet ne se voit pas tout de suite.

L'inconfort technique du début, ce n'est pas un mur, c'est un passage.

Et le plus important, ce n'est pas de tout comprendre du premier coup. C'est de comprendre pourquoi on le fait.

Quelqu'un qui ne vient pas de la tech peut traverser des étapes techniques inconfortables, à condition d'être bien accompagné, d'avoir un objectif clair, et de transformer petit à petit l'inconnu en méthode.

Voir ce setup invisible finir par tourner tout seul, c'est devenu une des sensations que je préfère dans cet apprentissage.

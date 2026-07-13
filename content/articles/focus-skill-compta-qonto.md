---
title: "Le skill qui transforme mon export bancaire en tableau de compta"
slug: focus-skill-compta-qonto
language: fr
summary: "La compta du mois est un des premiers sujets que j'ai repris pour décharger Antoine. Un skill prend l'export CSV de la banque et ressort un tableau propre, classé, en moins de cinq minutes. Et surtout, il se modèle à 100% à ce qu'on veut. Zoom sur sa mécanique, flags et rangement automatique compris."
publishedAt: 2026-07-13
series: victor-story
seriesDay: 11
focus: true
topics: AI Journey, Skills, Automatisation
coverImage: /images/resources/focus-skill-compta-qonto/cover.png
coverAlt: "Mon avatar et la mascotte VB devant un tableau de compta qui se remplit tout seul depuis un fichier bancaire, dans la direction artistique maison"
ogImage: /images/resources/focus-skill-compta-qonto/cover.png
---

La compta est un des premiers sujets que j'ai repris chez The Vibe Company, pour décharger Antoine. J'ai fait un peu de finance avant et le domaine me plaît, mais si j'ai commencé par là, c'est surtout que le projet était simple. Parfait pour une première fois.

Antoine m'a tout montré, avec une consigne qui tenait en une phrase. « Voilà le skill, tu modifies comme tu veux. »

## La compta du mois en cinq minutes

Un skill, c'est un fichier de consignes que je donne à l'IA pour qu'elle refasse une tâche toujours de la même façon. Celui de la compta prend l'export CSV de Qonto, notre banque, et ressort un tableau propre, prêt pour Google Sheets, chaque ligne classée dans sa catégorie.

Sans ça, il faut soit vraiment maîtriser Excel et monter ses automatisations soi-même, soit y aller presque ligne par ligne, à la vieille école. Avec le skill, l'export du mois est traité en moins de cinq minutes.

Ce gain-là, je n'y suis pour rien, le skill d'Antoine le faisait déjà. Moi, j'ai pris sa consigne au mot.

## Tu modifies comme tu veux

Sur une copie de son skill, j'ai poussé le tableau un cran plus loin. Avant, il sortait figé, sans aucune formule, corriger une catégorie ne recalculait rien.

Maintenant, chaque ligne a un menu déroulant de catégories, et tous les totaux se recalculent quand on en change une. Une zone de recherche liste tous les fournisseurs du mois, sans doublon. On en choisit un, on voit le nombre d'opérations et le total.

J'ai aussi créé un skill jumeau pour les recettes. Même mécanique, d'autres catégories, l'argent qui rentre au lieu de l'argent qui sort.

## La passe à la main, outillée

Chaque mois, on repasse sur toutes les lignes. Pour cette passe, j'ai ajouté au tableau des dépenses une colonne de flags, des étiquettes d'action. Sa définition, copiée du skill :

```
Flag column — an action tag. Blank = rien a signaler (the default the user
never touches). Otherwise one of five values, each with its own conditional-
format color: OK (green), Se Désabonner (red), Remboursement (blue),
Re Facturer (orange), À Vérifier (amber).
```

En clair, la colonne arrive vide, et on passe ligne par ligne, non plus pour classer mais pour décider. Si c'est bon, OK. Sinon, le flag qui correspond, à rembourser, à refacturer, à vérifier ou à résilier.

Un flag autre que OK fait apparaître une case à cocher. Une fois l'action faite, l'abonnement résilié ou la ligne vérifiée, on coche, et le flag passe en OK.

Cette passe, on la garde exprès à la main. C'est là qu'on repère la dépense qu'on ne devrait plus faire.

## Quand il ne sait pas, il ne devine pas

Le classement automatique, lui, suit une règle prudente. Copiée du skill des recettes :

```
Revenue is classified from Qonto's own "Cash flow category" column first,
with a counterparty-name fallback. Autre is the default on purpose (a line
not recognized reads as "not classified yet", not a wrong guess); the user
finishes with the dropdown.
```

Autrement dit, le skill lit d'abord la catégorie que Qonto donne à la ligne, puis le nom de l'expéditeur si besoin. Quand il ne reconnaît pas une ligne, il ne devine pas, il la range dans « Autre » et on la classe à la main avec le menu déroulant.

## L'onglet se range tout seul

Restait un irritant, écrit noir sur blanc dans le skill d'origine :

```
Remind the user they can copy-paste the Excel content directly into their
Google Sheet "Tableau des Depenses".
```

Notre suivi vit dans un seul Google Sheet, un onglet par mois. Y recopier le tableau cassait souvent les formules du fichier, un geste mécanique qui n'apportait rien.

L'IA ne peut pas créer d'onglet dans ce fichier partagé, elle n'y a pas accès. Alors elle a codé un petit script, déployé dans le fichier lui-même avec Apps Script, l'outil d'automatisation de Google. Ce script, j'aurais été incapable de l'écrire moi-même.

Le skill lui envoie le tableau à une adresse web privée, et le script crée l'onglet du mois au bon endroit. Aujourd'hui je télécharge le CSV sur Qonto, je le donne au skill dans une conversation avec l'IA, et l'onglet apparaît dans le suivi, formaté. Pour tester, j'ai redonné le CSV de juin en le faisant passer pour juillet, un nouvel onglet s'est créé sans toucher au vrai onglet de juin, avec les bons chiffres.

## Ce que j'en retiens

Ce fichier de consignes, au fond, c'est un template qu'on modèle à son image. Catégories, couleurs, flags, tout est réglé comme on le voulait.

Si on change d'avis, pas besoin de refaire le tableau. On dit à l'IA ce qu'on veut changer, elle met à jour le skill, et l'export suivant sort comme on veut.

L'autre réflexe à voler, c'est le pont. Quand l'IA n'a pas accès à un outil, un petit script posé dans l'outil fait le relais.

Le prochain export tombera début août, pour la compta de juillet. Cette fois, personne ne recopiera rien.

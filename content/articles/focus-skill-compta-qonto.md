---
title: "Comment j'ai automatisé notre compta mensuelle (pour de vrai)"
slug: focus-skill-compta-qonto
language: fr
summary: "Quand je suis arrivé chez The Vibe Company, la compta a été l'un des premiers sujets que j'ai récupérés pour décharger Antoine. Son système pliait déjà le mois en cinq minutes. Je l'ai poussé plus loin : tableau vivant, flags de relecture, et un script qui range l'onglet du mois tout seul dans notre Google Sheets de suivi."
publishedAt: 2026-07-13
series: victor-story
seriesDay: 11
focus: true
topics: AI Journey, Skills, Automatisation
coverImage: /images/resources/focus-skill-compta-qonto/cover.png
coverAlt: "Mon avatar et la mascotte VB devant un tableau de compta qui se remplit tout seul depuis un fichier bancaire, dans la direction artistique maison"
ogImage: /images/resources/focus-skill-compta-qonto/cover.png
---

Quand je suis arrivé chez The Vibe Company, la compta a été l'un des premiers sujets que j'ai récupérés pour décharger Antoine. J'avais fait un peu de finance avant et le domaine me plaisait bien, mais si j'ai commencé par là, c'est surtout que le projet était simple. Parfait pour se faire la main.

Pour toute consigne, Antoine m'avait juste dit : « Voilà le script de l'IA, tu le modifies comme tu veux. »

Son « script », c'est en fait un fichier de consignes qu'on donne à Claude Code, l'IA avec laquelle on bosse. Le truc cool, c'est que ce système permettait déjà de plier la compta du mois en cinq minutes.

Chaque mois, le geste est simple : je télécharge l'export CSV de notre banque, Qonto, je le donne à Claude Code dans une conversation, et il me sort un fichier de tableur prêt à ouvrir dans Google Sheets. Dedans, chaque ligne est classée dans la bonne catégorie : Tool pour les abonnements comme Notion ou Slack, Tech pour l'infra comme OpenAI, Personnel pour les salaires et la mutuelle, Frais pour la banque et le comptable.

Sans ça, c'est soit la galère à base de macros Excel complexes, soit le pointage ligne par ligne à la vieille école. Ce gain de temps de départ, c'est à Antoine que je le dois. Moi, j'ai juste pris sa consigne au mot.

Pour classer, l'IA suit une règle prudente, écrite noir sur blanc dans le fichier de consignes :

```
Autre is the default on purpose (a line not recognized reads as
"not classified yet", not a wrong guess); the user finishes with
the dropdown.
```

En clair : elle regarde d'abord la catégorie que Qonto met déjà sur chaque ligne, puis le nom du fournisseur si besoin. Et quand elle ne sait pas, elle ne devine pas : elle range la ligne dans « Autre », et c'est nous qui tranchons après. Ça évite les erreurs stupides.

En bossant sur une copie de son modèle, j'ai voulu pousser le résultat un cran plus loin. Avant, les données sortaient figées : si on corrigeait une catégorie à la main, rien ne se recalculait.

J'ai donc demandé à l'IA de modifier le fichier de consignes pour sortir des menus déroulants et de vraies formules, au lieu de valeurs figées. Maintenant, chaque ligne a son menu déroulant, et tous les totaux s'ajustent en direct dès qu'on change un truc : le total de chaque catégorie et le total du mois, dans le récapitulatif en haut de l'onglet.

J'ai aussi ajouté une zone de recherche, juste sous ce récapitulatif : on y choisit un fournisseur dans une liste, et on voit tout de suite son nombre d'opérations et le montant total, ce qu'on a payé chez OpenAI sur le mois, par exemple. Une fois que ça a marché pour les dépenses, j'ai fait exactement la même chose pour les recettes, avec leurs propres catégories, comme Aide pour les subventions ou Consulting pour les missions.

Par contre, on a fait le choix de garder une étape humaine : la relecture mensuelle. Tout le but de ce tableau, c'est de balayer nos dépenses ligne par ligne et de repérer les paiements inhabituels, du genre l'abonnement oublié qui tourne encore. Pour que cette passe soit efficace, j'ai demandé à l'IA d'ajouter une colonne de « Flags » au tableau des dépenses. Voilà comment le fichier de consignes la définit :

```
Flag column — an action tag. Blank = rien a signaler
(the default the user never touches).
```

En clair, la colonne arrive vide, et on passe sur chaque ligne, non plus pour classer mais pour décider. Si c'est bon, on valide en OK. Sinon, on applique le bon tag : Se Désabonner, Remboursement, Re-Facturer ou À Vérifier.

Dès qu'on met un flag autre que OK, le tableur fait apparaître une case à cocher dans la colonne d'à côté. Une fois le problème réglé en vrai, comme résilier l'abonnement, on coche la case, et le flag repasse en OK.

Le dernier point noir, c'était l'intégration dans notre Google Sheets de suivi, le fichier partagé où vivent tous les mois. À l'époque, le fichier de consignes assumait le problème noir sur blanc :

```
Remind the user they can copy-paste the Excel content directly
into their Google Sheet "Tableau des Depenses".
```

Résultat : le tableau sortait dans un fichier à part, qu'il fallait recopier dedans, et ce copier-coller finissait toujours par casser les formules des autres onglets.

Comme Claude Code ne peut pas créer d'onglet dans ce fichier partagé depuis la conversation, il a codé lui-même un petit script en Google Apps Script pour faire le pont, un petit programme qui vit à l'intérieur du Google Sheets. Et ce n'est pas moi qui l'ai installé : j'ai ajouté l'extension Claude dans mon Google Chrome, donné toutes les autorisations, et il est allé lui-même sur le bon Google Sheet ajouter son script.

Moi, je n'ai fait que cliquer sur les autorisations. Maintenant, Claude Code envoie le tableau à l'adresse web privée du script, et le script crée l'onglet du mois au bon endroit, tout bien formaté.

J'ai testé le truc en envoyant les données de juin sous le nom de juillet : ça a créé un nouvel onglet parfait, sans toucher au vrai mois de juin.

Ce que je retiens de tout ça, c'est qu'un fichier de consignes pour l'IA, c'est vraiment un moule qu'on adapte à sa sauce. Si on change d'avis sur les catégories ou les couleurs, on le dit à l'IA, elle met à jour le modèle et le prochain export sort exactement comme on veut. Et quand elle est bloquée aux portes d'un outil, un micro-script installé une fois fait parfaitement le relais.

Le prochain export tombera début août pour la compta de juillet. Et cette fois, promis, personne ne fera de copier-coller.

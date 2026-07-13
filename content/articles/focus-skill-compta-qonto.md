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

Quand je suis arrivé chez The Vibe Company, la compta a été l'un des premiers sujets que j'ai récupérés pour décharger Antoine. J'avais fait un peu de finance avant et le domaine me plaisait bien, mais si j'ai commencé par là, c'est surtout que le projet était simple. Parfait pour se faire la main. Pour toute consigne, Antoine m'avait juste dit : « Voilà le script de l'IA, tu le modifies comme tu veux. »

Le truc cool, c'est que son système permettait déjà de plier la compta du mois en cinq minutes. En gros, c'est un fichier de consignes que je donne à l'IA pour qu'elle prenne l'export CSV de notre banque, Qonto, et qu'elle sorte un tableau propre, prêt pour Google Sheets, avec chaque ligne classée dans la bonne catégorie. Sans ça, c'est soit la galère à base de macros Excel complexes, soit le pointage ligne par ligne à la vieille école. Ce gain de temps de départ, c'est à Antoine que je le dois. Moi, j'ai juste pris sa consigne au mot.

En bossant sur une copie de son modèle, j'ai voulu pousser le tableau un cran plus loin. Avant, les données sortaient figées : si on corrigeait une catégorie à la main, rien ne se recalculait. Maintenant, chaque ligne a son menu déroulant et tous les totaux s'ajustent en direct dès qu'on change un truc. J'ai aussi ajouté une zone de recherche qui liste tous les fournisseurs du mois sans doublons. On en choisit un, et on voit tout de suite le nombre d'opérations et le montant total. Une fois que ça a marché pour les dépenses, j'ai fait exactement la même chose pour les recettes.

Par contre, on a fait le choix de garder une étape humaine : la relecture mensuelle. Pour que ce soit efficace, j'ai demandé à l'IA d'ajouter une colonne de "Flags", des étiquettes d'action. Le tableau arrive vide, et on passe sur chaque ligne, non plus pour classer mais pour décider. Si c'est bon, on valide en OK (vert). Sinon, on applique le bon tag : Se Désabonner (rouge), Remboursement (bleu), Re-Facturer (orange) ou À Vérifier (jaune). Dès qu'on met un flag autre que OK, une case à cocher apparaît. Une fois qu'on a réglé le problème en vrai, comme résilier l'abonnement, on coche la case et la ligne repasse au vert. C'est grâce à cette passe à la main qu'on repère les dépenses inutiles.

Pour le classement automatique, l'IA suit une règle prudente : elle regarde d'abord la catégorie native de Qonto, puis le nom du fournisseur si besoin. Et quand elle ne sait pas, elle ne devine pas. Elle range la ligne dans « Autre », et c'est nous qui tranchons après avec le menu déroulant. Ça évite les erreurs stupides.

Le dernier point noir, c'était l'intégration dans notre Google Sheets de suivi. Devoir copier-coller le tableau chaque mois finissait toujours par casser les formules des onglets. Comme l'IA n'a pas accès à notre fichier partagé, elle a codé elle-même un petit script en Google Apps Script pour faire le pont. Maintenant, l'IA envoie le tableau à une adresse web privée, et le script crée directement l'onglet du mois au bon endroit, tout bien formaté. J'ai testé le truc en envoyant les données de juin sous le nom de juillet : ça a créé un nouvel onglet parfait, sans toucher au vrai mois de juin.

Ce que je retiens de tout ça, c'est qu'un fichier de consignes pour l'IA, c'est vraiment un moule qu'on adapte à sa sauce. Si on change d'avis sur les catégories ou les couleurs, on le dit à l'IA, elle met à jour le modèle et le prochain export sort exactement comme on veut. Et quand l'IA est bloquée aux portes d'un outil, un micro-script fait parfaitement le relais.

Le prochain export tombera début août pour la compta de juillet. Et cette fois, promis, personne ne fera de copier-coller.

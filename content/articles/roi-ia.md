---
title: "Mesurer le ROI d'un projet IA : la méthode en 5 indicateurs"
seoTitle: "ROI IA : mesurer un projet en 5 indicateurs"
seoDescription: "ROI IA : la méthode en 5 indicateurs pour mesurer un projet d'IA avant et après le lancement (usage, qualité, coût complet, effet métier) avec des cas réels."
slug: roi-ia
translationKey: measure-ai-project-roi
language: fr
summary: "Comment mesurer le ROI d'un projet IA : une ligne de base avant le lancement, 5 indicateurs suivis chaque semaine, une formule simple et une règle de décision écrite à l'avance."
publishedAt: 2026-11-10
complexity: intermediate
topics: Strategy, AI Adoption
coverImage: /images/resources/roi-ia/cover-mascotte.webp
coverAlt: "La mascotte The Vibe Company observe une balance où un engrenage d'IA fait face à une pile de pièces, carnet en main"
ogImage: /images/resources/roi-ia/cover-mascotte.webp
---

Le ROI d'un projet IA se calcule comme celui de n'importe quel investissement : les gains mesurés, moins le coût complet, divisés par le coût complet. La difficulté est ailleurs. Il faut savoir quoi mesurer, et le mesurer avant le lancement. Sans ligne de base, aucun chiffre d'après ne prouve quoi que ce soit.

:::summary{title="En bref"}
On suit cinq indicateurs, définis avant de lancer et relevés chaque semaine.
- **Temps par cas** : combien de minutes le travail prend, avant et après.
- **Taux d'usage** : la part de ce que l'IA produit qui sert vraiment.
- **Taux de correction** : la part qu'un humain réécrit ou rejette.
- **Coût complet par cas** : modèle, infrastructure et temps de relecture compris.
- **Effet métier** : le délai, le chiffre d'affaires ou le risque que le processus doit faire bouger.
Le ROI et le délai de retour se calculent à partir de ces cinq chiffres.
:::

## Pourquoi si peu d'entreprises mesurent le ROI de leur IA

Selon le [Global AI Pulse de KPMG](https://kpmg.com/fr/fr/media/press-releases/2026/05/ai-pulse-survey-2026.html), publié le 28 mai 2026 auprès de 2 110 dirigeants dans 20 pays, 95 % des entreprises interrogées ont une stratégie IA et 64 % disent en tirer des bénéfices réels. Seules 8 % affichent un retour sur investissement mesurable.

Le constat revient dans d'autres enquêtes. Dans l'[étude CEO 2025 d'IBM](https://newsroom.ibm.com/2025-05-06-ibm-study-ceos-double-down-on-ai-while-navigating-enterprise-hurdles), menée auprès de 2 000 dirigeants, seules 25 % des initiatives IA ont atteint le ROI attendu, et 16 % ont été déployées à l'échelle de l'entreprise. Dans [l'enquête State of AI 2025 de McKinsey](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai-2025), 39 % des répondants attribuent un effet sur le résultat opérationnel (EBIT) à l'IA. La plupart d'entre eux le situent sous 5 % de l'EBIT.

En France, la mesure coince davantage. D'après [KPMG](https://kpmg.com/fr/fr/media/press-releases/2026/05/ai-pulse-survey-2026.html), 50 % des entreprises françaises ont du mal à mesurer les bénéfices indirects de l'IA, contre 44 % au niveau mondial.

Ces chiffres décrivent surtout un problème de méthode. La plupart des projets démarrent sans chiffre de départ, comptent des licences au lieu de résultats, et oublient le temps que des humains passent à relire. Un chiffre circule aussi beaucoup : « 95 % des projets IA échouent ». Il vient d'un rapport préliminaire du MIT (projet NANDA) dont [la méthode est très discutée](https://www.theregister.com/software/2025/08/18/generative-ai-does-nothing-for-95-percent-of-companies/1118115). Mieux vaut ne pas bâtir un business case dessus.

## Avant de lancer : la ligne de base

La ligne de base se relève sur le processus actuel, avant que l'IA n'y touche. Trois chiffres suffisent pour commencer :

1. **Le volume** : combien de cas par semaine (tickets, dossiers, documents, devis).
2. **Le temps par cas** : combien de minutes une personne y passe, du début à la fin.
3. **Le taux d'erreur** : la part des cas repris, corrigés ou contestés après coup.

Relevez-les sur quelques semaines représentatives, avec les personnes qui font le travail. C'est aussi le moment d'écrire, noir sur blanc, le chiffre qui déclenchera la suite : à partir de quel niveau on élargit, en dessous duquel on arrête.

Cette étape tient en une page. Elle fait pourtant la différence au moment de défendre le budget du deuxième projet.

## Les 5 indicateurs du ROI d'un projet IA

![Les 5 indicateurs du ROI d'un projet IA, de la ligne de base au calcul du ROI. Détaillé dans le texte.](/images/resources/roi-ia/roi-ia-5-indicateurs.png)

### 1. Le temps par cas

Le temps par cas mesure combien de minutes le travail prend avec l'IA, comparé à la ligne de base. On le relève sur le même périmètre et avec les mêmes personnes. Le gain de temps brut vaut : (temps avant − temps après) × volume.

Comptez le temps de bout en bout. Si l'IA rédige en dix secondes mais qu'on passe ensuite plusieurs minutes à vérifier, c'est le total qui compte.

### 2. Le taux d'usage

Le taux d'usage mesure la part de ce que l'IA produit qui sert vraiment : brouillons envoyés, alertes traitées, documents repris. C'est l'indicateur le plus honnête, parce qu'il ne dépend pas de l'avis de quelqu'un.

Chez [LocService](/fr/case-studies/locservice), plateforme de location entre particuliers qui reçoit des centaines de tickets par jour, la mesure suivie au quotidien est simple : le brouillon est-il utilisé ? Les brouillons générés par l'autodraft de Quivr servent sur 87 % des tickets. Un humain relit et envoie chaque réponse.

Un taux d'usage faible dit souvent que l'IA manque de contexte. Le détail est dans notre article sur [l'agent IA pour le support client](/fr/resources/articles/agent-ia-support-client).

### 3. Le taux de correction

Le taux de correction mesure la part du travail de l'IA qu'un humain réécrit, corrige ou rejette. Il complète le taux d'usage : un brouillon utilisé mais réécrit à moitié ne fait pas gagner grand-chose.

Pour un contrôle documentaire, la qualité se mesure aussi à ce que l'IA trouve. Pour [Coup de Pates](/fr/case-studies/coup-de-pates), trois skills comparent, vérifient et recoupent les documents produit. Sur deux versions d'un même cahier des charges, l'IA a relevé 72 modifications. L'équipe qualité décide de chacune.

### 4. Le coût complet par cas

Le coût complet par cas additionne tout ce que le traitement d'un cas coûte avec l'IA :

- les appels au modèle (tokens ou abonnement, ramenés au cas) ;
- l'infrastructure et l'hébergement ;
- le temps de relecture humaine ;
- la maintenance : mises à jour des prompts ou des skills, surveillance, incidents.

Le temps de relecture est le poste le plus souvent oublié. Il peut à lui seul effacer le gain de temps de l'indicateur 1. Pour l'investissement de départ (cadrage, développement, intégration), notez-le à part : il sert au calcul du délai de retour.

### 5. L'effet métier

L'effet métier mesure ce que le processus doit faire bouger pour l'entreprise : un délai de réponse plus court, plus de dossiers traités à effectif égal, moins d'erreurs coûteuses, un risque mieux couvert. Choisissez un seul effet principal par projet, celui que la direction suit déjà.

C'est l'indicateur qui relie le projet au compte de résultat. [McKinsey](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai-2025) note que les entreprises qui tirent le plus de valeur de l'IA redessinent leurs processus bien plus souvent que les autres. Un gain de temps qui ne change rien au processus reste souvent invisible dans les comptes.

## Calculer le ROI et le délai de retour

Avec ces cinq chiffres, le calcul tient en deux formules :

- **ROI** = (gains mesurés − coût complet) / coût complet, sur une période donnée (souvent 12 mois).
- **Délai de retour** = investissement de départ / gain net mensuel.

Les gains mesurés combinent le temps gagné (indicateur 1, valorisé au coût horaire réel), les erreurs évitées et l'effet métier quand il se chiffre. Le coût complet vient de l'indicateur 4, plus l'investissement de départ amorti sur la période.

| Ligne | Ce qu'on y met | Source |
| --- | --- | --- |
| Gain de temps | (temps avant − temps après) × volume × coût horaire | Indicateurs 1 et ligne de base |
| Erreurs évitées | baisse du taux d'erreur × volume × coût d'une erreur | Indicateur 3 et ligne de base |
| Effet métier | gain chiffré sur l'effet principal, s'il est mesurable | Indicateur 5 |
| Coût de fonctionnement | coût complet par cas × volume | Indicateur 4 |
| Investissement de départ | cadrage, développement, intégration | Budget projet |

Gardez les hypothèses visibles dans le tableau. Quelqu'un qui les conteste doit pouvoir changer un chiffre et voir le résultat bouger. Si le budget passe par un dispositif public, notre guide pour [financer un projet IA (CIR, CII, France 2030)](/fr/resources/articles/financer-projet-ia-cir-cii-france-2030) aide à intégrer les aides au calcul.

## Les pièges qui faussent le ROI

- **Mesurer l'adoption au lieu du résultat.** Un outil ouvert chaque jour par toute l'équipe peut ne rien changer au processus.
- **Oublier le temps de relecture.** C'est souvent le premier poste de coût réel.
- **Mesurer trop tôt.** Les premières semaines mélangent apprentissage et réglages. Comparez des semaines stables.
- **Attribuer tout le gain à l'IA.** Si le processus a changé en même temps, dites-le.
- **Changer de périmètre en route.** Comparez le même volume, le même type de cas, les mêmes équipes.

## Décider : arrêter, continuer ou élargir

Le ROI sert à décider. Selon [Gartner](https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027), plus de 40 % des projets d'IA agentique seront annulés d'ici fin 2027, à cause de coûts en hausse, d'une valeur business floue ou de contrôles de risque insuffisants. Une règle écrite avant le lancement évite de subir ce scénario.

- **Arrêter** si le taux d'usage reste sous le seuil fixé après la période de rodage, ou si le coût complet dépasse le gain.
- **Continuer en l'état** si le ROI est positif mais que le taux de correction reste élevé : il faut d'abord améliorer le contexte donné à l'IA.
- **Élargir** (plus de volume, plus d'autonomie) quand les cinq indicateurs tiennent plusieurs semaines de suite.

Le passage du pilote à la production est l'étape où la plupart des projets cassent. Notre [checklist du POC à la production](/fr/resources/articles/poc-agent-ia-production) détaille ce qu'il faut prévoir, et notre guide sur [l'agent IA en entreprise](/fr/resources/articles/agent-ia-entreprise) montre comment le connecter aux vrais outils.

## FAQ

### Comment calculer le ROI d'un projet IA ?

On divise le gain net (gains mesurés moins coût complet) par le coût complet, sur une période donnée. Les gains viennent du temps gagné, des erreurs évitées et de l'effet métier, comparés à une ligne de base relevée avant le lancement. Le coût complet inclut le modèle, l'infrastructure, la maintenance et le temps de relecture humaine.

### Quels KPI suivre pour un projet d'IA ?

Cinq suffisent pour commencer : le temps par cas, le taux d'usage, le taux de correction, le coût complet par cas et un effet métier principal. On les relève chaque semaine, sur le même périmètre que la ligne de base.

### Combien de temps faut-il pour mesurer le ROI de l'IA ?

Le temps de relever une ligne de base sur quelques semaines représentatives, puis de comparer des semaines stables après la période de rodage. Mesurer pendant les réglages donne des chiffres trompeurs dans un sens comme dans l'autre.

### Pourquoi si peu d'entreprises affichent un ROI mesurable ?

Selon KPMG, seules 8 % des entreprises interrogées en 2026 affichent un ROI mesurable. Les causes les plus fréquentes : pas de ligne de base, des indicateurs d'adoption pris pour des résultats, et des coûts cachés comme la relecture humaine.

### Faut-il un ROI positif dès le premier projet IA ?

Il faut au moins des chiffres fiables. Un premier projet bien mesuré, même modeste, sert à décider du suivant. Un projet sans mesure ne permet ni d'arrêter ni d'élargir.

## Mesurer avant de déployer

Vous avez un projet IA en tête, ou un pilote dont personne ne sait dire s'il rapporte ? Apportez le processus, le volume et ce que vous mesurez aujourd'hui. On vous aide à poser la ligne de base et les cinq indicateurs avant d'écrire une ligne de code.

[Réserver 30 minutes avec Stan](https://cal.com/stangirard/thevibecompany).

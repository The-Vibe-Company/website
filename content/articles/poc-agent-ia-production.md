---
title: "Du POC à la production : la checklist d'un agent IA qui tient"
seoTitle: "Agent IA : du POC à la production | The Vibe Company"
slug: poc-agent-ia-production
translationKey: ai-agent-poc-to-production
language: fr
summary: "Du POC d'agent IA à la production : checklist concrète, avec les cas Monka et LocService."
publishedAt: 2026-10-14
complexity: intermediate
topics: AI Adoption, AI Agents, Engineering
coverImage: /images/resources/poc-agent-ia-production/cover-mascotte-v3.webp
coverAlt: "Un prototype de dirigeable en papier au premier plan, le vrai dirigeable derrière, et la mascotte qui coche une checklist"
ogImage: /images/resources/poc-agent-ia-production/cover-mascotte-v3.webp
---

Chez [The Vibe Company](https://www.thevibecompany.co/fr), agence IA native passée par Y Combinator (W24), on voit souvent le même scénario. Un agent IA qui brille en démo. Puis qui s'éteint dès qu'il touche les vrais tickets, les vraies données et les vraies équipes.

Le problème n'est presque jamais le modèle. C'est le passage du POC à la production. [Fortune](https://fortune.com/2025/08/18/mit-report-95-percent-generative-ai-pilots-at-companies-failing-cfo/) a résumé, en août 2025, un rapport du MIT (projet NANDA) : 95 % des pilotes d'IA générative étudiés ne montraient pas d'impact mesurable sur le compte de résultat. La méthodologie est discutée. Le constat parle à tous ceux qui ont vu un pilote mourir dans un tiroir.

Voici une checklist concrète pour déployer un agent IA sans se mentir. On s'appuie sur ce qu'on livre vraiment : [Monka](https://www.thevibecompany.co/fr/case-studies/monka) en santé, [LocService](https://www.thevibecompany.co/fr/case-studies/locservice) en support client.

## Ce qu'un POC prouve vraiment (et ce qu'il ne prouve pas)

Un POC utile répond à une question précise : *est-ce que le modèle, sur ce type de tâche et avec ces données d'exemple, produit quelque chose d'exploitable ?*

Il ne prouve pas le reste.

- Que l'agent tiendra sur des cas rares, ambigus ou conflictuels.
- Que vos équipes accepteront de l'utiliser tous les jours.
- Que le coût par tâche restera acceptable à l'échelle.
- Que l'escalade humaine marchera quand l'agent se trompe.
- Que vous pourrez reprendre le système sans l'équipe qui l'a construit.

Beaucoup de checklists génériques s'arrêtent à « choisir le modèle » et « sécuriser les données ». Pour un agent, ce n'est pas assez. Un agent appelle des outils, lit du contexte, propose une action. En production, chaque outil est une porte. Il faut savoir lesquelles sont ouvertes, qui les surveille, et qui reprend la main.

## Checklist avant le Go production

Avant de déclarer un agent « en prod », passez chaque ligne. Si une case reste vide, ce n'est pas encore de la production. C'est un POC prolongé.

| Critère | Question à trancher | Signe que c'est prêt |
| --- | --- | --- |
| Cas d'usage borné | Quelle tâche précise l'agent fait-il, et laquelle refuse-t-il ? | Périmètre écrit, cas hors scope listés |
| Données réelles | L'agent a-t-il été testé sur des tickets / dossiers / messages réels (anonymisés si besoin) ? | Jeu d'évaluation issu de la production, pas seulement de la démo |
| Critère de succès mesurable | Quel indicateur décide du Go / No-Go ? | Taux d'usage, temps gagné, ou qualité validée par un humain métier |
| Propriétaire métier | Qui décide si une réponse est acceptable ? | Un nom, pas un comité |
| Plan d'escalade humaine | Que se passe-t-il quand l'agent doute ou se trompe ? | File d'attente, seuils, personne de garde |
| Observabilité | Peut-on rejouer un tool call, un prompt et une décision ? | Traces, logs, exemples d'échec consultables |
| Permissions progressives | L'agent peut-il écrire, envoyer, modifier sans validation ? | Lecture d'abord, écriture sous contrôle, envoi sous validation humaine |
| Coût par tâche | Combien coûte une exécution réussie à l'échelle prévue ? | Budget connu, alerte si dérive |
| Reprise interne | Votre équipe peut-elle faire évoluer le système sans nous ? | Docs, accès, runbook, formation livrés |

Trois principes reviennent sur tous les projets sérieux.

1. **Évaluer sur de vrais cas**, pas sur des exemples choisis pour la démo.
2. **Observer les tool calls** : ce que l'agent lit, appelle et propose doit être auditable.
3. **Garder l'humain dans la boucle** tant que le risque le justifie — et parfois longtemps après.

## Comment on le fait chez The Vibe Company

The Vibe Company a été fondée en 2024 à Paris par Stan Girard et Antoine Dewez (ex-Theodo, ex-Stockly). On est passés par Y Combinator (W24), on a levé 1,7 M$, et on est soutenus par France 2030 via MediaGen. On a mené des dizaines de projets. Voici deux manières concrètes de passer du POC à un agent qui tient.

### Monka : livrer vite dans un cadre déjà exigeant

[Monka](https://www.thevibecompany.co/fr/case-studies/monka) accompagne les aidants, avec des infirmières coordinatrices et des assureurs partenaires. Leur environnement était déjà HDS. Le défi n'était pas d'obtenir une certification. C'était de construire vite *dedans*, sans sortir du cadre.

En deux mois, on a mis en production l'app aidants, Lifeline (le CRM des infirmières) et le moteur clinique qui transforme chaque bilan en plan d'action. Le bilan compte 165 questions. Le référentiel clinique a connu 12 versions. Depuis, on livre une nouvelle version de l'app environ tous les deux jours — environ 90 versions en six mois. Les données de santé sont chiffrées et traitées dans le respect du RGPD.

Ce que ça dit sur le passage en production :

- le « Go » n'est pas un grand soir : c'est une première version utilisable, puis des itérations courtes ;
- le métier (référentiel clinique) évolue avec le produit, versionné, sans casser l'app ;
- la contrainte réglementaire (HDS, données de santé) est le terrain de jeu, pas un frein découvert après la démo.

### LocService : un agent utile parce que l'humain valide

[LocService](https://www.thevibecompany.co/fr/case-studies/locservice) est une plateforme de location entre particuliers. Plusieurs centaines de tickets support par jour. On a construit un assistant qui lit les anciens tickets et la documentation interne, puis rédige une réponse adaptée au profil et à l'historique du client.

Les brouillons IA sont utilisés sur **87 %** des tickets. L'humain reste maître de ce qui part. C'est le pattern production qu'on recommande pour un premier agent métier : l'IA accélère, l'équipe décide.

Ce que ça prouve mieux qu'une démo :

- un cas d'usage borné (répondre aux tickets, pas « automatiser le support ») ;
- des données réelles (API internes, historique client) ;
- un critère d'usage mesurable (87 % de brouillons utilisés) ;
- une escalade naturelle (validation humaine avant envoi).

Pour la vue d'ensemble (outils, mémoire, autorité, mesure), lisez notre [guide de l'agent IA en entreprise](https://www.thevibecompany.co/fr/resources/articles/agent-ia-entreprise).

Une fois le prestataire choisi, voici [comment se déroule un projet avec un prestataire IA, du premier appel à la production](https://www.thevibecompany.co/fr/resources/articles/travailler-prestataire-ia).

## FAQ

**Combien de temps faut-il pour passer d'un POC à la production ?**
Ça dépend du périmètre et des contraintes (données, sécurité, intégrations). Sur Monka, la première mise en production utile a pris deux mois dans un environnement HDS déjà en place. Sur LocService, le succès se lit dans l'usage quotidien des brouillons, pas dans la date de la première démo. Ce qui compte : avoir un critère de succès avant de démarrer.

**Faut-il toujours un humain dans la boucle ?**
Pour un premier déploiement métier, oui, presque toujours. Commencez en lecture ou en brouillon sous validation. Vous élargissez les permissions quand les métriques et le métier le permettent. Pas avant.

**Un bon taux de précision sur un test suffit-il ?**
Non. Un chiffre de labo sans usage réel ne dit presque rien. « 87 % des brouillons utilisés » vaut mieux que « 90 % de précision sur un jeu choisi ». Mesurez ce que vos équipes acceptent vraiment.

**Qui maintient l'agent après le Go ?**
Décidez-le avant. Soit votre équipe reprend (docs, runbook, formation), soit un accompagnement de maintenance est prévu. Un agent sans propriétaire métier et sans observabilité, c'est un POC chroniqué.

## Passez du POC à un agent qui tient

Vous avez un pilote qui marche en démo. Vous voulez savoir s'il est prêt pour la production — ou comment le construire pour qu'il le soit. Venez avec votre cas d'usage, vos contraintes, et ce que « succès » veut dire pour vous.

Cette checklist, on l'applique avec vous : c'est notre offre [Agents IA en production](/fr/agents-ia-production), du pilote instrumenté au run quotidien.

[Réservez 30 minutes avec Stan](https://cal.com/stangirard/thevibecompany).

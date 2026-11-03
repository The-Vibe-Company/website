---
title: "Hébergement HDS et IA : ce qu'il faut pour traiter des données de santé"
seoTitle: "Hébergement HDS et IA : choisir et configurer"
slug: hebergement-hds-ia
translationKey: hds-hosting-ai
language: fr
summary: "Hébergement HDS pour l'IA : activités à couvrir, souveraineté 2024, flux modèle/logs/index, pièges cloud et checklist de sélection."
publishedAt: 2026-11-03
complexity: intermediate
topics: AI Agents, Health Data, Security
coverImage: /images/resources/hebergement-hds-ia/cover-mascotte.webp
coverAlt: "La mascotte branche un câble turquoise d'une sphère IA vers une baie serveur sécurisée, près de médaillons cadenas et croix médicale"
ogImage: /images/resources/hebergement-hds-ia/cover-mascotte.webp
---

**La réponse courte.** Pour traiter des données de santé avec de l'IA en France, il vous faut un **hébergement HDS** adapté à votre workload. Un badge « HDS » sur une page marketing ne suffit pas. En pratique : lire le certificat (activités 1 à 6 + version du référentiel), vérifier la souveraineté du référentiel 2024 (stockage dans l'EEE, transparence des accès hors EEE), cartographier chaque flux IA (app, modèle, logs, index, sauvegardes, staging), et signer un contrat qui couvre ce que vous confiez vraiment. Sans ça, même un excellent modèle ne partira pas en production.

Ce guide traite d'achat et d'architecture : **quel hébergement HDS choisir, et comment le configurer pour faire tourner de l'IA**. Pour le cadre juridique du projet (qui doit être certifié, RGPD, CNIL), voir notre article [IA et données de santé : ce que l'HDS impose](/fr/resources/articles/ia-donnees-de-sante-hds). Ici, on reste côté infra.

> Ce texte n'est pas un avis juridique. Pour votre cas, voyez votre DPO ou un juriste spécialisé.

## HDS, rappel utile avant de comparer les devis

La certification [HDS](https://esante.gouv.fr/produits-services/hds) (hébergeur de données de santé) atteste qu'un hébergeur applique un niveau de sécurité adapté aux données de santé à caractère personnel. Elle est délivrée par un organisme certificateur accrédité, sur un référentiel publié par l'Agence du Numérique en Santé.

L'obligation vient de l'[article L.1111-8 du code de la santé publique](https://gnius.esante.gouv.fr/fr/reglementation/fiches-reglementation/hebergement-des-donnees-de-sante-hds) : héberger pour le compte d'un tiers (ou du patient) des données de santé recueillies lors d'activités de prévention, diagnostic, soins ou suivi médico-social impose un hébergeur certifié. Le [guide HAS-CNIL](https://www.cnil.fr/sites/default/files/2026-03/guide_has_cnil_recommandations_ia.pdf) (mars 2026) le rappelle aussi pour les systèmes d'IA en contexte de soins : hébergement chez un tiers = HDS + contrat conforme.

The Vibe Company n'est pas un hébergeur HDS. Sur les projets santé, on développe en général dans l'environnement HDS déjà en place chez le client, comme pour [Monka](/fr/case-studies/monka). Détail de l'offre : [IA santé et HDS](/fr/ia-sante-hds).

## Lire le certificat : les 6 activités, pas le slogan

Le référentiel découpe l'hébergement en **six activités** (article R.1111-9 du code de la santé publique, reprises dans le [référentiel HDS v2](https://esante.gouv.fr/sites/default/files/media_entity/documents/referentiel_certification_hds---fr--v2.pdf)) :

1. Sites physiques (locaux qui accueillent l'infrastructure).
2. Infrastructure matérielle (serveurs, équipements).
3. Infrastructure virtuelle.
4. Plateforme d'hébergement d'applications.
5. Administration et exploitation du système d'information contenant les données de santé.
6. Sauvegarde des données de santé (les sauvegardes **externalisées** ; celles intrinsèques aux activités 1 à 5 restent dans ces activités).

Les activités ne s'empilent pas comme des « niveaux ». Chaque hébergeur choisit celles sur lesquelles il se fait certifier. La [liste officielle ANS](https://esante.gouv.fr/offres-services/hds/liste-des-hebergeurs-certifies) affiche pour chacun les activités et la version du référentiel.

**Ce que ça change pour un projet IA :**

- Si vous prenez seulement un cloud certifié sur 1 à 4, et que **vous** (ou votre prestataire) administrez bases, modèles et accès, l'activité 5 n'est pas couverte pour autant.
- Si les sauvegardes partent chez un tiers distinct, regardez l'activité 6 de ce tiers.
- Le mot « HDS » sur la home page ne dit pas quelles activités sont dans le certificat, ni sur quelle version.

## Souveraineté : ce que le référentiel 2024 impose vraiment

La version révisée du référentiel a été publiée au Journal officiel le 16 mai 2024 ([communiqué ANS](https://esante.gouv.fr/espace-presse/publication-au-journal-officiel-du-referentiel-de-certification-hds-souverainete-des-donnees-et-ameliorations-du-referentiel)) :

- nouveaux candidats évalués sur la v2 depuis le **16 novembre 2024** ;
- hébergeurs déjà certifiés : transition au plus tard le **16 mai 2026** ;
- quatre exigences de souveraineté ([exigences n° 28 à 31, chapitre 7 du référentiel](https://esante.gouv.fr/sites/default/files/media_entity/documents/referentiel_certification_hds---fr--v2.pdf#page=16)), dont : stockage physique des données de santé dans l'**Espace économique européen** ; information contractuelle en cas d'accès distant depuis un pays tiers ou de soumission à une législation extra-européenne sans niveau de protection adéquat au sens du RGPD ; cartographie **publique** des transferts hors EEE.

L'ANS le dit clairement : la localisation dans l'EEE renforce la protection, **sans garantir l'immunité extraterritoriale**. Le référentiel HDS n'est pas aligné, à date, sur les exigences d'immunité du SecNumCloud sur ce point (réévaluation au plus tard en 2027).

En novembre 2026, un certificat encore affiché en v1.1 ne doit plus vous suffire. Demandez le certificat à jour, les activités, la version, et la cartographie des transferts.

## Cartographier la stack IA avant de signer

Une app classique a déjà ses flux, et une stack IA en ajoute. Avant de demander un devis, dessinez :

| Composant | Question HDS |
|---|---|
| Application / API | Où tourne-t-elle ? Qui l'administre (activité 5) ? |
| Appel au modèle | Le prompt ou le contexte contient-il des données de santé ? Le modèle est-il dans le périmètre HDS, ou les données sont-elles pseudonymisées avant l'appel ? |
| Logs et traces | Les prompts, réponses et métadonnées d'observabilité restent-ils dans le même périmètre ? |
| Embeddings / index | La base vectorielle construite sur des comptes rendus est-elle hébergée comme le reste ? (voir [RAG en entreprise](/fr/resources/articles/rag-entreprise)) |
| Sauvegardes | Qui les stocke, où, sur quelle activité ? |
| Staging / démo | Y a-t-il des données réelles hors environnement certifié ? |

Si un seul de ces chemins sort du cadre, le certificat de la baie de prod ne suffit pas.

## Les pièges cloud qu'on voit souvent

1. **« On a une région Europe » ≠ certificat HDS sur vos services.** La région compte pour la localisation. Elle ne remplace pas les activités certifiées ni le contrat.
2. **API LLM publique avec dossier patient en clair.** Même si la base est HDS, l'appel sort. Il faut un modèle dans le périmètre, une pseudonymisation avant l'appel, ou pas d'appel externe.
3. **Logs envoyés vers un SIEM ou un APM hors HDS.** Les traces de prompts sont souvent des données de santé en clair.
4. **Certificat 1-4 sans activité 5**, alors que votre équipe (ou l'agence) a les droits root sur la base.
5. **Sauvegardes, snapshots et exports** qui partent sur un object storage hors périmètre « parce que c'est temporaire ».
6. **Environnements de test** remplis avec un extrait de prod « pour aller plus vite ».
7. **Sous-traitants en chaîne** (infogéreur, éditeur de plateforme ML, support offshore) non listés dans le contrat et la cartographie des transferts.

Ce sont eux qui bloquent les projets, plus souvent que le choix du modèle.

## Comment on a configuré ça avec Monka

Chez [Monka](/fr/case-studies/monka), l'environnement HDS était déjà en place. En deux mois, on a mis en production l'app des aidants (bilan de 165 questions qui devient un plan d'action), Lifeline pour les infirmières de coordination, et le moteur clinique versionné. Depuis, le rythme est d'environ une version tous les deux jours ; 90 versions de l'app en six mois, 12 versions du référentiel clinique.

Ce qui compte côté architecture : on n'a pas « ajouté HDS après la démo ». On a construit dans le cadre d'hébergement déjà choisi, avec des données de santé chiffrées et un passage en prod calé sur ce socle. C'est le même ordre qu'on recommande dans [Du POC à la production](/fr/resources/articles/poc-agent-ia-production) : le périmètre d'hébergement avant le polish du prompt.

## Checklist de sélection (à envoyer au fournisseur)

1. Quel est le numéro / l'URL de vérification du certificat auprès de l'organisme certificateur ?
2. Quelles **activités** (1 à 6) sont couvertes, et sur quelle **version** du référentiel (v2.0) ?
3. Où sont physiquement stockées les données (pays de l'EEE) ?
4. Existe-t-il des accès distants ou des sous-traitants hors EEE ? Quels risques et quelles mesures sont écrits dans le contrat ?
5. Où est publiée la **cartographie des transferts** hors EEE ?
6. Qui assure l'**administration** (activité 5) : vous, nous, un infogéreur tiers ?
7. Les services que nous allons utiliser (Kubernetes, object storage, file d'attente, GPU, registry) sont-ils **tous** dans le périmètre certifié, ou seulement une partie du catalogue ?
8. Où vivent les **logs**, métriques, traces et sauvegardes de notre stack IA ?
9. Peut-on héberger un **modèle** (self-hosted ou endpoint privé) sans faire sortir les prompts ?
10. Comment se passe un **export / réversibilité** en fin de contrat, sans casser la chaîne de responsabilité ?

Gardez les réponses écrites. Elles serviront à l'[AIPD](https://www.cnil.fr/fr/realiser-une-analyse-dimpact-si-necessaire) et aux formalités CNIL décrites dans les [fiches IA et santé](https://www.cnil.fr/fr/ia-et-sante-developper-et-evaluer-des-systemes-ia-conformes).

## Par où commencer

1. Dessiner les flux (tableau ci-dessus) avec le DPO et le responsable technique.
2. Filtrer la [liste ANS](https://esante.gouv.fr/offres-services/hds/liste-des-hebergeurs-certifies) sur les activités dont vous avez besoin, en v2.
3. Envoyer la checklist et comparer deux ou trois réponses plutôt que dix slides.
4. Verrouiller le contrat et le plan d'architecture **avant** le POC « réaliste » sur données de santé.
5. Construire ensuite le produit IA dans ce cadre (voir aussi [Agence IA à Paris](/fr/agence-ia-paris) si vous externalisez le build).

## FAQ

**Faut-il un hébergeur HDS pour toute IA en santé ?**  
Dès que des données de santé à caractère personnel sont hébergées chez un tiers dans le cadre de L.1111-8, oui. Si vous n'hébergez que des données anonymisées au sens strict, le sujet change : faites valider l'anonymisation par votre DPO. Ce n'est pas un raccourci marketing.

**Un cloud « certifié HDS » couvre-t-il automatiquement mon agent IA ?**  
Non. Il couvre les activités listées sur son certificat, pour les services inclus dans le périmètre. L'agent, ses outils, ses logs et ses appels modèle restent à cartographier.

**Que change le référentiel 2024 pour mon appel d'offres ?**  
Exigez la v2, le stockage dans l'EEE, la transparence des accès hors EEE et la cartographie publique des transferts. Un devis sans ces pièces est incomplet.

**Peut-on appeler un LLM américain depuis une base HDS en France ?**  
Techniquement, c'est souvent possible. Avec des données de santé en clair, vous sortez en général du cadre que vous cherchez à respecter. Pseudonymisez avant, hébergez le modèle dans le périmètre, ou ne sortez pas les données.

**Qui doit être certifié : l'éditeur, l'hôpital, l'agence ?**  
Celui qui assure les activités d'hébergement pour le compte d'autrui. Une agence de développement n'est pas un hébergeur par défaut. Tout dépend de qui a les accès en production. Détail dans [l'article obligations HDS](/fr/resources/articles/ia-donnees-de-sante-hds).

**Combien de temps pour mettre un produit IA en prod sur un socle HDS déjà prêt ?**  
Ça dépend du socle. Chez Monka, avec l'environnement HDS déjà en place, app + CRM + moteur clinique sont partis en production en deux mois. On ne donne pas de délai générique.

**The Vibe Company est-elle un hébergeur HDS ?**  
Non. On n'est pas un hébergeur de données de santé. On développe selon les exigences du cadre HDS/RGPD, en général dans l'environnement déjà certifié chez le client.

---

Un projet IA sur données de santé à cadrer côté hébergement ? [Prendre 30 minutes](https://cal.com/stangirard/thevibecompany).

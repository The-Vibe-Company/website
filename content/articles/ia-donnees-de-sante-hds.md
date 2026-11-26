---
title: "IA et données de santé : ce que l'HDS impose vraiment à votre projet"
seoTitle: "IA et données de santé : règles HDS en France"
slug: ia-donnees-de-sante-hds
language: fr
translationKey: hds-health-data
summary: "IA et données de santé en France : qui doit être certifié, les 6 activités HDS, le référentiel 2024, le RGPD et la CNIL. Ce qu'il faut vérifier avant la prod."
seoDescription: "IA et données de santé : qui doit être certifié HDS, le référentiel 2024, l'entrepôt de données (EDS), l'EHDS et les formalités CNIL avant la mise en prod."
publishedAt: 2026-10-12
dateModified: 2026-11-23
complexity: intermediate
topics: AI Agents, Health Data, Security
coverImage: /images/resources/ia-donnees-de-sante-hds/cover-mascotte.webp
coverAlt: "Un schéma montre le parcours d'une donnée de santé entre l'application, le modèle d'IA et l'hébergeur certifié HDS"
ogImage: /images/resources/ia-donnees-de-sante-hds/cover-mascotte.webp
---

Un projet IA en santé bloque rarement sur le modèle. Il bloque le jour où quelqu'un demande : « Et les données, elles sont où ? »

**La réponse courte.** Pour mener un projet IA sur des données de santé en France, il faut cinq choses. Cartographier les flux (application, modèle, logs, sauvegardes). Choisir un hébergeur certifié HDS selon le référentiel 2024, sur les activités dont vous avez besoin. Garder les appels au modèle, les logs et les index dans ce périmètre, ou pseudonymiser avant. Régler le RGPD avec le DPO : base légale, analyse d'impact, formalités CNIL. Et tester sans données réelles. La suite détaille le cadre. Le choix concret de l'hébergement (activités, cloud, appels au modèle) est traité dans [Hébergement HDS et IA](/fr/resources/articles/hebergement-hds-ia).

À ce moment-là, la démo sur notebook ne suffit plus. Il faut savoir qui héberge, qui administre, qui sauvegarde, et par où passent les données quand l'application appelle un modèle. En France, la plupart des réponses tiennent en trois lettres : HDS.

On l'a vécu avec [Monka](/fr/case-studies/monka). Dans leur environnement HDS existant, on a construit une app pour les aidants, un CRM pour les infirmières et un moteur clinique. En production en deux mois. Voici ce qu'il faut vérifier, avec les sources officielles.

> Cet article n'est pas un avis juridique. Pour votre cas précis, voyez votre DPO ou un juriste spécialisé.

## Qu'est-ce que la certification HDS ?

La certification HDS (hébergeur de données de santé) garantit qu'un hébergeur applique un niveau de sécurité adapté aux données de santé à caractère personnel. Elle est délivrée par un organisme certificateur indépendant accrédité, sur la base d'un référentiel publié par l'Agence du Numérique en Santé ([esante.gouv.fr](https://esante.gouv.fr/produits-services/hds)).

L'obligation vient de l'article L.1111-8 du code de la santé publique : toute personne qui héberge des données de santé recueillies lors d'activités de prévention, de diagnostic, de soins ou de suivi médico-social, pour le compte d'un tiers ou du patient, doit être certifiée.

## Qui doit être certifié HDS, et qui ne l'est pas forcément ?

Tout tient dans « pour le compte de ». La certification vise celui qui héberge ou exploite les données pour quelqu'un d'autre.

- **L'hébergeur** (cloud, infogéreur, prestataire de sauvegarde) doit être certifié pour les activités qu'il réalise.
- **L'éditeur ou la startup** qui fait tourner son application chez un hébergeur certifié n'a pas forcément besoin d'être certifié lui-même. Mais s'il administre lui-même l'infrastructure ou le système d'information qui contient les données, il peut tomber dans le périmètre (activité 5 ci-dessous).
- **L'agence ou le prestataire de développement** qui construit l'application n'est pas un hébergeur en soi. Tout dépend de qui a les accès en prod.

La question à poser dès le début du projet : qui aura la main, concrètement, sur les serveurs et les bases de données ?

## Les 6 activités du référentiel HDS

Le référentiel découpe l'hébergement en six activités. Un hébergeur est certifié activité par activité ([référentiel, esante.gouv.fr](https://esante.gouv.fr/produits-services/hds)) :

1. **Sites physiques** : mise à disposition et maintien en condition opérationnelle des locaux qui accueillent l'infrastructure matérielle du système d'information traitant les données de santé.
2. **Infrastructure matérielle** : mise à disposition et maintien en condition opérationnelle des serveurs et équipements de ce système d'information.
3. **Infrastructure virtuelle** : mise à disposition et maintien en condition opérationnelle de l'infrastructure virtuelle du système d'information de santé.
4. **Plateforme d'hébergement d'applications** : mise à disposition et maintien en condition opérationnelle de la plateforme qui héberge les applications.
5. **Administration et exploitation** du système d'information contenant les données de santé.
6. **Sauvegarde externalisée** des données de santé.

Les libellés exacts figurent à l'article [R.1111-9 du code de la santé publique](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000036658481). On parle souvent de « niveaux ». En réalité ce sont des activités, pas des paliers, et un hébergeur choisit celles sur lesquelles il se fait certifier.

Une lecture simple, que Stan Girard détaillait dans [« Comprendre la certification HDS en 5 minutes »](https://www.theodo.com/blog/comprendre-la-certification-hds-en-5-minutes) sur le blog de Theodo :

- **activités 1 et 2 : l'hébergeur d'infrastructure physique.** Elles concernent ceux qui possèdent et opèrent leurs propres serveurs et datacenters ;
- **activités 3 à 6 : l'hébergeur infogéreur.** Elles couvrent l'environnement applicatif : plateforme, exploitation, sécurité au quotidien et sauvegardes.

Un exemple du même article : un grand cloud peut être certifié sur les six activités sans que tous ses services soient utilisables pour des données de santé, ni qu'il propose lui-même l'infogérance (activité 5). Il faut alors un infogéreur certifié, ou faire certifier sa propre exploitation.

Un point qu'on oublie souvent : la certification HDS s'appuie sur la norme ISO 27001, à laquelle elle ajoute des exigences propres à la santé (largement contractuelles). Pour un hébergeur, compter en général un à deux ans de mise en conformité.

Concrètement, vérifiez que le certificat de votre hébergeur couvre les activités que vous lui confiez. Le mot « HDS » sur sa page d'accueil ne suffit pas. Un cloud certifié sur les activités 1 à 4 ne couvre pas l'administration de votre application si c'est vous qui la faites.

## Qu'est-ce qui a changé avec le référentiel HDS 2024 ?

Le référentiel révisé a été publié au Journal officiel le 16 mai 2024 ([ANS](https://esante.gouv.fr/espace-presse/publication-au-journal-officiel-du-referentiel-de-certification-hds-souverainete-des-donnees-et-ameliorations-du-referentiel)) :

- les nouveaux candidats sont évalués sur cette version depuis le **16 novembre 2024** ;
- les hébergeurs déjà certifiés avaient jusqu'au **16 mai 2026** pour passer sur la nouvelle version ;
- la révision ajoute un bloc d'exigences de souveraineté :
  - les données de santé doivent être hébergées et stockées dans l'Espace économique européen (EEE), et l'hébergeur doit indiquer au client où elles se trouvent ;
  - tout accès depuis un pays hors EEE doit être encadré et signalé au client dans le contrat, avec les risques associés ;
  - si l'hébergeur ou l'un de ses sous-traitants est soumis à une loi d'un pays tiers sans niveau de protection adéquat au sens du RGPD, il doit le dire au client et exposer le risque d'accès non autorisé ;
  - l'hébergeur doit publier une cartographie des transferts de données possibles hors EEE.

Ces règles imposent la transparence. Elles ne protègent pas un hébergeur des lois extraterritoriales. Le niveau de risque acceptable, à vous de le fixer.

Depuis le 16 mai 2026, un certificat HDS délivré selon l'ancien référentiel ne devrait donc plus être valable. Demandez le certificat à jour, avec ses dates et ses activités.

## Où l'IA complique-t-elle l'HDS : modèles, API et logs ?

Un projet IA crée des chemins de données qu'une application classique n'a pas. Ce sont eux qu'il faut cartographier :

- **L'appel au modèle.** Si l'application envoie un dossier patient à une API de modèle de langage, cette donnée quitte votre hébergeur. Il faut savoir où l'appel est traité, si le fournisseur garde les requêtes, et s'il est couvert pour des données de santé. Sinon, il faut pseudonymiser avant l'appel, ou faire tourner le modèle dans un environnement HDS.
- **Les logs et l'observabilité.** Les traces de prompts et de réponses contiennent souvent des données de santé en clair. Elles doivent vivre au même niveau de sécurité que la base principale.
- **Les embeddings et les index de recherche.** Une base vectorielle construite à partir de comptes rendus médicaux contient des données de santé. Elle est dans le périmètre. On explique comment fonctionne ce type d'architecture dans [« RAG en entreprise »](/fr/resources/articles/rag-entreprise).
- **Les environnements de test.** Pas de vraies données patients dans un environnement de démo non certifié.
- **Les droits de l'agent.** Un agent qui peut lire un dossier n'a pas forcément besoin de pouvoir le modifier. On en parle dans [« Le vrai risque des agents IA, c'est l'autorité »](/fr/resources/articles/agents-ia-formation-autorite).

## Quelles obligations RGPD et CNIL s'ajoutent à l'hébergement ?

L'HDS couvre l'hébergement. Le RGPD couvre tout le traitement. Les données de santé sont des données sensibles, et la CNIL a publié des recommandations pour le développement des systèmes d'IA ([cnil.fr](https://www.cnil.fr/fr/ia-finalisation-recommandations-developpement-des-systemes-ia)) :

- vérifier qu'on a le droit d'utiliser les données pour cette finalité ;
- limiter les données à ce qui est nécessaire ;
- définir une durée de conservation ;
- évaluer les risques pour les personnes, souvent via une analyse d'impact (AIPD) pour des données de santé à grande échelle ;
- prévoir des mesures de sécurité, comme le chiffrement.

La CNIL rappelle aussi qu'un modèle entraîné sur des données personnelles peut lui-même rester soumis au RGPD. Vous comptez entraîner ou affiner un modèle sur des données patients ? Réglez ce point avant la première ligne de code.

En mars 2026, la CNIL a publié une fiche dédiée à l'IA en santé ([cnil.fr](https://www.cnil.fr/fr/ia-et-sante-developper-et-evaluer-des-systemes-ia-conformes)). Elle assimile le développement d'un système d'IA destiné à la santé à une recherche, étude ou évaluation dans le domaine de la santé. Dans la majorité des cas, il faut donc une formalité préalable : une déclaration de conformité à une méthodologie de référence (MR-001, MR-003 ou MR-004), ou une demande d'autorisation si le projet sort de ce cadre. La fiche couvre la constitution des bases, le développement et l'évaluation. Le simple déploiement d'un outil déjà fourni n'y est pas traité.

## Entraîner un modèle sur un entrepôt de données de santé : quelles règles ?

Un entrepôt de données de santé (EDS) a son propre cadre CNIL, et son hébergement reste HDS. C'est souvent par là que commence un projet IA en santé : une base qui réunit des dossiers pour la recherche.

- **Le référentiel EDS de la CNIL**, adopté en octobre 2021 ([cnil.fr](https://www.cnil.fr/fr/la-cnil-adopte-un-referentiel-sur-les-entrepots-de-donnees-de-sante)), permet de déclarer sa conformité au lieu de demander une autorisation préalable. Il ne couvre que les entrepôts fondés sur une mission d'intérêt public. Une entreprise privée qui constitue un entrepôt pour sa propre recherche, sur la base de l'intérêt légitime, n'en relève pas : elle demande une autorisation individuelle à la CNIL.
- **L'hébergement reste HDS.** Le référentiel EDS exige que le sous-traitant qui héberge, stocke ou conserve les données soit un hébergeur certifié HDS ([CNIL, cartographie des EDS](https://cartoeds.beta.cnil.fr/a-propos)).
- **Constituer l'entrepôt et l'utiliser sont deux formalités distinctes.** La déclaration couvre la constitution de l'entrepôt. Entraîner ou évaluer un modèle sur ses données passe par une formalité à part : méthodologie de référence ou autorisation recherche.

Pour un projet IA, la question à poser au départ est donc double : où sont hébergées les données, et sous quel régime l'entrepôt a été constitué.

## Et l'EHDS, le règlement européen, change quoi pour un projet IA ?

L'espace européen des données de santé (EHDS) est le règlement (UE) 2025/327. Il a été publié au Journal officiel de l'UE le 5 mars 2025 et il est entré en vigueur le 26 mars 2025 ([Commission européenne](https://health.ec.europa.eu/ehealth-digital-health-and-care/european-health-data-space-regulation-ehds_fr)). Entré en vigueur ne veut pas dire applicable : ses obligations arrivent par étapes, à partir de 2027.

| Date | Ce qui s'applique |
|---|---|
| 26 mars 2025 | Entrée en vigueur, début de la transition. Aucune obligation opérationnelle. |
| 26 mars 2027 | Application générale du règlement, avec les premiers actes d'exécution de la Commission. |
| 26 mars 2029 | Échange du premier groupe de données (résumé patient, ordonnance et dispensation électroniques) et règles d'utilisation secondaire pour la plupart des données. |
| 26 mars 2031 | Deuxième groupe (imagerie, résultats de laboratoire, comptes rendus de sortie) et utilisation secondaire d'autres catégories, comme les données génomiques. |

L'utilisation secondaire, c'est ce qui concerne l'IA : réutiliser des données de santé pour la recherche, l'innovation ou l'entraînement de modèles, via des organismes d'accès aux données. En novembre 2026, rien de cela ne remplace l'HDS ni les formalités CNIL. Un projet lancé aujourd'hui suit le cadre français, et prévoit simplement que l'accès secondaire aux données évoluera à partir de 2029.

## Quel texte encadre quoi ?

Cinq textes se superposent, et l'HDS ne couvre que l'hébergement.

| Texte | Ce qu'il encadre | Quand il touche un projet IA |
|---|---|---|
| HDS (art. L.1111-8 du code de la santé publique) | L'hébergement des données de santé pour le compte d'un tiers | Dès qu'un prestataire héberge ou administre les données |
| RGPD | Tout le traitement : finalité, base légale, conservation, droits | Toujours, dès la conception |
| Formalités CNIL santé (MR-001, MR-003, MR-004 ou autorisation) | La recherche, l'étude ou l'évaluation en santé | Pour entraîner ou évaluer un modèle sur ces données |
| Référentiel EDS de la CNIL | La constitution d'un entrepôt d'intérêt public | Si le projet s'appuie sur un entrepôt de données |
| EHDS (règlement (UE) 2025/327) | L'échange et la réutilisation des données de santé dans l'UE | Progressivement, à partir de 2027 |

## Check-list avant de lancer un projet IA sur des données de santé

1. Lister toutes les données traitées et confirmer lesquelles sont des données de santé.
2. Cartographier les flux : application, base, modèle d'IA, logs, sauvegardes, outils tiers.
3. Choisir un hébergeur dont le certificat HDS à jour (référentiel 2024) couvre les activités nécessaires, et lire sa cartographie des transferts hors EEE.
4. Décider qui administre la production, et vérifier si cela le fait entrer dans l'activité 5.
5. Pour chaque appel à un modèle : traitement dans un environnement couvert, ou données pseudonymisées.
6. Chiffrer les données, au repos et en transit, et restreindre les accès au strict nécessaire.
7. Mener l'analyse RGPD avec le DPO : base légale, durée de conservation, AIPD si nécessaire.
8. Si vous entraînez ou évaluez un modèle sur ces données, identifier la formalité CNIL (méthodologie de référence ou autorisation) avant de commencer.
9. Garder les environnements de test sans données réelles.

Pour la suite, du prototype à la production, voyez notre [check-list POC → prod pour un agent IA](/fr/resources/articles/poc-agent-ia-production).

## Où aller ensuite pour l'hébergement concret ?

Ce guide pose le cadre : qui doit être certifié, ce que disent le référentiel 2024 et la CNIL, et la check-list avant de lancer. Le choix concret de l'hébergement (cloud certifié, activités à couvrir, où vivent les appels au modèle, les logs et les sauvegardes) est détaillé dans [Hébergement HDS et IA](/fr/resources/articles/hebergement-hds-ia). Celui-ci couvre le « pourquoi » réglementaire, l'autre le « comment » côté infra.

## Ce qu'on a appris chez Monka

Monka accompagne les aidants avec des infirmières de coordination. Quand on est arrivés, Monka était déjà hébergée en HDS et en conformité. Notre job : développer très vite à l'intérieur de cet environnement. En deux mois, on a mis en production l'app des aidants, Lifeline (le CRM des infirmières) et le moteur clinique qui transforme un bilan de 165 questions en plan d'action. Le référentiel clinique est passé par 12 versions.

La leçon : quand le socle HDS existe déjà, un projet IA peut aller très vite, à condition de rester dans cet environnement. Aucune donnée n'en sort, et les logs comme les environnements de test vivent à l'intérieur. Du coup, on itère vite sans rouvrir le sujet conformité à chaque version.

[Lire le cas Monka →](/fr/case-studies/monka)

## FAQ

### Une startup qui utilise un cloud certifié HDS doit-elle être certifiée ?

Pas forcément. Si l'hébergeur certifié couvre toutes les activités d'hébergement et d'exploitation, l'éditeur peut s'appuyer sur lui. Si l'éditeur administre lui-même le système d'information qui contient les données, il peut relever de l'activité 5. Le contrat et la répartition des accès font la différence. Vérifiez aussi que le certificat couvre les activités que vous confiez à l'hébergeur. Le mot « HDS » sur une page marketing ne suffit pas.

### Peut-on utiliser ChatGPT, Claude ou Mistral avec des données de santé ?

Pas avec les versions grand public. Il faut un environnement dont l'hébergement et les conditions contractuelles couvrent les données de santé, ou des données pseudonymisées avant l'appel. Vérifiez le contrat exact, la région de traitement et la conservation des requêtes.

### Le référentiel HDS 2024 est-il déjà obligatoire ?

Oui. Les nouveaux candidats sont évalués sur cette version depuis le 16 novembre 2024, et les hébergeurs déjà certifiés devaient avoir migré au plus tard le 16 mai 2026.

### Faut-il une analyse d'impact (AIPD) pour un projet IA sur des données de santé ?

Souvent, oui. La CNIL publie une liste de traitements pour lesquels l'AIPD est obligatoire ([cnil.fr](https://www.cnil.fr/fr/liste-traitements-aipd-requise)). Un traitement absent de la liste peut quand même en demander une s'il remplit au moins deux des neuf critères européens, par exemple données sensibles et traitement à grande échelle. C'est le DPO qui tranche, de préférence avant le développement.

### Faut-il faire une démarche auprès de la CNIL pour un projet IA en santé ?

Pour entraîner ou évaluer un modèle sur des données de santé, le plus souvent oui. Selon la fiche CNIL de mars 2026, c'est une déclaration de conformité à une méthodologie de référence (MR-001, MR-003 ou MR-004), ou une demande d'autorisation si le projet n'entre pas dans ce cadre.

### Une base vectorielle construite sur des dossiers patients doit-elle rester en HDS ?

Oui. Les embeddings, les index et les textes sources issus de dossiers patients contiennent des données de santé. Ils se traitent comme la base principale : chez un hébergeur certifié pour les activités concernées, avec les mêmes droits d'accès.

### Un agent vocal IA pour la santé doit-il être hébergé en HDS ?

Oui, dès qu'il traite des données de santé recueillies dans le cadre de soins ou de suivi et qu'un prestataire les héberge pour le compte de l'établissement. Les enregistrements audio, les transcriptions et les résumés générés par l'agent sont des données de santé. Ils suivent la même règle que le dossier patient, comme les logs de l'agent.

### HDS et RGPD, c'est la même chose ?

Non. L'HDS porte sur l'hébergement des données de santé. Le RGPD porte sur tout le traitement : finalité, base légale, minimisation, durée de conservation, droits des personnes.

### Comment choisir un hébergeur HDS pour un projet IA ?

Commencez par les activités du certificat (référentiel 2024), la cartographie des transferts hors EEE, et le parcours des appels au modèle, des logs et des sauvegardes. Un cloud certifié sur les activités 1 à 4 ne couvre pas l'administration de votre application si c'est vous qui la faites. Le détail pratique (quoi demander au fournisseur, où bloquent souvent les projets IA) est dans [Hébergement HDS et IA](/fr/resources/articles/hebergement-hds-ia).

### Combien de temps faut-il pour mettre en production un projet IA en santé ?

Cela dépend du périmètre. Chez Monka, l'app, le CRM et le moteur clinique étaient en production en deux mois, parce que le socle HDS existait déjà et que tout le développement est resté à l'intérieur.

## Vous avez un projet IA avec des données de santé ?

The Vibe Company est une agence IA à Paris, [fondée en 2024 par Stan Girard et Antoine Dewez](/fr/a-propos), passée par Y Combinator. La santé (HDS) et la sécurité font partie de nos spécialités, avec le frontend et le DevOps. On travaille avec des entreprises de taille moyenne à grande, de la cartographie des données à la mise en production.

[Besoin d'un projet IA santé en prod ?](/fr/ia-sante-hds) Notre page IA santé & HDS détaille ce qu'on livre et comment on démarre.

[Réservez 30 minutes pour parler de votre projet →](https://cal.com/stangirard/thevibecompany)

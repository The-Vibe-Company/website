---
title: "Le vrai risque des agents IA, c'est l'autorité"
slug: agents-ia-formation-autorite
summary: "La sécurité des agents IA ne se décide pas seulement par marque d'outil. Elle dépend surtout du niveau d'autorité accordé : lire, proposer, préparer ou exécuter."
publishedAt: 2026-04-29
complexity: intermediate
topics: AI Agents, AI Adoption, Security
coverImage: /images/resources/agents-ia-formation-autorite/cover-tvc.png
coverAlt: "Une table de travail montre quatre niveaux d'autorité pour les agents IA : lire, proposer, préparer et exécuter"
ogImage: /images/resources/agents-ia-formation-autorite/cover-og.png
---

Le risque n'apparaît pas quand une équipe branche une IA à sa boîte mail. Il apparaît quand elle coche « envoyer automatiquement ».

Au début, l'agent lit les messages entrants, résume les demandes et prépare des réponses. C'est utile, concret, et personne n'a l'impression de faire quelque chose de dangereux. Puis l'équipe ajoute une petite option : envoyer les réponses simples sans validation. Le changement paraît minuscule. En réalité, il vient de franchir une frontière de sécurité.

Entre « préparer une réponse » et « envoyer une réponse », ce n'est pas le même système. Dans le premier cas, l'IA aide. Dans le second, elle agit au nom de l'entreprise.

C'est cette frontière que beaucoup de politiques IA ratent encore : elles classent les outils, alors qu'elles devraient aussi classer les niveaux d'autorité.

## Un chatbot parle. Un agent agit.

Le changement important n'est pas seulement l'arrivée de meilleurs modèles. Le changement important, c'est que les modèles sont maintenant connectés à des outils.

Un agent peut lire un email, préparer une réponse, ouvrir une issue, mettre à jour un CRM, créer une pull request, modifier un document, appeler une API, lancer une commande, déployer, supprimer, transférer ou envoyer.

Un chatbot peut dire une bêtise. Un agent peut faire une bêtise.

Ce n'est pas une raison pour bloquer les agents. C'est une raison pour les gouverner correctement. La vraie question n'est pas seulement : « quel outil est autorisé ? » La vraie question est : quel niveau d'autorité donne-t-on à cet outil, sur quelles données, avec quelles validations, quels logs, et quelle possibilité de retour arrière ?

## La question sécurité ne suffit plus

Quand une entreprise parle d'IA, la première question est souvent : « est-ce que nos données sont sécurisées ? » La question est normale. Personne ne veut copier du code, des contrats, des exports client ou des informations internes dans un outil qui les réutilise n'importe comment.

Mais dans les offres enterprise correctement contractualisées, ce sujet a beaucoup mûri. [OpenAI](https://openai.com/index/business-data/), [Anthropic](https://www.anthropic.com/enterprise), [Microsoft 365 Copilot](https://learn.microsoft.com/copilot/microsoft-365/microsoft-365-copilot-privacy), [GitHub Copilot](https://github.com/trust-center), [Google Workspace avec Gemini](https://support.google.com/a/answer/15706919) ou [Perplexity Enterprise](https://www.perplexity.ai/enterprise) ont tous intérêt à lever le frein sécurité, parce que leur adoption entreprise en dépend. Les mêmes briques reviennent partout : DPA, non-entraînement par défaut sur les données business, SSO, contrôles admin, rétention documentée, chiffrement, certifications, logs ou audit selon les plans.

Il faut quand même vérifier ces points au niveau du contrat applicable, pas seulement dans une page marketing : plan exact, région, sous-traitants, options d'administration, rétention des prompts et réponses, résidence des données, connecteurs activés, traitements de sécurité, cas réglementés. Deux outils peuvent tous les deux promettre le non-entraînement tout en étant très différents sur les journaux, la localisation, les droits admin ou l'auditabilité.

Donc non, la sécurité de la donnée n'est pas « réglée ». Elle devient traitable contractuellement et techniquement chez les grands fournisseurs. Le risque moins bien traité, lui, est souvent opérationnel : qu'a le droit de faire l'agent une fois qu'il est connecté ?

Le mauvais choix, ce n'est pas d'adopter un outil puissant. Le mauvais choix, c'est d'adopter un outil sans former les équipes au pouvoir qu'il donne.

## Vous n'allez pas éviter tous les usages agentiques

Les fonctions agentiques arrivent déjà dans les outils que les équipes utilisent : suites bureautiques, IDE, CRM, ticketing, support, plateformes cloud, outils de documentation, automatisation interne. On peut essayer de tout réduire à un seul copilote officiellement autorisé. C'est rassurant dans une politique interne. C'est rarement comme ça que le travail réel se fait.

Tous les outils ne sont pas bons pour les mêmes usages. Certains sont meilleurs pour la bureautique, d'autres pour le code, la recherche, l'analyse documentaire ou l'automatisation entre outils. La bonne stratégie n'est donc pas de choisir l'outil qui markete le mieux la sécurité. C'est de choisir les meilleurs outils pour les bons usages, dans un cadre enterprise, puis de former les équipes à les utiliser correctement.

Il vaut mieux un très bon outil bien cadré qu'un outil moyen choisi parce qu'il donne une fausse impression de contrôle.

## L'autorité, c'est quoi exactement ?

Par autorité, on entend la combinaison de quatre choses :

- les données auxquelles l'agent peut accéder ;
- les outils qu'il peut appeler ;
- les actions qu'il peut déclencher ;
- l'autonomie avec laquelle il peut le faire sans validation humaine.

Le risque ne dépend donc pas seulement de la permission technique. Il dépend aussi du périmètre, de l'autonomie et de la réversibilité.

Un agent qui peut lire beaucoup de documents n'est déjà pas neutre. Mais un agent qui peut écrire, envoyer, supprimer, payer, merger, déployer ou modifier des permissions devient un acteur opérationnel. Il ne faut plus le traiter comme une interface de chat.

## La grille d'autorité : lire, proposer, préparer, exécuter

Pour gouverner les agents IA, il faut arrêter de classer seulement les outils. Il faut classer les niveaux d'autorité. La grille la plus simple tient en quatre verbes.

**Lire** : l'agent cherche, résume, compare ou analyse. Il lit un thread mail, un ticket, une documentation, des logs ou un dépôt de code. Le risque principal est la donnée : ce qu'il voit, d'où vient le contexte, et si cette lecture est légitime.

**Proposer** : l'agent produit une sortie sans l'appliquer. Il rédige un brouillon, recommande une réponse, propose un diff, prépare un plan d'action. Le risque principal est la qualité de la recommandation. L'humain reste responsable de la décision.

**Préparer** : l'agent met l'action au seuil de l'exécution. Il ouvre une PR, prépare un email avec destinataire et pièce jointe, crée une mise à jour CRM prête à valider, configure une action dans un outil. Le risque principal est que la validation devienne automatique parce que tout est déjà prêt.

**Exécuter** : l'agent fait l'action. Il envoie, supprime, transfère, modifie, merge, déploie, paie, ferme un ticket, change une permission ou appelle une API avec effet réel. Le risque principal est l'impact : externe, irréversible, durable, ou difficile à attribuer.

Cette grille est plus utile qu'une liste abstraite d'outils autorisés. Elle apprend aux équipes à voir quand elles changent de zone.

Un agent qui explique une erreur de logs n'a pas le même niveau d'autorité qu'un agent qui redémarre un service. Un agent qui propose une PR n'a pas le même niveau d'autorité qu'un agent qui merge. Un agent qui résume une conversation client n'a pas le même niveau d'autorité qu'un agent qui crédite le client ou ferme le ticket.

La frontière importante n'est pas « IA ou pas IA ». La frontière importante est : « l'IA m'aide » ou « l'IA agit à ma place ».

## Les permissions comptent plus que le logo

Prenons l'exemple de la boîte mail.

- Lire les messages pose une question de confidentialité.
- Envoyer des réponses pose une question d'identité : l'agent parle au nom de l'entreprise.
- Transférer pose une question d'exfiltration.
- Supprimer pose une question d'intégrité.
- Modifier des règles de forwarding pose une question de contrôle durable, parce que l'effet peut survivre à l'interaction initiale.

Google le montre très bien dans les [scopes de l'API Gmail](https://developers.google.com/workspace/gmail/api/auth/scopes) : lire, composer, envoyer, modifier et supprimer définitivement ne sont pas les mêmes permissions. OWASP donne aussi un nom à ce risque : [Excessive Agency](https://genai.owasp.org/llmrisk/llm062025-excessive-agency/). Le problème apparaît quand un agent dispose de plus de fonctionnalités, de permissions ou d'autonomie que nécessaire.

Le logo compte, bien sûr : sécurité produit, contrat, isolation, auditabilité, support incident, modèle de permission. Mais il ne remplace pas l'analyse des droits réellement accordés. Un outil moyen avec trop de permissions peut être plus dangereux qu'un outil très puissant limité à lire et proposer.

## La prompt injection devient sérieuse quand l'agent peut agir

Un agent connecté ne reçoit pas seulement des consignes de l'utilisateur. Il lit aussi des contenus externes : emails, tickets, pages web, documents, issues GitHub, commentaires, fichiers de projet. Ces contenus peuvent contenir des instructions malveillantes ou ambiguës.

C'est le risque de prompt injection indirecte : l'agent croit suivre le travail demandé, mais obéit en réalité à une instruction venue d'une source non fiable.

Ce risque existe déjà quand l'agent lit ou propose. Mais il change de nature quand l'agent peut envoyer, supprimer, transférer, modifier des droits, appeler une API ou déclencher une action externe. Plus l'agent a d'autorité, plus les sources qu'il lit doivent être considérées comme potentiellement hostiles.

## Une politique d'outils ne suffit pas

Limiter les outils autorisés est utile. Cela évite les comptes personnels, les mauvais contrats et les intégrations douteuses. Mais ce n'est pas suffisant. Un outil autorisé peut être mal configuré, et un outil puissant peut être utilisé de manière beaucoup plus sûre s'il est limité à un périmètre clair.

La politique IA définit les outils, les données et les règles. La formation rend cette politique applicable dans le travail quotidien. Elle apprend aux équipes à reconnaître les changements de niveau d'autorité : quand un assistant devient un acteur, quand une suggestion devient une action préparée, quand une automatisation confortable dépasse son mandat.

C'est exactement le sujet des [surfaces MCP](/resources/articles/mcp-servers-dont-just-expose-tools-they-encode-how-work-gets-done) : donner accès à un outil ne suffit pas. Il faut aussi transmettre la méthode, les limites, les étapes de revue et le goût opérationnel de l'entreprise.

La formation doit donc aller plus loin que « voici comment écrire un prompt ». Elle doit apprendre aux équipes à construire des usages sûrs.

## Les garde-fous minimum avant de laisser un agent agir

Avant de donner à un agent le droit d'exécuter, il faut autre chose qu'un bon contrat fournisseur.

Il faut au minimum savoir :

- quelles données l'agent peut lire ;
- quelles sources sont fiables ou non ;
- quelles actions il peut seulement proposer ;
- quelles actions il peut préparer ;
- quelles actions il peut exécuter ;
- avec quel compte technique il agit ;
- qui valide ;
- ce qui est journalisé ;
- comment arrêter l'agent ;
- comment annuler ou corriger une action ;
- quand l'IT, la sécurité ou le légal doivent être impliqués.

Quelques règles simples changent beaucoup le niveau de risque : moindre privilège, scopes séparés, dry-run par défaut, validation humaine pour les actions externes ou irréversibles, logs exploitables, quotas, allowlist d'actions, expiration des accès, séparation sandbox / pilote / production, procédure d'incident et kill switch.

Pour les actions critiques, il faut aller plus loin : validation à deux personnes, protection des branches, pas d'accès direct aux secrets de production, pas de déploiement prod hors pipeline contrôlé, sauvegarde ou versioning avant modification, et revue régulière des permissions.

La formation est nécessaire, mais elle ne remplace pas les contrôles techniques. Elle donne aux équipes le bon modèle mental. Les permissions, les logs, les validations et les procédures d'arrêt rendent ce modèle réel dans les outils.

## Ce qu'il faut vraiment former

Former à l'IA, ce n'est pas apprendre à écrire de meilleurs prompts. C'est apprendre à donner le bon niveau d'autorité à un outil très capable.

Une formation sérieuse devrait apprendre aux équipes à répondre à ces questions :

1. Quelles données l'agent peut-il lire ?
2. Quelles sorties peut-il seulement proposer ?
3. Quelles actions peut-il préparer sans les exécuter ?
4. Quelles actions lui sont interdites ?
5. Quelles actions exigent une validation humaine ?
6. Quelles actions sont irréversibles ?
7. Quels connecteurs augmentent réellement le risque : mail, CRM, ticketing, repo, drive, cloud, finance ?
8. Quels scopes sont nécessaires, et lesquels sont excessifs ?
9. Quelles sources externes peuvent injecter de mauvaises instructions ?
10. Quels logs permettent d'attribuer une action ?
11. Comment tester l'agent en sandbox avant de l'élargir ?
12. Quand escalader vers IT, sécurité ou légal ?

Le dernier point est important. Le danger ne vient pas toujours d'un agent qui échoue. Il vient parfois d'un agent qui marche assez bien pour qu'on lui donne trop vite l'étape suivante.

D'abord il résume. Puis il prépare. Puis il envoie. Puis il modifie. Puis il décide.

La formation sert à mettre des mots sur ces paliers avant que les équipes ne les franchissent par confort.

## Choisir les outils après avoir défini l'autorité

Chez The Vibe Company, nous ne pensons pas que la bonne approche soit de bloquer tous les outils ou de choisir un seul copilote par défaut. Les équipes auront besoin de plusieurs outils selon les usages : recherche, code, documentation, support, analyse, automatisation.

Mais l'ordre compte. Avant de choisir définitivement les outils, il faut comprendre les usages réels et le niveau d'autorité que chaque workflow demande.

Concrètement, cela veut dire :

- cartographier les usages IA existants et probables ;
- identifier les données et connecteurs impliqués ;
- classer chaque usage en lire, proposer, préparer ou exécuter ;
- choisir les bons outils pour les bons cas ;
- définir les permissions, validations, logs et procédures d'arrêt ;
- former les équipes sur des cas réels : mail, CRM, code, support, documentation ;
- construire des agents utiles mais bornés ;
- garder la validation humaine au bon endroit.

Nous n'aidons pas les équipes à contourner l'IT ou la sécurité. Au contraire, l'objectif est de rendre la discussion plus concrète : non pas « autoriser ou interdire l'IA », mais décider quels agents peuvent lire quoi, proposer quoi, préparer quoi, et exécuter quoi.

## Former avant d'automatiser

Les agents IA vont devenir normaux dans le travail. Ils liront, proposeront, prépareront, automatiseront.

La bonne réponse n'est pas de faire peur aux équipes. Ce n'est pas non plus de tout bloquer ou de choisir l'outil le plus confortable politiquement. La bonne réponse est de choisir les bons outils, puis d'apprendre aux équipes les bonnes frontières.

L'enjeu n'est pas de choisir entre confiance et interdiction. L'enjeu est de former des équipes capables d'utiliser des agents puissants avec le bon niveau d'autorité.

Si vous déployez des agents IA, ou si vos équipes commencent déjà à en utiliser, commencez par une cartographie simple : quels agents lisent, lesquels proposent, lesquels préparent, lesquels exécutent ?

C'est souvent là que les vrais risques apparaissent.

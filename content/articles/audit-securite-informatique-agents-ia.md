---
title: "Audit de sécurité informatique avant la mise en prod : une faille trouvée par des agents en une heure environ, et ce qui reste humain"
seoTitle: "Audit de sécurité informatique : ce que trouvent les agents"
seoDescription: "Audit de sécurité informatique avec des agents IA : une liste de failles connues, un sous-agent par cas, un vrai cas trouvé en une heure, et la part humaine."
slug: audit-securite-informatique-agents-ia
translationKey: ai-agent-security-audit-before-launch
language: fr
summary: "Un agent décompile une application Android et trouve des secrets en clair. La méthode d'audit par agents, ce qu'elle remonte, et ce qui reste humain."
publishedAt: 2026-11-20
complexity: intermediate
topics: AI Agents, Security, AI Operations
author: stan-girard
coverImage: /images/resources/audit-securite-informatique-agents-ia/cover-mascotte.webp
coverAlt: "La mascotte The Vibe Company inspecte de nuit, à la loupe, une porte ambrée d'une maquette d'application traversée par de petites lanternes"
ogImage: /images/resources/audit-securite-informatique-agents-ia/cover-mascotte.webp
---

Un audit de sécurité informatique peut commencer avant même le premier contrat. Chez un prospect, avant toute signature et avec son accord, j'ai demandé à un agent de télécharger son application Android et de la décompiler. Un audit avant une mise en prod, aujourd'hui, c'est ça : « tu lances une armée d'agents ».

Il a suffi de 30 secondes pour la décompiler. Je n'avais pas encore accès à son code, et des secrets apparaissaient déjà en clair dans les variables d'environnement, par exemple un mot de passe de base de données.

J'ai lancé plein de sous-agents, et en une heure environ ils avaient identifié les problèmes. J'ai pu signaler au prospect une faille majeure dans son application.

Trouver ça n'a rien d'un exploit. L'OWASP classe les identifiants en dur dans une application mobile parmi les failles [faciles à exploiter et faciles à détecter](https://owasp.org/www-project-mobile-top-10/2023-risks/m1-improper-credential-usage), avec un impact sévère.

Les agents trouvent vite, et en profondeur. Le périmètre, la validation des résultats, le test d'intrusion, l'ordre des corrections et le signalement restent un travail d'humain.

## Un audit de sécurité informatique par agents part d'une liste de failles récurrentes

Tout commence par une liste.

![Méthode d'audit de sécurité par agents : une liste de failles récurrentes, un agent qui cartographie l'application et remonte 10 à 30 cas, un sous-agent par cas, puis un audit ou des quick fixes, avec un humain sur le périmètre, la validation et les priorités. Détaillé ci-dessous.](/images/resources/audit-securite-informatique-agents-ia/methode-480.png "Les agents trouvent et confirment, l'humain cadre et décide.")

Vous y mettez les problèmes de sécurité connus, ceux qui reviennent d'une application à l'autre.

Pour une première passe, trois familles suffisent à remplir le haut de la liste, toutes documentées par l'OWASP : les routes d'API mal protégées, les frameworks et packages dont la version a une CVE connue, et les secrets écrits en dur.

Vous donnez cette liste à un agent et vous lui demandez d'analyser votre application, le back, les microservices et le reste, pour y identifier ces problèmes. Il cartographie, puis il remonte des cas candidats. « Ça va t'identifier 10, 20, 30 cas ».

Pour fixer les idées, voici un exemple de consigne pour cette première passe, à adapter à votre dépôt :

```text
Analyse ce dépôt (back et microservices) face à cette liste :
1. routes d'API sans contrôle d'accès, ou sans vérification que la ressource appartient à l'utilisateur connecté ;
2. frameworks et packages dont la version a une CVE connue ;
3. secrets écrits en dur dans le code ou la configuration.
Pour chaque cas candidat, donne le fichier, la route ou le package, et la raison du soupçon.
Ne modifie rien et ne lance aucune requête vers un système en production.
```

Un cas candidat n'est pas encore une faille confirmée. Pour chacun, vous lancez donc un sous-agent, dont le travail est de creuser le code autour de ce cas pour confirmer le problème.

À la sortie, vous choisissez : vous en faites un audit, ou vous demandez des quick fixes, que les agents proposent assez rapidement.

Les checks statiques que des humains lançaient avant n'ont pas disparu. « Ça, c'est toujours le cas », et un outil fait pour ça s'en charge. Ce qui est nouveau, ce sont des agents capables d'analyser votre code en profondeur et d'y identifier les problèmes.

## Ce que les agents remontent le plus, c'est un utilisateur qui lit les données d'un autre

Le cas le plus fréquent, « en général, c'est lié aux routes qui sont pas protégées sur l'API ou des routes qui sont mal protégées. » Un utilisateur connecté obtient les informations d'un autre, parce que personne ne vérifie que la ressource demandée lui appartient.

Imaginez une route /factures/{id} dans votre API. Elle vérifie que l'appelant est connecté, puis renvoie la facture demandée. Si elle ne vérifie pas aussi que cette facture est la sienne, un client qui change l'identifiant lit la facture d'un autre client.

Ce défaut s'appelle le contrôle d'accès cassé. Il garde la première place de l'OWASP Top 10:2025, où [100 % des applications testées en présentaient une forme](https://owasp.org/Top10/2025/A01_2025-Broken_Access_Control/). Côté API, il porte le nom de BOLA (Broken Object Level Authorization) et le code API1:2023, [premier risque de la liste que l'OWASP consacre aux API](https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/).

Partez donc du principe que votre application est concernée tant qu'une vérification n'a pas montré le contraire.

La règle de l'OWASP est facile à énoncer. Chaque endpoint qui reçoit l'identifiant d'un objet et qui agit sur cet objet doit vérifier les droits au niveau de l'objet. Se contenter de comparer l'identifiant de session à l'identifiant demandé n'est pas une solution suffisante.

Tenir cette règle sur toute une API est un travail de relecture. C'est là qu'un agent est bon : il lit chaque route, et pour chacune il vérifie que la propriété de la ressource est contrôlée.

Une fois les trous bouchés, il reste à empêcher qu'ils reviennent. L'OWASP recommande d'écrire des tests qui évaluent le mécanisme d'autorisation, et de ne pas déployer un changement qui les fait échouer.

Ensuite, il faut regarder les versions des frameworks et des packages que vous utilisez, et vérifier si elles ont des CVE. L'OWASP en a fait une catégorie de son classement, [les défaillances de la chaîne d'approvisionnement logicielle](https://owasp.org/Top10/2025/A03_2025-Software_Supply_Chain_Failures/). Vous êtes probablement vulnérable, écrit-il, si vous ne suivez pas les versions de tous vos composants, dépendances transitives comprises, ou si vous ne scannez pas régulièrement.

Sur un SaaS, les dépendances et les secrets à sortir du dépôt ont leur propre article, sur [la façon dont des agents durcissent un SaaS au-delà de la CI](/fr/resources/articles/agents-ia-durcir-saas). Pour la sécurité informatique d'une PME, la veille CVE est décrite dans celui qui explique [comment durcir son SI avec une flotte d'agents](/fr/resources/articles/ia-et-cybersecurite-durcir-si).

## Le pentest par agent existe, et il lui faut un cadre écrit

Vous pouvez aller un cran plus loin que la lecture du code, avec le « white hacking ». Vous dites à un modèle que vous faites un audit, vous lui demandez d'essayer de pénétrer votre application, et vous le lancez dessus, en local.

Cette étape est plus difficile que les précédentes : « de plus en plus, les grands modèles, OpenAI, Anthropic, etc., mettent en place des règles pour éviter que ça se passe, parce que c'est un gros problème. »

Ces règles sont publiques. [La politique d'usage d'Anthropic](https://www.anthropic.com/legal/aup), en vigueur le 12 novembre 2026, interdit de découvrir ou d'exploiter des vulnérabilités dans un système sans l'autorisation de son propriétaire. Elle n'interdit pas les tests menés sur les systèmes que vous possédez ou exploitez.

Ses produits ont pourtant des garde-fous en temps réel, qui peuvent bloquer ou limiter certaines réponses. Pour certains usages à double tranchant, Anthropic propose de candidater à un Cyber Verification Program.

OpenAI suit la même logique avec son programme Daybreak. Le niveau prévu pour le test d'intrusion autorisé [exige une approbation séparée, une vérification renforcée et des contrôles d'accès](https://help.openai.com/en/articles/20001258-openai-daybreak-trusted-access-for-cyber-overview), et rien n'y est autorisé en dehors des systèmes que vous possédez ou que vous avez explicitement le droit de tester.

Même sur votre propre application, un agent peut donc être bloqué au milieu d'un test. Cette étape demande un cadre, une autorisation écrite et un humain aux commandes.

Le droit français pousse dans le même sens. [L'article 323-1 du Code pénal](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000030939438) punit de trois ans d'emprisonnement et de 100 000 € d'amende le fait d'accéder ou de se maintenir, frauduleusement, dans tout ou partie d'un système de traitement automatisé de données. Avant le moindre test, écrivez donc ce que vous avez le droit de tester.

## Les agents trouvent, l'humain décide

Une armée d'agents ne sait pas ce qu'elle a le droit de tester. Le périmètre, c'est vous qui le fixez, par écrit, avant le premier lancement.

Elle ne tranche pas non plus. Les agents remontent des cas candidats et les sous-agents les confirment dans le code. Il faut encore quelqu'un pour valider chaque résultat, puis pour superviser le pentest si vous allez jusque-là.

L'ordre des corrections vous revient aussi. Les agents proposent des quick fixes, mais choisir ce qui se corrige avant la mise en prod et ce qui attend reste votre décision.

Reste le signalement. Quand un agent trouve un secret exposé dans une application qui n'est pas la vôtre, même avec l'accord de son propriétaire, la suite responsable est de le prévenir. C'est ce que j'ai fait avec l'application du début.

Un audit reste ponctuel, alors que votre code continue de changer. La suite est le contrôle continu, avec [un agent de sécurité dans la CI/CD, qui travaille PR par PR](/fr/resources/articles/agent-securite-ci). Si vous préférez confier le chantier, The Vibe Company propose de [faire durcir son produit par une flotte d'agents](/fr/agents-ia-securite-produit). Et si un client ou un marché exige un prestataire qualifié par l'ANSSI, la liste officielle est publiée sur [MesServicesCyber](https://messervices.cyber.gouv.fr/prestataires-labellises).

Revenez à l'application du début. Il n'a fallu aucun accès au code, seulement l'application et le temps d'une décompilation. Un attaquant, lui, ne vous demandera pas votre accord avant de chercher la même chose dans votre application.

Faites-le donc avant lui. Téléchargez votre propre APK ou ouvrez votre propre dépôt, donnez votre liste de failles à un agent, et lancez la première passe avant la mise en prod.

Un mot de méthode pour finir : le cas raconté ici est unique et anonymisé, et sa durée ne vaut que pour lui. [Prenez rendez-vous](https://cal.com/stangirard/thevibecompany) si vous voulez faire cette première passe avec moi sur votre application.

## FAQ

### Combien de temps prend un audit de sécurité informatique mené avec des agents ?

Dans le cas raconté ici, il a fallu environ une heure à des sous-agents pour identifier les problèmes dans l'application Android d'un prospect, avec son accord, et 30 secondes pour la décompiler. Cette durée ne vaut que pour ce cas. Un audit complet dépend du périmètre que vous fixez et du temps qu'un humain passe à valider chaque cas remonté.

### Un audit par agents remplace-t-il un test d'intrusion ?

Non, un audit par agents ne remplace pas un test d'intrusion. Les agents analysent le code et remontent des cas candidats qu'un humain valide. Le test d'intrusion par agent est une étape à part, qui demande une autorisation écrite et un humain aux commandes. Si un client exige un prestataire qualifié par l'ANSSI, la liste officielle est publiée sur MesServicesCyber.

### Par où commencer pour la sécurité informatique d'une PME avant une mise en prod ?

Commencez par une liste de failles récurrentes, avec en tête les routes d'API mal protégées et les versions de packages qui ont des CVE. Demandez à un agent d'analyser l'application face à cette liste, puis lancez un sous-agent par cas remonté pour le confirmer dans le code. Gardez pour vous le périmètre, la validation des résultats et l'ordre des corrections.

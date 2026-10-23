---
title: "Travailler avec un prestataire IA : les étapes d'un projet"
slug: travailler-prestataire-ia
translationKey: working-with-ai-agency-project-steps
language: fr
summary: "Travailler avec un prestataire IA : ce qu'il faut préparer, les cinq étapes jusqu'à la production, qui fait quoi et les signaux qu'un projet dérape."
publishedAt: 2026-10-23
complexity: beginner
topics: AI Adoption, Strategy, AI Operations
coverImage: /images/resources/travailler-prestataire-ia/cover-mascotte.webp
coverAlt: "La mascotte de The Vibe Company et trois membres d'une équipe cliente assemblent ensemble un assistant mécanique sur un établi, devant une ville au crépuscule"
ogImage: /images/resources/travailler-prestataire-ia/cover-mascotte.webp
---

Travailler avec un prestataire IA, c'est confier à une équipe extérieure la construction d'un outil d'IA (un agent, un assistant, une automatisation) qui doit tourner sur vos données et dans vos outils. Le projet réussit quand les deux côtés savent ce qu'ils apportent : vous, le problème, les données et la décision ; le prestataire, la méthode, le code et la mise en production.

Choisir le bon partenaire, on l'a traité dans un autre guide : [comment choisir une agence IA, une ESN ou un freelance](/fr/resources/articles/choisir-agence-ia-esn-freelance). Ici, on part du moment d'après. Vous avez un prestataire en tête, ou vous êtes sur le point de signer. À quoi ressemblent les semaines qui suivent ?

## Pourquoi passer par un prestataire, et pourquoi ça échoue quand même

Le rapport du MIT NANDA sur l'IA générative en entreprise, publié en août 2025, est connu pour son chiffre de 95 % de pilotes sans effet mesurable. Il contient un autre résultat, moins cité. Selon le compte rendu de [Fortune](https://fortune.com/2025/08/18/mit-report-95-percent-generative-ai-pilots-at-companies-failing-cfo/), acheter des outils à des spécialistes et construire en partenariat réussit environ 67 % du temps, contre trois fois moins souvent pour les projets construits uniquement en interne. La méthodologie de l'étude est discutée, il faut donc lire ces chiffres comme un ordre de grandeur.

Passer par un prestataire ne garantit rien. [Gartner](https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027) prévoit que plus de 40 % des projets d'IA agentique seront abandonnés d'ici fin 2027, à cause de coûts qui dérapent, d'une valeur métier floue ou de contrôles de risque insuffisants. Ces trois causes se règlent presque toutes dans la façon de mener le projet, pas dans le choix du modèle.

## Avant le premier appel : quatre choses à préparer

Vous n'avez pas besoin d'un cahier des charges de trente pages. Il vous faut quatre réponses courtes.

1. **Le problème, en une phrase.** « Nos conseillers passent trop de temps à rédiger les réponses aux tickets répétitifs » vaut mieux que « on veut de l'IA dans le support ».
2. **Le volume et la mesure actuelle.** Combien de tickets, de documents ou de dossiers par jour, et combien de temps chacun prend aujourd'hui. Sans point de départ, impossible de dire plus tard si le projet a marché.
3. **Les données et les outils.** Où vivent les informations utiles (CRM, ticketing, drive, base métier), qui y a accès, et s'il y a des contraintes particulières : données personnelles, données de santé, secret des affaires.
4. **La personne qui décide.** Un projet IA bloque rarement sur la technique. Il bloque quand personne ne peut trancher une question métier en moins d'une semaine.

Avec ces quatre réponses, un bon prestataire peut vous dire dès le premier appel si le sujet se prête à l'IA, et si un outil du marché ne ferait pas déjà l'affaire.

## Les cinq étapes d'un projet qui va jusqu'en production

### 1. Le cadrage : un problème, une mesure, un périmètre

Le cadrage transforme votre phrase de départ en périmètre précis : quel processus, quels utilisateurs, quelles données, quelle mesure de succès. On y décide aussi de ce qu'on ne fera pas. Un bon cadrage tient sur une page et se termine par une liste de risques connus (accès aux données, validation juridique, adoption par les équipes).

À la fin, vous devez pouvoir répondre à une question simple : si le projet réussit, quel chiffre aura bougé ?

### 2. Le premier prototype, sur vos vraies données

Le prototype sert à vérifier la partie la plus incertaine, sur un échantillon réel. Pas sur des données inventées : un assistant qui marche sur trois exemples propres échoue souvent sur le centième ticket mal rédigé. Si le prototype ne passe pas, c'est le meilleur moment pour arrêter, avant d'avoir dépensé le budget de la suite. On détaille cette étape dans [la checklist pour passer un agent IA du POC à la production](/fr/resources/articles/poc-agent-ia-production).

### 3. Des itérations courtes, montrées à vos équipes

Ensuite, le prestataire livre par petites versions, et vos utilisateurs les testent. C'est là que le produit se forme. Chez [Monka](/fr/case-studies/monka), qui accompagne les aidants avec des infirmières de coordination, le référentiel clinique en est à 12 versions, et le moteur a été conçu pour évoluer sans casser l'app. Le rythme compte moins que la régularité : chaque version doit être montrée, commentée et corrigée.

### 4. La mise en production : la partie qu'on oublie dans les devis

Un outil d'IA en production, c'est un outil branché sur vos systèmes, avec des droits d'accès, un hébergement, une journalisation et quelqu'un qui le surveille. Chez [LocService](/fr/case-studies/locservice), l'assistant support est connecté aux API internes pour récupérer le vrai contexte de chaque client, et des règles de classification font que la même question reçoit la bonne réponse selon le type de client. Résultat publié : sur plusieurs centaines de tickets par jour, les brouillons de l'IA sont utilisés pour 87 % d'entre eux. L'équipe support garde la main sur la réponse envoyée.

Quand les données sont sensibles, la production se prépare dès le cadrage. Chez Monka, l'environnement d'hébergement de données de santé existait déjà : en deux mois, l'app des aidants, le CRM des infirmières et l'API qui relie le tout ont été mis en production sans en sortir. On explique ces contraintes dans notre guide sur [l'IA et les données de santé (HDS)](/fr/resources/articles/ia-donnees-de-sante-hds).

### 5. Après la mise en production : mesurer, transmettre, faire évoluer

Une fois l'outil en ligne, on compare la mesure à celle du départ. Puis vient la question de l'autonomie : qui fait évoluer l'outil dans six mois ? Un bon prestataire documente, transmet le code et forme vos équipes. C'est ce qu'on fait avec [Theodo](/fr/case-studies/theodo), où l'accompagnement et la formation des équipes font partie du travail, pour qu'elles adoptent les pratiques de développement assisté par IA et avancent plus vite.

## Qui fait quoi : client et prestataire

| Sujet | Côté client | Côté prestataire |
| --- | --- | --- |
| Problème et mesure de succès | Fournit le problème et le chiffre de départ | Le reformule en périmètre testable |
| Données et accès | Ouvre les accès, valide ce qui peut être utilisé | Demande le minimum, documente l'usage |
| Décisions métier | Tranche vite, une personne identifiée | Prépare les options avec leurs conséquences |
| Tests | Fait tester par les vrais utilisateurs | Livre des versions testables régulièrement |
| Sécurité et conformité | Indique les contraintes (RGPD, santé, interne) | Conçoit l'outil pour les respecter dès le départ |
| Après la production | Désigne qui reprend l'outil | Documente, transmet et forme |

## Contrat, données et propriété : les points à fixer avant de commencer

- **Les données personnelles.** Si le prestataire traite des données personnelles pour votre compte, le RGPD impose un contrat qui encadre ce traitement : objet, durée, finalité, mesures de sécurité, sort des données à la fin ([article 28 du RGPD](https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32016R0679)).
- **La propriété du code et des prompts.** Précisez qui possède le code, les prompts, les jeux de tests et la documentation à la fin du projet.
- **Les comptes et les clés.** Les comptes chez les fournisseurs de modèles et d'hébergement doivent idéalement être à votre nom. Sinon, la passation devient un projet en soi.
- **Le point d'arrêt.** Prévoyez un moment, après le prototype, où chacun peut arrêter sans pénalité si le résultat n'est pas là.

## Les signaux qu'un projet dérape

- Personne côté client ne peut trancher une question métier en moins d'une semaine.
- Le prototype n'a été montré que sur des exemples choisis par le prestataire.
- La mise en production, l'hébergement et les droits d'accès n'apparaissent nulle part dans le planning.
- Aucune mesure de départ n'a été prise, donc personne ne saura dire si ça marche.
- Le code, les comptes ou la documentation restent chez le prestataire sans date de transfert.

Un seul de ces signaux ne condamne pas le projet. Deux ou trois en même temps, c'est le moment de faire un point franc avec votre prestataire.

## Qui écrit ce guide

[The Vibe Company](/fr) est une [agence IA native](/fr/resources/articles/agence-ia-native) fondée à Paris en 2024 par Stan Girard et Antoine Dewez. Avant l'agence, ils ont construit Quivr, un projet open source d'IA passé par Y Combinator (W24). On mène des projets IA jusqu'en production pour des entreprises comme Monka, LocService, Coup de Pates ou l'AFP, avec laquelle on construit des outils d'IA générative pour les rédactions dans le projet France 2030 MediaGen. Si vous cherchez à financer votre projet, notre guide sur [les aides CIR, CII et France 2030](/fr/resources/articles/financer-projet-ia-cir-cii-france-2030) fait le point.

## FAQ

**Comment se déroule un projet avec un prestataire IA ?**
En cinq étapes : un cadrage qui fixe le problème et la mesure de succès, un prototype sur vos vraies données, des itérations courtes testées par vos équipes, la mise en production dans vos systèmes, puis la mesure et la passation.

**Que faut-il préparer avant de contacter un prestataire IA ?**
Le problème en une phrase, le volume et la mesure actuelle, la liste des données et des outils concernés, et la personne qui prendra les décisions métier.

**Faut-il un cahier des charges détaillé ?**
Non. Une page qui décrit le problème, les données et le chiffre à faire bouger suffit pour démarrer. Le périmètre précis se construit pendant le cadrage.

**Qui est propriétaire du code à la fin du projet ?**
C'est à fixer dans le contrat. Demandez que le code, les prompts, les tests et la documentation vous reviennent, et que les comptes chez les fournisseurs soient à votre nom.

**Comment savoir si le projet avance bien ?**
Vous voyez régulièrement une nouvelle version testable, vos utilisateurs la commentent, et la mise en production figure dans le planning depuis le cadrage.

## Parlons de votre projet

Vous avez un sujet en tête, ou un projet IA qui patine avec un autre prestataire ? Venez avec le problème, le volume et ce qui bloque. On vous dit franchement comment on le mènerait, et si un outil existant suffit.

[Réservez 30 minutes avec Stan](https://cal.com/stangirard/thevibecompany).

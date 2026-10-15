---
title: "Déployer Claude Code en entreprise : sécurité, réglages et méthode"
slug: deployer-claude-code-entreprise
translationKey: claude-code-enterprise
language: fr
summary: "Comment déployer Claude Code dans une entreprise de taille moyenne ou grande : réglages managés, permissions, données, pilote et mesure. Le guide concret, sources officielles à l'appui."
publishedAt: 2026-10-13
complexity: intermediate
topics: AI Adoption, AI Agents, Engineering
coverImage: /images/resources/deployer-claude-code-entreprise/cover-mascotte.webp
coverAlt: "Une équipe de développeurs encadre un agent de code avec des règles partagées"
ogImage: /images/resources/deployer-claude-code-entreprise/cover-mascotte.webp
---

Installer Claude Code sur un poste est rapide. Le déployer pour 50 ou 500 développeurs, avec des règles que la sécurité accepte, c'est un autre projet.

Voici ce qu'il faut décider avant de déployer : où vivent les réglages, ce que l'agent a le droit de faire, quelles données il voit, et comment savoir si ça vaut le coup. Tout ce qui concerne le produit vient de la [documentation officielle de Claude Code](https://code.claude.com/docs/en/settings) . Elle bouge vite, relisez-la au moment de déployer.

## Les quatre décisions à prendre avant d'ouvrir les accès

1. **Quel plan et quelle authentification.** Les réglages gérés côté serveur sont réservés aux offres [Claude for Teams et Claude for Enterprise](https://code.claude.com/docs/en/server-managed-settings). Avec des clés API individuelles, vous perdez ce pilotage central.
2. **Qui fixe les règles.** Côté Anthropic, seuls les rôles Owner ou Primary Owner peuvent modifier les réglages managés. Décidez qui les détient chez vous (souvent la plateforme ou la sécurité, pas chaque équipe).
3. **Ce que l'agent peut exécuter sans demander.** C'est la décision la plus sensible. Commandes shell, accès réseau, fichiers interdits.
4. **Comment vous mesurez.** Sans indicateur fixé au départ, le pilote finit sur une impression.

## Réglages managés : serveur ou poste ?

Claude Code lit ses réglages dans plusieurs fichiers, du plus personnel au plus global, et l'organisation peut imposer les siens par-dessus ([doc Settings](https://code.claude.com/docs/en/settings)). Il y a deux façons de les imposer :

| Approche | Pour qui | Fonctionnement |
| --- | --- | --- |
| Réglages gérés côté serveur | Entreprises sans MDM, postes non gérés | Configurés dans la console claude.ai, récupérés au démarrage puis rafraîchis toutes les heures |
| Réglages gérés sur le poste | Entreprises avec MDM ou gestion de parc | Déployés via les politiques de l'OS (préférences gérées macOS, registre Windows) ou des fichiers managés |

Source : [Server-managed settings](https://code.claude.com/docs/en/server-managed-settings). Les postes doivent pouvoir joindre `api.anthropic.com` pour la version serveur.

Notre conseil : si vous avez déjà un MDM, utilisez-le. Les règles suivent alors le même circuit que le reste de votre politique de sécurité.

## Les permissions : allow, ask, deny

Claude Code distingue ce qu'il peut faire seul (`allow`), ce qui demande une confirmation (`ask`) et ce qui est interdit (`deny`) ([doc Permissions](https://code.claude.com/docs/en/permissions)). Une base raisonnable pour démarrer :

| Catégorie | Règle de départ | Pourquoi |
| --- | --- | --- |
| Lecture du code du dépôt | allow | C'est le cœur de l'usage |
| Tests, lint, build | allow | Commandes connues, sans effet externe |
| Écriture de fichiers | ask au début, allow ensuite | Les équipes prennent confiance pendant le pilote |
| Fichiers `.env`, secrets, clés | deny | L'agent n'en a pas besoin pour coder |
| `git push`, déploiement, commandes de prod | deny ou ask | Garder un humain sur tout ce qui sort du poste |
| Réseau vers des domaines inconnus | ask | Limiter les fuites et les dépendances surprises |

Mettez ces règles dans les réglages managés. Un développeur pourra les durcir, pas les assouplir.

## Les données : ce que l'agent voit vraiment

L'agent envoie au modèle le contexte dont il a besoin : morceaux de code, sorties de commandes, fichiers lus. Avant le pilote, posez trois questions à votre DPO et à votre RSSI :

- **Quels dépôts sont concernés ?** Commencez par ceux qui ne contiennent ni données personnelles ni secrets en clair.
- **Quelles conditions de conservation s'appliquent ?** Elles dépendent de votre contrat. Lisez-les dans vos conditions commerciales Anthropic, pas dans un article de blog (y compris celui-ci).
- **Et les données sensibles ?** Pour des données de santé, le cadre HDS s'ajoute. On l'a détaillé dans [notre article sur l'IA et les données de santé](/fr/resources/articles/ia-donnees-de-sante-hds).

## Le pilote : une ou deux équipes

N'ouvrez pas l'accès à tout le monde le même jour. Un pilote qui tient la route :

1. **Choisir une ou deux équipes volontaires**, sur des dépôts représentatifs mais non critiques.
2. **Écrire un fichier `CLAUDE.md` par dépôt** : conventions, commandes de test, pièges connus. Claude Code le lit au démarrage ([doc Memory](https://code.claude.com/docs/en/memory)). Souvent, c'est ce qui sépare un agent utile d'un agent qui improvise.
3. **Fixer deux ou trois indicateurs avant de commencer** : délai entre ticket et PR, part des PR qui passent la revue sans retouche majeure, temps passé sur les tâches répétitives (migrations, tests).
4. **Faire un point chaque semaine** sur ce qui a bloqué : permissions trop strictes, contexte manquant, tâches mal choisies.
5. **Décider à la fin** : élargir, ajuster, ou arrêter.

## Claude Code, Codex ou les deux ?

Beaucoup d'entreprises testent aussi [Codex d'OpenAI](https://developers.openai.com/codex), qui a ses propres modes de sandbox et d'approbation. Le choix dépend surtout de vos contrats en cours et de votre politique de données. La méthode reste la même : réglages centralisés, permissions explicites, pilote mesuré. Si vos équipes utilisent plusieurs agents, gardez des règles équivalentes partout. Sinon, les usages filent vers l'outil le moins encadré.

## Ce qu'on fait chez The Vibe Company

The Vibe Company est une agence IA à Paris, fondée en 2024 par Stan Girard et Antoine Dewez (ex-Theodo, ex-Stockly), passée par Y Combinator (W24). On a mené des dizaines de projets, avec trois spécialités : HDS et sécurité, frontend, DevOps.

On utilise ces agents de code tous les jours pour livrer. Sur un déploiement, on s'occupe de la configuration des réglages managés et des permissions, l'écriture des `CLAUDE.md` avec vos équipes, et la formation pendant le pilote. Précision utile pour vos achats : on ne revendique aucune certification de sécurité.

## FAQ

**Faut-il un plan Enterprise pour déployer Claude Code ?**
Pas pour l'utiliser, mais les réglages gérés côté serveur demandent Claude for Teams ou Enterprise. Sans eux, il faut passer par votre MDM ou par des fichiers managés.

**Un développeur peut-il contourner les règles ?**
Les réglages managés ont la priorité sur les réglages utilisateur et projet, d'après la [documentation](https://code.claude.com/docs/en/settings). Ça ne remplace pas les contrôles habituels : droits sur les dépôts, protection des branches, revue de code.

**Combien de temps pour un déploiement ?**
Il faut configurer, puis mener un pilote avant d'élargir. La durée dépend surtout de vos circuits de validation sécurité.

## Parlons de votre déploiement

Vous voulez cadrer un pilote Claude Code ou Codex pour vos équipes ? [Réservez 30 minutes avec Stan](https://cal.com/stangirard/thevibecompany).

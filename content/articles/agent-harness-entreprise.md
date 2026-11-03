---
title: "Agent harness en entreprise : loops, sandbox, skills"
seoTitle: "Agent harness en entreprise : loops, sandbox, skills"
slug: agent-harness-entreprise
translationKey: enterprise-agent-harness
language: fr
summary: "Agent harness en entreprise : la boucle, le sandbox, les skills, les evals et la revue par risque à mettre autour du modèle avant la production."
publishedAt: 2026-10-29
complexity: intermediate
topics: AI Agents, AI Infrastructure, Security
coverImage: /images/resources/agent-harness-entreprise/cover-mascotte.webp
coverAlt: "La mascotte serre une clé sur le socle d’un dôme de verre qui protège un cristal lumineux, entouré d’une boucle sur rails, d’un rack d’outils, de jauges validées et d’un feu tricolore"
ogImage: /images/resources/agent-harness-entreprise/cover-mascotte.webp
---

Un agent harness, c'est tout ce qui entoure le modèle : la boucle qui l'appelle, les outils et les skills qu'il peut utiliser, le sandbox où il exécute du code, le contexte qu'on lui donne et les contrôles qui décident si son travail est accepté. En entreprise, c'est là que se jouent la fiabilité et la sécurité d'un agent IA. Changer de modèle prend une ligne de config. Construire le harness autour prend des semaines, et c'est lui qui tient, ou pas, en production.

On écrit ici pour les CTO et responsables techniques qui veulent passer d'agents en démo à des agents qui tournent sur de vrais systèmes. Au programme : les six briques d'un harness, pourquoi commencer avec un seul agent, et ce que la recherche publiée par Anthropic le 27 octobre 2026 sur les chaînes d'exploits Chrome change pour votre sandbox et votre cycle de patch.

## Agent harness : définition simple

LangChain résume l'idée en une formule dans [The Anatomy of an Agent Harness](https://www.langchain.com/blog/the-anatomy-of-an-agent-harness) : « Agent = Model + Harness. If you're not the model, you're the harness. » Le modèle lit du texte et produit du texte. Il ne garde pas d'état d'une session à l'autre, n'exécute pas de code et n'accède pas à vos systèmes. Tout ça, c'est le harness qui l'apporte.

Concrètement, un harness contient :

- une boucle qui appelle le modèle, exécute ses demandes d'outils, lui renvoie les résultats et décide quand s'arrêter ;
- des outils (API internes, serveurs MCP, bash) et des skills, c'est-à-dire des procédures métier que l'agent charge quand il en a besoin ;
- un environnement d'exécution isolé : fichiers, réseau, secrets, durée de vie des processus ;
- une gestion du contexte : ce qui entre dans la fenêtre du modèle, ce qui en sort, ce qui est mémorisé ;
- des contrôles : budgets, tests, validations humaines, traces.

Le même modèle peut donner des résultats très différents selon le harness. LangChain explique avoir fait passer son agent de code du top 30 au top 5 du benchmark Terminal Bench 2.0 en ne changeant que le harness.

## Pourquoi le harness compte plus que le choix du modèle

Les débats en entreprise portent souvent sur le modèle : Claude, GPT, Gemini, open source. Ça compte, mais ça se change. Les problèmes qui bloquent une mise en production viennent presque toujours d'ailleurs :

- l'agent boucle sans fin sur une tâche et brûle le budget ;
- il a accès à un outil d'écriture en production alors qu'il devait seulement lire ;
- personne ne sait dire si la nouvelle version fait mieux ou moins bien que l'ancienne ;
- une page web ou un document piégé lui fait exécuter une commande ;
- un diff sensible part en merge sans relecture.

Changer de modèle n'en règle aucun. Tout se règle dans le harness. C'est aussi pour ça qu'on parle de software factory : une base commune d'outils, d'agents, de skills et de règles que toutes les équipes partagent. Chez [Theodo](/fr/case-studies/theodo), on construit ce type de base pour des centaines de développeurs, et la plus grosse partie du travail porte sur ce qui entoure le modèle.

## Les six briques à mettre autour du modèle

| Brique | Ce qu'elle fait | Question à poser à votre équipe |
|---|---|---|
| Boucle | Appelle le modèle, exécute les outils, s'arrête | Quel budget de tours et de coût par tâche ? |
| Outils et skills | Donnent des mains et des méthodes à l'agent | Combien d'outils, groupés comment, avec quels droits ? |
| Sandbox | Isole le code, les fichiers, le réseau, les secrets | Que peut casser l'agent s'il est piégé ? |
| Contexte et mémoire | Choisit ce que voit le modèle | Qu'est-ce qui est chargé par défaut, et pourquoi ? |
| Evals | Mesurent si une version fait mieux | Avez-vous 10 tâches de référence rejouables ? |
| Revue par risque | Décide qui valide quoi | Quelles actions exigent un humain ? |

### 1. La boucle : budgets et conditions d'arrêt

La boucle de base est simple : le modèle propose des appels d'outils, le harness les exécute, renvoie les résultats, et recommence. Le vrai sujet, ce sont les limites. Dans son guide [When to fold subagents into your main agent loop](https://claude.com/resources/articles/building-agents-when-to-fold-subagents-into-your-main-agent-loop), Anthropic décrit une boucle qui s'arrête quand le modèle répond ou quand il atteint un budget, avec des budgets de tours et de coût et des « write gates » fixés dans le harness, pas dans le prompt.

À mettre en place :

- un plafond de tours et de coût par tâche, avec un arrêt propre qui explique où l'agent en était ;
- un état de tâche hors de la conversation (en cours, bloquée, en attente de validation, terminée) pour pouvoir reprendre ;
- une vérification après la réponse quand c'est possible : tests, contrôle de schéma, comparaison avec la donnée réelle.

### 2. Outils et skills : peu, groupés, avec les droits dedans

Anthropic constate qu'au-delà de 30 à 50 définitions d'outils dans le prompt système, le modèle choisit moins bien. Sa recommandation : grouper les outils par intention utilisateur plutôt qu'un outil par endpoint d'API, et charger les descriptions détaillées seulement quand l'agent en a besoin.

Les skills jouent le même rôle pour les méthodes. Un skill décrit comment votre équipe fait un travail : les étapes, les règles, les cas limites. L'agent voit une courte description et ne charge le reste qu'au moment utile. On a expliqué comment les skills structurent un usage de l'IA dans [ce qui fait la différence, ce ne sont pas les prompts](/fr/resources/articles/les-skills). Pour connecter l'agent à vos systèmes, voir aussi [serveur MCP en entreprise](/fr/resources/articles/serveur-mcp-entreprise).

Ce qu'on oublie souvent : les permissions vivent dans l'outil. Anthropic recommande que chaque outil vérifie ce que l'utilisateur appelant a le droit de voir ou de faire, et renvoie un refus lisible. Un seul agent peut alors servir des utilisateurs aux droits différents, sans un agent par niveau d'accès.

### 3. Sandbox et isolation : partir du principe que l'agent sera piégé

Dès qu'un agent exécute du code, lit des pages web ou manipule des fichiers, partez du principe qu'un contenu malveillant finira par lui arriver. Le sandbox limite les dégâts :

- environnement éphémère par tâche, détruit à la fin ;
- liste blanche de commandes et sortie réseau limitée aux domaines nécessaires ;
- aucun secret de production monté par défaut, des identifiants à durée courte quand il en faut ;
- système de fichiers restreint au dépôt ou au dossier de travail ;
- navigateur et dépendances à jour dans l'image du sandbox.

On a détaillé les attaques qui visent les agents eux-mêmes (secrets volés, dépendances piégées) dans [Black October](/fr/resources/articles/black-october-securite-agents-ia).

### 4. Contexte et mémoire : charger moins, mieux

Plus la fenêtre de contexte se remplit, plus le modèle se disperse. Le harness décide ce qui est chargé au démarrage (un fichier d'instructions court, par exemple) et ce qui est récupéré à la demande (documentation, historique, base de connaissances). Anthropic indique avoir réduit le prompt système de Claude Code de plus de 80 % pour ses modèles récents, en partie grâce à ce chargement progressif des skills et des outils.

### 5. Evals : 10 tâches de référence avant tout changement

Sans eval, chaque modif du prompt, des outils ou du modèle, c'est un pari. Anthropic recommande un jeu de tests de bout en bout tenu par une petite équipe centrale, et note que 10 exemples de référence suffisent pour démarrer. Deux conseils pratiques du même guide :

- regarder quelles tâches ont basculé, pas seulement le score global ;
- lancer chaque tâche plusieurs fois, car certaines régressions n'apparaissent que sur une exécution sur deux.

### 6. Revue par niveau de risque

Tout ne mérite pas la même relecture. Une règle simple : classer chaque action de l'agent par réversibilité.

- Lire et résumer : pas de validation.
- Proposer un diff, un ticket, un brouillon : relecture légère ou automatique.
- Préparer une action sensible (droits, migration, rotation de secret) : validation humaine obligatoire.
- Exécuter en production quelque chose d'irréversible : humain, toujours.

On décrit ces niveaux (lire, proposer, préparer, exécuter) dans [le vrai risque des agents IA, c'est l'autorité](/fr/resources/articles/agents-ia-formation-autorite), et leur application à la CI dans [agents IA pour durcir un SaaS](/fr/resources/articles/agents-ia-durcir-saas).

## Un seul agent avant l'essaim

On a vite envie de construire un orchestrateur et une dizaine de sous-agents spécialisés, un par équipe. Anthropic met en garde contre ce schéma, qu'il compare à la loi de Conway : l'architecture finit par copier l'organigramme. Dans son article sur les [systèmes multi-agents](https://claude.com/blog/building-multi-agent-systems-when-and-how-to-use-them), l'éditeur indique que ces systèmes consomment en général 3 à 10 fois plus de tokens qu'un agent unique pour une tâche équivalente. Dans son guide plus récent, il cite un client dont la boucle unique tournait environ deux fois plus vite que l'architecture multi-agents qu'elle remplaçait.

Anthropic garde les sous-agents pour trois cas :

- la boucle unique se dégrade de façon mesurable à cause d'un contexte trop chargé ;
- plusieurs tâches indépendantes doivent tourner en parallèle ;
- l'agent choisit mal ses outils ou reçoit des consignes contradictoires.

Hors de ces cas, la méthode proposée (et publiée sous forme de [kit open source](https://github.com/anthropics/single-agent-loop-kit)) est de mesurer d'abord, de fusionner les sous-agents qui travaillent toujours ensemble, puis de transformer les autres en skills et en outils, un par un, en gardant seulement ceux qui font mieux sur l'eval.

## Ce que la recherche Frontier Red Team d'Anthropic change pour votre harness

Le 27 octobre 2026, l'équipe Frontier Red Team d'Anthropic a publié [Discovering and exploiting vulnerabilities in critical, real-world software with Claude](https://www.anthropic.com/research/discovering-vulnerabilities-with-claude). Avec un modèle de recherche interne non publié, elle a trouvé des vulnérabilités critiques et construit cinq chaînes d'attaque fonctionnelles :

- Chrome : exécution de code en un clic, avec sortie du sandbox du navigateur, en enchaînant quatre failles (moteur V8, sandbox mémoire de V8, CacheStorage, FedCM) ;
- Safari : contournement de la same-origin policy, sans exécution de code arbitraire ;
- Android : extraction de photos depuis un Pixel 9 verrouillé, via USB ;
- Windows : déni de service à distance dans l'implémentation QUIC du noyau (CVE-2026-33096), trouvé par analyse du binaire avec Ghidra ;
- Linux : exécution de commandes en root à distance, sans clic, via multipath TCP (CVE-2026-98432).

Côté Chrome, Anthropic indique que 62 CVE ont été attribuées et corrigées à la version 156, toutes de sévérité critique ou haute. Les [notes de version Chrome du 27 octobre](https://chromereleases.googleblog.com/) (156.0.8078.73/.74) créditent plusieurs correctifs à « Xinyang Ge (Anthropic), assisted by Claude », dont deux critiques. Attention aux chiffres qui circulent : cette mise à jour compte 52 correctifs de sécurité, tous rapporteurs confondus. Le décompte d'Anthropic couvre un autre périmètre.

Quatre leçons pour un harness d'entreprise :

**Un sandbox seul ne suffit pas.** La chaîne Chrome a franchi deux sandboxes successifs. Si le navigateur le plus audité du marché se fait traverser par une chaîne de quatre failles, le conteneur de votre agent ne doit pas être votre seule barrière. Empilez les couches : sandbox, réseau limité, absence de secrets, droits minimaux dans les outils.

**Mettez à jour ce que vos agents utilisent.** Beaucoup d'agents pilotent un Chromium headless pour naviguer ou tester. L'image de leur sandbox doit suivre les versions stables, comme les postes de travail. Ici : 156.0.8078.73 ou plus récent.

**Les résultats viennent d'un harness, pas d'un prompt.** Anthropic décrit une plateforme d'agents de scan lancés en parallèle, chacun évalué sur le nombre de vulnérabilités nouvelles qu'il apporte, avec un suivi de couverture, une analyse automatique des variantes et un pipeline standard de vérification et de notation du risque. On retrouve les briques ci-dessus : boucle, outils, evals, revue.

**Scannez au moment de la PR.** Corriger le stock ne règle que la moitié du problème, écrit Anthropic : l'autre moitié, c'est réduire le rythme d'entrée de nouvelles failles. L'équipe recommande de scanner chaque pull request et a publié un plugin Claude Code pour ça. Sa conclusion : scanner son propre code compte plus que jamais. Trouver et enchaîner plusieurs failles était réservé à quelques équipes spécialisées ; selon Anthropic, les modèles de pointe le font désormais avec peu d'intervention humaine.

## Checklist : votre agent est-il prêt pour la production ?

1. La boucle a un budget de tours et de coût, et un état de tâche reprenable.
2. Moins de 30 outils exposés, groupés par intention, avec les permissions vérifiées dans chaque outil.
3. Les procédures métier sont des skills versionnés, avec un propriétaire par équipe.
4. Le code tourne dans un environnement éphémère, réseau filtré, sans secret de production.
5. Les images de sandbox (navigateur, dépendances) sont patchées comme le reste du parc.
6. Un jeu de 10 tâches de référence tourne avant chaque changement de prompt, d'outil ou de modèle.
7. Chaque action est classée par niveau de risque, avec validation humaine pour l'irréversible.
8. Les traces (appels de modèle, outils, validations) sont conservées et consultables.
9. Un seul agent d'abord ; un sous-agent seulement quand l'eval montre qu'il fait mieux.
10. Les pull requests passent par un scan de sécurité automatique.

Pour passer d'un prototype à ce niveau, voir aussi [du POC à la production pour un agent IA](/fr/resources/articles/poc-agent-ia-production) et notre guide des [agents IA en entreprise](/fr/resources/articles/agent-ia-entreprise).

## FAQ

### Qu'est-ce qu'un agent harness ?

C'est l'ensemble du code et de la configuration autour d'un modèle de langage qui en fait un agent : la boucle d'exécution, les outils et skills, le sandbox, la gestion du contexte et les contrôles (budgets, tests, validations). Le modèle propose, le harness exécute et encadre.

### Quelle différence entre un agent harness et un framework d'agents ?

Un framework fournit des briques de code pour construire un agent. Le harness est le système complet qui tourne en production avec vos outils, vos droits, votre sandbox et vos règles de validation. On peut construire un harness avec un framework, ou utiliser celui d'un produit comme Claude Code ou Codex.

### Faut-il plusieurs agents spécialisés en entreprise ?

Pas au départ. Anthropic recommande de commencer avec un seul agent qui charge des skills et des outils à la demande, et de garder un sous-agent seulement si le contexte sature, si des tâches doivent tourner en parallèle ou si l'agent choisit mal ses outils, et si une eval le confirme.

### Un sandbox suffit-il à sécuriser un agent IA ?

Non. La recherche Frontier Red Team publiée par Anthropic le 27 octobre 2026 montre une chaîne d'exploits qui sort du sandbox de Chrome. Il faut empiler les protections : environnement éphémère, réseau filtré, pas de secrets de production, permissions dans les outils, validation humaine pour les actions irréversibles.

### Par où commencer pour construire un harness ?

Par l'eval et les limites : 10 tâches de référence rejouables, un budget par tâche, une liste courte d'outils avec leurs droits, et une règle claire sur ce qui demande un humain. Le choix du modèle vient ensuite, et peut changer sans tout reconstruire.

## Construire le harness de vos agents

The Vibe Company est une agence IA à Paris. On construit des agents, des produits IA et des software factories qui tournent en production, avec les boucles, les skills, le sandbox et les règles de revue qui vont avec. Vous voulez auditer le harness de vos agents ou en poser un premier ? Parlons-en.

[Réserver un échange sur vos agents →](https://cal.com/stangirard/thevibecompany)

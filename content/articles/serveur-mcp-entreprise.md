---
title: "Serveur MCP en entreprise : sécurité, principes et exigences"
seoTitle: "Serveur MCP en entreprise : sécurité et exigences"
slug: serveur-mcp-entreprise
translationKey: mcp-server-business-guide
language: fr
summary: "Serveur MCP en entreprise : principes et exigences de la spec 2026-07-28, quatre incidents de 2025, 300 serveurs sondés le 11 novembre 2026, et une checklist."
publishedAt: 2026-10-21
dateModified: 2026-11-11
complexity: intermediate
topics: AI Agents, AI Operations, Security
coverImage: /images/resources/serveur-mcp-entreprise/cover-mascotte.webp
coverAlt: "La mascotte branche une prise universelle sur un tableau qui relie un agent IA aux outils de l'entreprise, chaque câble muni d'un cadenas"
ogImage: /images/resources/serveur-mcp-entreprise/cover-mascotte.webp
---

Le 11 novembre 2026, 179 des 276 serveurs distants joignables d'un échantillon du registre MCP officiel ont accepté une connexion sans jeton. Ce n'est pas une faille : la spec 2026-07-28 laisse l'autorisation optionnelle. Mais le registre ne vous dit pas quels serveurs exigent un jeton, et c'est à vous de le vérifier.

Ce décryptage suit l'ordre d'un DSI ou d'un RSSI à qui une équipe demande de brancher un agent. D'abord les principes et les exigences de la spec, puis ce qui a déjà cassé en 2025, puis le détail de la mesure sur 300 serveurs du registre. La checklist vient en dernier.

## MCP en quatre lignes : hôte, client et serveur

[Anthropic a publié MCP en open source le 25 novembre 2024](https://www.anthropic.com/news/model-context-protocol), comme standard pour relier les assistants IA aux systèmes où vivent les données. Un serveur MCP en entreprise expose un outil, comme un CRM ou une base de données, à des agents IA par ce protocole standard. Le 9 décembre 2025, la [Linux Foundation](https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation) a créé l'Agentic AI Foundation (AAIF), qui a reçu MCP. MCP comptait alors plus de 10 000 serveurs publiés, selon la Linux Foundation. Claude, Cursor, Microsoft Copilot, Gemini, VS Code et ChatGPT l'ont adopté.

La [documentation officielle](https://modelcontextprotocol.io/docs/learn/architecture) décrit trois rôles. L'hôte est l'application IA, qui gère un ou plusieurs clients. Chaque client tient une connexion dédiée à un serveur, et le serveur expose des outils pour agir, des ressources à lire et des prompts réutilisables. Un serveur local en STDIO sert en général un seul client, et un serveur distant en Streamable HTTP en sert plusieurs. À distance, MCP recommande OAuth.

## Spec MCP 2026-07-28 : principes, exigences et recommandations

![Les 4 contrôles d'un serveur MCP, de l'utilisateur à l'API : principe, exigences, recommandation. Détaillé ci-dessous.](/images/resources/serveur-mcp-entreprise/4-points-controle-serveur-mcp.png){.diagram}

La [spec](https://modelcontextprotocol.io/specification/2026-07-28) distingue des principes, qu'elle dit ne pas pouvoir imposer au niveau du protocole (« While MCP itself cannot enforce these security principles at the protocol level »), et des mots-clés en majuscules : MUST pour une exigence, SHOULD pour une recommandation. Ces mots-clés n'ont leur sens normatif que « when, and only when, they appear in all capitals » : un « must » en minuscules n'oblige à rien.

### Deux principes : le consentement et les outils

**Le consentement.** Parmi ses « Key Principles », la spec veut que les hôtes obtiennent le consentement explicite de l'utilisateur avant d'exposer ses données à un serveur et avant d'appeler un outil : « Hosts must obtain explicit user consent before invoking any tool ». Ce « must » reste un principe. Votre contrat peut en faire une exigence : l'outil IA retenu montre chaque appel d'outil et attend un accord.

**Les outils.** Dans les mêmes principes, la spec écrit « Tools represent arbitrary code execution » et demande de traiter les descriptions d'outils comme non fiables, sauf serveur de confiance. Brancher un serveur revient à faire tourner du code chez vous.

### Les exigences de la spec, en majuscules

**L'autorisation.** Elle reste optionnelle : « Authorization is OPTIONAL for MCP implementations ». Quand un serveur la prend en charge, il doit (MUST) implémenter OAuth 2.0 Protected Resource Metadata (RFC 9728). Un serveur sans autorisation reste conforme. Demandez donc, à chaque achat, si le serveur exige un jeton.

**Le jeton.** Un serveur doit (MUST) « validate that tokens presented to them were specifically issued for their use », et les clients doivent utiliser PKCE S256 quand c'est possible. Il ne doit pas (MUST NOT) relayer le jeton reçu du client : « The MCP server MUST NOT pass through the token it received from the MCP client ». Les [bonnes pratiques officielles](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices) appellent ce relais le « Token passthrough » : accepter un jeton destiné à un autre service et le transmettre à l'API en aval.

**L'elicitation.** Un serveur ne doit pas (MUST NOT) utiliser le mode formulaire pour demander une information sensible. Le mode URL envoie l'utilisateur vers une page externe, pour que ces échanges « must not pass through the MCP client ».

### Les recommandations et les bonnes pratiques

**Les scopes.** La spec recommande (SHOULD) le moindre privilège : « MCP clients SHOULD follow the principle of least privilege by requesting only the scopes necessary for their intended operations ». Un serveur qui prend en charge l'autorisation devrait aussi (SHOULD) « include a `scope` parameter in the `WWW-Authenticate` header » de sa réponse 401. Demandez des scopes minimaux au départ.

**Les bonnes pratiques sur les scopes.** Les exemples files:*, db:* et admin:* viennent des bonnes pratiques citées plus haut. Ce document, publié dans la documentation et non dans la spécification, se présente comme complétant la spécification d'autorisation (« complementing the MCP Authorization specification »). Il prévient que « Poor scope design increases token compromise impact ». Des scopes larges accordés d'emblée aggravent l'impact d'un jeton volé.

**Les serveurs locaux.** Les mêmes bonnes pratiques notent que « Local MCP servers are binaries that are downloaded and executed » sur le poste. Sans bac à sable ni consentement, ils exposent ce poste à des attaques.

## La version 2026-07-28 change l'enregistrement des clients MCP

La version 2026-07-28 déprécie l'enregistrement dynamique de clients (DCR) au profit des Client ID Metadata Documents (CIMD), selon le [blog officiel du protocole](https://blog.modelcontextprotocol.io/posts/2026-07-28/) : « Dynamic Client Registration itself is now formally deprecated in favor of CIMD ». DCR fonctionne encore, mais disparaîtra. Les clients doivent aussi valider le paramètre iss (RFC 9207) avant d'échanger un code : « This closes an authorization-server mix-up hole ». Demandez donc à votre fournisseur quelle version de la spec son serveur suit.

## Les incidents MCP de 2025 montrent quatre risques

Quatre incidents de 2025 montrent chacun un risque : un contenu malveillant, un client vulnérable, un paquet piégé et une fuite entre organisations.

| Incident | Date | Ce qui a cassé | Règle de la spec qui l'aurait limité (lecture) |
| --- | --- | --- | --- |
| [Serveur MCP officiel de GitHub](https://invariantlabs.ai/blog/mcp-github-vulnerability), selon Invariant Labs | 26 mai 2025 | Une issue malveillante détourne l'agent de l'utilisateur et lui fait divulguer des données de dépôts privés | Descriptions et contenus non fiables, consentement avant chaque appel d'outil |
| [mcp-remote](https://jfrog.com/blog/2025-6514-critical-mcp-remote-rce-vulnerability/), CVE-2025-6514, CVSS 9,6 | 2025 | Injection de commande système à la connexion à un serveur MCP non fiable, versions 0.0.5 à 0.1.15, corrigée en 0.1.16 | Serveurs non fiables traités comme du code arbitraire |
| [postmark-mcp](https://www.bleepingcomputer.com/news/security/unofficial-postmark-mcp-npm-silently-stole-users-emails/), selon BleepingComputer | Septembre 2025 | Paquet npm non officiel, sain jusqu'en 1.0.15 ; la 1.0.16 mettait tous les e-mails en copie cachée vers une adresse externe | Serveur local exécuté comme un binaire sur le poste |
| [Asana](https://www.bleepingcomputer.com/news/security/asana-warns-mcp-ai-feature-exposed-customer-data-to-other-orgs/), selon BleepingComputer | Du 1er mai au 4 juin 2025 | Une faille logique exposait des données d'une organisation à d'autres | Jeton émis pour le serveur, scopes minimaux |

La dernière colonne est une lecture : elle rapproche chaque incident d'une règle de la spec, sans affirmer que la règle l'aurait évité. Pour postmark-mcp, les faits viennent de Koi Security, cité par BleepingComputer, avec environ 1 500 téléchargements en une semaine. Pour Asana, BleepingComputer cite un porte-parole d'Asana, selon qui l'incident touche environ 1 000 clients. Asana a mis le serveur hors ligne. Pour mcp-remote, la [NVD](https://nvd.nist.gov/vuln/detail/CVE-2025-6514) situe l'injection dans l'URL authorization_endpoint.

## Le registre MCP officiel ne garantit pas l'autorisation

Le 11 novembre 2026, sur 300 serveurs distants du registre MCP officiel tirés au hasard, 179 des 276 joignables, soit 65 %, ont accepté une requête initialize sans jeton, et 95, soit 34 %, ont répondu 401. Sur ces 95 réponses 401, 79 (83 %) indiquaient leurs métadonnées OAuth (RFC 9728) dans l'en-tête WWW-Authenticate. Au moins 32 (34 %) annonçaient un scope.

Le registre comptait ce jour-là 61 974 entrées en version latest, dont 61 002 actives. La sonde a envoyé une seule requête initialize, sans jeton, à 300 endpoints streamable-http tirés parmi 40 211, sans lister ni appeler aucun outil. Les limites tiennent en peu de mots : une seule passe, une marge d'environ ±6 points, un en-tête tronqué à 300 caractères. Un serveur peut accepter la connexion et demander l'authentification plus tard, au niveau de l'outil. Aucun serveur n'est nommé.

Ce résultat ne révèle pas une faille, puisque l'autorisation est optionnelle dans MCP. Il montre ce que le registre ne dit pas : si un serveur exige un jeton, et quels scopes il demande. Ce test est à faire de votre côté.

Le [registre officiel](https://modelcontextprotocol.io/registry/about) est d'ailleurs en preview, avec des changements cassants ou des remises à zéro possibles avant la disponibilité générale. Il délègue l'analyse de sécurité aux registres de paquets, comme npm, PyPI et Docker Hub, et aux agrégateurs en aval. Il peut retirer à la main les serveurs de spam ou malveillants.

## Installer un serveur MCP existant ou en construire un

| Situation | Choix raisonnable |
| --- | --- |
| L'éditeur de l'outil publie un serveur officiel | Partir de celui-là, après revue des droits demandés |
| Seul un serveur communautaire existe | Le lire avant de l'installer, ou le réécrire |
| Outil interne, base métier, process maison | Construire un serveur dédié, limité aux actions utiles |
| Toute une équipe, données sensibles | Un serveur distant, avec authentification et journalisation |

Un bon serveur dédié expose peu d'actions, bien nommées, liées à des tâches réelles.

## Checklist avant de brancher un agent sur un serveur MCP

1. **Le niveau d'autorité.** Pour chaque outil exposé, décidez si l'agent peut lire, proposer, préparer ou exécuter. Commencez en lecture seule. La grille complète se trouve dans [le vrai risque des agents IA, l'autorité](/fr/resources/articles/agents-ia-formation-autorite).
2. **L'authentification.** Un serveur distant doit savoir qui l'appelle. S'il prend en charge l'autorisation, la spec lui impose RFC 9728.
3. **Aucun jeton relayé.** La spec l'interdit (MUST NOT). Refusez un serveur qui transmet à l'API en aval un jeton destiné à un autre service.
4. **Les droits de l'utilisateur, sans plus.** L'agent qui agit pour une personne ne voit que ce qu'elle voit. Des scopes minimaux restent une recommandation de la spec (SHOULD). Exigez-les au contrat.
5. **Une validation humaine sur les actions sensibles, écrite au contrat.** La spec en fait un principe sans pouvoir l'imposer : exigez au contrat un accord explicite avant chaque appel d'outil sensible. Le mode formulaire, lui, ne sert jamais à demander une information sensible (MUST NOT).
6. **Le journal.** Chaque appel d'outil laisse une trace : qui, quoi, quand, avec quel résultat.

Pour démarrer, trois étapes suffisent :

1. Choisissez un seul cas d'usage, avec un outil et une tâche répétitive.
2. Branchez un serveur en lecture seule pour une petite équipe, et regardez ce que l'agent demande vraiment.
3. Ouvrez l'écriture action par action, avec une validation humaine au début.

Pour aller plus loin : le [guide de l'agent IA en entreprise](/fr/resources/articles/agent-ia-entreprise), la [checklist du POC à la production](/fr/resources/articles/poc-agent-ia-production) et [RAG en entreprise](/fr/resources/articles/rag-entreprise). En anglais : [la mémoire d'entreprise des agents](/en/resources/articles/agents-dont-lack-tools-they-lack-company-memory) et [ce qu'un bon serveur MCP encode](/en/resources/articles/mcp-servers-dont-just-expose-tools-they-encode-how-work-gets-done).

## FAQ

**Être listé dans le registre MCP officiel garantit-il la sécurité d'un serveur ?**
Non. Le registre délègue l'analyse de sécurité aux registres de paquets et aux agrégateurs en aval, et peut seulement retirer à la main les serveurs de spam ou malveillants. Il est aussi en preview. Il ne dit pas non plus si un serveur exige un jeton : testez ce point vous-même avant de brancher un agent.

**Quelle différence entre un LLM et un serveur MCP ?**
La spec appelle l'hôte une « application LLM » : c'est l'application IA, comme Claude ou ChatGPT, qui utilise le modèle. Le serveur MCP n'est pas un modèle. C'est le programme qui expose des outils, des ressources et des prompts à cet hôte, via un client dédié. MCP ne fixe que l'échange de contexte, pas la façon dont l'application utilise le LLM.

**Un serveur MCP doit-il exiger une authentification ?**
La spec rend l'autorisation optionnelle. Quand un serveur la prend en charge, il doit implémenter RFC 9728, vérifier que chaque jeton a ce serveur pour destinataire et ne jamais relayer un jeton vers l'API en aval. Les scopes minimaux sont une recommandation (SHOULD). Pour un serveur distant qui touche vos données, MCP recommande OAuth : exigez-le dans le cahier des charges.

## Brancher vos agents sur un serveur MCP

Vous voulez brancher vos agents sur vos outils internes, ou faire relire un serveur MCP avant de l'installer. Venez avec la liste des outils et des droits demandés.

[Réserver un échange](https://cal.com/stangirard/thevibecompany)

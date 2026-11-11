---
title: "Agents IA et sécurité : durcir un SaaS au-delà de la CI"
seoTitle: "Agents IA sécurité : durcir un SaaS | The Vibe Company"
slug: agents-ia-durcir-saas
translationKey: ai-agents-harden-saas
language: fr
summary: "Agents IA sécurité : ce que Codex Security, CodeMender, GitHub et la DARPA ont publié, et les zones d'un SaaS que la CI ne voit pas, comme les jetons OAuth."
publishedAt: 2026-10-26
dateModified: 2026-11-11
complexity: intermediate
topics: AI Agents, Security, AI Operations
coverImage: /images/resources/agents-ia-durcir-saas/cover-mascotte.webp
coverAlt: "Mascotte The Vibe Company inspectant à la loupe des caisses de code sur un convoyeur de CI, entre portiques de contrôle et coffre de clés"
ogImage: /images/resources/agents-ia-durcir-saas/cover-mascotte.webp
---

Pour durcir un SaaS avec des agents IA de sécurité, partez de ce que leurs éditeurs ont publié : des failles trouvées et corrigées en volume, sur des périmètres précis, et parfois des limites écrites noir sur blanc. Le second gain est hors CI. En août 2025, des jetons OAuth compromis de l'intégration Salesloft Drift ont servi à exporter des données de nombreuses instances Salesforce, loin de tout dépôt Git.

Cet article parle des agents qui sécurisent votre produit. Sécuriser l'agent lui-même, ses clés, ses droits et ce qu'il exécute, fait l'objet de [Black October : failles PHP, secrets volés, ce que ça change pour vos agents IA](/fr/resources/articles/black-october-securite-agents-ia). Le pipeline à chaque pull request, les règles écrites en skills versionnés et les chiffres GitGuardian d'ouverture sont dans [l'agent de sécurité en CI](/fr/resources/articles/agent-securite-ci).

## Les agents IA de sécurité publics, chiffres et périmètres

Quatre outils et un concours documentent ce qu'ils font et où ils s'arrêtent. Les chiffres viennent des éditeurs ou d'un concours, sur des périmètres différents. Ils ne sont pas comparables entre eux, et personne ne les a testés pour cet article.

| Outil (éditeur, date) | Ce qu'il fait | Chiffre publié | Périmètre et limite publiés | Statut à la date citée |
| --- | --- | --- | --- | --- |
| [Codex Security](https://openai.com/index/codex-security-now-in-research-preview/) (OpenAI, 6 mars 2026) | Scanne les commits et remonte des résultats classés par gravité | Plus de 1,2 million de commits scannés en 30 jours de bêta, 792 résultats critiques et 10 561 « high », critiques dans moins de 0,1 % des commits ; ex-[Aardvark](https://openai.com/index/introducing-aardvark/), 30 octobre 2025 : 92 % des vulnérabilités connues et synthétiques identifiées sur des dépôts de test « golden », 10 vulnérabilités open source avec un CVE | Aucune limite écrite dans l'annonce ; périmètre : cohorte bêta, dépôts externes | Research preview pour ChatGPT Pro, Enterprise, Business et Edu, via Codex web, usage gratuit le premier mois |
| [CodeMender](https://deepmind.google/blog/introducing-codemender-an-ai-agent-for-code-security/) (Google DeepMind, 6 octobre 2025) | Corrige des failles dans des projets open source | 72 correctifs de sécurité intégrés en amont en six mois, dans des projets jusqu'à 4,5 millions de lignes | Chercheurs humains sur chaque correctif ; selon la [page Google Cloud](https://cloud.google.com/security/codemender), commit seulement après validation manuelle | Page Google Cloud lue le 11 novembre 2026 |
| [Autofix agentique de GitHub](https://docs.github.com/en/code-security/concepts/code-scanning/autofix-for-code-scanning) (docs lues le 11 novembre 2026) | Explore le code, génère un correctif, le valide en relançant CodeQL, ouvre une PR brouillon | Aucun chiffre dans la page lue | « best-effort » ; aucune confirmation pour les requêtes CodeQL personnalisées, la suite security-extended ou les alertes tierces | Alertes assignées à Copilot |
| [Claude Code security review](https://github.com/anthropics/claude-code-security-review) (Anthropic, README GitHub) | Relit les pull requests sous l'angle sécurité | Aucun chiffre dans le README | « not hardened against prompt injection attacks and should only be used to review trusted PRs » | README public sur GitHub |
| [Systèmes AIxCC](https://www.darpa.mil/news/2025/aixcc-results) (DARPA, finale du 8 août 2025) | Trouvent et corrigent des failles en concours | 86 % des vulnérabilités synthétiques identifiées, 68 % d'entre elles corrigées (54 trouvées, 43 corrigées), 18 vulnérabilités réelles, environ 152 $ par tâche, 45 min par correctif en moyenne | Aucune limite écrite dans l'annonce ; périmètre : concours sur 63 défis et 54 millions de lignes | 4 des 7 systèmes publiés en open source |

La DARPA note un net progrès depuis la demi-finale d'août 2024, où les taux étaient de 37 % et 25 %.

Les limites publiées vont toutes dans le même sens. GitHub demande de relire et tester avant le merge : « Always review and test the generated changes before you merge ». Google fait relire chaque correctif de CodeMender par des chercheurs humains avant soumission. Anthropic réserve son action aux PR de confiance. Anthropic conseille d'ailleurs d'exiger une approbation pour tous les contributeurs externes : un agent de review lancé sur des PR venues de forks s'expose à l'injection de prompt.

## Les jetons OAuth échappent à la CI : le cas Salesloft Drift

Selon le [Google Threat Intelligence Group](https://cloud.google.com/blog/topics/threat-intelligence/data-theft-salesforce-instances-via-salesloft-drift), l'acteur UNC6395 a utilisé des jetons OAuth compromis de Salesloft Drift du 8 août 2025 au 18 août au moins. Avec eux, il a exporté des données de nombreuses instances Salesforce. Il y cherchait surtout des identifiants : clés AWS (AKIA), mots de passe, jetons Snowflake.

Le 20 août 2025, Salesloft et Salesforce ont révoqué tous les jetons d'accès et de rafraîchissement Drift. Drift a quitté l'AppExchange. Le GTIG demande aux organisations qui utilisaient Drift de considérer leurs données comme compromises, de revoir leurs intégrations tierces, puis de révoquer et faire tourner leurs identifiants. Le périmètre dépasse l'intégration Salesforce, puisqu'il touche aussi Drift Email.

Le [DBIR 2026 de Verizon](https://www.verizon.com/business/resources/Te26/reports/2026-dbir-data-breach-investigations-report.pdf) cite ce cas parmi ses exemples d'implication de tiers. Ces jetons vivaient dans l'intégration. Aucun scanner de dépôt ne les voyait.

## Le DBIR 2026 chiffre le risque des tiers et des correctifs lents

Le DBIR 2026 place l'exploitation de vulnérabilités en tête des vecteurs d'accès initial, à 31 % des violations étudiées, contre 20 % l'année précédente. Les correctifs ralentissent aussi. Les organisations n'ont entièrement corrigé que 26 % des vulnérabilités du catalogue KEV de la CISA, contre 38 % l'année d'avant. Le délai médian passe de 32 à 43 jours.

Les tiers comptent aussi. Ils interviennent dans 48 % des violations, contre 30 % l'année précédente, soit une hausse de 60 %. Seuls 23 % de ces tiers ont entièrement corrigé une MFA absente ou mal sécurisée sur leurs comptes cloud.

L'abus d'identifiants recule de 22 % à 13 % comme vecteur d'accès initial. Le DBIR ajoute toutefois le pretexting comme catégorie. À périmètre comparable, le chiffre serait de 16 %. Compté à toutes les étapes d'une violation, l'abus d'identifiants reste en tête, à 39 %.

## Les secrets d'un SaaS fuient aussi hors des dépôts

Le [State of Secrets Sprawl 2026 de GitGuardian](https://www.gitguardian.com/state-of-secrets-sprawl-report-2026), publié le 17 mars 2026, contient des chiffres au-delà de son titre. Les dépôts internes sont 6 fois plus susceptibles de contenir des secrets en dur que les dépôts publics. Dans GitLab auto-hébergé et les registres Docker, les secrets sont 3 à 4 fois plus souvent valides.

Ces fuites hors code pèsent lourd. 28 % des incidents naissent entièrement hors des dépôts, dans Slack, Jira ou Confluence, et GitGuardian classe ces fuites critiques 13 % plus souvent. Les secrets de services IA fuités en 2025 atteignent 1 275 105, soit 81 % de plus. Les serveurs MCP ont exposé plus de 24 000 secrets dans leur première année.

Côté commits, 1,5 % des 1,94 milliard de commits publics de 2025 contenaient un identifiant exposé. Le taux monte à 3,2 % pour les commits co-écrits par Claude Code. L'année précédente, GitGuardian mesurait un taux de fuite 40 % plus élevé pour les dépôts qui utilisaient des assistants IA.

## Quatre agents IA durcissent un SaaS, surtout hors de la CI

Quatre agents couvrent les zones décrites plus haut, et leur part la plus utile se joue hors de la CI.

### L'agent secrets va chercher hors du dépôt

Il part des alertes de vos outils de détection, par exemple le [secret scanning de GitHub](https://docs.github.com/fr/code-security/secret-scanning/introduction/about-secret-scanning) avec la protection au push, puis il va plus loin que le dépôt. Il relit aussi Slack, Jira et Confluence, où naissent 28 % des incidents de secrets selon GitGuardian. L'humain lance la rotation en production.

Sa propre clé d'accès au coffre ne passe jamais dans son contexte, puisque le serveur l'injecte à l'appel.

### L'agent dépendances trie les montées de version

[Dependabot](https://docs.github.com/fr/code-security/dependabot) ou Renovate ouvrent déjà les PR de montée de version. L'agent les trie ensuite. Avec un délai médian de 43 jours pour corriger une vulnérabilité KEV, c'est là que ce tri peut faire gagner du temps.

### L'agent IAM et configuration lit les intégrations OAuth

Il lit les scopes OAuth de vos SaaS et la liste des applications connectées, là où le cas Drift s'est joué. Le GTIG en tire deux consignes : restreindre au minimum les scopes des applications connectées, et chercher les secrets dans les données Salesforce pour les révoquer et les faire tourner. L'agent IAM peut préparer ces deux inventaires. La révocation reste humaine.

Les comptes cloud des tiers entrent aussi dans son inventaire. Leur MFA reste le point faible relevé plus haut : seuls 23 % des tiers l'ont entièrement corrigée, selon le DBIR 2026.

### L'agent de review PR sécurité reste sur les PR de confiance

Le README de Claude Code security review limite ce type d'outil aux PR de confiance. Pour cadrer Claude Code lui-même, lisez [Déployer Claude Code en entreprise](/fr/resources/articles/deployer-claude-code-entreprise). Dans la CI, le tri des alertes se fait à chaque pull request.

## Borner les agents IA de sécurité selon l'ANSSI et les éditeurs

Les éditeurs cités gardent tous un humain avant l'action irréversible. Vos agents suivent la même règle. L'article [Le vrai risque des agents IA, c'est l'autorité](/fr/resources/articles/agents-ia-formation-autorite) détaille les niveaux lire, proposer, préparer et exécuter.

Le guide de l'[ANSSI sur l'IA agentique](https://messervices.cyber.gouv.fr/guides/essentiels-ia-agentique), publié en octobre 2026 (version 1.0), va dans le même sens. Il demande de « Maintenir les secrets hors du contexte du modèle, des mémoires et des journaux ». Il recommande de confier leur gestion à un coffre fort ou un proxy, et d'accorder à l'agent des jetons à durée de validité courte, limités aux droits strictement nécessaires. Il demande enfin de « Prévoir un arrêt d'urgence avec révocation des accès, déclenchable par un mécanisme de supervision ». En mode dégradé, l'agent n'élargit pas ses droits.

Chaque agent a son propre compte technique, des droits minimaux et des journaux. Si vous le branchez sur vos outils via MCP, définissez d'abord les outils autorisés, gardez les secrets côté serveur et isolez l'exécution, comme le décrit [Serveur MCP en entreprise](/fr/resources/articles/serveur-mcp-entreprise).

Si votre produit traite des données de santé, l'agent tourne dans l'environnement conforme du client. L'article [IA et données de santé : ce que l'HDS impose vraiment](/fr/resources/articles/ia-donnees-de-sante-hds) détaille ce cadre.

## FAQ

### Que faire si une intégration SaaS est compromise ?

Le GTIG demande de considérer les données comme compromises, de revoir les intégrations tierces, puis de révoquer et faire tourner les identifiants. Il conseille aussi de chercher les secrets dans les données exposées et de restreindre les scopes des applications connectées. Un agent peut préparer ces inventaires. Un humain lance la révocation.

### Les chiffres publiés par les éditeurs se comparent-ils ?

Non. Codex Security, CodeMender et AIxCC mesurent des choses différentes, sur une cohorte bêta, des projets open source ou un concours de 63 défis. Chaque chiffre vaut pour son périmètre.

### Quelle différence avec la sécurité des agents IA ?

Sécuriser un agent, c'est limiter ce qu'il peut faire et protéger ses secrets. Ici, l'agent est l'outil qui durcit votre produit. Les deux vont ensemble, car un agent de sécurité mal borné devient lui-même un risque, d'où l'arrêt d'urgence demandé par l'ANSSI.

### Votre code part-il chez un fournisseur de modèle ?

Cela dépend du modèle et du contrat choisis. Avant de brancher un agent sur vos dépôts, vérifiez au contrat la rétention, le non-entraînement et l'hébergement, comme pour tout sous-traitant.

## Durcir votre SaaS avec des agents IA de sécurité

Vous voulez savoir ce que vos agents de sécurité doivent voir, dans la CI et en dehors ?

[Réserver un échange sur le durcissement de votre SaaS →](https://cal.com/stangirard/thevibecompany)

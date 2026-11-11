---
title: "Agent IA de sécurité en CI/CD : le workflow testé, PR par PR"
seoTitle: "Agent IA de sécurité en CI/CD : le workflow testé"
slug: agent-securite-ci
translationKey: ci-security-agent
language: fr
summary: "Agent IA de sécurité en CI/CD : deux workflows testés le 11 novembre 2026 (gitleaks, zizmor), trois pièges de la CI et ce que GitHub change le 2 décembre 2026."
publishedAt: 2026-11-05
dateModified: 2026-11-11
complexity: intermediate
topics: AI Agents, Security, AI Operations
coverImage: /images/resources/agent-securite-ci/cover-mascotte.webp
coverAlt: "Mascotte The Vibe Company inspectant un pipeline CI avec scanners de secrets, paquets et fichiers de config devant un portique de contrôle"
ogImage: /images/resources/agent-securite-ci/cover-mascotte.webp
---

Le 11 novembre 2026, deux workflows d'agent de review sont passés à zizmor : 6 findings sur le risqué, aucun sur le durci en mode par défaut, alors que l'agent durci lit toujours le texte de la PR. Le 2 décembre 2026, GitHub bloquera aussi `pull_request_target` par défaut dans les dépôts publics.

Un agent IA de sécurité en CI/CD ne merge pas seul. Sa règle tient en une ligne : l'agent propose et prépare, un humain valide l'irréversible, comme la rotation d'un secret de prod, un élargissement de droits ou le merge d'un diff auth. Ce guide détaille les deux workflows, les trois façons dont la CI piège un tel agent, et la politique de GitHub. Sécuriser l'agent lui-même relève de [Black October](/fr/resources/articles/black-october-securite-agents-ia). Ce que la CI ne voit pas a son propre article : [Agents IA pour durcir un SaaS](/fr/resources/articles/agents-ia-durcir-saas).

## Le test du 11 novembre 2026 : deux workflows d'agent IA de sécurité en CI/CD

Le test du 11 novembre 2026, sur un dépôt de démonstration, a donné trois résultats : gitleaks 8.30.1 a signalé 2 fuites dans une paire de clés AWS factices (code de sortie 1, 1 commit scanné en 125 ms), et zizmor 1.32.0 a affiché 6 findings sur le workflow risqué et aucun sur le workflow durci en persona par défaut (3 findings mineurs, 2 low et 1 info, en mode auditor).

Le workflow risqué déclenche l'agent sur `pull_request_target`, avec `permissions: write-all`, des actions épinglées par tag, et le titre et le corps de la PR collés dans le prompt :

```yaml
name: ai-review-risky
on:
  pull_request_target:
    types: [opened, synchronize]
permissions: write-all
jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ github.event.pull_request.head.sha }}
      - uses: tj-actions/changed-files@v45
        id: changed
      - name: AI security review
        run: |
          echo "Review this PR: ${{ github.event.pull_request.title }} ${{ github.event.pull_request.body }}" > prompt.txt
          ./ai-agent --prompt prompt.txt --tools "bash,gh"
        env:
          AI_API_KEY: ${{ secrets.AI_API_KEY }}
          GH_TOKEN: ${{ secrets.ADMIN_PAT }}
```

Le workflow durci garde le même agent, mais passe par `pull_request`, lit le dépôt en `contents: read`, épingle le checkout par SHA et fait passer le corps de la PR par une variable d'environnement, en mode commentaire :

```yaml
name: ai-review-hardened
on:
  pull_request:
    types: [opened, synchronize]
permissions:
  contents: read
jobs:
  review:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
        with:
          persist-credentials: false
      - name: AI security review (comment only)
        run: ./ai-agent --prompt-file .github/review-prompt.md --body-from-env --mode comment-only
        env:
          PR_BODY: ${{ github.event.pull_request.body }}
          GH_TOKEN: ${{ github.token }}
```

Sur une PR venue d'un fork, GitHub ramène ce jeton en lecture seule : le commentaire de l'agent ne passera donc que sur les PR du dépôt.

La sortie de zizmor, abrégée aux lignes de résultat :

```text
$ zizmor --offline .github/workflows/ai-review-risky.yml
warning[artipacked]: credential persistence through GitHub Actions artifacts
error[dangerous-triggers]: use of fundamentally insecure workflow trigger
error[template-injection]: code injection via template expansion
error[template-injection]: code injection via template expansion
error[unpinned-uses]: unpinned action reference
error[unpinned-uses]: unpinned action reference
11 findings (5 suppressed, 3 unsafe fixes): 0 informational, 0 low, 1 medium, 5 high

$ zizmor --offline .github/workflows/ai-review-hardened.yml
No findings to report. Good job! (3 suppressed)
```

Le `write-all` du workflow risqué n'apparaît pas dans ce mode. Avec `--persona=auditor`, zizmor affiche 11 findings sur le workflow risqué, dont `excessive-permissions` et 2 `secrets-outside-env`. Sur le durci, ce mode relève les 3 findings mineurs : `undocumented-permissions`, `anonymous-definition` et `concurrency-limits`.

Ce test a ses limites. Elles comptent autant que le résultat : 2 workflows écrits pour l'occasion, 1 exécution, une analyse statique d'un agent fictif, rien d'exécuté sur GitHub. Ce n'est pas un benchmark.

Le résultat le plus utile tient dans ce que zizmor ne voit pas. L'outil signale l'injection de template, une injection shell, et ne juge pas l'injection de prompt : le workflow durci passe alors que l'agent lit toujours le corps de la PR, un texte écrit par l'auteur de la PR. Ce qui veut dire qu'un zizmor vert ne dispense ni du mode commentaire, ni du jeton minimal, ni de la règle des PR de confiance.

## La CI devient le goulot quand les agents écrivent les PR

Selon [Octoverse 2026](https://github.blog/news-insights/octoverse/octoverse-commits-pushes-reach-new-highs-in-2026-as-developers-build-with-agents/), plus de 40 % des pull requests sur GitHub démarraient en septembre 2026 par un premier jet d'agent, contre 17 % en mars. Pour le seul mois de septembre, cela représente 110 millions de PR. La détection suit le rythme. Octoverse compte 5,8 milliards de scans de push protection sur l'année, près de quatre fois le rythme de 2025, et plus de 30 millions de PR Dependabot mergées, environ le double.

Les secrets en donnent la mesure. Le [State of Secrets Sprawl 2026 de GitGuardian](https://blog.gitguardian.com/the-state-of-secrets-sprawl-2026/) compte 28,65 millions de nouveaux secrets en clair dans les commits publics GitHub en 2025, soit 34 % de plus en un an. Les commits assistés par Claude Code fuient à 3,2 %, contre 1,5 % pour l'ensemble des commits publics, un écart qui compte sans se lire comme une simple faute de l'outil, précise GitGuardian. Plus de 64 % des identifiants valides en 2022 l'étaient encore au nouveau test de janvier 2026.

L'OWASP range ce problème dans [CICD-SEC-6, Insufficient Credential Hygiene](https://owasp.org/www-project-top-10-ci-cd-security-risks/CICD-SEC-06-Insufficient-Credential-Hygiene) : des identifiants imprimés dans la sortie console des pipelines, et souvent pas tournés pendant des années. Sa parade préfère des identifiants temporaires aux identifiants statiques. Les runners comptent aussi. Dans l'analyse Shai-Hulud 2 de GitGuardian, 59 % des machines compromises étaient des runners CI/CD.

## Scanners de la CI : l'agent ajoute le tri

Les scanners détectent, et l'agent s'occupe de la suite de l'alerte sur la PR en cours :

| Sur chaque PR | Scanner classique | Agent IA de sécurité en CI/CD |
| --- | --- | --- |
| Secrets | Bloque ou alerte sur un motif | Relie la clé au service et au risque si elle est encore valide, prépare le retrait et la rotation |
| Dépendances | Ouvre ou signale une montée de version | Vérifie si la fonction vulnérable est appelée, lit le changelog, regroupe les bumps mineurs |
| Configs et IaC | Signale un écart générique | Explique l'écart sur cette PR et propose le moindre privilège |
| Suivi | Check rouge, ticket oublié | Résume ce qui bloque le merge, ce qui attend, ce qui demande une décision humaine |

Le serveur MCP distant de GitHub permet à un agent de lancer le secret scanning, mais ses résultats restent éphémères et ne s'enregistrent pas comme alertes. Ce scan à la demande complète donc le scan de la CI sans le remplacer.

## Trois pièges de la CI pour un agent de sécurité

### Une action déplacée sous un tag : tj-actions/changed-files

En mars 2025, l'action [tj-actions/changed-files](https://github.com/advisories/GHSA-mrrh-fwg8-r2c3) a été la cible d'une attaque de chaîne d'approvisionnement qui a touché plus de 23 000 dépôts. Les attaquants ont déplacé des tags de version existants vers un commit malveillant, actif du 14 au 15 mars 2025. Le script lisait la mémoire du processus Runner Worker et imprimait les secrets dans les logs du workflow. Pour les dépôts aux logs publics, ces secrets devenaient lisibles par tous. La [CISA](https://www.cisa.gov/news-events/alerts/2025/03/18/supply-chain-compromise-third-party-tj-actionschanged-files-cve-2025-30066-and-reviewdogaction) a demandé de faire tourner immédiatement tout secret identifié, à considérer comme compromis. L'advisory GitHub indique un correctif en v46.0.1.

La parade commence par l'épinglage. La [doc GitHub](https://docs.github.com/en/actions/reference/security/secure-use) demande d'épingler chaque action sur un SHA de commit complet, et de ne garder un tag que si vous faites confiance à son auteur. La même doc place au-dessus le [lockfile de dépendances de workflow](https://docs.github.com/en/actions/concepts/security/workflow-dependency-lockfiles), qui remplace l'épinglage par SHA pour les dépôts qui l'adoptent. Ce fichier `.github/workflows/actions.lock` est généré par l'extension GitHub CLI `gh actions-lock`. La doc demande de ne jamais l'éditer à la main. Il épingle aussi les dépendances transitives, mais pas les workflows réutilisables. Il ne contrôle ni les secrets ni l'image du runner. Complétez avec la clé `permissions`, qui limite le [GITHUB_TOKEN](https://docs.github.com/en/actions/tutorials/authenticate-with-github_token) au strict nécessaire pour un workflow ou un job.

### `pull_request_target` : bloqué par défaut le 2 décembre 2026

Une politique par défaut de GitHub bloque l'événement `pull_request_target` dans les dépôts publics. Elle est en mode « evaluate ». Le 2 décembre 2026, GitHub l'appliquera aux dépôts concernés, et elle ne s'appliquera pas aux dépôts privés ou internes, selon la [doc GitHub](https://docs.github.com/en/actions/reference/security/securely-using-pull_request_target).

Le choix de l'événement compte. Avec `pull_request`, GitHub limite le GITHUB_TOKEN en lecture seule et retient les autres secrets pour les PR venues de forks. Avec `pull_request_target`, la doc exige que le code de la PR soit seulement inspecté comme une donnée, jamais exécuté. GitHub nomme le drapeau `allow-unsafe-pr-checkout` d'actions/checkout pour qu'il se voie en revue. Si votre agent n'a pas besoin de secrets supplémentaires, la doc conseille `pull_request`.

### Un prompt construit avec le texte de la PR : PromptPwnd

Aikido Security a décrit le schéma dans [PromptPwnd](https://www.aikido.dev/blog/promptpwnd-github-actions-ai-agents), publié le 4 décembre 2025 et mis à jour le 17 mars 2026. Une entrée utilisateur non fiable entre dans le prompt, l'agent IA exécute des outils privilégiés, et des secrets fuient ou des workflows changent. Aikido cite Gemini CLI, Claude Code, OpenAI Codex et GitHub AI Inference. Le dépôt Gemini CLI de Google était concerné, et Google l'a corrigé dans les quatre jours suivant la divulgation d'Aikido. Aikido affirme aussi qu'au moins 5 entreprises du Fortune 500 sont touchées, un chiffre de l'éditeur. Sa recommandation : ne pas injecter d'entrée utilisateur non fiable dans un prompt d'IA, ou sinon la nettoyer et la valider.

Les éditeurs d'actions IA donnent la même consigne. La [doc sécurité de claude-code-action](https://github.com/anthropics/claude-code-action/blob/main/docs/security.md) réserve le déclenchement aux utilisateurs qui ont un accès en écriture. Elle marque « RISKY » le paramètre `allowed_non_write_users`, qui contourne ce contrôle. Elle déconseille le jeton d'accès personnel, qu'une injection de prompt peut récupérer, et demande le GITHUB_TOKEN, limité au job et expiré à sa fin. Son nettoyage du contenu réduit le risque sans le supprimer. Le README de [claude-code-security-review](https://github.com/anthropics/claude-code-security-review) réserve l'action aux PR de confiance, faute de durcissement contre l'injection de prompt.

## Le pipeline de l'agent, du hook local à la revue

Le pipeline commence avant le push. Il passe par un hook local pour les secrets, puis par la push protection côté forge. À chaque PR, l'agent fait ensuite trois lectures du même diff : les secrets, les dépendances et les configs. Il commente le diff. Il ne bloque que sur des règles écrites : un secret en dur, un contrôle d'accès retiré, une permission CI élargie sans justification.

La revue suit le risque. Une PR qui touche `auth/`, la crypto, les policies cloud ou les workflows passe par une revue humaine obligatoire, même avec un avis favorable de l'agent. Octoverse le dit à sa façon : « Review is where developers shape what comes back ». La nuit et chaque semaine, l'agent reprend ce qui reste ouvert hors du diff du jour.

## Agent IA de sécurité en CI/CD : par où commencer

1. Faites l'inventaire des dépôts, des workflows CI, des coffres de secrets et des scanners déjà branchés.
2. Activez la push protection et le secret scanning, puis mesurez le volume d'alertes.
3. Branchez l'agent en lecture et en commentaire sur un ou deux dépôts critiques, sans merge autonome.
4. Écrivez 5 à 10 règles en skills versionnés.
5. Étendez ensuite, en gardant un humain sur l'auth, les secrets de prod et l'IAM.

Pour aller plus loin : [Déployer Claude Code en entreprise](/fr/resources/articles/deployer-claude-code-entreprise) pour cadrer l'outil, [Agent harness en entreprise](/fr/resources/articles/agent-harness-entreprise) pour la sandbox et les droits, et [Du POC agent IA à la production](/fr/resources/articles/poc-agent-ia-production) si votre agent sort d'un POC.

## FAQ

### Un agent IA de sécurité en CI/CD remplace-t-il Dependabot ou le secret scanning ?

Non, il s'appuie dessus. Les scanners détectent, l'agent trie, explique et prépare le correctif sur la PR. Même le secret scanning lancé par un agent via le serveur MCP de GitHub ne s'enregistre pas comme alerte. Gardez donc les scanners de la CI comme base, et l'agent comme deuxième lecture du diff.

### Peut-il merger tout seul quand le check est vert ?

Pas sur les changements sensibles. La rotation d'un secret de prod, un élargissement de droits ou le merge d'un diff auth demandent une décision humaine. La doc de claude-code-action réserve déjà son déclenchement aux utilisateurs avec un accès en écriture. Commencez en lecture et en commentaire, sans merge autonome.

### Faut-il le faire tourner sur toutes les PR ?

Oui pour les trois lectures de base : secrets, dépendances et configs. La profondeur suit le risque. Les PR sur `auth/`, la crypto, les policies cloud ou les workflows gardent leur relecteur humain. Pour les PR venues de forks, préférez `pull_request`, qui limite le GITHUB_TOKEN en lecture seule et retient les autres secrets.

### Quelle différence avec l'article « durcir un SaaS » ?

Cet article traite le maillon CI, à chaque pull request : le workflow de l'agent, ses pièges et ses parades. [Agents IA pour durcir un SaaS](/fr/resources/articles/agents-ia-durcir-saas) traite ce que la CI ne voit pas. Black October, lui, parle de sécuriser l'agent lui-même. Les trois articles se lisent ensemble, dans l'ordre de votre risque principal.

## Mettre un agent IA de sécurité dans votre CI/CD

Vous voulez brancher un agent de review sécurité sur vos dépôts, en mode commentaire, avec des droits minimaux et un humain sur l'irréversible. Venez avec vos workflows et vos scanners actuels.

[Réserver un échange sur votre CI sécurité](https://cal.com/stangirard/thevibecompany)

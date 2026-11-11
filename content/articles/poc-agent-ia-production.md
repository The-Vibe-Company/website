---
title: "Agent IA du POC à la production : la grille go/no-go"
seoTitle: "Agent IA : du POC à la production | The Vibe Company"
slug: poc-agent-ia-production
translationKey: ai-agent-poc-to-production
language: fr
summary: "Une grille go/no-go en 12 lignes pour faire passer un agent IA du POC à la production : pour chaque ligne, la preuve à produire et le texte qui la fonde."
publishedAt: 2026-10-14
dateModified: 2026-11-11
complexity: intermediate
topics: AI Adoption, AI Agents, Engineering
coverImage: /images/resources/poc-agent-ia-production/cover-mascotte-v3.webp
coverAlt: "Un prototype de dirigeable en papier au premier plan, le vrai dirigeable derrière, et la mascotte qui coche une checklist"
ogImage: /images/resources/poc-agent-ia-production/cover-mascotte-v3.webp
---

Pour faire passer un agent IA du POC à la production, il faut une preuve par risque, écrite avant le go. Cette grille compte 12 lignes, plus une ligne 0. Chacune dit quelle preuve produire et sur quel texte elle s'appuie : le guide de l'[ANSSI](https://messervices.cyber.gouv.fr/guides/essentiels-ia-agentique) publié en octobre 2026 (version 1.0), l'OWASP, Anthropic et l'article 50 de l'AI Act. Si une case reste vide, l'agent reste un POC.

Les chiffres d'échec qui circulent demandent un tri. Le « 95 % » du MIT décrit une méthode précise, avec une limite que ses auteurs écrivent eux-mêmes. Le « 40 % » de Gartner est une prévision. La suite les détaille, sources à l'appui.

## Un POC d'agent IA répond à une seule question

Un POC utile vérifie une chose : sur ce type de tâche et avec ces données d'exemple, le modèle produit-il quelque chose d'exploitable ? Le reste n'est pas prouvé.

- La tenue de l'agent sur des cas rares, ambigus ou conflictuels.
- L'usage quotidien par vos équipes.
- Un coût par tâche acceptable à l'échelle.
- Une escalade humaine qui marche quand l'agent se trompe.
- La reprise du système sans l'équipe qui l'a construit.

Un agent appelle des outils, lit du contexte et propose une action. En production, chaque outil devient une porte. Il faut savoir lesquelles sont ouvertes, qui les surveille et qui reprend la main.

L'ANSSI pose la règle dans son guide « Sécuriser un système IA agentique » : « Désigner un responsable humain pour chaque mesure. Bloquer la mise en service tant qu'un risque reste inacceptable. » Ce guide vise les organisations qui déploient, configurent ou intègrent un système agentique, produits sur étagère compris. Ces recommandations n'ont pas valeur d'obligation légale.

Une question passe avant toutes les autres. Faut-il vraiment un agent ? Gartner note que « Many use cases positioned as agentic today don't require agentic implementations », et recommande de ne poursuivre l'IA agentique que là où la valeur ou le ROI est clair. C'est la ligne 0 de la grille.

## Les chiffres d'échec des agents IA viennent de méthodes très différentes

Le « 95 % » vient d'un rapport du MIT, projet NANDA : [« The GenAI Divide: State of AI in Business 2025 »](https://mlq.ai/media/quarterly_decks/v0.1_State_of_AI_in_Business_2025_Report.pdf), version 0.1 de juillet 2025, couvrant janvier à juin 2025. Le lien mène à une copie du PDF hébergée par mlq.ai. [Fortune](https://fortune.com/2025/08/18/mit-report-95-percent-generative-ai-pilots-at-companies-failing-cfo/) l'a résumé le 18 août 2025 : 95 % des pilotes d'IA générative étudiés n'avaient pas d'impact mesurable sur le compte de résultat.

La méthode tient en trois sources. Le rapport s'appuie sur plus de 300 initiatives rendues publiques, des entretiens avec 52 organisations et 153 réponses de dirigeants recueillies dans quatre conférences. Ses auteurs le disent : ces chiffres reposent sur des entretiens individuels, pas sur les comptes des entreprises, et la définition du succès varie d'une organisation à l'autre. Ils jugent donc leurs chiffres « directionally accurate ». Pour les outils spécialisés, il compte 60 % d'organisations qui évaluent, 20 % qui pilotent et 5 % qui les mettent en œuvre avec un impact durable. Le succès y désigne un déploiement au-delà du pilote, avec des KPI mesurables, et un ROI mesuré six mois après le pilote.

Gartner prévoit, dans un [communiqué du 25 juin 2025](https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027), l'annulation de plus de 40 % des projets d'IA agentique d'ici fin 2027. Les causes citées sont les coûts, une valeur métier floue et des contrôles de risque insuffisants. C'est une prévision. Les chiffres d'investissement du même communiqué viennent d'un sondage de janvier 2025 auprès de 3 412 participants à un webinaire. Gartner estime aussi qu'environ 130 des milliers de fournisseurs d'IA agentique seraient réels.

Une enquête dit autre chose. Dans le [State of Agent Engineering](https://www.langchain.com/state-of-agent-engineering) de LangChain, 57,3 % des répondants ont des agents en production. L'enquête est publique, elle a tourné du 18 novembre au 2 décembre 2025 et compte 1 340 réponses du public de LangChain. Un tiers des répondants cite la qualité comme premier frein. 89 % ont une forme d'observabilité et 62 % un tracing détaillé, mais 52,4 % seulement font des évaluations hors ligne sur un jeu de test. Le décalage entre ces deux chiffres a une conséquence : des traces sans évaluation racontent ce qui s'est passé, sans dire si c'était bon.

## La grille go/no-go d'un agent IA tient en 12 lignes

Chaque ligne de la grille demande une preuve écrite avant le go, et renvoie au texte qui la justifie. Elle reprend les neuf critères de la checklist d'origine (périmètre, données réelles, critère de succès, propriétaire, escalade, observabilité, permissions, coût, reprise) et les complète.

| # | Ligne | Preuve à produire avant le go | Fondement |
|---|---|---|---|
| 0 | Faut-il vraiment un agent ? | Une phrase : pourquoi un workflow ou un assistant ne suffit pas | Gartner, 25/06/2025 |
| 1 | Mission écrite, hors périmètre listé | Document de mission et cas refusés | ANSSI ; critère « Cas d'usage borné » |
| 2 | Jeu d'évaluation tiré de vrais échecs | 20 à 50 cas réels, anonymisés si besoin | Anthropic, 09/01/2026 ; critère « Données réelles » |
| 3 | Critère go/no-go écrit avant le test | Seuil chiffré et nom de qui le valide | Critère « Critère de succès mesurable » ; MIT : succès = KPI mesurables |
| 4 | Constance mesurée | Chaque cas rejoué plusieurs fois, taux « tous les essais réussis » | Anthropic, pass^k |
| 5 | Un responsable humain par mesure, et une escalade qui marche | Noms (pas un comité) ; file d'attente, seuils de doute, personne de garde | ANSSI ; critères « Propriétaire métier » et « Plan d'escalade humaine » |
| 6 | Actions classées : autonome, approbation humaine, interdite | Tableau des actions de l'agent | ANSSI ; critère « Permissions progressives » |
| 7 | Autorisation hors du modèle, refus par défaut | Contrôle côté système appelé | ANSSI ; OWASP, autorisation dans les systèmes aval |
| 8 | Fonctions, droits et autonomie au minimum | Liste des outils et des scopes, chacun justifié | OWASP LLM06 ; ANSSI |
| 9 | Traces rejouables, journaux hors de portée de l'agent | Une trace demande → autorisation → action → résultat, rejouée | ANSSI ; LangChain ; critère « Observabilité » |
| 10 | Plafonds d'appels et arrêt d'urgence | Limite et procédure de coupure testée | ANSSI ; OWASP, rate limiting |
| 11 | Transparence si l'agent parle directement à des personnes | Message « vous échangez avec une IA » dès le premier échange, ou analyse « interaction non directe » | AI Act, art. 50(1) ; FAQ de la Commission |
| 12 | Coût par tâche réussie et reprise interne | Budget à l'échelle prévue, runbook, accès, docs | Critères « Coût par tâche » et « Reprise interne » |

Version à copier de la grille :

```markdown
# Grille go/no-go agent IA
0. Faut-il vraiment un agent ? Preuve : pourquoi un workflow ou un assistant ne suffit pas.
1. Mission écrite, hors périmètre listé. Preuve : document de mission et cas refusés.
2. Jeu d'évaluation tiré de vrais échecs. Preuve : 20 à 50 cas réels, anonymisés si besoin.
3. Critère go/no-go écrit avant le test. Preuve : seuil chiffré et nom de qui le valide.
4. Constance mesurée. Preuve : chaque cas rejoué plusieurs fois, taux « tous les essais réussis ».
5. Un responsable humain par mesure, et une escalade qui marche. Preuve : noms (pas un comité) ; file d'attente, seuils de doute, personne de garde.
6. Actions classées : autonome, approbation humaine, interdite. Preuve : tableau des actions de l'agent.
7. Autorisation hors du modèle, refus par défaut. Preuve : contrôle côté système appelé.
8. Fonctions, droits et autonomie au minimum. Preuve : liste des outils et des scopes, chacun justifié.
9. Traces rejouables, journaux hors de portée de l'agent. Preuve : une trace demande → autorisation → action → résultat, rejouée.
10. Plafonds d'appels et arrêt d'urgence. Preuve : limite et procédure de coupure testée.
11. Transparence si l'agent parle directement à des personnes. Preuve : message « vous échangez avec une IA » dès le premier échange, ou analyse « interaction non directe ».
12. Coût par tâche réussie et reprise interne. Preuve : budget à l'échelle prévue, runbook, accès, docs.
```

## Remplir la grille go/no-go ligne par ligne

### Lignes 0 à 4 : la mission et l'évaluation

La mission écrite dit quelle tâche l'agent fait et laquelle il refuse, avec les cas hors périmètre listés. Le jeu d'évaluation vient de tickets, dossiers ou messages de production. Il n'a pas besoin d'être énorme. Pour [Anthropic](https://www.anthropic.com/research/demystifying-evals-for-ai-agents), « 20-50 simple tasks drawn from real failures is a great start ». Si l'agent tourne déjà, Anthropic conseille de partir du bug tracker et de la file support.

Le critère go/no-go s'écrit avant le test. Il peut porter sur le taux d'usage, le temps gagné ou une qualité validée par un humain métier. Il reste à mesurer la constance. La métrique pass^k d'Anthropic donne la probabilité que les k essais d'un même cas réussissent tous. Selon Anthropic, un agent qui réussit 75 % des essais ne passe les trois essais d'un cas que dans 42 % des situations, soit (0,75)³. Le même calcul, appliqué à 90 % par essai, donne 0,9³ = 0,729 : trois essais réussis sur un même cas 73 % du temps seulement. Anthropic juge cette métrique importante pour les agents face aux clients.

### Lignes 5 à 8 : les responsables, les actions et les droits

Chaque mesure a son responsable humain. Le propriétaire métier, celui qui décide si une réponse est acceptable, est une personne nommée. L'escalade complète la ligne 5. Quand l'agent doute ou se trompe, le cas part dans une file d'attente, selon des seuils de doute écrits, vers une personne de garde. L'ANSSI demande ensuite de classer les actions possibles en trois catégories : exécution autonome, approbation humaine obligatoire, action interdite. Pour une action soumise à approbation, l'approbateur voit l'action exacte, son objectif et ses effets attendus. Seule l'action approuvée s'exécute, et le mécanisme d'approbation reste hors de portée du système agentique.

L'autorisation se vérifie hors du modèle. L'ANSSI demande d'authentifier le demandeur et de vérifier ses droits selon une politique que le modèle ne peut pas modifier : « Par défaut, refuser l'action. » L'[OWASP](https://genai.owasp.org/llmrisk/llm062025-excessive-agency/) range ce risque sous LLM06:2025, « Excessive Agency », avec trois causes : excessive functionality, excessive permissions, excessive autonomy. Sa parade consiste à implémenter l'autorisation dans les systèmes aval, sans laisser le LLM décider si l'action est permise. L'OWASP recommande aussi un humain dans la boucle pour approuver les actions à fort impact.

La progression reste celle de la checklist d'origine : lecture d'abord, écriture sous contrôle, envoi sous validation humaine. L'ANSSI ajoute une condition. L'autonomie ne s'élargit qu'après vérification de l'efficacité des mesures de sécurité et des procédures de gestion d'incidents.

### Lignes 9 et 10 : les traces et l'arrêt d'urgence

Une trace utile permet de rejouer un tool call, un prompt et une décision. L'ANSSI demande des journaux hors de portée des modifications de l'agent, pour reconstituer la séquence demande → autorisation → action → résultat. La preuve la plus simple consiste à rejouer une de ces séquences devant le responsable.

Les plafonds limitent les dégâts. L'ANSSI recommande de limiter le nombre d'appels successifs entre agents, de prévoir un arrêt d'urgence avec révocation des accès et de garder les secrets hors du contexte du modèle. L'OWASP demande de journaliser et de limiter le débit.

### Ligne 11 : l'article 50 de l'AI Act

L'article 50 de l'AI Act s'applique depuis le 2 août 2026, d'après la [FAQ de la Commission européenne](https://digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act), mise à jour le 24 juillet 2026. Un fournisseur de système d'IA qui interagit directement avec des personnes doit les informer qu'elles interagissent avec une IA, sauf si c'est évident, dès la première interaction. La FAQ pose quatre critères cumulatifs. L'un d'eux exige une interaction directe : l'IA communique elle-même avec la personne, sans intermédiaire humain. Le délai de grâce jusqu'au 2 décembre 2026 ne concerne que le marquage prévu à l'article 50(2), pour les systèmes mis sur le marché avant le 2 août 2026.

Un brouillon relu et envoyé par un humain n'est donc pas, a priori, une interaction directe au sens de ces critères. C'est une déduction de lecture, à faire valider par votre juriste.

### Ligne 12 : le coût et la reprise

Deux preuves ferment la grille. Le coût se mesure par exécution réussie, à l'échelle prévue, avec un budget connu et une alerte en cas de dérive. La reprise interne se prouve par des livrables : docs, accès, runbook et formation. Votre équipe doit pouvoir faire évoluer le système sans le prestataire.

## Exemple fictif : la grille remplie pour un agent de brouillons support

Cet exemple fictif décrit un agent qui rédige des brouillons de réponse support, relus par un conseiller. Aucun chiffre n'y est réel, et les seuils restent en forme [x] %.

| # | Ligne | Exemple fictif rempli |
|---|---|---|
| 0 | Faut-il vraiment un agent ? | L'agent lit l'historique du client et choisit les documents à citer ; un modèle de réponse fixe ne le fait pas |
| 1 | Mission | Rédiger un brouillon pour les tickets de facturation ; refuser les litiges juridiques et les demandes de suppression de compte |
| 2 | Jeu d'évaluation | [x] tickets réels anonymisés, tirés des réponses corrigées par l'équipe support |
| 3 | Critère go/no-go | Brouillon accepté sans réécriture sur [x] % des cas, validé par la responsable support |
| 4 | Constance | Chaque cas rejoué 3 fois ; seuil « tous les essais réussis » fixé à [x] % |
| 5 | Responsables et escalade | Un nom pour l'évaluation, un nom pour les accès, un nom pour l'arrêt d'urgence ; doute ou litige : ticket renvoyé à la file [x], personne de garde nommée |
| 6 | Actions classées | Lire un ticket : autonome ; enregistrer un brouillon : autonome ; envoyer : approbation humaine ; rembourser : interdite |
| 7 | Autorisation | Le service de tickets vérifie les droits de l'agent à chaque appel ; refus par défaut |
| 8 | Droits minimum | Lecture des tickets et de la documentation, écriture des seuls brouillons |
| 9 | Traces | Une séquence demande → autorisation → action → résultat rejouée devant la responsable support |
| 10 | Plafonds | [x] appels par ticket ; coupure des accès testée une fois avant le go |
| 11 | Article 50 | Brouillon relu et envoyé par un conseiller : analyse « interaction non directe » envoyée au juriste |
| 12 | Coût et reprise | Coût par brouillon accepté suivi chaque semaine ; runbook et accès remis à l'équipe interne |

## Trois erreurs reviennent avant le go production

La première erreur consiste à évaluer sur des exemples choisis pour la démo. Le jeu d'évaluation doit venir de vrais cas, et un chiffre de labo sans usage réel ne dit presque rien.

La deuxième erreur laisse les tool calls dans l'ombre. Ce que l'agent lit, appelle et propose doit rester auditable.

La troisième retire l'humain trop tôt. Gardez-le dans la boucle tant que le risque le justifie, et n'élargissez l'autonomie qu'après avoir vérifié vos mesures de sécurité et vos procédures d'incident.

Pour la vue d'ensemble (outils, mémoire, autorité, mesure), lisez le [guide de l'agent IA en entreprise](https://www.thevibecompany.co/fr/resources/articles/agent-ia-entreprise). La grille sert aussi de base à l'offre [Agents IA en production](/fr/agents-ia-production). Une fois le prestataire choisi, voici [comment se déroule un projet avec un prestataire IA, du premier appel à la production](https://www.thevibecompany.co/fr/resources/articles/travailler-prestataire-ia).

## FAQ

**Combien de temps faut-il pour passer d'un POC à la production ?**
La durée dépend du périmètre et des contraintes : données, sécurité, intégrations. Le point fixe se trouve avant le démarrage. Écrivez le critère de succès, puis remplissez la grille.

**Faut-il toujours un humain dans la boucle ?**
Pour un premier déploiement métier, presque toujours. Commencez en lecture ou en brouillon sous validation, et élargissez les permissions quand les métriques et le métier le permettent. Si l'agent répond seul à des personnes, l'article 50 de l'AI Act impose de leur dire qu'elles parlent à une IA dès le premier échange.

**Un bon taux de précision sur un test suffit-il ?**
Non. Un chiffre de labo sans usage réel ne dit presque rien, et un taux moyen cache l'irrégularité. Rejouez chaque cas plusieurs fois : selon Anthropic, 75 % de réussite par essai donne environ 42 % de cas réussis trois fois sur trois. Mesurez ce que vos équipes acceptent vraiment.

**Qui maintient l'agent après le Go ?**
Décidez-le avant le go. Soit votre équipe reprend le système avec docs, runbook et formation, soit vous prévoyez un accompagnement de maintenance. Un agent sans propriétaire métier ni observabilité reste un POC.

## Passez du POC à un agent qui tient

Vous avez un pilote qui marche en démo et vous voulez savoir s'il est prêt pour la production. Venez avec votre cas d'usage, vos contraintes et ce que « succès » veut dire pour vous.

[Réservez 30 minutes avec Stan](https://cal.com/stangirard/thevibecompany).

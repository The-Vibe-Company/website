---
title: "RAG en entreprise : connecter l'IA à vos documents"
seoTitle: "RAG en entreprise : connecter l'IA à vos documents"
slug: rag-entreprise
translationKey: enterprise-rag
language: fr
summary: "RAG en entreprise : faire répondre l'IA générative à partir de vos documents, avec les bonnes sources, les bons droits d'accès et le cas LocService."
publishedAt: 2026-10-27
complexity: intermediate
topics: AI Infrastructure, Knowledge Systems, Security
coverImage: /images/resources/rag-entreprise/cover-mascotte.webp
coverAlt: "La mascotte, sur une échelle de bibliothèque, tend une fiche surlignée reliée à son dossier d'origine, à côté d'étagères fermées par une grille cadenassée"
ogImage: /images/resources/rag-entreprise/cover-mascotte.webp
---

Un RAG en entreprise, c'est un assistant d'IA générative qui répond à partir de vos documents plutôt que de sa mémoire. À chaque question, le système va chercher les passages utiles dans vos contrats, procédures, tickets ou wikis. Le modèle les lit et rédige une réponse qui cite ses sources. Le terme vient d'un article de chercheurs de Facebook AI Research publié en 2020, [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks](https://arxiv.org/abs/2005.11401). Leur argument tient toujours : la connaissance reste dans un index que vous pouvez lire, corriger et mettre à jour, sans réentraîner le modèle.

Ce guide explique comment ça marche, quand le RAG est la bonne réponse, et où les projets se cassent les dents : surtout sur la qualité de la recherche et sur les droits d'accès.

## Comment marche un RAG, en une minute

Il y a deux temps.

**Avant les questions : l'indexation.** On récupère les documents et on les découpe en passages de quelques centaines de mots. Chaque passage devient un vecteur (une représentation numérique de son sens), rangé dans un index.

**Au moment de la question : la recherche puis la réponse.** La question est transformée de la même façon. Le système retrouve les passages les plus proches, les ajoute à la consigne envoyée au modèle, et le modèle répond en s'appuyant dessus.

Le modèle ne « connaît » donc pas vos documents. Il les lit au moment où on lui pose la question. On peut citer la source exacte, et retirer un document de l'index le jour où il n'est plus valable.

## Quand le RAG est la bonne réponse (et quand il ne l'est pas)

| Votre besoin | Le RAG convient ? | Ce qui marche mieux sinon |
| --- | --- | --- |
| Répondre à partir de milliers de documents qui changent | Oui, c'est son terrain | |
| Quelques dizaines de pages stables | Rarement nécessaire | Mettre tout le corpus dans la consigne |
| Changer le ton ou le format des réponses | Non | Consignes, exemples, éventuellement fine-tuning |
| Lire des chiffres dans une base ou un ERP | En partie | Requête directe sur l'API ou la base |
| Agir dans un outil (créer un ticket, modifier un dossier) | Non | Un agent branché sur vos outils |

Le deuxième cas surprend souvent. Anthropic le dit dans son article sur la [Contextual Retrieval](https://www.anthropic.com/news/contextual-retrieval) : si votre base fait moins de 200 000 tokens, soit environ 500 pages, vous pouvez la mettre entière dans la consigne, sans RAG. Avant de lancer un projet, mesurez donc le volume réel de documents.

Le dernier cas aussi : un RAG lit, il n'agit pas. Pour qu'un assistant crée un ticket ou mette à jour un dossier client, il faut lui donner des outils, par exemple via un [serveur MCP](/fr/resources/articles/serveur-mcp-entreprise). Les deux se combinent bien : le RAG devient un outil parmi d'autres que l'agent appelle quand il a besoin d'une source.

## Les cinq briques d'un RAG d'entreprise qui tient

### 1. Une ingestion propre

La qualité des réponses dépend d'abord des documents. Un PDF scanné sans OCR, trois versions d'une même procédure, un wiki jamais mis à jour : le modèle répondra avec, et avec assurance. On commence par choisir les sources qui font autorité et retirer les doublons. On garde la date et la version de chaque document, et on prévoit la resynchronisation quand il change.

### 2. Un découpage qui garde le contexte

Un passage isolé perd vite son sens. « Le délai est porté à 30 jours » ne dit ni de quel contrat il s'agit, ni depuis quand. Anthropic propose d'ajouter à chaque passage une courte phrase de contexte générée à partir du document entier avant de l'indexer. Sur leurs tests, cette méthode réduit de 35 % les recherches qui ratent le bon passage. Combinée à une recherche par mots-clés, la baisse atteint 49 %, et 67 % avec un reclassement en plus.

### 3. Une recherche hybride

La recherche par vecteurs trouve les passages proches par le sens. Elle rate parfois les correspondances exactes : un numéro de contrat, une référence produit, un code d'erreur. La recherche par mots-clés (BM25, l'algorithme classique des moteurs de recherche) fait l'inverse. Combiner les deux donne de meilleurs résultats que les vecteurs seuls, c'est l'une des conclusions des tests d'Anthropic.

### 4. Un reclassement avant la réponse

On récupère large, par exemple 150 passages, puis un modèle de reclassement garde les plus pertinents pour la question. Le modèle de réponse lit moins de texte, ce qui réduit le coût et le bruit. En contrepartie, l'étape ajoute un peu de latence : à régler selon votre usage.

### 5. Une réponse citée, ou un « je ne sais pas »

Chaque réponse doit renvoyer au passage et au document d'origine, pour que l'utilisateur puisse vérifier en un clic. Et quand la recherche ne trouve rien de solide, l'assistant doit le dire au lieu de compléter avec ce qu'il croit savoir. C'est une consigne à écrire et à tester, elle ne vient pas toute seule.

## Les droits d'accès : là où les projets RAG fuient

Sur un RAG d'entreprise, le risque le plus sérieux dépasse souvent l'hallucination. C'est la fuite : un salarié pose une question et reçoit un passage d'un document qu'il n'aurait jamais dû voir. L'[OWASP](https://genai.owasp.org/llmrisk/llm082025-vector-and-embedding-weaknesses/) classe ce risque dans son Top 10 2025 des applications LLM (LLM08, faiblesses des vecteurs et embeddings). Il cite les accès non autorisés, les fuites entre clients ou équipes qui partagent le même index, et l'empoisonnement des données : un CV contenant du texte blanc sur fond blanc qui ordonne à l'IA de recommander le candidat.

Les assistants du marché appliquent en général les droits existants. Microsoft l'écrit dans sa [documentation sur la confidentialité de Copilot](https://learn.microsoft.com/fr-fr/copilot/microsoft-365/microsoft-365-copilot-privacy) : l'assistant ne fait remonter que les données que l'utilisateur a au moins le droit de consulter. C'est sain, mais ça veut dire qu'un dossier RH partagé « à toute l'entreprise » par erreur il y a trois ans devient trouvable en une question. Ce problème de droits existait déjà. Le RAG le rend visible.

Ce qu'on met en place sur un RAG sur mesure :

- **Filtrer pendant la recherche, pas après.** Chaque passage indexé porte les droits de son document d'origine, et la recherche ne remonte que ce que l'utilisateur peut lire. Filtrer la réponse une fois générée arrive trop tard.
- **Synchroniser les droits.** Quand quelqu'un quitte une équipe, ses accès changent dans la source. L'index doit suivre, pas au prochain réindexage complet.
- **Séparer les clients.** Sur une application multi-clients, un index ou une partition par client, jamais un filtre optionnel.
- **Contrôler ce qui entre.** Les documents venus de l'extérieur (CV, pièces jointes, pages web) passent une extraction qui ignore le texte caché avant l'indexation.
- **Tout journaliser.** Qui a demandé quoi, quels passages ont été remontés. C'est ce qui permet de comprendre une fuite si elle arrive.

C'est aussi un bon terrain pour des agents qui durcissent votre SI. Avant d'ouvrir l'index, un agent peut parcourir les partages et repérer les liens « tout le monde », les groupes obsolètes et les dossiers sensibles trop ouverts. Il propose ensuite les corrections à un humain. Une fois le RAG en ligne, un autre agent le teste en continu avec des comptes aux droits limités. Il signale chaque réponse qui cite un document hors périmètre. On décrit cette approche dans notre offre [Agents IA pour durcir produit et SI](/fr/agents-ia-securite-produit).

## Le cas LocService : des documents, mais aussi le vrai dossier client

[LocService](/fr/case-studies/locservice) est une plateforme de location immobilière entre particuliers dont le support traite plusieurs centaines de tickets par jour. On a construit un assistant qui lit tous leurs anciens tickets et leur documentation interne pour rédiger la réponse à chaque nouveau ticket. La réponse est adaptée au profil et à l'historique du client. Les brouillons sont utilisés sur 87 % des tickets, et l'équipe support reste maître de ce qui part.

Deux leçons valent pour tout RAG d'entreprise.

**Les documents ne suffisent pas.** L'assistant est aussi connecté aux API internes de LocService pour récupérer le vrai contexte du client. Une réponse juste en général peut être fausse pour ce client-là. Le RAG apporte la connaissance de l'entreprise, l'API apporte l'état du dossier.

**Les règles métier comptent autant que la recherche.** La même question n'appelle pas la même réponse selon le type de client. Des règles de classification identifient le cas avant la rédaction. On raconte le projet en détail dans [Agent IA pour le support client](/fr/resources/articles/agent-ia-support-client).

## Mesurer la qualité avant la mise en production

Un RAG se teste en deux étages, séparément.

1. **La recherche.** Sur un jeu de vraies questions, avec pour chacune le document qui contient la réponse, on vérifie que le bon passage remonte dans les premiers résultats. Anthropic mesure ainsi la part des passages pertinents ratés dans les 20 premiers.
2. **La réponse.** Sur les mêmes questions, on vérifie que la réponse est juste et qu'elle cite la bonne source. Quand la réponse n'est pas dans les documents, elle doit dire « je ne sais pas ».

En production, on suit un indicateur simple : la part des réponses réellement utilisées par les équipes. Chez LocService, c'est 87 % des brouillons. On détaille les autres points à vérifier dans notre [checklist du POC à la production](/fr/resources/articles/poc-agent-ia-production).

## Outil du marché ou RAG sur mesure ?

Si vos documents sont dans Microsoft 365 ou Google Workspace et que les questions sont générales, un assistant du marché avec ses connecteurs peut suffire. On compare les offres dans [ChatGPT en entreprise](/fr/resources/articles/chatgpt-entreprise).

Le sur-mesure se justifie quand la bonne réponse dépend de vos systèmes internes, de règles métier ou de droits fins. Ou quand les données ne doivent pas quitter votre infrastructure. Pour les données de santé, l'hébergement doit être certifié HDS. On explique ce cadre dans [IA et données de santé : ce que l'HDS impose vraiment](/fr/resources/articles/ia-donnees-de-sante-hds).

Pour l'auto-hébergement, notre moteur de recherche open source [Quivr](/fr/portfolio/quivr) combine recherche par mots-clés et par vecteurs, montre le passage exact et s'expose aux agents via MCP. Il tourne sur vos serveurs. Il est encore en phase d'évaluation, avec une API qui peut changer.

## Par où commencer

1. Choisir une question métier précise et fréquente, pas « tous nos documents ».
2. Inventorier les sources qui y répondent, avec leurs propriétaires et leurs droits.
3. Nettoyer et dater ces sources avant de les indexer.
4. Écrire 50 à 100 vraies questions avec leur document de référence.
5. Lancer avec des utilisateurs pilotes, mesurer la recherche, la réponse et le taux d'utilisation, puis élargir.

## FAQ

### Quelle différence entre RAG et fine-tuning ?

Le fine-tuning modifie le modèle lui-même, utile pour un ton, un format ou une tâche répétitive. Le RAG laisse le modèle tel quel et lui fournit vos documents à chaque question. Pour une connaissance qui change souvent et qu'il faut pouvoir citer, le RAG est presque toujours le bon choix.

### Le RAG supprime-t-il les hallucinations ?

Il les réduit, sans les supprimer. Un modèle peut mal lire un passage ou combler un vide. D'où l'importance des citations, de la consigne « je ne sais pas » et d'un jeu de tests sur vos vraies questions.

### Nos documents partent-ils chez le fournisseur du modèle ?

Les passages retrouvés sont envoyés au modèle à chaque question. Vérifiez la rétention, le non-entraînement et la localisation au niveau du contrat applicable, ou utilisez un modèle hébergé dans votre infrastructure.

### Faut-il une base vectorielle dédiée ?

Pas forcément. PostgreSQL avec une extension comme [pgvector](https://github.com/pgvector/pgvector) suffit pour beaucoup de projets. Le choix compte moins que la qualité des documents, la recherche hybride et le filtrage par droits.

### RAG ou mémoire d'agent : quelle différence ?

Le RAG va chercher des passages dans vos documents au moment de la question. Une mémoire d'agent garde ce que l'agent a appris en travaillant : la préférence d'un client, une décision prise la semaine dernière, l'état d'un dossier. Pour répondre à partir d'une documentation, le RAG suffit souvent. Dès que l'agent doit suivre un travail dans la durée, il lui faut aussi une mémoire qu'une personne peut relire et corriger. On détaille les briques d'un agent, mémoire comprise, dans notre [guide de l'agent IA en entreprise](/fr/resources/articles/agent-ia-entreprise).

## Connecter l'IA à vos documents

The Vibe Company est une agence IA à Paris. On conçoit des RAG et des agents branchés sur vos documents et vos outils, avec les droits d'accès de votre entreprise et des réponses qui citent leurs sources.

[Réserver un échange sur votre projet RAG →](https://cal.com/stangirard/thevibecompany)

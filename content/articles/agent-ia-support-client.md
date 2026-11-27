---
title: "Agent IA service client : des brouillons que l'équipe envoie"
seoTitle: "Agent IA service client : des brouillons que l'équipe envoie"
slug: agent-ia-support-client
translationKey: ai-customer-support-agent
language: fr
summary: "Automatiser le support client avec l'IA sans perdre la qualité : cas LocService (87 % des tickets), Klarna et Air Canada."
seoDescription: "Un agent IA service client peut répondre seul ou préparer des brouillons relus par l'équipe. Chez LocService, ils sont utilisés sur 87 % des tickets."
publishedAt: 2026-10-15
dateModified: 2026-11-27
complexity: intermediate
topics: AI Agents, AI Adoption, AI Operations
author: stan-girard
coverImage: /images/resources/agent-ia-support-client/cover-mascotte-v3.webp
coverAlt: "La mascotte prépare une réponse qu'une conseillère support valide avant son envoi par un tube pneumatique"
ogImage: /images/resources/agent-ia-support-client/cover-mascotte-v3.webp
---

Un agent IA service client est un logiciel qui lit la demande d'un client, récupère le contexte utile et rédige la réponse. Il en existe deux sortes. La première envoie seule. La seconde prépare un brouillon qu'une personne de l'équipe relit, puis envoie. Pour automatiser le service client sans le dégrader, commencez par la seconde.

Le service client est souvent le premier endroit où une entreprise veut mettre de l'IA. Les questions se répètent, et le coût se lit dans le nombre de personnes à recruter quand l'activité grossit.

C'est aussi l'endroit où une erreur de l'IA se voit tout de suite. Elle part chez un client, avec votre nom dessus.

Chez [The Vibe Company](https://www.thevibecompany.co/fr), [agence IA native](/fr/resources/articles/agence-ia-native) fondée à Paris en 2024 et passée par Y Combinator (W24), on a construit pour [LocService](https://www.thevibecompany.co/fr/case-studies/locservice) un assistant qui rédige les réponses du support. L'équipe utilise ses brouillons sur 87 % des tickets. Il n'a jamais envoyé une réponse seul. La suite s'appuie sur ce projet et sur les chiffres publics pour dire quels tickets confier à un agent, et dans quel ordre.

## Agent IA service client : qui envoie la réponse, l'IA ou une personne ?

Soit l'IA envoie seule, soit elle rédige et un conseiller envoie. Le nom d'« agent IA service client » couvre ces deux fonctionnements, et tout le reste découle de ce choix.

**1. Le chatbot autonome.** L'IA répond directement au client, sans relecture. C'est ce que vendent la plupart des éditeurs en tête des résultats Google. Ça marche bien sur des questions simples et fermées (suivi de commande, horaires, mot de passe).

**2. L'agent qui prépare, l'humain qui envoie.** L'IA lit le ticket, va chercher le contexte, rédige une réponse. Un conseiller du support la relit, la corrige si besoin, puis l'envoie. C'est ce qu'on a construit chez LocService.

| | Chatbot autonome | Brouillons validés |
| --- | --- | --- |
| Qui envoie la réponse | l'IA | un agent du support |
| Risque d'erreur visible par le client | élevé | faible : l'erreur est corrigée avant envoi |
| Gain mesuré | tickets fermés sans humain | temps gagné par ticket, part des brouillons utilisés |
| Bon point de départ pour | questions simples et répétitives | questions qui dépendent du dossier du client |
| Ce qu'il faut absolument prévoir | un passage facile vers un humain | une interface de relecture rapide |

Les deux ne s'excluent pas, mais l'ordre compte. Commencer par des brouillons validés permet de mesurer la qualité de l'IA sur vos vrais tickets avant de la laisser parler seule.

Le mode brouillon a un autre effet, utile si un essai vous inquiète. Vos clients ne le voient jamais. Un brouillon que personne n'envoie reste invisible hors de votre équipe. Vous pouvez donc faire tourner l'agent sur vos vrais tickets aussi longtemps qu'il le faut, et ses mauvais jours restent en interne. On peut ainsi [mettre un agent IA en production](/fr/agents-ia-production) avant de lui confier le moindre envoi.

Hors du service client, la frontière se trace autrement : voir [la différence entre chatbot et agent IA](/fr/resources/articles/chatbot-vs-agent-ia).

## Quels tickets confier à un agent IA ?

Les questions simples et fermées peuvent aller à un agent autonome. Celles qui dépendent du dossier du client passent en brouillon, et les cas sensibles restent à une personne.

Pour savoir où tombent les vôtres, exportez quelques centaines de tickets récents et faites trois piles.

- **Les questions simples.** Une seule bonne réponse, quel que soit le client : suivi de commande, horaires, mot de passe.
- **Les questions qui dépendent du dossier.** La bonne réponse change avec le client et l'état de son dossier. L'agent a besoin de ce contexte, et un conseiller relit.
- **Les cas sensibles.** Litige, paiement, données personnelles. Vous voulez une personne dessus, quoi qu'il arrive.

Ce tri passe avant le choix d'un outil. Il vous dit quelle part de votre volume un agent autonome pourrait traiter, et quelle part demande le dossier du client. Sans lui, vous choisissez un produit pour des tickets que vous n'avez pas regardés.

## Que disent les chiffres publics sur l'IA au service client ?

Ils vont dans le sens du modèle assisté. L'IA aide surtout les débutants, et les clients tiennent à pouvoir joindre quelqu'un.

**L'IA aide d'abord vos agents les moins expérimentés.** L'une des études les plus citées sur le sujet porte sur 5 179 agents du support d'une entreprise de logiciels ([Brynjolfsson, Li et Raymond, NBER](https://www.nber.org/papers/w31161)). Avec un assistant d'IA générative qui leur suggère des réponses, ils ont résolu 14 % de tickets en plus par heure en moyenne, et 34 % de plus pour les débutants. Les plus expérimentés gagnaient peu. C'est le modèle « brouillon + humain » : l'IA transmet le savoir de l'équipe à ceux qui viennent d'arriver.

**Les clients veulent pouvoir parler à quelqu'un.** Dans une enquête [Gartner](https://www.gartner.com/en/newsroom/press-releases/2024-07-09-gartner-survey-finds-64-percent-of-customers-would-prefer-that-companies-didnt-use-ai-for-customer-service) menée fin 2023 auprès de 5 728 clients, 64 % préféraient que les entreprises n'utilisent pas d'IA dans leur service client. Leur première crainte : avoir plus de mal à joindre un humain.

**Tout automatiser a ses limites.** En février 2024, [Klarna](https://www.klarna.com/international/press/klarna-ai-assistant-handles-two-thirds-of-customer-service-chats-in-its-first-month/) annonçait que son assistant gérait deux tiers des conversations du service client, l'équivalent de 700 agents. En mai 2025, l'entreprise recrutait de nouveau des humains pour que ses clients puissent toujours parler à une personne ([CX Dive](https://www.customerexperiencedive.com/news/klarna-reinvests-human-talent-customer-service-AI-chatbot/747586/), d'après une interview du PDG à Bloomberg).

**Vous êtes responsable de ce que dit votre IA.** En 2024, un tribunal canadien a condamné Air Canada : son chatbot avait donné à un client une mauvaise information sur un tarif ([Business Law Today](https://businesslawtoday.org/2024/02/bc-tribunal-confirms-companies-remain-liable-for-information-provided-by-ai-chatbot/)). L'argument « c'est le chatbot qui s'est trompé » n'a pas tenu.

**L'AI Act impose de le dire.** Depuis le 2 août 2026, l'[article 50 de l'AI Act](https://artificialintelligenceact.eu/article/50/) oblige les systèmes d'IA qui échangent directement avec des personnes à les informer qu'elles parlent à une IA, sauf si c'est évident. Un chatbot autonome est concerné. Des brouillons relus et envoyés par vos agents posent moins cette question, mais faites valider votre cas par votre juriste.

## Pourquoi les brouillons servent-ils sur 87 % des tickets chez LocService ?

Parce que l'assistant part du vrai dossier du client et de règles qui reconnaissent le cas avant de rédiger.

LocService est une plateforme de location immobilière entre particuliers. Son support reçoit plusieurs centaines de tickets par jour.

On a construit un assistant qui lit tous leurs anciens tickets et leur documentation interne, puis rédige la réponse à chaque nouveau ticket. La réponse est adaptée au profil et à l'historique du client. L'équipe garde la décision d'envoyer. Trois choix ont fait la différence.

**Le vrai contexte client.** L'assistant est connecté aux API internes de LocService. Il sait de quel client il s'agit et où en est son dossier. Une FAQ seule lui ferait répondre « en général ».

**Des règles de classification.** La même question n'appelle pas la même réponse selon le type de client. On a écrit des règles pour que l'assistant reconnaisse le cas avant de rédiger. Le travail est peu spectaculaire, et il rend les réponses justes.

**Une mesure simple : le brouillon est-il utilisé ?** Le chiffre vient du travail de l'équipe, ticket après ticket, sans jeu de test choisi à l'avance. Utilisé ne veut pas dire intact. Le conseiller corrige le brouillon quand il le faut. Aujourd'hui, nos brouillons sont utilisés sur 87 % des tickets.

## Par où commencer pour automatiser le service client ?

Par vos tickets, avant tout choix d'outil. L'ordre tient en cinq étapes.

1. **Triez vos tickets.** Reprenez les trois piles : questions simples, questions qui dépendent du dossier, cas sensibles. Vous savez alors ce qui peut être automatisé, et ce qui ne doit pas l'être.
2. **Branchez le contexte.** Historique client, statut du dossier, documentation interne à jour. Sans ça, l'IA invente ou reste vague.
3. **Commencez en brouillon.** Un conseiller relit chaque réponse. Vous mesurez la part de brouillons envoyés tels quels, modifiés ou jetés.
4. **Écrivez les règles métier noir sur blanc.** Quels types de clients, quelles exceptions, quand escalader. Ces règles servent à l'IA et à vos nouvelles recrues.
5. **N'élargissez qu'avec des chiffres.** Une catégorie de tickets où presque tous les brouillons partent sans modification peut, peut-être, passer en réponse automatique. Gardez toujours un chemin simple vers un humain, et dites au client quand il parle à une IA.

Notre [checklist du POC à la production](https://www.thevibecompany.co/fr/resources/articles/poc-agent-ia-production) détaille l'étape suivante.

## Faut-il acheter un outil ou faire construire ?

Un outil du marché peut suffire si vos questions sont simples et que vos données tiennent dans une base de connaissances. Faire construire a du sens quand la bonne réponse dépend de vos systèmes internes.

Zendesk, Intercom, HubSpot et d'autres vendent ces outils. Testez-en un sur vos vrais tickets avant de signer.

Le sur-mesure se justifie aussi par des règles métier propres à votre activité, ou quand vous voulez garder la main sur les données et les règles. LocService était dans ce cas. Pour comparer les options, on a écrit un guide pour [choisir entre agence IA, ESN, freelance ou équipe interne](https://www.thevibecompany.co/fr/resources/articles/choisir-agence-ia-esn-freelance).

## Qui est The Vibe Company ?

The Vibe Company a été fondée en 2024 par Stan Girard et Antoine Dewez (ex-Theodo, ex-Stockly), passée par Y Combinator (W24), avec 1,7 M$ levés. On a livré des dizaines de projets, dont LocService en support client, [Monka](https://www.thevibecompany.co/fr/case-studies/monka) en santé et MediaGen avec l'[AFP](https://www.thevibecompany.co/fr/case-studies/afp) dans le cadre de France 2030.

On part de vos données réelles, et on mesure l'usage au quotidien.

Pour la vue d'ensemble (outils, mémoire, autorité, mesure), lisez notre [guide de l'agent IA en entreprise](https://www.thevibecompany.co/fr/resources/articles/agent-ia-entreprise).

Sur la partie documents (recherche, sources citées, droits d'accès), voir [RAG en entreprise : connecter l'IA à vos documents](/fr/resources/articles/rag-entreprise).

## FAQ

### Qu'est-ce qu'un agent IA pour le service client ?

Un agent IA pour le service client lit la demande d'un client, va chercher le contexte dont il a besoin et écrit une réponse. Certains agents l'envoient eux-mêmes. D'autres la préparent pour un conseiller, qui la relit et l'envoie. L'assistant construit par The Vibe Company pour LocService est du second type : une personne envoie chaque réponse.

### Un agent IA peut-il remplacer mon équipe support ?

Un agent IA ne remplace pas l'équipe support sur les cas qui dépendent du dossier du client ou qui demandent du jugement. Sur ces tickets, l'IA fait gagner du temps à l'équipe. Klarna, dont l'assistant gérait deux tiers des conversations en février 2024, recrutait de nouveau des humains en mai 2025.

### Peut-on utiliser ChatGPT pour le service client ?

Oui, un assistant généraliste comme ChatGPT peut aider à rédiger des réponses, à condition qu'une personne relise chacune avant l'envoi. Chez LocService, la justesse des brouillons vient du vrai contexte client, tiré des systèmes internes, et de règles qui reconnaissent le cas avant la rédaction. Quel que soit l'outil, vérifiez qu'il peut voir le dossier du client et suivre vos règles.

### Combien de tickets faut-il pour démarrer ?

Il n'y a pas de seuil officiel pour lancer un agent IA au service client. Ce qui compte, c'est d'avoir un historique de tickets et de réponses sur lequel l'IA peut s'appuyer, et une documentation à jour. Chez LocService, l'assistant lit tous les anciens tickets.

### Quels chiffres suivre pour mesurer si ça marche ?

Suivez la part des brouillons envoyés sans modification, modifiés ou rejetés, le temps moyen par ticket et la satisfaction client. Une seule métrique de précision sur un test ne suffit pas.

### Faut-il dire au client qu'une IA a rédigé la réponse ?

Si l'IA échange directement avec le client, l'article 50 de l'AI Act l'impose depuis le 2 août 2026, sauf si c'est évident. Si un humain relit et envoie, la situation est différente. Vérifiez votre cas avec votre juriste.

## Vous voulez tester un agent IA sur vos tickets ?

Venez avec un export de tickets et vos contraintes. On vous dit ce qui se prête à des brouillons, ce qui peut être automatisé, et ce qui doit rester humain.

[Réservez 30 minutes avec Stan](https://cal.com/stangirard/thevibecompany).

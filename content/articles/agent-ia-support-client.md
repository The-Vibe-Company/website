---
title: "Agent IA pour le support client : automatiser sans dégrader le service"
seoTitle: "Agent IA support client : automatiser | The Vibe Company"
slug: agent-ia-support-client
translationKey: ai-customer-support-agent
language: fr
summary: "Chatbot autonome ou brouillons validés par vos agents ? Comment automatiser le support client avec l'IA sans perdre la qualité, avec le cas LocService (87 % des tickets) et les leçons de Klarna et Air Canada."
publishedAt: 2026-10-15
complexity: intermediate
topics: AI Agents, AI Adoption, AI Operations
coverImage: /images/resources/agent-ia-support-client/cover-mascotte-v3.webp
coverAlt: "La mascotte prépare une réponse qu'une conseillère support valide avant son envoi par un tube pneumatique"
ogImage: /images/resources/agent-ia-support-client/cover-mascotte-v3.webp
---

Le support client est souvent le premier endroit où une entreprise veut mettre de l'IA. Le volume est là, les questions se répètent, et le coût se lit dans le nombre de personnes à recruter quand l'activité grossit.

C'est aussi l'endroit où une erreur de l'IA se voit tout de suite. Elle part chez un client, avec votre nom dessus.

Chez [The Vibe Company](https://www.thevibecompany.co/fr), agence IA native fondée à Paris en 2024 et passée par Y Combinator (W24), on a construit pour [LocService](https://www.thevibecompany.co/fr/case-studies/locservice) un assistant qui rédige les réponses du support. Les brouillons sont utilisés sur 87 % des tickets. Voici ce qu'on a appris, et la méthode qu'on recommande avant d'automatiser votre support.

## Deux façons d'automatiser le support avec l'IA

Quand on parle d'« agent IA service client », on mélange deux choses très différentes.

**1. Le chatbot autonome.** L'IA répond directement au client, sans relecture. C'est ce que vendent la plupart des éditeurs en tête des résultats Google. Ça marche bien sur des questions simples et fermées (suivi de commande, horaires, mot de passe).

**2. L'agent qui prépare, l'humain qui envoie.** L'IA lit le ticket, va chercher le contexte, rédige une réponse. Un agent du support la relit, la corrige si besoin, puis l'envoie. C'est ce qu'on a construit chez LocService.

| | Chatbot autonome | Brouillons validés |
| --- | --- | --- |
| Qui envoie la réponse | l'IA | un agent du support |
| Risque d'erreur visible par le client | élevé | faible : l'erreur est corrigée avant envoi |
| Gain mesuré | tickets fermés sans humain | temps gagné par ticket, part des brouillons utilisés |
| Bon point de départ pour | questions simples et répétitives | questions qui dépendent du dossier du client |
| Ce qu'il faut absolument prévoir | un passage facile vers un humain | une interface de relecture rapide |

Les deux ne s'excluent pas. Mais l'ordre compte. Commencer par des brouillons validés permet de mesurer la qualité de l'IA sur vos vrais tickets avant de la laisser parler seule.

## Ce que les chiffres publics disent vraiment

**L'IA aide d'abord vos agents les moins expérimentés.** L'une des études les plus citées sur le sujet porte sur 5 179 agents du support d'une entreprise de logiciels ([Brynjolfsson, Li et Raymond, NBER](https://www.nber.org/papers/w31161)). Avec un assistant d'IA générative qui leur suggère des réponses, ils ont résolu 14 % de tickets en plus par heure en moyenne, et 34 % de plus pour les débutants. Les plus expérimentés gagnaient peu. C'est exactement le modèle « brouillon + humain » : l'IA transmet le savoir de l'équipe à ceux qui viennent d'arriver.

**Les clients veulent pouvoir parler à quelqu'un.** Dans une enquête [Gartner](https://www.gartner.com/en/newsroom/press-releases/2024-07-09-gartner-survey-finds-64-percent-of-customers-would-prefer-that-companies-didnt-use-ai-for-customer-service) menée fin 2023 auprès de 5 728 clients, 64 % préféraient que les entreprises n'utilisent pas d'IA dans leur service client. Leur première crainte : avoir plus de mal à joindre un humain.

**Tout automatiser a ses limites.** En février 2024, [Klarna](https://www.klarna.com/international/press/klarna-ai-assistant-handles-two-thirds-of-customer-service-chats-in-its-first-month/) annonçait que son assistant gérait deux tiers des conversations du service client, l'équivalent de 700 agents. En mai 2025, l'entreprise recrutait de nouveau des humains pour que ses clients puissent toujours parler à une personne ([CX Dive](https://www.customerexperiencedive.com/news/klarna-reinvests-human-talent-customer-service-AI-chatbot/747586/), d'après une interview du PDG à Bloomberg).

**Vous êtes responsable de ce que dit votre IA.** En 2024, un tribunal canadien a condamné Air Canada : son chatbot avait donné à un client une mauvaise information sur un tarif ([Business Law Today](https://businesslawtoday.org/2024/02/bc-tribunal-confirms-companies-remain-liable-for-information-provided-by-ai-chatbot/)). L'argument « c'est le chatbot qui s'est trompé » n'a pas tenu.

**L'AI Act impose de le dire.** Depuis le 2 août 2026, l'[article 50 de l'AI Act](https://artificialintelligenceact.eu/article/50/) oblige les systèmes d'IA qui échangent directement avec des personnes à les informer qu'elles parlent à une IA, sauf si c'est évident. Un chatbot autonome est concerné. Des brouillons relus et envoyés par vos agents posent moins cette question, mais faites valider votre cas par votre juriste.

## Le cas LocService : 87 % des tickets avec un brouillon IA

LocService est une plateforme de location immobilière entre particuliers. Son support reçoit plusieurs centaines de tickets par jour.

On a construit un assistant qui lit tous leurs anciens tickets et leur documentation interne, puis rédige la réponse à chaque nouveau ticket. La réponse est adaptée au profil et à l'historique du client. Trois choix ont fait la différence.

**Le vrai contexte client, pas seulement une FAQ.** L'assistant est connecté aux API internes de LocService. Il ne répond pas « en général » : il sait de quel client il s'agit et où en est son dossier. La plupart des mauvaises réponses d'IA viennent d'un manque de contexte, pas d'un mauvais modèle.

**Des règles de classification.** La même question n'appelle pas la même réponse selon le type de client. On a écrit des règles pour que l'assistant reconnaisse le cas avant de rédiger. C'est moins spectaculaire qu'un prompt magique, mais c'est ce qui rend les réponses justes.

**Une mesure simple : le brouillon est-il utilisé ?** On ne juge pas l'assistant sur un test choisi à l'avance. On regarde ce que fait l'équipe au quotidien. Aujourd'hui, nos brouillons sont utilisés sur 87 % des tickets.

## La méthode qu'on recommande

1. **Partez de vos tickets, pas d'un outil.** Exportez quelques centaines de tickets récents et classez-les : questions simples, questions qui dépendent du dossier, cas sensibles (litige, paiement, données personnelles). Vous savez alors ce qui peut être automatisé, et ce qui ne doit pas l'être.
2. **Branchez le contexte.** Historique client, statut du dossier, documentation interne à jour. Sans ça, l'IA invente ou reste vague.
3. **Commencez en brouillon.** L'agent du support relit chaque réponse. Vous mesurez la part de brouillons envoyés tels quels, modifiés ou jetés.
4. **Écrivez les règles métier noir sur blanc.** Quels types de clients, quelles exceptions, quand escalader. Ces règles servent à l'IA et à vos nouvelles recrues.
5. **N'élargissez qu'avec des chiffres.** Une catégorie de tickets où presque tous les brouillons partent sans modification peut, peut-être, passer en réponse automatique. Gardez toujours un chemin simple vers un humain, et dites au client quand il parle à une IA.

Pour aller plus loin sur le passage en production, lisez notre [checklist du POC à la production](https://www.thevibecompany.co/fr/resources/articles/poc-agent-ia-production).

## Acheter un outil ou faire construire ?

Si vos questions sont simples et que vos données tiennent dans une base de connaissances, un outil du marché (Zendesk, Intercom, HubSpot et d'autres) peut suffire. Testez-le sur vos vrais tickets avant de signer.

Faire construire a du sens quand la bonne réponse dépend de vos systèmes internes, de règles métier propres à votre activité, ou quand vous voulez garder la main sur les données et les règles. C'est le cas de LocService. Pour comparer les options, on a écrit un guide pour [choisir entre agence IA, ESN, freelance ou équipe interne](https://www.thevibecompany.co/fr/resources/articles/choisir-agence-ia-esn-freelance).

## Pourquoi The Vibe Company

The Vibe Company a été fondée en 2024 par Stan Girard et Antoine Dewez (ex-Theodo, ex-Stockly), passée par Y Combinator (W24), avec 1,7 M$ levés. On a livré des dizaines de projets, dont LocService en support client, [Monka](https://www.thevibecompany.co/fr/case-studies/monka) en santé et MediaGen avec l'[AFP](https://www.thevibecompany.co/fr/case-studies/afp) dans le cadre de France 2030.

Notre façon de faire : partir de vos données réelles, livrer vite quelque chose que vos équipes utilisent, et mesurer l'usage plutôt que la démo.

Pour la vue d'ensemble (outils, mémoire, autorité, mesure), lisez notre [guide de l'agent IA en entreprise](https://www.thevibecompany.co/fr/resources/articles/agent-ia-entreprise).

## FAQ

**Un agent IA peut-il remplacer mon équipe support ?**
Pas sur les cas qui dépendent du dossier du client ou qui demandent du jugement. Sur ces tickets, l'IA fait gagner du temps à l'équipe. Klarna, qui avait misé sur l'automatisation complète, a fini par réembaucher des humains.

**Combien de tickets faut-il pour démarrer ?**
Il n'y a pas de seuil officiel. Ce qui compte, c'est d'avoir un historique de tickets et de réponses sur lequel l'IA peut s'appuyer, et une documentation à jour. Chez LocService, l'assistant lit tous les anciens tickets.

**Comment mesurer si ça marche ?**
Suivez la part des brouillons envoyés sans modification, modifiés ou rejetés, le temps moyen par ticket et la satisfaction client. Une seule métrique de précision sur un test ne suffit pas.

**Faut-il dire au client qu'une IA a rédigé la réponse ?**
Si l'IA échange directement avec le client, l'article 50 de l'AI Act l'impose depuis le 2 août 2026, sauf si c'est évident. Si un humain relit et envoie, la situation est différente. Vérifiez votre cas avec votre juriste.

## Parlons de votre support

Vous recevez des centaines de tickets et vous voulez savoir ce que l'IA peut vraiment prendre en charge ? Venez avec un export de tickets et vos contraintes. On vous dit ce qui se prête à des brouillons, ce qui peut être automatisé, et ce qui doit rester humain.

[Réservez 30 minutes avec Stan](https://cal.com/stangirard/thevibecompany).

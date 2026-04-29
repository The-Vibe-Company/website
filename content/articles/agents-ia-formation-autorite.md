---
title: "Le vrai sujet avec les agents IA, c'est la formation"
slug: agents-ia-formation-autorite
language: fr
summary: "Les contrats enterprise ont rendu la sécurité des données beaucoup plus mature. Le vrai risque arrive quand une équipe donne à un agent le droit d'envoyer, supprimer, modifier ou déployer sans comprendre la frontière."
publishedAt: 2026-04-29
complexity: intermediate
topics: AI Agents, AI Adoption, Security
coverImage: /images/resources/agents-ia-formation-autorite/cover-tvc.png
coverAlt: "Une table de travail montre quatre niveaux d'autorité pour les agents IA : lire, proposer, préparer et exécuter"
ogImage: /images/resources/agents-ia-formation-autorite/cover-og.png
---

Une équipe veut gagner du temps. Quelqu'un branche un agent IA à la boîte mail partagée. Au début, l'agent lit les messages entrants, résume les demandes et prépare des réponses. C'est utile, concret, et personne n'a l'impression de faire quelque chose de dangereux.

Puis l'équipe ajoute une petite option : envoyer automatiquement les réponses simples. Le changement paraît minuscule. En réalité, il vient de franchir une frontière de sécurité. Entre "préparer une réponse" et "envoyer une réponse", ce n'est pas le même système. Dans le premier cas, l'IA aide. Dans le second, elle agit.

C'est cette frontière que la plupart des politiques IA ne rendent pas encore assez claire.

## le faux débat : quel outil est safe ?

Quand une entreprise parle d'IA, la première question est souvent : "Est-ce que nos données sont sécurisées ?" La question est normale. Personne ne veut copier du code, des contrats, des exports client ou des informations internes dans un outil qui les réutilise n'importe comment.

Mais dans les offres enterprise des grands fournisseurs, ce sujet a beaucoup mûri. [OpenAI](https://openai.com/index/business-data/), [Anthropic](https://www.anthropic.com/enterprise), [Microsoft 365 Copilot](https://learn.microsoft.com/copilot/microsoft-365/microsoft-365-copilot-privacy), [GitHub Copilot](https://github.com/trust-center), [Google Workspace avec Gemini](https://support.google.com/a/answer/15706919) ou [Perplexity Enterprise](https://www.perplexity.ai/enterprise) ont tous intérêt à lever le frein sécurité, parce que leur adoption entreprise en dépend. Les mêmes briques reviennent partout : DPA, non-entraînement par défaut sur les données business, SSO, contrôles admin, rétention documentée, chiffrement, certifications, logs ou audit selon les plans.

Ce n'est pas une promesse vague. OpenAI documente que les données business ne sont pas utilisées par défaut pour entraîner ses modèles, Anthropic indique ne pas entraîner ses modèles sur les données Claude for Work, Microsoft précise que les prompts, réponses et données Microsoft Graph de Microsoft 365 Copilot ne servent pas à entraîner les LLMs de fondation, Google applique le même type d'engagement à Workspace Gemini, [GitHub distingue explicitement Copilot Business et Enterprise des usages grand public](https://github.blog/news-insights/company-news/updates-to-github-copilot-interaction-data-usage-policy/), et Perplexity affirme ne pas entraîner ses modèles sur les données des clients Enterprise. Les détails contractuels changent selon les plans, mais le mouvement de fond est clair : les leaders ont compris que l'adoption entreprise exigeait des garanties très fortes sur la donnée.

Il faut vérifier ces points. Il faut lire le contrat. Il faut regarder le plan exact, les sous-traitants, la rétention, la résidence des données et les cas réglementés. Mais entre leaders en contrat enterprise, la sécurité de la donnée devient une base de discussion. Ce n'est plus toujours le critère qui doit décider de tout.

Le mauvais choix, ce n'est pas d'adopter un outil puissant. Le mauvais choix, c'est d'adopter un outil sans former les gens au pouvoir qu'il donne.

## vous n'allez pas éviter les agents IA

Les équipes vont utiliser l'IA pour chercher, résumer, rédiger, coder, comparer, préparer des rendez-vous, relire des contrats, trier des tickets, comprendre des logs, mettre à jour de la documentation et générer des reportings. On peut essayer de tout réduire à un seul copilote officiellement autorisé. C'est rassurant sur une slide. Mais ce n'est pas toujours réaliste.

Tous les outils ne sont pas bons pour les mêmes usages. Certains sont meilleurs pour la bureautique, d'autres pour le code, la recherche, l'analyse documentaire ou l'automatisation entre outils. La bonne stratégie n'est donc pas de choisir l'outil qui markete le mieux la sécurité. C'est de choisir les meilleurs outils pour les bons usages, dans un cadre enterprise, puis de former les équipes à les utiliser correctement.

Il vaut mieux un très bon outil bien cadré qu'un outil moyen choisi parce qu'il donne une fausse impression de contrôle.

## un chatbot parle. un agent agit.

Le changement important n'est pas seulement l'arrivée de meilleurs modèles. Le changement important, c'est que les modèles sont maintenant connectés à des outils. Un agent peut lire un email, préparer une réponse, ouvrir une issue, mettre à jour un CRM, créer une pull request, modifier un document, appeler une API, lancer une commande, déployer, supprimer ou envoyer.

Un chatbot peut dire une bêtise. Un agent peut faire une bêtise.

Ce n'est pas une raison pour bloquer les agents. C'est une raison pour apprendre à les concevoir correctement. Le vrai sujet n'est pas "quel outil est autorisé ?" Le vrai sujet est : quel niveau d'autorité donne-t-on à cet outil ?

## la grille à enseigner : lire, proposer, préparer, exécuter

Une formation IA utile devrait enseigner une grille très simple.

| Niveau | Ce que fait l'agent | Exemple | Ce qu'il faut comprendre |
| --- | --- | --- | --- |
| Lire | Il cherche, résume, compare | Résumer un thread mail, analyser un ticket, lire une doc | Le sujet principal est la donnée et le contexte |
| Proposer | Il prépare une sortie sans l'appliquer | Brouillon d'email, diff de code, plan d'action | L'humain reste responsable de la décision |
| Préparer | Il met l'action au seuil de l'exécution | PR ouverte, email prêt à envoyer, changement CRM prêt à valider | La validation devient sérieuse |
| Exécuter | Il fait l'action | Envoyer, supprimer, merger, déployer, payer | Impact réel, donc garde-fous forts |

Cette grille est plus utile qu'une liste abstraite d'outils autorisés. Elle apprend aux équipes à voir quand elles changent de zone. Un agent qui lit des emails pour les résumer n'a pas le même niveau de risque qu'un agent qui envoie des emails. Un agent qui prépare une PR n'a pas le même niveau de risque qu'un agent qui merge. Un agent qui propose une mise à jour CRM n'a pas le même niveau de risque qu'un agent qui modifie le CRM tout seul.

La frontière importante n'est pas "IA ou pas IA". La frontière importante est "l'IA m'aide" ou "l'IA agit à ma place".

## les permissions comptent plus que le logo

Prenons l'exemple de la boîte mail. Un assistant qui lit les messages pour les résumer pose une question de confidentialité. Un assistant qui peut envoyer des réponses pose une question d'identité : il parle au nom de l'entreprise. Un assistant qui peut transférer pose une question d'exfiltration. Un assistant qui peut supprimer pose une question d'intégrité. Un assistant qui peut modifier les règles de forwarding pose une question de contrôle durable.

Google le montre très bien dans les [scopes de l'API Gmail](https://developers.google.com/workspace/gmail/api/auth/scopes) : lire, composer, envoyer, modifier et supprimer définitivement ne sont pas les mêmes permissions. OWASP donne aussi un nom à ce risque : [Excessive Agency](https://genai.owasp.org/llmrisk/llm062025-excessive-agency/). Le problème apparaît quand un agent dispose de plus de fonctionnalités, de permissions ou d'autonomie que nécessaire.

La leçon est simple : le risque ne monte pas parce que l'agent s'appelle [Claude Code](https://www.anthropic.com/product/claude-code), [OpenAI Codex](https://openai.com/codex), [Microsoft 365 Copilot](https://www.microsoft.com/microsoft-365/copilot) ou autre chose. Le risque monte quand on lui donne le droit d'agir trop largement. Un outil moyen avec beaucoup de permissions peut être plus dangereux qu'un outil très puissant limité à lire et proposer.

## restreindre les outils ne suffit pas

Limiter les outils autorisés est utile. Cela évite les comptes personnels, les mauvais contrats et les intégrations douteuses. Mais ce n'est pas suffisant. Un outil autorisé peut être mal utilisé, et un outil puissant peut être utilisé de manière très sûre.

Tout dépend du cadre : les données utilisées, les connecteurs branchés, les permissions accordées, les actions irréversibles, les validations humaines, les logs. C'est exactement le sujet des [surfaces MCP](/resources/articles/mcp-servers-dont-just-expose-tools-they-encode-how-work-gets-done) : donner accès à un outil ne suffit pas. Il faut aussi transmettre la méthode, les limites, les étapes de revue et le goût opérationnel de l'entreprise.

La formation doit donc aller plus loin que "voici comment écrire un prompt". Elle doit apprendre aux équipes à construire des usages sûrs.

## ce qu'une formation IA devrait vraiment couvrir

Former à l'IA, ce n'est pas apprendre à écrire de meilleurs prompts. C'est apprendre à donner le bon niveau d'autorité à un outil très capable.

Une formation sérieuse devrait couvrir au moins dix choses :

1. La différence entre lire, proposer, préparer et exécuter.
2. Les données que l'on peut utiliser selon le cadre entreprise.
3. Les risques des connecteurs : mail, CRM, ticketing, repo, drive, cloud.
4. Les scopes et permissions.
5. Les actions irréversibles.
6. Les réflexes de validation humaine.
7. Comment tester un agent sur un cas simple.
8. Comment documenter ce qu'un agent a le droit de faire.
9. Quand demander l'avis de l'IT, de la sécurité ou du legal.
10. Comment éviter les automatisations qui marchent trop bien mais dépassent leur mandat.

Ce dernier point est important. Le danger ne vient pas toujours d'un agent qui échoue. Il vient parfois d'un agent qui marche assez bien pour qu'on lui donne trop vite l'étape suivante. D'abord il résume. Puis il prépare. Puis il envoie. Puis il modifie. Puis il décide.

La formation sert à mettre des mots sur ces paliers avant que les équipes ne les franchissent par confort.

## choisir les meilleurs outils, puis former

Chez The Vibe Company, nous ne pensons pas que la bonne approche soit de bloquer tous les outils ou de choisir un seul copilote par défaut. Les équipes auront besoin de plusieurs outils selon les usages : recherche, code, documentation, support, analyse, automatisation.

La question n'est pas de savoir quel outil gagne sur une slide de conformité. La question est de savoir quel outil produit le meilleur travail pour un usage donné, dans un cadre que l'entreprise comprend.

Notre rôle est d'aider les équipes à passer d'une politique IA abstraite à des usages concrets :

- choisir les bons outils pour les bons cas ;
- comprendre les usages réels ;
- définir les niveaux d'autorité ;
- former les équipes ;
- construire des agents utiles mais bornés ;
- garder la validation humaine au bon endroit.

Nous n'aidons pas les équipes à contourner l'IT ou la sécurité. Nous les aidons à utiliser les meilleurs outils sans perdre le contrôle.

## la bonne conclusion

Les agents IA vont devenir normaux dans le travail. Ils liront, proposeront, prépareront, automatiseront.

La bonne réponse n'est pas de faire peur aux équipes. Ce n'est pas non plus de tout bloquer ou de choisir l'outil le plus confortable politiquement. La bonne réponse est de choisir les bons outils, puis d'apprendre aux équipes les bonnes frontières.

L'enjeu n'est pas de choisir entre confiance et interdiction. L'enjeu est de former des équipes capables d'utiliser des agents puissants avec le bon niveau d'autorité.

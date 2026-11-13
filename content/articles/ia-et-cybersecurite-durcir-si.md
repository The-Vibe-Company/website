---
title: "IA et cybersécurité : durcir son SI avec une flotte d'agents"
seoTitle: "IA et cybersécurité : durcir son SI avec des agents"
seoDescription: "IA et cybersécurité : pourquoi une PME doit durcir son SI avec une flotte d'agents, veiller les CVE et garder un humain sur les règles critiques."
slug: ia-et-cybersecurite-durcir-si
translationKey: ai-cybersecurity-harden-it-agents
language: fr
summary: "Attaquer un site est devenu presque gratuit. Une PME doit donc lancer des agents sur ses CVE, et garder quelques fichiers de règles sous relecture humaine."
publishedAt: 2026-11-13
complexity: intermediate
topics: AI Agents, Security, AI Operations
coverImage: /images/resources/ia-et-cybersecurite-durcir-si/cover-mascotte.webp
coverAlt: "La mascotte The Vibe Company cadenasse un livre de règles devant une armoire de serveurs protégée par un bouclier"
ogImage: /images/resources/ia-et-cybersecurite-durcir-si/cover-mascotte.webp
---

Quand un dirigeant me lance sur le sujet IA et cybersécurité, je réponds par une hypothèse qui met mal à l'aise. Je prends un concurrent, je demande à un agent d'essayer de faire tomber son site, et je le laisse insister jour et nuit. Mon pronostic, mot pour mot : « normalement je vais y arriver je pense ».

Je n'ai aucune intention d'essayer, et je n'ai rien d'un spécialiste de l'attaque. Mais si je peux l'envisager sans compétence particulière, quelqu'un qui vous en veut vraiment le peut aussi.

Donc quand un dirigeant de PME me demande s'il doit lancer des agents pour durcir son SI, je réponds go. « De toute façon il faut le faire, y'a pas le choix. » Lancez une flotte d'agents qui renforce votre système d'information et surveille les CVE, ces failles publiées qui portent chacune un identifiant. Je ne connais pas de meilleur moyen de corriger aussi vite que d'autres attaquent. À une condition, dont on vous parle rarement. J'y viens.

## Attaquer ne coûte presque plus rien, et corriger doit aller aussi vite

Mon hypothèse repose sur deux choses qui ont changé cette année.

La première, c'est le prix. Au 13 novembre 2026, l'API officielle de DeepSeek facture son modèle rapide, hors heures de pointe, [0,15 dollar le million de tokens en entrée (hors cache) et 0,60 dollar en sortie](https://api-docs.deepseek.com/quick_start/pricing/). C'est un modèle officiel, que je cite seulement pour l'ordre de grandeur. À ce tarif, faire réfléchir une machine toute une nuit n'est plus une question de budget. IBM fait le même constat : quand un adversaire automatise ses étapes, [le coût et la complexité d'une attaque élaborée baissent nettement](https://www.ibm.com/think/x-force/2026-cost-of-a-data-breach-ai-adversaries-enterprise-risk).

La seconde, c'est la retenue des modèles. Je dis volontiers que Qwen 3.8 est « complètement sans restrictions ». C'est un raccourci. Le 17 août 2026, Alibaba a publié [Qwen3.8-27B en poids ouverts](https://www.alibabacloud.com/blog/alibaba-unveils-qwen3-8-27b-and-releases-weights-of-qwen3-8-flagship-model_603463), sous licence Apache 2.0, assez compact pour tourner sur du matériel grand public. Ce modèle officiel garde ses refus. Mais dès le 19 août, India Today rapportait qu'un tiers [en avait tiré une version qui retire une grande partie de ces refus](https://www.indiatoday.in/technology/news/story/china-qwen-ai-gets-uncensored-version-it-will-take-illegal-and-unethical-requests-from-users-2974856-2026-08-19) et tourne en local. Ce tiers dit en réserver l'accès aux chercheurs en sécurité. Il n'empêche : une fois les poids d'un modèle publiés, ses refus dépendent de celui qui le modifie.

Mettez cela à côté du 21 octobre. Ce jour-là, le projet PHP a publié [les correctifs de deux failles critiques](https://www.php.net/archive/2026.php#2026-10-21-5), qui permettent d'exécuter du code à distance sans authentification. Selon l'équipe, mettre à jour était le seul choix sûr. Dans l'après-midi, [les sites de plusieurs préfectures françaises étaient inaccessibles](https://www.franceinfo.fr/internet/securite-sur-internet/prefectures-medias-impots-pourquoi-de-nombreux-sites-internet-sont-inaccessibles-mercredi-apres-midi_8247511.html) à la demande de l'ANSSI, qui comptait plus de 600 000 serveurs utilisant ce composant en France. Ailleurs, [le gouvernement finlandais, le conseil d'Édimbourg et la BBC ont retiré des pages](https://www.bbc.co.uk/news/articles/cmly0lg3w5x2o).

Aucune de ces sources ne dit que ces organisations avaient été piratées. Elles ont coupé par précaution, le temps que le correctif arrive et soit appliqué.

Entre l'annonce d'une faille et votre mise à jour, il y a une fenêtre, et en face, attaquer ne demande plus d'être expert. Une préfecture a l'ANSSI pour lui dire de couper. Une PME a ce qu'elle a mis en place avant.

## L'agent qui défend votre SI peut aussi faire sauter une règle de sécurité

Reste la condition annoncée plus haut. Cette fois, le danger vient de votre propre camp.

Quand vous confiez du code à un agent, vous lui donnez des règles, par exemple toujours une authentification devant telle ressource. Ces règles, vous les écrivez dans des fichiers comme AGENTS.md ou CLAUDE.md.

Imaginez maintenant un agent qui bute sur une tâche. Ce qui le bloque, c'est justement la règle d'authentification. Alors il trouve une sortie : il modifie la règle. Si personne n'y prend garde à ce moment-là, vous vous retrouvez avec ce que j'appelle « une règle de sécu qui saute ».

Rien de spectaculaire là-dedans. Une ligne en moins dans un fichier de règles, et une tâche marquée comme terminée.

Et ça empire avec la taille. Plus il y a de code, plus un agent a d'occasions de buter, et moins un humain voit passer chaque modification.

La flotte que vous lancez pour vous protéger de l'agent d'en face peut donc ouvrir la porte elle-même, de l'intérieur et sans mauvaise intention. C'est un sujet voisin de [la sécurité des agents eux-mêmes](/fr/resources/articles/black-october-securite-agents-ia), sauf qu'ici l'agent se trompe tout seul, sans attaquant en face.

## IA et cybersécurité, lundi matin : des agents sur les CVE, un humain sur les règles

La consigne tient en deux gestes. Laissez les agents courir, et retirez-leur la main sur un petit nombre de fichiers.

Commencez par la veille. IBM a regardé où les organisations victimes d'une fuite de données avaient mis leurs agents. [50 % s'en servent pour la chasse aux menaces, la réponse et le confinement, 18 % seulement pour le scan et la gestion des vulnérabilités](https://www.ibm.com/think/x-force/2026-cost-of-a-data-breach-ai-adversaries-enterprise-risk). Les agents arrivent pendant l'incendie, beaucoup moins pour les travaux d'avant.

Faites l'inverse. Un premier agent tient l'inventaire de ce qui tourne chez vous, versions comprises. Il passe en premier parce que [l'alerte de Cybermalveillance.gouv.fr sur la faille PHP](https://www.cybermalveillance.gouv.fr/tous-nos-contenus/actualites/alerte-cyber-failles-de-securite-critiques-dans-php-202610) demandait aussi d'isoler puis de migrer les versions qui ne reçoivent plus de correctifs. On ne migre pas ce qu'on ignore posséder. Un deuxième agent lit les avis de sécurité chaque jour et les croise avec cet inventaire. Un troisième prépare la mise à jour et vous la soumet.

Le jour où une faille de cette taille tombe, vous relisez une correction déjà prête, au lieu de choisir entre couper votre site et croiser les doigts. C'est ce que j'appelle la vélocité. Le reste du chantier, des secrets aux droits d'accès, est dans l'article sur [la flotte d'agents qui durcit un SaaS](/fr/resources/articles/agents-ia-durcir-saas).

Ensuite, le garde-fou. Dressez la liste courte des fichiers dont dépend votre sécurité : la configuration de l'authentification, AGENTS.md, CLAUDE.md, tout ce qui dit aux agents ce qu'ils n'ont pas le droit de faire. Sur ces fichiers, un agent peut proposer une modification, et seul un humain la valide.

Tout le reste peut aller vite, justement parce que cette partie-là va lentement. Si vos agents ouvrent déjà des pull requests, confiez la surveillance de ces fichiers à [un agent de sécurité placé dans la CI](/fr/resources/articles/agent-securite-ci).

## L'agent qui tourne jour et nuit, autant que ce soit le vôtre

Revenez à mon hypothèse du début, l'agent qui insiste jour et nuit contre un site. Vous ne pouvez empêcher personne de le lancer. Vous pouvez faire passer le vôtre avant lui.

Dès lundi, ouvrez votre dépôt principal et cherchez deux choses : la date de la dernière modification de vos fichiers de règles, et le nom de la personne qui l'a relue. S'il n'y a pas de nom, vous savez par où commencer.

Si vous préférez cadrer cette flotte et ses garde-fous avec quelqu'un, c'est mon métier. [Prenez rendez-vous](https://cal.com/stangirard/thevibecompany) et je regarde avec vous par où commencer.

Les faits et les chiffres de cet article viennent des sources liées, lues le jour de sa publication, et l'exemple du concurrent reste une hypothèse.

## FAQ

### Comment l'IA change-t-elle la cybersécurité d'une PME ?

L'IA rend l'attaque moins chère et moins difficile : IBM constate que l'automatisation fait nettement baisser le coût et la complexité d'une attaque élaborée. Pour une PME, cela oblige à corriger les failles publiées plus vite qu'avant. Les agents IA servent aussi à cela, s'ils travaillent sur la veille et la correction avant l'incident.

### Peut-on laisser des agents durcir le SI tout seuls ?

Non, pas entièrement. Des agents peuvent surveiller les CVE et préparer les correctifs, mais un agent bloqué sur une tâche peut modifier la règle de sécurité qui le gêne. Les fichiers critiques, comme la configuration d'authentification, AGENTS.md ou CLAUDE.md, doivent donc passer par une relecture humaine avant toute modification.

### Par où commencer pour surveiller et corriger les CVE plus vite ?

Commencez par un inventaire à jour des logiciels et des versions qui tournent dans votre SI, tenu par un agent. Un autre agent compare chaque jour cet inventaire aux avis de sécurité publiés et prépare la mise à jour quand une CVE vous concerne. Pour la faille PHP d'octobre 2026, l'équipe PHP a indiqué que mettre à jour était le seul choix sûr. C'est donc la vitesse de correction qui fait la différence.

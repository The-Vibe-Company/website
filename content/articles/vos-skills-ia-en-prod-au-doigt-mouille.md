---
title: "Vos skills Claude Code partent en prod au doigt mouillé"
seoTitle: "Skill Claude Code : ils partent en prod au doigt mouillé"
seoDescription: "Vous améliorez un skill Claude Code au feeling, puis vous le diffusez. Voici comment mesurer s'il est vraiment meilleur, avant qu'il parte en prod."
slug: vos-skills-ia-en-prod-au-doigt-mouille
translationKey: claude-code-skills-ship-on-gut-feel
language: fr
summary: "Une nouvelle version de skill n'est pas meilleure parce que vous venez de la retoucher. Récit d'un test terrain et méthode pour mesurer avant de diffuser."
publishedAt: 2026-11-18
complexity: intermediate
topics: Skills, Evaluation, Claude Code, AI Adoption
author: stan-girard
coverImage: /images/resources/vos-skills-ia-en-prod-au-doigt-mouille/cover-mascotte.webp
coverAlt: "La mascotte The Vibe Company compare deux versions d'un skill sur un banc d'essai, avant de les laisser partir"
ogImage: /images/resources/vos-skills-ia-en-prod-au-doigt-mouille/cover-mascotte.webp
---

Quand vous retouchez un skill Claude Code, vous partez du principe que la nouvelle version est meilleure que l'ancienne, puisque vous venez de l'améliorer. Vous la poussez donc à toute l'équipe, et vous attendez de voir si quelqu'un se plaint.

J'ai un mot pour ça. Il m'a échappé début novembre, en réunion chez une ETI éditrice de logiciels que j'accompagne. On parlait des mises à jour d'un outil interne, et j'ai dit : « C'est plutôt du doigt mouillé, on pense que ça va améliorer les choses et après c'est les retours humains qui valident. »

Le doigt mouillé valide après coup, quand la version tourne déjà chez tout le monde. Or [les skills sont devenus le vrai levier, davantage que les prompts](/fr/resources/articles/les-skills), et un levier se mesure avant de se diffuser. Vous gardez des cas de côté, vous faites tourner l'ancienne version et la nouvelle dessus, des juges comparent les sorties, et la nouvelle ne part que si elle gagne.

Dans cette même ETI, un skill est passé par ce genre de mesure. Le résultat a montré ce qu'aucune relecture au feeling n'aurait pu voir.

## Quand un skill a été mesuré pour de bon, la nouvelle version n'a pas attrapé plus de défauts

Le point de départ est banal : 8 tickets sur 10 arrivaient en QA sans procédure de test. D'où un skill de fin de développement, chargé de mieux préparer chaque ticket avant la QA.

Début novembre, ce skill a eu droit à une vraie évaluation. Elle a porté sur des tickets pour lesquels la QA avait déjà rendu ses retours. Sur ce périmètre, le skill attrapait 40 à 45 % des défauts que la QA allait relever, avant même que le ticket lui arrive.

Joli chiffre. À la place de l'équipe, vous l'affichez au prochain comité et vous passez à la suite.

Sauf que le protocole avait un défaut, et qu'il se cachait du côté du témoin. Pour savoir ce qu'un skill apporte, vous comparez un travail fait avec lui et un travail fait sans. Ici, la condition « sans skill » recevait quand même une consigne du type « vérifie les pièges connus ». C'est une étape que les développeurs ne font pas d'habitude. Le skill se mesurait donc à un témoin irréalistement fort, un développeur plus soigneux que nature.

La deuxième surprise est celle que je retiens. L'évaluation comparait aussi la version 1.2 du skill à la 1.1, et la nouvelle n'a pas attrapé plus de défauts que l'ancienne. Ce qu'elle a amélioré se trouve ailleurs : ses procédures de test sont plus claires, plus faciles à exécuter pour la QA.

C'est un vrai progrès, et il porte sur la lisibilité. Côté détection, match nul.

## Pour savoir si un skill Claude Code est meilleur, faites jouer la nouvelle version contre l'ancienne

Tant qu'un skill n'existe pas, comparer « avec » et « sans » a du sens. Une fois qu'il est en place, la question utile devient de savoir si la nouvelle version bat l'ancienne.

La méthode que j'ai posée dans cette ETI pour y répondre, comme je l'ai dit en réunion, « n'a pas été non plus inventée du haut de notre chapeau ». Elle s'appuie sur [SkillOpt](https://github.com/microsoft/SkillOpt), une méthodologie publiée par Microsoft, qui traite le fichier de skill comme un artefact qu'on entraîne et qu'on valide. L'inverse, donc, d'un prompt qu'on rapièce au feeling.

Elle tient en quelques gestes, dans cet ordre.

1. Figez le modèle sur lequel tourne le skill.
2. Mettez de côté des cas réels, qui serviront de jeu d'évaluation.
3. Faites tourner l'ancienne version et la nouvelle sur ces mêmes cas.
4. Confiez les sorties à des juges, si possible en aveugle.
5. Gardez la modification seulement si elle gagne.

![Boucle d'évaluation d'un skill : cas de côté, ancienne version contre nouvelle, juge, puis on garde ou on refuse](/images/resources/vos-skills-ia-en-prod-au-doigt-mouille/eval-loop-480.png "On ne diffuse une nouvelle version que si elle gagne sur des cas gardés de côté.")

Le dernier geste est celui qui fait mal. Dans SkillOpt, une égalité vaut refus, et un texte qui fait plus propre ne suffit pas non plus. J'en ai détaillé la mécanique dans [un article en anglais sur la façon d'utiliser SkillOpt pour entraîner ses skills](/en/resources/articles/how-to-use-skillopt-to-train-agent-skills).

Pour que cette méthode soit là dès le premier jour, j'ai créé [Skill Creator](https://github.com/The-Vibe-Company/companion-skills/blob/main/skills/create-skill-tools/SKILL.md), un skill qui installe l'évaluation au moment où vous créez le vôtre. Un second, [Refine Skill](https://github.com/The-Vibe-Company/companion-skills/blob/main/skills/refine-skill-tools/SKILL.md), la réutilise à chaque itération.

Ce protocole a un effet secondaire que j'aime bien : il vous oblige à écrire, avant de lancer le test, ce que « gagner » veut dire. Reprenez la nouvelle version du skill de QA. Match nul sur les défauts attrapés, victoire sur la clarté des procédures. Selon le critère choisi au départ, c'est un refus ou une diffusion. Au doigt mouillé, c'était seulement « mieux », et chacun mettait ce qu'il voulait derrière le mot.

## Ce protocole ne s'installe pas tout seul, parce que personne n'a le temps

Rien de tout cela n'est compliqué. Il faut connaître le protocole, puis trouver le temps de l'installer, et c'est là que ça coince.

Je suis mal placé pour faire la leçon. Quelques jours après la réunion du doigt mouillé, dans une autre session, je me suis entendu dire : « Parce qu'il n'y a aucune mesure d'amélioration dessus. Ils font ça au doigt mouillé. Ils améliorent un truc, ils font ça au doigt mouillé. Mais je n'ai pas le temps. »

La dernière phrase est la plus honnête. Je connais la méthode, j'ai construit les skills qui l'installent, et ce jour-là le temps me manquait quand même. Alors imaginez les personnes qui ont la charge des skills en plus de leur vrai travail.

À la mi-novembre, dans cette ETI, une mise à jour de skill pouvait encore partir sans que rien ne la vérifie. L'objectif que j'ai fixé est un contrôle dans la CI. Dès que quelqu'un modifie un skill, la nouvelle version doit prouver qu'elle est meilleure que l'ancienne.

J'ai croisé le même réflexe sur le choix du modèle. Un jour, j'ai demandé à un développeur : « Pourquoi tu utilises Sonnet et pas Opus ». Il utilisait Claude depuis août, n'avait jamais eu la curiosité d'essayer Opus, et Sonnet l'avait toujours satisfait. Il n'avait donc rien comparé. Je vois d'autres équipes rester sur Sonnet en pensant gagner du temps, alors qu'Opus 5.5 fait très bien le travail.

Mesurer doit être le travail de quelqu'un, et c'est là que je place le consultant IA. Il sert à construire ce qui restera chez vous : les ressources internes, la politique, l'envie, les compétences. Le harnais d'évaluation en fait partie, et il se prévoit dès [le déploiement de Claude Code dans l'entreprise](/fr/resources/articles/deployer-claude-code-entreprise). L'équipe de build vient ensuite, quand il vous manque des ressources en interne pour construire ou qu'il faut aller plus vite. C'est d'autant plus vrai dans l'IA, où les écarts de niveau sont grands.

Revenez à votre prochaine retouche de skill. Avant de la diffuser, ouvrez le dépôt où vivent vos skills, ou [un hub de skills comme Skillpack](/fr/portfolio/skillpack) si c'est lui qui les partage à l'équipe. À côté du skill que votre équipe utilise le plus, posez un jeu d'évaluation : des cas réels mis de côté, et le critère qui dira si une version gagne. La version suivante jouera contre l'ancienne, et votre doigt restera au sec.

[Prenez rendez-vous](https://cal.com/stangirard/thevibecompany) si vous voulez installer cette méthode sur vos propres skills : je regarde avec vous comment poser le harnais et le contrôle en CI.

*Les résultats racontés ici viennent d'une évaluation menée début novembre 2026 sur les seuls tickets qui avaient déjà un retour de QA ; le gain sur les autres tickets n'a pas été mesuré de la même façon.*

## FAQ

### Comment savoir si la nouvelle version d'un skill Claude Code est meilleure que l'ancienne ?

Faites tourner l'ancienne version et la nouvelle sur les mêmes cas, mis de côté à l'avance, avec le même modèle. Des juges comparent ensuite les sorties, si possible en aveugle. Vous gardez la nouvelle version seulement si elle gagne.

### Faut-il comparer un travail fait « avec skill » et un travail fait « sans skill » ?

Cette comparaison a du sens au moment où vous créez le skill. Une fois le skill en place, la question utile devient de savoir si la nouvelle version bat l'ancienne. Surveillez aussi votre condition témoin : si elle reçoit une étape que vos développeurs ne font pas d'habitude, elle est irréalistement forte et la comparaison est biaisée.

### Qu'est-ce que SkillOpt ?

SkillOpt est une méthodologie publiée par Microsoft pour évaluer la qualité des skills et encadrer leurs itérations. Le modèle cible est figé, et une modification du skill n'est acceptée que si elle améliore un score sur un jeu de cas mis de côté. Les égalités sont refusées. [Skill Creator](https://github.com/The-Vibe-Company/companion-skills/blob/main/skills/create-skill-tools/SKILL.md), le skill que j'ai créé pour installer cette évaluation dès la création, s'appuie sur SkillOpt.

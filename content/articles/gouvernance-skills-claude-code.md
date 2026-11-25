---
title: "Skills Claude Code en entreprise : nommez un skill architect"
seoTitle: "Skills Claude Code en entreprise : nommez un skill architect"
seoDescription: "Skills Claude Code en entreprise : qui les écrit, qui les valide, où les ranger, quand les retirer. Le cadre de gouvernance et le rôle de skill architect."
slug: gouvernance-skills-claude-code
translationKey: claude-code-skills-governance
language: fr
summary: "Un skill Claude Code diffusé à toute l'entreprise change la façon de travailler de centaines de personnes. Rôles, preuve avant diffusion, rangement, retrait quand un meilleur modèle sort : le cadre, et pourquoi il faut un skill architect pour le tenir."
publishedAt: 2026-11-25
complexity: intermediate
topics: Claude Code, Skills, AI Governance, AI Adoption
author: stan-girard
coverImage: /images/resources/gouvernance-skills-claude-code/cover-mascotte.webp
coverAlt: "La mascotte The Vibe Company contrôle des fiches de skills à un guichet avant de les laisser partir vers les équipes"
ogImage: /images/resources/gouvernance-skills-claude-code/cover-mascotte.webp
---

Gouverner les skills Claude Code, c'est décider qui les écrit, qui les valide avant de les diffuser, où les ranger et quand les retirer. Un skill perso reste votre affaire. Un skill poussé à toute l'entreprise change la méthode de travail de chacun. Il lui faut un propriétaire, une preuve mesurée, et un rôle dédié pour tenir le tout : le skill architect.

Je le résume ainsi : « je pense qu'il va y avoir de nouveaux profils ou de nouveaux experts, c'est les skills architectes. C'est un peu les DBA de demain. » Dans beaucoup d'équipes techniques, le DBA veille sur les bases de données que tout le monde partage. Les skills partagés méritent le même gardien.

Sa règle la plus utile tient en une ligne : à chaque nouveau modèle, rejouez chaque skill diffusé avec et sans lui. Un skill fige la méthode de l'époque où il a été écrit, et le modèle suivant peut très bien faire mieux seul.

Ce guide donne le cadre. Les risques, les rôles, la preuve à exiger, le bon emplacement pour chaque skill, le cas du nouveau modèle, puis un plan pour démarrer.

## Pourquoi un skill partagé à toute l'entreprise est-il risqué ?

Parce qu'un skill change le travail de tous ceux qui l'utilisent, et pas toujours dans le bon sens. Un skill est une procédure que Claude charge et applique. Il impose une méthode.

Mon constat porte sur « des impacts énormes de certains skills […] sur le process et pas forcément positif ». Et aussi : « si tu crées un skill et que tu le shippes à 200 personnes et que tu fais déployer, bah c'est le bordel ».

Quatre risques reviennent.

1. **Le skill qui se déclenche partout.** Claude choisit un skill à partir de sa description. Une description trop large, et le skill s'invite dans des tâches qui ne sont pas les siennes. Toute l'équipe en hérite.
2. **La mise à jour au doigt mouillé.** Quelqu'un améliore un skill, le trouve mieux et le pousse à tout le monde. Sans mesure. Une version retouchée n'est pas forcément meilleure, [il faut la mesurer contre l'ancienne](/fr/resources/articles/vos-skills-ia-en-prod-au-doigt-mouille).
3. **Le coût caché.** Selon la documentation de Claude Code, chaque skill de la liste ajoute du contexte à chaque tour, qu'il serve ou non. Un skill que personne n'appelle coûte donc quand même.
4. **La méthode figée.** C'est le risque le moins visible, j'y reviens plus bas : un skill ancre le modèle dans la méthode de l'époque où il a été écrit.

## Qui écrit, qui valide et qui retire un skill ?

Tout le monde peut écrire un skill, une personne nommée valide ceux qui partent dans toute l'entreprise, et chaque skill partagé a un propriétaire qui peut le retirer. Voici le partage que je recommande. Il tient en quatre rôles.

| Rôle | Ce qu'il fait | Quand il intervient |
| --- | --- | --- |
| Auteur | Écrit le skill et apporte la preuve qu'il résout un problème | À la création et à chaque nouvelle version |
| Propriétaire | Tient le skill dans la durée, reçoit les retours, publie les versions | Tant que le skill est diffusé |
| Skill architect | Valide les skills avant diffusion à toute l'entreprise et forme les auteurs | Avant chaque diffusion large, et à chaque nouveau modèle |
| Utilisateurs | Remontent ce qui casse ou gêne dans leur travail | En continu |

Vos skills perso n'ont pas besoin de validation. Un skill pour écrire de meilleurs mails ? C'est votre affaire. La gouvernance commence quand un skill touche le travail des autres.

Le circuit reste simple. Une demande d'amélioration part d'une équipe, passe par le propriétaire du skill, et la nouvelle version redescend dans toutes les équipes après validation.

## Qu'est-ce qu'un skill architect ?

Le skill architect est la personne qui valide les skills avant qu'ils partent en production pour toute l'entreprise. Il juge si un skill est bien structuré, s'il répond à un vrai problème et si la preuve tient. Il n'a pas besoin d'être expert du métier concerné. La mesure avec et sans skill parle pour l'auteur.

L'analogie que j'utilise est celle du DBA. Un schéma de base mal pensé ralentit toutes les applications qui s'en servent. Un skill mal pensé, diffusé à toute l'entreprise, ralentit tous ceux qui l'utilisent. Dans les deux cas, il faut quelqu'un dont c'est le travail.

Concrètement, le rôle couvre trois choses.

- **La validation** : il relit la preuve de chaque skill avant sa diffusion à l'entreprise.
- **Le réexamen** : il rejoue les mesures quand un nouveau modèle arrive.
- **Le conseil aux auteurs** : il relit les skills et donne du feedback, pour que les équipes apprennent à en écrire de bons.

La charge dépend de l'entreprise : du nombre de skills partagés, d'équipes et de modèles utilisés. Ce qui compte, c'est que le rôle ait un nom et une personne.

La création reste libre. Le skill architect garde la porte de la diffusion large.

## Quelle preuve exiger avant de diffuser un skill ?

Exigez une comparaison avec et sans le skill, sur des cas réels, avec une métrique écrite avant le test. Ma règle : « il faut absolument réussir à bien créer des skills, bien les mesurer ».

Chez un client, j'ai eu des skills adoptés par cinquante personnes, partis en prod juste parce que le développeur pensait que ça les améliorait. Il ne le savait pas. Il a poussé ses skills à cinquante personnes au « doigt mouillé », sans mesure. Rien ne dit que ces skills aient dégradé les résultats, et rien ne disait non plus qu'ils les amélioraient. C'est ce trou que la porte ci-dessous comble.

Une porte de validation simple tient en quatre étapes.

1. **Les cas** : l'auteur rassemble quelques prompts réalistes, tirés du travail de l'équipe.
2. **La métrique** : il écrit avant le test ce qui compte, et donc ce que « gagner » veut dire.
3. **La méthode** : il construit le skill avec [Skill Creator](https://github.com/The-Vibe-Company/companion-skills/blob/main/skills/create-skill-tools/SKILL.md), le skill `create-skill-tools` que j'ai créé pour installer l'évaluation dès la création. Ne le confondez pas avec le plugin `skill-creator` d'Anthropic, cité par la documentation de Claude Code, qui fait tourner une boucle comparable avec son propre format `evals/evals.json`.
4. **La validation** : le skill architect relit le résultat avec et sans le skill avant toute diffusion à l'entreprise.

La documentation de Claude Code décrit cette mesure. Elle conseille de lancer quelques prompts réalistes dans une session neuve, une fois avec le skill et une fois sans, puis de comparer. Pour un skill perso ou projet, vous le coupez avec `skillOverrides` réglé sur `"off"`. Pour un skill livré dans un plugin, `claude plugin eval` rejoue chaque prompt avec et sans le plugin, note les sorties et renvoie un code d'erreur sous un seuil. De quoi bloquer une mise à jour ratée dans la CI.

Pour la manche « sans skill », un réglage suffit. Voici l'exemple de `skillOverrides` donné par la documentation, à adapter avec le nom de votre skill. Le menu `/skills` l'écrit pour vous dans `.claude/settings.local.json`.

```json
{
  "skillOverrides": {
    "legacy-context": "name-only",
    "deploy": "off"
  }
}
```

Et voici la règle de diffusion à recopier dans le dépôt de vos skills. Chaque skill candidat à une diffusion large la remplit avant de passer devant le skill architect.

```text
Skill : [nom]
Propriétaire : [personne]
Portée visée : perso / projet / plugin / entreprise
Problème résolu : [une phrase]
Cas d'évaluation : [nombre de prompts réels, emplacement]
Métrique et seuil : [ce qui compte, valeur à atteindre pour gagner]
Résultat avec le skill : [à remplir]
Résultat sans le skill : [à remplir]
Modèle testé : [nom et version]
Validé par : [skill architect, date]
Prochain réexamen : au prochain modèle adopté
```

Voici la porte appliquée à trois skills publics.

| Skill | Ce que dit la source | Mesure à exiger | Règle de décision |
| --- | --- | --- | --- |
| Votre skill de code review maison | Claude Code embarque déjà `/code-review`. Un skill de projet nommé `code-review` remplace la commande intégrée | Vos PR récentes, revues par votre skill puis par `/code-review` seul | Diffusé s'il bat `/code-review` sur la métrique choisie. Sinon, gardez l'intégré |
| [Skill Creator](https://github.com/The-Vibe-Company/companion-skills/blob/main/skills/create-skill-tools/SKILL.md) (`create-skill-tools`) | Son SKILL.md prévoit de construire des prompts d'évaluation réalistes et de lancer le skill contre une baseline | Les évaluations qu'il produit, relues par le skill architect | Diffusion large quand ses évaluations tiennent sur vos propres cas |
| Le pack [anthropics/skills](https://github.com/anthropics/skills) | Son README dit que ces skills sont fournis à titre de démonstration et demande de les tester dans votre environnement avant de vous y fier | `claude plugin eval` avec et sans le plugin, sur vos prompts | Perso ou projet tant que l'évaluation n'est pas passée |

Pour une nouvelle version d'un skill existant, la question change : la version 1.2 doit battre la 1.1. La méthode est détaillée dans [mon article sur les skills qui partent en prod au doigt mouillé](/fr/resources/articles/vos-skills-ia-en-prod-au-doigt-mouille).

## Skill d'équipe ou skill d'entreprise : où le ranger ?

Rangez un skill au plus près de ceux qui l'utilisent. L'emplacement décide qui le reçoit. La documentation de Claude Code en liste plusieurs.

| Emplacement | Chemin | Qui le reçoit | Pour quel skill |
| --- | --- | --- | --- |
| Personnel | `~/.claude/skills/<nom>/SKILL.md` | Vous, dans tous vos projets sur cette machine | Vos essais, vos skills perso |
| Projet | `.claude/skills/<nom>/SKILL.md` dans le dépôt | Toutes les sessions dans ce dépôt | Un skill d'équipe, lié au code |
| Plugin | `<plugin>/skills/<nom>/SKILL.md` | Partout où le plugin est activé, sous `/plugin-name:skill-name` | Un lot de skills partagé entre équipes |
| Entreprise | `.claude/skills/` dans le dossier des réglages gérés | Tous les utilisateurs des machines où l'organisation le déploie | Les quelques skills imposés à tous |

Deux détails comptent pour la gouvernance. En cas de conflit de nom, l'entreprise passe avant le personnel, et le personnel avant le projet. Un skill de plugin, lui, se charge à côté d'un skill du même nom, car son nom est préfixé par celui du plugin.

Un plugin pratique pour diffuser est aussi un risque : un skill de plugin se charge partout où le plugin est activé, donc une version ratée y arrive aussi. C'est là que la porte de validation sert le plus.

Passer d'un skill d'équipe à un skill d'entreprise demande une preuve de plus. Rejouez la comparaison sur des cas venus des autres équipes, pas seulement de celle qui a écrit le skill.

Pour un skill risqué, réglez `disable-model-invocation: true` dans son en-tête. Claude ne le charge plus de lui-même et il ne part que sur un `/nom` tapé par un humain.

## Que faire de vos skills quand un meilleur modèle sort ?

Repassez-les au banc d'essai, avec et sans skill, sur le nouveau modèle. Si le modèle seul fait aussi bien, allégez le skill. Ou retirez-le.

C'est le risque le moins visible. Je le formule ainsi : les skills, « ils ancrent le LLM dans une réalité qui est dans le temporel, donc passé : par exemple ces skills imposent une méthode, et que le LLM, bah une nouvelle version il devient meilleur, bah en fait ça l'ancre là-dedans ». Un skill écrit pour compenser une faiblesse du modèle de l'époque peut brider le modèle suivant. Il le tire vers le passé.

Je recommande de garder une mesure de référence du modèle seul, sans skills. Chaque skill doit montrer ce qu'il ajoute par rapport à elle. Quand le modèle change, cette référence change aussi.

Pour le ménage, Claude Code fournit deux outils.

- **`/skill-doctor`** montre ce que coûte chaque skill et à quelle fréquence il sert. Il signale ceux qui n'ont jamais été appelés (Claude Code v2.1.252 ou plus récent).
- **`skillOverrides`** change la visibilité d'un skill sans toucher à son fichier : `"name-only"` ne montre que son nom à Claude, `"off"` le cache complètement.

Ajoutez une ligne au calendrier du skill architect : à chaque nouveau modèle adopté par l'entreprise, rejouer la comparaison avec et sans skill sur les skills diffusés à tous.

## Quand ce cadre ne sert-il pas encore ?

Tant que vos skills restent perso ou vivent dans un seul dépôt, un propriétaire par skill suffit. L'équipe qui l'utilise voit vite s'il gêne, et elle peut le corriger elle-même.

Le skill architect devient utile au moment où un skill sort de l'équipe qui l'a écrit : un plugin partagé entre équipes, des réglages gérés pour toute l'organisation, ou plusieurs équipes qui proposent des skills sur le même terrain. Avant ce stade, une porte de validation centrale ralentirait sans protéger grand monde.

Le rôle ne remplace pas non plus la mesure. Un skill architect qui valide sans comparaison avec et sans skill revient à valider au feeling.

## Par où commencer cette semaine ?

Commencez par l'inventaire et les propriétaires. Les nouveaux skills attendront.

1. **Listez les skills partagés** : ceux des dépôts, des plugins internes et des réglages gérés. Lancez `/skill-doctor` pour repérer ceux qui ne servent pas.
2. **Donnez un propriétaire à chacun.** Sans propriétaire, un skill se retire ou redevient perso.
3. **Nommez un skill architect**, avec la charge qui convient à votre taille.
4. **Écrivez la règle de diffusion** : partez du modèle à remplir plus haut (preuve avec et sans skill, métrique, validation).
5. **Branchez la mesure dans la CI** pour les skills de plugin, avec `claude plugin eval` et un seuil.
6. **Planifiez le réexamen** à chaque nouveau modèle.

Si vous déployez Claude Code à grande échelle, ce cadre s'ajoute aux réglages de sécurité décrits dans [le guide pour déployer Claude Code en entreprise](/fr/resources/articles/deployer-claude-code-entreprise). Pour partager les skills validés à vos équipes, un hub comme [Skillpack](/fr/portfolio/skillpack) sert de catalogue. Et si la différence entre skill et prompt reste floue chez vous, commencez par [pourquoi les skills comptent plus que les prompts](/fr/resources/articles/les-skills).

*Mis à jour le 25 novembre 2026. Les fonctions de Claude Code citées viennent de la documentation officielle « Extend Claude with skills ».*

## FAQ

### Qu'est-ce qu'un skill Claude Code ?

Un skill Claude Code est un dossier qui contient un fichier `SKILL.md` avec des instructions, et parfois des scripts. Claude l'utilise quand une tâche correspond à sa description, ou quand vous tapez `/nom-du-skill`. Son contenu ne se charge que lorsqu'il sert.

### Où installer des skills Claude Code pour toute une équipe ?

Pour une équipe qui partage un dépôt, commitez le skill dans `.claude/skills/` du dépôt. Pour plusieurs équipes, regroupez les skills dans un plugin. Pour imposer un skill à toute l'organisation, déployez-le dans le dossier des réglages gérés.

### Qui doit valider un skill avant de le diffuser ?

Un skill perso ne demande aucune validation. Un skill diffusé à toute l'entreprise passe par une personne nommée, le skill architect. Elle juge une comparaison avec et sans skill, sur une métrique choisie à l'avance.

### Faut-il revoir ses skills à chaque nouveau modèle ?

Oui pour les skills diffusés à tous. Un skill impose une méthode écrite pour un modèle donné. Rejouez la comparaison avec et sans skill sur le nouveau modèle, puis allégez ou retirez ce qui n'apporte plus rien.

### Quel réglage désactive un skill Claude Code sans le supprimer ?

Réglez-le sur `"off"` dans `skillOverrides`, ou sur `"name-only"` pour ne laisser que son nom visible à Claude. Pour empêcher Claude de le lancer seul, ajoutez `disable-model-invocation: true` dans son en-tête. Les skills de plugin se gèrent depuis `/plugin`.

Si vous voulez poser ce cadre sur vos propres skills, avec la porte de validation et la mesure en CI, [prenons rendez-vous](https://cal.com/stangirard/thevibecompany).

---
title: "Le playbook CIR/CII pour compiler vos preuves avec l'IA"
slug: laisser-lia-faire-votre-cir-sans-la-laisser-inventer
summary: "La méthode concrète pour transformer Linear, GitHub, Notion, Drive et vos exports en dossier CIR/CII vérifiable. Pas le récit du projet : le mode opératoire."
publishedAt: 2026-04-23
complexity: advanced
topics: AI Operations, Research Tax Credit, Agent Workflows
coverImage: /images/resources/cir-cii-playbook-evidence-system/cover-cir-cii-playbook.svg
coverAlt: "Un playbook CIR/CII relie sources, matrice de preuves, agents et sortie LaTeX"
ogImage: /images/resources/cir-cii-playbook-evidence-system/cover-cir-cii-playbook.png
---

Cet article n'est pas l'histoire de notre dossier CIR.

C'est le playbook.

Le CIR n'est pas un problème de rédaction. C'est un problème de preuves.

On s'en est rendu compte en construisant notre dossier CIR/CII avec des agents. Au départ, le sujet ressemblait à un exercice administratif classique : relire les travaux de l'année, écrire un dossier technique, compiler quelques annexes, espérer que tout tienne debout.

En réalité, presque toutes les preuves existaient déjà. Elles étaient juste éparpillées dans Linear, GitHub, Notion, Google Drive, des exports comptables, des comptes rendus et la mémoire des personnes qui avaient vraiment fait le travail.

Le déclic a été là : il ne fallait pas demander à l'IA "d'écrire notre CIR". Il fallait lui demander de reconstruire la mémoire de l'entreprise, puis de rédiger uniquement à partir de cette mémoire.

On a donc construit un repo atelier. Dedans : un `CLAUDE.md`, des agents spécialisés, des accès Linear et GitHub, des documents de contexte, une matrice de preuves, des fichiers de travail, puis une sortie LaTeX structurée lot par lot.

Le résultat : un dossier de plus de 100 pages, beaucoup plus poussé que ce qu'on aurait pu produire à la main dans le même temps, parce que l'agent ne partait pas d'une page blanche. Il partait des traces réelles de l'entreprise.

Ce playbook explique comment reproduire cette méthode.

## La règle qui change tout

Le mauvais prompt, c'est :

```text
Écris-moi mon dossier CIR.
```

Ça produit souvent un texte fluide, mais dangereux. L'agent va combler les trous. Il va lisser les incertitudes. Il va transformer des hypothèses en faits. Et dans un dossier CIR/CII, c'est exactement ce qu'on ne veut pas.

Le bon système commence plutôt par cette règle :

```text
N'invente jamais rien.
Pose des questions.
Découpe en sous-tâches dans TODO.md.
Chaque affirmation importante doit remonter vers une preuve.
```

C'est simple, mais ça déplace tout le projet.

L'IA n'est plus un rédacteur magique. Elle devient un compilateur de preuves. Elle fouille, classe, relie, détecte les trous, propose une qualification, puis aide à rédiger quand la matière est assez solide.

La différence est massive. Dans le premier cas, on produit une histoire. Dans le second, on produit un dossier vérifiable.

## Ce qu'on construit vraiment

On ne construit pas un document.

On construit une chaîne de compilation :

| Couche | Rôle |
| --- | --- |
| Sources | Linear, GitHub, Notion, Drive, exports, interviews, métriques |
| Extraction | Transformer les traces brutes en preuves datées |
| Qualification | Dire ce qui ressemble à du CIR, du CII, du hors périmètre ou du "à valider" |
| Matrice | Relier chaque lot aux preuves, aux manques et aux questions |
| Rédaction | Produire les sections finales sans ajouter de substance nouvelle |
| Validation | Faire relire fiscal, comptable, technique et confidentialité |

Cette architecture est la raison pour laquelle le repo a marché.

Un dossier CIR/CII est souvent traité comme un effort de narration. On raconte ce qu'on a fait. Le problème, c'est que l'administration ou l'expert ne veut pas seulement une belle histoire. Il faut montrer une démarche : état de l'art, verrous, expérimentations, échecs, résultats, personnes, périodes, dépenses.

Les outils de l'entreprise contiennent déjà une grande partie de cette démarche. GitHub prouve que le code a bougé. Linear prouve que les projets ont existé. Notion ou Drive prouvent que des décisions ont été formalisées. Les interviews expliquent pourquoi certains choix n'étaient pas évidents.

L'agent sert à relier tout ça.

## Étape 1 : créer un repo atelier

Ne commencez pas dans un Google Doc.

Commencez dans un repo.

```text
cir-cii/
  CLAUDE.md ou AGENTS.md
  TODO.md
  context/
  sources/
  evidence/
  dossier/
  output/
  output/sections/
  .claude/skills/ ou .agents/skills/
```

Le repo sert à rendre le travail observable. Chaque exploration laisse une trace. Chaque décision est versionnée. Chaque sortie intermédiaire peut être relue, corrigée, enrichie.

Dans notre cas, le `CLAUDE.md` a joué le rôle de contrat permanent avec l'agent. Il ne contenait pas seulement "fais un CIR". Il contenait les règles du projet, les dossiers à utiliser, les skills disponibles, la séparation CIR/CII, le style de sortie et la consigne de travailler section par section pour ne pas exploser le contexte.

Un bon `CLAUDE.md` de départ peut ressembler à ça :

```text
# Dossier CIR/CII

Objectif : créer un dossier CIR/CII vérifiable à partir des preuves réelles.

Règles :
- N'invente jamais rien.
- Si une information manque, écris "à valider".
- Pose des questions.
- Découpe le travail en sous-tâches dans TODO.md.
- Sauvegarde les preuves dans evidence/.
- Rédige seulement à partir de preuves ou d'hypothèses explicitement marquées.
- Sépare CIR, CII, hors périmètre et points à valider.

Dossiers :
- context/ : anciens dossiers, contexte entreprise, cadrage produit.
- sources/ : exports bruts ou documents importés.
- evidence/ : preuves normalisées.
- dossier/ : analyses intermédiaires.
- output/sections/ : sections finales Markdown ou LaTeX.

Sources possibles :
- Linear : projets, issues, cycles, assignees, statuts, commentaires.
- GitHub/GitLab : commits, PRs, releases, auteurs, fichiers modifiés.
- Notion/Drive : specs, ADR, benchmarks, décisions.
- Tableurs : temps, coûts, personnes, périodes.
- Interviews : explication des verrous, échecs, arbitrages.
```

Le point important : ce fichier doit apprendre à l'agent la méthode, pas seulement le résultat attendu.

## Étape 2 : brancher les sources de preuve

Le dossier a marché parce qu'on n'a pas nourri l'agent uniquement avec des documents finis. On l'a branché aux systèmes où le travail avait eu lieu.

Linear était central. Pas parce que Linear serait magique, mais parce qu'il donne une chronologie produit : projets, tickets, owners, statuts, périodes, commentaires, priorités, abandons, relances. C'est souvent là qu'on voit la différence entre une feature banale et un vrai chantier de R&D ou d'innovation.

GitHub était l'autre pilier. Les commits et les PRs sont des preuves contemporaines. Ils disent quand le travail a été fait, par qui, dans quelle partie du système, avec quels changements.

Notion et Google Drive ont servi à récupérer les specs, les décisions, les notes de contexte, les anciens dossiers et les documents de cadrage. Les exports comptables et financiers ont servi à relier les travaux aux personnes, aux périodes et aux coûts.

On peut faire ça avec des MCP, avec les APIs natives ou avec des exports propres. Le MCP rend juste l'exploration plus fluide, parce que l'agent peut interroger les outils au lieu d'attendre qu'on lui colle des fichiers dans un chat.

Le prompt d'exploration initiale doit être concret :

```text
Tu es un agent de compilation CIR/CII.

Ton objectif n'est pas d'écrire le dossier final.
Ton objectif est de créer une première cartographie vérifiable.

Lis context/.
Lis sources/.
Explore Linear si l'accès MCP ou API est disponible.
Explore GitHub/GitLab si l'accès est disponible.
Explore Notion ou Google Drive si les documents sont disponibles.

Pour chaque source, indique :
- ce qu'elle prouve ;
- sa période ;
- les personnes ou équipes concernées ;
- les lots CIR/CII candidats ;
- les limites de la preuve ;
- les questions à poser.

Crée :
- dossier/00_analyse_initiale.md ;
- evidence/source_manifest.md ;
- TODO.md mis à jour.

N'invente rien. Marque "à valider" dès qu'une information manque.
```

Cette première passe ne doit pas être parfaite. Elle doit lancer la machine. On veut une carte, pas encore le dossier.

## Étape 3 : faire des agents spécialisés

Le repo a marché aussi parce qu'on n'a pas tout mis dans un prompt géant.

On a découpé la méthode en rôles. Chaque agent avait une mission simple et une sortie attendue.

| Agent | Mission |
| --- | --- |
| `linear-explorer` | Extraire les projets, tickets, dates, owners, commentaires et signaux R&D |
| `github-explorer` | Transformer commits, PRs et changements de code en preuves datées |
| `competitive-research` | Chercher l'état de l'art, les concurrents et leurs limites |
| `synthesizer` | Fusionner Linear, GitHub, Notion, Drive, interviews et recherche web |
| `cir-writer` | Rédiger les sections selon une structure CIR défendable |
| `session-writer` | Produire une section lot par lot avec état de l'art et démarche expérimentale |
| `archiver` | Sauvegarder preuves, exports, versions et annexes |
| `interview-conductor` | Faire sortir les raisons tacites, les échecs et les arbitrages |

Ce découpage a l'air évident après coup. Il ne l'est pas quand on commence.

La plupart des projets IA ratent ici : on demande au même agent d'explorer Linear, de comprendre le code, de faire l'état de l'art, de choisir ce qui est CIR, de rédiger, puis de valider. Ça crée un agent trop large, donc trop confiant.

Un bon agent doit être limité. L'agent Linear n'écrit pas la conclusion fiscale. L'agent GitHub ne décide pas de la valorisation financière. L'agent de rédaction ne crée pas de nouvelles preuves.

Le pipeline devient beaucoup plus fiable parce que chaque étape peut être relue.

## Étape 4 : extraire Linear comme une preuve, pas comme une liste de tickets

Linear ne sert pas seulement à dire "on a fait tel projet".

Il sert à reconstruire la chronologie du travail.

Un prompt utile :

```text
Explore Linear pour trouver les projets et issues liés aux travaux R&D ou innovation.

Pour chaque projet pertinent, extrais :
- nom du projet ;
- description ;
- période ;
- statut ;
- lead ou assignees ;
- objectifs techniques ;
- tickets importants ;
- commentaires qui mentionnent un problème technique, un échec, une incertitude ou un arbitrage ;
- lien potentiel avec un lot CIR, CII, hors périmètre ou à valider.

Pour chaque issue pertinente, extrais :
- id ;
- titre ;
- description ;
- assignee ;
- date de création ;
- date de complétion ;
- projet ;
- estimation ou effort si disponible ;
- commentaires techniques ;
- raison pour laquelle cette issue est une preuve.

Sauvegarde dans evidence/linear/YYYY-MM-DD-linear-evidence.md.
Ne résume pas trop vite. Les dates, ids et owners comptent.
```

Dans notre dossier, cette exploration a permis de faire émerger des lots : évaluation automatique des réponses LLM, prédiction pré-génération, workflow RAG, autosend, workflow system, enrichissement contextuel, parsing documentaire, architecture multi-agents.

Le point n'est pas de reprendre ces lots tels quels. Le point est la méthode : Linear donne une carte des chantiers, mais l'agent doit encore qualifier ce qui relève vraiment du CIR, du CII, du produit standard ou du "à valider".

## Étape 5 : extraire GitHub comme un journal technique

GitHub apporte ce que Linear ne peut pas toujours prouver : le code a vraiment changé.

On veut transformer les commits et PRs en preuves exploitables, pas juste compter les lignes.

Prompt :

```text
Explore GitHub/GitLab pour les repositories liés à la période étudiée.

Pour chaque repo, extrais :
- nombre de commits sur la période ;
- PRs mergées ;
- contributeurs ;
- releases ;
- zones du code modifiées ;
- commits liés aux lots candidats ;
- PRs qui expliquent un choix technique ou un échec ;
- liens entre tickets Linear et commits quand ils existent.

Pour chaque preuve retenue, conserve :
- hash ou PR id ;
- auteur ;
- date ;
- message ;
- fichiers modifiés ;
- résumé du changement ;
- lot CIR/CII candidat ;
- niveau de confiance.

Sauvegarde dans evidence/github/YYYY-MM-DD-github-evidence.md.
```

Le piège est de tout compter. Ce n'est pas parce qu'un commit existe qu'il prouve de la R&D. Une correction CSS, une dépendance bumpée ou une petite feature standard peuvent être utiles au produit sans être pertinentes pour le CIR.

L'agent doit donc faire deux choses en même temps : collecter et filtrer.

## Étape 6 : construire la matrice de preuve

Avant de rédiger, il faut forcer l'agent à remplir une matrice.

C'est probablement l'objet le plus important du système.

```markdown
| Lot | Qualification | Objectif | Incertitude ou nouveauté | Approches testées | Échecs ou limites | Résultat | Preuves disponibles | Preuves manquantes | Personnes | Période | Confiance | Questions à valider |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Lot 01 - <nom> | CIR / CII / hors périmètre / à valider | <problème> | <pourquoi ce n'était pas trivial> | <solutions explorées> | <ce qui n'a pas marché> | <solution ou apprentissage> | <Linear, PR, specs, métriques> | <preuves faibles ou absentes> | <équipe> | <dates> | fort / moyen / faible | <questions fiscal, comptable, technique> |
```

Une ligne fictive peut ressembler à ça :

```markdown
| Lot 01 - Automatisation d'un workflow métier | À valider CIR/CII | Réduire un traitement manuel complexe | Les règles changent selon le client et les données disponibles sont hétérogènes | Règles déterministes, modèle LLM seul, orchestration règles + LLM | Le modèle seul produit des sorties instables ; les règles seules ne couvrent pas assez de cas | Workflow hybride avec garde-fous et validation humaine | Linear PROJ-123, PR #456, spec Drive "workflow v2", métriques avril | Temps exact par personne, validation fiscaliste | Produit + backend | T2 2025 | moyen | Est-ce un verrou R&D, une innovation produit ou une industrialisation ? |
```

Cette table évite deux erreurs.

Première erreur : rédiger des sections faibles parce qu'elles sonnent bien. Deuxième erreur : jeter des sujets intéressants parce que les preuves sont dispersées.

La matrice rend visible la réalité : certains lots sont forts, certains sont moyens, certains doivent sortir, certains ont besoin d'une interview ou d'un export financier.

## Étape 7 : séparer CIR et CII dès le début

Le CIR et le CII ne racontent pas exactement la même chose.

Pour le CIR, on cherche plutôt :

- une incertitude technique ou scientifique ;
- un état de l'art insuffisant ;
- des verrous ;
- une démarche expérimentale ;
- des échecs documentés ;
- des résultats ou apprentissages.

Pour le CII, on cherche plutôt :

- une nouveauté produit ;
- une différenciation marché ;
- une amélioration fonctionnelle significative ;
- une intégration nouvelle ;
- une ergonomie ou un usage inédit ;
- des preuves que ce n'est pas seulement du développement standard.

Dans notre repo, on a explicitement relancé l'agent après la partie CIR pour chercher la partie CII dans Linear et Notion. C'était important, parce qu'un agent a tendance à recycler les mêmes lots si on ne lui demande pas de changer de grille de lecture.

Prompt :

```text
La partie CIR est maintenant cadrée.
Il faut compléter la partie CII.

Cherche dans Linear, Notion et Drive les projets liés aux innovations produit :
- interfaces nouvelles ;
- intégrations ;
- workflows ;
- automatisations ;
- configuration self-serve ;
- outils internes ;
- différenciation marché.

Pour chaque innovation trouvée, explique :
1. ce qui est nouveau pour l'utilisateur ;
2. ce qui existait déjà sur le marché ;
3. pourquoi ce n'est pas seulement du développement standard ;
4. quelles preuves Linear, GitHub, Notion ou Drive existent ;
5. quelles questions restent à valider.

Marque CIR, CII, hors périmètre ou à valider.
```

Cette séparation rend le dossier plus propre. Elle évite le grand fourre-tout "innovation IA" qui impressionne au début mais s'effondre à la relecture.

## Étape 8 : chercher l'état de l'art avant d'écrire

Un lot CIR sans état de l'art solide est fragile.

L'état de l'art ne doit pas être une page décorative avec trois noms de concurrents. Il doit expliquer pourquoi le problème n'était pas trivial au moment où l'équipe l'a traité.

Prompt :

```text
Pour le lot <nom du lot>, fais une recherche d'état de l'art.

Cherche :
- solutions industrielles existantes ;
- concurrents ou produits proches ;
- approches open source ;
- articles techniques ou académiques pertinents ;
- limites connues ;
- pourquoi ces approches ne couvrent pas complètement notre cas.

Produit dossier/etat_art/<lot>.md avec :
- résumé du domaine ;
- 3 à 5 sources externes ;
- limites des approches existantes ;
- implication pour notre lot ;
- questions à valider avec l'équipe.

Ne prétends pas que notre approche est meilleure si les preuves ne le montrent pas.
```

Ce qui rend l'article CIR crédible, ce n'est pas de dire "on est innovants". C'est de montrer : voici ce qui existait, voici ce que ça ne résolvait pas, voici ce qu'on a testé, voici ce qui a échoué, voici ce qu'on a appris.

## Étape 9 : utiliser les interviews pour récupérer le tacite

Les outils prouvent beaucoup de choses. Ils ne prouvent pas tout.

GitHub montre un commit, mais pas toujours pourquoi l'approche précédente a échoué. Linear montre un ticket, mais pas toujours l'incertitude technique derrière. Notion montre une spec, mais pas toujours l'arbitrage oral qui l'a précédée.

Il faut donc interviewer les personnes clés.

Prompt pour préparer une interview :

```text
Prépare une interview de 30 minutes pour <personne> sur le lot <nom>.

Lis d'abord :
- evidence/linear/<lot>.md ;
- evidence/github/<lot>.md ;
- dossier/etat_art/<lot>.md ;
- dossier/matrice_preuves.md.

Objectif : récupérer ce qui n'est pas dans les outils.

Questions à couvrir :
- Quel était le vrai problème technique ?
- Pourquoi ce n'était pas trivial ?
- Quelles solutions existantes ont été regardées ?
- Quelles approches ont échoué ?
- Qu'est-ce qui a été appris ?
- Quelles métriques prouvent le résultat ?
- Quelles preuves peut-on rattacher à ces affirmations ?

Après l'interview, écris evidence/interviews/YYYY-MM-DD-<personne>-<lot>.md.
Sépare faits, citations, hypothèses et questions.
```

C'est souvent là que le dossier devient bon. Les échecs, les arbitrages et les raisons profondes ne sont pas toujours dans les tickets. Pourtant, ce sont exactement ces éléments qui font passer un dossier de "liste de features" à "démarche de R&D".

## Étape 10 : rédiger lot par lot

Il ne faut pas demander le dossier final d'un coup.

On rédige lot par lot.

```text
À partir de la matrice de preuves et des fichiers evidence/, rédige un brouillon
pour le lot <numéro> uniquement.

Crée dossier/lots/lot-<numéro>.md.

Structure :
1. objectif du lot ;
2. contexte et état de l'art ;
3. verrou scientifique ou nouveauté produit ;
4. démarches testées ;
5. échecs et limites ;
6. solution retenue ;
7. résultats ;
8. preuves citées ;
9. points à valider.

Contraintes :
- chaque affirmation importante doit pointer vers une source ;
- si une preuve manque, écris "preuve manquante" ;
- n'ajoute pas de claim nouveau ;
- n'écris pas encore la version finale.
```

Ensuite seulement, on transforme ce brouillon en section finale :

```text
Transforme dossier/lots/lot-<numéro>.md en section finale.

Crée output/sections/lot-<numéro>.tex.

Garde la structure logique.
Retire les notes de travail.
Conserve les références aux preuves.
N'ajoute aucun claim qui n'était pas dans le brouillon validé.
Utilise un style académique, clair et concis.
```

La rédaction finale ne doit jamais ajouter de substance. Elle doit rendre lisible ce qui a déjà été prouvé.

## Étape 11 : produire un dossier LaTeX propre

On peut livrer en Word, Google Doc ou PDF. Mais pour un dossier long, LaTeX a un avantage : il force la structure.

Dans notre cas, le dossier final était découpé en sections :

```text
output/
  main.tex
  sections/
    00_resume.tex
    01_presentation_entreprise.tex
    02_etat_art.tex
    03_verrous.tex
    04_lot1.tex
    05_lot2.tex
    ...
    13_valorisation.tex
    14_conclusion.tex
```

Ce découpage rend le travail agentique beaucoup plus simple. L'agent peut améliorer une section sans toucher au reste. On peut relire un lot précis. On peut générer un PDF, voir les erreurs, corriger, recommencer.

Le prompt de conversion final :

```text
Compile les sections validées en LaTeX.

Contraintes :
- ne modifie pas les claims techniques ;
- garde les tableaux lisibles ;
- évite les citations LaTeX cassées ;
- mets les sources en note ou en bloc "Sources" ;
- vérifie que la compilation PDF passe ;
- si une section est trop faible, marque-la "à renforcer" au lieu de l'embellir.
```

Ce dernier point compte beaucoup : un agent qui embellit un lot faible est un risque. Un agent qui dit "ce lot est faible" est utile.

## Le contrôle qualité

Avant de considérer le dossier prêt, on a besoin d'un passage critique.

Pas une relecture de style. Une vraie revue de robustesse.

```text
Fais une revue critique du dossier.

Cherche :
- claims non sourcés ;
- lots qui ressemblent à du développement standard ;
- état de l'art trop superficiel ;
- absence d'échecs ou d'expérimentations ;
- chiffres non reliés à une source ;
- incohérences entre Linear, GitHub et la rédaction ;
- questions fiscales ou comptables non résolues ;
- passages trop marketing.

Pour chaque problème, indique :
- section ;
- phrase ou claim concerné ;
- risque ;
- correction proposée ;
- preuve nécessaire.
```

Le but n'est pas que l'agent "valide" le dossier. Le but est qu'il trouve les endroits qui cassent.

Ensuite, les humains gardent les validations sensibles :

- qualification fiscale CIR/CII ;
- valorisation comptable ;
- temps par personne ;
- confidentialité ;
- relecture technique par les équipes ;
- arbitrage final sur les lots faibles.

L'IA accélère énormément la préparation. Elle ne remplace pas la responsabilité.

## Pourquoi ça a marché

Ce repo a marché pour cinq raisons.

La première : on a traité le CIR comme un problème de système, pas comme un problème de texte. Le dossier final n'était que la dernière sortie d'un pipeline.

La deuxième : on a donné à l'agent des accès aux bons outils. Linear pour la chronologie produit. GitHub pour les preuves de code. Notion et Drive pour le contexte. Les exports pour les chiffres. Les interviews pour le tacite.

La troisième : on a imposé une règle anti-hallucination très simple. Si ce n'est pas prouvé, c'est "à valider". Cette convention a évité de transformer l'incertitude en storytelling.

La quatrième : on a découpé le travail en agents spécialisés. L'exploration, la synthèse, l'état de l'art, l'archivage et la rédaction n'étaient pas mélangés.

La cinquième : on a gardé un `TODO.md` vivant. À chaque fois que l'agent bloquait, il ne devait pas combler. Il devait créer une question, une sous-tâche, une preuve manquante.

C'est exactement ce qu'on veut dans un dossier à enjeu : une machine qui avance vite, mais qui montre ses zones de doute.

## Le vrai changement mental

Quand on regarde le résultat, on peut se tromper de conclusion.

On peut croire que l'IA a "écrit le CIR". Ce n'est pas exactement ça.

L'IA a compilé un dossier que l'entreprise avait déjà produit sans le savoir. Chaque ticket, chaque commit, chaque spec, chaque benchmark, chaque discussion technique était un morceau du dossier. Le problème, c'est que personne n'avait le temps de tout relire, relier et structurer.

C'est là que les agents deviennent très forts : pas quand ils inventent une réponse, mais quand ils travaillent longtemps sur une mémoire riche, avec une méthode claire.

À la fin, on ne doit pas seulement avoir un PDF. On doit avoir un graphe de preuves.

On doit pouvoir dire : cette phrase vient de ce ticket Linear, ce commit GitHub, cette spec Drive, cette métrique, cette interview, cette validation humaine.

Et là, le déclic est assez violent :

```text
On a laissé notre CIR se faire à la main,
alors que les preuves étaient déjà dans nos outils.
```

Une fois qu'on a vu ça, on ne revient pas en arrière.

## Le template complet à copier

Pour démarrer, on peut donner ce prompt à l'agent :

```text
Tu vas m'aider à construire un dossier CIR/CII.

Tu n'es pas là pour inventer un dossier.
Tu es là pour compiler les preuves réelles de l'entreprise.

Commence par :
1. lire CLAUDE.md ou AGENTS.md ;
2. lire context/ ;
3. créer ou mettre à jour TODO.md ;
4. explorer les sources disponibles : Linear, GitHub, Notion, Drive, exports ;
5. produire une analyse initiale dans dossier/00_analyse_initiale.md ;
6. produire un manifeste des sources dans evidence/source_manifest.md ;
7. proposer une première matrice de preuves dans dossier/matrice_preuves.md.

Pour chaque lot candidat, indique :
- CIR, CII, hors périmètre ou à valider ;
- objectif ;
- incertitude technique ou nouveauté produit ;
- preuves disponibles ;
- preuves manquantes ;
- questions à poser ;
- niveau de confiance.

Ne rédige pas encore le dossier final.
N'invente jamais une preuve.
Si une information manque, écris "à valider".
```

Puis, une fois la matrice validée :

```text
Pour chaque lot validé :
1. enrichis l'état de l'art ;
2. relie Linear, GitHub, Notion, Drive et interviews ;
3. documente au moins les approches testées et les limites ;
4. rédige un brouillon Markdown ;
5. attends validation ;
6. transforme seulement ensuite en section finale LaTeX.

À chaque étape, garde la trace des preuves.
```

Ce n'est pas une checklist administrative. C'est un système de production documentaire.

Et ce système ne sert pas qu'au CIR. Il sert partout où l'entreprise doit transformer sa mémoire en livrable sérieux : audit, due diligence, conformité, dossier BPI, réponse à appel d'offres, documentation technique, rapport client.

## Ce que The Vibe Company peut faire pour vous

Chez The Vibe Company, on aide les entreprises à construire ce genre d'atelier.

Pas un prompt magique. Un vrai système : connexion aux outils, extraction des traces, matrice de preuves, agents spécialisés, rédaction contrôlée, garde-fous humains et livrable final propre.

Si vous avez fait le travail, mais que les preuves sont dispersées dans Linear, GitHub, Notion, Google Drive, Slack, vos tableurs et la tête de votre équipe, on peut vous aider à faire la même chose chez vous.

On est The Vibe Company. C'est exactement le type de système qu'on aime construire.

## Note importante

Cette méthode ne remplace pas un expert fiscal, un expert-comptable ou un conseil juridique.

Elle sert à arriver devant eux avec un dossier mieux préparé, mieux sourcé, plus honnête et beaucoup plus facile à valider.

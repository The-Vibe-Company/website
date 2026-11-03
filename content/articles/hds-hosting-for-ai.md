---
title: "HDS hosting for AI: what you need to process health data"
seoTitle: "HDS hosting for AI: how to choose and configure"
slug: hds-hosting-for-ai
translationKey: hds-hosting-ai
language: en
summary: "HDS hosting for AI in France: activities to cover, 2024 sovereignty rules, model/logs/index flows, cloud pitfalls and a vendor checklist."
publishedAt: 2026-11-03
complexity: intermediate
topics: AI Agents, Health Data, Security
coverImage: /images/resources/hebergement-hds-ia/cover-mascotte.webp
coverAlt: "The mascot plugs a teal cable from an AI orb into a secure server cabinet, next to padlock and medical-cross medallions"
ogImage: /images/resources/hebergement-hds-ia/cover-mascotte.webp
---

**The short answer.** To process health data with AI in France, you need **HDS hosting** that fits your workload. An "HDS" badge on a marketing page isn't enough. In practice: read the certificate (activities 1 to 6 and the référentiel version), check the 2024 sovereignty rules (storage in the EEA, transparency for access from outside the EEA), map every AI flow (app, model, logs, indexes, backups, staging), and sign a contract that covers what you actually outsource. Without that, a great model still won't ship.

This guide is about buying and architecture: **how to choose and configure HDS hosting so AI can run**. For the legal frame of the project (who must be certified, GDPR, CNIL), see [AI and health data: what HDS really requires](/en/resources/articles/ai-health-data-hds-france). Here we stay on the infrastructure side.

> This is not legal advice. For your case, talk to your DPO or a specialist lawyer.

## HDS, a short reminder before you compare quotes

[HDS](https://esante.gouv.fr/produits-services/hds) certification (hébergeur de données de santé) shows that a host applies a security level suited to personal health data. It is issued by an accredited certification body, against a référentiel published by France's Agence du Numérique en Santé.

The duty comes from [article L.1111-8 of the French public health code](https://gnius.esante.gouv.fr/fr/reglementation/fiches-reglementation/hebergement-des-donnees-de-sante-hds): hosting, for a third party (or the patient), health data collected in prevention, diagnosis, care or social/medico-social follow-up requires a certified host. The [HAS-CNIL guide](https://www.cnil.fr/sites/default/files/2026-03/guide_has_cnil_recommandations_ia.pdf) (March 2026) repeats it for AI systems in care settings: hosting with a third party means HDS plus a compliant contract.

The Vibe Company isn't an HDS host. On health projects, we usually build inside the client's existing HDS environment, as with [Monka](/en/case-studies/monka). Offer page: [Healthcare AI and HDS](/en/healthcare-ai-hds).

## Read the certificate: six activities, not the slogan

The référentiel splits hosting into **six activities** (article R.1111-9 of the public health code, as set out in the [HDS v2 référentiel](https://esante.gouv.fr/sites/default/files/media_entity/documents/referentiel_certification_hds---en--v2.pdf)):

1. Physical sites (facilities that house the infrastructure).
2. Hardware infrastructure (servers, equipment).
3. Virtual infrastructure.
4. Application hosting platform.
5. Administration and operation of the information system that holds the health data.
6. Backup of health data (**outsourced** backups; backups intrinsic to activities 1 to 5 stay inside those activities).

These aren't stacked "levels". Each host picks the activities it gets certified for. The [official ANS list](https://esante.gouv.fr/offres-services/hds/liste-des-hebergeurs-certifies) shows activities and référentiel version for each entry.

**What that means for an AI project:**

- If you only buy a cloud certified for 1 to 4, and **you** (or your vendor) administer databases, models and access, activity 5 isn't covered by default.
- If backups go to a separate third party, check that party's activity 6.
- The word "HDS" on a homepage doesn't tell you which activities are on the certificate, or on which version.

## Sovereignty: what the 2024 référentiel actually requires

The revised référentiel was published in the Official Journal on May 16, 2024 ([ANS release](https://esante.gouv.fr/espace-presse/publication-au-journal-officiel-du-referentiel-de-certification-hds-souverainete-des-donnees-et-ameliorations-du-referentiel)):

- new candidates assessed on v2 since **November 16, 2024**;
- already-certified hosts: transition by **May 16, 2026** at the latest;
- four sovereignty requirements ([requirements 28 to 31, chapter 7 of the référentiel](https://esante.gouv.fr/sites/default/files/media_entity/documents/referentiel_certification_hds---en--v2.pdf#page=16)), including: physical storage of health data in the **European Economic Area**; remote access from outside the EEA only on a GDPR adequacy decision or, failing that, Article 46 safeguards the client is told about; disclosure in the contract of any exposure of the host or a subcontractor to the law of a third country without adequate protection; a **public** map of transfers outside the EEA.

ANS is explicit: EEA location strengthens protection, **without guaranteeing extraterritorial immunity**. HDS is not aligned, for now, with SecNumCloud immunity requirements on that point (to be reassessed by 2027 at the latest).

In November 2026, a certificate still shown as v1.1 shouldn't be good enough. Ask for the up-to-date certificate, activities, version, and the transfer map.

## Map the AI stack before you sign

A classic app already has data flows, and an AI stack adds more. Before you ask for a quote, draw:

| Component | HDS question |
|---|---|
| Application / API | Where does it run? Who administers it (activity 5)? |
| Model call | Does the prompt or context hold health data? Is the model inside the HDS perimeter, or are data pseudonymized before the call? |
| Logs and traces | Do prompts, answers and observability metadata stay in the same perimeter? |
| Embeddings / indexes | Is the vector store built from clinical notes hosted like the rest? (see [Enterprise RAG](/en/resources/articles/enterprise-rag)) |
| Backups | Who stores them, where, under which activity? |
| Staging / demos | Are real data used outside a certified environment? |

If even one path leaves the frame, the prod rack certificate isn't enough.

## Cloud pitfalls we see often

1. **"We have a Europe region" ≠ HDS on your services.** Region matters for location. It doesn't replace certified activities or the contract.
2. **Public LLM API with a patient file in clear.** Even if the database is HDS, the call leaves. Host the model inside the perimeter, pseudonymize first, or don't call out.
3. **Logs shipped to a SIEM or APM outside HDS.** Prompt traces are often clear-text health data.
4. **Certificate for 1-4 without activity 5**, while your team (or the agency) has root on the database.
5. **Backups, snapshots and exports** on object storage outside the perimeter "because it's temporary".
6. **Test environments** filled with a prod extract "to move faster".
7. **Subcontractor chains** (ops partner, ML platform vendor, offshore support) missing from the contract and the transfer map.

These stall projects more often than the choice of model.

## How we configured this with Monka

At [Monka](/en/case-studies/monka), the HDS environment was already in place. In two months we shipped the caregivers' app (a 165-question assessment that becomes an action plan), Lifeline for coordinating nurses, and a versioned clinical engine. Since then the cadence is about one release every two days; 90 app versions in six months, 12 versions of the clinical référentiel.

What matters for architecture: we didn't "add HDS after the demo". We built inside the hosting frame already decided, with encrypted health data and a go-live tied to that foundation. It's the same order we recommend in [From AI agent POC to production](/en/resources/articles/ai-agent-poc-to-production): hosting perimeter before prompt polish.

## Vendor checklist (send this)

1. What is the certificate number / verification URL at the certification body?
2. Which **activities** (1 to 6) are covered, and on which **référentiel version** (v2.0)?
3. Where are the data physically stored (EEA country)?
4. Are there remote accesses or subcontractors outside the EEA? Which risks and measures are written in the contract?
5. Where is the public **transfer map** outside the EEA published?
6. Who handles **administration** (activity 5): you, us, a third-party ops partner?
7. Are the services we will use (Kubernetes, object storage, queues, GPU, registry) **all** in the certified perimeter, or only part of the catalog?
8. Where do **logs**, metrics, traces and backups of our AI stack live?
9. Can we host a **model** (self-hosted or private endpoint) without sending prompts out?
10. How does **export / exit** work at contract end without breaking the chain of responsibility?

Keep the answers in writing. They feed the [DPIA](https://www.cnil.fr/fr/realiser-une-analyse-dimpact-si-necessaire) and the CNIL formalities in the [AI and health sheets](https://www.cnil.fr/fr/ia-et-sante-developper-et-evaluer-des-systemes-ia-conformes).

## Where to start

1. Draw the flows (table above) with the DPO and the technical lead.
2. Filter the [ANS list](https://esante.gouv.fr/offres-services/hds/liste-des-hebergeurs-certifies) for the activities you need, on v2.
3. Send the checklist and compare two or three answers, not ten slides.
4. Lock the contract and architecture plan **before** a "realistic" POC on health data.
5. Then build the AI product inside that frame (see also [AI agency in Paris](/en/ai-agency-paris) if you outsource the build).

## FAQ

**Do you need an HDS host for every health AI?**  
As soon as personal health data is hosted with a third party under L.1111-8, yes. If you only host data that's anonymized in the strict sense, things change: have your DPO validate the anonymization. It isn't a marketing shortcut.

**Does an "HDS-certified" cloud automatically cover my AI agent?**  
No. It covers the activities on its certificate, for the services in scope. The agent, its tools, its logs and its model calls still need mapping.

**What does the 2024 référentiel change in an RFP?**  
Require v2, EEA storage, transparency for access outside the EEA, and the public transfer map. A quote without those pieces is incomplete.

**Can we call a US LLM from an HDS database in France?**  
Technically, often yes. With clear-text health data, though, you're usually outside the frame you're trying to respect. Pseudonymize first, host the model inside the perimeter, or don't send the data out.

**Who must be certified: the vendor, the hospital, the agency?**  
Whoever performs hosting activities for someone else. A development agency is not a host by default. It depends on who has production access. Detail in the [HDS obligations article](/en/resources/articles/ai-health-data-hds-france).

**How long to ship an AI product on a ready HDS foundation?**  
It depends on the foundation. At Monka, with HDS already in place, app + CRM + clinical engine went to production in two months. We don't give a generic timeline.

**Is The Vibe Company an HDS host?**  
No. We're not a health-data host. We build to HDS/GDPR requirements, usually inside the client's already-certified environment.

---

Need to frame hosting for a health AI project? [Book 30 minutes](https://cal.com/stangirard/thevibecompany).

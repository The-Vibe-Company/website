---
title: "AI and health data in France: what HDS really means for your project"
seoTitle: "HDS certification in France: who needs it for an AI project"
slug: ai-health-data-hds-france
language: en
translationKey: hds-health-data
summary: "AI and health data in France: who needs certification, the 6 HDS activities, the 2024 framework, GDPR and the CNIL. What to check before production."
seoDescription: "HDS certification in France for AI projects: who needs it, the 2024 framework, health data warehouses, the EHDS and CNIL formalities before production."
publishedAt: 2026-10-12
dateModified: 2026-11-26
complexity: intermediate
topics: AI Agents, Health Data, Security
coverImage: /images/resources/ia-donnees-de-sante-hds/cover-mascotte.webp
coverAlt: "A diagram shows a health record moving between the app, the AI model and an HDS-certified host"
ogImage: /images/resources/ia-donnees-de-sante-hds/cover-mascotte.webp
---

AI projects in healthcare rarely stall on the model. They stall the day someone asks: "So where does the data live?"

**HDS certification in France, in brief.** HDS is the certification French law requires from anyone who hosts personal health data on behalf of a third party or the patient (article L.1111-8 of the Public Health Code). An AI project needs a certified host once a provider hosts, administers or backs up its health data, model calls, logs and indexes included.

**The short answer.** Running an AI project on health data in France takes five things. Map the data flows (app, model, logs, backups). Pick a host with an HDS certificate under the 2024 framework, covering the activities you need. Keep model calls, logs and indexes inside that scope, or pseudonymize first. Sort out GDPR with your DPO: legal basis, impact assessment, CNIL formalities. And test without real data. The rest of this guide covers the framework. For the concrete hosting choice (activities, cloud, model calls), see [HDS hosting for AI](/en/resources/articles/hds-hosting-for-ai).

At that point the notebook demo isn't enough. You need to know who hosts, who administers, who backs up, and where the data goes when the app calls a model. In France, most of those answers come down to three letters: HDS.

We went through this with [Monka](/en/case-studies/monka). Inside their existing HDS environment, we built a caregiver app, a CRM for nurses and a clinical engine. In production in two months. Here's what to check, with official sources.

> This is not legal advice. For your specific case, talk to your DPO or a specialized lawyer.

## What is HDS certification in France?

HDS (Hébergeur de Données de Santé, health data host) certification guarantees that a host applies a security level suited to personal health data. It's issued by an accredited independent certification body, based on a framework published by France's Agence du Numérique en Santé ([esante.gouv.fr](https://esante.gouv.fr/produits-services/hds)).

The obligation comes from article L.1111-8 of the French Public Health Code: anyone hosting health data collected during prevention, diagnosis, care or social-medical follow-up, on behalf of a third party or the patient, must be certified.

## Who needs HDS certification, and who doesn't necessarily?

It all hinges on "on behalf of". Certification targets whoever hosts or operates the data for someone else.

- **The host** (cloud, managed services, backup provider) must be certified for the activities it performs.
- **The software vendor or startup** running its app on a certified host doesn't necessarily need its own certification. But if it runs the infrastructure or information system holding the data itself, it may fall in scope (activity 5 below).
- **The development agency** building the app isn't a host by default. It depends on who has production access.

The question to ask at kickoff: who will actually have access to the servers and databases?

## The 6 activities of the HDS framework

The framework splits hosting into six activities, and hosts are certified activity by activity ([framework, esante.gouv.fr](https://esante.gouv.fr/produits-services/hds)):

1. **Physical sites**: providing and maintaining the premises that house the hardware of the information system processing health data.
2. **Hardware infrastructure**: providing and maintaining the servers and equipment of that system.
3. **Virtual infrastructure**: providing and maintaining the virtual infrastructure of the health information system.
4. **Application hosting platform**: providing and maintaining the platform that hosts the applications.
5. **Administration and operations** of the information system containing health data.
6. **External backup** of health data.

The official wording is in [article R.1111-9 of the French Public Health Code](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000036658481). People often say "levels". They're really activities, not tiers, and a host picks which ones it gets certified for.

A simple reading, which Stan Girard laid out in ["Comprendre la certification HDS en 5 minutes"](https://www.theodo.com/blog/comprendre-la-certification-hds-en-5-minutes) (in French, on the Theodo blog):

- **activities 1 and 2: physical infrastructure host**, for those owning and running their own servers and data centers;
- **activities 3 to 6: managed-services host**, covering the application environment: platform, operations, day-to-day security and backups.

An example from the same article: a big cloud provider can be certified on all six activities while not every one of its services is usable for health data, and without offering managed operations (activity 5) itself. You then need a certified managed-services provider, or to get your own operations certified.

HDS also builds on ISO 27001, adding health-specific (largely contractual) requirements. For a host, compliance typically takes one to two years.

In practice, check that your host's certificate covers the activities you hand over. The word "HDS" on its homepage isn't enough. A cloud certified on activities 1 to 4 doesn't cover administration of your application if your own team runs it.

## What changed with the 2024 HDS framework?

The revised framework was published in the French Official Journal on May 16, 2024 ([ANS](https://esante.gouv.fr/espace-presse/publication-au-journal-officiel-du-referentiel-de-certification-hds-souverainete-des-donnees-et-ameliorations-du-referentiel)):

- new applicants have been assessed against it since **November 16, 2024**;
- already-certified hosts had until **May 16, 2026** to move to the new version;
- the revision adds sovereignty requirements:
  - health data must be hosted and stored in the European Economic Area (EEA), and the host must tell the client where;
  - any access from outside the EEA must be governed and disclosed in the contract, with its risks;
  - if the host or a subcontractor is subject to a non-EU law without adequate protection under GDPR, it must tell the client and explain the risk of unauthorized access;
  - the host must publish a map of possible data transfers outside the EEA.

These rules enforce transparency. They don't make a host immune to extraterritorial laws. How much risk is acceptable is your call.

Since May 16, 2026, an HDS certificate issued under the old framework should therefore no longer be valid. Ask for the current certificate, with its dates and activities.

## Where does AI complicate HDS: models, APIs and logs?

An AI project opens data paths that a classic application doesn't have. Those are the ones to map:

- **The model call.** Sending a patient record to an LLM API means the data leaves your host. You need to know where the call is processed, whether requests are retained, and whether the provider is covered for health data. If not, pseudonymize before the call or run the model in an HDS environment.
- **Logs and observability.** Prompt and response traces often contain health data in clear text. Keep them at the same security level as the main database.
- **Embeddings and search indexes.** A vector store built from medical reports contains health data, so it's in scope. We explain how this kind of setup works in ["Enterprise RAG"](/en/resources/articles/enterprise-rag).
- **Test environments.** No real patient data in an uncertified demo environment.
- **Agent permissions.** An agent that can read a record doesn't necessarily need to edit it.

## Which GDPR and CNIL obligations come on top of hosting?

HDS covers hosting. GDPR covers the whole processing. Health data is sensitive data, and the CNIL has published recommendations for developing AI systems ([cnil.fr](https://www.cnil.fr/fr/ia-finalisation-recommandations-developpement-des-systemes-ia)):

- check that you may use the data for this purpose;
- limit the data to what is necessary;
- set a retention period;
- assess the risks to individuals, often through a data protection impact assessment (DPIA) when health data is processed at scale;
- plan security measures such as encryption.

The CNIL also notes that a model trained on personal data may itself remain subject to GDPR. Planning to train or fine-tune a model on patient data? Settle that point before the first line of code.

In March 2026, the CNIL published a guidance sheet on AI in healthcare ([cnil.fr](https://www.cnil.fr/fr/ia-et-sante-developper-et-evaluer-des-systemes-ia-conformes)). It treats developing an AI system for healthcare as research, a study or an evaluation in the health field. In most cases that means a prior formality: a declaration of conformity with a reference methodology (MR-001, MR-003 or MR-004), or an authorization request if the project falls outside it. The sheet covers building datasets, development and evaluation. Simply deploying a tool someone else built is not covered there.

## Training a model on a health data warehouse: what are the rules?

A health data warehouse (entrepôt de données de santé, or EDS) has its own CNIL framework, and its hosting still falls under HDS. Many healthcare AI projects start there, with a database that pools records for research.

- **The CNIL's EDS framework**, adopted in October 2021 ([cnil.fr](https://www.cnil.fr/fr/la-cnil-adopte-un-referentiel-sur-les-entrepots-de-donnees-de-sante)), lets a warehouse declare conformity instead of requesting prior authorization. It only covers warehouses based on a public interest mission. A private company building a warehouse for its own research on the basis of legitimate interest is outside it and needs an individual authorization from the CNIL.
- **Hosting stays HDS.** The EDS framework requires the processor that hosts, stores or keeps the data to be an HDS-certified host ([CNIL, map of health data warehouses](https://cartoeds.beta.cnil.fr/a-propos)).
- **Building the warehouse and using it are separate formalities.** The declaration covers building the warehouse. Training or evaluating a model on its data goes through its own formality, either a reference methodology or a research authorization.

So an AI project starts with two questions: where is the data hosted, and under which regime was the warehouse built?

## What does the EHDS, the EU regulation, change for an AI project?

The European Health Data Space (EHDS) is Regulation (EU) 2025/327. It was published in the Official Journal of the EU on March 5, 2025 and entered into force on March 26, 2025 ([European Commission](https://health.ec.europa.eu/ehealth-digital-health-and-care/european-health-data-space-regulation-ehds_en)). Its obligations apply in stages, starting in 2027.

| Date | What applies |
|---|---|
| March 26, 2025 | Entry into force and start of the transition. No operational obligations yet. |
| March 26, 2027 | General application of the regulation, with the Commission's first implementing acts. |
| March 26, 2029 | Exchange of the first group of data (patient summary, ePrescription and eDispensation) and secondary use rules for most data. |
| March 26, 2031 | Second group (medical imaging, lab results, discharge reports) and secondary use of further categories such as genomic data. |

Secondary use is the part that concerns AI: reusing health data for research, innovation or model training through health data access bodies. As of November 2026, none of it replaces HDS or the CNIL formalities. A project launched today follows the French framework and plans for secondary data access to change from 2029.

## Which text governs what?

Five texts overlap, and HDS only covers hosting.

| Text | What it governs | When it affects an AI project |
|---|---|---|
| HDS (article L.1111-8 of the Public Health Code) | Hosting health data on behalf of a third party | As soon as a provider hosts or administers the data |
| GDPR | The whole processing: purpose, legal basis, retention, rights | Always, from the design stage |
| CNIL health formalities (MR-001, MR-003, MR-004 or authorization) | Research, studies and evaluations in the health field | To train or evaluate a model on this data |
| CNIL EDS framework | Building a public interest health data warehouse | If the project relies on a data warehouse |
| EHDS (Regulation (EU) 2025/327) | Exchange and reuse of health data across the EU | Gradually, from 2027 |

## Checklist before starting an AI project on health data

1. List all data processed and confirm which is health data.
2. Map the flows: app, database, AI model, logs, backups, third-party tools.
3. Pick a host whose current HDS certificate (2024 framework) covers the needed activities, and read its map of transfers outside the EEA.
4. Decide who administers production, and whether that brings them into activity 5.
5. For every model call: processing in a covered environment, or pseudonymized data.
6. Encrypt data at rest and in transit, and restrict access to the minimum.
7. Run the GDPR analysis with your DPO: legal basis, retention, DPIA if needed.
8. If you train or evaluate a model on this data, identify the CNIL formality (reference methodology or authorization) before you start.
9. Keep test environments free of real data.

For the next step, from prototype to production, see our [AI agent POC to production checklist](/en/resources/articles/ai-agent-poc-to-production).

## Where to go next for concrete hosting?

This guide covers the framework: who needs certification, what the 2024 framework and the CNIL require, and the checklist before you start. The concrete hosting choice (certified cloud, activities to cover, where model calls, logs and backups live) is detailed in [HDS hosting for AI](/en/resources/articles/hds-hosting-for-ai). This one covers the regulatory "why", the other the infrastructure "how".

## What we learned at Monka

Monka supports family caregivers with coordination nurses. When we arrived, Monka was already HDS-hosted and compliant. Our job was to build fast inside that environment. In two months we shipped the caregiver app, Lifeline (the nurses' CRM) and the clinical engine that turns a 165-question assessment into an action plan. The clinical reference went through 12 versions.

The lesson: when the HDS foundation already exists, an AI project can move very fast as long as it stays inside that environment. No data leaves it, and logs and test environments live inside it too. So you can iterate fast without reopening compliance at every release.

[Read the Monka case study →](/en/case-studies/monka)

## FAQ

### Does a startup using an HDS-certified cloud need its own certification?

Not necessarily. If the certified host covers all hosting and operations activities, the vendor can rely on it. If the vendor administers the information system holding the data itself, it may fall under activity 5. The contract and how access is split make the difference. Also check that the certificate covers the activities you actually hand over. The word "HDS" on a marketing page isn't enough.

### Can we use ChatGPT, Claude or Mistral with health data?

Not the consumer versions. You need an environment whose hosting and contract cover health data, or data pseudonymized before the call. Check the exact contract, processing region and request retention.

### Is the 2024 HDS framework already mandatory?

Yes. New applicants have been assessed against it since November 16, 2024, and hosts that were already certified had to migrate by May 16, 2026 at the latest.

### Do you need a DPIA for an AI project on health data?

Often, yes. The CNIL publishes a list of processing operations that require a data protection impact assessment ([cnil.fr](https://www.cnil.fr/fr/liste-traitements-aipd-requise)). Processing that isn't on the list can still need one if it meets at least two of the nine European criteria, for example sensitive data and large-scale processing. Your DPO makes the call, ideally before development starts.

### Do you need to file anything with the CNIL for a healthcare AI project?

To train or evaluate a model on health data, usually yes. Under the CNIL's March 2026 guidance, that's a declaration of conformity with a reference methodology (MR-001, MR-003 or MR-004), or an authorization request if the project doesn't fit.

### Does a vector store built from patient records have to stay in HDS?

Yes. Embeddings, indexes and source text taken from patient records contain health data. Treat them like the main database: hosted by a host certified for the relevant activities, with the same access rules.

### Does a healthcare AI voice agent need HDS hosting?

Yes, once it processes health data collected during care or follow-up and a provider hosts that data on behalf of the healthcare organization. Audio recordings, transcripts and the summaries the agent generates are health data. They follow the same rule as the patient record, and so do the agent's logs.

### Are HDS and GDPR the same thing?

No. HDS is about hosting health data. GDPR covers the whole processing: purpose, legal basis, data minimization, retention period and the rights of individuals.

### How do you choose an HDS host for an AI project?

Start with the certificate activities (2024 framework), the map of transfers outside the EEA, and the path of model calls, logs and backups. A cloud certified on activities 1 to 4 doesn't cover administration of your application if you run it yourself. The practical detail (what to ask the provider, where AI projects usually break) is in [HDS hosting for AI](/en/resources/articles/hds-hosting-for-ai).

### How long does it take to ship an AI project in healthcare?

It depends on scope. At Monka, the app, CRM and clinical engine were in production in two months because the HDS foundation already existed and all development stayed inside it.

## Working on an AI project with health data?

The Vibe Company is an AI agency in Paris, founded in 2024 by Stan Girard and Antoine Dewez and backed by Y Combinator. Health data (HDS) and security are among our specialties, along with frontend and DevOps. We work with mid-size and large companies, from data mapping to production.

[Need a healthcare AI project in production?](/en/healthcare-ai-hds) Our Healthcare AI & HDS page covers what we deliver and how we start.

[Book 30 minutes to discuss your project →](https://cal.com/stangirard/thevibecompany)

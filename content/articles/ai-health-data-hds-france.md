---
title: "AI and health data in France: what HDS really means for your project"
seoTitle: "AI projects on health data: HDS guide | The Vibe Company"
slug: ai-health-data-hds-france
language: en
translationKey: hds-health-data
summary: "HDS certification, the 6 hosting activities, the 2024 framework and GDPR: what to check before putting an AI project on French health data into production."
publishedAt: 2026-10-12
complexity: intermediate
topics: AI Agents, Health Data, Security
coverImage: /images/resources/ia-donnees-de-sante-hds/cover-mascotte.webp
coverAlt: "A diagram shows a health record moving between the app, the AI model and an HDS-certified host"
ogImage: /images/resources/ia-donnees-de-sante-hds/cover-mascotte.webp
---

AI projects in healthcare rarely stall on the model. They stall the day someone asks: "So where does the data live?"

**The short answer.** Running an AI project on health data in France takes five things. Map the data flows (app, model, logs, backups). Pick a host with an HDS certificate under the 2024 framework, covering the activities you need. Keep model calls, logs and indexes inside that scope, or pseudonymize first. Sort out GDPR with your DPO: legal basis, impact assessment, CNIL formalities. And test without real data. The rest of this guide covers each point.

At that point the notebook demo isn't enough. You need to know who hosts, who administers, who backs up, and where the data goes when the app calls a model. In France, most of those answers come down to three letters: HDS.

We went through this with [Monka](/en/case-studies/monka). Inside their existing HDS environment, we built a caregiver app, a CRM for nurses and a clinical engine. In production in two months. Here's what to check, with official sources.

> This is not legal advice. For your specific case, talk to your DPO or a specialized lawyer.

## HDS in two sentences

HDS (Hébergeur de Données de Santé, health data host) certification guarantees that a host applies a security level suited to personal health data. It's issued by an accredited independent certification body, based on a framework published by France's Agence du Numérique en Santé ([esante.gouv.fr](https://esante.gouv.fr/produits-services/hds)).

The obligation comes from article L.1111-8 of the French Public Health Code: anyone hosting health data collected during prevention, diagnosis, care or social-medical follow-up, on behalf of a third party or the patient, must be certified.

## Who needs HDS certification (and who doesn't necessarily)

It all hinges on "on behalf of". Certification targets whoever hosts or operates the data for someone else.

- **The host** (cloud, managed services, backup provider) must be certified for the activities it performs.
- **The software vendor or startup** running its app on a certified host doesn't necessarily need its own certification. But if it runs the infrastructure or information system holding the data itself, it may fall in scope (activity 5 below).
- **The development agency** building the app isn't a host by default. It depends on who has production access.

The question to ask at kickoff: who will actually have access to the servers and databases?

## The 6 HDS activities

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

A big cloud provider can be certified on all six activities while not every one of its services is usable for health data, and without offering managed operations (activity 5) itself. You then need a certified managed-services provider, or to get your own operations certified.

HDS also builds on ISO 27001, adding health-specific (largely contractual) requirements. For a host, compliance typically takes one to two years.

Check that your host's certificate covers the activities you hand over. The word "HDS" on its homepage isn't enough.

## What changed with the 2024 framework

The revised framework was published in the French Official Journal on May 16, 2024 ([ANS](https://esante.gouv.fr/espace-presse/publication-au-journal-officiel-du-referentiel-de-certification-hds-souverainete-des-donnees-et-ameliorations-du-referentiel)):

- new applicants have been assessed against it since **November 16, 2024**;
- already-certified hosts had until **May 16, 2026** to move to the new version;
- the revision adds sovereignty requirements:
  - health data must be hosted and stored in the European Economic Area (EEA), and the host must tell the client where;
  - any access from outside the EEA must be governed and disclosed in the contract, with its risks;
  - if the host or a subcontractor is subject to a non-EU law without adequate protection under GDPR, it must tell the client and explain the risk of unauthorized access;
  - the host must publish a map of possible data transfers outside the EEA.

These rules enforce transparency. They don't make a host immune to extraterritorial laws.

So in October 2026, ask for an up-to-date certificate, with its dates and activities.

## Where AI complicates things: models, APIs and logs

- **The model call.** Sending a patient record to an LLM API means the data leaves your host. You need to know where the call is processed, whether requests are retained, and whether the provider is covered for health data. If not, pseudonymize before the call or run the model in an HDS environment.
- **Logs and observability.** Prompt and response traces often contain health data in clear text. Keep them at the same security level as the main database.
- **Embeddings and search indexes.** A vector store built from medical reports contains health data, so it's in scope. We explain how this kind of setup works in ["Enterprise RAG"](/en/resources/articles/enterprise-rag).
- **Test environments.** No real patient data in an uncertified demo environment.
- **Agent permissions.** An agent that can read a record doesn't necessarily need to edit it.

## GDPR and CNIL: obligations don't stop at hosting

HDS covers hosting. GDPR covers the whole processing. Health data is sensitive data, and the CNIL has published recommendations for developing AI systems ([cnil.fr](https://www.cnil.fr/fr/ia-finalisation-recommandations-developpement-des-systemes-ia)): check you may use the data for this purpose, minimize it, set a retention period, assess risks to individuals (often through a DPIA), and plan security measures such as encryption. The CNIL also notes that a model trained on personal data may itself remain subject to GDPR.

In March 2026, the CNIL published a guidance sheet on AI in healthcare ([cnil.fr](https://www.cnil.fr/fr/ia-et-sante-developper-et-evaluer-des-systemes-ia-conformes)). It treats developing an AI system for healthcare as research, a study or an evaluation in the health field. In most cases that means a prior formality: a declaration of conformity with a reference methodology (MR-001, MR-003 or MR-004), or an authorization request if the project falls outside it. The sheet covers building datasets, development and evaluation. Simply deploying a tool someone else built is not covered there.

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

## What we learned at Monka

Monka supports family caregivers with coordination nurses. When we arrived, Monka was already HDS-hosted and compliant. Our job was to build fast inside that environment. In two months we shipped the caregiver app, Lifeline (the nurses' CRM) and the clinical engine that turns a 165-question assessment into an action plan. The clinical reference went through 12 versions.

The lesson: when the HDS foundation already exists, an AI project can move very fast as long as it stays inside that environment. No data leaves it, and logs and test environments live inside it too. So you can iterate fast without reopening compliance at every release.

[Read the Monka case study →](/en/case-studies/monka)

## FAQ

### Does a startup using an HDS-certified cloud need its own certification?

Not necessarily. If the certified host covers all hosting and operations activities, the vendor can rely on it. If the vendor administers the information system holding the data itself, it may fall under activity 5.

### Can we use ChatGPT, Claude or Mistral with health data?

Not the consumer versions. You need an environment whose hosting and contract cover health data, or data pseudonymized before the call. Check the exact contract, processing region and request retention.

### Is the 2024 HDS framework already mandatory?

Yes. New applicants since November 16, 2024; existing hosts had to migrate by May 16, 2026.

### Do you need a DPIA for an AI project on health data?

Often, yes. The CNIL publishes a list of processing operations that require a data protection impact assessment ([cnil.fr](https://www.cnil.fr/fr/liste-traitements-aipd-requise)). Processing that isn't on the list can still need one if it meets at least two of the nine European criteria, for example sensitive data and large-scale processing. Your DPO makes the call, ideally before development starts.

### Do you need to file anything with the CNIL for a healthcare AI project?

To train or evaluate a model on health data, usually yes. Under the CNIL's March 2026 guidance, that's a declaration of conformity with a reference methodology (MR-001, MR-003 or MR-004), or an authorization request if the project doesn't fit.

### Does a vector store built from patient records have to stay in HDS?

Yes. Embeddings, indexes and source text taken from patient records contain health data. Treat them like the main database: hosted by a host certified for the relevant activities, with the same access rules.

### Are HDS and GDPR the same thing?

No. HDS is about hosting health data. GDPR covers the whole processing.

### How long does it take to ship an AI project in healthcare?

It depends on scope. At Monka, the app, CRM and clinical engine were in production in two months because the HDS foundation already existed and all development stayed inside it.

## Working on an AI project with health data?

The Vibe Company is an AI agency in Paris, founded in 2024 by Stan Girard and Antoine Dewez and backed by Y Combinator. Health data (HDS) and security are among our specialties, along with frontend and DevOps. We work with mid-size and large companies, from data mapping to production.

[Need a healthcare AI project in production?](/en/healthcare-ai-hds) Our Healthcare AI & HDS page covers what we deliver and how we start.

[Book 30 minutes to discuss your project →](https://cal.com/stangirard/thevibecompany)

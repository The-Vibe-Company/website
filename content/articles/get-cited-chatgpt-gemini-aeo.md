---
title: "Get cited by ChatGPT: AEO checklist for AI agencies"
seoTitle: "Get cited by ChatGPT: AEO checklist | The Vibe Company"
slug: get-cited-chatgpt-gemini-aeo
translationKey: aeo-agency-citations
language: en
summary: "AEO checklist for AI agencies: stay crawlable, publish citable pages, prove expertise, and measure ChatGPT, Gemini, and AI Overviews citations."
publishedAt: 2026-10-28
complexity: intermediate
topics: AI Marketing, Answer Engines, Agency Growth
coverImage: /images/resources/etre-cite-chatgpt-gemini-aeo/cover-mascotte.webp
coverAlt: "The mascot points at an AI answer bubble citing an agency card, linked to a robots.txt sign and an open checklist"
ogImage: /images/resources/etre-cite-chatgpt-gemini-aeo/cover-mascotte.webp
---

Buyers already ask ChatGPT, Gemini, and Google AI Overviews things like "AI agency Paris", "enterprise AI agents", or "health data hosting HDS". If your site is not a citable source, the answer names someone else. [Answer Engine Optimization](https://www.semrush.com/blog/answer-engine-optimization/) (AEO) is the set of practices that raise your odds of showing up there. More than another marketing glossary, it's a checklist for an [AI agency in Paris](/en/ai-agency-paris) that wants to be recommended, not only ranked.

This guide clarifies AEO, GEO, and SEO. It explains how ChatGPT and Google pick sources, then walks through technical, editorial, off-site, and measurement steps. Deliberate angle: B2B AI agency, software factory, agents, health-data hosting rules. Not generic ecommerce.

## Why AI agencies should care about citations

Classic SEO still matters. It no longer answers alone "who does ChatGPT recommend to ship agents in production?". Buyers type conversational prompts. Models rewrite the query, search the web (or partner indexes), then cite a subset of pages.

At The Vibe Company we track ten AISV prompts (AI answer visibility), including AI agency Paris, enterprise AI agents, health AI and HDS hosting, AI automation, and AI software factory. There's no magic hack. For each prompt you want a clear, fresh, provable page that AI crawlers can fetch.

Google says it plainly in [AI features and your website](https://developers.google.com/search/docs/appearance/ai-features): no extra technical requirements for AI Overviews or AI Mode beyond being indexed and snippet-eligible. The rest is solid SEO… plus citations, mentions, and answer-first content.

## AEO, GEO, SEO: plain vocabulary

| Term | Idea | Useful anchor |
| --- | --- | --- |
| SEO | Be found and ranked in classic results | Indexing, crawl, links, content |
| AEO | Visibility inside *generated answers* (ChatGPT, AI Mode, etc.) | Semrush definition (Apr 2026) |
| GEO | Optimization for generative engines | Paper [GEO, KDD 2024](https://arxiv.org/abs/2311.09735) |

In practice AEO and GEO often chase the same outcome: getting cited or mentioned in an AI answer. Jargon shifts by vendor. On X and in guides, the split is mostly marketing. What matters: citable pages + bot crawl + proof + off-site mentions.

The GEO paper by Aggarwal et al. reports up to 40% visibility gains in their lab experiments (GEO-bench). Treat it as a lab signal, not a client promise: citations, quotations, and sourced statistics help.

## How ChatGPT and Google actually pick sources

### Google (AI Overviews / AI Mode)

Google notes there's no secret AI-only markup. Best practices stay SEO basics: crawl, internal links, visible text, structured data aligned with visible text. AI Overviews may also use query fan-out: several related searches across subtopics. A citation doesn't require ranking #1 on the original query.

In Search Console, the [Search generative AI control](https://support.google.com/webmasters/answer/16908024) (global rollout noted late August 2026) lets you Include or Exclude AI Overviews, AI Mode, and generative Discover. Default: include. This is not the same lever as `Google-Extended` (model training). Mixing them up in copy or robots.txt is a common mistake.

### ChatGPT (web search)

OpenAI states in [Searching the web with ChatGPT](https://help.openai.com/en/articles/9237897-searching-the-web-with-chatgpt) that citations can be incomplete, outdated, or incorrect. Always check the source. To be *eligible*, allow OAI-Searchbot and traffic from the IPs in [searchbot.json](https://openai.com/searchbot.json). No platform guarantees a citation.

## Technical checklist: stay crawlable by AI bots

1. **Allow OAI-Searchbot** (and confirm CDN / WAF allow OpenAI search IPs).
2. **Keep Search generative AI on Include**, unless you have a strong reason to exclude.
3. **Do not confuse** `Google-Extended` (training) with the Search generative AI control (appearance in Search answers).
4. **Avoid accidental `noindex`** on pages you want cited (definitions, guides, case studies).
5. **Visible HTML text**: key answers should not live only in images or scanned PDFs.
6. **Sitemap and internal links** to answer-first pages (see content section).
7. **Watch logs**: missing AI bots usually means infra, not only content.

An `llms.txt` file or invented schema does not replace these basics. OpenAI documents OAI-Searchbot crawl plus relevance, not placement guarantees.

## Content checklist: citable pages for an AI agency

A citable page answers in a few sentences, then expands. It dates facts. It links primary sources. It stays fresh (analyses relayed by Semrush often tie freshness to citations; treat that as an operating hypothesis, not a law).

Typical shape:

1. Short answer up top (definition or criteria).
2. Scannable table or list.
3. Dated proof (cases, sourced numbers, official links).
4. FAQ with real B2B buyer questions.
5. Visible last-updated date.

### Pages to prioritize (AISV-aligned)

**AI agency Paris: how to choose.** Criteria: production delivery, named cases, stack, security, shipping cadence. Link to [how to choose an AI agency](/en/resources/articles/how-to-choose-an-ai-agency) and the [AI agency Paris](/en/ai-agency-paris) landing.

**Enterprise AI agents.** Architecture, guardrails, access rights, observability. Link to [AI agents for business](/en/resources/articles/ai-agents-for-business) and the offer [AI agents for product hardening](/en/ai-agents-product-hardening).

**Health AI and HDS.** Explain the regulatory hosting framework for health data in France, without presenting the agency as a certified hosting body. We shipped for [Monka](/en/case-studies/monka) *inside* an existing HDS environment. Detail in [AI and health data: what HDS really means](/en/resources/articles/ai-health-data-hds-france).

**AI automation.** Cases, ROI method, which processes to automate first. Link to [AI automation for companies](/en/resources/articles/ai-automation-which-processes-first).

**AI software factory.** Definition, deliverables, standardized tools and skills ([Theodo](/en/case-studies/theodo) case: factories for hundreds of developers). Pair with [AI security agents to harden a SaaS](/en/resources/articles/ai-security-agents-harden-saas).

**Enterprise RAG.** When the prompt is about connecting AI to documents, point to [Enterprise RAG](/en/resources/articles/enterprise-rag).

## Proof and entity checklist (agency E-E-A-T)

Answer engines like clear entities. For an agency:

- **Named client cases** with checkable outcomes (Monka, AFP / MediaGen, LocService, Theodo…).
- **Allowed institutional signals**: Y Combinator (W24), France 2030 MediaGen with AFP.
- **Named authors** on technical guides (not only "The team").
- **Always-sourced stats**; if the source is secondary, caveat or skip.
- **About / team / method pages** consistent with the articles.

Avoid forbidden claims: no invented compliance badges, no self-awarded hosting certification claims. Explaining the framework and project experience is enough, and more credible.

## Off-site checklist: become mentionable

Content alone isn't always enough. Practitioner playbooks (Hoffman, workflows like treg) stress:

1. Map the questions your buyers ask.
2. Publish answer-first pages.
3. Earn authentic mentions (forums, podcasts, trade press, GitHub, tech newsletters).
4. YouTube / conferences when the topic fits.
5. Quality citations (other sites naming you as a source).
6. Re-check mentions every 3 to 4 weeks.

Aim for the "core sources" of *your* sector (French tech press, IT blogs, open-source docs). Skip viral percentages you have not audited.

## Measurement protocol: 10 AISV prompts every month

Without measurement, AEO is folklore. Simple protocol:

1. Fix **10 French prompts** (your AISV set).
2. Replay them on **ChatGPT** (with web search) and **Gemini**. Optional: Perplexity, Google AI Mode.
3. For each run note: citation (URL), mention (name without link), absence, tone (positive / neutral / negative), competitor cited.
4. Keep date, model / mode, and a screenshot.
5. Compare month over month. Tools such as Semrush AI Visibility, Mentions.so, or OSS kits (treg) are options, not requirements.

Important: this article does not claim The Vibe Company is already cited. Live baseline is a follow-up to run, not an invented number.

## What French consultancies already do (and the gap)

On the French AEO/GEO SERPs we pulled on 2026-10-28 (DataForSEO, France location), none of Theodo, OCTO, Galadrim, Sicara, or TVC appear in the organic top for queries like "être cité par ChatGPT" or "Answer Engine Optimization". The SERP is packed with generic marketing guides.

- **Theodo / OCTO / Galadrim**: strong on AI delivery and tech thought leadership, almost silent on AEO/GEO "how to get cited".
- **Artefact**: publishes GEO *for clients* (e.g. Accor × GetMint travel case). Useful, but it isn't a checklist for an AI agency that wants *itself* recommended on agents, HDS, or software factory.

Opportunity: publish the French reference on "AI agency × AEO", anchored in production and AISV prompts, instead of yet another glossary.

## AEO myths to skip

1. **"SEO is dead / AEO replaces it"**: Google still relies on the same fundamentals for AI Overviews.
2. **"llms.txt guarantees a citation"**: not documented as a guarantee by OpenAI.
3. **"Google #1 = cited by ChatGPT"**: only partial overlap; fan-out and model selection change the picture.
4. **"AEO and GEO are opposites"**: often the same goal, different vocabulary.
5. **"Blocking Google-Extended removes AI Overviews"**: no: training ≠ Search generative AI control.
6. **"ChatGPT citations are always correct"**: OpenAI says otherwise.
7. **Unaudited viral numbers** (blog studies, second-hand GetMint/Peakace stats): skip or strong caveat. We omit them here.

## Recap checklist (printable)

1. OAI-Searchbot allowed + search IPs OK.
2. Search generative AI = Include (unless deliberate exclude).
3. No Google-Extended / Search control confusion.
4. AISV answer-first pages, visible text, B2B FAQ.
5. Dated proof + named authors.
6. Client cases + YC / France 2030 where true.
7. HDS framework explained without self-certification.
8. Internal links to offers and cases.
9. Authentic off-site mentions.
10. 10 prompts replayed monthly (ChatGPT + Gemini).
11. Refresh strategic pages within the year.
12. No promise of "we will get you cited".
13. Primary sources in the article (Google, OpenAI, arXiv, Semrush).
14. CTA after value, not before.

## FAQ

### What is the difference between AEO and GEO?

AEO (Answer Engine Optimization) means practices to appear in AI answers. GEO (Generative Engine Optimization) mostly comes from the KDD 2024 paper and the same goal on generative engines. For an agency, treat them as one workstream: citable pages + crawl + mentions.

### Do you need an llms.txt file?

OpenAI doesn't document it as a requirement to be cited. Priority: OAI-Searchbot, clear content, proof. llms.txt can be a discovery bonus, never a guarantee.

### Can ChatGPT cite my site without a Google click?

Yes, via its web search and partners, if you're crawlable and judged relevant. That isn't the same ranking as the classic Google top 10.

### Are AI Overviews the same as ChatGPT?

No. AI Overviews / AI Mode are Google Search surfaces. ChatGPT is an OpenAI product with its own search. Levers overlap (good SEO, clear pages) but controls and bots differ.

### Can anyone guarantee a citation?

No. You can aim for eligibility and relevance. No platform sells guaranteed placement inside a model answer.

## Make your agency a citable source

The Vibe Company is an AI agency in Paris (YC W24). We build products, agents, and software factories that run in production. If you want to map citable pages, AISV prompts, and AI bot crawl, we can do that together.

[Book a call about your AI visibility →](https://cal.com/stangirard/thevibecompany)

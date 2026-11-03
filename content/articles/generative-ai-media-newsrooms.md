---
title: "Generative AI in media: 7 practical newsroom use cases"
seoTitle: "Generative AI in media: 7 newsroom use cases"
slug: generative-ai-media-newsrooms
translationKey: generative-ai-media-newsrooms
language: en
summary: "Generative AI in media: 7 practical newsroom use cases, with sourced examples, guardrails, the AI Act and Paris Charter, and where to start."
publishedAt: 2026-11-02
complexity: beginner
topics: AI Adoption, AI Agents, Strategy
coverImage: /images/resources/ia-generative-medias/cover-mascotte.webp
coverAlt: "The mascot holds a magnifying glass on a newsroom desk, watching a small press turn a newspaper into video, podcast and mobile formats, in front of archive drawers"
ogImage: /images/resources/ia-generative-medias/cover-mascotte.webp
---

**The short answer.** In media, generative AI is mostly used for seven things: transcribing and translating, monitoring sources, searching archives, repurposing a story into several formats, helping with editing (headlines, summaries, metadata), going through documents for an investigation, and checking quality before publication. It doesn't replace reporting or the decision to publish. The use cases that work all share one trait: the tool prepares, a journalist checks and signs off.

You've probably seen plenty of demos of ChatGPT "writing an article". Newsrooms mostly save time somewhere else, on the background tasks that eat the day: transcribing an hour-long interview, sorting 400 press releases, finding a 2009 photo in a badly indexed collection. Below are the seven use cases, each with a real example and its guardrail.

## Where newsrooms stand

The Reuters Institute report [Journalism, media and technology trends and predictions 2026](https://reutersinstitute.politics.ox.ac.uk/journalism-media-and-technology-trends-and-predictions-2026) surveyed 280 media leaders in 51 countries. A few numbers:

- **97%** say back-end automation matters: transcription, editing help, metadata.
- **82%** mention newsgathering, and **81%** coding and product development.
- **44%** describe the results of their AI projects as "promising", **42%** as "limited".
- **67%** say they haven't cut any jobs thanks to AI.

So everyone's trying, and few projects really change much. What makes the difference is picking the right use case and plugging it into the actual daily work.

## The 7 practical use cases

### 1. Transcribe, translate, subtitle

It's the most common use case, and the least risky. An interview, a press conference or a video becomes searchable text in minutes, then a working translation.

For a sense of scale: according to the Reuters Institute, the New York Times transcribed thousands of podcasts and videos to analyze Charlie Kirk's public statements. The work took two weeks. Comparable investigations used to take a year or more.

**Guardrail:** a transcript is for searching and quoting, not for publishing as is. Every quote used in a story gets checked against the recording.

### 2. Augmented monitoring

Ask a newsroom what hurts and an overloaded monitoring feed comes up fast. Generative AI pulls sources together (media, social networks, press releases), groups what covers the same story, summarizes it and sends alerts.

Two examples cited by the Reuters Institute: Finland's Helsingin Sanomat runs bots that monitor public Russian-language Telegram channels and alert journalists. Reuters uses FactGenie, which extracts the key facts from press releases so journalists can check them fast. 150 journalists use it, and the average time to send some alerts has been cut in half.

**Guardrail:** monitoring suggests, it never publishes. Every alert links back to its original source so it can be checked in one click.

### 3. Search the archives

Many media outlets sit on huge text, photo and video collections they barely use, because keyword search only finds what was indexed well. Semantic and multimodal search lets you search by meaning ("farmers protesting outside a prefecture, at night") and find images and video clips, not just articles.

Under the hood, it's RAG applied to an archive. We explain how it works in our guide to [enterprise RAG](/en/resources/articles/enterprise-rag).

**Guardrail:** the tool must show the source document, its date and its usage rights. Pull an archive item without its context and you're setting yourself up for a mistake.

### 4. Repurpose a story into several formats

One story has to live as an article, a short mobile version, a video script, a newsletter, sometimes audio. Generative AI drafts these versions from the approved story.

**Guardrail:** always start from text that has already been edited, never from a raw wire. Every version is reviewed before publication, because a summary can shift the meaning of a sentence.

### 5. Help with editing

Headline options, standfirsts, summaries, alt text for images, keywords and metadata, applying the house style guide inside the CMS. The Reuters Institute lists these among the use cases already common in newsrooms.

**Guardrail:** the AI offers several options, the sub-editor picks. A headline that promises more than the story is an editorial problem, whether the tool wrote it or not.

### 6. Go through documents for an investigation

Public reports, court rulings, budgets, leaks of thousands of pages: AI can read at scale, extract entities, flag inconsistencies and point to the passages to read first. The Reuters Institute cites iTromsø, a local Norwegian outlet, whose tool Djinn digs through public documents and has led to several scoops. The newsroom says it gives reporters more time out in the field.

**Guardrail:** AI finds leads, journalists establish facts. Everything that comes out of automated document review gets cross-checked by hand.

### 7. Check quality before publication

This one gets the least attention and may be the most useful: reading a story to catch a number that doesn't match the source, biased wording, a misspelled name, a claim with no attribution. It's also one of the three tools in AFP's MediaGen project: spotting bias that would hurt the quality of information.

**Guardrail:** the tool flags, it doesn't silently fix. The journalist sees every alert and decides.

## What not to automate

In January 2023, CNET had to correct 41 of its 77 AI-generated finance stories after an internal audit, according to [The Verge](https://www.theverge.com/2023/1/25/23571082/cnet-ai-written-stories-errors-corrections-red-ventures). Calculation errors, vague wording, passages lifted from elsewhere. The site said editors were reviewing them.

On the other hand, the Associated Press has automated quarterly earnings stories since 2014, from structured data and templates written by its journalists. It went from about 300 to 3,000 stories per quarter, according to [The Verge](https://www.theverge.com/2015/1/29/7939067/ap-journalism-automation-robots-financial-reporting). That wasn't generative AI yet, but the lesson holds: automate what is structured and verifiable, within a frame set by the newsroom. Not reporting, not analysis, not editorial judgment.

## The framework: Paris Charter and AI Act

Two texts act as a compass in Europe.

The [Paris Charter on AI and Journalism](https://rsf.org/en/paris-charter-ai-and-journalism), published by RSF and its partners in November 2023, sets out ten principles. The most practical ones: human decision-making stays central, the media outlet is responsible for everything it publishes, and any use of AI that has a significant impact on content is disclosed to the public. The charter also asks outlets to keep a public register of the AI systems they use.

[Article 50 of the AI Act](https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-50), in force since August 2, 2026, requires disclosure of AI-generated or AI-modified text published to inform the public on matters of public interest. The exception: the text has gone through human review or editorial control, and a person holds editorial responsibility for it. The [Commission FAQ](https://digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act) adds that a light review, like a spell check, isn't enough. It takes a real check of the substance.

In practice, the right habit is the same in both cases: a named human reviews the substance and signs off.

## A newsroom opens its systems to content it doesn't control

This one often gets missed. A monitoring or document review tool reads outside content by design: press releases, web pages, PDFs from an unknown source. That's exactly where indirect prompt injection lives, the top vulnerability in the [OWASP LLM01:2025](https://genai.owasp.org/llmrisk/llm01-prompt-injection/) ranking: an instruction hidden in a document changes the behavior of the model reading it.

Part of that defence can be handed to agents. A control agent replays a set of booby-trapped documents every time the tool changes, checks that the assistant only has read access and never the right to publish in the CMS, and that access keys don't end up in prompts or logs. We go into this approach in [AI security agents to harden a SaaS](/en/resources/articles/ai-security-agents-harden-saas).

## What we're building with AFP in MediaGen

[MediaGen](/en/case-studies/afp) is AFP's generative AI project, selected under France 2030 and backed by Bpifrance, with a total budget of €4M over 24 months. The consortium brings together Quivr/The Vibe Company, Kairntech and Dawex. The project will deliver three tools to newsrooms:

- **Augmented monitoring**, which pulls together and analyzes media, social networks and press releases in real time.
- **Multimodal search** across text, photo and video archives, with 90 million documents made searchable.
- **Production support**, which turns one piece of information into several formats and flags bias that would hurt its quality.

Some components will be released under an open license. And everything is designed to stay under journalists' control. In the [launch press release](https://www.afp.com/en/agency/inside-afp/press-release/afp-launches-mediagen-generative-ai-project-media), AFP CEO Fabrice Fries describes MediaGen as one of the few France 2030 projects dedicated to the media, meant to show that AI innovation can serve reliable, responsible and independent information.

To be clear, The Vibe Company is a member of the technical consortium. We build the tools. We're not AFP, and we don't put together France 2030 applications. For an overview of funding options, see [funding an AI project: CIR, CII and France 2030](/en/resources/articles/fund-ai-project-france-cir-cii).

## Where to start

1. **Pick one painful workflow.** One desk's monitoring, interview transcription, photo search. Not "AI in the newsroom".
2. **Set measurable criteria.** Time saved, volume handled, and above all the acceptance rate by journalists: how many suggestions are kept as they are.
3. **Start in draft mode.** The tool suggests, nothing goes out without approval. Widen the scope once the numbers hold.
4. **Move to production properly.** Access rights, logs, tests, documentation, and someone in-house who can run the tool. Our [POC to production checklist](/en/resources/articles/ai-agent-poc-to-production) covers this step.

For details of our offer, see our [AI for media](/en/ai-for-media) page.

## FAQ

### What are the use cases of generative AI in media?

The seven most common: transcription and translation, monitoring, archive search, repurposing into several formats, editing help (headlines, summaries, metadata), document review for investigations and quality checks before publication. Back-end tasks are the most widespread: 97% of the leaders surveyed by the Reuters Institute say they matter.

### Will generative AI replace journalists?

The numbers say no for now: 67% of media leaders surveyed by the Reuters Institute in 2026 haven't cut any jobs thanks to AI. Useful tools prepare the work. Reporting, verification and the decision to publish stay human.

### Do you have to disclose that a story was written with AI?

Article 50 of the AI Act requires disclosure of AI-generated text published to inform the public, unless a human has reviewed its substance and a person holds editorial responsibility for it. The Paris Charter goes further and asks outlets to disclose any use of AI that has a significant impact on content.

### How do you avoid hallucinations in a newsroom tool?

By grounding answers in sources (archives, wires, documents) shown next to each answer, by measuring quality on a set of real cases, and by keeping human approval before anything is published. The CNET case in 2023, with 41 of 77 stories corrected, shows what happens when that approval is superficial.

### What is AFP's MediaGen project?

MediaGen is AFP's generative AI project, selected by France 2030 and backed by Bpifrance (€4M, 24 months). With Quivr/The Vibe Company, Kairntech and Dawex, it builds three tools for newsrooms: augmented monitoring, multimodal archive search and production support, under journalists' control.

## An AI tool for your newsroom?

The Vibe Company is an [AI agency in Paris](/en/ai-agency-paris). We build generative AI tools for newsrooms, all the way to production, and we work with AFP on MediaGen. In 30 minutes, we look at your feeds, sources and archives, and tell you which first tool makes sense.

[Book 30 minutes to talk →](https://cal.com/stangirard/thevibecompany)

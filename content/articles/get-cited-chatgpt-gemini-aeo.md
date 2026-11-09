---
title: "Get cited by ChatGPT: 6 AEO myths checked against sources"
seoTitle: "Get cited by ChatGPT: 6 AEO myths and their evidence"
slug: get-cited-chatgpt-gemini-aeo
translationKey: aeo-chatgpt-citations
language: en
summary: "Get cited by ChatGPT and Gemini: 6 common AEO beliefs settled with OpenAI and Google documentation and the SE Ranking study."
publishedAt: 2026-10-28
complexity: intermediate
topics: Answer Engines, AI Search, Content Marketing
coverImage: /images/resources/etre-cite-chatgpt-gemini-aeo/cover-mascotte.webp
coverAlt: "The mascot points at an AI answer bubble citing a web page, linked to a robots.txt sign and an open checklist"
ogImage: /images/resources/etre-cite-chatgpt-gemini-aeo/cover-mascotte.webp
---

To get cited by ChatGPT, a page first has to be eligible. OpenAI asks sites to allow OAI-SearchBot and traffic from the IPs published in [searchbot.json](https://openai.com/searchbot.json), with no placement guarantee. On the Google side, AI Overviews and AI Mode add no technical requirement beyond SEO. [Answer Engine Optimization](https://www.semrush.com/blog/answer-engine-optimization/) (AEO) covers these practices.

Buyers already ask ChatGPT, Gemini, and Google AI Overviews their questions. “Which tool for…”, “Who builds…”, “How do I choose…”. The model rewrites the query, searches the web, then cites a subset of pages. If your site isn't a clear, crawlable source, the answer cites someone else. And Google's French AI Overview for the query “être cité par ChatGPT” still bundles the 3 OpenAI bots into a single step.

:::summary{title="In short"}
- ChatGPT Search depends on OAI-SearchBot, just one of the 3 agents OpenAI describes.
- Bing Webmaster Tools is absent from OpenAI's eligibility page.
- Google-Extended has no effect on inclusion in Google Search, which suggests it does not touch AI Overviews.
- The 40% gain in the GEO paper is a lab result, obtained on GEO-bench.
- The 3.5 ratio published by SE Ranking is a correlation observed in its corpus.
:::

**How this was checked.** Each verdict points to an official OpenAI or Google page, the GEO paper, or the SE Ranking study, all reread on November 9, 2026. This article contains no citation measurement by The Vibe Company. At the end of the article, The Vibe Company offers to map your citable pages, so the author has a stake in the subject.

## Get cited by ChatGPT: 6 common beliefs settled by the sources

Each belief in this table is checked against a primary source, with a one-line verdict. The count of 6 is an editorial choice of this article, which keeps the beliefs from the published version and from Google results on November 9, 2026.

| What you hear | Verdict | Evidence |
|---|---|---|
| Allowing ChatGPT-User in robots.txt gets you cited | False: ChatGPT Search depends on OAI-SearchBot | OpenAI, Overview of OpenAI Crawlers |
| Do you need Bing Webmaster to get cited by ChatGPT? | Not written by OpenAI | OpenAI Help, Searching the web with ChatGPT |
| “llms.txt guarantees a citation” | False: negligible impact measured | llmstxt.org, SE Ranking (November 24, 2025) |
| “Blocking Google-Extended removes AI Overviews” | False by inference: a different lever | Google, Search generative AI control |
| “SEO is dead / AEO replaces it” | False: same fundamentals | Google, AI features and your website |
| GEO guarantees +40% and you need 32k backlinks | False: lab result on GEO-bench, SE Ranking correlation | GEO paper, SE Ranking study |

## OAI-SearchBot is the only one of the 3 OpenAI bots that drives ChatGPT Search

![Three OpenAI bots: only OAI-SearchBot drives ChatGPT Search. Detailed below.](/images/resources/get-cited-chatgpt-gemini-aeo/3-openai-bots-chatgpt-search.png)

OAI-SearchBot is, among OpenAI's 3 agents, the one that decides appearance in ChatGPT Search, according to the [Overview of OpenAI Crawlers](https://developers.openai.com/api/docs/bots) page reread on November 9, 2026. It serves search. It is “used to surface websites in search results in ChatGPT’s search features”. A site that refuses it “will not be shown in ChatGPT search answers, though can still appear as navigational links”.

GPTBot collects content for training foundation models. OpenAI specifies that “Each setting is independent of the others”. A site can therefore allow OAI-SearchBot and refuse GPTBot.

ChatGPT-User follows a different logic. It visits a page when a user, or an Action, triggers it. OpenAI spells it out. “ChatGPT-User is not used for crawling the web in an automatic fashion. Because these actions are initiated by a user, robots.txt rules may not apply. ChatGPT-User is not used to determine whether content may appear in Search.” A ChatGPT-User line in robots.txt therefore makes no site visible in ChatGPT Search.

**Instead.** Allow OAI-SearchBot in robots.txt, then check that your CDN or WAF lets through the IPs in [searchbot.json](https://openai.com/searchbot.json). Configure GPTBot on its own, according to your stance on training. Then watch your logs. AI bots missing from the logs point to an infrastructure problem.

## Bing Webmaster Tools is not among OpenAI's eligibility criteria

Many French guides make Bing Webmaster Tools a required step to get cited by ChatGPT. The myth even shows up in Google's French AI Overview, which states that ChatGPT Search relies largely on Bing's index. For OpenAI, the condition lies elsewhere. The evidence is in the eligibility criteria of its help page [Searching the web with ChatGPT](https://help.openai.com/en/articles/9237897-searching-the-web-with-chatgpt), reread on November 9, 2026, in the section “Make your website available in search results”. “To make a website eligible for inclusion, allow OAI-Searchbot to crawl the site and confirm that the website host or content delivery network allows traffic from OpenAI’s published searchbot IP addresses.”

Bing is not there. The same page also warns that “Placement is not guaranteed”. From this, one can infer that Bing may still help with Microsoft's index without being an eligibility criterion at OpenAI.

**Instead.** First check the OAI-SearchBot rule and access for OpenAI IPs at your host. Keep Bing Webmaster Tools as index hygiene, without expecting a citation from it.

## llms.txt is a proposal, and SE Ranking finds a negligible impact for it

An llms.txt file guarantees no citation, and OpenAI does not document it as a requirement to appear in ChatGPT Search. The [llms.txt](https://llmstxt.org/) file is a public proposal, which its site presents this way (“This is v2 of the proposal”). It stands apart from robots.txt, since “robots.txt and llms.txt have different purposes”. Its authors intend it mainly for model inference.

The [SE Ranking](https://seranking.com/blog/how-to-optimize-for-chatgpt/) study of November 24, 2025 covers 129,000 domains, 216,524 pages in 20 niches, and 100,000 prompts. Using a predictive model, it concludes that “Including LLMs.txt has shown negligible impact on ChatGPT citation likelihood.” That is a correlation. It follows that the study proves neither that the file helps nor that it hurts.

**Instead.** Treat llms.txt as a discovery bonus, once crawl and proof are in place. An invented schema does not replace these basics either.

## Google-Extended governs training, the Search generative AI control governs AI Overviews

![Two Google levers: Search generative AI for AI Overviews, Google-Extended for training. Detailed below.](/images/resources/get-cited-chatgpt-gemini-aeo/2-google-levers-ai-overviews.png)

The [Search generative AI control](https://support.google.com/webmasters/answer/16908024) in Search Console manages appearance in AI Overviews, AI Mode, and generative Discover. Its global rollout was noted in late August 2026. The choice is shown as “Include” or “Exclude”, with “Include” by default. After a change, content is excluded “within 1-2 days after the control goes live”. The page adds that “This control doesn't affect AI training”.

Google-Extended is the robots.txt token for Gemini and Vertex training, and for grounding in Gemini Apps. Its [documentation of Google's common crawlers](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers#google-extended), reread on November 9, 2026, is clear: “Google-Extended does not impact a site's inclusion in Google Search nor is it used as a ranking signal in Google Search.” The [October 30, 2026 post](https://developers.google.com/search/blog/2026/10/ai-training-control) adds a nuance. “Websites that specifically allow Google-Extended are eligible to appear in responses and receive clicks via grounding in Gemini Apps.”

From this, one can infer that blocking Google-Extended does not remove a site from AI Overviews, which are set in Search Console. This suggests that blocking it may also affect Gemini Apps.

**Instead.** Leave the Search generative AI control on “Include”, unless you have a strong business reason to exclude. Decide on Google-Extended separately, knowing it matters for Gemini Apps.

## AI Overviews and AI Mode rely on the technical requirements of SEO

AEO does not replace SEO on Google, according to the [AI features and your website](https://developers.google.com/search/docs/appearance/ai-features) page. To serve as a link in AI Overviews or AI Mode, a page must be indexed and eligible for a snippet. Google concludes that “There are no additional technical requirements”. So there is no secret “AI-only” markup.

These surfaces may also use a “query fan-out”, “issuing multiple related searches across subtopics and data sources”. A page can thus be cited without ranking #1 on the original query.

**Instead.** Keep the SEO basics. Crawl, internal links, the sitemap, and structured data aligned with the text remain the rule. Avoid accidental `noindex` on pages you want cited. A key answer should live in the visible HTML text, outside an image or a scanned PDF.

No need to invent an “AEO site”. A citable page answers in a few sentences, then expands. It dates its facts, cites primary sources, and shows its last-updated date. Start with the formats models like to cite:

1. Category or offer pages: what you sell, for whom, with which choice criteria.
2. How-to guides, like [how to choose an AI agency](/en/resources/articles/how-to-choose-an-ai-agency), which answers first and then goes deep.
3. Definitions, like [Enterprise RAG](/en/resources/articles/enterprise-rag) or [AI agents for business](/en/resources/articles/ai-agents-for-business).
4. Buyer FAQ, with real sales questions.
5. Case studies with named outcomes, like [LocService](/en/case-studies/locservice).
6. Regulatory framework pages, sourced, like the HDS framework for health data in France in [AI and health data: what HDS really means](/en/resources/articles/ai-health-data-hds-france).

## AEO figures: +40% in the lab on GEO-bench, ×3.5 as a correlation at SE Ranking

The +40% measured in the lab on GEO-bench and the ×3.5 from the SE Ranking correlation each hold only within their own scope. The [GEO paper (KDD 2024)](https://arxiv.org/abs/2311.09735) by Aggarwal et al. reports up to 40% visibility gains in generative engine responses, in its lab experiments on the GEO-bench benchmark. That result promises nothing to a client. In those experiments, citations, quotations, and sourced statistics help.

The SE Ranking study of November 24, 2025 observes, as a correlation in its corpus of 129,000 domains and 100,000 prompts, that “Sites with over 32K referring domains are 3.5x more likely to be cited by ChatGPT than those with up to 200 referring domains.” Causation is not established.

**Instead.** Aim for authentic mentions in the “core sources” of your sector. Forums, podcasts, trade press, GitHub, and tech newsletters count, along with YouTube or conferences when the topic fits. Also look for sites that name you as a source. Recheck those mentions every 3 to 4 weeks. In your pages, source every statistic. If the source is secondary, add a caveat or drop the number.

## Measuring citations: the recommended protocol replays 5 to 10 buyer questions each month

This guide recommends a monthly protocol of 5 to 10 real buyer questions, a practical choice with no study behind it. Without measurement, AEO is folklore. You can run the protocol yourself.

1. List the conversational questions your buyers actually ask.
2. Replay them on ChatGPT with web search and on Gemini, optionally on Perplexity or AI Mode.
3. For each run, note the citation (URL), the mention without a link, absence, tone, and the competitor cited.
4. Keep the date, the model or mode, and a screenshot.
5. Compare month over month.

OpenAI warns that “Search results and citations can be incomplete, outdated, or incorrect”. So open each cited source before logging it. Semrush AI Visibility, Mentions.so, or an OSS toolkit like treg remain options. This way you measure your eligibility and your presence.

## AEO checklist: the steps that still hold for ChatGPT and Gemini

This checklist gathers the Instead steps of each myth, in the order to check them.

1. OAI-SearchBot allowed, searchbot.json IPs accepted by the CDN and the WAF.
2. GPTBot and Google-Extended set separately, based on your training choice.
3. AI Overviews, AI Mode, and generative Discover included in Search Console, unless you deliberately exclude them.
4. Pages to be cited are indexable, with no `noindex` set by mistake.
5. Answer-first pages on your buyer questions, visible text, real FAQ.
6. Dated proof, named authors, and primary sources, for a readable brand E-E-A-T.
7. Real, sourcable institutional signals: funding, public programs, partnerships.
8. Regulatory framework explained with no fake badges or invented certification.
9. Internal links to offers, guides, and cases.
10. Authentic off-site mentions.
11. Buyer questions replayed every month on ChatGPT and Gemini.
12. Strategic pages refreshed within the year.
13. No promise to “get you cited”.
14. CTA placed after the value.

## FAQ

### What is the difference between AEO and GEO?

AEO (Answer Engine Optimization) covers the practices that increase a brand's visibility in generated answers, such as AI Mode or ChatGPT, according to Semrush's April 2026 definition. GEO (Generative Engine Optimization) mostly comes from the KDD 2024 paper. AEO and GEO often chase the same outcome, being cited or mentioned. Treat them as one workstream.

### Do you need an llms.txt file?

No. OpenAI does not document llms.txt as a requirement to get cited. The November 2025 SE Ranking study finds a negligible impact on the probability of citation. The priority remains OAI-SearchBot, clear content, and dated proof. An llms.txt file can act as a discovery bonus, with no guarantee.

### Can ChatGPT cite my site without a Google click?

Yes. ChatGPT searches the web, on its own or through partners, and can cite a crawlable site it judges relevant. Its ranking differs from the classic Google top 10. To be eligible, allow OAI-SearchBot and the IPs OpenAI publishes. OpenAI's help page sets no condition tied to Bing or Google.

### Are AI Overviews the same as ChatGPT?

They are separate products. AI Overviews and AI Mode are Google Search surfaces, managed by the Search generative AI control in Search Console. ChatGPT is an OpenAI product, with its own search and its OAI-SearchBot bot. The levers overlap, with good SEO and clear pages. The controls and the bots differ.

### Can anyone guarantee a citation?

Nobody can. OpenAI itself writes “Placement is not guaranteed”. You can aim for eligibility and relevance, with OAI-SearchBot, Google indexing, and clear pages. No platform sells guaranteed placement inside a model answer. Be wary of any offer that promises citations.

## Map your citable pages

The Vibe Company is an [AI agency in Paris](/en/ai-agency-paris) (YC W24). It builds products, agents, and software factories that run in production. If you want to map which pages to make citable and how AI bots crawl your site, The Vibe Company can do that mapping with your team.

[Book a call about your AI visibility →](https://cal.com/stangirard/thevibecompany)

*It went through Y Combinator (W24).*

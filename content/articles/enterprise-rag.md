---
title: "Enterprise RAG: connect generative AI to your documents"
seoTitle: "Enterprise RAG: connect generative AI to your documents"
slug: enterprise-rag
translationKey: enterprise-rag
language: en
summary: "Enterprise RAG explained: how to make generative AI answer from your own documents, with real sources, the right access rights, and the LocService case."
publishedAt: 2026-10-27
complexity: intermediate
topics: AI Infrastructure, Knowledge Systems, Security
coverImage: /images/resources/rag-entreprise/cover-mascotte.webp
coverAlt: "The mascot on a library ladder holds out a highlighted index card linked back to its source folder, next to shelves locked behind a brass gate"
ogImage: /images/resources/rag-entreprise/cover-mascotte.webp
---

Enterprise RAG is a generative AI assistant that answers from your company's documents instead of from whatever the model memorized during training. When someone asks a question, the system pulls the relevant passages from your contracts, procedures, tickets or wiki. The model reads them and writes an answer that points back to its sources. The idea comes from a 2020 paper by Facebook AI Research, [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks](https://arxiv.org/abs/2005.11401). Their core argument still holds: the knowledge lives in an index you can inspect, fix and update without retraining anything.

This guide covers how it works, when RAG is the right call, and the two places projects usually break: retrieval quality and access rights.

## How RAG works, in one minute

There are two phases.

**Before anyone asks: indexing.** You collect the documents and split them into passages of a few hundred words. Each passage becomes a vector, a numeric representation of its meaning, stored in an index.

**At question time: retrieve, then answer.** The question gets turned into a vector the same way. The system finds the closest passages, adds them to the prompt, and the model answers from them.

So the model never actually "knows" your documents. It reads them when you ask. That's why it can cite the exact source. And why you can drop a document from the index the day it goes stale.

## When RAG is the right answer, and when it isn't

| What you need | Is RAG a fit? | What works better otherwise |
| --- | --- | --- |
| Answers drawn from thousands of documents that keep changing | Yes, this is its home turf | |
| A few dozen stable pages | Usually overkill | Put the whole corpus in the prompt |
| A different tone or output format | No | Instructions, examples, maybe fine-tuning |
| Numbers from a database or ERP | Partly | Query the API or the database directly |
| Taking action in a tool (open a ticket, edit a record) | No | An agent connected to your tools |

The second row catches people off guard. Anthropic makes the point in its post on [Contextual Retrieval](https://www.anthropic.com/news/contextual-retrieval): if your knowledge base is under 200,000 tokens, roughly 500 pages, you can drop the whole thing into the prompt and skip RAG. Measure how much content you really have before you scope a project.

The last row matters too. RAG reads, it doesn't act. If you want an assistant to open a ticket or update a customer record, it needs tools, for example through an [MCP server](/en/resources/articles/what-is-an-mcp-server). The two fit together well: RAG becomes one more tool the agent calls when it needs a source.

## Five building blocks of an enterprise RAG that holds up

### 1. Clean ingestion

Answer quality starts with the documents. A scanned PDF with no OCR, three versions of the same procedure, a wiki nobody has touched since 2022: the model will answer from all of it, confidently. Start by picking the sources that are authoritative and removing duplicates. Keep the date and version of every document, and plan how the index resyncs when one changes.

### 2. Chunking that keeps context

A passage on its own loses meaning fast. "The notice period is extended to 30 days" says nothing about which contract or since when. Anthropic's approach is to prepend a short, generated line of context from the full document to each chunk before indexing it. In their tests, that alone cut failed retrievals by 35%. Paired with keyword search it reached 49%, and 67% once a reranking step was added.

### 3. Hybrid search

Vector search finds passages that mean something similar. It can miss exact matches: a contract number, a product reference, an error code. Keyword search (BM25, the classic search engine algorithm) has the opposite profile. Combining both beats vectors alone, which is one of the clearest findings in Anthropic's tests.

### 4. Reranking before the answer

Retrieve wide, say 150 passages, then let a reranking model keep the ones that actually fit the question. The answering model reads less text, which cuts cost and noise. The trade-off is a bit of extra latency, so tune it to the use case.

### 5. A cited answer, or "I don't know"

Every answer should link to the passage and document it came from, so the user can check it in one click. And when retrieval comes back with nothing solid, the assistant has to say so instead of filling the gap with what it thinks it knows. That behaviour has to be written into the instructions and tested. It doesn't happen by default.

## Access rights: where RAG projects leak

In enterprise RAG, the biggest risk is usually leakage, not hallucination: an employee asks a question and gets a passage from a document they were never supposed to see. [OWASP](https://genai.owasp.org/llmrisk/llm082025-vector-and-embedding-weaknesses/) lists this in its 2025 Top 10 for LLM applications as LLM08, vector and embedding weaknesses. It covers unauthorized access, leaks between customers or teams sharing one index, and data poisoning. Their example is a résumé with white-on-white text telling the AI to ignore previous instructions and recommend the candidate.

Off-the-shelf assistants generally respect existing permissions. Microsoft spells it out in its [Copilot privacy documentation](https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-privacy): Copilot only surfaces data the user has at least view access to. That's the right design. It also means an HR folder someone shared with the whole company by mistake three years ago is now one question away. Your permissions problem was already there. RAG just exposes it.

What we put in place on a custom RAG:

- **Filter during retrieval, not after.** Every indexed passage carries the permissions of its source document, and search only returns what the user can read. Filtering the generated answer is too late.
- **Keep permissions in sync.** When someone changes teams, their access changes at the source. The index has to follow, not wait for the next full reindex.
- **Isolate customers.** In a multi-tenant app, one index or partition per customer. Never an optional filter.
- **Check what comes in.** External documents (résumés, attachments, web pages) go through an extraction step that drops hidden text before indexing.
- **Log everything.** Who asked what, and which passages came back. That's how you reconstruct a leak if one happens.

This is also a good place for agents that harden your systems. Before the index goes live, an agent can crawl your shares. It flags "anyone with the link" files, stale groups, and sensitive folders that are too open. It then proposes fixes for a human to approve. Once the RAG is running, a second agent probes it with low-privilege test accounts. It flags any answer that cites an out-of-scope document. That's the approach behind our [AI agents for product hardening](/en/ai-agents-product-hardening) offer.

## The LocService case: documents plus the live customer record

[LocService](/en/case-studies/locservice) is a peer-to-peer property rental platform whose support team handles several hundred tickets a day. We built an assistant that reads all their past tickets and internal documentation to draft a reply to every new ticket. Each draft is tailored to the customer's profile and history. The drafts are used on 87% of tickets, and the support team still decides what gets sent.

Two lessons carry over to any enterprise RAG.

**Documents aren't enough.** The assistant is also connected to LocService's internal APIs to pull the customer's actual situation. An answer that's right in general can be wrong for this particular customer. RAG brings the company's knowledge. The API brings the state of the account.

**Business rules matter as much as retrieval.** The same question needs a different answer depending on the type of customer. Classification rules identify the case before anything gets drafted. The full story is in our piece on [AI customer support agents](/en/resources/articles/ai-customer-support-agent).

## Measure quality before you ship

Test a RAG system at two levels, separately.

1. **Retrieval.** Build a set of real questions, each paired with the document that holds the answer. Check that the right passage shows up near the top. Anthropic measures it as the share of relevant chunks missed in the top 20 results.
2. **Answers.** On the same questions, check the answer is correct and cites the right source. When the answer isn't in the documents, it should say "I don't know".

In production, track one simple number: the share of answers people actually use. At LocService, that's 87% of drafts. The rest of the go-live checks are in our [POC to production checklist](/en/resources/articles/ai-agent-poc-to-production).

## Off-the-shelf assistant or custom RAG?

If your documents live in Microsoft 365 or Google Workspace and the questions are general, a ready-made assistant with connectors may be enough. We compare the plans in our [ChatGPT Enterprise rollout guide](/en/resources/articles/chatgpt-enterprise-rollout).

Custom work pays off when the right answer depends on internal systems, business rules or fine-grained permissions. Or when the data can't leave your infrastructure. In France, health data has to sit with an HDS-certified host, which we cover in [AI and health data: what HDS really requires](/en/resources/articles/ai-health-data-hds-france).

If you want to self-host, our open-source search engine [Quivr](/en/portfolio/quivr) combines keyword and vector search, shows the exact passage, and plugs into agents through MCP. It runs on your own servers. It's still in evaluation, with an API that may change.

## Where to start

1. Pick one specific, frequent business question, not "all our documents".
2. List the sources that answer it, with their owners and permissions.
3. Clean and date those sources before indexing them.
4. Write 50 to 100 real questions, each with its reference document.
5. Launch with pilot users, measure retrieval, answers and usage, then widen.

## FAQ

### What's the difference between RAG and fine-tuning?

Fine-tuning changes the model itself, which helps with tone, format or a repetitive task. RAG leaves the model alone and hands it your documents at question time. For knowledge that changes often and has to be cited, RAG is almost always the better fit.

### Does RAG get rid of hallucinations?

It reduces them, without wiping them out. A model can still misread a passage or fill a gap. That's why citations, an explicit "I don't know" instruction and a test set built from real questions matter.

### Do our documents end up with the model provider?

The retrieved passages are sent to the model with every question. Check retention, training opt-out and data location in the contract that applies to you, or run a model inside your own infrastructure.

### Do we need a dedicated vector database?

Not necessarily. PostgreSQL with an extension like [pgvector](https://github.com/pgvector/pgvector) is enough for many projects. The choice matters less than document quality, hybrid search and permission filtering.

## Connect AI to your documents

The Vibe Company is an AI agency in Paris. We build RAG systems and agents that plug into your documents and tools, respect your company's access rights, and cite their sources.

[Book a call about your RAG project →](https://cal.com/stangirard/thevibecompany)

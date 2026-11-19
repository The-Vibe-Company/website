---
title: "AI agents for business: what they do and where to start"
seoTitle: "AI agents for business: what they do and where to start"
seoDescription: "AI agents for business, shown through production examples: a support desk that uses reviewed AI drafts, document checks, and how to start the first agent."
slug: ai-agents-for-business
translationKey: ai-agents-enterprise-guide
language: en
summary: "What AI agents for business are, where they already work in production (support drafts, document checks, code), and how to launch a first one."
publishedAt: 2026-10-20
dateModified: 2026-11-16
complexity: intermediate
topics: AI Adoption, AI Agents, Strategy
author: stan-girard
coverImage: /images/resources/agent-ia-entreprise/cover-mascotte.webp
coverAlt: "The mascot assembles four glowing building blocks, tools, memory, an authority key and a measurement gauge, to build a business AI agent"
ogImage: /images/resources/agent-ia-entreprise/cover-mascotte.webp
---

A good way to understand AI agents for business is to watch one that isn't allowed to send anything. It works on the support desk at LocService, a peer-to-peer property rental platform that handles several hundred tickets a day.

For each new ticket, the agent reads the past tickets and the internal documentation, then pulls the customer's real file through LocService's internal APIs. It works out which type of customer is asking and writes the reply. Then it stops. Someone on the support team reads the draft, fixes it if needed, and sends it.

That sounds modest next to a demo where software runs a whole department by itself. But the modest version comes with a number: the team uses those drafts on [87% of its tickets](/en/case-studies/locservice).

An AI agent for business is this kind of software. It takes a goal, decides the steps, and uses your company's own systems to get there, within limits you set. And the reason LocService holds back an agent whose drafts get used that often is the most useful thing to understand before you build or buy one.

## AI agents for business take a goal and work inside your tools

Three things get called "AI" at work, and they behave differently.

A chatbot answers the question in front of it. An automation follows a path someone drew in advance: say an invoice arrives, and the same sequence classifies it, files it and notifies accounting, every time. An agent gets a goal instead of a path. Hand it "answer this ticket" and it decides what to look up, in which system, and what to write once it has the facts.

That also answers a question you may have typed yourself: is ChatGPT an AI agent? If you ask something in a browser tab and paste the answer into an email, you're using an assistant. You are the one doing the acting.

A model of the same kind becomes part of an agent when someone connects it to your systems, gives it a goal, and writes down what it may do. The long version is in [the difference between a chatbot and an AI agent](/en/resources/articles/chatbot-vs-ai-agent).

Notice what the definition leaves out: how much the agent does alone. That part is a dial, and you set it.

The LocService agent researches and writes on its own, and its authority ends at a draft. Another agent might be allowed to file the document or send the message. Same technology, different permission.

One test before you go further. Draw the process on a whiteboard. If the drawing is the same every time, you want an automation, and the guide to [which processes to automate first](/en/resources/articles/ai-automation-which-processes-first) will serve you better. If you only need answers from your own documents, with the source attached, that's document search, and the [enterprise RAG guide](/en/resources/articles/enterprise-rag) covers it.

An agent earns its place when the path changes with every case, which is daily life on a support desk.

## The business applications worth copying prepare the work and let a person decide

The Vibe Company, which built the LocService agent, chose not to build a chatbot that answers customers on its own. On that desk, the right answer depends on each customer's file. An AI mistake shows right away, and it goes out with LocService's name on it. So the agent does the research and the writing, and the team keeps the decision.

That worry has a ruling behind it. In February 2024, a British Columbia tribunal [found Air Canada liable](https://businesslawtoday.org/2024/02/bc-tribunal-confirms-companies-remain-liable-for-information-provided-by-ai-chatbot/) for wrong information its chatbot had given a customer. The company answered for the bot.

The draft model has research behind it too. A [study of 5,179 customer support agents](https://www.nber.org/papers/w31161) (the human kind) looked at what happened when they got a generative AI assistant.

Issues resolved per hour rose by 14% on average. Novice and low-skilled workers improved by 34%. Experienced, highly skilled workers saw minimal impact.

Full autonomy exists as well. In February 2024, one month after going live, Klarna [announced](https://www.klarna.com/international/press/klarna-ai-assistant-handles-two-thirds-of-customer-service-chats-in-its-first-month/) that its AI assistant had handled two-thirds of its customer service chats. Klarna called that the equivalent work of 700 full-time agents. Those are the company's own first-month figures, and even there, customers could still choose a live agent.

So the dial does go all the way up. LocService's reasoning tells you when to keep it low. If the right answer depends on the customer's file, and a wrong one leaves with your name on it, start with drafts. The article on [AI agents for customer support](/en/resources/articles/ai-customer-support-agent) goes through that choice in detail.

The same shape shows up a long way from the support desk. Coup de Pates supplies frozen products to food professionals, and its teams used to review product documents by hand. The Vibe Company built them [a library of three AI skills](/en/case-studies/coup-de-pates) to compare, check and cross-check those documents.

The skills verify that a corrected label follows every annotation, even boxes someone drew in PowerPoint. They list everything that changed between two versions of a specification: 72 changes on a single document. They also make sure the development sheet, the specification, the label and the technical sheet all say the same thing.

Every gap lands in a side-by-side viewer, where a person can click through it. Nobody misses doing that by eye.

Coding is the other application with a case behind it. The Vibe Company works with Theodo on AI Software Factories for hundreds of developers. That means standardized tools, agents and skills, so every team starts from the same foundation. If engineering is where you'd start, the guides to [rolling out Claude Code across a company](/en/resources/articles/claude-code-enterprise-rollout) and [adding a security agent to your CI](/en/resources/articles/ci-security-agent) go deeper.

You'll notice what's missing. The roundups in your other tabs also promise agents for sales and for operations, and some of those may be good. This page only vouches for what it can point to.

And what it can point to has a pattern.

## A first agent belongs where the volume is high and someone already knows the work

Look at what the LocService desk and the Coup de Pates documents have in common. The task comes back constantly. The material the agent needs already exists in writing: past tickets, internal documentation, annotated documents. And people who know the work were already doing it by hand, so someone could judge a draft from the first day.

That gives you a test for your own company. A small business with one overloaded inbox can pass it as easily as a mid-size company.

Find the task that repeats. Check that what it requires is written down somewhere a program can read. Name the person who will review the output.

Leave for later anything irreversible, like moving money, and anything nobody on the team can explain step by step. If people can't describe how they decide, an agent has nothing to follow.

Then build in this order:

1. Write the rules first: what the agent must do, what it must never do, and what it does when it isn't sure.
2. Connect it to your real systems, read-only to begin with, with the narrowest access that does the job.
3. Give its drafts to a small team that does this work every day, and let them send, edit or discard each one.
4. Count how many drafts get used, and widen the agent's scope only when that number holds.

Step two is where the effort goes. The LocService case study credits two things for drafts that were right, and a clever prompt isn't one of them. The first is the real customer context, pulled from LocService's systems. The second is rules that recognize the case before the drafting starts, so the same question gets the right answer for each type of customer.

So expect to spend more time on access and rules than on choosing a model. There's a longer argument for that in [agents don't lack tools, they lack company memory](/en/resources/articles/agents-dont-lack-tools-they-lack-company-memory).

Step four is simpler than it sounds. LocService tracks one measure, day to day: is the draft used? Not a score on a test set chosen in advance.

The people who do the work answer that question on every ticket. That's where the number at the top of this page comes from.

Getting from a pilot to something the whole team relies on has its own traps. The [checklist for taking an AI agent from POC to production](/en/resources/articles/ai-agent-poc-to-production) walks through them.

## Decide who builds it and which rules apply before it talks to customers

Two things are left to settle.

The first is who builds it. Your own team knows the process better than any outsider will.

A partner should bring the experience of having put agents into production before. Ask to see one that's running, and ask what you will own when the engagement ends. The guide on [how to choose an AI agency](/en/resources/articles/how-to-choose-an-ai-agency) lists what else to check.

For context on who is writing: The Vibe Company built the LocService and Coup de Pates systems described here. Stan Girard and Antoine Dewez founded it in Paris in 2024, after its product [Quivr](/en/resources/articles/quivr-to-the-vibe-company) went through Y Combinator (W24).

The second is the rules. If your agent interacts directly with people in the European Union, the transparency obligation in [Article 50 of the EU AI Act](https://artificialintelligenceact.eu/article/50/) has applied since August 2, 2026. Such systems have to be designed so that people are informed they're dealing with an AI, unless that's obvious from the context.

Does a reply drafted by an agent and sent by a human fall under it? That is a question for your lawyer, and this page won't pretend to settle it.

French teams have more to read. The CNIL publishes [questions and answers on generative AI](https://www.cnil.fr/fr/les-questions-reponses-de-la-cnil-sur-lutilisation-dun-systeme-dia-generative) and [compliance principles for AI](https://www.cnil.fr/fr/ia-les-grands-principes-pour-se-mettre-en-conformite), both in French. ANSSI publishes [security recommendations for a generative AI system](https://messervices.cyber.gouv.fr/guides/en-security-recommendations-generative-ai-system).

## The first agent to build is the one whose drafts your team would send

Go back to the LocService desk. The agent there still isn't allowed to send anything. The team uses what it writes anyway, ticket after ticket.

So this week, pick the one task in your company that looks most like that desk. Pull last week's real cases and write down how your best person handled them. Then ask whether a good draft would have saved that person time. If the answer is yes, you have your first agent.

[Book 30 minutes with Stan](https://cal.com/stangirard/thevibecompany) and bring that task with you. When you're ready to build, the [AI agents in production](/en/ai-agents-in-production) page describes The Vibe Company's offer.

## FAQ

### What are AI agents for business?

AI agents for business are software that takes a goal, decides the steps, and uses a company's own systems to carry them out, within limits the company sets. A chatbot answers a question and an automation follows a fixed path, while an agent chooses its path case by case. How much an agent may do alone is a setting: an agent can stop at a draft that a person reviews and sends.

### Is ChatGPT an AI agent?

It depends on how ChatGPT is used. If you ask a question in a browser tab and carry the answer into your own tools yourself, ChatGPT is working as an assistant, because you do the acting. A language model becomes part of an AI agent when it is connected to a company's systems, given a goal, and bound by written rules about what it may do.

### How are businesses using AI agents?

Businesses are using AI agents where one task repeats at high volume and a person can review the result. At LocService, a peer-to-peer rental platform, an agent drafts the reply to each support ticket and someone on the support team sends it. At Coup de Pates, which supplies frozen products to food professionals, AI skills compare versions of product documents and flag every gap.

### How do I start with a first AI agent?

Start your first AI agent on one task that repeats often, whose information is already written down, and that a person already knows how to check. Write the rules first, including what the agent does when it isn't sure, then connect it to your real systems with narrow, read-only access. Give its drafts to a small team, count how many they use, and widen the agent's scope when that number holds.

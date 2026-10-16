---
title: "AI agents for customer support: automate without hurting service"
slug: ai-customer-support-agent
translationKey: ai-customer-support-agent
language: en
summary: "Autonomous chatbot or AI drafts reviewed by your team? How to automate customer support with AI without losing quality, with the LocService case (87% of tickets) and lessons from Klarna and Air Canada."
publishedAt: 2026-10-15
complexity: intermediate
topics: AI Agents, AI Adoption, AI Operations
coverImage: /images/resources/agent-ia-support-client/cover-mascotte-v2.webp
coverAlt: "An AI agent prepares reply drafts that a support team reviews before sending"
ogImage: /images/resources/agent-ia-support-client/cover-mascotte-v2.webp
---

Customer support is often the first place a company wants to use AI. The volume is there, the questions repeat, and the cost shows up every time growth means hiring more people.

It's also where an AI mistake is visible right away. It lands in a customer's inbox, with your name on it.

At [The Vibe Company](https://www.thevibecompany.co/en), an AI-native agency founded in Paris in 2024 and backed by Y Combinator (W24), we built an assistant that drafts support replies for [LocService](https://www.thevibecompany.co/en/case-studies/locservice). Its drafts are used on 87% of tickets. Here's what we learned, and the approach we recommend before you automate your own support.

## Two ways to automate support with AI

"AI customer support agent" covers two very different things.

**1. The autonomous chatbot.** The AI answers the customer directly, with no review. That's what most vendors at the top of Google sell. It works well for simple, closed questions (order tracking, opening hours, password resets).

**2. The agent drafts, a human sends.** The AI reads the ticket, pulls the context and writes a reply. A support agent reviews it, fixes it if needed, then sends it. That's what we built for LocService.

| | Autonomous chatbot | Reviewed drafts |
| --- | --- | --- |
| Who sends the reply | the AI | a support agent |
| Risk of an error the customer sees | high | low: errors are fixed before sending |
| What you measure | tickets closed without a human | time saved per ticket, share of drafts used |
| Good starting point for | simple, repetitive questions | questions that depend on the customer's account |
| What you must plan for | an easy path to a human | a fast review interface |

The two can coexist. But order matters. Starting with reviewed drafts lets you measure the AI's quality on your real tickets before you let it talk to customers on its own.

## What the public numbers actually say

**AI helps your least experienced agents first.** One of the most cited studies on the topic followed 5,179 support agents at a software company ([Brynjolfsson, Li and Raymond, NBER](https://www.nber.org/papers/w31161)). With a generative AI assistant suggesting replies, they resolved 14% more issues per hour on average, and 34% more for novice agents. The most experienced agents gained little. That's the "draft plus human" model: the AI passes the team's know-how to the people who just joined.

**Customers want to be able to reach a person.** In a [Gartner](https://www.gartner.com/en/newsroom/press-releases/2024-07-09-gartner-survey-finds-64-percent-of-customers-would-prefer-that-companies-didnt-use-ai-for-customer-service) survey of 5,728 customers run in late 2023, 64% said they would prefer companies didn't use AI in customer service. Their top worry: that it would make it harder to reach a human.

**Full automation has limits.** In February 2024, [Klarna](https://www.klarna.com/international/press/klarna-ai-assistant-handles-two-thirds-of-customer-service-chats-in-its-first-month/) said its assistant was handling two-thirds of its customer service chats, the work of 700 agents. In May 2025, the company was hiring humans again so customers could always talk to a person ([CX Dive](https://www.customerexperiencedive.com/news/klarna-reinvests-human-talent-customer-service-AI-chatbot/747586/), citing the CEO's interview with Bloomberg).

**You're responsible for what your AI says.** In 2024, a Canadian tribunal ruled against Air Canada after its chatbot gave a customer wrong information about a fare ([Business Law Today](https://businesslawtoday.org/2024/02/bc-tribunal-confirms-companies-remain-liable-for-information-provided-by-ai-chatbot/)). "The chatbot got it wrong" was not a defense.

**In the EU, you have to say it's AI.** Since August 2, 2026, [Article 50 of the AI Act](https://artificialintelligenceact.eu/article/50/) requires AI systems that interact directly with people to tell them they're talking to an AI, unless it's obvious. An autonomous chatbot is in scope. Drafts reviewed and sent by your agents raise this question less, but have your lawyer confirm your case.

## The LocService case: 87% of tickets with an AI draft

LocService is a peer-to-peer property rental platform. Its support team handles several hundred tickets a day.

We built an assistant that reads all their past tickets and internal documentation, then drafts the reply to each new ticket. The reply is tailored to the customer's profile and history. Three choices made the difference.

**Real customer context, not just an FAQ.** The assistant is connected to LocService's internal APIs. It doesn't answer "in general": it knows who the customer is and where their file stands. Most bad AI answers come from missing context, not from a bad model.

**Classification rules.** The same question doesn't get the same answer for every type of customer. We wrote rules so the assistant recognizes the case before it drafts. It's less exciting than a magic prompt, but it's what makes the answers right.

**One simple metric: is the draft used?** We don't judge the assistant on a hand-picked test set. We look at what the team does every day. Today, our drafts are used on 87% of tickets.

## The approach we recommend

1. **Start from your tickets, not from a tool.** Export a few hundred recent tickets and sort them: simple questions, questions that depend on the customer's file, sensitive cases (disputes, payments, personal data). Now you know what can be automated, and what shouldn't be.
2. **Connect the context.** Customer history, account status, up-to-date internal docs. Without them, the AI makes things up or stays vague.
3. **Start with drafts.** A support agent reviews every reply. You measure the share of drafts sent as is, edited or thrown away.
4. **Write the business rules down.** Which customer types, which exceptions, when to escalate. The rules serve the AI and your new hires.
5. **Expand only with numbers.** A ticket category where almost every draft goes out unchanged may be ready for automatic replies. Always keep an easy path to a human, and tell customers when they're talking to an AI.

For more on going live, read our [checklist from AI agent POC to production](https://www.thevibecompany.co/en/resources/articles/ai-agent-poc-to-production).

## Buy a tool or have it built?

If your questions are simple and your data fits in a knowledge base, an off-the-shelf tool (Zendesk, Intercom, HubSpot and others) may be enough. Test it on your real tickets before you sign.

Building makes sense when the right answer depends on your internal systems, on business rules specific to your company, or when you want to keep control of the data and the rules. That's the LocService case. To compare options, read our guide on [how to choose an AI agency](https://www.thevibecompany.co/en/resources/articles/how-to-choose-an-ai-agency).

## Why The Vibe Company

The Vibe Company was founded in 2024 by Stan Girard and Antoine Dewez (ex-Theodo, ex-Stockly), backed by Y Combinator (W24), with $1.7M raised. We've shipped dozens of projects, including LocService in customer support, [Monka](https://www.thevibecompany.co/en/case-studies/monka) in healthcare, and MediaGen with [AFP](https://www.thevibecompany.co/en/case-studies/afp) as part of France 2030.

How we work: start from your real data, ship something your team actually uses, quickly, and measure usage rather than the demo.

## FAQ

**Can an AI agent replace my support team?**
Not on cases that depend on the customer's file or need judgment. On those tickets, AI saves your team time. Klarna, which bet on full automation, ended up hiring humans again.

**How many tickets do I need to start?**
There's no official threshold. What matters is a history of tickets and replies the AI can learn from, and up-to-date documentation. At LocService, the assistant reads all past tickets.

**How do I measure whether it works?**
Track the share of drafts sent unchanged, edited or rejected, average time per ticket, and customer satisfaction. A single accuracy score on a test set isn't enough.

**Do I have to tell customers an AI wrote the reply?**
If the AI interacts directly with the customer, Article 50 of the EU AI Act requires it since August 2, 2026, unless it's obvious. If a human reviews and sends the reply, the situation is different. Check your case with your lawyer.

## Let's talk about your support

You get hundreds of tickets and want to know what AI can really take on? Bring a ticket export and your constraints. We'll tell you what fits AI drafts, what can be automated, and what should stay human.

[Book 30 minutes with Stan](https://cal.com/stangirard/thevibecompany).

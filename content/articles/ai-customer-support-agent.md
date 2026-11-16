---
title: "AI customer service agent: automate without hurting service"
seoTitle: "AI customer service agent: drafts a human can send"
seoDescription: "An AI customer service agent can send replies alone or draft them for a human. LocService's team reviews those drafts before they go out to customers."
slug: ai-customer-support-agent
translationKey: ai-customer-support-agent
language: en
summary: "What an AI customer service agent is, why to start with drafts a human reviews, and how LocService uses those drafts on real tickets."
publishedAt: 2026-10-15
dateModified: 2026-11-16
complexity: intermediate
topics: AI Agents, AI Adoption, AI Operations
author: stan-girard
coverImage: /images/resources/agent-ia-support-client/cover-mascotte-v3.webp
coverAlt: "The mascot drafts a reply that a human support agent approves before it goes out through a pneumatic tube"
ogImage: /images/resources/agent-ia-support-client/cover-mascotte-v3.webp
---

An AI customer service agent can answer your customers by itself, or it can write the reply and leave the send button to a person. The assistant The Vibe Company built for LocService is the second kind. The support team uses its drafts on [87% of tickets](/en/case-studies/locservice), and it has never sent a single reply.

That was a choice. LocService is a peer-to-peer property rental platform that handles several hundred support tickets a day, and on its desk the right answer depends on each customer's file. An AI mistake there shows right away, and it goes out with LocService's name on it.

An AI customer service agent, then, is software that reads an incoming request, pulls the context it needs and writes a reply. What shapes everything else is who presses send. To automate without hurting service, start with drafts a person reviews and count how many your team actually uses. Then hand over the send button one kind of ticket at a time.

## An AI customer service agent either sends the reply or hands it to a person

Type the term into Google and the definition at the top calls it "an autonomous software program". That is half of what the name covers.

The autonomous kind reads the customer's message and answers directly, with nobody in between. The drafting kind reads the ticket, pulls the customer's history, writes the reply, and stops. A support agent reads the draft, fixes it if needed, then sends it.

On a good day, either kind gets the customer a right answer. The difference shows on the day the agent is wrong.

| | Autonomous agent | Reviewed drafts |
| --- | --- | --- |
| Who sends the reply | The AI | A support agent |
| Who sees a mistake first | The customer | The agent reviewing the draft |
| What you measure | Requests closed without a person | Share of drafts the team uses |
| What you have to build around it | An easy way to reach a person | A review step fast enough to be worth using |

Say a customer asks why a payment was refused. An agent that has only read your help pages answers in general. If it sends that answer by itself, the customer gets a confident paragraph that has nothing to do with their account. In draft mode, the same weak answer lands in front of a colleague who knows better. It dies there.

Draft mode has a side effect worth knowing if a trial makes you nervous. Customers never see it. A draft nobody sends is invisible outside your team, so you can run the agent on live tickets for as long as you need, and its bad days stay internal.

Both kinds can live on the same support desk. An autonomous agent can be enough for simple, closed questions. Drafts fit the tickets where the answer depends on the account. (Chatbot versus background agent is another line again, drawn in this [comparison of chatbots and AI agents](/en/resources/articles/chatbot-vs-ai-agent).)

The order matters. Drafts let you measure the AI on your real tickets before it talks to anyone alone. The public evidence points the same way.

## Public evidence backs the assisted model, and LocService shows what makes it work

The study to know is [Generative AI at Work](https://www.nber.org/papers/w31161), by Brynjolfsson, Li and Raymond, published by the NBER. It tracked the rollout of a generative AI assistant to 5,179 customer support agents. With the assistant, agents resolved 14% more issues per hour on average. Novice and low-skilled workers improved by 34%. Experienced, highly skilled ones barely moved.

Notice the setup. The assistant worked beside human agents, and people still did the answering. That's the draft model.

For full autonomy, the headline numbers come from a company describing its own launch. On February 27, 2024, [Klarna announced](https://www.klarna.com/international/press/klarna-ai-assistant-handles-two-thirds-of-customer-service-chats-in-its-first-month/) that its AI assistant had handled two-thirds of its customer service chats in its first month, the equivalent work of 700 full-time agents. The same announcement said customers could still choose a live agent.

Thirteen days earlier, a tribunal in British Columbia had [found Air Canada liable](https://businesslawtoday.org/2024/02/bc-tribunal-confirms-companies-remain-liable-for-information-provided-by-ai-chatbot/) for wrong information its chatbot gave a customer about a bereavement fare. It's one ruling in one province. Plan around it anyway: your company answers for what its agent says.

The EU adds a transparency rule. [Article 50 of the AI Act](https://artificialintelligenceact.eu/article/50/) covers AI systems meant to interact directly with people. They must be designed so those people know they are dealing with an AI, unless that is obvious from the context. A draft that a support agent reviews and sends may be a different case, and that one is for your lawyer to confirm.

None of this tells you how to make drafts good enough that a busy support agent wants them. LocService does.

The assistant reads all of LocService's past tickets and internal documentation, then drafts the answer to each new ticket, tailored to the customer's profile and history. It does the research and the writing. The team keeps the decision.

Two unglamorous pieces of engineering make that worth the team's time. The first is context: the assistant is connected to LocService's internal APIs, so it works from the customer's real situation. The second is classification rules. On this desk the same question has a different right answer depending on the type of customer, so the rules recognize the case before the assistant drafts anything.

What made the drafts right was not a clever prompt. It was the customer's actual file, and rules that know which case they are looking at.

The measurement is just as plain. Nobody scores the assistant on a test set chosen in advance. The team checks one thing, day to day: is the draft used? That's the figure from the opening. Used doesn't mean untouched, since the agent fixes the draft when it needs fixing. But it's a number the support team produces by doing its job, one reply at a time.

## Start with drafts, and let your own numbers decide what the agent sends alone

The LocService work suggests an order, and it starts before you choose a tool.

1. Export a recent batch of tickets and sort it into three piles: simple questions with one answer, questions that depend on the customer's file, and sensitive cases you want a person on regardless.
2. Connect the context for the second pile, meaning past tickets, internal documentation and access to the customer's account.
3. Turn on drafts only. A support agent reviews every reply, and you track whether the drafts get used.
4. Write the rules down: which type of customer gets which answer, and which tickets go straight to a person.
5. Widen the agent's authority one category at a time, and only when the usage figures support it.

The sorting comes first because it tells you how much of your volume an autonomous agent could ever handle, and how much needs the customer's file. Without it you are choosing a product for tickets you haven't looked at.

The fair objection to step three is that a person still touches every ticket. True. It's the price of the first phase. It is also the setup the NBER study measured, where agents resolved more issues per hour with the assistant beside them. Reviewing a good draft beats starting from a blank reply. Reviewing a bad one doesn't, which sends you back to context and rules.

The rules in step four need writing down for a plain reason. If the right answer for each type of customer lives only in your senior agents' heads, neither an assistant nor a new hire can apply it.

Step five runs on the usage figure. A category where your team sends nearly every draft as written is a candidate for automatic replies. A category where drafts keep getting rewritten is telling you the context or the rules are missing something. When you do let the agent answer alone, keep an obvious route to a person and tell customers they're talking to an AI.

Buying or building comes out of the same sorting. If your tickets are mostly simple questions and your knowledge fits in a help center, an off-the-shelf helpdesk tool can be enough. Test it on your tickets first. Building makes sense when the right answer lives in your internal systems and in rules specific to your business, which was LocService's situation. Cost depends on that choice and on the integrations, so be wary of any figure quoted before someone has looked at your tickets.

If you build, two guides help: [how to choose an AI agency](/en/resources/articles/how-to-choose-an-ai-agency), and [taking an AI agent from POC to production](/en/resources/articles/ai-agent-poc-to-production). For agents beyond the support desk, there is a wider [guide to AI agents for business](/en/resources/articles/ai-agents-for-business).

Now go back to the ticket from the top, the one that leaves with your company's name on it. Open this week's queue, pick the category your team answers most often, and ask who should press send on it today. If the answer is a person, you know which kind of agent to start with.

## FAQ

### What is an AI customer service agent?

An AI customer service agent is software that reads a customer's request, pulls the context it needs and writes a reply. Some agents send that reply themselves. Others draft it for a support agent, who reviews it and sends it. The assistant The Vibe Company built for LocService is the second kind: a person sends every reply.

### Can an AI customer service agent replace a support team?

An AI customer service agent can take on simple, closed questions, but replacing the whole team is a much bigger bet. In the NBER study Generative AI at Work, people still answered the customers, and the largest gains went to novice and low-skilled workers. At LocService, a support agent reviews and sends every reply. A tribunal has also held Air Canada liable for wrong information from its chatbot, so your company still answers for what the agent says.

### Can I use ChatGPT for customer service?

You can use a general-purpose assistant such as ChatGPT to help write customer service replies, as long as a person reads each one before it goes out. At LocService, what made the drafts right was the real customer context pulled from internal systems, plus rules that recognize the case before drafting. Whatever tool you use, check that it can see the customer's file and follow your rules.

### Do I have to tell customers they are talking to an AI?

In the EU, customers have to be told when an AI system interacts with them directly. Article 50 of the AI Act has applied since August 2, 2026. It requires that people be informed they are interacting with an AI system unless that is obvious, and the [European Commission](https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai) names chatbots as an example. A reply drafted by AI but reviewed and sent by a support agent may be a different case, so confirm yours with a lawyer.

## A ticket export is enough to start the conversation

If you would rather not do that first sorting alone, bring a ticket export. The Vibe Company, the Paris agency Stan Girard and Antoine Dewez founded in 2024 after Quivr went through Y Combinator (W24), built the LocService assistant. [Book 30 minutes with Stan](https://cal.com/stangirard/thevibecompany) to go through which tickets suit drafts, which could be automated, and which should stay with a person.

*Sources were read on November 16, 2026, and the LocService figure comes from The Vibe Company's own case study.*

---
title: "Chatbot vs AI agent: why a single background task works better"
seoTitle: "Chatbot vs AI agent: why a background task works better"
seoDescription: "Chatbot vs AI agent: a chatbot facing the end user often disappoints. A single-task background AI agent can be measured and improved over time."
slug: chatbot-vs-ai-agent
translationKey: chatbot-vs-ai-agent
language: en
summary: "A chatbot facing the customer is very hard to get right. An AI agent doing one task in the background can be measured, and here is where I would start."
publishedAt: 2026-11-16
complexity: intermediate
topics: AI Agents, AI Adoption, Strategy
author: stan-girard
coverImage: /images/resources/chatbot-vs-agent-ia/cover-mascotte.webp
coverAlt: "The Vibe Company mascot drafts a reply at a back-office desk, while a customer-facing chat kiosk stands empty"
ogImage: /images/resources/chatbot-vs-agent-ia/cover-mascotte.webp
---

Chatbot vs AI agent: if you're asking the question, I'd bet the answer has already come up in a meeting. It sounded like "put a chatbot on it." I understand the reflex. A chatbot demos well, and everybody knows what one looks like.

My view comes from a chatbot I built myself. A chatbot is made for an end user, someone waiting in front of a screen, and making that experience truly good is very hard. An AI agent, the way I use the word, is the opposite of a generalist. It does one task, very well, most often in the background, after a customer request or in the middle of a process.

So if you're torn, start with the agent. One task, out of the customer's sight, that you can measure and then improve. It took a chatbot that was too slow for me to understand that.

## At Quivr, the same answer was too slow in front of the user and fast enough in the background

In 2023, I created [Quivr](/en/portfolio/quivr) with Antoine Dewez. It's a conversational agent on your documents: you ask a question, it answers from your files. Quivr had more than 100,000 users in 2024-2025.

The whole team did everything it could to get a quality answer out in under 5 seconds. It was very hard, because a good answer usually took 30 seconds. The choice was between speed and quality, so between two ways to lose: answer fast and badly, or well and too late.

Picture yourself in front of a chat window that is taking its time. You've already opened another tab.

![Facing the user, a good answer usually took 30 seconds and the chatbot had to do it in under 5. In the background, you can take 30 seconds to 1 minute.](/images/resources/chatbot-vs-agent-ia/chatbot-vs-ai-agent.png)

Then came customer support by email, on Zendesk. The questions users sent there were complicated, and humans usually answered them within a few hours. There, taking 30 seconds to 1 minute to write a reply bothered nobody. The delay that was sinking the chatbot became, over email, a lightning reply.

What had changed was how long the person on the other side expected to wait. That is why [Quivr pivoted to customer support](/en/resources/articles/quivr-to-the-vibe-company).

That choice still runs in production at LocService, a platform for property rentals between private individuals that receives hundreds of support tickets a day. Quivr's autodraft reads the past tickets and the internal documentation, then writes the reply to each new ticket. Someone on the support team reviews the draft, corrects it if needed, then sends it. The result: [87% of tickets are handled thanks to those drafts](/en/case-studies/locservice), and the measure tracked every day fits in one question: is the draft used?

The full method is in [the article on AI customer support agents](/en/resources/articles/ai-customer-support-agent). What interests me here is the shape: a single task in the background, and one measure.

RAG, the technique behind Quivr, taught me the same thing from the other end. When a chatbot isn't properly boxed in, users are often disappointed by the result. A chatbot that does a single task very well, which is what I call an AI agent, is much better.

I apply it to myself. The general-purpose assistant I use is a chat, and I specialised it by creating several agents, each on one task. An agent multiplexes easily: you run several, and each one's task is easier to measure and optimise than an open conversation.

There is one objection, though, that I raise against myself.

## The objection is fair: a chatbot is fine when it's done well

If your need comes down to one narrow task, and the right answer doesn't depend on any customer record sitting in your systems, an off-the-shelf tool can be enough. Take it and move on.

Look at what that objection concedes, though. The chatbot that works is the one somebody confined to a single thing. It's already almost an agent.

What goes wrong is the chatbot asked to do everything in front of the end user. Expectations lose their edges: the person can ask anything, so they expect it to know everything.

And on a support desk where the right answer depends on each person's record, an AI mistake shows immediately. It goes out with the company's name on it. That's why, at LocService, no chatbot answers customers on its own.

An opinion that is mine alone: I find big-company chatbots bad, the Uber Eats one for example.

Another point I concede: more or less anybody can build these, chatbots and agents alike. My difference comes down to experience: having built Quivr, and seeing LocService still run in production.

That leaves the practical question: where to start.

## Chatbot vs AI agent: for a mid-sized company, it all starts with one task

Leave the generalist chatbot aside. Look for a task.

A good candidate comes after a customer request or in the middle of a process, and somebody on your team already does it by hand. Ask yourself how long the person on the other side waits today. If they wait hours, your agent has plenty of time to do it well. If they wait in front of a screen, you're back to the problem I had with Quivr.

Then put that task in the background, with a human who reviews. The AI prepares, the human sends. A mistake gets corrected before it leaves, instead of landing with the customer.

Now measure, and measure usage. A successful demo tells you nothing about what happens the following week. The LocService question is enough: does anybody use what the agent produced?

Count it every day. If the rate stalls, you know where to look, because a single task leaves few places to search.

For the next task, see [the types of AI agents a business can start with](/en/resources/articles/ai-agents-for-business). And if you're looking for someone to build the first one, start from [this comparison of AI consulting firms in France](/en/resources/articles/best-ai-consulting-firms-france).

The next time you hear "put a chatbot on it," ask one question: which task, exactly?

If you're unsure about the task, come and talk to me. [Book a call](https://cal.com/stangirard/thevibecompany) and tell me what your teams do after a customer request. That is where I start looking for the task.

*The Quivr figures come from my own experience, as I report it on 16 November 2026, and the LocService figure from the published case study.*

## FAQ

### Is a chatbot sometimes enough?

Yes, a chatbot is enough when it is done well and confined to one narrow task whose answer doesn't depend on any customer record sitting in your systems. In that case an off-the-shelf tool can do the job. A generalist chatbot in front of the end user often disappoints, because that experience is very hard to make good.

### How do you measure whether a background AI agent is really useful?

Measure how much of the AI agent's output gets used. At LocService, the measure tracked every day is a simple question: is the draft prepared by the AI used by the support team? A usage rate checked daily tells you more than a score on a test set chosen in advance.

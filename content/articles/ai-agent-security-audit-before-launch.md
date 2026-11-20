---
title: "Pre-launch security audit with AI agents: what they find in an hour, and what still needs a human"
seoTitle: "Pre-launch security audit with AI agents: what they find"
seoDescription: "A pre-launch security audit with AI agents: a list of known flaws, one sub-agent per candidate, a real case found in an hour, and the part a human still owns."
slug: ai-agent-security-audit-before-launch
translationKey: ai-agent-security-audit-before-launch
language: en
summary: "An agent decompiles an Android app and finds secrets in clear text. The agent audit method, what it surfaces most, and what a human still has to own."
publishedAt: 2026-11-20
complexity: intermediate
topics: AI Agents, Security, AI Operations
author: stan-girard
coverImage: /images/resources/audit-securite-informatique-agents-ia/cover-mascotte.webp
coverAlt: "The Vibe Company mascot inspects, at night and with a magnifying glass, an amber door on a scale model of an app crossed by small lanterns"
ogImage: /images/resources/audit-securite-informatique-agents-ia/cover-mascotte.webp
---

A pre-launch security audit can start before the contract is even signed. Before signing a client, I had an agent download their Android app and decompile it. I didn't have access to their code yet.

It took 30 seconds. Once the app was decompiled, secrets were sitting in clear text in the environment variables, the database password for example.

I launched a lot of sub-agents, and in about an hour they had identified the problems. That let me report it to the prospect as a major flaw in the app.

Finding this was no feat. OWASP rates hardcoded credentials in a mobile app as [easy to exploit and easy to detect](https://owasp.org/www-project-mobile-top-10/2023-risks/m1-improper-credential-usage), with a severe impact.

This is what a security audit before a launch looks like today. I always put it the same way: "The goal of a security audit is very simple, really. Today, what you do is launch an army of agents."

They find fast, and they find deep. The scope, the validation of findings, the penetration test, the order of the fixes and the disclosure are still a human's job.

## A security audit run by AI agents starts from a list of recurring flaws

It all starts with a list. You fill it with known security problems, the ones that keep coming back from app to app.

You hand that list to an agent and ask it to analyze your application, the back end, the microservices and the rest, and identify those problems. It maps the app, then it surfaces candidates: 10, 20, 30 of them.

A candidate is not a confirmed flaw yet. So for each one you launch a sub-agent, whose job is to dig into the code around it and confirm the problem.

At the end, you choose: turn the result into an audit, or ask for quick fixes, which the agents propose fairly fast.

The static checks humans used to run have not gone away. That is still the case, and a tool built for it does the job. What's new is that you now have agents that can go and analyze your code in depth and identify the problems.

![Security audit method with AI agents: a list of recurring flaws, one agent maps the app and surfaces 10 to 30 candidates, one sub-agent per candidate, then an audit or quick fixes, with a human on scope, validation and priorities](/images/resources/audit-securite-informatique-agents-ia/methode-en-480.png "Agents find and confirm, a human scopes and decides.")

## What agents surface most is a user reading someone else's data

The most frequent case is an API route that is not protected, or badly protected. A logged-in user gets another user's information, because nobody checks that the requested resource belongs to them.

Imagine a route /invoices/{id} in your API. It checks that the caller is logged in, then returns the requested invoice. If it doesn't also check that the invoice is theirs, a customer who changes the identifier reads another customer's invoice.

This flaw is called broken access control. It keeps the top spot in the OWASP Top 10:2025, which states that ["100% of the applications tested were found to have some form of broken access control"](https://owasp.org/Top10/2025/A01_2025-Broken_Access_Control/). On the API side it goes by BOLA (Broken Object Level Authorization) and the code API1:2023, [the number one risk on OWASP's API security list](https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/).

So assume your application is affected until a check has shown otherwise.

OWASP's rule is easy to state. Every API endpoint that receives the ID of an object and performs any action on it should implement object-level authorization checks. Comparing the session's ID to the requested ID alone isn't a sufficient solution.

Holding that rule across a whole API is review work. That is where an agent is good: it reads every route, and for each of them it checks that ownership of the resource is verified.

Once the holes are closed, you still have to keep them from coming back. OWASP recommends writing tests that evaluate the authorization mechanism, and its instruction is short: "Do not deploy changes that make the tests fail."

Next, you have to look at the versions of the frameworks and packages you use, and check whether they have CVEs. OWASP made it a category of its ranking, [software supply chain failures](https://owasp.org/Top10/2025/A03_2025-Software_Supply_Chain_Failures/). You are probably vulnerable, it says, if you do not track the versions of all your components, transitive dependencies included, and if you do not scan regularly.

For a SaaS, dependencies and getting secrets out of the repository have their own article, on [how AI security agents harden a SaaS beyond CI](/en/resources/articles/ai-security-agents-harden-saas). For a small or mid-sized company, CVE monitoring is described in the piece on [hardening your IT with a fleet of agents](/en/resources/articles/ai-cybersecurity-harden-it-agents).

## Agent pentesting exists, and it needs written permission

You can go a step further than reading code, with what I call "white hacking". You tell a model you are running an audit, you ask it to try to break into your application, and you run it against that application, locally.

This step is harder than the previous ones: more and more, the big models, OpenAI, Anthropic and others, are putting rules in place to keep this from happening, because it is a big problem.

Those rules are public. [Anthropic's Usage Policy](https://www.anthropic.com/legal/aup), effective November 12, 2026, prohibits using its products to discover or exploit vulnerabilities in systems "without authorization of the system owner". It does not prohibit testing conducted on systems you own or operate.

Its products still have "real-time safeguards that may block or limit certain outputs". For some dual-use cases, Anthropic lets you apply to a Cyber Verification Program.

OpenAI follows the same logic with its Daybreak program. The tier meant for authorized penetration testing [requires separate approval, stronger verification and access controls](https://help.openai.com/en/articles/20001258-openai-daybreak-trusted-access-for-cyber-overview), and nothing is allowed outside systems you own or are explicitly permitted to test.

So even on your own application, an agent can be blocked in the middle of a test. This step needs a frame, a written authorization and a human at the controls.

French law pushes the same way. [Article 323-1 of the French Criminal Code](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000030939438) punishes fraudulently accessing or remaining in all or part of an automated data processing system with three years in prison and a fine of €100,000. So before any test, write down what you are allowed to test.

## Agents find, a human decides

An army of agents does not know what it is allowed to test. You set the scope, in writing, before the first run.

It does not make the call either. Agents surface candidates and sub-agents confirm them in the code. Someone still has to validate each finding, then supervise the pentest if you go that far.

The order of the fixes is yours too. Agents propose quick fixes, but choosing what gets fixed before launch and what waits is still your decision.

That leaves disclosure. When an agent finds an exposed secret in an application that is not yours, the responsible next step is to tell its owner. That is what I did with the app from the opening.

An audit is a point in time, while your code keeps changing. The next step is continuous control, with [a security agent in CI/CD that works PR by PR](/en/resources/articles/ci-security-agent). If you would rather hand over the job, The Vibe Company offers to [harden your product with a fleet of AI agents](/en/ai-agents-product-hardening). And if a client or a tender requires a provider qualified by ANSSI, the official list is published on [MesServicesCyber](https://messervices.cyber.gouv.fr/prestataires-labellises), ANSSI's own platform.

Go back to the app from the opening. It took no access to the code, only a public app and the time to decompile it. What an agent found for me before a signature, an attacker can look for in yours.

So do it before they do. Download your own APK or open your own repository, hand your list of flaws to an agent, and run the first pass before launch.

A word on method to finish: the case told here is a single, anonymized case, and its duration holds for that case alone. [Book a call](https://cal.com/stangirard/thevibecompany) if you want to run that first pass with me on your application.

## FAQ

### How long does a security audit with AI agents take?

In the case told here, sub-agents needed about an hour to identify the problems in a prospect's Android app, and decompiling it took 30 seconds. That duration holds for that case alone. A full audit depends on the scope you set and on the time a human spends validating each candidate.

### Does an agent audit replace a penetration test?

No, an audit run by agents does not replace a penetration test. Agents analyze the code and surface candidates that a human validates. An agent pentest is a separate step that needs a written authorization and a human at the controls. If a client requires a provider qualified by ANSSI, the official list is published on MesServicesCyber.

### Where do you start a pre-launch security audit in a small company?

Start with a list of recurring flaws, with badly protected API routes and package versions that have CVEs at the top. Ask an agent to analyze the application against that list, then launch one sub-agent per candidate to confirm it in the code. Keep the scope, the validation of findings and the order of the fixes for yourself.

---
title: "AI and cybersecurity: harden IT with a fleet of agents"
seoTitle: "AI and cybersecurity: harden your IT with agents"
seoDescription: "AI and cybersecurity: why an SME should harden its IT with a fleet of agents, watch CVEs closely, and keep a human on critical security rules."
slug: ai-cybersecurity-harden-it-agents
translationKey: ai-cybersecurity-harden-it-agents
language: en
summary: "Attacking a website now costs almost nothing. So an SME should put agents on its CVEs, and keep a few rule files under human review."
publishedAt: 2026-11-13
complexity: intermediate
topics: AI Agents, Security, AI Operations
coverImage: /images/resources/ia-et-cybersecurite-durcir-si/cover-mascotte.webp
coverAlt: "The Vibe Company mascot locking a rule book in front of a server cabinet behind a cyan shield"
ogImage: /images/resources/ia-et-cybersecurite-durcir-si/cover-mascotte.webp
---

When someone gets me started on AI and cybersecurity, I answer with a hypothesis that makes people uncomfortable. I pick a competitor, I tell an agent to try to take their website down, and I let it keep trying day and night. My honest guess is that I'd get there.

I have no intention of trying, and I'm nobody's idea of an attack specialist. But if I can picture it with no particular skill, so can someone who really has it in for you.

So when the head of an SME asks me whether to launch agents to harden their IT, I say go. It has to be done anyway, and there is no real choice. Launch a fleet of agents that strengthens your information system and tracks CVEs, the published security flaws that each carry an identifier. I don't know a better way to patch as fast as others attack. On one condition, which you rarely hear about. I'll get to it.

## Attacking costs almost nothing now, so patching has to move just as fast

My hypothesis rests on two things that changed this year.

The first is price. As of 13 November 2026, DeepSeek's official API charges, off-peak, [$0.15 per million input tokens (cache miss) and $0.60 per million output tokens](https://api-docs.deepseek.com/quick_start/pricing/) for its fast model. It is an official model, and I only cite it for the order of magnitude. At this rate, keeping a machine thinking all night is no longer a budget question. IBM makes the same point: when an adversary automates the steps, [the cost and complexity of a sophisticated attack drop materially](https://www.ibm.com/think/x-force/2026-cost-of-a-data-breach-ai-adversaries-enterprise-risk).

The second is the guardrails built into the models. When I talk about this, I tend to say Qwen 3.8 is completely unrestricted. That's a shortcut. On 17 August 2026, Alibaba released [Qwen3.8-27B as open weights](https://www.alibabacloud.com/blog/alibaba-unveils-qwen3-8-27b-and-releases-weights-of-qwen3-8-flagship-model_603463), under the Apache 2.0 license, compact enough to run on consumer-grade hardware. That official model keeps its refusals. But by 19 August, India Today was reporting that a third party [had built a version that removes much of that refusal behaviour](https://www.indiatoday.in/technology/news/story/china-qwen-ai-gets-uncensored-version-it-will-take-illegal-and-unethical-requests-from-users-2974856-2026-08-19) and runs locally. That third party says access is reserved for security researchers. Even so, once a model's weights are public, its refusals depend on whoever modifies it.

Now set that next to 21 October. That day, the PHP project released [fixes for two critical flaws](https://www.php.net/archive/2026.php#2026-10-21-5) that allow remote code execution without authentication. According to the team, updating was the only safe choice. That afternoon, [the websites of several French prefectures were unreachable](https://www.franceinfo.fr/internet/securite-sur-internet/prefectures-medias-impots-pourquoi-de-nombreux-sites-internet-sont-inaccessibles-mercredi-apres-midi_8247511.html) at the request of ANSSI, the national cybersecurity agency. ANSSI counted [more than 600,000 servers using the component in France](https://www.franceinfo.fr/internet/securite-sur-internet/prefectures-medias-impots-pourquoi-de-nombreux-sites-internet-sont-inaccessibles-mercredi-apres-midi_8247511.html). Elsewhere, [the Finnish government, Edinburgh council and the BBC took pages offline](https://www.bbc.co.uk/news/articles/cmly0lg3w5x2o).

None of these sources says those organisations had been hacked. They pulled the plug as a precaution, until the fix arrived and was applied.

Between the announcement of a flaw and your update there is a window, and on the other side, attacking no longer takes an expert. A prefecture has ANSSI to tell it to go offline. An SME has whatever it set up beforehand.

## The agent defending your IT can also knock out a security rule

That leaves the condition I promised. This time the danger sits on your own side.

When you hand code to an agent, you give it rules, for example always an authentication check in front of a given resource. You write those rules in files such as AGENTS.md or CLAUDE.md.

Now imagine an agent stuck on a task. The thing blocking it is that very authentication rule. So it finds a way out: it edits the rule. If nobody is paying attention at that moment, you end up with a security rule that has quietly disappeared.

Nothing spectacular about it. One line missing from a rules file, and a task marked as done.

And it gets worse with size. The bigger the codebase, the harder security becomes. More code gives an agent more chances to get stuck, and a human sees fewer of the changes going by.

So the fleet you launch to protect yourself from the other side's agent can open the door itself, from the inside and with no bad intent. It sits close to [the security of the agents themselves](/en/resources/articles/black-october-ai-agent-security), except that here the agent gets it wrong all on its own, with no attacker involved.

## AI and cybersecurity on Monday morning: agents on CVEs, a human on the rules

The advice has two parts. Let the agents run, and take a small number of files out of their hands.

Start with monitoring. IBM looked at where organisations hit by a data breach had put their AI agents. [50% use them for threat hunting, response and containment, and only 18% for vulnerability scanning and management](https://www.ibm.com/think/x-force/2026-cost-of-a-data-breach-ai-adversaries-enterprise-risk). Agents show up during the fire, far less for the work that comes before it.

Do the opposite. A first agent keeps an inventory of what you actually run, versions included. It goes first because [the Cybermalveillance.gouv.fr alert on the PHP flaw](https://www.cybermalveillance.gouv.fr/tous-nos-contenus/actualites/alerte-cyber-failles-de-securite-critiques-dans-php-202610), from France's official cyber assistance service, also asked organisations to isolate and then migrate versions that no longer receive patches. You can't migrate what you don't know you have. A second agent reads security advisories every day and checks them against that inventory. A third prepares the update and hands it to you.

The day a flaw of that size lands, you review a fix that is already written, instead of choosing between taking your site down and crossing your fingers. That is what I mean by velocity. The rest of the job, from secrets to access rights, is covered in the article on [a fleet of agents that hardens a SaaS](/en/resources/articles/ai-security-agents-harden-saas).

Then the guardrail. Draw up the short list of files your security depends on: the authentication configuration, AGENTS.md, CLAUDE.md, anything that tells agents what they may not do. On those files, an agent can propose a change, and only a human approves it.

Everything else can go fast precisely because that part goes slowly. If your agents already open pull requests, give the job of watching those files to [a security agent placed in CI](/en/resources/articles/ci-security-agent).

## An agent will run day and night anyway, so make it yours

Go back to my opening hypothesis, the agent that keeps trying day and night against a website. You can't stop anyone from launching it. You can make sure yours gets there first.

Starting Monday, open your main repository and look for two things: the date your rules files were last changed, and the name of the person who reviewed that change. If there is no name, you know where to start.

If you'd rather scope that fleet and its guardrails with someone, that's my job. [Book a call](https://cal.com/stangirard/thevibecompany) and I'll look with you at where to begin.

The facts and figures in this article come from the linked sources, read on the day of publication, and the competitor example remains a hypothesis.

## FAQ

### How does AI change cybersecurity for an SME?

AI makes attacking cheaper and easier: IBM notes that automation materially lowers the cost and complexity of a sophisticated attack. For an SME, that means patching published flaws faster than before. AI agents help with that too, provided they work on monitoring and patching before the incident.

### Can agents be left to harden IT on their own?

No, not entirely. Agents can track CVEs and prepare fixes, but an agent stuck on a task can edit the security rule that stands in its way. Critical files, such as the authentication configuration, AGENTS.md or CLAUDE.md, should therefore go through human review before any change.

### Where do you start to track and fix CVEs faster?

Start with an up-to-date inventory of the software and versions running across your systems, kept by an agent. Another agent compares that inventory every day with published security advisories and prepares the update when a CVE affects you. For the PHP flaw of October 2026, the PHP team said updating was the only safe choice. Patching speed is what makes the difference.

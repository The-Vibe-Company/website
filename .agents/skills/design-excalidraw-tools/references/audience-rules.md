# Audience rules

Read when the diagram leaves the team: a client, a manager, a workshop, a public post.

Contents: words · numbers · provenance · tone · hygiene · footer.

## Words

- Keep the user's terms and the client's process terms exactly as they say them (step names, statuses, artefact names, role names). A reviewer proposing "Ticket agent" for "ready-for-agent" or "automated check" for "gate" is improving readability at the cost of the owner's voice; refuse, and add a legend entry if a term is unclear.
- When two owners' words conflict (the user calls it a "pre-release branch", the client says "master is the preprod branch"), keep the user's card title, put the client's wording in the card body, and add the question to the open-questions box.
- Prefer the user's own sentence from a meeting over your paraphrase when it is sourced; it is then theirs to defend.
- One title plus one line per card. Cut adjectives, keep nouns and numbers.

## Numbers

Every number carries its unit, its statistic and its population:

- working days vs calendar days (`j ouvrés` / `j cal.`), never mixed silently in one bar;
- median vs mean; medians of steps do not add up to the median of the whole — when you need an additive breakdown, use the mean of "typical" items around the median and say so in the caption;
- counts vs load: do not compare a share of tickets with a share of capacity; compare like with like (points with capacity, tickets with tickets);
- sample vs population (`32 of 44, sample`);
- the date of a figure when it is old (`Q1 2025: …`).

Recompute derived figures with a script saved next to the generator. Check any figure a reviewer challenges against the source before changing it; reviewers misread sources too.

## Provenance

- Measured facts appear plain. Facts that were only said (workshop, interview) get a short marker such as `(workshop)`, explained once in the legend.
- Do not tag every card with a meeting date or a person: it makes the speaker carry the finding in front of their management. Provenance goes in the footer.
- Unsourced claims and unconfirmed calendars go to the open-questions box, never onto a card as fact.
- A status chip must be true today: `V0 delivered` only for what the V0 really does; split delivered and to-build items inside the card when needed (filled vs hollow dots).

## Tone

Describe, do not judge. Proven rewordings:

| Avoid | Prefer |
|---|---|
| pain points measured | findings |
| what we sell | (just name the frame) |
| not explored | out of scope |
| the rush at the end of the sprint | manual end-of-sprint check (if that is the owner's term) |
| no KPI tracked | KPI being built |
| under-used / unusable | usage to extend · link rarely filled in |
| not measured | not yet instrumented |
| top-down, solution first | priorities set per pillar, in capacity; outcomes not yet formalised |
| the real backlog | where does the upstream breakdown live? |
| without any human | without human intervention (and say where humans stay) |

Aggressive positions are fine when the user chose them; state them plainly and keep fallbacks off the canvas if the user wants concessions to come from the client.

## Hygiene

Before a diagram leaves the team, remove:

- internal names of people outside the audience, internal history, opinions said off the record;
- internal file paths, scene ids, repository names in footers;
- fallback positions the user does not want to concede yet;
- "vision" items the user wants to show only to one stakeholder.

Add:

- a small cartouche (author × audience · subject · working document · date), light grey, top-right;
- a footer with sources described in plain words (workshop of date, interviews, N tickets over 12 months);
- an open-questions box addressed to the audience ("To decide with <audience>") when decisions are pending.

## Footer

One line, grey, 13 px: what the figures come from and when. Example: "Sources: workshop of 28/10 · 5,125 tickets and git history over 12 months · local test campaigns of October."

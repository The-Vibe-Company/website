# Review loop

Run the taste judge first (`references/art-direction.md`: five questions scored /2, ship at 8/10); the cold critiques below are for content and audience, after the picture already works.

Run reviews after the first clean screenshot, in parallel, read-only. One or two reviewers are enough for most diagrams; use more only for an important, first-time deliverable. Give each reviewer the render (PNG path), a text dump of every text element (one per line, sorted by position), the brief, and the source files. Never give them your conclusions or your own critique: you want readings that are not anchored on yours.

## Text dump helper

```python
import json, sys
d = json.load(open(sys.argv[1]))
for e in sorted([e for e in d["elements"] if e["type"] == "text"], key=lambda e: (round(e["y"] / 30), e["x"])):
    print(e["text"].replace("\n", " / "))
```

## Persona briefs (adapt names and domain)

**Executive, 30 seconds then 2 minutes.** "You are <role> at <client>. After 30 s: what is proposed, where did your eye land first, second, third? After 2 min: what you did not understand, jargon that blocks you, what makes you trust or doubt, the five changes that would most help — prefer cuts. Do not propose rewording <protected terms>." Under 600 words.

**Demanding designer.** "Hierarchy at thumbnail size; does the structure (<the message>) read without explanation, and the single change that would make it read; every overlap, misalignment, crowding, orphan, colour misuse with location and fix (coordinates from the generator); what to cut; eight fixes ranked." Give the generator path so fixes can cite constants.

**Fact-checker.** "Check every number, status and role against <sources> (file:line); flag wrong, unsourced, overclaimed; check the flow logic end to end, contradictions between boxes, decisions recorded elsewhere that the diagram forgets; output a table: exact text · problem · source · proposed correction." Tell it which claims you already suspect.

**Audience-side lead / sceptic.** "You are <the client role whose process this is / a sceptical QA or release manager>. Do you recognise it, what is wrong or missing, what would make your colleagues defensive (with neutral alternatives keeping the fact and the protected words), what you would accept quickly, five corrections before showing it to management."

Default pair: the 30-second reader and the designer. Add the fact-checker when the diagram carries numbers, and the audience-side reader when it describes someone else's work.

## Sorting

Write `review-<diagram>-<date>.md` next to the generator with three sections:

- **Applied** — what converged or was factually right.
- **Set aside** — each with a reason: contradicts a user decision; rewords protected vocabulary; reviewer misread the source (cite the line that proves it); stylistic preference with no reader impact.
- **To ask the user** — real decisions (e.g. keep a figure that someone in the audience might find sensitive).

Then apply in one pass, regenerate, lint, republish, screenshot, and look again. Tell the user what you applied and what you set aside, in that order.

## Common reviewer mistakes

- Treating a said figure and a measured figure as contradictory without noticing the diagram already uses the measured one.
- Asking to remove a term the user introduced on purpose.
- Proposing to add fallback positions or "safety" boxes the user explicitly kept off the canvas.
- Missing that a status chip overclaims (always verify what the delivered version actually does).

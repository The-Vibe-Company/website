---
title: "I tried to make music with AI. An artist showed me what the machine could not hear."
slug: ai-music-with-an-artist
language: en
summary: "A founder who uses AI every day spent a session making music with an artist. The tools generated fast. The hard part was knowing what was worth keeping."
publishedAt: 2026-05-27
complexity: beginner
topics: Creative AI, AI Workflows, Music Generation
coverImage: /images/resources/ai-music-with-an-artist/cover-mascotte.webp
coverAlt: "A studio table shows headphones, a waveform printout, version cards, lyrics, and listening notes from an AI music session"
ogImage: /images/resources/ai-music-with-an-artist/cover-mascotte.webp
---

At some point in the session, we had a track that worked.

We called it V10.

It was not perfect. The voice entered too early. Some choices still felt unfinished. But the song had a center. The bass was readable. The arrangement was not fighting itself. The vocal and the instrumental seemed to belong to the same world.

Then we tried to improve it, and several of the next versions got worse.

That was the moment the experiment became useful.

I use AI for almost everything in my work: code, writing, research, planning, company memory, reviews, and the daily mess of building The Vibe Company.

My normal loop is simple: intention, generation, critique, revision.

So I wanted to know what would happen if I applied the same operating system to music.

Not to make a novelty demo. To see what it would take to make something that could actually feel good.

I knew I could not do that alone. I am not an artist. I can tell when I like something, but that is not the same as knowing why it works, why it fails, which part is carrying the emotion, or when a performance sounds fake.

So I asked [Bertrand](https://open.spotify.com/intl-fr/artist/1H5O4Et580Zu48IiXCec6a) to spend a session with me.

I brought the systems instinct: prompts, versioning, files, scripts, structured YAML, the urge to turn every failure into a reusable method.

Bertrand brought the part I did not have: an artist's ear. He could hear when a beat was technically in the right genre but emotionally empty. He could hear when a voice was present but not performing. He could hear when a rap flow was already old.

The question was whether my system could learn enough taste to make the output good.

![A studio table shows headphones, a waveform printout, version cards, lyrics, and listening notes from an AI music session](/images/resources/ai-music-with-an-artist/cover-tvc.webp "The session was not one prompt. It was a long chain of tests, rejects, partial wins, and listening notes.")

## The first mistake was trusting the surface

We started like people actually start: replaying old attempts and trying to remember where the useful material was.

The session moved across Suno, Udio, Google's Lyria, local scripts, stems, lyrics, instrumentals, rap vocals, and a lot of prompt revisions. The tools themselves are moving fast: Google's [Lyria 3 model card](https://deepmind.google/models/model-cards/lyria-3/) describes text-to-music generation, Suno documents [section-level editing and stems](https://help.suno.com/en/articles/6141313), and Udio supports upload workflows like [extend, inpaint, remix, and style transfer](https://help.udio.com/en/articles/10754328-create-music-with-your-own-audio).

That context matters, but it was not the heart of the session.

The heart of the session was listening.

AI music creates a dangerous illusion: the first output can already sound like a song. Drums, bass, voice, structure, genre costume. If you are not careful, that surface makes you lower your standards.

Some of our first attempts had that problem. They sounded complete before they were good.

We tried funk and soul directions: black male funk vocals, guitars answering each other, layered hi-hats, progressive arrangements, vocal stabs, brass, strings, bass lines that led the track.

Some generations had nice pieces. A guitar tone. A groove. A plausible vocal texture. A bridge that almost worked.

But something kept breaking.

The voice was too present. Or in the wrong place. Or disconnected from the instrumental, as if two plausible songs had been glued together.

My first instinct was to measure the problem.

If the voice was too early, maybe we could detect vocal entrance. If it was too present, maybe we could analyze vocal energy. I wrote a small Python script to get some grip on the file.

It helped in the way a limited tool helps: it showed me what I could not automate yet.

The problem was not just whether the voice existed. It was whether the voice belonged.

Bertrand heard that immediately.

## I thought the prompt was the problem

After that, I did what I always do with AI systems: I tried to make the input better.

If the model was taking bad creative liberties, we needed stronger constraints. If one version had a good bass but a bad voice, the next prompt needed to preserve the bass while changing the voice. If the intro, verse, chorus, bridge, and outro were drifting, we needed timecodes. If lyrics mattered, they had to be attached to the right sections.

That is how the YAML standard appeared.

At first, it felt like a prompt-engineering move. In reality, it was a memory move.

We needed a shared place to say:

- this is the tempo
- this is the emotion
- this is the role of the bass
- this is when the voice enters
- this is when strings support the vocal instead of fighting it
- this is what failure looks like

The YAML helped a lot.

It made the session less random. It gave us a common language. Instead of saying "make it better", we could say "the bass stopped leading", "the chorus does not lift", "the violins are fighting the voice", "the transition adds energy but breaks the song", or "the prompt is now obeyed but the music is worse".

That last sentence became important.

A structured prompt can preserve intent. It cannot decide what deserves to be preserved.

The prompt remembered the instructions. Bertrand remembered the song.

## V10 worked because it agreed with itself

The best example came in the 80s pop direction.

We had started with a vague emotional neighborhood: synthetic, danceable 80s pop, adjacent to Eurythmics' "Sweet Dreams", but not a copy.

We wanted a central bass riff, minimalism, a simple vocal melody, strings that supported the chorus, and a voice that felt from the right era.

Several versions missed.

Some versions were too 90s. Some were too complex. Some had strings that did not match the vocal. Some sounded like the prompt had been obeyed locally, section by section, without becoming one song.

Then V10 appeared.

It was not magic. It was just coherent.

The harmony was simple. The bass had a real role. The arrangement had a readable center.

The song was still flawed, but the flaws were attached to something worth protecting.

V10C mattered because it suggested V10 was not just luck. The same prompt family could still produce a version with a center.

::audio{src="/audio/resources/ai-music-with-an-artist/night-turns-bright-v10-standard-timecoded-full.mp3" title="V10 - the first version that held together" badge="Worked" note="This is the version that made us stop treating the session as random output. It still had flaws, including vocals arriving too early, but the bass, arrangement, and song identity finally felt coherent."}

::audio{src="/audio/resources/ai-music-with-an-artist/night-turns-bright-v10c-standard-full.mp3" title="V10C - the same prompt family worked again" badge="Worked again" note="This second take mattered because it proved V10 was not just luck. The same structured prompt could still produce a version with a readable center."}

## Then the improvements broke the song

Then we did the reasonable thing.

We tried to improve it.

We asked for better transitions, more chorus lift, subtle vocal harmonies, more emotional strings, better bridges, more producer judgment.

Each request made sense on paper.

Several versions got worse.

::audio{src="/audio/resources/ai-music-with-an-artist/night-turns-bright-v11-transition-chorus-lift-full.mp3" title="V11 - better transitions, weaker song" badge="Failed better" note="This version added the kind of improvements that look reasonable on paper: transitions, chorus lift, harmony support. The problem is that the track started losing the simple center we liked in V10."}

::audio{src="/audio/resources/ai-music-with-an-artist/night-turns-bright-v13-coherent-producer-pass-full.mp3" title="V13 - the producer pass still did not recover the magic" badge="Still off" note="This was an attempt to use more judgment and stop over-applying instructions. It was closer, but it still shows how hard it is to preserve the original feeling once the iteration has drifted."}

That is where my software instincts started to fail me.

In code, adding a clear constraint often makes the next version better. In music, adding a good instruction can erase the fragile thing that made the track work.

We had versions that were more produced but less memorable. More compliant but less musical.

I could see the system getting more detailed.

Bertrand could hear the song getting worse.

That difference is the whole article.

## The hip-hop versions had the right ingredients and still bored us

After the pop experiments, we moved into hip-hop.

The brief sounded good: New York energy, soulful, orchestral, victorious, something in the broad emotional family of Maybach Music and Rick Ross.

Piano and trumpet at the beginning. Brass later. Strings in the second half. Choir on the final refrains. Drums with space, because a slow rapper needed room.

On paper, this was strong.

The first tracks had the ingredients. They also made us bored.

::audio{src="/audio/resources/ai-music-with-an-artist/borough-rise-v1-ny-victory-hiphop.mp3" title="Borough Rise V1 - the right ingredients, not enough movement" badge="Boring" note="The brief was clear: New York, soulful, orchestral, victorious, slow enough for a rapper. The track has the costume, but the progression arrives too late and the energy does not push the room forward."}

That failure was useful because it separated ingredients from movement.

The model understood the costume: piano, brass, strings, choir, drums, victory.

But the energy did not climb fast enough. The beat sounded like it was waiting for something instead of pulling the rapper forward.

This is where Bertrand's question was better than my prompt.

Would someone want to rap on this?

Not "does it match the genre?"

Not "does it include the requested instruments?"

Would a rapper feel like the beat gives him a place to stand?

That question changed how I heard the track. Empty space was not absence. It was a role. The drums were not just rhythm. They were permission.

The prompt could request all of those things. Bertrand could tell when they were actually happening.

## Bertrand's lyrics raised the stakes

The hardest test came when we used Bertrand's own rap lyrics.

Until then, a bad lyric was just bad generated text. Once we used his words, the tolerance changed.

The model was no longer making "a rap song". It was touching someone's material.

That exposed a different class of failure.

It changed words. It mishandled accents. It struggled with French phonetics and slang.

It treated lyrics like text to place over drums, when rap lyrics are already rhythm, breath, timing, mouth shape, emphasis, attitude, and identity.

::audio{src="/audio/resources/ai-music-with-an-artist/roi-sans-couronne-v1-french-rap.mp3" title="Roi Sans Couronne V1 - the lyrics test exposed the flow problem" badge="Failed test" note="This is the kind of version that made the gap obvious: having rap vocals and having the artist's flow are not the same thing. The words are present, but the performance does not carry Bertrand's writing."}

This is probably the clearest limit we hit.

For a non-artist, lyrics can look like words.

For an artist, lyrics are already performance.

If the system changes the words, it changes the person. If it flattens the accent, it changes the body of the track. If the flow is old, the whole thing can become embarrassing.

We found workarounds: lock the lyrics harder, reduce creative freedom, replace some accented characters with phonetic ASCII, and push variation into drums, bass, textures, and delivery instead of letting the model rewrite the text.

Those are useful techniques.

But they are not the real lesson.

The real lesson is that when lyrics matter, they are not a vibe input. They are the spine of the song.

## What the system was good at

I do not want to pretend the system failed.

It did not.

The system made the session possible.

Without the prompts, we would have lost the thread. Without versioning, we would have forgotten why V10 worked. Without YAML, every new generation would have been a fresh negotiation with the model. Without artifacts, the session would have become a folder full of mysterious MP3s.

The system helped us:

- compare versions
- preserve constraints
- name failure modes
- generate multiple directions
- translate feedback into the next prompt
- stop confusing one good sound with a good song

That matters.

I still believe AI music workflows should be more programmatic. A serious session needs a memory layer, a version history, locked lyrics, timelines, failure conditions, and parallel generations. It needs the same kind of operating discipline we use when agents work on code.

But the session also showed me the boundary.

The system can remember what we asked for.

It cannot replace the person who knows whether the result deserves another listen.

## What Bertrand was good at

Bertrand's value was not that he had opinions. Everyone has opinions.

His value was that his opinions were trained.

He could hear when a version was not just different but worse. He could tell when an instrumental had expensive ingredients but no pressure. He could hear when a vocal performance did not carry the words. He could tell when the music had drifted into the wrong era, the wrong groove, the wrong emotional temperature.

He also did something I did not expect: he protected simplicity.

When a version worked, my instinct was to make it richer. More transitions. More layers. More control. More cleverness.

His instinct was often to ask whether the simple center was still there.

That is a hard thing for AI systems to protect because the next prompt usually rewards visible change. The model wants to answer the instruction. The operator wants to see progress. But music sometimes gets better when the next version changes less.

That is why the collaboration worked.

I could build the loop.

Bertrand could protect the song from the loop.

## The workflow I would use again

If I did this again, I would not start by asking for a finished song.

I would start by generating directions.

Then I would listen with someone who has real taste in the genre. We would pick the version with a living center, not the version that checks the most boxes. We would name exactly what must not change. We would change one thing at a time. We would keep lyrics locked when the words matter. We would generate variants in parallel so waiting does not kill the room.

And I would keep the YAML.

Not because YAML makes art. It does not.

But memory matters when taste is fragile.

I have written before that [agents need company memory](/resources/articles/agents-dont-lack-tools-they-lack-company-memory), because AI work falls apart when context disappears between iterations. This session made that idea feel more physical.

Memory helps you preserve decisions.

It does not tell you which decisions are worth preserving.

That is still an artistic job.

By the end of the session, I did not feel like I had learned how to become an artist with AI. I felt like I had learned why artists matter more when generation becomes cheap.

AI made it easier for me to enter the studio.

Bertrand made sure we did not confuse entering the studio with knowing what should come out of it.

That is the honest promise I see in AI music.

The studio gets bigger. The drafts arrive faster. The strange accidents multiply.

But someone still has to hear.

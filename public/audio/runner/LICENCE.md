# ambient.m4a

Background bed for the homepage runner (`src/lib/runner-audio.ts`).

- **Source file**: `gigidelaromusic-mini-zen-drone-short-450970.mp3`, supplied by the
  requester. The filename matches the Pixabay naming pattern (`<uploader>-<title>-<id>`),
  which would put it under the Pixabay Content Licence — free for commercial use, no
  attribution required.
- **Shipped as**: AAC, 80 kbps, mono, 47.5s, 475 KB. Re-encoded from the 256 kbps stereo
  source with `afconvert`.

## Status: unconfirmed

**This has not been verified against the source page, and nobody has recorded where the
file actually came from.** It is served publicly from a commercial site, so before this
ships, someone must either paste the source URL and licence here, or replace the track.

Nothing in the code depends on the file's identity: `TRACK_URL` in `runner-audio.ts`
points at this path and any looping ambient track can take its place.

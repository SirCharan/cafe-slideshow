# Bangalore Café Unit Economics — Interactive Slideshow Deck

An interactive web slideshow application presenting **The Economics of Owning a Café in Bangalore** (Episode 1 of *Not a Startup*).

- **Live URL:** [https://cafe-slideshow.vercel.app](https://cafe-slideshow.vercel.app)
- **Deployment:** Vercel (`ckdeltaexchange-1648s-projects`)
- **GitHub Repository:** [https://github.com/SirCharan/cafe-slideshow](https://github.com/SirCharan/cafe-slideshow)
- **YouTube Reference:** [https://youtu.be/kOx2ayjDWa4](https://youtu.be/kOx2ayjDWa4)

---

## What This App Does

1. **20 Interactive Chapters:** Full financial model across 6 structured modules (Idea vs Reality, Micro-markets, Setup Capex, Leases & Compliance, Unit Margins, Reality Check).
2. **Audio Sync & Interactive Player:** Plays the original Tara narration (146 WPM) with active sentence-level time synchronization.
3. **Speed & Playback Controls:** Switch between 1.0x, 1.2x, 1.5x speed, mute toggle, and keyboard shortcuts (`Space` = Play/Pause, `Left/Right Arrows` = Prev/Next slide, `F` = Fullscreen).
4. **Interactive 20-Slide Grid Drawer:** Jump directly to any chapter across the entire episode.
5. **Sentence-by-Sentence Transcript:** Click any line in the chapter script to jump the audio directly to that exact moment.
6. **Dark Cinema Visual System:** Modern dark aesthetic, Polaroid-style asset displays, financial chips, and responsive layout.

---

## Pipeline

Voiceover, script export, loudness normalization and ship gates for the Remotion episode:

- `npm run vo` — regenerate narration audio + sentence timings from `data/slides.json` (`scripts/gen-vo.mjs`; supports `--only <id>[,<id>]` and `--dry-run`).
- `npm run script` — write `SCRIPT.md` from `data/slides.json` (`scripts/export-script.mjs`).
- `npm run render:ledger` / `npm run render:whiteboard` — render the full episode with Remotion in each theme.
- `bash scripts/loudnorm.sh <in.mp4> [out.mp4]` — two-pass EBU R128 loudness normalization (I=-14 LUFS, TP=-1.5, LRA=11), video copied, audio re-encoded AAC 192k.
- `npm run gates` — run `scripts/check-gates.sh <mp4> [expected_seconds]`: resolution/fps, codecs, loudness, leading silence, frozen-frame, and duration checks; exits non-zero on any failure.

---

## Tech Stack
- Next.js 16 (App Router) + React 19
- TypeScript
- Tailwind CSS v4
- Lucide React Icons

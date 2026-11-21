// NEON NIGHTS — Spot 48 Differences (make.fun best-spot-the-difference-game-20261121-0451).
//
// A complete spot-the-difference game: 6 original night scenes (neon night market,
// coral reef, lantern alley, noodle stall, rainy station, moon garden), 48 fair
// differences (removed, recoloured, moved, resized, flipped, added), magnifier lens,
// keyboard play, hints, streaks, timer and a named found-list in English.
//
// The game is plain static files under game/ (game/index.html and its ES modules,
// no library, no network request). This program hands it in: it copies game/ and
// screenshots/ from beside this file to /output and writes /output/dossier.json,
// the summary the judge reads, with the vendored make.fun library.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Fail fast with a clear message when the hand-in is incomplete, instead of
// copying a half-built game: the game must exist, and at least 3 screenshots
// (the cover first by name) must be present.
const gameDir = join(here, 'game');
if (!existsSync(join(gameDir, 'index.html'))) throw new Error('game/index.html is missing');
const shotsDir = join(here, 'screenshots');
if (!existsSync(shotsDir)) throw new Error('screenshots/ is missing');
const shots = readdirSync(shotsDir)
  .filter((f) => !f.startsWith('.') && statSync(join(shotsDir, f)).isFile())
  .sort();
if (shots.length < 3 || shots.length > 4) throw new Error(`expected 3 or 4 screenshots, found ${shots.length}`);
for (const s of shots) {
  if (statSync(join(shotsDir, s)).size > 262144) throw new Error(`screenshot ${s} is over 256 KiB`);
}

mkdirSync(out, { recursive: true });
cpSync(join(here, 'game'), join(out, 'game'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the bytes; the others refuse an entry the
// scorer would refuse (more than 4 screenshots or one over 256 KiB; more than 993 files in game/ or 48 MiB of game
// files, in all, or a path under game/ over 1000 bytes: game/ counts beside /output's own 1000-entry cap, its
// screenshots/ and dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);

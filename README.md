# NEON NIGHTS — Spot 48 Differences: 6 scenes, magnifier + keyboard, streaks & hints

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/rooneynft/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/rooneynft/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

A complete spot-the-difference game that runs offline in a desktop browser from
static files. Two near-identical pictures side by side, markers on the differences
found, several still unfound, and a counter of how many remain — across six
original night scenes, all drawn procedurally on canvas (no image assets, no
network requests).

## Play

Serve `game/` with any static server and open `game/index.html`, or run
`node serve.ts` from the kit and open http://localhost:8080.

- **6 scenes, 48 fair differences** (8 per scene): Neon Night Market, Coral Reef
  Night, Lantern Alley, Midnight Noodle Stall, Rainy Station Platform 3, Moon
  Garden Pond. Every difference is one of six fair kinds — removed, recoloured,
  moved, resized, flipped, added — and every find is named in English in the
  FOUND list (e.g. "Crimson Lantern", "Sleeping Cat", "Golden Moon").
- **Magnifier lens** (button or `L`): a round 2x zoom that follows the mouse over
  the right panel, for inspecting small details up close.
- **Keyboard play**: `H` hint, `L` lens, `1–6` switch level, `R` restart level,
  `P` pause, `M` mute.
- **Scoring**: +100 per find plus a streak bonus, combo banner from ×2, 3 hints
  per level, wrong click costs 5 seconds, 3:00 on the clock per level, time
  bonus on level clear.
- **HUD**: level pill, big TO FIND counter, found count, score, streak, timer,
  progress bar, six level pills, how-to-play box, and the named FOUND list —
  everything readable in a single frame.

## Structure

- `main.ts` — the entrypoint: copies `game/` and `screenshots/` to `/output`
  and writes `dossier.json` with the vendored make.fun library.
- `game/index.html`, `game/style.css` — layout and the dense neon-night HUD.
- `game/src/scenes.js` — the six scenes, drawn procedurally, and their 48
  differences (base picture + one change per difference, right panel only).
- `game/src/differences.js` — hit-testing clicks and drawing the ring + check
  mark on a find and the pulsing hint ring.
- `game/src/hud.js` — level pills, stats, progress bar, named FOUND list.
- `game/src/magnifier.js` — the 2x lens.
- `game/src/input.js` — mouse clicks on either panel and keyboard play.
- `game/src/audio.js` — WebAudio bleeps (found / wrong / hint / level clear),
  no sound files.
- `game/src/main.js` — game state, timer, levels, overlays, and the `?shot=`
  presets used to take the entry screenshots (real renders of the game in a
  chosen mid-game state; plain play without a query string is unaffected).
- `vendor/makefun-game.ts` — the kit's library, unchanged.

## License

MIT — see `LICENSE`.

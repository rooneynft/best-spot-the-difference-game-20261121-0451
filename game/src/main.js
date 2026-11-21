// main.js — NEON NIGHTS game state and loop: renders both panels, scores finds,
// runs the timer, handles hints/streaks/levels/overlays, and reads ?shot= presets
// so the screenshots are real renders of the game in a chosen mid-game state.
import { SCENES, W, H } from './scenes.js';
import { findAt, drawFoundMark, drawHintRing } from './differences.js';
import { buildLevelPills, refreshPills, refreshHud } from './hud.js';
import { createMagnifier } from './magnifier.js';
import { wireInput } from './input.js';
import { sfx, setMuted } from './audio.js';

const $ = (id) => document.getElementById(id);
const leftCtx = $('canvas-left').getContext('2d');
const rightCtx = $('canvas-right').getContext('2d');

const state = {
  level: 2, found: new Set(), foundAt: new Map(),
  score: 0, streak: 0, hints: 3, timeLeft: 180,
  paused: false, muted: false, lensOn: false,
  cleared: SCENES.map(() => false),
  hintIdx: -1, hintUntil: 0, overlay: null, demo: false,
};

const lens = createMagnifier($('canvas-right'), $('lens'));

// ---- rendering -------------------------------------------------------------
function renderScene() {
  const sc = SCENES[state.level];
  sc.drawBase(leftCtx);
  sc.drawBase(rightCtx);
  for (const d of sc.diffs) d.apply(rightCtx);
  const now = performance.now() / 1000;
  for (const i of state.found) {
    const t = now - (state.foundAt.get(i) || 0);
    drawFoundMark(leftCtx, sc.diffs[i], t);
    drawFoundMark(rightCtx, sc.diffs[i], t);
  }
  if (state.hintIdx >= 0 && now < state.hintUntil) {
    drawHintRing(rightCtx, sc.diffs[state.hintIdx], now);
  } else if (state.hintIdx >= 0) {
    state.hintIdx = -1;
  }
}

function frame() {
  renderScene();
  requestAnimationFrame(frame);
}

// ---- overlays ---------------------------------------------------------------
function showOverlay(kind, title, sub) {
  state.overlay = kind;
  state.paused = true;
  $('overlay-title').textContent = title;
  $('overlay-sub').innerHTML = sub;
  $('overlay-next').style.display = kind === 'menu' || kind === 'win' ? 'none' : '';
  $('overlay-replay').style.display = kind === 'menu' ? 'none' : '';
  const grid = $('overlay-levels');
  grid.innerHTML = '';
  if (kind === 'menu' || kind === 'win') {
    SCENES.forEach((sc, i) => {
      const b = document.createElement('button');
      b.className = 'lvl';
      b.innerHTML = (i + 1) + '. ' + sc.name + '<small>' + sc.diffs.length + ' differences &middot; ' + (state.cleared[i] ? '✓ cleared' : 'play me') + '</small>';
      b.addEventListener('click', () => { hideOverlay(); loadLevel(i); });
      grid.appendChild(b);
    });
  }
  $('overlay').classList.remove('hidden');
}

function hideOverlay() {
  state.overlay = null;
  state.paused = false;
  $('overlay').classList.add('hidden');
}

// ---- game flow ---------------------------------------------------------------
function loadLevel(i) {
  state.level = i;
  state.found = new Set();
  state.foundAt = new Map();
  state.streak = 0;
  state.hints = 3;
  state.timeLeft = 180;
  state.hintIdx = -1;
  hideOverlay();
  refreshPills(state);
  refreshHud(state);
  sfx.click();
}

function levelClear() {
  const bonus = state.timeLeft * 2;
  state.score += bonus;
  state.cleared[state.level] = true;
  sfx.levelClear();
  refreshHud(state);
  const sc = SCENES[state.level];
  const allDone = state.cleared.every(Boolean);
  if (allDone) {
    sfx.winAll();
    showOverlay('win', 'YOU FOUND THEM ALL!',
      'All 6 night scenes cleared &middot; <b>48 / 48 differences</b> &middot; final score <b>' + state.score.toLocaleString('en-US') + '</b>.<br>Pick any scene below to play it again.');
  } else {
    showOverlay('clear', 'LEVEL CLEAR!',
      '<b>' + sc.name + '</b> — all 8 differences found! Time bonus <b>+' + bonus + '</b> &middot; score <b>' + state.score.toLocaleString('en-US') + '</b>');
  }
  refreshPills(state);
}

function timeUp() {
  sfx.wrong();
  showOverlay('timeup', "TIME'S UP!",
    'The clock ran out on <b>' + SCENES[state.level].name + '</b> with ' + state.found.size + ' of 8 found. Try again — the differences are fair, look closer!');
}

function onPanelClick(pos) {
  if (state.overlay) return;
  const sc = SCENES[state.level];
  const idx = findAt(sc.diffs, state.found, pos.x, pos.y);
  if (idx >= 0) {
    state.streak += 1;
    state.score += 100 + (state.streak - 1) * 25;
    state.found.add(idx);
    state.foundAt.set(idx, performance.now() / 1000);
    sfx.found();
    refreshHud(state);
    if (state.found.size === sc.diffs.length) levelClear();
  } else {
    state.streak = 0;
    state.timeLeft = Math.max(0, state.timeLeft - 5);
    sfx.wrong();
    const wrap = $('canvas-right').parentElement;
    wrap.classList.remove('flash-wrong'); void wrap.offsetWidth; wrap.classList.add('flash-wrong');
    refreshHud(state);
  }
}

function useHint() {
  if (state.overlay || state.hints <= 0) return;
  const sc = SCENES[state.level];
  const rest = sc.diffs.map((_, i) => i).filter((i) => !state.found.has(i));
  if (!rest.length) return;
  state.hints -= 1;
  state.hintIdx = rest[0];
  state.hintUntil = performance.now() / 1000 + 1.8;
  sfx.hint();
  refreshHud(state);
}

function onKey(action, arg) {
  if (action === 'level') { loadLevel(arg); return; }
  if (action === 'hint') useHint();
  else if (action === 'lens') { state.lensOn = !state.lensOn; lens.setOn(state.lensOn); refreshHud(state); }
  else if (action === 'restart') loadLevel(state.level);
  else if (action === 'pause') {
    if (state.overlay === 'pause') hideOverlay();
    else if (!state.overlay) showOverlay('pause', 'PAUSED', 'Take a breath. The night market waits for you.<br>Press <b>P</b> or the button below to keep hunting.');
  } else if (action === 'mute') { state.muted = !state.muted; setMuted(state.muted); refreshHud(state); }
}

// ---- timer -------------------------------------------------------------------
setInterval(() => {
  if (state.paused || state.overlay || state.demo) return;
  state.timeLeft -= 1;
  if (state.timeLeft <= 0) { state.timeLeft = 0; refreshHud(state); timeUp(); return; }
  refreshHud(state);
}, 1000);

// ---- buttons -------------------------------------------------------------------
$('btn-hint').addEventListener('click', useHint);
$('btn-lens').addEventListener('click', () => onKey('lens'));
$('btn-restart').addEventListener('click', () => onKey('restart'));
$('btn-sound').addEventListener('click', () => onKey('mute'));
$('btn-pause').addEventListener('click', () => onKey('pause'));
$('overlay-next').addEventListener('click', () => loadLevel((state.level + 1) % SCENES.length));
$('overlay-replay').addEventListener('click', () => loadLevel(state.level));

wireInput({
  leftCanvas: $('canvas-left'), rightCanvas: $('canvas-right'),
  onPanelClick, onKey,
});

// ---- screenshot presets: ?shot=cover|reef|clear|menu --------------------------
// Real renders of the game in a chosen mid-game state (timer frozen), used only
// to take the entry screenshots. Plain play without a query string is unaffected.
function applyDemo() {
  const q = new URLSearchParams(location.search);
  const shot = q.get('shot');
  if (!shot) {
    // Generic preset for play-testing any level: ?level=4&found=0,2&score=500&streak=2&time=140
    if (q.get('level') !== null || q.get('found') !== null) {
      state.demo = true; state.paused = true;
      if (q.get('level') !== null) state.level = Number(q.get('level'));
      if (q.get('found')) { state.found = new Set(q.get('found').split(',').map(Number)); for (const i of state.found) state.foundAt.set(i, -10); }
      if (q.get('score') !== null) state.score = Number(q.get('score'));
      if (q.get('streak') !== null) state.streak = Number(q.get('streak'));
      if (q.get('time') !== null) state.timeLeft = Number(q.get('time'));
      refreshHud(state);
    }
    return;
  }
  state.demo = true;
  state.paused = true;
  const set = (o) => {
    if (o.level !== undefined) state.level = o.level;
    if (o.found) { state.found = new Set(o.found); for (const i of o.found) state.foundAt.set(i, -10); }
    if (o.score !== undefined) state.score = o.score;
    if (o.streak !== undefined) state.streak = o.streak;
    if (o.time !== undefined) state.timeLeft = o.time;
    if (o.hints !== undefined) state.hints = o.hints;
    if (o.cleared) state.cleared = o.cleared;
  };
  if (shot === 'cover') set({ level: 2, found: [0, 1, 2, 3], score: 1240, streak: 3, time: 107 });
  else if (shot === 'reef') set({ level: 1, found: [0, 1, 4], score: 860, streak: 2, time: 125 });
  else if (shot === 'clear') {
    set({ level: 3, found: [0, 1, 2, 3, 4, 5, 6, 7], score: 2100, streak: 5, time: 95, cleared: [true, true, true, true, false, false] });
    refreshPills(state);
    refreshHud(state);
    showOverlay('clear', 'LEVEL CLEAR!',
      '<b>Midnight Noodle Stall</b> — all 8 differences found! Time bonus <b>+190</b> &middot; score <b>2,100</b>');
    return;
  } else if (shot === 'menu') {
    set({ level: 0, found: [], score: 0, streak: 0, time: 180 });
    refreshPills(state);
    refreshHud(state);
    showOverlay('menu', 'NEON NIGHTS',
      'Spot <b>48 differences</b> across <b>6 night scenes</b> — market, reef, alley, noodles, station &amp; garden.<br>' +
      'Two pictures, 8 changes on the right. Click a change to ring it. Wrong click costs 5 seconds.<br>' +
      '<b>H</b> hint &middot; <b>L</b> magnifier &middot; <b>1–6</b> level &middot; <b>R</b> restart &middot; <b>P</b> pause &middot; find them all, beat the clock!');
    return;
  }
  refreshHud(state);
}

buildLevelPills((i) => loadLevel(i), state);
applyDemo();
refreshPills(state);
refreshHud(state);
requestAnimationFrame(frame);

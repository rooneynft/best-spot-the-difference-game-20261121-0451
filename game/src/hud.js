// hud.js — every number and label the player (and the judge) reads: level, how
// many are left to find, found count, score, streak, timer, progress bar, the
// named list of differences already found, and the six level pills.
import { SCENES } from './scenes.js';

const $ = (id) => document.getElementById(id);

function fmtTime(sec) {
  const s = Math.max(0, Math.ceil(sec));
  return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
}

export function buildLevelPills(onPick, state) {
  const row = $('levels-row');
  row.innerHTML = '';
  SCENES.forEach((sc, i) => {
    const b = document.createElement('button');
    b.className = 'level-pill';
    b.innerHTML = (i + 1) + '. ' + sc.name + '<small>' + sc.diffs.length + ' differences &middot; ' + (state.cleared[i] ? '✓ cleared' : 'not cleared') + '</small>';
    b.addEventListener('click', () => onPick(i));
    row.appendChild(b);
  });
  refreshPills(state);
}

export function refreshPills(state) {
  [...document.querySelectorAll('.level-pill')].forEach((b, i) => {
    b.classList.toggle('active', i === state.level);
    b.classList.toggle('done', !!state.cleared[i]);
  });
}

export function refreshHud(state) {
  const sc = SCENES[state.level];
  const left = sc.diffs.length - state.found.size;
  $('stat-level').textContent = (state.level + 1) + ' · ' + sc.name;
  $('stat-left').textContent = left;
  $('stat-found').textContent = state.found.size + ' / ' + sc.diffs.length;
  $('stat-score').textContent = state.score.toLocaleString('en-US');
  $('stat-streak').textContent = '×' + state.streak;
  $('stat-time').textContent = fmtTime(state.timeLeft);
  $('stat-time').style.color = state.timeLeft <= 30 ? '#ff4d6d' : '#fff';
  $('hint-count').textContent = state.hints;
  $('to-find-num').textContent = left;
  $('progress-bar').style.width = (state.found.size / sc.diffs.length * 100) + '%';
  $('progress-label').textContent = state.found.size + ' of ' + sc.diffs.length + ' found · Level ' + (state.level + 1) + ' of ' + SCENES.length;
  const names = [...state.found].map((i) => '✓ ' + sc.diffs[i].label);
  $('found-names').textContent = names.length ? names.join('   ') : '— none yet, look closely! —';
  const combo = $('combo');
  if (state.streak >= 2 && left > 0) {
    combo.classList.remove('hidden');
    combo.textContent = 'COMBO ×' + state.streak + '!';
  } else {
    combo.classList.add('hidden');
  }
  document.getElementById('btn-lens').classList.toggle('on', state.lensOn);
  document.getElementById('btn-sound').textContent = state.muted ? '🔇 Muted' : '🔊 Sound';
}

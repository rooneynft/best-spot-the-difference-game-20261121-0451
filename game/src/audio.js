// audio.js — tiny WebAudio bleeps, no sound files, no network. Mute toggles everything.
let ctx = null;
let muted = false;

export function setMuted(m) { muted = m; }
export function isMuted() { return muted; }

function beep(freq, dur, type = 'sine', vol = 0.12, when = 0) {
  if (muted) return;
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    const t = ctx.currentTime + when;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); g.connect(ctx.destination);
    o.start(t); o.stop(t + dur);
  } catch (_e) { /* audio unavailable: the game still plays */ }
}

export const sfx = {
  found() { beep(660, 0.12, 'sine'); beep(880, 0.16, 'sine', 0.12, 0.09); beep(1320, 0.2, 'sine', 0.08, 0.18); },
  wrong() { beep(160, 0.22, 'sawtooth', 0.08); },
  hint() { beep(520, 0.1, 'triangle', 0.1); beep(780, 0.14, 'triangle', 0.1, 0.08); },
  click() { beep(440, 0.06, 'triangle', 0.06); },
  levelClear() { [523, 659, 784, 1047].forEach((f, i) => beep(f, 0.22, 'sine', 0.12, i * 0.11)); },
  winAll() { [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => beep(f, 0.3, 'sine', 0.12, i * 0.12)); },
};

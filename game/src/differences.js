// differences.js — finding a difference: hit-testing a click against the
// unfound differences, and drawing the satisfying mark on a find: a glowing
// ring plus a check on BOTH panels, plus the pulsing hint ring.
export function findAt(diffs, found, x, y) {
  let best = -1, bestD = 1e9;
  diffs.forEach((d, i) => {
    if (found.has(i)) return;
    const dist = Math.hypot(d.x - x, d.y - y);
    if (dist <= d.r + 6 && dist < bestD) { best = i; bestD = dist; }
  });
  return best;
}

export function drawFoundMark(c, d, t) {
  // t: seconds since the find, for a short pop animation
  const pop = t < 0.25 ? 0.7 + (t / 0.25) * 0.4 : 1.1 - Math.min(0.1, (t - 0.25) * 0.1);
  const r = d.r * pop;
  c.save();
  c.shadowColor = '#2ee6a8'; c.shadowBlur = 12;
  c.strokeStyle = '#2ee6a8'; c.lineWidth = 4;
  c.beginPath(); c.arc(d.x, d.y, r, 0, 7); c.stroke();
  c.shadowBlur = 0;
  c.fillStyle = '#2ee6a8';
  c.beginPath(); c.arc(d.x + r * 0.7, d.y - r * 0.7, 11, 0, 7); c.fill();
  c.strokeStyle = '#06281c'; c.lineWidth = 3; c.lineCap = 'round';
  c.beginPath();
  c.moveTo(d.x + r * 0.7 - 5, d.y - r * 0.7);
  c.lineTo(d.x + r * 0.7 - 1, d.y - r * 0.7 + 4);
  c.lineTo(d.x + r * 0.7 + 6, d.y - r * 0.7 - 5);
  c.stroke();
  c.restore();
}

export function drawHintRing(c, d, phase) {
  const pulse = 1 + 0.18 * Math.sin(phase * 6);
  c.save();
  c.strokeStyle = '#ffd23f'; c.lineWidth = 4;
  c.setLineDash([10, 7]); c.lineDashOffset = -phase * 30;
  c.beginPath(); c.arc(d.x, d.y, d.r * pulse, 0, 7); c.stroke();
  c.restore();
}

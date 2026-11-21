// magnifier.js — the lens: a round 2x zoom that follows the mouse over the right
// panel, so small differences can be inspected up close. Toggle with the Lens
// button or the L key.
export function createMagnifier(rightCanvas, lensCanvas) {
  const lens = lensCanvas.getContext('2d');
  const R = 75; // lens radius in css px
  let on = false;

  function showAt(ev) {
    const rect = rightCanvas.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    const scale = rightCanvas.width / rect.width;
    const sx = x * scale, sy = y * scale;
    lens.clearRect(0, 0, 150, 150);
    lens.save();
    lens.beginPath(); lens.arc(75, 75, 73, 0, 7); lens.clip();
    // 2x zoom: draw a 75x75 source patch scaled to the 150px lens
    lens.imageSmoothingEnabled = false;
    lens.drawImage(rightCanvas, sx - 37.5, sy - 37.5, 75, 75, 0, 0, 150, 150);
    lens.restore();
    lens.strokeStyle = '#ffd23f'; lens.lineWidth = 3;
    lens.beginPath(); lens.arc(75, 75, 73, 0, 7); lens.stroke();
    lens.strokeStyle = 'rgba(255,210,63,.9)'; lens.lineWidth = 1.5;
    lens.beginPath(); lens.moveTo(75, 62); lens.lineTo(75, 88); lens.moveTo(62, 75); lens.lineTo(88, 75); lens.stroke();
    lensCanvas.style.display = 'block';
    lensCanvas.style.left = Math.min(Math.max(x - R, 0), rect.width - 150) + 'px';
    lensCanvas.style.top = Math.min(Math.max(y - R, 0), rect.height - 150) + 'px';
  }

  function hide() { lensCanvas.style.display = 'none'; }

  rightCanvas.addEventListener('mousemove', (ev) => { if (on) showAt(ev); });
  rightCanvas.addEventListener('mouseleave', hide);

  return {
    setOn(v) { on = v; if (!on) hide(); },
    isOn() { return on; },
  };
}

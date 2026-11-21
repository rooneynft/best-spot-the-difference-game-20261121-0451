// input.js — mouse clicks on either panel plus keyboard play:
// H hint, L lens, 1-6 level, R restart, P pause, M mute.
export function wireInput(deps) {
  const { leftCanvas, rightCanvas, onPanelClick, onKey } = deps;

  function clickPos(canvas, ev) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (ev.clientX - rect.left) * (canvas.width / rect.width),
      y: (ev.clientY - rect.top) * (canvas.height / rect.height),
    };
  }
  leftCanvas.addEventListener('click', (ev) => onPanelClick(clickPos(leftCanvas, ev)));
  rightCanvas.addEventListener('click', (ev) => onPanelClick(clickPos(rightCanvas, ev)));

  document.addEventListener('keydown', (ev) => {
    if (ev.repeat) return;
    const k = ev.key.toLowerCase();
    if (k >= '1' && k <= '6') onKey('level', Number(k) - 1);
    else if (k === 'h') onKey('hint');
    else if (k === 'l') onKey('lens');
    else if (k === 'r') onKey('restart');
    else if (k === 'p') onKey('pause');
    else if (k === 'm') onKey('mute');
  });
}

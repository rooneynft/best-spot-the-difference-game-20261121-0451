// scenes.js — the six original night scenes of NEON NIGHTS, drawn procedurally on
// canvas (no image assets, no network). Each scene draws the same base picture on
// both panels; each difference is a small, fair change applied only to the right
// panel: removed, recoloured, moved, resized, flipped or added. Every difference
// is big enough to find and small enough to hunt for.

export const W = 560;
export const H = 360;

// ---- tiny drawing helpers -------------------------------------------------
function R(c, x, y, w, h, fill) { c.fillStyle = fill; c.fillRect(x, y, w, h); }
function C(c, x, y, r, fill) { c.fillStyle = fill; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); }
function E(c, x, y, rx, ry, fill) { c.fillStyle = fill; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, 7); c.fill(); }
function T(c, txt, x, y, size, fill, align = 'center', weight = 900) {
  c.fillStyle = fill; c.font = weight + ' ' + size + 'px "Trebuchet MS", Verdana, sans-serif';
  c.textAlign = align; c.textBaseline = 'middle'; c.fillText(txt, x, y);
}
function L(c, x1, y1, x2, y2, color, width = 2) {
  c.strokeStyle = color; c.lineWidth = width; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
}
function P(c, pts, fill) {
  c.fillStyle = fill; c.beginPath(); c.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]);
  c.closePath(); c.fill();
}
function sky(c, c1, c2) {
  const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, c1); g.addColorStop(1, c2);
  c.fillStyle = g; c.fillRect(0, 0, W, H);
}
function stars(c, pts) { for (const [x, y, r] of pts) { C(c, x, y, r, '#fff7c0'); } }
function moon(c, x, y, r, color = '#ffe98a') {
  c.shadowColor = '#ffe98a'; c.shadowBlur = 18; C(c, x, y, r, color); c.shadowBlur = 0;
  C(c, x - r * 0.3, y - r * 0.2, r * 0.16, '#f5d76e'); C(c, x + r * 0.25, y + r * 0.3, r * 0.12, '#f5d76e');
}
function lantern(c, x, y, r, color) {
  c.shadowColor = color; c.shadowBlur = 12;
  E(c, x, y, r, r * 1.15, color); c.shadowBlur = 0;
  R(c, x - r * 0.35, y - r * 1.3, r * 0.7, 4, '#ffd23f');
  R(c, x - r * 0.35, y + r * 1.15, r * 0.7, 4, '#ffd23f');
  L(c, x - r * 0.55, y - r * 0.5, x + r * 0.55, y - r * 0.5, 'rgba(0,0,0,.25)', 2);
  L(c, x - r * 0.55, y + r * 0.4, x + r * 0.55, y + r * 0.4, 'rgba(0,0,0,.25)', 2);
}
function fish(c, x, y, s, body, facing = 1) {
  c.save(); c.translate(x, y); c.scale(facing * s, s);
  P(c, [[-16, 0], [-26, -9], [-26, 9]], '#ff9f1c');
  E(c, 0, 0, 18, 10, body);
  P(c, [[-2, -8], [4, -15], [8, -8]], body);
  C(c, 9, -2, 2.4, '#101020');
  c.restore();
}
function cat(c, x, y, s, color = '#2b2b3d') {
  c.save(); c.translate(x, y); c.scale(s, s);
  E(c, 0, 0, 16, 11, color); C(c, 13, -9, 8, color);
  P(c, [[8, -15], [10, -24], [14, -15]], color); P(c, [[15, -15], [18, -24], [21, -14]], color);
  L(c, -14, -2, -26, -14, color, 4); // tail up
  C(c, 15, -10, 1.6, '#ffd23f'); c.restore();
}

// ---- Scene 1: Neon Night Market -------------------------------------------
const market = {
  id: 'market', name: 'Neon Night Market', short: 'Night Market', time: '3:00',
  drawBase(c) {
    sky(c, '#1a0b2e', '#3b1155');
    stars(c, [[40, 30, 2], [120, 55, 1.6], [200, 25, 2], [320, 45, 2], [380, 30, 1.5], [520, 40, 2], [90, 70, 1.4], [250, 60, 1.5]]);
    moon(c, 470, 55, 26);
    // string lights
    L(c, 0, 78, 560, 66, '#0d0518', 2);
    for (const [x, y, col] of [[60, 76, '#ff4d6d'], [140, 73, '#ffd23f'], [220, 70, '#2ee6a8'], [300, 68, '#ff4d6d'], [380, 70, '#ffd23f'], [460, 74, '#2ee6a8'], [520, 77, '#ff4d6d']]) C(c, x, y + 6, 5, col);
    // ground
    R(c, 0, 300, 560, 60, '#241433');
    // stalls
    stall(c, 30, 190, '#12b5a5', 'FRUIT'); stall(c, 200, 360, '#e84a7f', 'MARKET'); stall(c, 370, 530, '#ff8c1a', 'DUMPLING');
    // fruit on stall 1
    C(c, 80, 272, 9, '#ff4d6d'); C(c, 100, 272, 9, '#ff4d6d'); C(c, 120, 272, 9, '#7ee787'); C(c, 90, 258, 9, '#ff8c1a'); C(c, 110, 258, 9, '#ff4d6d');
    // jars on stall 2
    R(c, 240, 250, 18, 24, '#ffd23f'); R(c, 266, 250, 18, 24, '#2ee6a8'); R(c, 292, 250, 18, 24, '#ff4d6d');
    // dumplings on stall 3
    E(c, 415, 272, 12, 8, '#fff3d6'); E(c, 440, 272, 12, 8, '#fff3d6'); E(c, 465, 272, 12, 8, '#fff3d6');
    // hanging lanterns
    lantern(c, 90, 95, 14, '#ff3b30'); lantern(c, 270, 85, 14, '#ffd23f'); lantern(c, 440, 100, 14, '#ff3b30');
    // flag on stall 1
    L(c, 185, 150, 185, 118, '#8a7a5a', 3); P(c, [[185, 118], [208, 125], [185, 132]], '#ffd23f');
    // cat on a crate, right
    R(c, 492, 288, 44, 14, '#6b4a2f'); cat(c, 512, 282, 0.9);
  },
  diffs: [
    { label: 'Red Paper Lantern', kind: 'recoloured', x: 90, y: 95, r: 20, apply(c) { lantern(c, 90, 95, 14, '#12b5a5'); } },
    { label: 'Tiny Star', kind: 'removed', x: 320, y: 45, r: 10, apply(c) { C(c, 320, 45, 6, '#2a1048'); } },
    { label: 'Extra Dumpling', kind: 'added', x: 415, y: 250, r: 14, apply(c) { E(c, 415, 250, 12, 8, '#fff3d6'); C(c, 412, 247, 2, '#e8a04c'); C(c, 418, 247, 2, '#e8a04c'); } },
    { label: "Cat's Tail", kind: 'moved', x: 488, y: 272, r: 14, apply(c) { L(c, 498, 280, 486, 268, '#4a2c5a', 5); L(c, 528, 280, 540, 266, '#2b2b3d', 4); } },
    { label: 'Golden Moon', kind: 'resized', x: 470, y: 55, r: 30, apply(c) { moon(c, 470, 55, 38); } },
    { label: 'Green Apple', kind: 'removed', x: 120, y: 272, r: 12, apply(c) { C(c, 120, 272, 10, '#5a2d4d'); } },
    { label: 'Gold Lantern', kind: 'moved', x: 270, y: 85, r: 20, apply(c) { E(c, 270, 85, 17, 19, '#33164e'); lantern(c, 312, 85, 14, '#ffd23f'); } },
    { label: 'Stall Flag', kind: 'flipped', x: 196, y: 125, r: 14, apply(c) { P(c, [[185, 118], [208, 125], [185, 132]], '#33164e'); P(c, [[185, 118], [162, 125], [185, 132]], '#ffd23f'); } },
  ],
};
function stall(c, x0, x1, awn, word) {
  R(c, x0, 200, x1 - x0, 100, '#4a2c5a');
  R(c, x0, 200, x1 - x0, 26, awn);
  for (let x = x0; x < x1; x += 20) R(c, x, 200, 10, 26, 'rgba(255,255,255,.28)');
  R(c, x0, 274, x1 - x0, 10, '#7a5a3a');
  T(c, word, (x0 + x1) / 2, 213, 13, '#ffffff');
}

// ---- Scene 2: Coral Reef Night --------------------------------------------
const reef = {
  id: 'reef', name: 'Coral Reef Night', short: 'Coral Reef', time: '3:00',
  drawBase(c) {
    sky(c, '#04263e', '#0a4a6b');
    for (const [x, y, r] of [[60, 60, 2], [180, 40, 1.6], [300, 70, 2], [420, 45, 1.5], [500, 80, 2], [240, 30, 1.4]]) C(c, x, y, r, '#bfe9ff');
    // light rays
    c.fillStyle = 'rgba(120,220,255,.07)';
    P(c, [[120, 0], [200, 0], [90, 310], [20, 310]], 'rgba(120,220,255,.07)');
    P(c, [[380, 0], [440, 0], [480, 310], [400, 310]], 'rgba(120,220,255,.07)');
    // sand
    R(c, 0, 310, 560, 50, '#d9b380'); E(c, 280, 312, 280, 10, '#c9a06e');
    // corals
    coral(c, 70, 310, '#ff6b9d'); coral(c, 300, 310, '#ff8c42'); coral(c, 490, 310, '#b678ff');
    // seaweed
    for (const [x, h] of [[150, 70], [170, 90], [360, 80], [420, 60]]) {
      c.strokeStyle = '#2ee6a8'; c.lineWidth = 7; c.beginPath(); c.moveTo(x, 310);
      c.quadraticCurveTo(x + 12, 310 - h / 2, x - 4, 310 - h); c.stroke();
    }
    // fish
    fish(c, 150, 120, 1, '#ff8c42', 1); fish(c, 350, 90, 0.9, '#4db8ff', -1); fish(c, 430, 180, 0.7, '#ffd23f', 1);
    // jellyfish
    jelly(c, 250, 150);
    // starfish + shell
    starfish(c, 120, 330, '#ff6b9d'); E(c, 470, 332, 12, 8, '#fff3d6');
    // bubbles
    for (const [x, y, r] of [[250, 110, 4], [258, 92, 3], [430, 140, 3], [360, 200, 4]]) {
      c.strokeStyle = 'rgba(255,255,255,.8)'; c.lineWidth = 1.5;
      c.beginPath(); c.arc(x, y, r, 0, 7); c.stroke();
    }
  },
  diffs: [
    { label: 'Orange Fish', kind: 'recoloured', x: 150, y: 120, r: 22, apply(c) { fish(c, 150, 120, 1, '#b678ff', 1); } },
    { label: 'Pink Starfish', kind: 'removed', x: 120, y: 330, r: 14, apply(c) { starfish(c, 120, 330, '#d9b380'); } },
    { label: 'Extra Bubble', kind: 'added', x: 300, y: 80, r: 10, apply(c) { c.strokeStyle = 'rgba(255,255,255,.9)'; c.lineWidth = 1.5; c.beginPath(); c.arc(300, 80, 6, 0, 7); c.stroke(); } },
    { label: 'Jellyfish', kind: 'moved', x: 250, y: 150, r: 22, apply(c) { E(c, 250, 150, 26, 26, '#073a55'); jelly(c, 292, 150); } },
    { label: 'Purple Coral', kind: 'resized', x: 490, y: 280, r: 24, apply(c) { coral(c, 490, 310, '#b678ff', 1.45); } },
    { label: 'Blue Fish', kind: 'flipped', x: 350, y: 90, r: 22, apply(c) { E(c, 350, 90, 26, 16, '#0a4a6b'); fish(c, 350, 90, 0.9, '#4db8ff', 1); } },
    { label: 'Golden Shell', kind: 'added', x: 470, y: 312, r: 12, apply(c) { E(c, 470, 312, 12, 8, '#ffd23f'); } },
    { label: 'Tall Seaweed', kind: 'resized', x: 170, y: 250, r: 16, apply(c) { L(c, 170, 232, 166, 222, '#0a4a6b', 9); } },
  ],
};
function coral(c, x, base, color, s = 1) {
  c.save(); c.translate(x, base); c.scale(s, s);
  c.strokeStyle = color; c.lineCap = 'round';
  for (const [dx, dy, w] of [[0, -60, 8], [-22, -42, 6], [22, -46, 6], [-8, -78, 5], [10, -72, 5]]) {
    c.lineWidth = w; c.beginPath(); c.moveTo(0, 0); c.lineTo(dx, dy); c.stroke();
    C(c, dx, dy, w * 0.9, color);
  }
  c.restore();
}
function jelly(c, x, y) {
  c.shadowColor = '#ff9de2'; c.shadowBlur = 14;
  c.fillStyle = '#ff9de2'; c.beginPath(); c.arc(x, y, 18, Math.PI, 0); c.closePath(); c.fill();
  c.shadowBlur = 0; c.strokeStyle = '#ff9de2'; c.lineWidth = 3;
  for (const dx of [-12, -4, 4, 12]) { c.beginPath(); c.moveTo(x + dx, y + 2); c.quadraticCurveTo(x + dx + 4, y + 18, x + dx, y + 30); c.stroke(); }
}
function starfish(c, x, y, color) {
  c.fillStyle = color; c.beginPath();
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + i * (Math.PI * 2 / 5);
    const a2 = a + Math.PI / 5;
    c.lineTo(x + Math.cos(a) * 13, y + Math.sin(a) * 13);
    c.lineTo(x + Math.cos(a2) * 5, y + Math.sin(a2) * 5);
  }
  c.closePath(); c.fill();
}

// ---- Scene 3: Lantern Alley (the cover scene) -----------------------------
const alley = {
  id: 'alley', name: 'Lantern Alley', short: 'Lantern Alley', time: '3:00',
  drawBase(c) {
    sky(c, '#2b1055', '#7a2d5e');
    moon(c, 470, 50, 24);
    stars(c, [[60, 30, 2], [150, 45, 1.5], [240, 28, 2], [340, 40, 1.6], [520, 90, 1.5]]);
    // walls
    R(c, 0, 0, 70, 360, '#3a1c4d'); R(c, 490, 0, 70, 360, '#3a1c4d');
    for (let y = 20; y < 360; y += 34) { L(c, 0, y, 70, y, 'rgba(0,0,0,.25)', 2); L(c, 490, y, 560, y, 'rgba(0,0,0,.25)', 2); }
    // lit windows on the walls
    R(c, 18, 150, 34, 44, '#ffd23f'); L(c, 18, 172, 52, 172, '#3a1c4d', 3); L(c, 35, 150, 35, 194, '#3a1c4d', 3);
    R(c, 508, 150, 34, 44, '#ffd23f'); L(c, 508, 172, 542, 172, '#3a1c4d', 3); L(c, 525, 150, 525, 194, '#3a1c4d', 3);
    // stone path + puddle
    R(c, 70, 290, 420, 70, '#241433'); E(c, 280, 330, 130, 14, '#5a2d6e');
    C(c, 240, 328, 2, '#fff7c0'); C(c, 300, 332, 2, '#fff7c0'); C(c, 330, 326, 1.6, '#fff7c0');
    // lantern strings
    L(c, 70, 60, 490, 52, '#0d0518', 2);
    lantern(c, 150, 75, 15, '#ff3b30'); lantern(c, 250, 72, 15, '#ffd23f'); lantern(c, 350, 72, 15, '#ff3b30');
    L(c, 70, 120, 490, 112, '#0d0518', 2);
    lantern(c, 200, 132, 13, '#ffd23f'); lantern(c, 300, 130, 13, '#ff3b30'); lantern(c, 400, 132, 13, '#ffd23f');
    // tea house sign (vertical board, right wall)
    R(c, 452, 170, 30, 74, '#7a1f2b'); R(c, 452, 170, 30, 74, 'rgba(255,210,63,.12)');
    T(c, 'TEA', 467, 196, 12, '#ffd23f'); T(c, 'HOUSE', 467, 214, 10, '#ffd23f');
    // paper fan on left wall
    fan(c, 35, 250);
    // cat on the low wall, right
    R(c, 400, 262, 70, 14, '#4a2c5a'); cat(c, 432, 256, 0.9);
  },
  diffs: [
    { label: 'Crimson Lantern', kind: 'recoloured', x: 150, y: 75, r: 20, apply(c) { lantern(c, 150, 75, 15, '#12b5a5'); } },
    { label: 'Lit Window', kind: 'removed', x: 35, y: 172, r: 18, apply(c) { R(c, 18, 150, 34, 44, '#2a1440'); } },
    { label: 'Extra Lantern', kind: 'added', x: 330, y: 130, r: 16, apply(c) { lantern(c, 330, 130, 13, '#ff3b30'); } },
    { label: 'Sleeping Cat', kind: 'moved', x: 432, y: 256, r: 20, apply(c) { E(c, 432, 256, 22, 16, '#5e2560'); cat(c, 382, 256, 0.9); } },
    { label: 'Golden Moon', kind: 'resized', x: 470, y: 50, r: 28, apply(c) { moon(c, 470, 50, 36); } },
    { label: 'Paper Fan', kind: 'flipped', x: 35, y: 250, r: 16, apply(c) { fan(c, 35, 250, true); } },
    { label: 'Puddle Star', kind: 'removed', x: 300, y: 332, r: 8, apply(c) { C(c, 300, 332, 4, '#5a2d6e'); } },
    { label: 'Gold Lantern', kind: 'moved', x: 250, y: 72, r: 20, apply(c) { E(c, 250, 72, 18, 20, '#4a1a55'); lantern(c, 292, 72, 15, '#ffd23f'); } },
  ],
};
function fan(c, x, y, flipped = false) {
  c.save(); c.translate(x, y); if (flipped) c.scale(-1, 1);
  c.fillStyle = '#ffd23f'; c.beginPath(); c.moveTo(0, 0);
  c.arc(0, 0, 20, Math.PI * 1.15, Math.PI * 1.85); c.closePath(); c.fill();
  c.strokeStyle = '#e07b00'; c.lineWidth = 2;
  for (const a of [1.25, 1.5, 1.75]) { c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(a * Math.PI) * 20, Math.sin(a * Math.PI) * 20); c.stroke(); }
  c.restore();
}

// ---- Scene 4: Noodle Stall -------------------------------------------------
const noodle = {
  id: 'noodle', name: 'Midnight Noodle Stall', short: 'Noodle Stall', time: '3:00',
  drawBase(c) {
    sky(c, '#160a2e', '#4d1a4d');
    stars(c, [[50, 35, 2], [160, 28, 1.5], [300, 40, 2], [450, 30, 1.6], [520, 60, 2]]);
    moon(c, 500, 45, 22);
    R(c, 0, 300, 560, 60, '#1d1030');
    // stall: posts + red awning
    R(c, 90, 120, 14, 190, '#6b4a2f'); R(c, 456, 120, 14, 190, '#6b4a2f');
    R(c, 70, 96, 420, 30, '#d92b2b');
    for (let x = 70; x < 490; x += 28) R(c, x, 96, 14, 30, '#fff3d6');
    T(c, 'RAMEN', 280, 82, 20, '#ffd23f');
    R(c, 80, 250, 400, 60, '#7a5a3a'); R(c, 80, 250, 400, 8, '#9a7a4a');
    // steaming bowls
    bowl(c, 150, 240, '#ff4d6d'); bowl(c, 280, 240, '#2ee6a8'); bowl(c, 410, 240, '#ffd23f');
    // chopsticks in middle bowl
    L(c, 272, 222, 292, 192, '#d9b380', 4); L(c, 282, 224, 300, 196, '#d9b380', 4);
    // menu board
    R(c, 30, 150, 44, 70, '#2b1a3d'); R(c, 30, 150, 44, 70, 'rgba(255,210,63,.1)');
    T(c, '¥', 52, 168, 16, '#ffd23f'); T(c, '5', 52, 188, 16, '#fff'); T(c, 'MENU', 52, 206, 8, '#b9a8ff');
    // paper lantern left + right
    lantern(c, 60, 120, 13, '#ff3b30'); lantern(c, 505, 120, 13, '#ffd23f');
    // stools
    for (const x of [150, 280, 410]) { R(c, x - 16, 312, 32, 8, '#8a5a2a'); R(c, x - 3, 320, 6, 22, '#8a5a2a'); }
    // cat waiting under counter
    cat(c, 480, 330, 0.8);
  },
  diffs: [
    { label: 'Red Bowl', kind: 'recoloured', x: 150, y: 240, r: 18, apply(c) { bowl(c, 150, 240, '#4db8ff'); } },
    { label: 'Menu Price', kind: 'removed', x: 52, y: 188, r: 12, apply(c) { T(c, '5', 52, 188, 16, '#2b1a3d'); } },
    { label: 'Extra Lantern', kind: 'added', x: 280, y: 120, r: 14, apply(c) { lantern(c, 280, 120, 13, '#ff3b30'); } },
    { label: 'Chopsticks', kind: 'moved', x: 286, y: 208, r: 16, apply(c) { L(c, 274, 220, 290, 200, '#4a2c5a', 5); L(c, 290, 200, 292, 192, '#33164e', 5); L(c, 284, 222, 298, 202, '#4a2c5a', 5); L(c, 298, 202, 300, 196, '#33164e', 5); L(c, 398, 222, 418, 192, '#d9b380', 4); L(c, 408, 224, 426, 196, '#d9b380', 4); } },
    { label: 'Golden Moon', kind: 'resized', x: 500, y: 45, r: 26, apply(c) { moon(c, 500, 45, 34); } },
    { label: 'Yellow Bowl', kind: 'recoloured', x: 410, y: 240, r: 18, apply(c) { bowl(c, 410, 240, '#b678ff'); } },
    { label: 'Waiting Cat', kind: 'moved', x: 480, y: 330, r: 18, apply(c) { E(c, 480, 330, 22, 14, '#1d1030'); cat(c, 70, 330, 0.8); } },
    { label: 'Awning Stripe', kind: 'removed', x: 210, y: 111, r: 12, apply(c) { R(c, 196, 96, 14, 30, '#d92b2b'); } },
  ],
};
function bowl(c, x, y, color) {
  E(c, x, y, 26, 10, color);
  E(c, x, y - 4, 22, 7, '#ffe9b0');
  c.strokeStyle = 'rgba(255,255,255,.65)'; c.lineWidth = 2;
  c.beginPath(); c.moveTo(x - 6, y - 12); c.quadraticCurveTo(x - 10, y - 22, x - 5, y - 28); c.stroke();
  c.beginPath(); c.moveTo(x + 6, y - 12); c.quadraticCurveTo(x + 10, y - 22, x + 5, y - 28); c.stroke();
}

// ---- Scene 5: Rainy Station -----------------------------------------------
const station = {
  id: 'station', name: 'Rainy Station Platform 3', short: 'Rainy Station', time: '3:00',
  drawBase(c) {
    sky(c, '#0d1b2e', '#1d3a5e');
    // rain
    c.strokeStyle = 'rgba(180,220,255,.4)'; c.lineWidth = 1.5;
    for (const [x, y] of [[40, 30], [120, 70], [200, 20], [300, 60], [380, 25], [460, 70], [520, 30], [80, 120], [240, 110], [420, 120]]) {
      c.beginPath(); c.moveTo(x, y); c.lineTo(x - 6, y + 18); c.stroke();
    }
    // train
    R(c, 40, 130, 480, 110, '#12b5a5'); R(c, 40, 130, 480, 14, '#0d8a7d');
    R(c, 40, 240, 480, 8, '#22223a');
    for (const x of [80, 170, 260, 350, 440]) R(c, x, 155, 56, 44, '#ffe9b0');
    C(c, 120, 255, 14, '#22223a'); C(c, 300, 255, 14, '#22223a'); C(c, 470, 255, 14, '#22223a');
    T(c, '3', 520, 185, 26, '#fff');
    // platform + puddles
    R(c, 0, 270, 560, 90, '#2a2a40');
    E(c, 150, 320, 70, 10, '#4a5a8a'); E(c, 400, 330, 80, 10, '#4a5a8a');
    // clock
    C(c, 280, 70, 26, '#fff3d6'); L(c, 280, 70, 280, 52, '#222', 3); L(c, 280, 70, 294, 70, '#222', 3);
    C(c, 280, 70, 3, '#d92b2b');
    // sign
    R(c, 60, 90, 110, 30, '#1d1030'); T(c, 'PLATFORM 3', 115, 105, 12, '#ffd23f');
    // bench + suitcase + umbrella
    R(c, 60, 300, 90, 10, '#8a5a2a'); R(c, 66, 310, 8, 26, '#8a5a2a'); R(c, 136, 310, 8, 26, '#8a5a2a');
    R(c, 180, 310, 34, 26, '#d92b2b'); R(c, 192, 304, 12, 6, '#7a1f2b');
    umbrella(c, 480, 300, '#ff4d6d');
  },
  diffs: [
    { label: 'Train Window', kind: 'removed', x: 287, y: 177, r: 18, apply(c) { R(c, 260, 155, 56, 44, '#12b5a5'); } },
    { label: 'Red Umbrella', kind: 'recoloured', x: 480, y: 300, r: 20, apply(c) { umbrella(c, 480, 300, '#ffd23f'); } },
    { label: 'Extra Puddle', kind: 'added', x: 280, y: 325, r: 16, apply(c) { E(c, 280, 325, 34, 7, '#4a5a8a'); } },
    { label: 'Suitcase', kind: 'moved', x: 197, y: 323, r: 18, apply(c) { R(c, 180, 304, 34, 32, '#2a2a40'); R(c, 330, 310, 34, 26, '#d92b2b'); R(c, 342, 304, 12, 6, '#7a1f2b'); } },
    { label: 'Station Clock', kind: 'resized', x: 280, y: 70, r: 28, apply(c) { C(c, 280, 70, 34, '#fff3d6'); L(c, 280, 70, 280, 46, '#222', 3); L(c, 280, 70, 300, 70, '#222', 3); C(c, 280, 70, 3, '#d92b2b'); } },
    { label: 'Train Wheel', kind: 'removed', x: 300, y: 255, r: 12, apply(c) { C(c, 300, 255, 14, '#0d8a7d'); } },
    { label: 'Rain Drop', kind: 'added', x: 340, y: 90, r: 10, apply(c) { L(c, 340, 90, 334, 108, 'rgba(180,220,255,.6)', 2); } },
    { label: 'Platform Sign', kind: 'flipped', x: 115, y: 105, r: 20, apply(c) { R(c, 60, 90, 110, 30, '#1d1030'); T(c, '3 PLATFORM', 115, 105, 12, '#ffd23f'); } },
  ],
};
function umbrella(c, x, y, color) {
  c.fillStyle = color; c.beginPath(); c.arc(x, y, 26, Math.PI, 0); c.closePath(); c.fill();
  L(c, x, y - 26, x, y + 8, '#8a7a5a', 3);
  C(c, x, y - 28, 3, '#ffd23f');
}

// ---- Scene 6: Moon Garden ---------------------------------------------------
const garden = {
  id: 'garden', name: 'Moon Garden Pond', short: 'Moon Garden', time: '3:00',
  drawBase(c) {
    sky(c, '#0d1f33', '#1d4d3a');
    moon(c, 470, 55, 26);
    stars(c, [[50, 40, 2], [140, 30, 1.5], [260, 45, 2], [360, 35, 1.6], [520, 110, 1.5]]);
    // willow tree, left
    R(c, 55, 150, 16, 160, '#5a3a22');
    c.strokeStyle = '#2ee6a8'; c.lineWidth = 3;
    for (const [x, y, len] of [[40, 150, 60], [60, 140, 80], [80, 150, 66], [30, 170, 50], [95, 165, 55]]) {
      c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + 8, y + len / 2, x - 4, y + len); c.stroke();
    }
    // pond
    E(c, 300, 300, 220, 52, '#1d6a8a'); E(c, 300, 300, 200, 44, '#2a8ab0');
    // moon reflection
    E(c, 470, 300, 18, 30, 'rgba(255,233,138,.55)');
    // lily pads + flowers
    lily(c, 220, 300); lily(c, 320, 315); lily(c, 400, 295);
    flower(c, 180, 290, '#ff6b9d'); flower(c, 350, 330, '#ffd23f'); flower(c, 250, 335, '#b678ff');
    // frog on a pad
    frog(c, 320, 308);
    // stone lantern
    R(c, 500, 250, 24, 60, '#8a8a9a'); R(c, 494, 240, 36, 12, '#6a6a7a'); R(c, 498, 262, 28, 14, '#ffd23f');
    // fireflies
    for (const [x, y] of [[120, 120], [200, 90], [330, 130], [430, 100], [90, 200], [520, 180]]) {
      c.shadowColor = '#ffe98a'; c.shadowBlur = 10; C(c, x, y, 3, '#ffe98a'); c.shadowBlur = 0;
    }
    // grass
    R(c, 0, 330, 560, 30, '#123524');
    for (const x of [30, 90, 150, 470, 530]) { P(c, [[x, 330], [x + 5, 312], [x + 10, 330]], '#2ee6a8'); }
  },
  diffs: [
    { label: 'Pink Flower', kind: 'recoloured', x: 180, y: 290, r: 12, apply(c) { flower(c, 180, 290, '#4db8ff'); } },
    { label: 'Firefly', kind: 'removed', x: 330, y: 130, r: 10, apply(c) { C(c, 330, 130, 6, '#1d4d3a'); } },
    { label: 'Extra Lily Pad', kind: 'added', x: 260, y: 290, r: 14, apply(c) { lily(c, 260, 290); } },
    { label: 'Garden Frog', kind: 'moved', x: 320, y: 308, r: 16, apply(c) { frog(c, 320, 308, '#2a8ab0'); lily(c, 320, 315); frog(c, 220, 292); } },
    { label: 'Golden Moon', kind: 'resized', x: 470, y: 55, r: 30, apply(c) { moon(c, 470, 55, 38); } },
    { label: 'Stone Lantern', kind: 'flipped', x: 512, y: 275, r: 18, apply(c) { R(c, 498, 262, 28, 14, '#8a8a9a'); R(c, 498, 262, 28, 14, 'rgba(255,210,63,0)'); C(c, 512, 269, 6, '#ffd23f'); } },
    { label: 'Moon Reflection', kind: 'removed', x: 470, y: 300, r: 16, apply(c) { E(c, 470, 300, 18, 30, '#2a8ab0'); } },
    { label: 'Willow Strand', kind: 'removed', x: 60, y: 180, r: 12, apply(c) { L(c, 60, 140, 68, 220, '#1d4d3a', 5); } },
  ],
};
function lily(c, x, y) { E(c, x, y, 22, 8, '#2ee6a8'); P(c, [[x, y], [x + 22, y - 6], [x + 20, y + 6]], '#1d6a8a'); }
function flower(c, x, y, color) {
  for (let i = 0; i < 5; i++) {
    const a = i * (Math.PI * 2 / 5) - Math.PI / 2;
    C(c, x + Math.cos(a) * 7, y + Math.sin(a) * 7, 5, color);
  }
  C(c, x, y, 4, '#ffd23f');
}
function frog(c, x, y, erase = null) {
  if (erase) { E(c, x, y, 16, 10, erase); return; }
  E(c, x, y, 14, 9, '#4caf50');
  C(c, x - 6, y - 8, 5, '#4caf50'); C(c, x + 6, y - 8, 5, '#4caf50');
  C(c, x - 6, y - 9, 2, '#101020'); C(c, x + 6, y - 9, 2, '#101020');
}

export const SCENES = [market, reef, alley, noodle, station, garden];

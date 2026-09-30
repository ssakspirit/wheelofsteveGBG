// 혼천의 (wheel_of_steve) 128x256 texture painter: two 128x128 frames (render controller uv_anim blinks between them).
// Input: { orig(x, y) -> [r,g,b,a] of the baseline texture, faces: { s1..s5: 8x8 array of '#rrggbb'|null } }
// Output: 128*256 array of '#rrggbb' or null. Every region keeps the baseline alpha mask, so the five wedge shapes,
// their colors (game identity for spin_1..5) and all UV positions stay exactly where the game expects them.
// Section ↔ game: s1 blue = orb(황희), s2 pink = craft(장영실), s3 orange = elytra(김종서), s4 green = grid(정도전), s5 red = nock(태조)
(function (input) {
  const W = 128, H = 256, F = 128, P = new Array(W * H).fill(null);
  const { orig, faces = {} } = input;
  const hash = (x, y, s = 0) => { let h = (x * 374761393 + y * 668265263 + s * 2246822519) ^ 0x5bd1e995; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
  const lum = c => (0.3 * c[0] + 0.59 * c[1] + 0.11 * c[2]) / 255;
  const ramp = (pal, t) => pal[Math.max(0, Math.min(pal.length - 1, Math.floor(t * pal.length)))];

  const BRONZE = ['#4a3312', '#6b4c1c', '#8f6a2a', '#b58a3a', '#d6ac55', '#f0d489'];
  const GOLD = ['#8a5f14', '#b8871f', '#e0ad33', '#f5cf5c', '#fff0a8'];
  const INDIGO = ['#0d1326', '#161f40', '#1f2c58', '#2b3c72'];
  const GRANITE = ['#6f6c66', '#84817a', '#98958d', '#aeaba3'];
  const LACQUER = ['#7e1b17', '#a52b24', '#c23b30'];
  const WATER = ['#2f5f96', '#3f78b4', '#6b9fd2'];
  const STAR = '#fff3c4', STAR_DIM = '#b9a86e';
  const HUE = {
    s1: ['#173b6b', '#1f5a9a', '#2e78c0', '#5b9ad4'], // 청
    s2: ['#7a2344', '#a8395f', '#cf5b82', '#e58aa6'], // 연지
    s3: ['#8a3a0e', '#b8561a', '#e07b24', '#f2a05a'], // 주황
    s4: ['#1f4f1a', '#2f7428', '#4a9a35', '#78bf5a'], // 녹
    s5: ['#5e1014', '#8a1b20', '#b8292e', '#d9534f'], // 적
  };

  // [class, x, y, w, h, extra]
  const R = [
    ['lights', 0, 0, 12, 12], ['pointer', 80, 0, 13, 8], ['pole', 98, 0, 4, 32],
    ['icon', 112, 0, 16, 16, 's1'], ['icon', 64, 112, 16, 16, 's2'], ['icon', 80, 112, 16, 16, 's3'],
    ['icon', 96, 112, 16, 16, 's4'], ['icon', 112, 112, 16, 16, 's5'],
    ['stone', 16, 0, 32, 16], ['stone', 48, 0, 32, 16], ['stoneSide', 0, 16, 96, 4],
    ['plinthTop', 16, 20, 24, 16], ['stone', 40, 20, 24, 16], ['stoneSide', 0, 36, 80, 4],
    ['ring', 64, 20, 34, 6], ['rim', 54, 40, 56, 9], ['spoke', 0, 58, 12, 19], ['support', 54, 63, 36, 6],
    ['panel', 0, 43, 24, 15, 's1'], ['panel', 26, 43, 24, 15, 's2'], ['panel', 26, 62, 24, 15, 's3'],
    ['panel', 26, 100, 24, 15, 's4'], ['panel', 26, 81, 24, 15, 's5'], ['sky', 0, 81, 24, 15],
  ];

  for (let f = 0; f < 2; f++) {
    const oy = f * F;
    for (const [cls, rx, ry, rw, rh, key] of R) {
      const px = [];
      for (let y = 0; y < rh; y++) for (let x = 0; x < rw; x++) {
        const c = orig(rx + x, ry + y + oy);
        if (c[3] > 0) px.push([x, y, lum(c)]);
      }
      if (!px.length) continue;
      const lo = Math.min(...px.map(p => p[2])), hi = Math.max(...px.map(p => p[2]));
      for (const [x, y, l] of px) {
        const t = hi > lo ? (l - lo) / (hi - lo + 1e-6) : 0.5;
        const ax = rx + x, ay = ry + y, n = hash(ax, ay), star = hash(ax, ay, 7);
        let c;
        switch (cls) {
          case 'lights': c = ramp(GOLD, t); break;                       // 별 구슬, blink kept from baseline frames
          case 'pointer': c = ramp(GOLD.slice(1), t); break;
          case 'pole': c = (y <= 3 || y === 27 || y === 28) ? GOLD[2] : ramp(LACQUER, n); break;
          case 'stone': c = ramp(GRANITE, n); break;
          case 'stoneSide': c = y === 0 ? GRANITE[3] : y === rh - 1 ? GRANITE[0] : ramp(GRANITE.slice(0, 3), n); break;
          case 'plinthTop': {                                            // 십자 물길 (water channel for leveling)
            const inX = y >= 7 && y <= 8, inZ = x >= 11 && x <= 12;
            const edge = !inX && !inZ && (y === 6 || y === 9 || x === 10 || x === 13);
            c = inX || inZ ? ramp(WATER, (n + (f ? 0.3 : 0)) % 1) : edge ? GRANITE[0] : ramp(GRANITE, n);
            break;
          }
          case 'ring':                                                   // polished bronze with degree ticks
            c = y === 0 ? '#e2bb62' : y === rh - 1 ? '#7d5a22' : y === 1 && x % 3 === 0 ? BRONZE[1] : n < 0.1 ? '#b0823a' : '#bd8f40';
            break;
          case 'rim': c = t > 0.7 ? (f && hash(ax, ay, 3) < 0.5 ? GOLD[2] : GOLD[4]) : ramp(INDIGO, t / 0.7); break;
          case 'spoke': c = ramp(BRONZE.slice(0, 4), t); break;
          case 'support': c = y === 0 ? '#e2bb62' : n < 0.1 ? '#b0823a' : '#bd8f40'; break;
          case 'panel': c = star < 0.035 ? (f && hash(ax, ay, 9) < 0.5 ? STAR_DIM : STAR) : ramp(HUE[key], t); break;
          case 'sky': c = star < 0.05 ? (f && hash(ax, ay, 9) < 0.5 ? STAR_DIM : STAR) : ramp(INDIGO, t * 0.6 + n * 0.4); break;
          case 'icon': c = null; break;
        }
        if (cls !== 'icon') P[(ay + oy) * W + ax] = c;
      }
      if (cls === 'icon') {
        // re-skinned host: 8x8 face scaled to 12x12 (rows/cols 0,2,5,7 doubled, symmetric) inside a bronze medallion rim
        const face = faces[key], MAP = [0, 0, 1, 2, 2, 3, 4, 5, 5, 6, 7, 7];
        for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
          let c;
          if (face) {
            const fx = x - 2, fy = y - 2, rim = x >= 1 && x <= 14 && y >= 1 && y <= 14;
            const corner = (x === 1 || x === 14) && (y === 1 || y === 14);
            c = fx >= 0 && fx < 12 && fy >= 0 && fy < 12 ? face[MAP[fy]][MAP[fx]] : rim && !corner ? BRONZE[1] : null;
          } else {
            const o = orig(rx + x, ry + y + oy);
            c = o[3] > 0 ? '#' + o.slice(0, 3).map(v => v.toString(16).padStart(2, '0')).join('') : null;
          }
          P[(ry + y + oy) * W + rx + x] = c;
        }
      }
    }
  }
  return P;
})

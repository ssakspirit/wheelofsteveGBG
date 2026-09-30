// 태조 이성계 (npc_4) 64x64 skin painter. Returns a 64*64 array of '#rrggbb' or null (transparent).
// 어진의 청색 곤룡포 · 금빛 용보(가슴·등·어깨) · 붉은 옥대 · 익선관(ikseon 본) · 검은 수염
(function () {
  const S = 64, P = new Array(S * S).fill(null);
  const set = (x, y, c) => { if (x >= 0 && y >= 0 && x < S && y < S) P[y * S + x] = c; };
  const hash = (x, y) => { let h = (x * 374761393 + y * 668265263) ^ 0x5bd1e995; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
  const tone = (pal, x, y) => { const r = hash(x, y); return r < 0.18 ? pal[0] : r > 0.85 ? pal[2] : pal[1]; };
  const box = (u, v, w, h, d) => ({
    top: [u + d, v, w, d], bottom: [u + d + w, v, w, d],
    right: [u, v + d, d, h], front: [u + d, v + d, w, h],
    left: [u + d + w, v + d, d, h], back: [u + 2 * d + w, v + d, w, h],
  });
  const face = (f, fn) => { const [fx, fy, w, h] = f; for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) set(fx + x, fy + y, fn(x, y, w, h, fx + x, fy + y)); };
  const all = (b, fn) => { for (const k in b) face(b[k], (x, y, w, h, ax, ay) => fn(k, x, y, w, h, ax, ay)); };
  const art = (rows, key, fallback) => (x, y, w, h, ax, ay) => { const c = key[rows[y][x]]; return c === undefined ? fallback(x, y, w, h, ax, ay) : c; };

  const SKIN = ['#c98f68', '#dba27a', '#e8b48c'], SKIN_SH = '#b77b55', MOUTH = '#a8704e';
  const BLACK = ['#111114', '#1a1a20', '#26262e'], HAIR = ['#121010', '#1c1816', '#282220'];
  const BLUE = ['#1d3a7a', '#27509e', '#3464b8'], BLUE_D = '#172f63', NAVY = '#14204a';
  const RED = '#b3262c', RED_D = '#801a1f', WHITE = '#f1eee6';
  const GOLD = '#e0b040', GOLD_D = '#a87a1c', JADE = '#e6dcaa';
  const BOOT = ['#141414', '#1c1c1c', '#262626'], SOLE = '#d9d2c2', EYE = '#1e1612', EYE_W = '#f4f4f4';
  const robe = (x, y, w, h, ax, ay) => tone(BLUE, ax, ay);

  // ---- head 8x8x8 @ (0,0) y22..30
  const head = box(0, 0, 8, 8, 8);
  face(head.top, (x, y, w, h, ax, ay) => tone(BLACK, ax, ay));
  face(head.bottom, (x, y, w, h, ax, ay) => (x >= 2 && x <= 5 && y <= 2) ? HAIR[1] : tone(SKIN, ax, ay));
  face(head.back, (x, y, w, h, ax, ay) => y <= 3 ? tone(BLACK, ax, ay) : tone(HAIR, ax, ay));
  const side = frontAtRight => (x, y, w, h, ax, ay) => {
    const f = frontAtRight ? 7 - x : x;
    if (y <= 1) return tone(BLACK, ax, ay);
    if (f >= 5) return tone(HAIR, ax, ay);
    if (f === 4 && y <= 3) return tone(HAIR, ax, ay);
    if (f === 3 && (y === 4 || y === 5)) return SKIN_SH;               // ear
    if (f <= 2 && y >= 6) return HAIR[1];                               // beard along the jaw
    return tone(SKIN, ax, ay);
  };
  face(head.right, side(true));
  face(head.left, side(false));
  face(head.front, art([
    'KKKKKKKK',
    'KKKKKKKK',
    'ssssssss',
    'sBBssBBs',
    'sWEssEWs',
    'sssnnsss',
    'sKKmmKKs',
    'KsKKKKsK',
  ], { K: HAIR[1], B: HAIR[0], W: EYE_W, E: EYE, n: SKIN_SH, m: MOUTH }, (x, y, w, h, ax, ay) => tone(SKIN, ax, ay)));

  // ---- hat overlay 8x8x8 @ (32,31): 익선관 lower crown (front band, taller at the back)
  const hat = box(32, 31, 8, 8, 8);
  face(hat.top, (x, y, w, h, ax, ay) => tone(BLACK, ax, ay));
  face(hat.bottom, () => null);
  face(hat.front, (x, y, w, h, ax, ay) => y <= 1 ? (y === 1 ? BLACK[2] : BLACK[1]) : null);
  face(hat.right, (x, y, w, h, ax, ay) => y <= 1 || (y <= 3 && x <= 3) ? tone(BLACK, ax, ay) : null);
  face(hat.left, (x, y, w, h, ax, ay) => y <= 1 || (y <= 3 && x >= 4) ? tone(BLACK, ax, ay) : null);
  face(hat.back, (x, y, w, h, ax, ay) => y <= 3 ? tone(BLACK, ax, ay) : null);

  // ---- old hood cube 10x4x4 @ (14,47): hidden
  all(box(14, 47, 10, 4, 4), () => null);

  // ---- 익선관: raised back tier 8x2x4 @ (16,55) and the two upright wings 2x4x1 @ (40,55)
  all(box(16, 55, 8, 2, 4), (k, x, y, w, h, ax, ay) => k === 'front' && y === 1 ? BLACK[2] : tone(BLACK, ax, ay));
  all(box(40, 55, 2, 3, 1), (k, x, y, w, h, ax, ay) => (k === 'front' || k === 'back') && (x === 0 || y === 0) ? BLACK[2] : BLACK[0]);

  // ---- base body 8x11x4 @ (16,16) y11..22 (only the top row shows above the robe overlay: collar)
  const body = box(16, 16, 8, 11, 4);
  face(body.front, (x, y, w, h, ax, ay) => y === 0 ? (x === 3 || x === 4 ? WHITE : x === 2 || x === 5 ? RED : BLUE_D) : robe(x, y, w, h, ax, ay));
  face(body.back, (x, y, w, h, ax, ay) => y === 0 ? BLUE_D : robe(x, y, w, h, ax, ay));
  face(body.right, (x, y, w, h, ax, ay) => y === 0 ? BLUE_D : robe(x, y, w, h, ax, ay));
  face(body.left, (x, y, w, h, ax, ay) => y === 0 ? BLUE_D : robe(x, y, w, h, ax, ay));
  face(body.top, (x, y, w, h, ax, ay) => (x >= 3 && x <= 4 && y >= 1 && y <= 2) ? SKIN[1] : x >= 2 && x <= 5 && y >= 1 && y <= 2 ? RED : BLUE_D);
  face(body.bottom, () => BLUE_D);

  // ---- robe overlay 8x10x4 @ (32,0) y11..21: 곤룡포 with 용보 and 옥대
  const DRAGON = [ // gold roundel with an S-coiled dragon
    '.oGGo.',
    'oYDDYo',
    'GYYDYG',
    'oYDDYo',
    '.oGGo.',
  ];
  const badge = (x, y, fb) => { const c = { G: GOLD, o: GOLD_D, Y: '#f2cf5a', D: '#8a5f14' }[DRAGON[y][x]]; return c || fb; };
  const belt = (x, w) => (w === 8 && (x === 1 || x === 3 || x === 4 || x === 6)) ? JADE : RED;
  const coat = box(32, 0, 8, 10, 4);
  face(coat.front, (x, y, w, h, ax, ay) => {
    if (y === 0) return (x === 3 || x === 4) ? RED : BLUE_D;               // round collar
    if (y >= 1 && y <= 5 && x >= 1 && x <= 6) return badge(x - 1, y - 1, robe(x, y, w, h, ax, ay));
    if (y === 6) return belt(x, w);
    if (x === 3 || x === 4) return y === 9 ? BLUE_D : tone(BLUE, ax, ay);
    return y === 9 ? BLUE_D : robe(x, y, w, h, ax, ay);
  });
  face(coat.back, (x, y, w, h, ax, ay) => {
    if (y >= 1 && y <= 5 && x >= 1 && x <= 6) return badge(x - 1, y - 1, robe(x, y, w, h, ax, ay));
    if (y === 6) return RED;
    return y === 9 ? BLUE_D : robe(x, y, w, h, ax, ay);
  });
  face(coat.right, (x, y, w, h, ax, ay) => y === 6 ? RED : y === 9 ? BLUE_D : robe(x, y, w, h, ax, ay));
  face(coat.left, (x, y, w, h, ax, ay) => y === 6 ? RED : y === 9 ? BLUE_D : robe(x, y, w, h, ax, ay));
  face(coat.top, (x, y, w, h, ax, ay) => (x >= 2 && x <= 5 && y >= 1 && y <= 2) ? null : BLUE_D);
  face(coat.bottom, () => null);

  // ---- arms: base 3x11x4 @ (40,16) = hands at the bottom row, sleeves @ (0,46) with shoulder 용보 and red lining cuff
  all(box(40, 16, 3, 11, 4), (k, x, y, w, h, ax, ay) => k === 'bottom' ? SKIN[0] : k === 'top' ? BLUE_D : y >= 10 ? tone(SKIN, ax, ay) : robe(x, y, w, h, ax, ay));
  all(box(0, 46, 3, 11, 4), (k, x, y, w, h, ax, ay) => {
    if (k === 'bottom') return null;
    if (k === 'top') return GOLD_D;
    if (y >= 10) return null;
    if (y === 9) return RED;
    if ((k === 'right' || k === 'left') && y <= 2 && x >= 1 && x <= 2) return y === 1 ? '#f2cf5a' : GOLD;  // shoulder 용보
    if (y === 8) return BLUE_D;
    return robe(x, y, w, h, ax, ay);
  });

  // ---- legs 4x11x4: base = 목화 below the hem, pants overlay @ (0,31) = robe skirt
  const leg = (u, v) => all(box(u, v, 4, 11, 4), (k, x, y, w, h, ax, ay) => {
    if (k === 'top') return BLUE_D;
    if (k === 'bottom') return SOLE;
    if (y >= 8) return y === 10 ? BOOT[2] : tone(BOOT, ax, ay);
    return robe(x, y, w, h, ax, ay);
  });
  leg(0, 16);
  leg(16, 31);
  all(box(0, 31, 4, 11, 4), (k, x, y, w, h, ax, ay) => {
    if (k === 'top' || k === 'bottom' || y >= 8) return null;
    if (y === 7) return BLUE_D;
    return robe(x, y, w, h, ax, ay);
  });

  return P;
})()

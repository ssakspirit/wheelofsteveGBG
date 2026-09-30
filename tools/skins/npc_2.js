// 장영실 (npc_2) 64x64 skin painter. Returns a 64*64 array of '#rrggbb' or null (transparent).
// 흑립(갓) · 옥색 도포 · 세조대와 두루주머니 · 짧은 검은 수염
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
  const art = (rows, key) => (x, y) => key[rows[y][x]];

  const SKIN = ['#b57c55', '#c98f66', '#d8a077'], SKIN_SH = '#a56d48';
  const BLACK = ['#121216', '#1b1b21', '#282830'], HAIR = ['#141110', '#1f1a17', '#2b2420'], BAND = '#30303a';
  const ROBE = ['#86b8ac', '#9fcbbf', '#b6dbd1'], ROBE_D = '#6a9c90', ROBE_DD = '#4f7d72';
  const WHITE = '#f3f1ea', PANTS = ['#dcd8cc', '#e8e5db', '#f2f0e8'];
  const CORD = '#b3262c', CORD_D = '#7e1a1f', POUCH = '#d98a2b', POUCH_D = '#a8661c';
  const SHOE = ['#231b16', '#2d231c', '#3a2e25'], SOLE = '#e4dccb', EYE = '#1e1612', EYE_W = '#f4f4f4';

  // ---- head 8x8x8 @ (0,0) y26..34: 갓 crown rows 0-2, 망건 row 3, face rows 4-7
  const head = box(0, 0, 8, 8, 8);
  face(head.top, (x, y, w, h, ax, ay) => tone(BLACK, ax, ay));
  face(head.bottom, (x, y, w, h, ax, ay) => tone(SKIN, ax, ay));
  face(head.back, (x, y, w, h, ax, ay) => y <= 2 ? tone(BLACK, ax, ay) : y === 3 ? BAND : tone(HAIR, ax, ay));
  const side = frontAtRight => (x, y, w, h, ax, ay) => {
    const f = frontAtRight ? 7 - x : x; // distance from the face edge
    if (y <= 2) return tone(BLACK, ax, ay);
    if (y === 3) return BAND;
    if (f === 2 && y >= 4) return BLACK[2];                 // 갓끈 (hat string)
    if (f >= 4) return tone(HAIR, ax, ay);
    if (f === 3 && (y === 5 || y === 6)) return SKIN_SH;     // ear
    if (f <= 1 && y === 7) return HAIR[1];                   // jaw beard
    return tone(SKIN, ax, ay);
  };
  face(head.right, side(true));
  face(head.left, side(false));
  face(head.front, art([
    'KKKKKKKK',
    'KKKKKKKK',
    'KKKKKKKK',
    'BBBBBBBB',
    'shhsshhs',
    'swessews',
    'sssnnsss',
    'smmssmms',
  ], { K: BLACK[1], B: BAND, s: SKIN[1], h: HAIR[1], w: EYE_W, e: EYE, n: SKIN_SH, m: HAIR[2] }));

  // ---- chin plane 6x2x0 @ (25,0) y24..26: short goatee
  face([25, 0, 6, 2], (x, y) => (x === 2 || x === 3) ? HAIR[1] : null);
  face([31, 0, 6, 2], (x, y) => (x === 2 || x === 3) ? HAIR[0] : null);

  // ---- hat overlay 8x10x4 @ (33,0) y24..34: lower 갓 crown around the head top
  const hat = box(33, 0, 8, 10, 4);
  face(hat.top, (x, y, w, h, ax, ay) => tone(BLACK, ax, ay));
  face(hat.bottom, () => null);
  face(hat.front, (x, y, w, h, ax, ay) => y <= 2 ? tone(BLACK, ax, ay) : null);
  face(hat.right, (x, y, w, h, ax, ay) => y <= 2 ? tone(BLACK, ax, ay) : null);
  face(hat.left, (x, y, w, h, ax, ay) => y <= 2 ? tone(BLACK, ax, ay) : null);
  face(hat.back, () => null);

  // ---- 갓 brim (양태) at y30..31: helmet 12x1x8 @ (0,51) = left/right parts,
  //      gat bone 12x1x2 (front/back) and crown 6x2x6 all share the all-black block @ (36,56)
  all(box(0, 51, 12, 1, 8), (k, x, y, w, h, ax, ay) => k === 'bottom' ? BLACK[0] : tone(BLACK, ax, ay));
  face([36, 56, 28, 8], (x, y, w, h, ax, ay) => tone(BLACK, ax, ay));

  // ---- chest 10x8x6 @ (32,15) y18..26: 도포 with crossed collar (깃 + 동정)
  const chest = box(32, 15, 10, 8, 6);
  face(chest.front, (x, y, w, h, ax, ay) => ({
    K: ROBE_DD, W: WHITE, s: SKIN[1],
  })[[
    'RRWKssKWRR',
    'RRRWKKWRRR',
    'RRRWKKRRRR',
    'RRWKKRRRRR',
    'RWKKRRRRRR',
    'WKKRRRRRRR',
    'RRRRRRRRRR',
    'RRRRRRRRRR',
  ][y][x]] || tone(ROBE, ax, ay));
  face(chest.back, (x, y, w, h, ax, ay) => (x === 4 || x === 5) && y >= 5 ? ROBE_D : tone(ROBE, ax, ay));
  face(chest.right, (x, y, w, h, ax, ay) => tone(ROBE, ax, ay));
  face(chest.left, (x, y, w, h, ax, ay) => tone(ROBE, ax, ay));
  face(chest.top, (x, y, w, h, ax, ay) => (x >= 3 && x <= 6 && y >= 2 && y <= 3) ? WHITE : tone(ROBE, ax, ay));
  face(chest.bottom, () => ROBE_D);

  // ---- waist 8x5x4 @ (32,29) y13..18: 세조대 (red cord) + tassel + 두루주머니
  const waist = box(32, 29, 8, 5, 4);
  face(waist.front, (x, y, w, h, ax, ay) => {
    if (y === 0) return x === 5 ? CORD_D : CORD;
    if (x === 5) return y === 4 ? CORD_D : CORD;               // tassel
    if (x >= 1 && x <= 2 && y >= 1 && y <= 3) return y === 1 ? POUCH_D : POUCH;
    return tone(ROBE, ax, ay);
  });
  for (const k of ['back', 'right', 'left']) face(waist[k], (x, y, w, h, ax, ay) => y === 0 ? CORD : tone(ROBE, ax, ay));
  face(waist.top, (x, y, w, h, ax, ay) => tone(ROBE, ax, ay));
  face(waist.bottom, () => ROBE_D);

  // ---- arms: base 4x13x4 @ (32,38) = hands, sleeves @ (48,38) = 도포 sleeves to the wrist
  all(box(32, 38, 4, 13, 4), (k, x, y, w, h, ax, ay) => {
    if (k === 'top') return tone(ROBE, ax, ay);
    if (k === 'bottom') return SKIN[0];
    return y >= 11 ? tone(SKIN, ax, ay) : tone(ROBE, ax, ay);
  });
  all(box(48, 38, 4, 13, 4), (k, x, y, w, h, ax, ay) => {
    if (k === 'bottom') return null;
    if (k === 'top') return tone(ROBE, ax, ay);
    if (y >= 11) return null;
    if (y === 10) return WHITE;                                  // cuff lining
    return tone(ROBE, ax, ay);
  });

  // ---- legs: base = 바지 + 태사혜, pants overlay = 도포 skirt to the shin
  const leg = (u, v) => all(box(u, v, 4, 13, 4), (k, x, y, w, h, ax, ay) => {
    if (k === 'top') return tone(PANTS, ax, ay);
    if (k === 'bottom') return SOLE;
    if (y >= 11) return y === 12 && (k === 'front' || k === 'right' || k === 'left') && x % 3 === 0 ? SOLE : tone(SHOE, ax, ay);
    return tone(PANTS, ax, ay);
  });
  leg(16, 16);
  leg(0, 16);
  const skirt = (u, v, tassel) => all(box(u, v, 4, 13, 4), (k, x, y, w, h, ax, ay) => {
    if (k === 'top' || k === 'bottom' || y >= 10) return null;
    if (y === 9) return ROBE_D;
    if (tassel && k === 'front' && x === tassel.x && y <= 3) return y === 3 ? CORD_D : CORD;
    if (k === 'back' && ((u === 0 && x === 0) || (u === 16 && x === 3))) return ROBE_D; // 뒷자락 seam
    return tone(ROBE, ax, ay);
  });
  skirt(16, 33, null);
  skirt(0, 33, { x: 1 });

  return P;
})()

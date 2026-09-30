// 김종서 (npc_3) 64x64 skin painter. Returns a 64*64 array of '#rrggbb' or null (transparent).
// 검푸른 두정갑(금빛 두정) · 붉은 선 · 요대 · 투구(tugu 본: 삭모·정자·차양)와 드림 · 검은 수염
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

  const SKIN = ['#b98158', '#c9926a', '#d7a17a'], SKIN_SH = '#a66f4a', MOUTH = '#8e5a3e';
  const HAIR = ['#100e0d', '#191513', '#241e1b'], EYE = '#1a1210', EYE_W = '#f0f0f0';
  const ARMOR = ['#1a2238', '#222c48', '#2c3858'], ARMOR_D = '#131a2c';
  const STUD = '#d9ab3e', STUD_D = '#9c7420', TRIM = '#a82a2a', TRIM_D = '#7c1d1f';
  const STEEL = ['#23262c', '#2e323a', '#3b4049'], GOLD = '#d4a338', GOLD_L = '#f0cc62';
  const PLUME = ['#9e1d23', '#c0262c', '#d8403a'];
  const BELT = '#4a2618', BOOT = ['#141414', '#1c1c1c', '#262626'], SOLE = '#d9d2c2', PANTS = ['#3a2a24', '#45322b', '#523c33'];
  // 두정갑 fabric: dark navy with gold studs on a staggered grid
  const armor = (x, y, w, h, ax, ay) => (y % 2 === 1 && (x + (y % 4 === 1 ? 0 : 1)) % 2 === 0) ? (hash(ax, ay) < 0.2 ? STUD_D : STUD) : tone(ARMOR, ax, ay);

  // ---- head 8x8x8 @ (0,0) y23..31
  const head = box(0, 0, 8, 8, 8);
  face(head.top, (x, y, w, h, ax, ay) => tone(HAIR, ax, ay));
  face(head.bottom, (x, y, w, h, ax, ay) => tone(HAIR, ax, ay));
  face(head.back, (x, y, w, h, ax, ay) => tone(HAIR, ax, ay));
  const side = frontAtRight => (x, y, w, h, ax, ay) => {
    const f = frontAtRight ? 7 - x : x;
    if (y <= 2 || f >= 4) return tone(HAIR, ax, ay);
    if (f <= 2 && y >= 5) return tone(HAIR, ax, ay);                  // full beard along the jaw
    if (f === 3 && (y === 4 || y === 5)) return SKIN_SH;
    return tone(SKIN, ax, ay);
  };
  face(head.right, side(true));
  face(head.left, side(false));
  face(head.front, art([
    'KKKKKKKK',
    'KKKKKKKK',
    'KKKKKKKK',
    'BBBssBBB',
    'sWEssEWs',
    'KssnnssK',
    'KKKmmKKK',
    'KKKKKKKK',
  ], { K: HAIR[1], B: HAIR[0], W: EYE_W, E: EYE, n: SKIN_SH, m: MOUTH }, (x, y, w, h, ax, ay) => tone(SKIN, ax, ay)));

  // ---- hat overlay 8x8x8 @ (32,0): 투구 bowl with gold ribs, gold brow band, 드림 flaps over the ears and neck
  const hat = box(32, 0, 8, 8, 8);
  face(hat.top, (x, y, w, h, ax, ay) => (x === 3 || x === 4 || y === 3 || y === 4) ? GOLD : tone(STEEL, ax, ay));
  face(hat.bottom, () => null);
  face(hat.front, (x, y, w, h, ax, ay) => y <= 1 ? tone(STEEL, ax, ay) : y === 2 ? GOLD : null);
  const drim = (x, y, w, h, ax, ay) => y === 7 ? TRIM : armor(x, y, w, h, ax, ay);
  const hatSide = frontAtRight => (x, y, w, h, ax, ay) => {
    const f = frontAtRight ? 7 - x : x;
    if (y <= 1) return tone(STEEL, ax, ay);
    if (y === 2) return GOLD;
    return f >= 2 ? drim(x, y, w, h, ax, ay) : null;
  };
  face(hat.right, hatSide(true));
  face(hat.left, hatSide(false));
  face(hat.back, (x, y, w, h, ax, ay) => y <= 1 ? tone(STEEL, ax, ay) : y === 2 ? GOLD : drim(x, y, w, h, ax, ay));

  // ---- the old hair mass cube was removed from the model; its UV space now holds the tugu cubes:
  // 차양 (visor) 9x1x2 @ (23,35), 삭모 (red plume) 3x3x3 @ (18,40), 정자 (gold finial) 1x2x1 @ (30,40)
  all(box(23, 35, 9, 1, 2), (k, x, y, w, h, ax, ay) => k === 'front' ? GOLD : k === 'top' ? STEEL[2] : STEEL[0]);
  all(box(18, 40, 3, 3, 3), (k, x, y, w, h, ax, ay) => k === 'top' ? PLUME[2] : y === 2 ? PLUME[0] : tone(PLUME, ax, ay));
  all(box(30, 40, 1, 2, 1), (k, x, y) => k === 'top' || y === 0 ? GOLD_L : GOLD);

  // ---- torso 10x11x6 @ (16,16) y12..23: 두정갑 with a red placket and collar, 요대 with a gold buckle
  const torso = box(16, 16, 10, 11, 6);
  face(torso.front, (x, y, w, h, ax, ay) => {
    if (y === 0) return x >= 3 && x <= 6 ? tone(HAIR, ax, ay) : x === 2 || x === 7 ? TRIM : armor(x, y, w, h, ax, ay); // beard over the collar
    if (y === 7) return x === 4 || x === 5 ? GOLD : BELT;
    if (x === 4 || x === 5) return y === 10 ? TRIM_D : TRIM;                // front opening
    if (y === 10) return TRIM;
    return armor(x, y, w, h, ax, ay);
  });
  const plain = (x, y, w, h, ax, ay) => y === 7 ? BELT : y === 10 ? TRIM : y === 0 ? TRIM_D : armor(x, y, w, h, ax, ay);
  face(torso.back, plain);
  face(torso.right, plain);
  face(torso.left, plain);
  face(torso.top, (x, y, w, h, ax, ay) => (x >= 3 && x <= 6 && y >= 2 && y <= 3) ? TRIM : tone(ARMOR, ax, ay));
  face(torso.bottom, () => ARMOR_D);

  // ---- bodyArmor 5x4x2 @ (47,33): the old waist pouch, hidden
  all(box(47, 33, 5, 4, 2), () => null);

  // ---- arms: base 3x11x4 @ (48,18) = hands, sleeves @ (0,48) = armoured sleeves with a red cuff
  all(box(48, 18, 3, 11, 4), (k, x, y, w, h, ax, ay) => k === 'bottom' ? SKIN[0] : k === 'top' ? ARMOR[1] : y >= 10 ? tone(SKIN, ax, ay) : armor(x, y, w, h, ax, ay));
  all(box(0, 48, 3, 11, 4), (k, x, y, w, h, ax, ay) => {
    if (k === 'bottom') return null;
    if (k === 'top') return STUD;                                           // 견갑 edge
    if (y >= 10) return null;
    if (y === 9) return TRIM;
    if (y === 0) return STUD_D;
    return armor(x, y, w, h, ax, ay);
  });

  // ---- legs 4x12x4 @ (0,16): trousers and 목화; pants @ (0,32) = armour skirt to the knee
  all(box(0, 16, 4, 12, 4), (k, x, y, w, h, ax, ay) => {
    if (k === 'top') return ARMOR[1];
    if (k === 'bottom') return SOLE;
    if (y >= 8) return y === 11 ? BOOT[2] : tone(BOOT, ax, ay);
    return tone(PANTS, ax, ay);
  });
  all(box(0, 32, 4, 12, 4), (k, x, y, w, h, ax, ay) => {
    if (k === 'top' || k === 'bottom' || y >= 7) return null;
    if (y === 6) return TRIM;
    return armor(x, y, w, h, ax, ay);
  });

  return P;
})()

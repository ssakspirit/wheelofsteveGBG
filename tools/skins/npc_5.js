// 정도전 (npc_5) 64x64 skin painter. Returns a 64*64 array of '#rrggbb' or null (transparent).
// 선비의 복건(검은 두건, 뒤로 드리운 천) · 흰 심의에 검은 선(깃·소맷부리·밑단) · 대대와 오색사 · 가는 수염
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

  const SKIN = ['#d09a74', '#e0ad86', '#ecbf98'], SKIN_SH = '#c08561';
  const CLOTH = ['#141418', '#1d1d23', '#2b2b34'], FOLD = '#3a3a46';     // 복건 black silk
  const WHITE = ['#dedad0', '#ebe8e0', '#f6f4ee'], WHITE_D = '#cfcabd', TRIM = '#1b1b20';
  const HAIR = '#1a1614', EYE = '#1e1612', EYE_W = '#f4f4f4';
  const CORD = ['#2d4f8f', '#b3262c', '#d4a338', '#3f8a4a', '#f4f4f4'];   // 오색사
  const SHOE = ['#161616', '#1f1f1f', '#2a2a2a'], SOLE = '#d9d2c2';
  const robe = (x, y, w, h, ax, ay) => tone(WHITE, ax, ay);

  // ---- head 8x8x8 @ (0,0) y23..31: face; 복건 covers the top, back and the ears
  const head = box(0, 0, 8, 8, 8);
  face(head.top, (x, y, w, h, ax, ay) => tone(CLOTH, ax, ay));
  face(head.bottom, (x, y, w, h, ax, ay) => tone(SKIN, ax, ay));
  face(head.back, (x, y, w, h, ax, ay) => tone(CLOTH, ax, ay));
  const side = frontAtRight => (x, y, w, h, ax, ay) => {
    const f = frontAtRight ? 7 - x : x;
    if (y <= 3 || f >= 3) return tone(CLOTH, ax, ay);
    if (f <= 1 && y === 7) return HAIR;                                   // thin beard line
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
    'sHHssHHs',
    'sssHHsss',
  ], { K: CLOTH[1], B: HAIR, W: EYE_W, E: EYE, n: SKIN_SH, H: HAIR }, (x, y, w, h, ax, ay) => tone(SKIN, ax, ay)));

  // ---- hair-tip cube 10x1x2 @ (24,0) y22..23 behind the neck: hem of the 복건 drape
  all(box(24, 0, 10, 1, 2), (k, x, y, w, h, ax, ay) => tone(CLOTH, ax, ay));

  // ---- hat overlay 8x10x8 @ (14,42) y21..31: the cap with a pleated front band; the drape falls past the head at the back
  const hat = box(14, 42, 8, 10, 8);
  face(hat.top, (x, y, w, h, ax, ay) => (x === 3 || x === 4) ? FOLD : tone(CLOTH, ax, ay));   // centre seam
  face(hat.bottom, () => null);
  face(hat.front, (x, y, w, h, ax, ay) => y <= 1 ? tone(CLOTH, ax, ay) : y === 2 ? ((x === 2 || x === 5) ? FOLD : CLOTH[0]) : null);
  const hatSide = frontAtRight => (x, y, w, h, ax, ay) => {
    const f = frontAtRight ? 7 - x : x;
    if (y <= 3) return tone(CLOTH, ax, ay);
    if (f >= 3) return f === 3 ? CLOTH[0] : tone(CLOTH, ax, ay);
    return null;
  };
  face(hat.right, hatSide(true));
  face(hat.left, hatSide(false));
  face(hat.back, (x, y, w, h, ax, ay) => (x === 3 || x === 4) && y >= 6 ? FOLD : tone(CLOTH, ax, ay));

  // ---- helmet 10x5x6 @ (16,31) y23..28, z -1..5: the drape flaring out at the lower back
  const drape = box(16, 31, 10, 5, 6);
  face(drape.top, (x, y) => x === 0 || x === 9 || y === 0 ? CLOTH[1] : null);
  face(drape.bottom, (x, y) => x === 0 || x === 9 || y === 0 ? CLOTH[0] : null);
  face(drape.front, (x, y) => x === 0 || x === 9 ? CLOTH[0] : null);
  face(drape.back, (x, y, w, h, ax, ay) => y === 4 ? CLOTH[0] : tone(CLOTH, ax, ay));
  face(drape.right, (x, y, w, h, ax, ay) => y === 4 ? CLOTH[0] : tone(CLOTH, ax, ay));
  face(drape.left, (x, y, w, h, ax, ay) => y === 4 ? CLOTH[0] : tone(CLOTH, ax, ay));

  // ---- torso 8x11x4 @ (16,16) y12..23: 심의 with black crossed collar, 대대 and 오색사
  const torso = box(16, 16, 8, 11, 4);
  face(torso.front, (x, y, w, h, ax, ay) => {
    const key = { K: TRIM, s: SKIN[1] }[[
      'WKssssKW',
      'WWKssKKW',
      'WWWKKKWW',
      'WWKKKWWW',
      'WKKWWWWW',
      'KKWWWWWW',
    ][y]?.[x]];
    if (key) return key;
    if (y === 7) return x === 0 || x === 7 ? WHITE_D : WHITE[2];             // 대대 (broad white sash)
    if (y === 6 || y === 8) return WHITE_D;
    if (x === 4 && y >= 8) return CORD[(y - 8) % 3];                        // 오색사 hanging at the front
    if (x === 3 && y === 8) return CORD[3];
    return robe(x, y, w, h, ax, ay);
  });
  face(torso.back, (x, y, w, h, ax, ay) => y === 7 ? WHITE[2] : y === 6 || y === 8 ? WHITE_D : (x === 3 || x === 4) && y >= 9 ? WHITE_D : robe(x, y, w, h, ax, ay));
  face(torso.right, (x, y, w, h, ax, ay) => y === 7 ? WHITE[2] : y === 6 || y === 8 ? WHITE_D : robe(x, y, w, h, ax, ay));
  face(torso.left, (x, y, w, h, ax, ay) => y === 7 ? WHITE[2] : y === 6 || y === 8 ? WHITE_D : robe(x, y, w, h, ax, ay));
  face(torso.top, (x, y, w, h, ax, ay) => (x >= 2 && x <= 5 && y >= 1 && y <= 2) ? TRIM : robe(x, y, w, h, ax, ay));
  face(torso.bottom, () => WHITE_D);

  // ---- arms: base 3x11x4 @ (36,5) hands at the bottom row, sleeves @ (0,47) with a black cuff (선)
  all(box(36, 5, 3, 11, 4), (k, x, y, w, h, ax, ay) => k === 'bottom' ? SKIN[0] : k === 'top' ? WHITE[1] : y >= 10 ? tone(SKIN, ax, ay) : robe(x, y, w, h, ax, ay));
  all(box(0, 47, 3, 11, 4), (k, x, y, w, h, ax, ay) => {
    if (k === 'bottom') return null;
    if (k === 'top') return WHITE[1];
    if (y >= 10) return null;
    if (y >= 8) return TRIM;
    return robe(x, y, w, h, ax, ay);
  });

  // ---- legs: base 4x12x4 (right @ (48,16), left @ (0,16)) = 흑혜 at the bottom; pants 4x11x4 = 심의 skirt with a black hem
  const leg = (u, v) => all(box(u, v, 4, 12, 4), (k, x, y, w, h, ax, ay) => {
    if (k === 'top') return WHITE[1];
    if (k === 'bottom') return SOLE;
    if (y >= 10) return y === 11 ? SHOE[2] : tone(SHOE, ax, ay);
    return robe(x, y, w, h, ax, ay);
  });
  leg(48, 16);
  leg(0, 16);
  const skirt = (u, v) => all(box(u, v, 4, 11, 4), (k, x, y, w, h, ax, ay) => {
    if (k === 'top' || k === 'bottom' || y >= 9) return null;
    if (y >= 7) return TRIM;
    return robe(x, y, w, h, ax, ay);
  });
  skirt(48, 33);
  skirt(0, 32);

  return P;
})()

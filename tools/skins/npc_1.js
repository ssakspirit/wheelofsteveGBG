// 영의정 황희 (npc_1) 64x64 skin painter. Returns a 64*64 array of '#rrggbb' or null (transparent).
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

  const SKIN = ['#c99270', '#e0ae88', '#ecc19e'], SKIN_SH = '#b98262';
  const WHITE = ['#c9c9c9', '#e6e6e6', '#f7f7f7'], HAIR = ['#8f8f8f', '#a8a8a8', '#bdbdbd'];
  const BLACK = ['#141418', '#1d1d23', '#2a2a33'], BAND = '#34343f';
  const RED = ['#8e1b22', '#b2262c', '#c73732'], RED_D = '#6e1419', RED_DD = '#3a0b0e';
  const GOLD = '#d4a338', NAVY = '#1f2d66', NAVY_L = '#2c3f86', CRANE = '#f2f2f2', CRANE_R = '#d8262c';
  const BELT = '#2b1d15', PLAQUE = '#e6d8b5', BOOT = ['#141414', '#1c1c1c', '#262626'], SOLE = '#cfc7b5';
  const EYE = '#2e2018', EYE_W = '#f4f4f4', INNER = '#f0ede4', INNER_B = '#2d4f8f';

  // ---- head 8x8x8 @ (0,0) : face, 사모 lower part, white hair & beard
  const head = box(0, 0, 8, 8, 8);
  face(head.top, (x, y, w, h, ax, ay) => tone(BLACK, ax, ay));
  face(head.bottom, (x, y, w, h, ax, ay) => tone(WHITE, ax, ay));
  face(head.back, (x, y, w, h, ax, ay) => y <= 4 ? tone(BLACK, ax, ay) : tone(HAIR, ax, ay));
  const side = front => (x, y, w, h, ax, ay) => {
    const f = front ? x : 7 - x; // f: distance from the face edge (0 = next to the face)
    if (y <= 2) return tone(BLACK, ax, ay);
    if (y === 3 && f >= 3) return tone(HAIR, ax, ay);
    if (y >= 5 && f <= 2) return tone(WHITE, ax, ay);
    if (y === 7 && f <= 4) return tone(WHITE, ax, ay);
    if (f >= 5) return tone(HAIR, ax, ay);
    if (f === 3 && (y === 4 || y === 5)) return SKIN_SH;
    return tone(SKIN, ax, ay);
  };
  face(head.right, side(false));
  face(head.left, side(true));
  face(head.front, (x, y, w, h, ax, ay) => {
    if (y <= 1) return tone(BLACK, ax, ay);
    if (y === 2) return BAND;
    if (y === 3) return (x === 1 || x === 2 || x === 5 || x === 6) ? WHITE[1] : tone(SKIN, ax, ay);
    if (y === 4) return x === 2 || x === 5 ? EYE : x === 1 || x === 6 ? EYE_W : tone(SKIN, ax, ay);
    if (y === 5) return x === 0 || x === 7 ? WHITE[1] : (x === 3 || x === 4) ? SKIN_SH : tone(SKIN, ax, ay);
    if (y === 6) return x === 3 || x === 4 ? WHITE[0] : WHITE[2];
    return x === 3 || x === 4 ? WHITE[0] : tone(WHITE, ax, ay);
  });

  // ---- long beard 8x3x2 @ (25,0), below the chin
  const beard = box(25, 0, 8, 3, 2);
  face(beard.front, (x, y, w, h, ax, ay) => (y === 0 || (y === 1 && x >= 1 && x <= 6) || (y === 2 && x >= 2 && x <= 5)) ? tone(WHITE, ax, ay) : null);
  face(beard.bottom, (x, y, w, h, ax, ay) => x >= 2 && x <= 5 ? WHITE[0] : null);
  face(beard.top, (x, y, w, h, ax, ay) => tone(WHITE, ax, ay));
  face(beard.right, (x, y, w, h, ax, ay) => y === 0 ? tone(WHITE, ax, ay) : null);
  face(beard.left, (x, y, w, h, ax, ay) => y === 0 ? tone(WHITE, ax, ay) : null);
  face(beard.back, (x, y, w, h, ax, ay) => WHITE[0]);

  // ---- hat overlay 8x10x6 @ (19,36): 사모 crown front band
  const hat = box(19, 36, 8, 10, 6);
  face(hat.top, (x, y, w, h, ax, ay) => tone(BLACK, ax, ay));
  face(hat.front, (x, y, w, h, ax, ay) => y <= 1 ? tone(BLACK, ax, ay) : y === 2 ? BAND : null);
  face(hat.right, (x, y, w, h, ax, ay) => y <= 2 ? tone(BLACK, ax, ay) : null);
  face(hat.left, (x, y, w, h, ax, ay) => y <= 2 ? tone(BLACK, ax, ay) : null);

  // ---- rear 12x6x6 @ (16,52): 사모 wings (2px out on each side, back crossbar)
  const wing = box(16, 52, 12, 6, 6);
  const wingC = y => y === 0 ? BLACK[2] : BLACK[0];
  face(wing.front, (x, y) => (x <= 1 || x >= 10) && y <= 1 ? wingC(y) : null);
  face(wing.back, (x, y) => (x <= 1 || x >= 10) && y <= 1 ? wingC(y) : null);
  face(wing.right, (x, y) => y <= 1 ? wingC(y) : null);
  face(wing.left, (x, y) => y <= 1 ? wingC(y) : null);
  face(wing.top, (x, y) => x <= 1 || x >= 10 ? BLACK[2] : null);
  face(wing.bottom, () => null); // cube bottom sits at shoulder height, below the painted wing band

  // ---- torso 10x12x6 @ (16,16): 홍단령 + 쌍학 흉배 + 서대
  const torso = box(16, 16, 10, 12, 6);
  const CRANE_ART = [ // 8x5 흉배: gold frame, a crane with spread wings on navy
    'GGGGGGGG',
    'GW.RR.WG',
    'G.WWWW.G',
    'G~.WW.~G',
    'GGGGGGGG',
  ];
  const badge = (x, y) => ({ G: GOLD, W: CRANE, R: CRANE_R, '.': NAVY, '~': NAVY_L })[CRANE_ART[y][x]];
  const robe = (x, y, w, ax, ay, withBadge) => {
    if (y === 8) return (w === 10 && (x === 1 || x === 3 || x === 6 || x === 8)) ? PLAQUE : BELT;
    if (withBadge && y >= 3 && y <= 7 && x >= 1 && x <= 8) return badge(x - 1, y - 3);
    if (y === 11) return RED_D;
    return tone(RED, ax, ay);
  };
  face(torso.front, (x, y, w, h, ax, ay) => {
    if (y === 0 && x >= 3 && x <= 6) return INNER;
    if (y === 0 && (x === 2 || x === 7)) return RED_D;
    if (y === 1 && x >= 4 && x <= 5) return INNER_B;
    if (y === 1 && (x === 3 || x === 6)) return RED_D;
    if (y === 2 && x >= 4 && x <= 5) return RED_D;
    return robe(x, y, w, ax, ay, true);
  });
  face(torso.back, (x, y, w, h, ax, ay) => robe(x, y, w, ax, ay, true));
  face(torso.right, (x, y, w, h, ax, ay) => y === 8 ? BELT : x === 3 && y > 8 ? RED_D : tone(RED, ax, ay));
  face(torso.left, (x, y, w, h, ax, ay) => y === 8 ? BELT : x === 2 && y > 8 ? RED_D : tone(RED, ax, ay));
  face(torso.top, (x, y, w, h, ax, ay) => (x >= 3 && x <= 6 && y >= 2 && y <= 3) ? INNER : tone(RED, ax, ay));
  face(torso.bottom, (x, y, w, h, ax, ay) => RED_D);

  // ---- arms: base 4x12x4 @ (48,18) mostly hidden (shares pixels with torso back), sleeves @ (0,48) opaque
  const arm = box(48, 18, 4, 12, 4);
  face(arm.top, (x, y, w, h, ax, ay) => tone(RED, ax, ay));
  face(arm.bottom, () => RED_DD);
  for (const k of ['right', 'front', 'left', 'back']) face(arm[k], (x, y, w, h, ax, ay) => P[ay * S + ax] || tone(RED, ax, ay));
  face(arm.left, (x, y, w, h, ax, ay) => tone(RED, ax, ay));
  face(arm.back, (x, y, w, h, ax, ay) => tone(RED, ax, ay));
  const sleeve = box(0, 48, 4, 12, 4);
  all(sleeve, (k, x, y, w, h, ax, ay) => {
    if (k === 'top') return tone(RED, ax, ay);
    if (k === 'bottom') return (x === 0 || x === 3 || y === 0 || y === 3) ? RED_D : RED_DD;
    if (y >= 10) return y === 10 ? RED_D : RED[0];
    return tone(RED, ax, ay);
  });

  // ---- legs: base = 목화(boots) below the robe hem, pants overlay = robe skirt
  const leg = (u, v) => all(box(u, v, 4, 12, 4), (k, x, y, w, h, ax, ay) => {
    if (k === 'top') return tone(RED, ax, ay);
    if (k === 'bottom') return SOLE;
    if (y >= 9) return y === 11 ? BOOT[2] : tone(BOOT, ax, ay);
    return tone(RED, ax, ay);
  });
  leg(0, 16);
  leg(48, 34);
  all(box(0, 32, 4, 12, 4), (k, x, y, w, h, ax, ay) => {
    if (k === 'top' || k === 'bottom') return null;
    if (y >= 9) return null;
    if (y === 8) return RED_D;
    if (k === 'front' && (x === 0 || x === 3)) return RED[0];
    return tone(RED, ax, ay);
  });

  return P;
})()

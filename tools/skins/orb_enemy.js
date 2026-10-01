// 옥새 쟁탈전 추격 몹(rwm:orb_enemy) 64x64 skin painter. Returns a 64*64 array of '#rrggbb' or null (transparent).
// 복면 도적: 검은 두건과 복면 · 짙은 저고리와 새끼줄 허리띠 · 등에 멘 보따리 · 흰 행전과 짚신
// UV는 geometry.rwm.orb_enemy(tools/skins/orb.js)의 박스 UV와 같다.
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
  const art = (rows, key) => (x, y) => key[rows[y][x]];

  const SKIN = ['#b57c55', '#c98f66', '#d8a077'], SKIN_SH = '#a56d48', EYE = '#1e1612', EYE_W = '#f4f4f4';
  const CLOTH = ['#16161b', '#202027', '#2c2c35'], CLOTH_L = '#3a3a46';      // 두건
  const MASK = ['#22252d', '#2a2e37', '#353a45'], MASK_L = '#454b58';        // 복면
  const JACKET = ['#373f4e', '#414a5a', '#4d5769'], JACKET_D = '#2b313d';    // 저고리
  const COLLAR = '#d8d2c2', GOREUM = '#1f232b';
  const ROPE = ['#9c7535', '#b08742', '#c49a52'];                             // 새끼줄 허리띠
  const PANTS = ['#564d42', '#62584b', '#6e6456'], PANTS_D = '#473f35';
  const WRAP = ['#cdc6b3', '#dad4c4', '#e7e2d5'], WRAP_L = '#aea691';        // 행전 · 토시
  const STRAW = ['#b28a3b', '#c49c4b', '#d4b05f'], STRAW_D = '#8f6d2c';     // 짚신
  const BUNDLE = ['#5e3f2a', '#6d4a31', '#7c563a'], BUNDLE_L = '#c9b48f';   // 보따리

  // ---- head 8x8x8 @ (0,0): 두건 rows 0-2, 눈 rows 3-4, 복면 rows 5-7
  const head = box(0, 0, 8, 8, 8);
  face(head.top, (x, y, w, h, ax, ay) => tone(CLOTH, ax, ay));
  face(head.bottom, (x, y, w, h, ax, ay) => y <= 3 ? tone(MASK, ax, ay) : tone(SKIN, ax, ay));
  face(head.back, (x, y, w, h, ax, ay) => tone(CLOTH, ax, ay));
  const side = frontAtRight => (x, y, w, h, ax, ay) => {
    const f = frontAtRight ? 7 - x : x; // 얼굴 쪽 가장자리에서 떨어진 거리
    if (y <= 2 || f >= 4) return tone(CLOTH, ax, ay);
    if (y >= 5) return tone(MASK, ax, ay);
    if (f === 3) return SKIN_SH;                                         // 귀
    return tone(SKIN, ax, ay);
  };
  face(head.right, side(true));
  face(head.left, side(false));
  face(head.front, art([
    'KKKKKKKK',
    'KKKKKKKK',
    'kkkkkkkk',
    'sbbssbbs',
    'swessews',
    'mmmmmmmm',
    'MMMMMMMM',
    'MMMMMMMM',
  ], { K: CLOTH[1], k: CLOTH_L, s: SKIN[1], b: '#2a1d16', w: EYE_W, e: EYE, m: MASK_L, M: MASK[1] }));

  // ---- head overlay 8x8x8 @ (32,0) inflate .5: 두건 겉감과 복면이 얼굴 앞으로 조금 떠 있다
  const hat = box(32, 0, 8, 8, 8);
  face(hat.top, (x, y, w, h, ax, ay) => tone(CLOTH, ax, ay));
  face(hat.bottom, () => null);
  face(hat.back, (x, y, w, h, ax, ay) => {
    if ((y === 2 || y === 3) && (x === 3 || x === 4)) return CLOTH_L;    // 매듭
    return y <= 5 ? tone(CLOTH, ax, ay) : null;
  });
  const hatSide = frontAtRight => (x, y, w, h, ax, ay) => {
    const f = frontAtRight ? 7 - x : x;
    if (y <= 1) return tone(CLOTH, ax, ay);
    if (y === 2) return f >= 2 ? tone(CLOTH, ax, ay) : CLOTH_L;
    if (y >= 5 && f <= 3) return y === 5 ? MASK_L : tone(MASK, ax, ay);  // 복면이 볼을 감싼다
    return f >= 5 && y <= 5 ? tone(CLOTH, ax, ay) : null;
  };
  face(hat.right, hatSide(true));
  face(hat.left, hatSide(false));
  face(hat.front, (x, y, w, h, ax, ay) => {
    if (y <= 1) return tone(CLOTH, ax, ay);
    if (y === 2) return CLOTH_L;
    if (y === 5) return MASK_L;
    if (y >= 6) return (x === 3 && y === 7) ? MASK[0] : tone(MASK, ax, ay); // 복면 주름
    return null;
  });

  // ---- 두건 꼬리 2x5x1 @ (56,16): 뒤통수 매듭에서 목덜미로 늘어진 천 (머리와 구분되게 조금 밝게)
  const tail = box(56, 16, 2, 5, 1);
  for (const k in tail) face(tail[k], (x, y, w, h, ax, ay) => y === h - 1 ? CLOTH[0] : (k === 'front' || k === 'back') && x === 1 ? CLOTH_L : '#34343f');

  // ---- body 8x12x4 @ (16,16): 저고리 rows 0-7, 허리띠 row 8, 바지 rows 9-11
  const body = box(16, 16, 8, 12, 4);
  face(body.top, (x, y, w, h, ax, ay) => (x >= 2 && x <= 5 && y >= 1 && y <= 2) ? SKIN[1] : tone(JACKET, ax, ay));
  face(body.bottom, (x, y, w, h, ax, ay) => tone(PANTS, ax, ay));
  face(body.front, art([
    'JJWssWJJ',
    'JJJWsWJJ',
    'JJJJWWJJ',
    'JJJJgWJJ',
    'JJJJgJWJ',
    'JJJJJJJW',
    'JJJJJJJd',
    'JJJJJJJJ',
    'RRRRRRRR',
    'PPPPPrPP',
    'PPPPPrPP',
    'PPPdPPPP',
  ], { J: JACKET[1], W: COLLAR, s: SKIN[1], g: GOREUM, d: JACKET_D, R: ROPE[1], r: ROPE[0], P: PANTS[1] }));
  const bodyTone = (x, y, w, h, ax, ay) => y <= 7 ? tone(JACKET, ax, ay) : y === 8 ? tone(ROPE, ax, ay) : tone(PANTS, ax, ay);
  face(body.right, bodyTone);
  face(body.left, bodyTone);
  face(body.back, (x, y, w, h, ax, ay) => {
    if (y <= 7 && (x === y - 1 || 7 - x === y - 1)) return BUNDLE[0];    // 보따리 끈이 등에서 엇갈린다
    return bodyTone(x, y, w, h, ax, ay);
  });

  // ---- 보따리 6x5x2 @ (16,32): 등에 멘 천 꾸러미 (위에 매듭)
  const bundle = box(16, 32, 6, 5, 2);
  for (const k in bundle) face(bundle[k], (x, y, w, h, ax, ay) => {
    if (k === 'top') return (x === 2 || x === 3) ? BUNDLE_L : tone(BUNDLE, ax, ay);
    if ((k === 'back' || k === 'front') && y === 0 && (x === 2 || x === 3)) return BUNDLE_L;
    return hash(ax * 3, ay * 7) > 0.9 ? BUNDLE_L : tone(BUNDLE, ax, ay);  // 보자기 점무늬
  });

  // ---- arms 4x12x4: 소매 rows 0-8, 토시 row 9, 손 rows 10-11
  const arm = (u, v) => {
    const a = box(u, v, 4, 12, 4);
    face(a.top, (x, y, w, h, ax, ay) => tone(JACKET, ax, ay));
    face(a.bottom, (x, y, w, h, ax, ay) => tone(SKIN, ax, ay));
    for (const k of ['right', 'front', 'left', 'back']) face(a[k], (x, y, w, h, ax, ay) =>
      y <= 8 ? (y === 8 ? JACKET_D : tone(JACKET, ax, ay)) : y === 9 ? tone(WRAP, ax, ay) : y === 11 && x === 0 ? SKIN_SH : tone(SKIN, ax, ay));
  };
  arm(40, 16);
  arm(32, 48);

  // ---- legs 4x12x4: 바지 rows 0-4, 행전 rows 5-9, 짚신 rows 10-11
  const leg = (u, v) => {
    const l = box(u, v, 4, 12, 4);
    face(l.top, (x, y, w, h, ax, ay) => tone(PANTS, ax, ay));
    face(l.bottom, (x, y, w, h, ax, ay) => tone(STRAW, ax, ay));
    for (const k of ['right', 'front', 'left', 'back']) face(l[k], (x, y, w, h, ax, ay) => {
      if (y <= 4) return y === 4 ? PANTS_D : tone(PANTS, ax, ay);
      if (y <= 9) return (y === 6 || y === 8) ? WRAP_L : tone(WRAP, ax, ay);
      if (y === 10) return k === 'front' && (x === 1 || x === 2) ? SKIN[0] : STRAW_D;  // 짚신 끈 사이로 발등
      return (x + y) % 2 ? STRAW[1] : STRAW[2];                                           // 엮은 짚
    });
  };
  leg(0, 16);
  leg(16, 48);

  return P;
})();

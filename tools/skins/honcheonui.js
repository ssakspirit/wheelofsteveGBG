// 혼천의 (armillary sphere) — a new wheel model, independent of the Steve wheel's shape.
// One file holds the UV layout, the geometry builder and the texture painter so they can never drift apart.
//   node tools/skins/honcheonui.js            → writes resource_packs/rp0/models/entity/honcheonui.geo.json
//   Blockbench: tools/skins/run-honcheonui.bb.js evaluates this file and calls paint()
// Game contract (same as wheel_of_steve): the spinning bone is named "wheel", the pointer is at the top, and the
// section bones s1..s5 sit at z-rotations 0, 72, 144, -72, -144, so spin_1..5 stop on the same games as before.
// Section ↔ game: s1 orb(황희, 청) · s2 craft(장영실, 연지) · s3 elytra(김종서, 주황) · s4 grid(정도전, 녹) · s5 nock(태조, 적)
(function () {
  const CY = 40;                       // disc centre height
  const SECTIONS = [['s1', 0], ['s2', 72], ['s3', 144], ['s4', -72], ['s5', -144]];

  // UV layout on a 128x128 frame (the texture is 128x256: two frames for the uv_anim blink)
  const L = {
    W: { s1: [0, 0], s2: [26, 0], s3: [52, 0], s4: [78, 0], s5: [0, 22] }, // 26x22 wedges
    SKY: [26, 22],                                                           // 26x22 wedge back
    ICON: { s1: [104, 0], s2: [52, 22], s3: [68, 22], s4: [84, 22], s5: [100, 22] }, // 16x16
    RING: [0, 44, 10, 3], RING_END: [10, 44, 3, 3],
    ECL: [13, 44, 10, 2], ECL_END: [23, 44, 2, 2],
    HOR_SIDE: [25, 44, 10, 2], HOR_TOP: [35, 44, 10, 3], HOR_END: [45, 44, 3, 2],
    RIM: [48, 44, 8, 3], RIM_END: [56, 44, 3, 3],
    BEAD_A: [59, 44, 3, 3], BEAD_B: [59, 47, 3, 3],
    GOLD: [62, 44, 4, 4], GLOBE: [66, 44, 6, 6], DIV: [72, 44, 1, 22], AXLE: [74, 44, 3, 3],
    PILLAR: [80, 44, 4, 32], PILLAR_TOP: [84, 44, 4, 4], CAP_SIDE: [88, 44, 6, 3], CAP_TOP: [88, 47, 6, 6],
    BACK: [94, 44, 4, 31], BACK_TOP: [98, 44, 4, 4],
    STONE_TOP_X: [0, 66, 24, 10], STONE_SIDE: [0, 76, 24, 4], STONE_END: [24, 76, 10, 4],
    STONE_TOP_Z: [34, 66, 10, 19], PED_TOP: [44, 66, 14, 14], PED_SIDE: [58, 66, 14, 4],
  };

  // ---------------- geometry ----------------
  const r2 = v => Math.round(v * 1000) / 1000;
  const f = (r, w, h) => ({ uv: [r[0], r[1]], uv_size: [w ?? r[2], h ?? r[3]] });
  const box = (origin, size, faces, extra = {}) => ({ origin: origin.map(r2), size: size.map(r2), ...extra, uv: faces });
  const allFaces = (side, top, end) => ({ north: side, south: side, up: top, down: top, east: end, west: end });

  function ring(R, N, [T, D], faceUV, endUV, rotAxis, lenOverlap = 0.6) {
    const len = 2 * R * Math.tan(Math.PI / N) + lenOverlap;
    const cubes = [];
    for (let i = 0; i < N; i++) {
      const a = i * 360 / N;
      if (rotAxis === 'z') {           // vertical ring facing the viewer
        cubes.push(box([-len / 2, CY + R - T / 2, -D / 2], [len, T, D],
          allFaces(f(faceUV, faceUV[2], faceUV[3]), f(faceUV, faceUV[2], faceUV[3]), f(endUV)),
          { pivot: [0, CY, 0], rotation: [0, 0, r2(a)] }));
      } else {                         // horizontal ring (T = height, D = radial width)
        cubes.push(box([-len / 2, CY - T / 2, -R - D / 2], [len, T, D],
          { north: f(L.HOR_SIDE), south: f(L.HOR_SIDE), up: f(L.HOR_TOP), down: f(L.HOR_TOP), east: f(L.HOR_END), west: f(L.HOR_END) },
          { pivot: [0, CY, 0], rotation: [0, r2(a), 0] }));
      }
    }
    return cubes;
  }

  function geometry() {
    const bones = [];
    const bone = (name, parent, cubes, extra = {}) => bones.push({ name, ...(parent ? { parent } : {}), pivot: [0, CY, 0], ...extra, cubes });

    bone('honcheonui', null, [], { pivot: [0, 0, 0] });

    // 십자 받침: X arm in three pieces, Z arm in two (no overlapping top faces), and a pedestal
    const armX = { north: f(L.STONE_SIDE), south: f(L.STONE_SIDE), up: f(L.STONE_TOP_X), down: f(L.STONE_TOP_X), east: f(L.STONE_END), west: f(L.STONE_END) };
    const armZ = { north: f(L.STONE_END), south: f(L.STONE_END), up: f(L.STONE_TOP_Z), down: f(L.STONE_TOP_Z), east: f(L.STONE_SIDE, 19, 4), west: f(L.STONE_SIDE, 19, 4) };
    bone('base', 'honcheonui', [
      box([-36, 0, -5], [24, 4, 10], armX), box([-12, 0, -5], [24, 4, 10], armX), box([12, 0, -5], [24, 4, 10], armX),
      box([-5, 0, -24], [10, 4, 19], armZ), box([-5, 0, 5], [10, 4, 19], armZ),
      box([-7, 4, -7], [14, 4, 14], { north: f(L.PED_SIDE), south: f(L.PED_SIDE), east: f(L.PED_SIDE), west: f(L.PED_SIDE), up: f(L.PED_TOP), down: f(L.PED_TOP) }),
    ], { pivot: [0, 0, 0] });

    // 용주 (dragon pillars) holding the horizon ring, and the red centre pillar + axle behind the disc
    const pillar = { north: f(L.PILLAR), south: f(L.PILLAR), east: f(L.PILLAR), west: f(L.PILLAR), up: f(L.PILLAR_TOP), down: f(L.PILLAR_TOP) };
    const cap = allFaces(f(L.CAP_SIDE), f(L.CAP_TOP), f(L.CAP_SIDE));
    const back = { north: f(L.BACK), south: f(L.BACK), east: f(L.BACK), west: f(L.BACK), up: f(L.BACK_TOP), down: f(L.BACK_TOP) };
    const axle = allFaces(f(L.AXLE), f(L.AXLE), f(L.AXLE));
    bone('stand', 'honcheonui', [
      box([-33, 4, -2], [4, 32, 4], pillar), box([29, 4, -2], [4, 32, 4], pillar),
      box([-34, 36, -3], [6, 3, 6], cap), box([28, 36, -3], [6, 3, 6], cap),
      box([-2, 8, 4], [4, 31, 4], back), box([-1.5, CY - 1.5, 1.5], [3, 3, 6], axle),
    ], { pivot: [0, 0, 0] });

    // fixed rings: 자오환 (meridian, faces the viewer), 황도환 (tilted), 지평환 (horizon)
    bone('meridian', 'honcheonui', ring(31, 20, [3, 3], L.RING, L.RING_END, 'z'));
    bone('ecliptic', 'honcheonui', ring(31, 20, [2, 2], L.ECL, L.ECL_END, 'z'), { rotation: [0, 30, 0] });
    bone('horizon', 'honcheonui', ring(31, 20, [2, 3], null, null, 'y'));

    // 별 구슬 (blinking stars) on the meridian ring, alternating A/B so they chase between frames
    const beads = [];
    for (let k = 0; k < 10; k++) {
      const uv = k % 2 ? L.BEAD_B : L.BEAD_A, fc = f(uv);
      beads.push(box([-1.5, CY + 31 - 1.5, -4.5], [3, 3, 3], allFaces(fc, fc, fc), { pivot: [0, CY, 0], rotation: [0, 0, 18 + 36 * k] }));
    }
    bone('stars', 'honcheonui', beads);

    // pointer at the top (points down at the winning section) and the 지구의 at the centre
    const gold = allFaces(f(L.GOLD), f(L.GOLD), f(L.GOLD));
    bone('pointer', 'honcheonui', [
      box([-1, 66, -4], [2, 4, 2], gold),
      box([-2, 63.5, -4.5], [4, 4, 2], gold, { pivot: [0, 65.5, -3.5], rotation: [0, 0, 45] }),
    ]);
    const globe = allFaces(f(L.GLOBE), f(L.GLOBE), f(L.GLOBE));
    bone('globe', 'honcheonui', [box([-3, CY - 3, -8], [6, 6, 6], globe)]);

    // spinning disc: 28수 rim + five sections (wedge plane, host medallion, bronze divider)
    bone('wheel', 'honcheonui', ring(23.5, 20, [3, 3], L.RIM, L.RIM_END, 'z', 0.4));
    for (const [s, rot] of SECTIONS) {
      const div = f(L.DIV);
      bone(s, 'wheel', [
        box([-13, CY, -1], [26, 22, 0], { north: f([...L.W[s], 26, 22]) }),
        box([-13, CY, 1.4], [26, 22, 0], { south: f([...L.SKY, 26, 22]) }), // back side on its own plane (no coplanar faces)
        box([-4, CY + 10, -1.5], [8, 8, 0], { north: f([...L.ICON[s], 16, 16]) }),
        box([-0.6, CY, -1.75], [1.2, 22, 1.5], { north: div, south: div, east: div, west: div, up: f(L.DIV, 1, 1), down: f(L.DIV, 1, 1) },
          { pivot: [0, CY, 0], rotation: [0, 0, 36] }),
      ], { rotation: [0, 0, rot] });
    }

    return {
      format_version: '1.16.0',
      'minecraft:geometry': [{
        description: { identifier: 'geometry.honcheonui', texture_width: 128, texture_height: 128, visible_bounds_width: 5, visible_bounds_height: 6, visible_bounds_offset: [0, 2.5, 0] },
        bones,
      }],
    };
  }

  // ---------------- texture ----------------
  // input: { faces: { s1..s5: 8x8 '#rrggbb' } } → 128*256 array of '#rrggbb' | null
  function paint({ faces = {} } = {}) {
    const W = 128, P = new Array(W * 256).fill(null);
    const hash = (x, y, s = 0) => { let h = (x * 374761393 + y * 668265263 + s * 2246822519) ^ 0x5bd1e995; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
    const BRONZE = ['#4a3312', '#6b4c1c', '#8f6a2a', '#b58a3a', '#d6ac55', '#f0d489'];
    const GOLD = ['#8a5f14', '#b8871f', '#e0ad33', '#f5cf5c', '#fff0a8'];
    const INDIGO = ['#0d1326', '#161f40', '#1f2c58', '#2b3c72'];
    const GRANITE = ['#6f6c66', '#84817a', '#98958d', '#aeaba3'];
    const LACQUER = ['#7e1b17', '#a52b24', '#c23b30'];
    const WATER = ['#2f5f96', '#3f78b4', '#6b9fd2'];
    const HUE = {
      s1: ['#173b6b', '#1f5a9a', '#2e78c0', '#5b9ad4'], s2: ['#7a2344', '#a8395f', '#cf5b82', '#e58aa6'],
      s3: ['#8a3a0e', '#b8561a', '#e07b24', '#f2a05a'], s4: ['#1f4f1a', '#2f7428', '#4a9a35', '#78bf5a'],
      s5: ['#5e1014', '#8a1b20', '#b8292e', '#d9534f'],
    };
    const pick = (pal, n) => pal[Math.min(pal.length - 1, Math.floor(n * pal.length))];

    for (let fr = 0; fr < 2; fr++) {
      const oy = fr * 128;
      const set = (x, y, c) => { P[(y + oy) * W + x] = c; };
      const fill = ([rx, ry, rw, rh], fn) => { for (let y = 0; y < rh; y++) for (let x = 0; x < rw; x++) set(rx + x, ry + y, fn(x, y, rw, rh, hash(rx + x, ry + y))); };
      const twinkle = (x, y) => fr && hash(x, y, 9) < 0.5 ? '#b9a86e' : '#fff3c4';

      // wedges: 72° slice, apex at the bottom centre of the region (the disc centre), radius 22
      const inWedge = (x, y) => { const px = x + 0.5 - 13, py = 22 - (y + 0.5), r = Math.hypot(px, py); return r <= 22 && Math.abs(Math.atan2(px, py)) <= Math.PI / 5 + 0.02 ? r : -1; };
      for (const [s] of SECTIONS) fill([...L.W[s], 26, 22], (x, y, w, h, n) => {
        const r = inWedge(x, y);
        if (r < 0) return null;
        if (r > 20.8) return BRONZE[4];                                       // gilt arc edge
        if (hash(L.W[s][0] + x, L.W[s][1] + y, 7) < 0.03 && r > 5) return twinkle(L.W[s][0] + x, L.W[s][1] + y);
        const band = r < 6 ? 0 : r < 12 ? 1 : r < 17.5 ? 2 : 3;              // darker toward the centre
        return HUE[s][Math.max(0, Math.min(3, band + (n < 0.07 ? -1 : n > 0.95 ? 1 : 0)))];
      });
      fill([...L.SKY, 26, 22], (x, y, w, h, n) => {
        const r = inWedge(x, y);
        if (r < 0) return null;
        return hash(L.SKY[0] + x, L.SKY[1] + y, 7) < 0.06 ? twinkle(L.SKY[0] + x, L.SKY[1] + y) : pick(INDIGO, n * 0.7 + r / 22 * 0.3);
      });

      // host medallions: 8x8 face scaled to 12x12 inside a bronze rim (empty rim if no face given)
      const MAP = [0, 0, 1, 2, 2, 3, 4, 5, 5, 6, 7, 7];
      for (const [s] of SECTIONS) fill([...L.ICON[s], 16, 16], (x, y) => {
        const fx = x - 2, fy = y - 2, rim = x >= 1 && x <= 14 && y >= 1 && y <= 14, corner = (x === 1 || x === 14) && (y === 1 || y === 14);
        if (fx >= 0 && fx < 12 && fy >= 0 && fy < 12) return faces[s] ? faces[s][MAP[fy]][MAP[fx]] : INDIGO[2];
        return rim && !corner ? BRONZE[1] : null;
      });

      // rings
      fill(L.RING, (x, y, w, h, n) => y === 0 ? '#e2bb62' : y === 2 ? '#7d5a22' : x % 2 === 0 ? BRONZE[1] : '#bd8f40');
      fill(L.RING_END, () => BRONZE[2]);
      fill(L.ECL, (x, y) => y === 0 ? '#d9b04e' : x % 3 === 0 ? BRONZE[1] : '#a87c33');
      fill(L.ECL_END, () => BRONZE[2]);
      fill(L.HOR_SIDE, (x, y) => y === 0 ? '#e2bb62' : x % 2 ? BRONZE[2] : BRONZE[3]);
      fill(L.HOR_TOP, (x, y) => y === 1 && x % 5 === 0 ? BRONZE[0] : y === 1 ? BRONZE[4] : BRONZE[3]); // 방위 marks
      fill(L.HOR_END, () => BRONZE[2]);
      fill(L.RIM, (x, y) => y === 0 ? GOLD[2] : y === 2 ? BRONZE[2] : x === 4 ? GOLD[3] : INDIGO[1]);        // 28수 marks
      fill(L.RIM_END, () => INDIGO[1]);

      // stars (A bright on frame 0, B bright on frame 1)
      const bead = bright => (x, y) => x === 1 && y === 1 ? (bright ? '#fffbe0' : GOLD[2]) : bright ? GOLD[3] : GOLD[0];
      fill(L.BEAD_A, bead(fr === 0));
      fill(L.BEAD_B, bead(fr === 1));

      fill(L.GOLD, (x, y) => x === 0 || y === 0 ? GOLD[4] : x === 3 || y === 3 ? GOLD[1] : GOLD[3]);
      const EARTH = ['~~GG~~', '~GGG~~', '~~G~~~', '~~~~GG', '~G~~GG', '~~~~~~'];
      fill(L.GLOBE, (x, y) => EARTH[y][x] === 'G' ? '#4a9a35' : (x + y) % 5 === 0 ? '#3f78b4' : '#2f6fb0');
      fill(L.DIV, (x, y) => y === 21 ? BRONZE[2] : BRONZE[4 - (y % 2)]);
      fill(L.AXLE, () => BRONZE[2]);

      // 용주: red lacquer with a green-and-gold dragon coiling up
      fill(L.PILLAR, (x, y, w, h, n) => { const d = (x + y) % 8; return d === 0 ? '#d9b44a' : d <= 2 ? (n < 0.3 ? '#256a3c' : '#2f7a4a') : pick(LACQUER, n); });
      fill(L.PILLAR_TOP, () => GOLD[2]);
      fill(L.CAP_SIDE, (x, y) => y === 0 ? GOLD[3] : y === 2 ? GOLD[1] : GOLD[2]);
      fill(L.CAP_TOP, (x, y) => x === 0 || y === 0 || x === 5 || y === 5 ? GOLD[2] : GOLD[3]);
      fill(L.BACK, (x, y, w, h, n) => y <= 1 || y === 28 || y === 29 ? GOLD[2] : pick(LACQUER, n));
      fill(L.BACK_TOP, () => GOLD[2]);

      // 받침: granite with a cross-shaped water channel (rows 4-5 along X, cols 4-5 along Z)
      const water = n => pick(WATER, (n + fr * 0.4) % 1);
      fill(L.STONE_TOP_X, (x, y, w, h, n) => y === 4 || y === 5 ? water(n) : y === 3 || y === 6 ? GRANITE[0] : pick(GRANITE, n));
      fill(L.STONE_TOP_Z, (x, y, w, h, n) => x === 4 || x === 5 ? water(n) : x === 3 || x === 6 ? GRANITE[0] : pick(GRANITE, n));
      fill(L.STONE_SIDE, (x, y, w, h, n) => y === 0 ? GRANITE[3] : y === 3 ? GRANITE[0] : pick(GRANITE.slice(0, 3), n));
      fill(L.STONE_END, (x, y, w, h, n) => y === 0 ? GRANITE[3] : y === 3 ? GRANITE[0] : pick(GRANITE.slice(0, 3), n));
      fill(L.PED_TOP, (x, y, w, h, n) => { const r = Math.hypot(x - 6.5, y - 6.5); return Math.abs(r - 5) < 0.7 ? GRANITE[0] : r < 2 ? BRONZE[2] : pick(GRANITE.slice(1), n); });
      fill(L.PED_SIDE, (x, y, w, h, n) => y === 0 ? GRANITE[3] : y === 3 ? GRANITE[0] : pick(GRANITE.slice(1, 3), n));
    }
    return P;
  }

  const H = { L, SECTIONS, geometry, paint };
  if (typeof module !== 'undefined' && typeof require === 'function' && require.main === module) {
    const fs = require('fs'), path = require('path');
    const out = path.join(__dirname, '../../resource_packs/rp0/models/entity/honcheonui.geo.json');
    fs.writeFileSync(out, JSON.stringify(geometry(), null, '\t') + '\n');
    console.log('wrote', path.relative(process.cwd(), out));
  }
  return H;
})()

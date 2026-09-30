// 교태전 꽃담 맞추기: 다섯 색 블록을 꽃담의 '꽃전돌'로.
//   node tools/skins/grid.js [--preview 출력.png]
// 1) 바닐라 콘크리트 5색 텍스처(textures/blocks/concrete_*.png)를 덮어쓴다 — 월드 전체의 같은 색 콘크리트가 바뀐다.
//    놓은 블록·손에 든 블록·벽의 목표 무늬(grid_pattern 구조물)가 모두 꽃전돌로 보인다. 색은 원래 콘크리트와 거의 같게 두어
//    패턴 맞추기에 필요한 색 구분은 그대로이고, 색마다 무늬 모양도 달라 색을 구분하기 어려운 사람도 모양으로 맞출 수 있다.
// 2) 정원에서 도는 블록(rwm:grid_block, 게임 전용 엔티티)의 모델과 텍스처 6장(5색 + 가져간 뒤 '비어 있음').
//    엔티티 텍스처는 새 경로(textures/rwm/entity/grid/)를 쓴다. 모든 색이 한 모델을 쓰므로 텍스처 6장은 같은 배치다.
const fs = require("fs"), path = require("path");
const PNG = require("./png");
const { icon, mix, lighten, darken, hash } = require("./modelkit");

const RP = path.join(__dirname, "../../resource_packs/rp0");

// 색 이름 · 바닐라 콘크리트 평균색 · 무늬
const COLORS = [
  { id: "lime", base: "#5ea818", motif: "bamboo", name: "대나무" },
  { id: "blue", base: "#2c2e8f", motif: "hex", name: "거북등" },
  { id: "yellow", base: "#f0af15", motif: "chrysanthemum", name: "국화" },
  { id: "red", base: "#8e2020", motif: "peony", name: "모란" },
  { id: "magenta", base: "#a9309f", motif: "plum", name: "매화" },
];

// 무늬: 16×16 캔버스에 (채움색 f, 가운데색 c)로 그린다
const MOTIFS = {
  plum(i, f, c) { for (let k = 0; k < 5; k++) { const a = (-90 + 72 * k) * Math.PI / 180; i.ellipse(8 + Math.cos(a) * 3.6, 8 + Math.sin(a) * 3.6, 2.5, 2.5, f); } i.ellipse(8, 8, 1.6, 1.6, c); },
  chrysanthemum(i, f, c) { for (let k = 0; k < 16; k++) { const a = k * 22.5 * Math.PI / 180; i.line(8, 8, Math.round(8 + Math.cos(a) * 5.6), Math.round(8 + Math.sin(a) * 5.6), f); } i.ellipse(8, 8, 2.2, 2.2, c); },
  peony(i, f, c) { i.ellipse(8, 8, 5.8, 5.8, f); for (let k = 0; k < 8; k++) { const a = k * 45 * Math.PI / 180; i.ellipse(8 + Math.cos(a) * 5, 8 + Math.sin(a) * 5, 1.8, 1.8, f); } i.ellipse(8, 8, 3.4, 3.4, mix(f, c, 0.35)); i.ellipse(8, 8, 1.5, 1.5, c); },
  bamboo(i, f, c) { i.rect(7, 1, 2, 14, f).rect(7, 5, 2, 1, c).rect(7, 10, 2, 1, c).line(9, 6, 13, 3, f, 2).line(7, 9, 3, 6, f, 2).line(9, 11, 13, 13, f, 1); },
  hex(i, f, c) { const P = [[8, 2], [13, 5], [13, 11], [8, 14], [3, 11], [3, 5]]; for (let k = 0; k < 6; k++) i.line(...P[k], ...P[(k + 1) % 6], f); i.ellipse(8, 8, 1.6, 1.6, c); },
};
const draw = (motif, f, c) => { const i = icon(16, 16); MOTIFS[motif](i, f, c); return i; };

// ---------- 1) 콘크리트 (월드 전체) ----------
// 유약 바른 전돌: 원래 색 + 은은한 결, 한 칸 어두운 테두리(쌓으면 줄눈처럼 보임), 같은 색 계열로 옅게 새긴 무늬
function concrete(col) {
  const img = PNG.blank(16, 16), b = col.base;
  const motif = draw(col.motif, "#ffffff", "#000000").px; // 모양만 쓴다
  for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
    const edge = x === 0 || y === 0 || x === 15 || y === 15;
    let c = hash(x, y, col.id.length) < 0.25 ? darken(b, 0.05) : hash(x, y, 7) > 0.85 ? lighten(b, 0.05) : b;
    if (edge) c = darken(b, 0.24);
    else if (motif[y][x] === "#ffffff") c = lighten(b, 0.2);
    else if (motif[y][x] === "#000000") c = darken(b, 0.18);
    PNG.put(img, x, y, c);
  }
  return img;
}

// ---------- 2) 정원 블록 (엔티티) ----------
// 모델: 13칸 전돌 몸통 + 네 옆면에 도드라진 무늬판. 뼈대 이름 'bone'은 도는 애니메이션(grid_block.idle)이 쓰므로 그대로 둔다.
// 텍스처 32×32 배치: 몸통 옆면 (0,0) · 무늬판 (16,0) · 위·아래 (0,16)
function geometry() {
  const side = { uv: [0, 0], uv_size: [16, 16] }, plate = { uv: [16, 0], uv_size: [16, 16] }, top = { uv: [0, 16], uv_size: [16, 16] };
  return {
    format_version: "1.12.0",
    "minecraft:geometry": [{
      description: { identifier: "geometry.rwm.grid_block", texture_width: 32, texture_height: 32, visible_bounds_width: 3, visible_bounds_height: 2.5, visible_bounds_offset: [0, 0.75, 0] },
      bones: [{
        name: "bone", pivot: [0, 0, 0],
        cubes: [
          { origin: [-6.5, 0, -6.5], size: [13, 13, 13], uv: { north: side, east: side, south: side, west: side, up: top, down: top } },
          { origin: [-5.5, 1, -7], size: [11, 11, 0.5], uv: { north: plate } },
          { origin: [-5.5, 1, 6.5], size: [11, 11, 0.5], uv: { south: plate } },
          { origin: [6.5, 1, -5.5], size: [0.5, 11, 11], uv: { east: plate } },
          { origin: [-7, 1, -5.5], size: [0.5, 11, 11], uv: { west: plate } },
        ],
      }],
    }],
  };
}
function pickup(col) {
  const img = PNG.blank(32, 32);
  if (col) {
    const tile = concrete(col);
    PNG.paste(img, tile, 0, 0); PNG.paste(img, tile, 0, 16);
    // 무늬판: 밝은 무늬 + 짙은 외곽선 (배경은 투명 → 몸통 위에 도드라짐)
    const m = draw(col.motif, lighten(col.base, 0.62), "#f5cf5c");
    m.shade({ light: 0.12, dark: 0.12, outline: darken(col.base, 0.55), keep: new Set(["#f5cf5c"]) });
    PNG.paste(img, m.image(), 16, 0);
  } else {
    // 가져간 뒤(충전 중): 유약 없는 회색 전돌, 무늬판 없음 → '비어 있음'
    const g = "#8f8a80";
    for (const [ox, oy] of [[0, 0], [0, 16]]) for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
      const edge = x === 0 || y === 0 || x === 15 || y === 15, inner = x === 3 || y === 3 || x === 12 || y === 12;
      const inBox = x >= 3 && x <= 12 && y >= 3 && y <= 12;
      PNG.put(img, ox + x, oy + y, edge ? darken(g, 0.25) : inBox && inner ? darken(g, 0.15) : hash(x, y, 3) < 0.2 ? darken(g, 0.06) : g);
    }
  }
  return img;
}

// ---------- 확인용 미리보기: 실제 목표 무늬 구조물을 새 텍스처로 ----------
// .mcstructure(리틀엔디언 NBT)에서 크기·블록 배열·팔레트만 읽는다
function readStructure(file) {
  const b = fs.readFileSync(file); let p = 0;
  const str = () => { const n = b.readUInt16LE(p); p += 2; const s = b.toString("utf8", p, p + n); p += n; return s; };
  function val(t) {
    switch (t) {
      case 1: return b.readInt8(p++);
      case 2: p += 2; return b.readInt16LE(p - 2);
      case 3: p += 4; return b.readInt32LE(p - 4);
      case 4: p += 8; return Number(b.readBigInt64LE(p - 8));
      case 5: p += 4; return b.readFloatLE(p - 4);
      case 6: p += 8; return b.readDoubleLE(p - 8);
      case 7: { const n = b.readInt32LE(p); p += 4; const a = [...b.slice(p, p + n)]; p += n; return a; }
      case 8: return str();
      case 9: { const et = b[p++], n = b.readInt32LE(p); p += 4; const a = []; for (let i = 0; i < n; i++) a.push(val(et)); return a; }
      case 10: { const o = {}; for (;;) { const tt = b[p++]; if (tt === 0) return o; const k = str(); o[k] = val(tt); } }
      case 11: { const n = b.readInt32LE(p); p += 4; const a = []; for (let i = 0; i < n; i++) { a.push(b.readInt32LE(p)); p += 4; } return a; }
      default: throw new Error("NBT 태그 " + t);
    }
  }
  const t = b[p++]; str(); const root = val(t);
  const s = root.structure, pal = s.palette.default.block_palette.map(x => x.name.replace("minecraft:", ""));
  return { size: root.size, blocks: s.block_indices[0].map(i => (i < 0 ? "air" : pal[i])) };
}
function preview(out) {
  const pats = [1, 9, 17, 25].map(n => readStructure(path.join(__dirname, `../../behavior_packs/bp0/structures/grid_pattern_${n}.mcstructure`)));
  const tiles = Object.fromEntries(COLORS.map(c => [`${c.id}_concrete`, concrete(c)]));
  const cell = 16 * 3, gap = 24, pw = Math.max(...pats.map(p => p.size[0] * p.size[2] > 0 ? Math.max(p.size[0], p.size[2]) : 1));
  const W = pats.length * (pw * cell + gap), H = Math.max(...pats.map(p => p.size[1])) * cell + 20;
  const img = PNG.blank(W, H); PNG.put(img, 0, 0, null);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) PNG.put(img, x, y, "#e9e3d8");
  pats.forEach((st, k) => {
    const [sx, sy, sz] = st.size, wide = sx >= sz; // 벽은 한 축이 1칸 — 넓은 축을 가로로
    for (let x = 0; x < sx; x++) for (let y = 0; y < sy; y++) for (let z = 0; z < sz; z++) {
      const name = st.blocks[(x * sy + y) * sz + z], t = tiles[name];
      if (!t) continue;
      const u = wide ? x : z, v = sy - 1 - y;
      for (let j = 0; j < cell; j++) for (let i = 0; i < cell; i++) PNG.put(img, k * (pw * cell + gap) + u * cell + i, 10 + v * cell + j, PNG.get(t, Math.floor(i / 3), Math.floor(j / 3)).slice(0, 3).reduce((s, n) => s + n.toString(16).padStart(2, "0"), "#"));
    }
  });
  fs.writeFileSync(out, PNG.encode(img));
}

function build() {
  for (const c of COLORS) fs.writeFileSync(path.join(RP, `textures/blocks/concrete_${c.id}.png`), PNG.encode(concrete(c)));
  const dir = path.join(RP, "textures/rwm/entity/grid");
  fs.mkdirSync(dir, { recursive: true });
  for (const c of COLORS) fs.writeFileSync(path.join(dir, `grid_block_${c.id}.png`), PNG.encode(pickup(c)));
  fs.writeFileSync(path.join(dir, "grid_block_empty.png"), PNG.encode(pickup(null)));
  fs.writeFileSync(path.join(RP, "models/entity/grid_block.geo.json"), JSON.stringify(geometry(), null, "\t") + "\n");
  console.log("콘크리트 5색 · 정원 블록 텍스처 6장 · 모델 생성:", COLORS.map(c => `${c.id}=${c.name}`).join(" "));
}
if (require.main === module) {
  const i = process.argv.indexOf("--preview");
  if (i > 0) preview(process.argv[i + 1]); else build();
}
module.exports = { COLORS, concrete, pickup };

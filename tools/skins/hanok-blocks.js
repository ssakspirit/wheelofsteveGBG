// 한옥 궁궐 블록 1차: 바닐라 블록 8가지의 텍스처를 리소스팩에서 바꾼다 (월드 데이터는 그대로, 같은 블록이 월드 전체에서 바뀐다).
//   node tools/skins/hanok-blocks.js [--preview 출력.png]
// 사용처는 python tools/scan-blocks.py 로 조사했다 (로비 마을·옥새·자격루·6진 망루 등).
//   궐문     흑요석 + 네더 포털 (로비의 게임 선택 문)       → 단청 문틀 + 금빛 구름이 흐르는 문 안쪽 (32프레임)
//   기와     참나무 계단·반 블록                           → 검은 기와 (blocks.json에서 새 텍스처로 연결 — 판자와 그림을 공유하므로)
//   담장돌   조약돌·이끼 낀 조약돌                         → 화강암 마름돌 담장
//   박석     매끄러운 돌·매끄러운 돌 반 블록                → 박석 마당
//   창호     유리(옥새 진열장) → 나무 창살 + 맑은 유리 / 판유리(로비 창문) → 띠살 창호지 (blocks.json 연결)
//   회벽     흰 테라코타                                   → 흰 회벽
//   붉은 기둥 벗긴 참나무 원목                             → 주칠 기둥
//   망루 목재 맹그로브 원목·판자(계단·반 블록 포함)          → 6진 망루의 검게 그을린 목재
// 텍스처를 다른 블록과 같이 쓰지 않는 것은 바닐라 경로의 파일을 덮어쓰고, 같이 쓰는 것은 textures/blocks/rwm/에 새로 그려 연결한다.
const fs = require("fs"), path = require("path");
const PNG = require("./png");
const { mix, lighten, darken, hash } = require("./modelkit");

const RP = path.join(__dirname, "../../resource_packs/rp0");
const BL = path.join(RP, "textures/blocks");

const tex = (w, h, f) => { const img = PNG.blank(w, h); for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) PNG.put(img, x, y, f(x, y)); return img; };
const grain = (c, x, y, s, a = 0.07) => { const r = hash(x, y, s); return r < 0.12 ? darken(c, a) : r > 0.9 ? lighten(c, a) : c; };
const wrap = d => Math.min(Math.abs(d), 16 - Math.abs(d));

// ---------- 기와: 수키와 줄과 막새(둥근 끝)가 엇갈려 놓인 검은 기와. 계단이 어느 방향을 봐도 기와로 읽히게 방향 없는 무늬 ----------
function giwa() {
  const gap = "#24272b", dark = "#383d42", mid = "#50565d", hi = "#6c737b", end = "#5d646c";
  return tex(16, 16, (x, y) => {
    const row = y >> 3, ly = y & 7, tx = (x + (row ? 2 : 0)) & 3;
    if (ly === 7) return tx === 0 || tx === 3 ? gap : darken(end, 0.25);           // 막새 아래 그늘
    if (ly === 6) return tx === 0 ? gap : tx === 3 ? dark : grain(end, x, y, 1);     // 막새(둥근 끝)
    if (ly === 0) return tx === 0 ? gap : darken(mid, 0.18);                         // 윗줄 기와가 드리운 그늘
    const c = tx === 0 ? dark : tx === 1 ? hi : tx === 2 ? mid : dark;               // 볼록한 수키와 음영
    return grain(c, x, y, 2, 0.06);
  });
}

// ---------- 담장돌: 크기가 다른 화강암 마름돌을 엇갈려 쌓고 줄눈을 넣은 궁궐 담장 ----------
const ROWS = [[0, 3, [3, 10]], [5, 9, [6, 13]], [11, 14, [1, 8]]];  // [시작 y, 끝 y, 세로 줄눈 x]
const GRANITE = ["#b8b1a4", "#aba497", "#c2bbad", "#a0998d", "#b3ad9f"];
function wallStone(moss) {
  const mortar = "#6e675d";
  return tex(16, 16, (x, y) => {
    const r = ROWS.findIndex(([a, b]) => y >= a && y <= b);
    if (r < 0) return moss && hash(x, y, 9) < 0.45 ? "#56703a" : mortar;           // 가로 줄눈
    const [a, b, joints] = ROWS[r];
    if (joints.includes(x)) return moss && hash(x, y, 9) < 0.4 ? "#56703a" : mortar; // 세로 줄눈
    const k = joints.filter(j => j < x).length % joints.length;                     // 몇 번째 돌인지 (한 바퀴 돌면 처음 돌)
    let c = GRANITE[(r * 2 + k * 3) % GRANITE.length];
    if (y === a) c = lighten(c, 0.12); else if (y === b) c = darken(c, 0.14);       // 돌마다 위는 밝고 아래는 어둡게
    if (joints.includes((x + 1) & 15)) c = darken(c, 0.1);
    const s = hash(x, y, 4);
    if (s < 0.1) c = darken(c, 0.2); else if (s > 0.95) c = lighten(c, 0.2);        // 화강암 반점
    if (moss && y >= b - 1 && hash(x >> 1, y, 7 + r) < 0.55) c = hash(x, y, 8) < 0.5 ? "#5d7a3a" : "#4a6630"; // 돌 아래쪽 이끼
    return c;
  });
}

// ---------- 박석: 넓적한 돌을 깐 마당 (경계가 이어지는 보로노이 무늬) ----------
const SEEDS = [[3, 3], [11, 2], [7, 9], [14, 11], [2, 13]];
const FLAG = ["#cfc9bc", "#c3bdb0", "#d7d1c4", "#bdb7aa", "#cac4b7"];
function flagstone(side) {
  const joint = "#8b867b";
  return tex(16, 16, (x, y) => {
    if (side) {                                              // 반 블록 옆: 위·아래 두 장의 돌 두께, 가운데와 맨 아래 줄눈, 돌 사이 세로 줄눈
      if (y === 7 || y === 15 || (y < 7 ? x === 4 : x === 11)) return joint;
      const c = FLAG[y < 8 ? (x < 4 ? 1 : 0) : (x < 11 ? 2 : 4)];
      return (y === 0 || y === 8) ? lighten(c, 0.1) : grain(c, x, y, 5, 0.06);
    }
    const d = SEEDS.map(([sx, sy]) => wrap(x + 0.5 - sx) ** 2 + wrap(y + 0.5 - sy) ** 2);
    const order = d.map((v, i) => [v, i]).sort((p, q) => p[0] - q[0]);
    if (Math.sqrt(order[1][0]) - Math.sqrt(order[0][0]) < 0.8) return joint;
    return grain(FLAG[order[0][1]], x, y, 6, 0.06);
  });
}

// ---------- 회벽 ----------
const plaster = () => tex(16, 16, (x, y) => { const s = hash(x, y, 11); return s < 0.14 ? "#e0d9ca" : s > 0.93 ? "#f2ede2" : "#e9e3d6"; });

// ---------- 붉은 기둥: 주칠한 나뭇결, 위는 나무 마구리에 붉은 테 ----------
function pillar(top) {
  if (top) return tex(16, 16, (x, y) => {
    const r = Math.hypot(x - 7.5, y - 7.5);
    if (r > 6.9) return "#8f2a1f";
    return grain(Math.floor(r) % 2 ? "#a77a4b" : "#b88c5b", x, y, 12, 0.05);
  });
  const tones = ["#8e2a1f", "#9a2e22", "#a5372a", "#962c21"];
  return tex(16, 16, (x, y) => {
    let c = tones[Math.floor(hash(x, 0, 13) * tones.length)];
    if (hash(x, y >> 2, 14) < 0.12) c = darken(c, 0.15);                // 결을 따라 짙은 줄
    return grain(c, x, y, 15, 0.05);
  });
}

// ---------- 망루 목재: 북방 망루의 검게 그을린 소나무 판재·통나무 ----------
function tower(kind) {
  if (kind === "planks") {
    const boards = ["#4f3727", "#4a3324", "#553b2a", "#47311f"];
    return tex(16, 16, (x, y) => {
      const b = y >> 2, ly = y & 3;
      if (ly === 3) return "#24180f";                                    // 판자 사이
      if ((b % 2 ? x === 14 : x === 1) && ly === 1) return "#2c2c30";     // 쇠못
      let c = boards[b];
      if (hash(x >> 1, y, 16 + b) < 0.2) c = darken(c, 0.14);
      return grain(c, x, y, 17, 0.06);
    });
  }
  if (kind === "top") return tex(16, 16, (x, y) => {
    const r = Math.hypot(x - 7.5, y - 7.5);
    if (r > 6.9) return "#2e2017";
    return grain(Math.floor(r) % 2 ? "#4a3426" : "#5c4231", x, y, 18, 0.05);
  });
  return tex(16, 16, (x, y) => {                                         // 통나무 옆
    let c = hash(x, 0, 19) < 0.5 ? "#3f2c1f" : "#46311f";
    if (hash(x, y >> 1, 20) < 0.1) c = "#281b12";                        // 갈라진 틈
    else if (hash(x, y, 21) > 0.9) c = "#55402e";
    return c;
  });
}

// ---------- 궐문: 흑요석 = 단청 문틀 / 포털 = 금빛 구름이 흐르는 문 안쪽 ----------
function dancheong() {
  return tex(16, 16, (x, y) => {
    const e = Math.min(x, y, 15 - x, 15 - y);
    if (e === 0) return "#1c2621";
    if (e === 1) return "#e9e2c9";
    const dia = Math.abs(x - 7.5) + Math.abs(y - 7.5);
    if (dia <= 1.5) return "#e8c25a";                                   // 꽃술
    if (dia <= 3.5) return "#efe6cf";                                   // 흰 꽃잎
    if (dia <= 5.5) return "#b1382b";                                   // 붉은 테
    const corner = Math.min(Math.hypot(x - 2, y - 2), Math.hypot(x - 13, y - 2), Math.hypot(x - 2, y - 13), Math.hypot(x - 13, y - 13));
    if (corner <= 2.2) return "#2c548c";                                // 모서리 청색
    return grain("#2f7a5a", x, y, 22, 0.06);                            // 녹색 바탕
  });
}
function portalFrames() {
  const F = 32, TAU = Math.PI * 2;
  return tex(16, 16 * F, (x, Y) => {
    const t = Math.floor(Y / 16), y = Y % 16;
    const v = 0.5 + 0.22 * Math.sin(TAU * (x / 16 + t / F)) * Math.cos(TAU * (2 * y / 16 - t / F))
      + 0.18 * Math.sin(TAU * ((x + y) / 16 + 2 * t / F)) + 0.1 * Math.cos(TAU * ((x - 2 * y) / 16 - t / F));
    return v < 0.32 ? "#b8762ec8" : v < 0.52 ? "#e2a043c8" : v < 0.72 ? "#f4c76ad2" : "#fff0c2e0";
  });
}

// ---------- 창호 ----------
function lattice() {   // 유리: 나무 창살 + 맑은 유리 (진열장 안이 보이게)
  return tex(16, 16, (x, y) => {
    if (x === 0 || y === 0 || x === 15 || y === 15) return "#5b3d26";
    if (x === 5 || x === 10 || y === 7) return "#6b4a2f";
    return "#dfeef030";
  });
}
function changho() {   // 판유리: 띠살 창호지 (살은 세로, 위·아래에 가로살 띠)
  return tex(16, 16, (x, y) => {
    if (x === 0 || y === 0 || x === 15 || y === 15) return "#5b3d26";
    if (x % 3 === 0 || y === 3 || y === 4 || y === 11 || y === 12) return "#7a5a3c";
    return hash(x, y, 23) < 0.15 ? "#e8dfc6e6" : "#f2ead4e6";
  });
}

// ---------- 쓰기 ----------
const OUT = {
  "obsidian": dancheong(), "portal": portalFrames(),
  "rwm/giwa": giwa(),
  "cobblestone": wallStone(false), "cobblestone_mossy": wallStone(true),
  "stone_slab_top": flagstone(false), "stone_slab_side": flagstone(true),
  "glass": lattice(), "rwm/changho": changho(), "rwm/changho_edge": tex(16, 16, () => "#5b3d26"),
  "hardened_clay_stained_white": plaster(),
  "stripped_oak_log": pillar(false), "stripped_oak_log_top": pillar(true),
  "mangrove_planks": tower("planks"), "mangrove_log_side": tower("side"), "mangrove_log_top": tower("top"),
};
for (const [name, img] of Object.entries(OUT)) {
  const f = path.join(BL, name + ".png");
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, PNG.encode(img));
}

// 새로 그린 텍스처를 atlas 키로 등록하고, 판자·유리와 그림을 공유하는 블록만 새 키로 연결한다
const jsonc = f => JSON.parse(fs.readFileSync(f, "utf8").replace(/^﻿/, ""));
const ttf = path.join(RP, "textures/terrain_texture.json"), tt = jsonc(ttf);
for (const k of ["giwa", "changho", "changho_edge"]) tt.texture_data["rwm_" + k] = { textures: "textures/blocks/rwm/" + k };
fs.writeFileSync(ttf, JSON.stringify(tt, null, 2) + "\n");
const bjf = path.join(RP, "blocks.json"), bj = jsonc(bjf);
for (const b of ["oak_stairs", "oak_slab", "oak_double_slab"]) bj[b] = { textures: "rwm_giwa", sound: "wood" };
bj.glass_pane = { textures: { up: "rwm_changho", down: "rwm_changho", north: "rwm_changho", south: "rwm_changho", west: "rwm_changho", east: "rwm_changho_edge" }, sound: "glass" };
fs.writeFileSync(bjf, JSON.stringify(bj, null, 2) + "\n");

// --preview: 각 텍스처를 3×3으로 이어 붙여 6배로 키운 견본 (이음매 확인용)
const pv = process.argv.indexOf("--preview");
if (pv > 0) {
  const names = Object.keys(OUT), S = 6, cell = 48 * S + 8, cols = 4, rows = Math.ceil(names.length / cols);
  const img = PNG.blank(cols * cell, rows * cell);
  names.forEach((n, i) => {
    const t = OUT[n], ox = (i % cols) * cell, oy = Math.floor(i / cols) * cell;
    for (let y = 0; y < 48 * S; y++) for (let x = 0; x < 48 * S; x++) {
      const p = PNG.get(t, Math.floor(x / S) % 16, Math.floor(y / S) % 16);
      const bg = ((x >> 3) + (y >> 3)) % 2 ? 200 : 235, a = p[3] / 255;
      PNG.put(img, ox + x, oy + y, "#" + [0, 1, 2].map(k => Math.round(p[k] * a + bg * (1 - a)).toString(16).padStart(2, "0")).join(""));
    }
  });
  fs.writeFileSync(process.argv[pv + 1], PNG.encode(img));
}
console.log("한옥 블록 텍스처 " + Object.keys(OUT).length + "장 + blocks.json(기와·창호 연결) + terrain_texture.json");

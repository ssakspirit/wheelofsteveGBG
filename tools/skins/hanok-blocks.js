// 한옥 궁궐 블록 1차: 바닐라 블록 8가지의 텍스처를 리소스팩에서 바꾼다 (월드 데이터는 그대로, 같은 블록이 월드 전체에서 바뀐다).
//   node tools/skins/hanok-blocks.js [--preview 출력.png]
// 사용처는 python tools/scan-blocks.py 로 조사했다 (로비 마을·옥새·자격루·6진 망루 등).
//   궐문     흑요석 + 네더 포털 (로비의 게임 선택 문)       → 단청 문틀 + 금빛 구름이 흐르는 문 안쪽 (32프레임)
//   기와     참나무 계단·반 블록                           → 검은 기와 (blocks.json에서 새 텍스처로 연결 — 판자와 그림을 공유하므로)
//   담장돌   조약돌·이끼 낀 조약돌                         → 화강암 마름돌 담장
//   박석     매끄러운 돌·매끄러운 돌 반 블록                → 박석 마당
//   장대석   석재 벽돌·그 계단·반 블록·담장 (2차)           → 길게 다듬은 화강암 기단 (그림 파일을 덮어씀 — 이끼·금 간·조각 석재 벽돌은 그대로)
//   창호     유리(옥새 진열장) → 나무 창살 + 맑은 유리 / 판유리(로비 창문) → 띠살 창호지 (blocks.json 연결)
//   회벽     흰 테라코타                                   → 흰 회벽
//            참나무 판자 (2차, 대부분 건물 벽)               → 같은 결의 회벽 (blocks.json 연결 — 울타리·누름판은 판자 그림을 같이 써서)
//   붉은 기둥 벗긴 참나무 원목                             → 주칠 기둥
//   망루 목재 맹그로브 원목·판자(계단·반 블록 포함)          → 홍포대 망루의 검붉은 옻칠 목재 / 뒤틀린 판자(·계단) → 청포대 망루의 검푸른 목재
//   3차 (교태전 정원 세트 등) 회백색 콘크리트 → 회색 전돌(꽃담 바탕), 정글나무 반 블록 → 장대석(교태전 가운데 길·담 덮개),
//            정글나무 울타리 → 대나무 살, TNT → 화약궤, 참나무 울타리 → 짙은 고동색 난간
//   4차      금 간·조각된 석재 벽돌 → 금 간·연꽃 새긴 장대석, 가문비 울타리 → 고동색 난간, 참나무 문 → 띠살문, 책장 → 책가도
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

// ---------- 장대석: 길게 다듬은 화강암을 두 줄로 엇갈려 쌓은 기단·월대 (석재 벽돌 · 그 계단·반 블록·담장) ----------
function jangdaeseok() {
  const joint = "#7b766d", tones = ["#bdb8ae", "#b3aea3", "#c4bfb5"];
  return tex(16, 16, (x, y) => {
    const row = y >> 3, ly = y & 7;
    if (ly === 7 || x === (row ? 7 : 15)) return joint;                       // 가로 줄눈 · 줄마다 엇갈린 세로 줄눈
    const k = row ? (x < 7 ? 1 : 2) : 0;
    let c = tones[k];
    if (ly === 0) c = lighten(c, 0.12); else if (ly === 6) c = darken(c, 0.12); // 돌마다 윗모서리 밝게, 아래 어둡게
    const s = hash(x, y, 24);
    return s < 0.1 ? darken(c, 0.16) : s > 0.94 ? lighten(c, 0.15) : c;       // 화강암 반점
  });
}

// 금 간 장대석 · 무늬 새긴 장대석 (금 간·조각된 석재 벽돌 — 교태전 바닥 등에 장대석과 섞여 깔려 있다)
function jangdaeCracked() {
  const base = jangdaeseok(), crack = new Set(["3,1", "4,2", "4,3", "5,4", "6,4", "6,5", "11,9", "12,10", "12,11", "13,12", "10,10", "9,11"]);
  return tex(16, 16, (x, y) => crack.has(x + "," + y) ? "#5e5a53" : rgbHex(PNG.get(base, x, y)));
}
function jangdaeCarved() {   // 테두리를 깎고 가운데에 연꽃 무늬를 도드라지게 새긴 돌
  return tex(16, 16, (x, y) => {
    const e = Math.min(x, y, 15 - x, 15 - y);
    if (e === 0) return "#7b766d";
    if (e === 1) return x === 1 || y === 1 ? "#d0cbc1" : "#9a958b";       // 빗각 모서리
    const r = Math.hypot(x - 7.5, y - 7.5), a = Math.atan2(y - 7.5, x - 7.5);
    const petal = r < 5.6 && r > 1.6 && Math.cos(a * 8) > 0.15;
    if (r <= 1.6) return "#cfc8b8";                                       // 꽃술
    if (petal) return r > 4.2 ? "#a29d93" : "#d3cec4";                    // 꽃잎 (바깥은 그늘)
    return grain("#bab5ab", x, y, 30, 0.06);
  });
}
const rgbHex = p => "#" + p.slice(0, 3).map(v => v.toString(16).padStart(2, "0")).join("");

// ---------- 띠살문 (참나무 문): 촘촘한 세로 살에 가로 띠, 아래는 나무 궁판 ----------
const FRAME = "#4a3220", SAL = "#6b4a2f", PAPER = "#efe6cf";
function ttisal(part) {
  return tex(16, 16, (x, y) => {
    if (x === 0 || x === 15 || (part === "upper" && y === 0) || (part === "lower" && y === 15)) return FRAME;
    if (part === "lower") {
      if (y === 8) return FRAME;                                            // 궁판 위 가로대
      if (y >= 9) return (x === 2 || x === 13 || y === 10 || y === 14) ? "#7d5835" : grain("#8e663d", x, y, 31, 0.05); // 궁판
      if (y === 3 || y === 4) return SAL;                                   // 가운데 띠
    } else if (y === 2 || y === 3 || y === 13 || y === 14) return SAL;     // 위·아래 띠
    return x % 2 ? SAL : (hash(x, y, 32) < 0.12 ? "#e4dbc3" : PAPER);       // 세로 살 + 창호지
  });
}
function ttisalIcon() {   // 아이템 아이콘: 가운데 8칸 너비의 문
  return tex(16, 16, (x, y) => {
    if (x < 4 || x > 11) return null;
    if (x === 4 || x === 11 || y === 0 || y === 15 || y === 10) return FRAME;
    if (y >= 11) return "#8e663d";
    if (y === 2 || y === 7) return SAL;
    return x % 2 ? SAL : PAPER;
  });
}

// ---------- 책가도 (책장): 책을 눕혀 쌓은 칸과 청자 병·두루마리 ----------
function chaekgado() {
  const covers = ["#2b4f86", "#c9a45a", "#2e6f58", "#a3322a", "#2b4f86", "#5b3d6e"];
  return tex(16, 16, (x, y) => {
    if (x === 0 || x === 15 || y === 0 || y === 15) return "#3d2a1c";
    if (y === 7 || y === 8) return y === 7 ? "#6b4a2f" : "#4f3522";          // 가운데 선반
    const top = y < 7, ly = top ? y - 1 : y - 9;                              // 칸 안 줄 (0~5)
    if (x >= 2 && x <= 7) {                                                   // 눕혀 쌓은 책
      const book = top ? ly : ly + 2;
      if (top && ly < 1) return "#5a3d27";
      return x === 7 ? "#efe6cf" : covers[book % covers.length];             // 오른쪽 끝은 책장 단면(흰 종이)
    }
    if (top && x >= 10 && x <= 12) {                                         // 청자 병
      const w = ly < 1 ? 0 : ly < 2 ? 0.5 : 1.5;
      if (Math.abs(x - 11) <= w && ly >= 0) return ly === 5 ? "#6f9a86" : "#8fb8a4";
    }
    if (!top && ly >= 3 && x >= 9 && x <= 13) return x === 11 ? "#a3322a" : "#e9e2c9"; // 두루마리
    return "#5a3d27";                                                         // 칸 안쪽 그늘
  });
}

// ---------- 회벽 ----------
const plaster = (seed = 11) => tex(16, 16, (x, y) => { const s = hash(x, y, seed); return s < 0.14 ? "#e0d9ca" : s > 0.93 ? "#f2ede2" : "#e9e3d6"; });

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

// ---------- 망루 목재: 북방 망루의 옻칠한 판재·통나무 — 팀 색으로 (홍포대 망루 = 맹그로브, 청포대 망루 = 뒤틀린 판자) ----------
const TOWER = {
  red: { boards: ["#5a2a22", "#542620", "#612e25", "#4e231d"], seam: "#2a110d", side: ["#4a201a", "#521f19"], crack: "#2a100c", hi: "#6a3428", ring: ["#5e2c22", "#70362a"], rim: "#33160f" },
  blue: { boards: ["#24364a", "#213245", "#283c52", "#1f2f40"], seam: "#0f1824" },
};
function tower(kind, team = "red") {
  const P = TOWER[team];
  if (kind === "planks") {
    return tex(16, 16, (x, y) => {
      const b = y >> 2, ly = y & 3;
      if (ly === 3) return P.seam;                                       // 판자 사이
      if ((b % 2 ? x === 14 : x === 1) && ly === 1) return "#2c2c30";     // 쇠못
      let c = P.boards[b];
      if (hash(x >> 1, y, 16 + b) < 0.2) c = darken(c, 0.14);
      return grain(c, x, y, 17, 0.06);
    });
  }
  if (kind === "top") return tex(16, 16, (x, y) => {
    const r = Math.hypot(x - 7.5, y - 7.5);
    if (r > 6.9) return P.rim;
    return grain(P.ring[Math.floor(r) % 2], x, y, 18, 0.05);
  });
  return tex(16, 16, (x, y) => {                                         // 통나무 옆
    let c = P.side[hash(x, 0, 19) < 0.5 ? 0 : 1];
    if (hash(x, y >> 1, 20) < 0.1) c = P.crack;                          // 갈라진 틈
    else if (hash(x, y, 21) > 0.9) c = P.hi;
    return c;
  });
}

// ---------- 교태전 정원 세트: 회색 전돌(꽃담 바탕) · 대나무 살 울타리 ----------
function jeondol() {   // 회백색 콘크리트 → 회색 전돌을 흰 줄눈으로 쌓은 꽃담 바탕 (벽돌 높이 4칸, 엇갈려 쌓기)
  const mortar = "#d2ccbf", tones = ["#6c6f71", "#75787a", "#666a6c", "#7e8183"];
  return tex(16, 16, (x, y) => {
    const row = y >> 2, ly = y & 3, off = row % 2 ? 4 : 0;
    if (ly === 3 || ((x + off) & 7) === 7) return mortar;
    const k = (row * 3 + (((x + off) >> 3) & 1)) % tones.length;
    let c = tones[k];
    if (ly === 0) c = lighten(c, 0.08);
    return grain(c, x, y, 25, 0.07);
  });
}
function bamboo() {    // 정글나무 울타리 → 대나무 살: 세로 대나무 네 줄, 마디가 어긋나게
  const node = [3, 9, 6, 12];
  return tex(16, 16, (x, y) => {
    const k = x >> 2, lx = x & 3;
    if (lx === 3) return "#5d6a2a";                                       // 대 사이 그늘
    if (y === node[k] || y === (node[k] + 8) % 16) return "#7c8a36";       // 마디
    const c = lx === 0 ? "#c9d27e" : lx === 1 ? "#aab95a" : "#8e9c44";      // 둥근 줄기 음영
    return grain(c, x, y, 26 + k, 0.05);
  });
}

// ---------- 화약궤: TNT → 화약을 담은 나무 궤짝 (붉은 종이에 '火') ----------
const FIRE = ["...#...", ".#.#.#.", ".#.#.#.", "...#...", "..#.#..", ".#...#.", "#.....#"];  // 火 (7×7)
function gunpowder(face) {
  const wood = ["#7a5230", "#835a35", "#6f4a2a"];
  return tex(16, 16, (x, y) => {
    if (face === "side") {
      if (y === 0 || y === 15 || x === 0 || x === 15) return "#3b3d42";   // 쇠 모서리
      if (y === 2 || y === 13) return "#4a4c52";                           // 쇠띠
      if (x >= 3 && x <= 12 && y >= 3 && y <= 12) {                       // 붉은 종이
        const gx = x - 4, gy = y - 4;
        if (gx >= 0 && gx < 7 && gy >= 0 && gy < 7 && FIRE[gy][gx] === "#") return "#1d1a19";
        return x === 3 || x === 12 || y === 3 || y === 12 ? "#8e2a20" : "#b8392c";
      }
    } else {
      if (y === 0 || y === 15 || x === 0 || x === 15) return "#3b3d42";
      if (face === "top" && (x === 7 || x === 8 || y === 7 || y === 8)) return "#c9a45a"; // 묶은 새끼줄
    }
    const c = wood[(y >> 2) % wood.length];
    return (y & 3) === 3 ? darken(c, 0.25) : grain(c, x, y, 27, 0.06);
  });
}

// ---------- 짙은 고동색 목재: 참나무 울타리 → 원목 기둥과 같은 색의 난간 ----------
function mokjae() {
  const tones = ["#5a3f27", "#634529", "#523a24", "#5e4228"];
  return tex(16, 16, (x, y) => {
    const b = y >> 2;
    if ((y & 3) === 3) return "#3a2716";
    let c = tones[b];
    if (hash(x >> 1, y, 28 + b) < 0.2) c = darken(c, 0.12);
    return grain(c, x, y, 29, 0.05);
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
  "stone_slab_top": flagstone(false), "stone_slab_side": flagstone(true), "stonebrick": jangdaeseok(),
  "glass": lattice(), "rwm/changho": changho(), "rwm/changho_edge": tex(16, 16, () => "#5b3d26"),
  "hardened_clay_stained_white": plaster(), "rwm/hoebyeok": plaster(31),
  "stripped_oak_log": pillar(false), "stripped_oak_log_top": pillar(true),
  "mangrove_planks": tower("planks"), "mangrove_log_side": tower("side"), "mangrove_log_top": tower("top"),
  "warped_planks": tower("planks", "blue"),
  // 3차: 교태전 정원 세트 · 화약궤 · 난간
  "concrete_silver": jeondol(),   // 껍질 벗긴 정글나무(교태전 기둥)는 원래 그림 그대로 — 붉게 하면 홍포대·모란 무늬 빨강과 겹친다
  "rwm/daenamu": bamboo(), "rwm/mokjae": mokjae(),
  "tnt_side": gunpowder("side"), "tnt_top": gunpowder("top"), "tnt_bottom": gunpowder("bottom"),
  // 4차: 장대석 변형 · 띠살문 · 책가도 (청사초롱·각궁·신기전·학 날개는 tools/skins/hanok-items.py)
  "stonebrick_cracked": jangdaeCracked(), "stonebrick_carved": jangdaeCarved(),
  "door_wood_lower": ttisal("lower"), "door_wood_upper": ttisal("upper"), "bookshelf": chaekgado(),
};
// 아이템 그림(문 아이콘)은 textures/items/에
fs.writeFileSync(path.join(RP, "textures/items/door_wood.png"), PNG.encode(ttisalIcon()));
for (const [name, img] of Object.entries(OUT)) {
  const f = path.join(BL, name + ".png");
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, PNG.encode(img));
}

// 새로 그린 텍스처를 atlas 키로 등록하고, 판자·유리와 그림을 공유하는 블록만 새 키로 연결한다
const jsonc = f => JSON.parse(fs.readFileSync(f, "utf8").replace(/^﻿/, ""));
const ttf = path.join(RP, "textures/terrain_texture.json"), tt = jsonc(ttf);
for (const k of ["giwa", "changho", "changho_edge", "hoebyeok", "daenamu", "mokjae"]) tt.texture_data["rwm_" + k] = { textures: "textures/blocks/rwm/" + k };
tt.texture_data.rwm_jangdae = { textures: "textures/blocks/stonebrick" };   // 장대석(석재 벽돌 그림)을 다른 블록에도 연결하려고
fs.writeFileSync(ttf, JSON.stringify(tt, null, 2) + "\n");
const bjf = path.join(RP, "blocks.json"), bj = jsonc(bjf);
for (const b of ["oak_stairs", "oak_slab", "oak_double_slab"]) bj[b] = { textures: "rwm_giwa", sound: "wood" };
bj.oak_planks = { textures: "rwm_hoebyeok", sound: "wood" };
for (const b of ["jungle_slab", "jungle_double_slab"]) bj[b] = { textures: "rwm_jangdae", sound: "stone" };  // 3차: 교태전 가운데 길·담 위 덮개 → 장대석 (길에도 쓰여 기와는 안 맞음)
bj.jungle_fence = { textures: "rwm_daenamu", sound: "wood" };                                         // 교태전 격자 울타리 → 대나무 살
bj.oak_fence = { textures: "rwm_mokjae", sound: "wood" };
bj.spruce_fence = { textures: "rwm_mokjae", sound: "wood" };                                          // 4차: 자격루 공방의 가문비 울타리도 같은 난간 색으로                                             // 참나무 울타리 → 짙은 고동색 난간   // 2차: 벽으로 주로 쓰인 참나무 판자 → 회벽 (울타리 등은 판자 그림 그대로)
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

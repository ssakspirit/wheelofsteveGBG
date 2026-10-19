// 팀 옷: 철 갑옷(홍포대)·다이아 갑옷(청포대)을 조선 관복으로. 이름은 ko_KR(홍포대 사모·관복·바지·목화 …).
//   node tools/skins/armor.js
// 바닐라 텍스처를 덮어쓴다(월드의 모든 철·다이아 갑옷 — 이 월드에서는 팀 옷으로만 쓴다):
//   textures/models/armor/{iron,diamond}_1.png  층1 64×32: 투구(머리 상자) → 검은 사모, 갑옷(몸통·팔) → 단령 관복,
//                                                신발(다리 상자 아래쪽) → 목화
//   textures/models/armor/{iron,diamond}_2.png  층2 64×32: 각반(허리·다리) → 관복 아랫자락
//   textures/items/{iron,diamond}_{helmet,chestplate,leggings,boots}.png  아이콘 16×16
// 금 갑옷(관리자 관찰자 /function admin 전용)은 세종대왕 용포로: gold_1/gold_2, items/gold_* (이름은 ko_KR 세종대왕 익선관·곤룡포 …).
// 갑옷은 몸보다 조금 크게 겹쳐 그려지므로, 얼굴·손·발등처럼 드러나야 할 곳은 투명으로 둔다.
const fs = require("fs"), path = require("path");
const PNG = require("./png");
const { icon, lighten, darken, hash } = require("./modelkit");

const RP = path.join(__dirname, "../../resource_packs/rp0/textures");
const TEAMS = {
  iron: { robe: "#b8302a" },       // 홍포대
  diamond: { robe: "#2f5f9e" },    // 청포대
};
const HAT = "#1c1c22", HAT_L = "#34343e", BADGE = "#1d2433", GOLD = "#e0b04a", WHITE = "#f4ecd8", BELT = "#3a2416", BOOT = "#1f1a18", SOLE = "#efe6d2";

// 상자 UV(구형 64×32): 면 이름 → [x, y, w, h]
const box = (u, v, w, h, d) => ({
  top: [u + d, v, w, d], bottom: [u + d + w, v, w, d],
  right: [u, v + d, d, h], front: [u + d, v + d, w, h],
  left: [u + d + w, v + d, d, h], back: [u + 2 * d + w, v + d, w, h],
});
function painter() {
  const img = PNG.blank(64, 32);
  const face = (f, fn) => { const [fx, fy, w, h] = f; for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) PNG.put(img, fx + x, fy + y, fn(x, y, w, h, fx + x, fy + y)); };
  return { img, face };
}
const cloth = (base, ax, ay) => { const r = hash(ax, ay, 3); return r < 0.15 ? darken(base, 0.1) : r > 0.9 ? lighten(base, 0.08) : base; };
// 흉배: 남색 바탕에 금빛 학 (4×5)
const badge = (x, y) => (["GBBG", "BGGB", "BWGB", "BGGB", "GBBG"][y] || "")[x] === "G" ? GOLD : (["GBBG", "BGGB", "BWGB", "BGGB", "GBBG"][y] || "")[x] === "W" ? WHITE : BADGE;

function layer1(T) {
  const { img, face } = painter(), R = T.robe, RD = darken(R, 0.25);
  // 투구 → 사모: 머리 상자의 윗부분만 검게, 얼굴(아래 절반)은 투명
  const head = box(0, 0, 8, 8, 8);
  face(head.top, (x, y, w, h, ax, ay) => (hash(ax, ay) < 0.2 ? HAT_L : HAT));
  for (const k of ["front", "right", "left"]) face(head[k], (x, y, w, h, ax, ay) => (y <= 2 ? ((x + y) % 3 ? HAT : HAT_L) : y === 3 ? HAT_L : null));
  face(head.back, (x, y, w, h, ax, ay) => (y <= 4 ? ((x + y) % 3 ? HAT : HAT_L) : null));
  face(head.bottom, () => null);
  // 갑옷 → 단령 관복: 몸통(둥근 깃·흉배·각대), 넓은 소매
  const body = box(16, 16, 8, 12, 4);
  const robe = (x, y, w, h, ax, ay) => (y === 9 ? (x % 3 === 1 ? GOLD : BELT) : y >= 11 ? RD : cloth(R, ax, ay));
  face(body.front, (x, y, w, h, ax, ay) => {
    if (y === 0 && x >= 2 && x <= 5) return WHITE;                     // 둥근 깃
    if (y === 1 && (x === 2 || x === 5)) return WHITE;
    if (y >= 3 && y <= 7 && x >= 2 && x <= 5) return badge(x - 2, y - 3); // 흉배
    return robe(x, y, w, h, ax, ay);
  });
  face(body.back, (x, y, w, h, ax, ay) => (y >= 3 && y <= 7 && x >= 2 && x <= 5 ? badge(x - 2, y - 3) : robe(x, y, w, h, ax, ay)));
  face(body.right, robe); face(body.left, robe);
  face(body.top, (x, y, w, h, ax, ay) => cloth(R, ax, ay)); face(body.bottom, (x, y, w, h, ax, ay) => RD);
  const arm = box(40, 16, 4, 12, 4);
  for (const k of ["front", "right", "left", "back"]) face(arm[k], (x, y, w, h, ax, ay) => (y >= 11 ? null : y === 10 ? RD : cloth(R, ax, ay)));
  face(arm.top, (x, y, w, h, ax, ay) => cloth(R, ax, ay)); face(arm.bottom, () => null);
  // 신발 → 목화: 다리 상자의 아래 4줄만, 흰 밑창
  const leg = box(0, 16, 4, 12, 4);
  for (const k of ["front", "right", "left", "back"]) face(leg[k], (x, y) => (y >= 11 ? SOLE : y >= 8 ? (y === 8 ? HAT_L : BOOT) : null));
  face(leg.top, () => null); face(leg.bottom, () => SOLE);
  return img;
}
function layer2(T) {
  // 각반 → 관복 아랫자락: 허리 아래 몸통 + 다리(무릎 아래 목화 자리는 투명)
  const { img, face } = painter(), R = T.robe, RD = darken(R, 0.25);
  const body = box(16, 16, 8, 12, 4);
  for (const k of ["front", "right", "left", "back"]) face(body[k], (x, y, w, h, ax, ay) => (y < 9 ? null : y === 9 ? BELT : cloth(R, ax, ay)));
  face(body.top, () => null); face(body.bottom, (x, y, w, h, ax, ay) => cloth(R, ax, ay));
  const leg = box(0, 16, 4, 12, 4);
  for (const k of ["front", "right", "left", "back"]) face(leg[k], (x, y, w, h, ax, ay) => (y >= 8 ? null : y === 7 ? RD : cloth(R, ax, ay)));
  face(leg.top, (x, y, w, h, ax, ay) => cloth(R, ax, ay)); face(leg.bottom, () => null);
  return img;
}
// 아이콘
function icons(T) {
  const R = T.robe, RD = darken(R, 0.3), out = {};
  out.helmet = icon(16, 16).rect(4, 5, 8, 6, HAT).rect(5, 4, 6, 1, HAT).rect(3, 10, 10, 1, HAT_L)   // 사모 몸체
    .ellipse(2, 7, 2.2, 1.4, HAT_L).ellipse(14, 7, 2.2, 1.4, HAT_L)                                 // 양 날개(뿔)
    .shade({ outline: "#0d0d10" });
  out.chestplate = icon(16, 16).rect(3, 3, 10, 11, R).rect(1, 4, 2, 6, R).rect(13, 4, 2, 6, R)       // 몸판 · 소매
    .rect(6, 3, 4, 1, WHITE).set(6, 4, WHITE).set(9, 4, WHITE)                                       // 둥근 깃
    .rect(6, 6, 4, 4, BADGE).rect(7, 7, 2, 2, GOLD)                                                  // 흉배
    .rect(3, 11, 10, 1, BELT).set(5, 11, GOLD).set(10, 11, GOLD)                                     // 각대
    .shade({ outline: "#2a1d14", keep: new Set([WHITE, BADGE, GOLD, BELT]) });
  out.leggings = icon(16, 16).rect(4, 2, 8, 2, BELT).rect(4, 4, 8, 4, R).rect(3, 8, 4, 6, R).rect(9, 8, 4, 6, R).rect(3, 13, 4, 1, RD).rect(9, 13, 4, 1, RD)
    .shade({ outline: "#2a1d14", keep: new Set([BELT]) });
  out.boots = icon(16, 16).rect(2, 5, 4, 7, BOOT).rect(2, 11, 6, 2, BOOT).rect(10, 5, 4, 7, BOOT).rect(10, 11, 6, 2, BOOT)
    .rect(2, 13, 6, 1, SOLE).rect(10, 13, 6, 1, SOLE).rect(2, 5, 4, 1, HAT_L).rect(10, 5, 4, 1, HAT_L)
    .shade({ outline: "#0d0d10", keep: new Set([SOLE]) });
  return out;
}
// ---- 금 갑옷 → 세종대왕 용포 (관리자 관찰자 /function admin 이 입는 옷; 이 월드에서 금 갑옷은 관찰자만 쓴다)
//   투구 → 익선관(검은 관, 뒤가 높고 뒤쪽에 위로 선 날개 둘), 갑옷 → 대홍 곤룡포(가슴·등·양어깨에 금빛 용보, 옥대),
//   각반 → 곤룡포 아랫자락, 신발 → 목화. 홍포대 관복과 헷갈리지 않게: 더 짙은 진홍, 남색 흉배 대신 금빛 둥근 용보, 사모 대신 익선관.
const KING = "#a3161f", KING_D = darken(KING, 0.28), JADE = "#d8ead0", JADE_D = "#9fbf97", OKDAE = "#3b0d10";
const ROYAL_GOLD = "#e9b949", ROYAL_GOLD_D = "#b5832a";
// 용보 6×6: 둥근 금빛 수(繡) 판에 짙은 금실로 서린 용 (. = 바탕 옷감). 어깨용 4×4는 작은 판.
const YONGBO = [".OGGO.", "OGgGGO", "GgGGgG", "GGgGgG", "OGGgGO", ".OGGO."];
const YONGBO_S = [".OO.", "OGgO", "OgGO", ".OO."];
const YONG_D = "#9a6a1c";   // 짙은 금실
const medal = pat => (x, y, base) => {
  const ch = (pat[y] || "")[x];
  return ch === "O" ? ROYAL_GOLD_D : ch === "G" ? ROYAL_GOLD : ch === "g" ? "#9a6a1c" : base;
};
const yongbo = medal(YONGBO), yongboS = medal(YONGBO_S);
// 곤룡포 옷감: 은은한 구름무늬(운문) 점
const silk = (ax, ay) => ((ax * 2 + ay * 3) % 7 === 0 && hash(ax, ay, 5) < 0.6 ? darken(KING, 0.14) : hash(ax, ay, 3) > 0.93 ? lighten(KING, 0.1) : KING);
const okdae = x => (x % 3 === 1 ? JADE : x % 3 === 2 ? JADE_D : OKDAE);   // 옥대: 검붉은 띠에 옥 장식

function royal1() {
  const { img, face } = painter();
  // 익선관: 앞은 낮고 뒤는 높게, 뒷면 위쪽에 위로 선 날개 둘
  const head = box(0, 0, 8, 8, 8);
  face(head.top, (x, y, w, h, ax, ay) => (y >= 5 && (x === 1 || x === 2 || x === 5 || x === 6) ? HAT_L : hash(ax, ay) < 0.15 ? HAT_L : HAT));
  // 앞은 낮게; 맨 윗줄에 뒤에 선 날개 끝이 비쳐 보이게
  face(head.front, (x, y) => (y === 0 && (x === 1 || x === 2 || x === 5 || x === 6) ? "#4a4a58" : y <= 2 ? ((x + y) % 4 ? HAT : HAT_L) : y === 3 ? HAT_L : null));
  for (const k of ["right", "left"]) face(head[k], (x, y) => (y <= 3 ? ((x + y) % 4 ? HAT : HAT_L) : y === 4 ? HAT_L : null));
  face(head.back, (x, y) => {
    if (y <= 2 && (x === 1 || x === 2 || x === 5 || x === 6)) return (x === 1 || x === 6) && y === 0 ? HAT : "#4a4a58"; // 날개
    return y <= 5 ? ((x + y) % 4 ? HAT : HAT_L) : null;
  });
  face(head.bottom, () => null);
  // 곤룡포 몸통
  const body = box(16, 16, 8, 12, 4);
  const robe = (x, y, w, h, ax, ay) => (y === 9 ? okdae(x) : y >= 11 ? KING_D : silk(ax, ay));
  face(body.front, (x, y, w, h, ax, ay) => {
    if (y === 0 && x >= 2 && x <= 5) return WHITE;                       // 동정(둥근 깃 안쪽)
    if (y === 1 && (x === 2 || x === 5)) return WHITE;
    if (y >= 2 && y <= 7 && x >= 1 && x <= 6) return yongbo(x - 1, y - 2, robe(x, y, w, h, ax, ay)); // 가슴 용보
    return robe(x, y, w, h, ax, ay);
  });
  face(body.back, (x, y, w, h, ax, ay) => (y >= 2 && y <= 7 && x >= 1 && x <= 6 ? yongbo(x - 1, y - 2, robe(x, y, w, h, ax, ay)) : robe(x, y, w, h, ax, ay)));
  face(body.right, robe); face(body.left, robe);
  face(body.top, (x, y, w, h, ax, ay) => silk(ax, ay)); face(body.bottom, () => KING_D);
  // 소매: 바깥 면 위쪽에 어깨 용보, 손목 아래는 투명
  const arm = box(40, 16, 4, 12, 4);
  const sleeve = (x, y, w, h, ax, ay) => (y >= 11 ? null : y === 10 ? KING_D : silk(ax, ay));
  face(arm.right, (x, y, w, h, ax, ay) => (y <= 3 ? yongboS(x, y, sleeve(x, y, w, h, ax, ay)) : sleeve(x, y, w, h, ax, ay)));
  for (const k of ["front", "left", "back"]) face(arm[k], sleeve);
  face(arm.top, (x, y, w, h, ax, ay) => ((x === 1 || x === 2) && (y === 1 || y === 2) ? ROYAL_GOLD : silk(ax, ay)));
  face(arm.bottom, () => null);
  // 목화
  const leg = box(0, 16, 4, 12, 4);
  for (const k of ["front", "right", "left", "back"]) face(leg[k], (x, y) => (y >= 11 ? SOLE : y >= 8 ? (y === 8 ? HAT_L : BOOT) : null));
  face(leg.top, () => null); face(leg.bottom, () => SOLE);
  return img;
}
function royal2() {
  const { img, face } = painter();
  const body = box(16, 16, 8, 12, 4);
  for (const k of ["front", "right", "left", "back"]) face(body[k], (x, y, w, h, ax, ay) => (y < 9 ? null : y === 9 ? okdae(x) : y === 11 ? KING_D : silk(ax, ay)));
  face(body.top, () => null); face(body.bottom, (x, y, w, h, ax, ay) => silk(ax, ay));
  const leg = box(0, 16, 4, 12, 4);
  for (const k of ["front", "right", "left", "back"]) face(leg[k], (x, y, w, h, ax, ay) => (y >= 8 ? null : y === 7 ? KING_D : silk(ax, ay)));
  face(leg.top, (x, y, w, h, ax, ay) => silk(ax, ay)); face(leg.bottom, () => null);
  return img;
}
function royalIcons() {
  const out = {};
  out.helmet = icon(16, 16).rect(3, 8, 10, 5, HAT).rect(4, 6, 8, 2, HAT).rect(5, 5, 6, 1, HAT)       // 관 몸체(뒤가 높음)
    .rect(3, 12, 10, 1, HAT_L)
    .ellipse(5.5, 3.2, 1.5, 2.4, "#4a4a58").ellipse(10.5, 3.2, 1.5, 2.4, "#4a4a58")                     // 위로 선 날개 둘
    .shade({ outline: "#0d0d10" });
  out.chestplate = icon(16, 16).rect(3, 3, 10, 11, KING).rect(1, 4, 2, 6, KING).rect(13, 4, 2, 6, KING)
    .rect(6, 3, 4, 1, WHITE).set(6, 4, WHITE).set(9, 4, WHITE)                                         // 둥근 깃
    .ellipse(8, 7.5, 2.8, 2.8, ROYAL_GOLD_D).ellipse(8, 7.5, 2.1, 2.1, ROYAL_GOLD).set(7, 6, YONG_D).set(8, 7, YONG_D).set(7, 8, YONG_D) // 용보
    .set(1, 4, ROYAL_GOLD).set(14, 4, ROYAL_GOLD)                                                      // 어깨 용보
    .rect(3, 11, 10, 1, OKDAE).set(4, 11, JADE).set(7, 11, JADE).set(10, 11, JADE)                   // 옥대
    .shade({ outline: "#2a0d0f", keep: new Set([WHITE, ROYAL_GOLD, ROYAL_GOLD_D, YONG_D, JADE, OKDAE]) });
  out.leggings = icon(16, 16).rect(4, 2, 8, 2, OKDAE).set(5, 2, JADE).set(8, 2, JADE).set(11, 2, JADE)
    .rect(4, 4, 8, 4, KING).rect(3, 8, 4, 6, KING).rect(9, 8, 4, 6, KING).rect(3, 13, 4, 1, KING_D).rect(9, 13, 4, 1, KING_D)
    .shade({ outline: "#2a0d0f", keep: new Set([OKDAE, JADE]) });
  out.boots = icons({ robe: KING }).boots;                                                             // 목화는 팀과 같음
  return out;
}

const w = (rel, img) => { fs.writeFileSync(path.join(RP, rel), PNG.encode(img)); console.log("썼음 textures/" + rel); };
for (const [mat, T] of Object.entries(TEAMS)) {
  w(`models/armor/${mat}_1.png`, layer1(T));
  w(`models/armor/${mat}_2.png`, layer2(T));
  for (const [piece, ic] of Object.entries(icons(T))) w(`items/${mat}_${piece}.png`, ic.image());
}
w("models/armor/gold_1.png", royal1());
w("models/armor/gold_2.png", royal2());
for (const [piece, ic] of Object.entries(royalIcons())) w(`items/gold_${piece}.png`, ic.image());

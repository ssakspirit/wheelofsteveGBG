// 팀 옷: 철 갑옷(홍포대)·다이아 갑옷(청포대)을 조선 관복으로. 이름은 ko_KR(홍포대 사모·관복·바지·목화 …).
//   node tools/skins/armor.js
// 바닐라 텍스처를 덮어쓴다(월드의 모든 철·다이아 갑옷 — 이 월드에서는 팀 옷으로만 쓴다):
//   textures/models/armor/{iron,diamond}_1.png  층1 64×32: 투구(머리 상자) → 검은 사모, 갑옷(몸통·팔) → 단령 관복,
//                                                신발(다리 상자 아래쪽) → 목화
//   textures/models/armor/{iron,diamond}_2.png  층2 64×32: 각반(허리·다리) → 관복 아랫자락
//   textures/items/{iron,diamond}_{helmet,chestplate,leggings,boots}.png  아이콘 16×16
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
for (const [mat, T] of Object.entries(TEAMS)) {
  const w = (rel, img) => { fs.writeFileSync(path.join(RP, rel), PNG.encode(img)); console.log("썼음 textures/" + rel); };
  w(`models/armor/${mat}_1.png`, layer1(T));
  w(`models/armor/${mat}_2.png`, layer2(T));
  for (const [piece, ic] of Object.entries(icons(T))) w(`items/${mat}_${piece}.png`, ic.image());
}

// 옥새 쟁탈전: 빛나는 오브를 '옥새'로, 좀비 피글린 추격 몹을 '복면 도적'으로.
//   node tools/skins/orb.js
// 1) 옥새(rwm:orb_flag, 바닥에 놓이거나 머리 위에 떠 있는 것): geometry.orb(금 도장 + 거북 손잡이 + 붉은 인끈)와
//    geometry.orb_outer(반투명 금빛 서기), 두 모델이 텍스처 한 장(textures/rwm/entity/orb.png, 32×32)을 함께 쓴다.
//    뼈대 사슬 waist→body→rightArm→rightItem→item→orb_inner는 animation.orb.*가 쓰므로 그대로 둔다.
//    안쪽 재질이 entity_emissive라 알파는 '발광 정도'다 — 모두 255로 칠해 구멍 없이 보이게 한다(렌더 컨트롤러가 조명을 끈다).
// 2) 아이템 아이콘(textures/rwm/items/orb.png)과 로비 게임 로고 파티클(textures/particle/orb_ambush.png).
// 3) rwm:rainbow 파티클(떨어진 옥새 표시, 활쏘기 3번 과녁 명중)을 원본 점 배치 그대로 오방색으로.
// 4) 추격 몹(rwm:orb_enemy): geometry.rwm.orb_enemy(사람 모양, 뼈대 이름은 animation.orb_enemy.move · humanoid 애니메이션과 같게)
//    + 스킨(tools/skins/orb_enemy.js). 행동·판정은 BP 그대로다.
const fs = require("fs"), path = require("path"), { execFileSync } = require("child_process");
const PNG = require("./png");
const { kit, icon, mix, lighten, darken, rgb, hex } = require("./modelkit");

const ROOT = path.join(__dirname, "../..");
const RP = path.join(ROOT, "resource_packs/rp0");
const write = (rel, data) => { fs.writeFileSync(path.join(RP, rel), data); console.log("썼음", rel); };
const writeJson = (rel, j) => write(rel, JSON.stringify(j, null, "\t") + "\n");

// ---------------- 1) 옥새 모델 ----------------
const GOLD = ["#8f6414", "#b98522", "#dcaa36", "#f3cd5c", "#fde79a"]; // 어두움 → 밝음
const RED = ["#6e1216", "#9b1c22", "#c52b30"], INK = "#7a1117";
const K = kit({ width: 32, height: 32, maxRegion: 8 });
const g = (n, t) => GOLD[Math.max(0, Math.min(GOLD.length - 1, t + (n() < 0.2 ? -1 : n() > 0.85 ? 1 : 0)))];
K.material("gold_up", (x, y, w, h, n) => (x === 0 || y === 0) ? GOLD[4] : g(n, 3));
K.material("gold_side", (x, y, w, h, n) => y === 0 ? GOLD[3] : y === h - 1 ? GOLD[1] : g(n, 2));
// 인면(도장 바닥): 붉은 인주가 묻은 테두리와 글자 획
K.material("seal_face", (x, y, w, h) => {
  if (x === 0 || y === 0 || x === w - 1 || y === h - 1) return RED[1];
  return (x === 2 || y === 2) ? INK : GOLD[1];
}, { max: 5 });
K.material("shell_up", (x, y, w, h, n) => ((x + 2 * y) % 3 === 0 ? GOLD[1] : g(n, 3)), { max: 4 }); // 거북등 무늬
K.material("shell_side", (x, y, w, h, n) => y === 0 ? GOLD[2] : g(n, 1), { max: 4 }); // 등 옆면은 몸체보다 어둡게 해 두 덩어리가 갈린다
K.material("turtle", (x, y, w, h, n) => g(n, 2), { max: 2 });
K.material("cord", (x, y, w, h) => (y % 2 ? RED[1] : RED[2]), { max: 4 });
K.material("tassel", (x, y, w, h) => (x % 2 ? RED[0] : RED[1]), { max: 2 });
// 서기(瑞氣): 가장자리는 진하게, 가운데로 갈수록 옅어지는 금빛 (entity_alphablend)
K.material("glow", (x, y, w, h) => {
  const e = Math.min(x, y, w - 1 - x, h - 1 - y);
  const a = e === 0 ? 0x68 : Math.max(0x06, 0x30 - e * 0x10);
  return "#ffd66a" + a.toString(16).padStart(2, "0");
}, { max: 7 });

function chain(m) { // animation.orb.*가 움직이는 뼈대들
  return m.bone("waist").bone("body", { parent: "waist" }).bone("rightArm", { parent: "body" })
    .bone("rightItem", { parent: "rightArm" }).bone("item", { parent: "rightItem" });
}
const desc = { visible_bounds_width: 3, visible_bounds_height: 2.5, visible_bounds_offset: [0, 0.75, 0] };
const seal = chain(K.model("geometry.orb", desc)).bone("orb_inner", { parent: "item" });
const S = (o, s, m, opt) => seal.cube("orb_inner", o, s, m, opt);
S([-2.5, 0, -2.5], [5, 2, 5], { all: "gold_side", up: "gold_up", down: "seal_face" });   // 도장 몸체
S([-2, 2, -2.25], [4, 1, 4.5], { all: "shell_side", up: "shell_up", down: "none" });     // 거북 등 (아래 단)
S([-1.5, 3, -1.75], [3, 0.75, 3.5], { all: "shell_side", up: "shell_up", down: "none" });  // 거북 등 (가운데 단)
S([-1, 3.75, -1.25], [2, 0.5, 2.5], { all: "shell_side", up: "shell_up", down: "none" });  // 거북 등 (꼭대기)
S([-0.6, 2.2, -3.6], [1.2, 1.1, 1.4], "turtle");                                           // 머리 (앞으로 내민 목)
for (const [x, z] of [[-2.45, -2.5], [1.55, -2.5], [-2.45, 1.6], [1.55, 1.6]]) S([x, 2, z], [0.9, 0.6, 0.9], "turtle"); // 다리
S([-0.3, 2, 2.25], [0.6, 0.5, 0.75], "turtle");                                            // 꼬리
S([1.75, 2.3, -0.25], [1.25, 0.5, 0.5], "cord");                                           // 인끈 (손잡이 구멍에서 옆으로)
S([2.5, 0.4, -0.25], [0.5, 2.4, 0.5], "cord");                                             // 인끈 (도장 옆으로 늘어짐)
S([2.4, 0.1, -0.35], [0.7, 0.4, 0.7], "turtle");                                           // 매듭
S([2.35, -0.9, -0.4], [0.8, 1, 0.8], "tassel");                                            // 술
const aura = chain(K.model("geometry.orb_outer", desc)).bone("orb_outer", { parent: "item", pivot: [0, -0.5, 0] });
aura.cube("orb_outer", [-3.25, -1, -3.25], [6.5, 5.5, 6.5], "glow");

writeJson("models/entity/orb.geo.json", seal.json());
writeJson("models/entity/orb_outer.geo.json", aura.json());
write("textures/rwm/entity/orb.png", PNG.encode(K.img));

// ---------------- 2) 아이콘 · 로고 ----------------
const OUT = "#3a2408", REDS = new Set(RED);
// 도장 몸체 · 거북 · 인끈을 따로 칠해 윤곽선을 넣은 뒤 겹친다 (덩어리끼리 선으로 갈려 작은 크기에서도 읽힌다)
function drawSeal({ ox = 0, oy = 0, tassel = true } = {}) {
  const body = icon(16, 16);
  body.rect(ox + 1, oy + 9, 11, 2, GOLD[3]).rect(ox + 1, oy + 11, 11, 3, GOLD[2]).rect(ox + 1, oy + 13, 11, 1, RED[1]);
  body.shade({ outline: OUT, keep: REDS });
  const turtle = icon(16, 16);
  turtle.rect(ox + 4, oy + 8, 2, 1, GOLD[1]).rect(ox + 9, oy + 8, 2, 1, GOLD[1]);           // 다리
  turtle.ellipse(ox + 7.5, oy + 6.2, 4, 2.7, GOLD[2]).ellipse(ox + 7.5, oy + 5.6, 2.7, 1.6, GOLD[3]); // 거북 등
  for (const [x, y] of [[6, 5], [9, 5], [7, 7], [9, 7], [5, 7]]) turtle.set(ox + x, oy + y, GOLD[1]); // 등 무늬
  turtle.rect(ox + 1, oy + 6, 3, 2, GOLD[2]);                                                  // 머리
  turtle.shade({ outline: OUT });
  turtle.set(ox + 1, oy + 6, GOLD[0]);                                                         // 눈
  const layers = [body, turtle];
  if (tassel) {
    const t = icon(16, 16);
    t.line(ox + 11, oy + 6, ox + 13, oy + 8, RED[2]).rect(ox + 13, oy + 9, 2, 1, GOLD[3]).rect(ox + 13, oy + 10, 2, 4, RED[1]);
    t.shade({ outline: OUT, keep: new Set([GOLD[3]]) });
    layers.push(t);
  }
  const out = icon(16, 16);
  for (const l of layers) l.px.forEach((r, y) => r.forEach((c, x) => { if (c) out.set(x, y, c); }));
  return out;
}
write("textures/rwm/items/orb.png", PNG.encode(drawSeal({ oy: 1 }).image()));

// 로고: 붉은 인장 자국 위에 금 옥새 (로비 게임 표지판 파티클, 1.5블록 크기)
const logo = icon(16, 16);
logo.rect(0, 0, 16, 16, RED[1]).rect(1, 1, 14, 14, RED[2]).rect(2, 2, 12, 12, RED[1]);
drawSeal({ ox: 1, oy: 0, tassel: false }).px.forEach((r, y) => r.forEach((c, x) => { if (c) logo.set(x, y, c); }));
write("textures/particle/orb_ambush.png", PNG.encode(logo.image()));

// ---------------- 3) rwm:rainbow → 오방색 ----------------
// 원본(baseline-rules)의 점 배치와 알파를 그대로 두고, 무지개 색상을 색상환 순서대로 오방색에 대응시킨다
const OBANG = ["#e0342b", "#f2c230", "#fff4d6", "#2f6fd6", "#f6d77a"]; // 적 · 황 · 백 · 청 · 금
const base = PNG.decode(execFileSync("git", ["show", "baseline-rules:resource_packs/rp0/textures/particle/rainbow.png"], { cwd: ROOT }));
const rb = PNG.blank(base.width, base.height);
for (let y = 0; y < base.height; y++) for (let x = 0; x < base.width; x++) {
  const [r, gg, b, a] = PNG.get(base, x, y);
  if (!a) continue;
  const mx = Math.max(r, gg, b), mn = Math.min(r, gg, b);
  let hue = 0;
  if (mx !== mn) hue = mx === r ? ((gg - b) / (mx - mn) + 6) % 6 : mx === gg ? (b - r) / (mx - mn) + 2 : (r - gg) / (mx - mn) + 4;
  const c = mx - mn < 30 ? OBANG[2] : OBANG[Math.floor(hue / 6 * OBANG.length) % OBANG.length];
  PNG.put(rb, x, y, c + a.toString(16).padStart(2, "0"));
}
write("textures/particle/rainbow.png", PNG.encode(rb));

// ---------------- 4) 복면 도적 ----------------
const enemyGeo = {
  format_version: "1.12.0",
  "minecraft:geometry": [{
    description: { identifier: "geometry.rwm.orb_enemy", texture_width: 64, texture_height: 64, visible_bounds_width: 2, visible_bounds_height: 3, visible_bounds_offset: [0, 1.5, 0] },
    bones: [
      { name: "body", pivot: [0, 24, 0], cubes: [{ origin: [-4, 12, -2], size: [8, 12, 4], uv: [16, 16] }] },
      { name: "bundle", parent: "body", pivot: [0, 20, 2], cubes: [{ origin: [-3, 15, 2], size: [6, 5, 2], uv: [16, 32] }] },
      { name: "head", parent: "body", pivot: [0, 24, 0], cubes: [{ origin: [-4, 24, -4], size: [8, 8, 8], uv: [0, 0] }] },
      { name: "hat", parent: "head", pivot: [0, 24, 0], cubes: [{ origin: [-4, 24, -4], size: [8, 8, 8], uv: [32, 0], inflate: 0.5 }] },
      { name: "tail", parent: "head", pivot: [0, 29, 4.5], rotation: [14, 0, 0], cubes: [{ origin: [-1, 24, 4.5], size: [2, 5, 1], uv: [56, 16] }] },
      { name: "rightarm", parent: "body", pivot: [-5, 22, 0], cubes: [{ origin: [-8, 12, -2], size: [4, 12, 4], uv: [40, 16] }] },
      { name: "rightItem", parent: "rightarm", pivot: [-6, 15, 1] },
      { name: "leftarm", parent: "body", pivot: [5, 22, 0], cubes: [{ origin: [4, 12, -2], size: [4, 12, 4], uv: [32, 48] }] },
      { name: "leftItem", parent: "leftarm", pivot: [6, 15, 1] },
      { name: "rightleg", parent: "body", pivot: [-1.9, 12, 0], cubes: [{ origin: [-3.9, 0, -2], size: [4, 12, 4], uv: [0, 16] }] },
      { name: "leftleg", parent: "body", pivot: [1.9, 12, 0], cubes: [{ origin: [-0.1, 0, -2], size: [4, 12, 4], uv: [16, 48] }] },
    ],
  }],
};
writeJson("models/entity/orb_enemy.geo.json", enemyGeo);
const skin = (0, eval)(fs.readFileSync(path.join(__dirname, "orb_enemy.js"), "utf8"));
const sk = PNG.blank(64, 64);
skin.forEach((c, i) => PNG.put(sk, i % 64, Math.floor(i / 64), c));
write("textures/rwm/entity/orb_enemy.png", PNG.encode(sk));

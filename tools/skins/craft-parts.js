// 자격루 복원전 부품 12개: 3D 모델(craft_part_N.geo.json) + 모델 텍스처(32×32) + 아이템 아이콘(16×16)을 함께 만든다.
//   node tools/skins/craft-parts.js
// 부품 번호와 역할은 조합법(behavior_packs .../craft/crafting_grid.mcfunction)을 따른다:
//   1~5는 장치 ①~⑤ 전용 대표 부품, 6~12는 여러 장치에 두루 쓰이는 공용 부품.
const fs = require("fs"), path = require("path");
const PNG = require("./png");
const { kit, icon, pick, lighten, darken } = require("./modelkit");

const ROOT = path.join(__dirname, "../..");
const RP = path.join(ROOT, "resource_packs/rp0");

// ---------- 재질 (모델 텍스처용) ----------
function materials(k) {
  const tone = pal => (x, y, w, h, n) => pick(pal, n());
  const grain = pal => (x, y, w, h, n) => pick(pal, (n(0, 0) * 0.35 + n(0, 99, 7) * 0.65 + (hashCol(x) * 0.5)) / 1.5);
  const hashCol = x => ((x * 7919) % 13) / 13;
  k.material("onggi", (x, y, w, h, n) => (y % 5 === 2 ? "#8a5230" : pick(["#5a321b", "#6e3f22", "#6e3f22", "#7a4526"], n())));
  k.material("onggi_rim", (x, y, w, h, n) => (y === 0 ? "#9a5f38" : "#8a5230"));
  k.material("water", (x, y, w, h, n) => (n() > 0.8 ? "#6b9fd2" : "#3f78b4"));
  k.material("bronze", tone(["#8f6a2a", "#b08a3a", "#b08a3a", "#c9a24e"]));
  k.material("bronze_light", (x, y, w, h, n) => (x === 0 || y === 0 ? "#e0bd62" : "#c9a24e"));
  k.material("bronze_green", (x, y, w, h, n) => (y % 6 === 1 ? "#3f6a52" : pick(["#4f7d62", "#5e8a6a", "#5e8a6a", "#7aa37a"], n())));
  k.material("bronze_dark", (x, y, w, h, n) => ((x === 1 || x === w - 2) && (y === 1 || y === h - 2) ? "#e0bd62" : pick(["#6b4c1c", "#7d5a22", "#8f6a2a"], n())));
  k.material("walnut", grain(["#4a3220", "#5a3d26", "#6b4a2e"]));
  k.material("wood_mid", grain(["#7a5234", "#8a6040", "#9a6e4a"]));
  k.material("pine", grain(["#c08c56", "#cf9c64", "#dcae78"]));
  k.material("scale_rod", (x, y, w, h, n) => (y % 2 === 0 && x === 0 ? "#3a2a1a" : "#dcae78"));
  k.material("stone", tone(["#8a8780", "#98958d", "#a8a59d"]));
  k.material("iron", tone(["#3e4148", "#4a4d55", "#5a5e67"]));
  k.material("trough_top", (x, y, w, h, n) => (Math.abs(y - (h - 1) / 2) < 0.8 ? "#4a3220" : pick(["#7a5234", "#8a6040"], n())));
  k.material("spoon_bowl", (x, y, w, h) => (x === 0 || y === 0 || x === w - 1 || y === h - 1 ? "#d6ac55" : "#8f6a2a"));
  k.material("ball", (x, y, w, h, n) => (x === 0 && y === 0 ? "#6a6e78" : pick(["#383a41", "#44474f", "#44474f", "#50545d"], n()))); // 면마다 밝은 칸이 창문처럼 보이지 않게 잔무늬만
  const robe = (pal, belt) => (x, y, w, h, n) => (belt && y === h - 1 ? belt : pick(pal, n()));
  k.material("red_robe", robe(["#9e2226", "#b3262c", "#c73a36"]));
  k.material("red_robe_belt", robe(["#9e2226", "#b3262c", "#c73a36"], "#e0b040")); // 허리띠는 윗도리 아랫단 한 줄만
  k.material("teal_robe", robe(["#1f5a58", "#2a6e6a", "#3a8480"]));
  k.material("teal_robe_belt", robe(["#1f5a58", "#2a6e6a", "#3a8480"], "#d9c27a"));
  k.material("skin", () => "#e0ad86");
  k.material("face", (x, y, w, h) => (y === 1 && (x === 0 || x === w - 1) ? "#2a1d14" : "#e0ad86"));
  k.material("mouse", () => "#9a9aa0");
  k.material("mouse_face", (x, y, w, h) => (y === 1 && (x === 0 || x === w - 1) ? "#1a1a1f" : y === 2 && x === Math.floor(w / 2) ? "#e38a9a" : "#9a9aa0"));
  k.material("black", () => "#1a1a1f");
  k.material("hanji", () => "#efe6cf");
  k.material("sipae", (x, y, w, h) => (x === 0 || x === w - 1 || y === 0 || y === h - 1 ? "#b98a4a" : (x === 1 && y >= 1 && y <= h - 2) || (y === 2 && x >= 1) ? "#1a1a1f" : "#efe6cf"));
}

// ---------- 부품 모델 ----------
// 모든 부품은 root → craft_part_N 뼈대 아래에 둔다 (animation.craft_part.bob이 root를 움직인다). 바닥 y=0, 앞면은 -z(north).
const PARTS = [
  { n: 1, name: "물항아리(파수호)", build(m, B) {
    m.cube(B, [-4, 0, -4], [8, 7, 8], "onggi");
    m.cube(B, [-5, 1, -3], [10, 5, 6], "onggi");
    m.cube(B, [-3, 1, -5], [6, 5, 10], "onggi");
    m.cube(B, [-3, 7, -3], [6, 1, 6], "onggi");
    m.cube(B, [-2, 8, -2], [4, 2, 4], "onggi");
    m.cube(B, [-3, 10, -3], [6, 1, 6], { all: "onggi_rim", up: "water" });
    m.cube(B, [-0.5, 2, -7], [1, 1, 3], "bronze");
  } },
  { n: 2, name: "물받이 통(수수호)", build(m, B) {
    m.cube(B, [-3, 0, -2], [6, 11, 4], "bronze_green");
    m.cube(B, [-2, 0, -3], [4, 11, 6], "bronze_green");
    m.cube(B, [-3.5, 10, -2.5], [7, 1, 5], { all: "bronze", up: "water" });
    m.cube(B, [-0.5, 11, -0.5], [1, 7, 1], "scale_rod");
  } },
  { n: 3, name: "숟가락 장치", build(m, B) {
    m.cube(B, [-4, 0, -2], [8, 2, 4], "walnut");
    m.cube(B, [-0.5, 2, -0.5], [1, 3, 1], "bronze");
    m.bone("spoon", { parent: B, pivot: [0, 5, 0], rotation: [0, 0, -14] });
    m.cube("spoon", [-5, 4.5, -0.5], [7, 1, 1], "bronze");
    m.cube("spoon", [2, 4.5, -1.5], [3, 1, 3], { all: "bronze_light", up: "spoon_bowl" });
  } },
  { n: 4, name: "시보 인형", build(m, B) {
    m.cube(B, [-2.5, 0, -1.5], [5, 3, 3], "red_robe");
    m.cube(B, [-2, 3, -1.5], [4, 4, 3], { all: "red_robe_belt", up: "red_robe", down: "red_robe" });
    m.cube(B, [-1.5, 7, -1.5], [3, 3, 3], { all: "skin", north: "face" });
    m.cube(B, [-2, 10, -2], [4, 1, 4], "black");
    m.cube(B, [-1, 11, -1], [2, 1, 2], "black");
    m.cube(B, [2, 4, -0.5], [1, 3, 1], "red_robe");
    m.cube(B, [2, 6, -0.5], [1, 4, 1], "wood_mid");
    m.cube(B, [1.5, 9.5, -1], [2, 2, 2], "walnut");
    m.cube(B, [-5, 3, -1], [2, 3, 2], "bronze");
  } },
  { n: 5, name: "십이지신 인형", build(m, B) {
    m.cube(B, [-2.5, 0, -1.5], [5, 3, 3], "teal_robe");
    m.cube(B, [-2, 3, -1.5], [4, 4, 3], { all: "teal_robe_belt", up: "teal_robe", down: "teal_robe" });
    m.cube(B, [-1.5, 7, -1.5], [3, 3, 3], { all: "mouse", north: "mouse_face" });
    m.cube(B, [-1.5, 10, -0.5], [1, 1, 1], "mouse");
    m.cube(B, [0.5, 10, -0.5], [1, 1, 1], "mouse");
    m.cube(B, [-1.5, 2, -2.5], [3, 4, 1], { all: "hanji", north: "sipae" });
  } },
  { n: 6, name: "청동 이음쇠", build(m, B) {
    m.cube(B, [-4, 0, -2], [8, 1, 4], "bronze_dark");
    m.cube(B, [-4, 1, -2], [1, 6, 4], "bronze_dark");
    m.bone("brace", { parent: B, pivot: [-3, 1, 0], rotation: [0, 0, -45] });
    m.cube("brace", [-3, 1, -0.5], [5, 1, 1], "bronze");
  } },
  { n: 7, name: "구슬 통로", build(m, B) {
    m.bone("trough", { parent: B, pivot: [0, 1, 0], rotation: [0, 0, 8] });
    m.cube("trough", [-6, 1, -2], [12, 1, 4], { all: "wood_mid", up: "trough_top" });
    m.cube("trough", [-6, 2, -2], [12, 2, 1], "wood_mid");
    m.cube("trough", [-6, 2, 1], [12, 2, 1], "wood_mid");
    m.cube(B, [-5, 0, -1.5], [2, 1, 3], "walnut");
    m.cube(B, [3, 0, -1.5], [2, 2, 3], "walnut");
    m.cube("trough", [-4.5, 2, -1], [2, 2, 2], "ball");
  } },
  { n: 8, name: "나무 받침틀", build(m, B) {
    m.cube(B, [-5, 9, -1], [10, 1, 2], "pine");
    m.cube(B, [-5, 1, -1], [10, 1, 2], "pine");
    m.cube(B, [-5, 2, -1], [1, 7, 2], "pine");
    m.cube(B, [4, 2, -1], [1, 7, 2], "pine");
    m.cube(B, [-6, 0, -2], [3, 1, 4], "walnut");
    m.cube(B, [3, 0, -2], [3, 1, 4], "walnut");
    m.bone("brace8", { parent: B, pivot: [0, 5.5, 0], rotation: [0, 0, 45] });
    m.cube("brace8", [-5, 5, -0.5], [10, 1, 1], "wood_mid");
  } },
  { n: 9, name: "지렛대", build(m, B) {
    m.cube(B, [-1.5, 0, -1.5], [3, 2, 3], "stone");
    m.cube(B, [-1, 2, -1], [2, 1, 2], "stone");
    m.bone("lever", { parent: B, pivot: [0, 3, 0], rotation: [0, 0, -12] });
    m.cube("lever", [-7, 3, -1], [13, 1, 2], "walnut");
    m.cube("lever", [6, 3, -1], [1.5, 1, 2], "iron");
  } },
  { n: 10, name: "굴대(회전축)", build(m, B) {
    m.cube(B, [-6, 3, -1], [12, 2, 2], "iron");
    m.cube(B, [-1.5, 0.5, -3], [3, 7, 6], "walnut");
    m.cube(B, [-1.5, 1.5, -4], [3, 5, 8], "walnut");
    m.cube(B, [-2, 3, -1], [4, 2, 2], "bronze");
    m.cube(B, [-6.5, 0, -1], [2, 3, 2], "stone");
    m.cube(B, [4.5, 0, -1], [2, 3, 2], "stone");
  } },
  { n: 11, name: "작은 쇠구슬", build(m, B) {
    m.cube(B, [-4, 0, -2.5], [3, 3, 3], "ball");
    m.cube(B, [1, 0, -2.5], [3, 3, 3], "ball");
    m.cube(B, [-1.5, 0, 0.5], [3, 3, 3], "ball");
    m.cube(B, [-1.5, 3, -1], [3, 3, 3], "ball");
  } },
  { n: 12, name: "큰 쇠구슬", build(m, B) {
    m.cube(B, [-3.5, 1, -2.5], [7, 5, 5], "ball");
    m.cube(B, [-2.5, 1, -3.5], [5, 5, 7], "ball");
    m.cube(B, [-2.5, 0, -2.5], [5, 7, 5], "ball");
  } },
];

// ---------- 아이콘 (16×16) ----------
const ICONS = {
  1: i => i.ellipse(8, 9.5, 6, 5, "#7a4526").line(3, 8, 13, 8, "#8f5634").rect(5, 4, 6, 1, "#6e3f22").rect(4, 2, 8, 2, "#8a5230").rect(5, 2, 6, 1, "#4f86c0").rect(13, 10, 2, 1, "#c9a24e"),
  2: i => i.rect(4, 5, 8, 10, "#5e8a6a").rect(4, 7, 8, 1, "#3f6a52").rect(4, 12, 8, 1, "#3f6a52").rect(5, 5, 6, 1, "#3f78b4").rect(7, 0, 2, 5, "#dcae78").set(7, 1, "#3a2a1a").set(7, 3, "#3a2a1a"),
  3: i => i.rect(2, 12, 12, 3, "#5a3d26").rect(7, 8, 2, 4, "#b08a3a").line(1, 10, 9, 6, "#c9a24e", 1).ellipse(11.5, 5, 3.6, 2.8, "#d6ac55").ellipse(11.5, 4.6, 2, 1.3, "#8f6a2a"),
  4: i => i.rect(4, 12, 8, 3, "#b3262c").rect(5, 8, 6, 4, "#b3262c").rect(5, 10, 6, 1, "#e0b040").rect(6, 4, 4, 4, "#e0ad86").set(6, 5, "#2a1d14").set(9, 5, "#2a1d14").rect(5, 3, 6, 1, "#1a1a1f").rect(6, 2, 4, 1, "#1a1a1f")
    .line(11, 9, 13, 5, "#8a6040").rect(12, 2, 3, 3, "#6b4a2e").ellipse(2.5, 10.5, 1.8, 2.2, "#c9a24e"),
  5: i => i.rect(4, 12, 8, 3, "#2a6e6a").rect(5, 8, 6, 4, "#2a6e6a").rect(6, 4, 4, 4, "#9a9aa0").set(6, 3, "#9a9aa0").set(9, 3, "#9a9aa0").set(6, 5, "#1a1a1f").set(9, 5, "#1a1a1f").set(7, 6, "#e38a9a").set(8, 6, "#e38a9a")
    .rect(3, 9, 5, 6, "#efe6cf").rect(4, 10, 1, 4, "#1a1a1f").rect(4, 11, 3, 1, "#1a1a1f"),
  6: i => i.rect(3, 2, 3, 12, "#8f6a2a").rect(3, 11, 11, 3, "#8f6a2a").line(6, 9, 9, 12, "#7d5a22", 2).set(4, 4, "#f0cd70").set(4, 8, "#f0cd70").set(8, 12, "#f0cd70").set(12, 12, "#f0cd70"),
  7: i => i.line(1, 7, 14, 12, "#8a6040", 4).line(1, 6, 14, 11, "#4a3220", 1).ellipse(4.5, 5.5, 2, 2, "#4a4d55").set(4, 5, "#9aa0aa"),
  8: i => i.rect(2, 2, 12, 2, "#cf9c64").rect(2, 12, 12, 2, "#cf9c64").rect(2, 2, 2, 12, "#cf9c64").rect(12, 2, 2, 12, "#cf9c64").line(4, 11, 11, 4, "#a8743f", 1),
  9: i => i.rect(6, 12, 4, 3, "#98958d").rect(7, 10, 2, 2, "#98958d").line(1, 12, 13, 6, "#5a3d26", 2).rect(13, 4, 2, 3, "#4a4d55"),
  10: i => i.line(1, 8, 14, 8, "#4a4d55", 2).ellipse(8, 8, 3.6, 5.5, "#6b4a2e").line(8, 3, 8, 13, "#4a3220").line(5, 8, 11, 8, "#4a3220").set(8, 8, "#e0b040"),
  11: i => i.ellipse(4.5, 11, 3, 3, "#4a4d55").ellipse(11.5, 11, 3, 3, "#4a4d55").ellipse(8, 5.5, 3, 3, "#4a4d55").set(3, 10, "#9aa0aa").set(10, 10, "#9aa0aa").set(7, 4, "#9aa0aa"),
  12: i => i.ellipse(8, 8.5, 6.5, 6.5, "#4a4d55").ellipse(6, 6, 2, 1.6, "#7d838d").set(5, 5, "#c9ced6"),
};
const KEEP = new Set(["#3a2a1a", "#1a1a1f", "#2a1d14", "#f0cd70", "#9aa0aa", "#c9ced6", "#e38a9a", "#4a3220", "#e0b040", "#3f78b4", "#4f86c0"]);

function build() {
  const out = [];
  for (const p of PARTS) {
    const geoFile = path.join(RP, `models/entity/craft_part_${p.n}.geo.json`);
    const old = JSON.parse(fs.readFileSync(geoFile, "utf8"))["minecraft:geometry"][0].description;
    const { identifier, texture_width, texture_height, ...keep } = old; // 보이는 범위 등은 원래 값 유지
    const k = kit({ width: 32, height: 32, maxRegion: 12 });
    materials(k);
    const m = k.model(`geometry.craft_part_${p.n}`, keep);
    const B = `craft_part_${p.n}`;
    m.bone("root", { pivot: [0, 0, 0] }).bone(B, { parent: "root" });
    p.build(m, B);
    fs.writeFileSync(geoFile, JSON.stringify(m.json(), null, "\t") + "\n");
    fs.writeFileSync(path.join(RP, `textures/rwm/entity/craft_part_${p.n}.png`), PNG.encode(k.img));
    const ic = icon(16, 16); ICONS[p.n](ic); ic.shade({ keep: KEEP });
    fs.writeFileSync(path.join(RP, `textures/rwm/items/craft_part_${p.n}.png`), PNG.encode(ic.image()));
    out.push(`${p.n} ${p.name}: 텍스처 ${k.used().rows}/32줄`);
  }
  console.log(out.join("\n"));
}
if (require.main === module) build();
module.exports = { PARTS, ICONS, materials };

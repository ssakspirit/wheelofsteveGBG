// 자격루 복원전 설계판(craft_board_1~5, blank) + 설계도(아이템 아이콘·바닥에 놓인 모습).
//   node tools/skins/craft-boards.js
// 설계판의 3×3 조합 격자는 조합법(crafting_grid.mcfunction)과 새 부품 아이콘으로 자동으로 합성한다.
// 장치 그림은 tools/skins/renders/device_N.png(수리된 장치를 개발자 페이지 3D로 렌더링한 128×128)를 쓴다.
// 설계판 모델(craft_board.geo.json)이 쓰는 텍스처 영역: 판 앞면 (0,0) 112×80 · 옆면 (112,0) 4×80 ·
//   격자 (191,0) 65×65 · 장치 그림 (0,128) 128×128 · 수리 부품 아이콘 (240,240) 16×16 · 핀 (123..128, 0..16)
const fs = require("fs"), path = require("path");
const PNG = require("./png");
const { hash, pick } = require("./modelkit");

const ROOT = path.join(__dirname, "../..");
const RP = path.join(ROOT, "resource_packs/rp0");
const TEX = path.join(RP, "textures/rwm");
const read = f => PNG.decode(fs.readFileSync(f));

// 조합법: 칸 r1..r9(왼쪽 위부터 가로로)에 놓을 부품 번호 (0 = 빈칸)
function recipes() {
  const s = fs.readFileSync(path.join(ROOT, "behavior_packs/bp0/functions/utility/games/craft/crafting_grid.mcfunction"), "utf8");
  const R = {};
  for (const m of s.matchAll(/tag=board_(\d),x=-13[^\n]*?tag=r(\d),tag=part_(\w+)/g)) (R[m[1]] ??= Array(9).fill(0))[m[2] - 1] = m[3] === "null" ? 0 : +m[3];
  return R;
}

const PAPER = "#efe6cf", PAPER_D = "#e2d5b4", GRIDLINE = "#e6dbbe", INK = "#2a1d14", WASH = "#cdbf9c";
const WOOD = ["#5a3d26", "#6b4a2e", "#7a5636"], GOLD = "#e0ad33", SEAL = "#c0392b";
const fill = (img, x, y, w, h, f) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) PNG.put(img, x + i, y + j, f(i, j, w, h)); };

// 3×5 숫자 (도장 안 번호)
const DIGITS = { 1: ["010", "110", "010", "010", "111"], 2: ["111", "001", "111", "100", "111"], 3: ["111", "001", "111", "001", "111"], 4: ["101", "101", "111", "001", "001"], 5: ["111", "100", "111", "001", "111"] };
function seal(img, x, y, n) { // 5×7 붉은 도장에 흰 숫자
  fill(img, x, y, 5, 7, () => SEAL);
  if (n) DIGITS[n].forEach((r, j) => [...r].forEach((c, i) => { if (c === "1") PNG.put(img, x + 1 + i, y + 1 + j, "#f7e7c4"); }));
}
function arrow(img, pts, color = INK) { // 꺾은선 + 끝 화살촉
  for (let k = 0; k < pts.length - 1; k++) {
    const [x0, y0] = pts[k], [x1, y1] = pts[k + 1], n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
    for (let i = 0; i <= n; i++) PNG.put(img, Math.round(x0 + (x1 - x0) * i / n), Math.round(y0 + (y1 - y0) * i / n), color);
  }
  const [xa, ya] = pts[pts.length - 2], [xb, yb] = pts[pts.length - 1], dx = Math.sign(xb - xa), dy = Math.sign(yb - ya);
  for (const s of [1, 2]) { PNG.put(img, xb - dx * s + dy * s, yb - dy * s + dx * s, color); PNG.put(img, xb - dx * s - dy * s, yb - dy * s - dx * s, color); }
}
// 장치 렌더를 작게 줄여 먹 그림으로: 가장자리는 먹선, 안은 밝기에 따라 먹 농담 세 단계
function silhouette(render, w, h) {
  const cov = Array.from({ length: h }, () => new Array(w).fill(0)), lum = Array.from({ length: h }, () => new Array(w).fill(0));
  let minX = 128, minY = 128, maxX = 0, maxY = 0;
  for (let y = 0; y < render.height; y++) for (let x = 0; x < render.width; x++) if (PNG.get(render, x, y)[3] > 40) { minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y); }
  const s = Math.max((maxX - minX + 1) / w, (maxY - minY + 1) / h), ox = (w - (maxX - minX + 1) / s) / 2, oy = (h - (maxY - minY + 1) / s) / 2;
  for (let y = minY; y <= maxY; y++) for (let x = minX; x <= maxX; x++) {
    const [r, g, b, a] = PNG.get(render, x, y);
    if (a <= 40) continue;
    const X = Math.floor((x - minX) / s + ox), Y = Math.floor((y - minY) / s + oy);
    if (X >= 0 && Y >= 0 && X < w && Y < h) { cov[Y][X]++; lum[Y][X] += (0.3 * r + 0.59 * g + 0.11 * b) / 255; }
  }
  const on = (x, y) => x >= 0 && y >= 0 && x < w && y < h && cov[y][x] >= s * s * 0.35;
  return (x, y) => {
    if (!on(x, y)) return null;
    if (!on(x - 1, y) || !on(x + 1, y) || !on(x, y - 1) || !on(x, y + 1)) return INK;
    const l = lum[y][x] / cov[y][x];
    return l < 0.3 ? "#4a3a26" : l < 0.5 ? "#8a7a5a" : WASH;
  };
}

// ---------- 설계도 두루마리 (한지 + 먹 윤곽 + 번호 도장, 양쪽 나무 축) ----------
function scroll(img, ox, oy, n, render) {
  fill(img, ox, oy, 4, 24, (i, j) => (j === 0 || j === 23 ? GOLD : i === 0 ? WOOD[2] : i === 3 ? WOOD[0] : WOOD[1]));
  fill(img, ox + 22, oy, 4, 24, (i, j) => (j === 0 || j === 23 ? GOLD : i === 0 ? WOOD[2] : i === 3 ? WOOD[0] : WOOD[1]));
  const sil = render ? silhouette(render, 16, 16) : () => null;
  fill(img, ox + 4, oy + 2, 18, 20, (i, j) => (j === 19 ? PAPER_D : sil(i - 1, j - 1) || PAPER));
  if (n) seal(img, ox + 16, oy + 13, n);
}

function build() {
  const R = recipes();
  const icons = {}; for (let p = 1; p <= 12; p++) icons[p] = read(path.join(TEX, `items/craft_part_${p}.png`));
  const renders = {}; for (let n = 1; n <= 5; n++) renders[n] = read(path.join(__dirname, `renders/device_${n}.png`));

  for (const n of [1, 2, 3, 4, 5, "blank"]) {
    const file = path.join(TEX, `entity/craft_board_${n}.png`);
    const img = read(file); // 핀 등 다시 그리지 않는 부분은 그대로 둔다
    // 판 앞면: 나무 테두리 + 모눈 한지 + 먹 화살표 + 도장
    fill(img, 0, 0, 112, 80, (x, y) => {
      const edge = Math.min(x, y, 111 - x, 79 - y);
      if (edge < 4) return edge === 0 ? WOOD[0] : edge === 3 ? WOOD[2] : pick(WOOD, hash(x, y));
      return x % 8 === 0 || y % 8 === 0 ? GRIDLINE : PAPER;
    });
    fill(img, 112, 0, 4, 80, (x, y) => pick(WOOD, hash(x + 112, y)));
    arrow(img, [[17, 35], [17, 48], [29, 48]]);
    arrow(img, [[82, 40], [95, 40], [95, 52]]);
    seal(img, 97, 8, n === "blank" ? null : n);
    // 조합 격자 65×65: 먹선 3×3 칸, 칸 안에 부품 아이콘
    const G = 191, lines = [0, 1, 21, 22, 42, 43, 63, 64], cells = [2, 23, 44];
    fill(img, G, 0, 65, 65, (x, y) => (lines.includes(x) || lines.includes(y) ? INK : "#f5ecd6"));
    if (n !== "blank") R[n].forEach((p, k) => { if (p) PNG.paste(img, icons[p], G + cells[k % 3] + 1, cells[Math.floor(k / 3)] + 1); });
    // 장치 그림 128×128: 한지 바탕 + 렌더 + 먹 테두리
    fill(img, 0, 128, 128, 128, (x, y) => (x < 3 || y < 3 || x > 124 || y > 124 ? (x < 1 || y < 1 || x > 126 || y > 126 ? WOOD[0] : INK) : PAPER));
    if (n !== "blank") {
      const r = renders[n];
      for (let y = 0; y < 128; y++) for (let x = 0; x < 128; x++) {
        const [cr, cg, cb, ca] = PNG.get(r, x, y);
        if (ca === 0 || x < 3 || y < 3 || x > 124 || y > 124) continue;
        const [pr, pg, pb] = [239, 230, 207], a = ca / 255, i = ((128 + y) * img.width + x) * 4;
        img.data.set([pr + (cr - pr) * a, pg + (cg - pg) * a, pb + (cb - pb) * a, 255].map(Math.round), i);
      }
    }
    // 수리 부품 아이콘 16×16 (오른쪽 아래 붉은 테 안)
    fill(img, 240, 240, 16, 16, (x, y) => (x === 0 || y === 0 || x === 15 || y === 15 ? SEAL : PAPER));
    if (n !== "blank") PNG.paste(img, read(path.join(TEX, `items/craft_contraption_fixed_${n}.png`)), 240, 240);
    fs.writeFileSync(file, PNG.encode(img));
  }

  for (let n = 1; n <= 5; n++) {
    const ent = PNG.blank(32, 32); scroll(ent, 0, 0, n, renders[n]);   // 바닥에 놓인 설계도(엔티티): 종이 (4,2) 18×20, 축 (0,0)·(22,0) 4×24
    fs.writeFileSync(path.join(TEX, `entity/craft_diagram_${n}.png`), PNG.encode(ent));
    const item = PNG.blank(32, 32); scroll(item, 3, 4, n, renders[n]); // 아이템 아이콘은 가운데로
    fs.writeFileSync(path.join(TEX, `items/craft_diagram_${n}.png`), PNG.encode(item));
  }
  console.log("설계판 6장, 설계도 5개(아이템·엔티티) 생성. 조합법:", JSON.stringify(R));
}
if (require.main === module) build();

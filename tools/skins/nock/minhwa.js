// 태조의 활쏘기 대회: 활쏘기장 동물 모형(rwm:nock_prop)을 민화 속 동물로 — 공통 도구.
// 각 동물 파일(tools/skins/nock/<key>.js)은 { key, geo, tex, size, build(K, P) }를 내보낸다.
//   key  : nock_prop의 텍스처/모델 키 (wolf, polarbear ...). 번호(rwm:skin)와 배치는 BP라 그대로다.
//   geo  : 모델 식별자 (geometry.target_<..>) — 애니메이션(animation.target_<..>)이 움직이는 뼈대 이름을 반드시 남긴다.
//   tex  : 텍스처 파일 이름(textures/rwm/entity/target_mobs/<tex>.png). 같은 모델에 색만 다른 텍스처가 여럿이면 variants.
//   build(K, P): modelkit의 kit K에 재질을 등록하고 K.model(...)로 뼈대·큐브를 쌓아 돌려준다. P는 색 묶음(variants).
// 민화풍: 오방색 위주의 평평한 채색, 면 가장자리에 먹선, 크고 둥근 눈.
const { kit, mix, lighten, darken } = require("../modelkit");
const PNG = require("../png");

const INK = "#2a1d14";
const C = {
  ink: INK, red: "#c8372d", vermil: "#d9542b", orange: "#e08a2c", yellow: "#f0c447", gold: "#d9a43a",
  green: "#4f8a3c", leaf: "#6fa04a", blue: "#2f5f9e", sky: "#7fa7c9", white: "#f4ecd8", snow: "#fbf7ec",
  black: "#2b2b2e", brown: "#8a5a33", tan: "#c9935a", pink: "#e9a3a0", grey: "#9a948a",
};

// 평평한 칠. opts: line(면 가장자리 먹선 색 — 기본은 없음: 블록 모서리마다 두 면의 선이 겹쳐 굵은 테가 되므로
//   선은 눈·무늬처럼 그림 안에만 그린다), noise(얼룩 정도), edge(테두리 두께)
function flat(base, { line = false, noise = 0.06, edge = 1, min = 5 } = {}) {
  return (x, y, w, h, n) => {
    if (line && w >= min && h >= min && (x < edge || y < edge || x >= w - edge || y >= h - edge)) return line;
    const r = n();
    return r < noise ? darken(base, 0.08) : r > 1 - noise / 2 ? lighten(base, 0.08) : base;
  };
}
// 줄무늬(호랑이 등): 가로(axis 'x') 또는 세로 줄. every 간격, width 두께
function stripes(base, stripe, { every = 4, width = 1, axis = "x", line = false, wave = false, min } = {}) {
  const f = flat(base, { line, min });
  return (x, y, w, h, n) => {
    const c = f(x, y, w, h, n);
    if (c === line) return c;
    const t = axis === "x" ? x + (wave ? Math.round(Math.sin(y * 0.9) * 0.6) : 0) : y + (wave ? Math.round(Math.sin(x * 0.9) * 0.6) : 0);
    return ((t % every) + every) % every < width ? stripe : c;
  };
}
// 점무늬(꽃사슴 · 표범 등)
function spots(base, spot, { density = 0.12, line = false } = {}) {
  const f = flat(base, { line });
  return (x, y, w, h, n) => { const c = f(x, y, w, h, n); return c === line ? c : (n(7, 3, 9) < density && (x + y) % 2 === 0 ? spot : c); };
}
// 글자 그림(art): rows의 글자를 key의 색으로. 크기가 다르면 가운데에 맞춘다. bg: 남는 칸 칠
function art(rows, key, bg) {
  const H = rows.length, W = rows[0].length;
  return (x, y, w, h, n) => {
    const ox = Math.floor((w - W) / 2), oy = Math.floor((h - H) / 2), r = rows[y - oy], ch = r && r[x - ox];
    if (ch !== undefined && ch in key) return key[ch];
    return typeof bg === "function" ? bg(x, y, w, h, n) : bg ?? null;
  };
}
// 재질 등록을 짧게: K.material(name, painter, { max: 64 }) — 동물 텍스처는 면을 1:1로 칠한다
function mats(K, table) { for (const [name, p] of Object.entries(table)) K.material(name, p, { max: 64 }); }

// 한 동물(또는 같은 모델의 색 변형들)을 만든다 → [{ tex, geo(JSON), png(Buffer) }]
function make(spec) {
  const variants = spec.variants || { [spec.tex]: spec.palette || {} };
  const out = [];
  for (const [tex, P] of Object.entries(variants)) {
    const K = kit({ width: spec.size[0], height: spec.size[1], maxRegion: 64 });
    const model = spec.build(K, P);
    out.push({ tex, geo: model.json(), png: PNG.encode(K.img), used: K.used() });
  }
  return out;
}

module.exports = { C, INK, flat, stripes, spots, art, mats, make, mix, lighten, darken };

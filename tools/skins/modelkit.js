// 모델·텍스처를 코드로 만드는 도구.
//  - kit(): 텍스처 한 장(아틀라스)과 재질. 면마다 크기에 맞는 영역을 자동으로 잡고(같은 재질·크기는 공유) 재질 함수로 칠한다.
//  - kit.model(): 뼈대·큐브를 쌓아 Bedrock geometry(1.21, 면별 UV) JSON을 만든다.
//  - icon(): 16×16 같은 픽셀 아이콘을 도형으로 그리고, 밝은 쪽/그늘/외곽선을 자동으로 넣는다.
const PNG = require("./png");

const hex = n => "#" + n.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
const rgb = c => { const n = parseInt(c.slice(1, 7), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
const mix = (a, b, t) => hex(rgb(a).map((v, i) => v + (rgb(b)[i] - v) * t));
const lighten = (c, t) => mix(c, "#ffffff", t), darken = (c, t) => mix(c, "#000000", t);
function hash(x, y, s = 0) { let h = (x * 374761393 + y * 668265263 + s * 2246822519) ^ 0x5bd1e995; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
const pick = (pal, n) => pal[Math.min(pal.length - 1, Math.floor(n * pal.length))];

// ---------------- 아틀라스 + 재질 ----------------
function kit({ width, height, maxRegion = 32, pad = 0 }) {
  const img = PNG.blank(width, height), mats = {}, cache = new Map();
  let sx = 0, sy = 0, rowH = 0; // 선반 방식으로 빈 곳을 채운다
  function alloc(w, h) {
    if (sx + w > width) { sx = 0; sy += rowH + pad; rowH = 0; }
    if (sy + h > height) throw new Error(`텍스처 ${width}×${height}에 ${w}×${h} 영역을 더 넣을 자리가 없음`);
    const at = [sx, sy]; sx += w + pad; rowH = Math.max(rowH, h); return at;
  }
  // 재질: (x, y, w, h, n) => '#rrggbb' | null.  n(dx,dy,s)는 재질마다 고정된 무늬 난수
  //   max: 이 재질의 영역 최대 크기(큰 면은 늘려 씀). 무늬 없는 재질은 작게, 그림이 있는 재질은 크게
  const maxOf = {};
  function material(name, painter, { max } = {}) { mats[name] = painter; if (max) maxOf[name] = max; return name; }
  function region(name, fw, fh) {
    const mr = maxOf[name] ?? maxRegion;
    const w = Math.max(1, Math.min(mr, Math.round(fw))), h = Math.max(1, Math.min(mr, Math.round(fh)));
    const key = name + "|" + w + "|" + h;
    if (cache.has(key)) return cache.get(key);
    const paint = mats[name];
    if (!paint) throw new Error("없는 재질: " + name);
    const [u, v] = alloc(w, h), seed = [...name].reduce((a, c) => a * 31 + c.charCodeAt(0), 7) >>> 0;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) PNG.put(img, u + x, v + y, paint(x, y, w, h, (dx = 0, dy = 0, s = 0) => hash(x + dx, y + dy, seed + s)));
    const r = { uv: [u, v], uv_size: [w, h] };
    cache.set(key, r); return r;
  }
  // shift: 모든 큐브·축을 이만큼 옮긴다 (배치만 바꿀 때 좌표를 하나하나 고치지 않도록)
  function model(identifier, description = {}, { shift = [0, 0, 0] } = {}) {
    const bones = [], mv = p => p.map((v, i) => Math.round((v + shift[i]) * 1000) / 1000);
    const api = {
      bone(name, { parent = null, pivot = [0, 0, 0], rotation = null } = {}) {
        bones.push({ name, ...(parent ? { parent } : {}), pivot: mv(pivot), ...(rotation ? { rotation } : {}), cubes: [] });
        return api;
      },
      // mats: '재질' (모든 면) 또는 { all, north, south, east, west, up, down } — 'none'은 그 면을 뺀다
      cube(bone, origin, size, mats, { rotation = null, pivot = null, inflate = 0 } = {}) {
        const b = bones.find(x => x.name === bone);
        if (!b) throw new Error("없는 뼈대: " + bone);
        const M = typeof mats === "string" ? { all: mats } : mats;
        const dims = { north: [size[0], size[1]], south: [size[0], size[1]], east: [size[2], size[1]], west: [size[2], size[1]], up: [size[0], size[2]], down: [size[0], size[2]] };
        const uv = {};
        for (const f of Object.keys(dims)) {
          const m = M[f] ?? M.all;
          if (!m || m === "none") continue;
          if (dims[f][0] <= 0 || dims[f][1] <= 0) continue;
          uv[f] = region(m, dims[f][0], dims[f][1]);
        }
        const c = { origin: mv(origin), size, uv };
        if (inflate) c.inflate = inflate;
        if (rotation) { c.pivot = mv(pivot || origin); c.rotation = rotation; }
        b.cubes.push(c);
        return api;
      },
      json() {
        return {
          format_version: "1.21.0",
          "minecraft:geometry": [{
            description: { identifier, texture_width: width, texture_height: height, ...description },
            bones: bones.map(b => (b.cubes.length ? b : (({ cubes, ...rest }) => rest)(b))),
          }],
        };
      },
    };
    return api;
  }
  return { img, material, model, region, used: () => ({ rows: sy + rowH, width, height }) };
}

// ---------------- 픽셀 아이콘 ----------------
// 도형을 칠한 뒤 shade()로 입체감(왼쪽 위 밝게, 오른쪽 아래 어둡게)과 외곽선을 넣는다.
function icon(w = 16, h = 16) {
  const px = Array.from({ length: h }, () => new Array(w).fill(null));
  const inb = (x, y) => x >= 0 && y >= 0 && x < w && y < h;
  const api = {
    px,
    set(x, y, c) { if (inb(x, y)) px[y][x] = c; return api; },
    rect(x, y, rw, rh, c) { for (let j = 0; j < rh; j++) for (let i = 0; i < rw; i++) api.set(x + i, y + j, c); return api; },
    ellipse(cx, cy, rx, ry, c) { for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const dx = (x + 0.5 - cx) / rx, dy = (y + 0.5 - cy) / ry; if (dx * dx + dy * dy <= 1) api.set(x, y, c); } return api; },
    line(x0, y0, x1, y1, c, t = 1) {
      const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
      for (let i = 0; i <= n; i++) { const x = Math.round(x0 + (x1 - x0) * i / n), y = Math.round(y0 + (y1 - y0) * i / n); api.rect(x - Math.floor((t - 1) / 2), y - Math.floor((t - 1) / 2), t, t, c); }
      return api;
    },
    art(rows, key, ox = 0, oy = 0) { rows.forEach((r, y) => [...r].forEach((ch, x) => { if (key[ch] !== undefined) api.set(ox + x, oy + y, key[ch]); })); return api; },
    // light: 왼쪽 위 가장자리 밝게 / 오른쪽 아래 가장자리 어둡게, outline: 바깥 테두리 색
    shade({ light = 0.22, dark = 0.28, outline = "#24180f", keep = new Set() } = {}) {
      const src = px.map(r => r.slice());
      const filled = (x, y) => inb(x, y) && src[y][x] != null;
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const c = src[y][x];
        if (c == null || keep.has(c)) continue;
        if (!filled(x - 1, y) || !filled(x, y - 1)) px[y][x] = lighten(c, light);
        else if (!filled(x + 1, y) || !filled(x, y + 1)) px[y][x] = darken(c, dark);
      }
      if (outline) for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        if (src[y][x] != null) continue;
        if (filled(x - 1, y) || filled(x + 1, y) || filled(x, y - 1) || filled(x, y + 1)) px[y][x] = outline;
      }
      return api;
    },
    image() { const img = PNG.blank(w, h); px.forEach((r, y) => r.forEach((c, x) => PNG.put(img, x, y, c))); return img; },
  };
  return api;
}

module.exports = { kit, icon, hash, pick, mix, lighten, darken, hex, rgb };

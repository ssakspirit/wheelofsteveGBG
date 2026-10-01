#!/usr/bin/env node
// 팩 점검: 리소스팩·행동팩에서 게임 안에서 깨지거나(분홍·검정 텍스처, 안 보이는 모델, 소리 없음) 경고가 날 만한 곳을 찾는다.
//   node tools/check-pack.js            오류·경고 목록 (종료 코드 1 = 오류 있음)
// 바닐라 리소스팩(Education 설치 폴더)을 찾으면 바닐라 모델·텍스처·애니메이션·소리 이름도 실제로 있는지 확인한다.
const fs = require("fs"), path = require("path");
const PNG = require("./skins/png");

const ROOT = path.join(__dirname, "..");
const RP = path.join(ROOT, "resource_packs/rp0"), BP = path.join(ROOT, "behavior_packs/bp0");
const errors = [], warns = [];
const err = (where, msg) => errors.push(`${where}: ${msg}`), warn = (where, msg) => warns.push(`${where}: ${msg}`);
const rel = f => path.relative(ROOT, f).split(path.sep).join("/");

// ---- 바닐라 리소스팩 찾기 ----
function findVanilla() {
  const base = "C:/Program Files/WindowsApps";
  try {
    for (const d of fs.readdirSync(base)) if (d.startsWith("Microsoft.MinecraftEducationEdition_") && d.includes("x64")) {
      const v = path.join(base, d, "data/resource_packs/vanilla");
      if (fs.existsSync(v)) return v;
    }
  } catch {}
  for (const v of ["C:/Program Files/WindowsApps/Microsoft.MinecraftEducationEdition_1.26.3200.0_x64__8wekyb3d8bbwe/data/resource_packs/vanilla"]) if (fs.existsSync(v)) return v;
  return null;
}
const VAN = findVanilla();
// 바닐라는 기본 팩 하나가 아니라 버전별 팩(vanilla_1.xx)과 음악 팩(vanilla_music)에 나뉘어 있다 — 모두 찾아본다
const VANS = VAN ? fs.readdirSync(path.dirname(VAN)).filter(d => d === "vanilla" || d.startsWith("vanilla_")).map(d => path.join(path.dirname(VAN), d)) : [];

// ---- JSON: Bedrock은 주석을 허용하므로 문자열 밖의 // 와 /* */ 를 지우고 읽는다 ----
function stripComments(t) {
  let out = "", i = 0, inStr = false;
  while (i < t.length) {
    const c = t[i], n = t[i + 1];
    if (inStr) { out += c; if (c === "\\") { out += n; i += 2; continue; } if (c === '"') inStr = false; i++; continue; }
    if (c === '"') { inStr = true; out += c; i++; continue; }
    if (c === "/" && n === "/") { while (i < t.length && t[i] !== "\n") i++; continue; }
    if (c === "/" && n === "*") { i += 2; while (i < t.length && !(t[i] === "*" && t[i + 1] === "/")) i++; i += 2; continue; }
    out += c; i++;
  }
  return out.replace(/,(\s*[}\]])/g, "$1");   // Bedrock이 봐주는 끝 쉼표
}
const walk = d => fs.existsSync(d) ? fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]) : [];
const json = {};
function readJson(f, quiet) {
  if (f in json) return json[f];
  try { return (json[f] = JSON.parse(stripComments(fs.readFileSync(f, "utf8").replace(/^\uFEFF/, "")))); }
  catch (e) { if (!quiet) err(rel(f), "JSON 문법 오류 — " + e.message.slice(0, 120)); return (json[f] = null); }
}
for (const f of [...walk(RP), ...walk(BP)].filter(f => f.endsWith(".json"))) readJson(f);

// ---- 이름 모으기: 모델, 애니메이션, 렌더 컨트롤러, 소리 ----
const geos = new Map();       // id → bones(Set, 소문자)
function addGeo(j, src) {
  if (!j) return;
  if (j["minecraft:geometry"]) for (const g of j["minecraft:geometry"]) geos.set(g.description.identifier, { bones: new Set((g.bones || []).map(b => b.name.toLowerCase())), tw: g.description.texture_width, th: g.description.texture_height, src });
  for (const [k, g] of Object.entries(j)) if (k.startsWith("geometry.")) {
    const [id, parent] = k.split(":");
    const bones = new Set((g.bones || []).map(b => b.name.toLowerCase()));
    if (parent && geos.has(parent)) for (const b of geos.get(parent).bones) bones.add(b);
    geos.set(id, { bones, tw: g.texturewidth, th: g.textureheight, src });
  }
}
const vanFiles = VAN ? walk(path.join(VAN, "models")).filter(f => f.endsWith(".json")) : [];
for (const f of vanFiles) addGeo(readJson(f, true), "vanilla");
for (const f of walk(path.join(RP, "models")).filter(f => f.endsWith(".json"))) addGeo(json[f], rel(f));
const anims = new Map(), ctrls = new Set(), rcs = new Set(), animFile = new Map();
const collect = (dir, quiet) => {
  for (const f of walk(path.join(dir, "animations")).filter(f => f.endsWith(".json"))) {
    const j = readJson(f, quiet);
    for (const [k, a] of Object.entries(j?.animations || {})) {
      if (!quiet && animFile.has(k)) warn(rel(f), `애니메이션 ${k}가 ${animFile.get(k)}에도 있음 — 어느 쪽이 쓰일지 불확실`);
      if (!quiet) animFile.set(k, rel(f));
      anims.set(k, a);
    }
  }
  for (const f of walk(path.join(dir, "animation_controllers")).filter(f => f.endsWith(".json"))) { const j = readJson(f, quiet); for (const k of Object.keys(j?.animation_controllers || {})) ctrls.add(k); }
  for (const f of walk(path.join(dir, "render_controllers")).filter(f => f.endsWith(".json"))) { const j = readJson(f, quiet); for (const k of Object.keys(j?.render_controllers || {})) rcs.add(k); }
};
for (const v of VANS) collect(v, true);
collect(RP);
const inPacks = (p, exts) => exts.some(e => fs.existsSync(path.join(RP, p + e)) || VANS.some(v => fs.existsSync(path.join(v, p + e))));
const texExists = t => inPacks(t, [".png", ".tga", ".jpg", ".jpeg"]);
const texFile = t => [".png", ".tga"].map(e => path.join(RP, t + e)).find(fs.existsSync);
const pngSize = f => { try { const b = fs.readFileSync(f); return b.toString("ascii", 1, 4) === "PNG" ? [b.readUInt32BE(16), b.readUInt32BE(20)] : null; } catch { return null; } };

// ---- 엔티티·붙임 모델(attachable) ----
const ents = walk(path.join(RP, "entity")).concat(walk(path.join(RP, "attachables"))).filter(f => f.endsWith(".json"));
for (const f of ents) {
  const j = json[f]; if (!j) continue;
  const d = (j["minecraft:client_entity"] || j["minecraft:attachable"] || {}).description; if (!d) continue;
  const where = rel(f) + ` (${d.identifier})`;
  const g = d.geometry || {}, t = d.textures || {};
  for (const [k, id] of Object.entries(g)) if (!geos.has(id)) err(where, `모델 ${k} = ${id} 없음`);
  for (const [k, p] of Object.entries(t)) if (!texExists(p)) err(where, `텍스처 ${k} = ${p} 파일 없음`);
  for (const rc of d.render_controllers || []) { const id = typeof rc === "string" ? rc : Object.keys(rc)[0]; if (!rcs.has(id)) err(where, `렌더 컨트롤러 ${id} 없음`); }
  const bones = new Set(Object.values(g).flatMap(id => [...(geos.get(id)?.bones || [])]));
  for (const [k, id] of Object.entries(d.animations || {})) {
    if (id.startsWith("controller.")) { if (!ctrls.has(id)) err(where, `애니메이션 컨트롤러 ${k} = ${id} 없음`); continue; }
    const a = anims.get(id);
    if (!a) { err(where, `애니메이션 ${k} = ${id} 없음`); continue; }
    const missing = Object.keys(a.bones || {}).filter(b => !bones.has(b.toLowerCase()));
    if (missing.length && bones.size) warn(where, `애니메이션 ${id}가 움직이는 뼈대가 모델에 없음: ${missing.join(", ")} (그 부분만 안 움직임)`);
  }
  // 같은 키의 모델·텍스처 크기 비율 (UV가 어긋나 보이는지)
  for (const [k, p] of Object.entries(t)) {
    const geo = geos.get(g[k] || g.default); const file = texFile(p);
    if (!geo || !file || !geo.tw) continue;
    const s = pngSize(file); if (!s) continue;
    const frames = (s[1] / s[0]) / (geo.th / geo.tw);                 // 프레임을 세로로 쌓은 텍스처(uv_anim)는 정수 배
    if (Math.abs(frames - Math.round(frames)) > 0.01 || frames < 0.99) warn(where, `텍스처 ${k} ${s[0]}×${s[1]}과 모델 ${g[k] || g.default}의 UV 크기 ${geo.tw}×${geo.th} 비율이 다름`);
  }
}

// ---- 파티클·아이템·블록 텍스처 ----
for (const f of walk(path.join(RP, "particles")).filter(f => f.endsWith(".json"))) {
  const t = json[f]?.particle_effect?.description?.basic_render_parameters?.texture;
  if (t && !texExists(t)) err(rel(f), `파티클 텍스처 ${t} 없음`);
}
for (const [file, key] of [["textures/item_texture.json", "texture_data"], ["textures/terrain_texture.json", "texture_data"]]) {
  const j = json[path.join(RP, file)]; if (!j) continue;
  for (const [k, v] of Object.entries(j[key] || {})) for (const t of [].concat(v.textures)) { const p = typeof t === "string" ? t : t?.path; if (p && !texExists(p)) err(file, `${k} → ${p} 없음`); }
}

// ---- 소리: 정의된 파일, 게임이 트는 이름 ----
const sd = json[path.join(RP, "sounds/sound_definitions.json")]?.sound_definitions || {};
const vanSd = Object.assign({}, ...VANS.map(v => readJson(path.join(v, "sounds/sound_definitions.json"), true)?.sound_definitions || {}));
for (const [k, v] of Object.entries(sd)) for (const s of v.sounds || []) {
  const n = typeof s === "string" ? s : s.name;
  const ok = inPacks(n, [".ogg", ".fsb", ".wav"]);
  if (!ok) (n.startsWith("sounds/rwm") ? err : warn)("sounds/sound_definitions.json", `${k} → ${n} 파일 없음`);
}
const played = new Set();
for (const f of walk(path.join(BP, "functions")).filter(f => f.endsWith(".mcfunction"))) for (const m of fs.readFileSync(f, "utf8").matchAll(/playsound\s+([a-z0-9_.]+)/g)) played.add(m[1]);
if (VAN) for (const s of played) if (!sd[s] && !vanSd[s]) warn("functions", `playsound ${s}: 정의된 소리 없음`);

// ---- 문구: ko_KR 형식, 빠진 키, %1 같은 자리표시 ----
function lang(f) {
  const m = new Map(), dup = [];
  fs.readFileSync(f, "utf8").replace(/^\uFEFF/, "").split(/\r?\n/).forEach((l, i) => {
    if (!l.trim() || l.startsWith("##")) return;
    const e = l.indexOf("="); if (e < 0) { err(rel(f), `${i + 1}줄: '=' 없음`); return; }
    const k = l.slice(0, e), v = l.slice(e + 1).split("\t")[0];
    if (m.has(k)) dup.push(k); m.set(k, v);
  });
  if (dup.length) warn(rel(f), "같은 키가 두 번: " + dup.slice(0, 8).join(", "));
  return m;
}
const ko = lang(path.join(RP, "texts/ko_KR.lang")), en = lang(path.join(RP, "texts/en_US.lang"));
const holes = v => (v.match(/%(\d+|s|d|\d+\$[sd])/g) || []).sort().join(",");
for (const [k, v] of en) {
  if (!ko.has(k)) { warn("texts/ko_KR.lang", `영어에만 있는 키: ${k}`); continue; }
  if (holes(v) !== holes(ko.get(k))) warn("texts/ko_KR.lang", `${k}: 자리표시(%1 등)가 영어와 다름 — "${holes(v)}" vs "${holes(ko.get(k))}"`);
}
const bpLang = walk(path.join(BP, "texts")).filter(f => f.endsWith(".lang")).map(f => path.basename(f));
if (!bpLang.includes("ko_KR.lang")) warn("behavior_packs/bp0/texts", `ko_KR.lang 없음 (${bpLang.join(", ")}만) — 한국어에서도 행동팩 이름·설명이 영어로 나옴`);

// ---- 원작부터 있던 것: 확인했고 해롭지 않음 (경고 대신 참고로) ----
const KNOWN = [
  ["animation.rwm.tnt_ring.idle", "6진 망루 공중 고리 회전이 두 파일에 같은 이름으로 있고 한쪽은 없는 뼈대(bone)를 돌린다 — 둘 다 root를 돌려 고리는 정상적으로 돈다"],
];
const known = [];
for (let i = warns.length - 1; i >= 0; i--) { const k = KNOWN.find(([s]) => warns[i].includes(s)); if (k) { known.push(k[1]); warns.splice(i, 1); } }
// ---- 결과 ----
console.log(`바닐라 리소스팩: ${VAN ? "찾음" : "못 찾음(바닐라 이름은 확인 못 함)"}`);
console.log(`\n오류 ${errors.length}개`); errors.forEach(e => console.log("  ✗ " + e));
console.log(`\n경고 ${warns.length}개`); warns.forEach(w => console.log("  ! " + w));
if (known.length) { console.log(`
원작부터 있던 것(해롭지 않음)`); [...new Set(known)].forEach(k => console.log("  · " + k)); }
process.exitCode = errors.length ? 1 : 0;

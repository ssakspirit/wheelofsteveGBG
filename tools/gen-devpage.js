#!/usr/bin/env node
// 개발자 페이지 생성기: baseline-rules(원본)와 현재 작업 폴더를 비교해 devpage.html을 만든다.
// 사용: node tools/gen-devpage.js   → 레포 루트의 devpage.html을 브라우저로 연다.

const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = path.join(__dirname, "..");
const BASELINE = "baseline-rules";
const RP = "resource_packs/rp0/";
const BP = "behavior_packs/bp0/";
const LANG = RP + "texts/ko_KR.lang";
process.chdir(ROOT);

const git = (args, opts = {}) =>
  execFileSync("git", ["-c", "core.quotepath=false", ...args], { encoding: opts.buffer ? null : "utf8", stdio: ["ignore", "pipe", "ignore"], maxBuffer: 64 << 20 });
const read = f => fs.readFileSync(f, "utf8");
const exists = f => fs.existsSync(f);

// ---------- 원본 파일 목록과 해시 ----------
const baseTree = new Map(); // path -> blob sha
for (const line of git(["ls-tree", "-r", BASELINE]).split("\n").filter(Boolean)) {
  const [meta, file] = line.split("\t");
  baseTree.set(file, meta.split(" ")[2]);
}
const blobSha = f => {
  const buf = fs.readFileSync(f);
  return crypto.createHash("sha1").update(`blob ${buf.length}\0`).update(buf).digest("hex");
};
// git cat-file --batch 로 원본 파일 여러 개를 한 번에 읽는다 (파일마다 git show 를 부르면 수십 초 걸림)
function catBatch(specs) {
  if (!specs.length) return [];
  const out = execFileSync("git", ["cat-file", "--batch"], { input: specs.join("\n") + "\n", maxBuffer: 512 << 20, stdio: ["pipe", "pipe", "ignore"] });
  const res = []; let i = 0;
  for (let k = 0; k < specs.length; k++) {
    const nl = out.indexOf(10, i), head = out.slice(i, nl).toString();
    if (head.endsWith("missing")) { res.push(null); i = nl + 1; continue; }
    const size = +head.split(" ")[2];
    res.push(out.slice(nl + 1, nl + 1 + size)); i = nl + 1 + size + 1;
  }
  return res;
}
// 리소스 팩 원본은 처음에 한꺼번에 읽어 둔다
const BASE_RP = (() => {
  const files = [...baseTree.keys()].filter(f => f.startsWith(RP));
  const bufs = catBatch(files.map(f => `${BASELINE}:${f}`));
  return new Map(files.map((f, i) => [f, bufs[i]]));
})();
const baseBuf = f => BASE_RP.has(f) ? BASE_RP.get(f) : (() => { try { return git(["show", `${BASELINE}:${f}`], { buffer: true }); } catch { return null; } })();
// 텍스트 파일은 줄바꿈 변환 영향을 받으므로 원본 내용과 직접 비교
const baseText = f => baseBuf(f)?.toString("utf8") ?? null;
function status(f) {
  if (!baseTree.has(f)) return "new";
  if (!exists(f)) return "deleted";
  if (/\.(png|jpe?g)$/i.test(f)) return blobSha(f) === baseTree.get(f) ? "same" : "changed";
  return baseText(f).replace(/\r\n/g, "\n") === read(f).replace(/\r\n/g, "\n") ? "same" : "changed";
}

// ---------- 번역 문구 ----------
function parseLang(text) {
  const m = new Map();
  for (const line of (text || "").split(/\r?\n/)) {
    const i = line.indexOf("=");
    if (i < 1 || line.startsWith("#")) continue;
    m.set(line.slice(0, i).trim(), line.slice(i + 1).split("\t")[0].trim());
  }
  return m;
}
const langBase = parseLang(baseText(LANG));
const langNow = parseLang(read(LANG));
const t = k => langNow.get(k) ?? "";
function langGroup(k) {
  if (/^(steve|henry|garett|dawn|natalie|wheel|npc)\./.test(k)) return "호스트·대화";
  if (/^item\./.test(k)) return "아이템";
  if (/^(actionbar|subtitle)\./.test(k)) return "게임 안내";
  if (/^(chat\.join|board\.)/.test(k)) return "로비·팀";
  if (/^(interact|grid_block|orb\.flag)/.test(k)) return "상호작용";
  return "기타";
}
const langRows = [];
for (const k of new Set([...langBase.keys(), ...langNow.keys()])) {
  const a = langBase.get(k), b = langNow.get(k);
  langRows.push({ key: k, group: langGroup(k), before: a ?? null, after: b ?? null, changed: a !== b });
}

// ---------- 3D 미리보기용 모델 ----------
// 두 형식(1.8~1.10의 "geometry.x" 키, 1.12+의 "minecraft:geometry" 배열)을 같은 모양으로 정리한다
function loadGeometry(file, id, text = exists(file) ? read(file) : null) {
  if (text == null) return null;
  const j = JSON.parse(text.replace(/^\s*\/\/.*$/gm, ""));
  let g = null, tw = 64, th = 64;
  if (j["minecraft:geometry"]) {
    g = j["minecraft:geometry"].find(x => x.description.identifier === id) || j["minecraft:geometry"][0];
    tw = g.description.texture_width ?? 64; th = g.description.texture_height ?? 64;
  } else {
    const key = Object.keys(j).find(k => k.split(":")[0] === id) || Object.keys(j).find(k => k.startsWith("geometry."));
    g = j[key]; tw = g.texturewidth ?? 64; th = g.textureheight ?? 64;
  }
  return {
    tw, th,
    bones: (g.bones || []).map(b => ({
      name: b.name, parent: b.parent || null, pivot: b.pivot || [0, 0, 0], rotation: b.rotation || null, mirror: !!b.mirror,
      cubes: (b.cubes || []).map(c => ({ origin: c.origin, size: c.size, uv: c.uv, inflate: c.inflate || 0, mirror: c.mirror, rotation: c.rotation || null, pivot: c.pivot || null })),
    })),
  };
}
const dataUri = f => exists(f) ? "data:image/png;base64," + fs.readFileSync(f).toString("base64") : null;
const baseDataUri = f => baseTree.has(f) ? "data:image/png;base64," + baseBuf(f).toString("base64") : null;
// 텍스처나 모델이 원본과 다르면 원본 쪽을 함께 실어 변경 전/후를 나란히 보여 준다
function beforeOf(tex, texStatus, geo, geoStatus, id) {
  if (texStatus !== "changed" && geoStatus !== "changed") return null;
  return {
    texData: texStatus === "changed" ? baseDataUri(tex) : null,
    model: geoStatus === "changed" ? loadGeometry(geo, id, baseText(geo)) : null,
  };
}

// ---------- 호스트(NPC) ----------
const hosts = [
  { id: "npc_1", key: "steve", game: "orb" },
  { id: "npc_2", key: "garett", game: "craft" },
  { id: "npc_4", key: "henry", game: "nock" },
  { id: "npc_5", key: "natalie", game: "grid" },
  { id: "npc_3", key: "dawn", game: "elytra" },
].map(h => {
  const tex = `${RP}textures/rwm/entity/npc/${h.id}.png`;
  const geo = `${RP}models/entity/npc/${h.id}.geo.json`;
  const texStatus = status(tex), geoStatus = status(geo), geoId = `geometry.rwm.${h.id}`;
  return {
    ...h, tex, texStatus, geoStatus,
    model: loadGeometry(geo, geoId), texData: dataUri(tex),
    before: beforeOf(tex, texStatus, geo, geoStatus, geoId),
    name: t(`${h.key}.n`), nameBefore: langBase.get(`${h.key}.n`),
    button: t(`${h.key}.b1`), dialogue: t(`${h.key}.d`),
  };
});
// 바퀴는 클라이언트 엔티티가 실제로 쓰는 모델·텍스처를 따라간다 (다른 파일로 바꿔 끼워도 게임과 같은 모습을 보여 줌)
const WHEEL_TEX0 = `${RP}textures/rwm/entity/wheel_of_steve.png`, WHEEL_GEO0 = `${RP}models/entity/wheel_of_steve.geo.json`, WHEEL_ID0 = "geometry.wheel_of_steve";
const wheelDesc = JSON.parse(read(`${RP}entity/wheel_of_steve.rp.e.json`))["minecraft:client_entity"].description;
const wheelGeoId = wheelDesc.geometry.default;
const wheelTex = `${RP}${wheelDesc.textures.default}.png`;
const wheelGeo = fs.readdirSync(`${RP}models/entity`).map(f => `${RP}models/entity/${f}`)
  .find(f => f.endsWith(".json") && read(f).includes(`"${wheelGeoId}"`)) || WHEEL_GEO0;
const swapped = (file, file0) => file === file0 ? status(file) : "changed"; // 다른 파일로 교체됐으면 '변경됨'
const wheel = {
  tex: wheelTex, texStatus: swapped(wheelTex, WHEEL_TEX0),
  name: t("wheel.n"), nameBefore: langBase.get("wheel.n"), dialogue: t("wheel.d"), button: t("wheel.b1"),
  geoStatus: swapped(wheelGeo, WHEEL_GEO0),
  model: loadGeometry(wheelGeo, wheelGeoId), texData: dataUri(wheelTex),
  frames: 2, // render controller의 uv_anim: 텍스처를 위아래 2장으로 나눠 번갈아 보여 줌
};
wheel.before = wheel.texStatus === "changed" || wheel.geoStatus === "changed"
  ? { texData: baseDataUri(WHEEL_TEX0), model: loadGeometry(WHEEL_GEO0, WHEEL_ID0, baseText(WHEEL_GEO0)) }
  : null;
// 게임에 아직 연결하지 않은 새 모델 시안 (파일이 있고, 바퀴가 아직 쓰지 않을 때만 보여 준다)
const drafts = [
  { id: "honcheonui", name: "혼천의 (새 모델 시안)", geo: `${RP}models/entity/honcheonui.geo.json`, geoId: "geometry.honcheonui",
    tex: `${RP}textures/rwm/entity/honcheonui.png`, frames: 2, note: "게임에 아직 연결하지 않은 새 바퀴 모델 · 생성: tools/skins/honcheonui.js" },
].filter(d => exists(d.geo) && exists(d.tex) && d.geoId !== wheelGeoId).map(d => ({
  ...d, draft: true, texStatus: status(d.tex), geoStatus: status(d.geo), model: loadGeometry(d.geo, d.geoId), texData: dataUri(d.tex),
}));

// ---------- 아이템 ----------
const itemTex = JSON.parse(read(`${RP}textures/item_texture.json`)).texture_data;
const items = fs.readdirSync(`${BP}items`).filter(f => f.endsWith(".json")).map(f => {
  const j = JSON.parse(read(`${BP}items/${f}`))["minecraft:item"];
  const id = j.description.identifier;
  const icon = j.components?.["minecraft:icon"];
  const iconKey = (typeof icon === "string" ? icon : icon?.texture ?? icon?.textures?.default) || id.split(":")[1];
  const tex = itemTex[iconKey] ? RP + itemTex[iconKey].textures + ".png" : null;
  return { id, tex, texStatus: tex ? status(tex) : "none", name: t(`item.${id}`), nameBefore: langBase.get(`item.${id}`) };
}).sort((a, b) => a.id.localeCompare(b.id, "en", { numeric: true }));
const armor = ["iron", "diamond"].flatMap(m => ["helmet", "chestplate", "leggings", "boots"].map(p => {
  const tex = `${RP}textures/items/${m}_${p}.png`;
  return { id: `minecraft:${m}_${p}`, tex, texStatus: status(tex), name: t(`item.${m}_${p}.name`), nameBefore: langBase.get(`item.${m}_${p}.name`) };
}));

// ---------- 바닐라 원본: 리소스팩이 바닐라 경로의 그림을 새로 덮어쓴 경우(한옥 블록 등) '원본'으로 보여 준다 ----------
// 기본 팩(vanilla) 위에 버전별 팩(vanilla_1.xx)이 덮이므로 가장 새 버전에서 찾는다
const VANS = (() => {
  const base = "C:/Program Files/WindowsApps";
  let root = null;
  try {   // WindowsApps 목록은 권한 때문에 못 읽을 수 있다 → 아래 알려진 경로로
    const d = fs.readdirSync(base).find(n => n.startsWith("Microsoft.MinecraftEducationEdition_") && n.includes("x64") && fs.existsSync(`${base}/${n}/data/resource_packs/vanilla`));
    if (d) root = `${base}/${d}/data/resource_packs`;
  } catch {}
  root = root || [`${base}/Microsoft.MinecraftEducationEdition_1.26.3200.0_x64__8wekyb3d8bbwe/data/resource_packs`].find(r => fs.existsSync(r + "/vanilla"));
  if (!root) return [];
  return fs.readdirSync(root).filter(n => n === "vanilla" || /^vanilla_\d/.test(n))
    .sort((a, b) => b.localeCompare(a, "en", { numeric: true })).map(n => `${root}/${n}/`);
})();
const vanillaUri = rel => { const v = VANS.find(d => exists(d + rel)); return v ? dataUri(v + rel) : null; };

// ---------- 텍스처 전체 ----------
function walk(d) {
  return fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
}
const pngs = [...new Set([...walk(RP).map(f => f.split(path.sep).join("/")), ...[...baseTree.keys()].filter(f => f.startsWith(RP))])]
  .filter(f => f.endsWith(".png"))
  .map(f => {
    let w = 0, h = 0;
    if (exists(f)) { const b = fs.readFileSync(f); w = b.readUInt32BE(16); h = b.readUInt32BE(20); }
    const st = status(f);
    // 바뀐 그림은 내장 데이터로 싣는다: 원본과 나란히 보여 주고, 브라우저 캐시에 옛 그림이 남지 않게
    const rel = f.slice(RP.length);
    return { file: f, rel, status: st, w, h,
      data: st === "changed" || st === "new" ? dataUri(f) : null,
      beforeData: st === "changed" ? baseDataUri(f) : st === "new" ? vanillaUri(rel) : null };
  })
  .sort((a, b) => a.rel.localeCompare(b.rel, "en", { numeric: true }));

// ---------- 사운드 ----------
const sdPath = `${RP}sounds/sound_definitions.json`;
const sdBase = JSON.parse(baseText(sdPath) || "{}").sound_definitions || {};
const sdNow = JSON.parse(read(sdPath)).sound_definitions || {};
const soundNames = d => (d?.sounds || []).map(s => (typeof s === "string" ? s : s.name)).join(", ");
// 게임이 playsound로 트는 음높이(pitch): "playsound 이름 대상 x y z 음량 음높이" — 가장 많이 쓰는 값
const soundPitch = {};
for (const f of walk(`${BP}functions`).filter(f => f.endsWith(".mcfunction"))) {
  for (const m of read(f).matchAll(/playsound\s+([a-z0-9_.]+)((?:[ \t]+\S+){6})/g)) {
    const pitch = +m[2].trim().split(/\s+/)[5];
    if (!isNaN(pitch)) (soundPitch[m[1]] ||= {})[pitch] = (soundPitch[m[1]][pitch] || 0) + 1;
  }
}
const topPitch = k => { const c = soundPitch[k]; return c ? +Object.entries(c).sort((a, b) => b[1] - a[1])[0][0] : 1; };
// 리소스팩에 직접 넣은 음원은 페이지에서 바로 재생한다 (devpage.html 위치 기준 경로)
const playable = d => (d?.sounds || []).map(x => (typeof x === "string" ? x : x.name))
  .flatMap(n => [".ogg", ".wav"].map(ext => `${RP}${n}${ext}`)).filter(exists);
// OGG Vorbis 길이(초): 마지막 페이지의 granule position ÷ 샘플레이트 (브라우저는 서버에 따라 길이를 어림하므로 직접 잰다)
function oggSeconds(f) {
  try {
    const b = fs.readFileSync(f), rate = b.readUInt32LE(b.indexOf("vorbis") + 11), last = b.lastIndexOf("OggS");
    return Number(b.readBigUInt64LE(last + 6)) / rate;
  } catch { return null; }
}
const sounds = [...new Set([...Object.keys(sdBase), ...Object.keys(sdNow)])].sort().map(k => ({
  event: k, before: soundNames(sdBase[k]) || null, after: soundNames(sdNow[k]) || null,
  changed: JSON.stringify(sdBase[k]) !== JSON.stringify(sdNow[k]),
  files: playable(sdNow[k]).map(f => ({ f, sec: f.endsWith(".ogg") ? oggSeconds(f) : null })), pitch: topPitch(k),
}));
const soundFiles = walk(`${RP}sounds`).map(f => f.split(path.sep).join("/")).filter(f => /\.(ogg|wav|fsb)$/i.test(f));

// ---------- 장소·게임 (tools/places.js) ----------
const { places: TP_PLACES, sections: SECTIONS, games: GAMES, sequences: SEQS, devCommands, devRecipes } = require("./places");
// 명령어 탭: 안내 목록 + 이동·연습 시작 명령은 places·games에서 자동으로 만든다 (gen-dev.js가 만드는 것과 같은 목록)
const commands = {
  groups: [
    ...devCommands.slice(0, 2),
    { group: "게임 시작 (연습 경기)", items: GAMES.map(([name, , label]) => ({ cmd: `/function dev/start/${name}`, desc: `${label} 연습 경기 시작 — NPC 대화로 시작하는 것과 같고, 어전대회 승리 기록에는 들어가지 않음` })) },
    { group: "이동", items: TP_PLACES.map(([name, pos, , label]) => ({ cmd: `/function dev/tp/${name}`, desc: `${label} (${pos})` })) },
    ...devCommands.slice(2),
  ],
  recipes: devRecipes,
  seqs: SEQS.map(s => ({ ...s, title: SECTIONS.find(x => x.id === s.game)?.title || s.game })),
};
// 주석 달린 JSON: 줄 전체 주석과, 따옴표가 없는 줄 끝 주석(`"a": 1 // 설명`)을 지운다
const jsonc = s => JSON.parse(s.replace(/^\s*\/\/.*$/gm, "").replace(/\s\/\/[^"\n]*$/gm, ""));
function fogInfo(id) {
  const f = `${RP}fogs/${id}.json`, air = s => { try { return jsonc(s)["minecraft:fog_settings"].distance.air; } catch { return null; } };
  const now = exists(f) ? air(read(f)) : null, before = air(baseText(f) || "");
  return { id, color: now?.fog_color ?? null, end: now?.fog_end ?? null, beforeColor: before?.fog_color ?? null, beforeEnd: before?.fog_end ?? null };
}
// 엔티티: 행동팩 정의 + 리소스팩 텍스처
const entities = new Map();
for (const f of fs.readdirSync(`${BP}entities`)) {
  try { const id = jsonc(read(`${BP}entities/${f}`))["minecraft:entity"].description.identifier; entities.set(id, { id, bp: f, rp: null, textures: [] }); } catch {}
}
for (const f of fs.readdirSync(`${RP}entity`)) {
  try {
    const j = jsonc(read(`${RP}entity/${f}`)), d = (j["minecraft:client_entity"] || j["minecraft:attachable"]).description;
    const e = entities.get(d.identifier) || { id: d.identifier, bp: null, textures: [] };
    entities.set(d.identifier, { ...e, rp: f, textures: [...new Set(Object.values(d.textures || {}))].map(t => t.replace(/^textures\//, "") + ".png") });
  } catch {}
}
// 함수 폴더: 파일 수, 시작 지점, 쓰는 소리(playsound)
function funcInfo(dir) {
  const d = `${BP}functions/${dir}`;
  if (!exists(d)) return { dir, count: 0, entries: [], sounds: {} };
  const files = walk(d).filter(f => f.endsWith(".mcfunction"));
  const sounds = {};
  for (const f of files) for (const m of read(f).matchAll(/playsound\s+([a-z0-9_.]+)/g)) sounds[m[1]] = (sounds[m[1]] || 0) + 1;
  const entries = files.map(f => f.split(path.sep).join("/").slice(`${BP}functions/`.length))
    .filter(f => /\/(game_start|game_end|start|end|tick|main)\.mcfunction$/.test(f));
  return { dir, count: files.length, entries, sounds };
}
// ---------- 텍스처 ↔ 3D 모델 (원본·현재 각각) ----------
// 클라이언트 엔티티의 textures 키는 같은 이름의 geometry 키(없으면 default)와 짝을 이룬다.
const norm = f => f.split(path.sep).join("/");
const geoIdsOf = text => {
  try {
    const j = jsonc(text);
    return j["minecraft:geometry"] ? j["minecraft:geometry"].map(g => g.description.identifier) : Object.keys(j).filter(k => k.startsWith("geometry.")).map(k => k.split(":")[0]);
  } catch { return []; }
};
const geoIndex = files => { const m = new Map(); for (const [f, text] of files) if (text) for (const id of geoIdsOf(text)) if (!m.has(id)) m.set(id, { f, text }); return m; };
const nowGeo = geoIndex(walk(`${RP}models`).map(norm).filter(f => f.endsWith(".json")).map(f => [f, read(f)]));
const baseGeo = geoIndex([...BASE_RP.keys()].filter(f => f.startsWith(`${RP}models/`) && f.endsWith(".json")).map(f => [f, baseText(f)]));
const uvAnimRCs = new Set(fs.readdirSync(`${RP}render_controllers`).flatMap(f => {
  try { const j = jsonc(read(`${RP}render_controllers/${f}`)).render_controllers; return Object.keys(j).filter(k => JSON.stringify(j[k]).includes("uv_anim")); } catch { return []; }
}));
function pairsOf(files) {
  const out = [];
  for (const text of files) {
    let d; try { const j = jsonc(text); d = (j["minecraft:client_entity"] || j["minecraft:attachable"]).description; } catch { continue; }
    const geos = d.geometry || {}, rcs = d.render_controllers || [];
    const frames = rcs.some(rc => uvAnimRCs.has(typeof rc === "string" ? rc : Object.keys(rc)[0])) ? 2 : 1;
    // 렌더 컨트롤러가 여럿이면 텍스처 키가 없는 모델도 함께 겹쳐 그린다 (옥새의 반투명 서기처럼)
    const texKeys = Object.keys(d.textures || {});
    const extra = rcs.length > 1 ? Object.keys(geos).filter(k => k !== "default" && !texKeys.includes(k)).map(k => geos[k]) : [];
    for (const [key, t] of Object.entries(d.textures || {})) {
      const geo = geos[key] ?? geos.default ?? Object.values(geos)[0];
      if (geo) out.push({ entity: d.identifier, key, tex: `${RP}${t}.png`, geo: [geo, ...extra].join("+"), frames });
    }
  }
  return out;
}
const entFilesNow = fs.readdirSync(`${RP}entity`).map(f => read(`${RP}entity/${f}`));
const entFilesBase = [...BASE_RP.keys()].filter(f => f.startsWith(`${RP}entity/`)).map(baseText).filter(Boolean);
const pairsNow = pairsOf(entFilesNow), pairsBase = pairsOf(entFilesBase);
const geoDict = {}; // "now|id" / "base|id" → 모델. 원본과 같은 파일이면 now 하나만 싣는다
function geoRef(which, id) {
  if (id.includes("+")) { // 겹쳐 그리는 모델들: 뼈대 이름이 겹치지 않게 뒤 모델에 번호를 붙여 하나로 합친다
    const keys = id.split("+").map(x => geoRef(which, x));
    if (keys.some(k => !k)) return keys[0];
    const key = (keys.every(k => k.startsWith("now|")) ? "now|" : which + "|") + id;
    if (!(key in geoDict)) {
      const parts = keys.map(k => geoDict[k]);
      geoDict[key] = { tw: parts[0].tw, th: parts[0].th, bones: parts.flatMap((m, i) => m.bones.map(b => i ? { ...b, name: b.name + "#" + i, parent: b.parent && b.parent + "#" + i } : b)) };
    }
    return key;
  }
  const now = nowGeo.get(id), base = baseGeo.get(id);
  const src = which === "base" ? (base || now) : (now || base);
  if (!src) return null;
  const same = base && now && base.text.replace(/\r/g, "") === now.text.replace(/\r/g, ""); // 줄바꿈 차이는 무시
  const key = which === "base" && same ? "now|" + id : which + "|" + id;
  if (!(key in geoDict)) { try { geoDict[key] = loadGeometry(src.f, id, src.text); } catch { geoDict[key] = null; } }
  return geoDict[key] ? key : null;
}
for (const p of pngs) {
  const mine = [...pairsNow, ...pairsBase].filter(x => x.tex === p.file);
  const seen = new Set(), models = [];
  for (const x of mine) {
    const k = x.entity + "|" + x.key;
    if (seen.has(k)) continue;
    seen.add(k);
    const now = pairsNow.find(y => y.tex === p.file && y.entity === x.entity && y.key === x.key);
    const base = pairsBase.find(y => y.tex === p.file && y.entity === x.entity && y.key === x.key);
    const ent = x.entity.replace(/^rwm:/, "");
    const key = x.key.replace(new RegExp("^" + ent + "_"), "").replace(/^craft_part_/, "")
      .replace(/^(\d+)_broken$/, "$1번 고장").replace(/^(\d+)_fixed$/, "$1번 수리");
    models.push({
      label: ent + (x.key !== "default" ? " · " + key : ""), key: x.key,
      after: p.status === "deleted" ? null : geoRef("now", (now || x).geo),
      before: p.status === "new" ? null : geoRef("base", (base || x).geo),
      frames: x.frames, unused: !now,
    });
  }
  if (!models.length) continue;
  p.models = models;
  if (!p.data && p.status !== "deleted") p.data = dataUri(p.file);
  if (!p.beforeData && p.status === "deleted") p.beforeData = baseDataUri(p.file);
}
// ---------- 갑옷(팀 관복) 3D: 바닐라 사람 갑옷 모델(층1 = 머리·몸·팔·다리 +1, 층2 = 몸·다리 +0.5)을 직접 짜서 입힌다 ----------
// 바닐라 모델은 리소스팩에 없어서, 같은 상자 배치(구형 64×32 UV)를 여기서 만든다
function armorGeo(layer) {
  const inf = layer === 1 ? 1 : 0.5, B = (name, pivot, origin, size, uv, mirror = false) => ({ name, parent: null, pivot, rotation: null, mirror, cubes: [{ origin, size, uv, inflate: inf, mirror, rotation: null, pivot: null }] });
  const bones = [B("body", [0, 24, 0], [-4, 12, -2], [8, 12, 4], [16, 16]), B("rightLeg", [-1.9, 12, 0], [-3.9, 0, -2], [4, 12, 4], [0, 16]), B("leftLeg", [1.9, 12, 0], [-0.1, 0, -2], [4, 12, 4], [0, 16], true)];
  if (layer === 1) bones.push(B("head", [0, 24, 0], [-4, 24, -4], [8, 8, 8], [0, 0]), B("rightArm", [-5, 22, 0], [-8, 12, -2], [4, 12, 4], [40, 16]), B("leftArm", [5, 22, 0], [4, 12, -2], [4, 12, 4], [40, 16], true));
  return { tw: 64, th: 32, bones };
}
geoDict["now|armor.layer1"] = armorGeo(1); geoDict["now|armor.layer2"] = armorGeo(2);
for (const p of pngs) {
  const m = p.rel.match(/^textures\/models\/armor\/(iron|diamond)_([12])\.png$/);
  if (!m) continue;
  const g = "now|armor.layer" + m[2];
  p.models = [{ label: "갑옷 층" + m[2] + (m[2] === "1" ? " (투구·흉갑·부츠)" : " (다리보호대)"), key: "default", after: g, before: g, frames: 1, unused: false }];
  if (!p.data) p.data = dataUri(p.file);
}
// ---------- 바닐라 몹을 덮은 것: 원본 모델·텍스처가 리소스팩에 없으니 tools/skins/nock/ref의 바닐라 사본을 '원본'으로 쓴다 ----------
const REF = "tools/skins/nock/ref/";
const VANILLA_REFS = [
  { rel: "textures/rwm/entity/wooden_cart.png", label: "minecart (일반 광차)", before: ["minecart.geo.json", "geometry.minecart", "minecart.png"] },
  { rel: "textures/entity/bat.png", label: "bat", after: ["bat.geo.json", "geometry.bat"], before: ["bat.geo.json", "geometry.bat", "bat.png"] },
];
for (const r of VANILLA_REFS) {
  const p = pngs.find(x => x.rel === r.rel);
  if (!p || p.status === "deleted") continue;
  const ref = (which, [f, id]) => { const k = which + "|ref:" + f; if (!(k in geoDict)) geoDict[k] = loadGeometry(REF + f, id); return k; };
  const after = r.after ? ref("now", r.after) : p.models?.[0]?.after;
  if (!after) continue;
  p.models = [{ label: r.label, key: "default", after, before: ref("base", r.before), frames: 1, unused: false }];
  if (!p.data) p.data = dataUri(p.file);
  if (!p.beforeData || p.status === "new") p.beforeData = dataUri(REF + r.before[2]);
}
// ---------- 모델 이름 (tools/model-names.js, 없으면 같은 이름 아이템의 원본/현재 문구) ----------
const MODEL_NAMES = require("./model-names");
const noFmt = x => String(x ?? "").replace(/§./g, "");
function namesOf(rel, key) {
  const n = (key && MODEL_NAMES[rel + "|" + key]) || MODEL_NAMES[rel];
  if (n) return { before: n[0], after: n[1] };
  const host = hosts.find(h => rel === `rwm/entity/npc/${h.id}.png`);
  if (host) return { before: noFmt(host.nameBefore), after: noFmt(host.name) };
  const it = items.find(i => i.id === "rwm:" + path.basename(rel, ".png"));
  return it && (it.name || it.nameBefore) ? { before: noFmt(it.nameBefore || it.name), after: noFmt(it.name || it.nameBefore) } : null;
}
for (const p of pngs) {
  const rel = p.rel.replace(/^textures\//, "");
  p.names = namesOf(rel, "");
  for (const m of p.models || []) m.names = namesOf(rel, m.key) || p.names;
}

const sections = SECTIONS.map(s => {
  const funcs = s.funcs.map(funcInfo);
  const sounds = {};
  for (const fi of funcs) for (const [k, n] of Object.entries(fi.sounds)) sounds[k] = (sounds[k] || 0) + n;
  const ents = [...entities.values()].filter(e => s.entities.some(re => new RegExp(re).test(e.id.replace(/^rwm:/, ""))))
    .sort((a, b) => a.id.localeCompare(b.id, "en", { numeric: true }));
  return {
    ...s,
    tpInfo: s.tps.map(id => TP_PLACES.find(p => p[0] === id)).filter(Boolean).map(([id, pos, face, label]) => ({ id, pos, face, label })),
    fogs: s.fogs.map(fogInfo), funcs: funcs.map(({ sounds, ...fi }) => fi), entities: ents,
    entityTex: [...new Set(ents.flatMap(e => e.textures))],
    sounds: Object.entries(sounds).sort((a, b) => b[1] - a[1]).map(([name, n]) => ({ name, n, custom: !!sdNow[name], changed: JSON.stringify(sdBase[name]) !== JSON.stringify(sdNow[name]) })),
  };
});

// ---------- 파일 변경 목록과 규칙 검사 ----------
const changedFiles = git(["diff", "--name-status", "--no-renames", BASELINE, "--", "."])
  .split("\n").filter(Boolean).map(l => { const [s, f] = l.split("\t"); return { s, f }; })
  .concat(git(["ls-files", "--others", "--exclude-standard"]).split("\n").filter(Boolean).map(f => ({ s: "A", f })))
  .filter(x => !/^(db\/|level\.dat|devpage\.html)/.test(x.f))
  .sort((a, b) => a.f.localeCompare(b.f));
let guard = { ok: true, text: "" };
try { guard.text = execFileSync("node", ["tools/rule-guard.js"], { encoding: "utf8" }); }
catch (e) { guard = { ok: false, text: (e.stdout || "") + (e.stderr || "") }; }

const head = (() => { try { return git(["log", "-1", "--format=%h %s"]).trim(); } catch { return ""; } })();
const dirty = git(["status", "--porcelain", "--", ".", ":(exclude)db", ":(exclude)level.dat", ":(exclude)level.dat_old", ":(exclude)devpage.html"]).trim().length > 0;

// ---------- 구역 3D: python tools/export-areas.py가 만든 devpage-areas/<id>.js (블록 격자). 페이지는 누를 때 불러온다 ----------
const AREA_DIR = "devpage-areas";
const areas = (exists(`${AREA_DIR}/blocks.js`) ? fs.readdirSync(AREA_DIR) : []).filter(f => f.endsWith(".js") && f !== "blocks.js").map(f => {
  const headTxt = fs.readFileSync(`${AREA_DIR}/${f}`, "utf8").slice(0, 400);
  const m = headTxt.match(/"title": "([^"]*)", "box": (\[[^\]]*\]), "size": (\[[^\]]*\])/);
  if (!m) return null;
  const id = f.replace(/\.js$/, "");
  // 장소 id와 같거나 '장소id_…'이면 그 장소에 붙인다 (시작 방은 로비에)
  const place = sections.find(s => id === s.id || id.startsWith(s.id + "_"))?.id || (id === "start" ? "lobby" : null);
  return { id, place, title: m[1], box: JSON.parse(m[2]), size: JSON.parse(m[3]), kb: Math.round(fs.statSync(`${AREA_DIR}/${f}`).size / 1024),
    when: fs.statSync(`${AREA_DIR}/${f}`).mtime.toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }) };
}).filter(Boolean);

const data = {
  generated: new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }),
  head, dirty, baseline: BASELINE, guard, wheel, drafts, hosts, sections, geo: geoDict, commands, items, armor, pngs, langRows, sounds, soundFiles, changedFiles, areas,
  changelog: require("./changelog"),
  world: t("pack.name"),
};

// ---------- HTML ----------
const html = `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${data.world || "경복궁 어전대회"} 개발자 페이지</title>
<style>
:root{--bg:#f7f4ee;--panel:#fff;--ink:#23201b;--muted:#6f675c;--line:#e3ddd2;--accent:#9b2c2c;--blue:#1f4e8c;
--new:#1d7a46;--chg:#b8621b;--same:#8a8378;--del:#9b2c2c;--chip:#f0ebe2;--code:#f4f0e8}
@media (prefers-color-scheme:dark){:root{--bg:#17150f;--panel:#211e17;--ink:#ece6da;--muted:#a79f92;--line:#37322a;
--accent:#e0736f;--blue:#7fa8e6;--new:#5cc98c;--chg:#e9a05a;--same:#8f887c;--del:#e0736f;--chip:#2c281f;--code:#2a261e}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.6 "Pretendard","Malgun Gothic","Apple SD Gothic Neo",system-ui,sans-serif}
header{padding:28px 20px 12px;max-width:1200px;margin:auto}
h1{margin:0;font-size:26px;letter-spacing:-.5px}
h1 small{font-size:14px;color:var(--muted);font-weight:500;margin-left:8px}
.meta{color:var(--muted);font-size:13px;margin-top:6px}
nav{position:sticky;top:0;z-index:5;background:var(--bg);border-bottom:1px solid var(--line)}
nav .in{max-width:1200px;margin:auto;padding:6px 20px;display:flex;gap:8px;flex-wrap:wrap;align-items:center}
nav a{color:var(--ink);text-decoration:none;padding:4px 10px;border-radius:999px;background:var(--chip);font-size:13px}
nav label{margin-left:auto;font-size:13px;color:var(--muted);display:flex;gap:6px;align-items:center}
nav input[type=search]{padding:5px 10px;border:1px solid var(--line);border-radius:8px;background:var(--panel);color:var(--ink);font:inherit;font-size:13px;width:180px}
main{max-width:1200px;margin:auto;padding:8px 20px 60px}
section{margin-top:28px;scroll-margin-top:64px}
h2{font-size:19px;margin:0 0 12px;display:flex;gap:10px;align-items:baseline}
h2 .n{font-size:13px;color:var(--muted);font-weight:500}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px}
.card{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:12px 14px}
.card b{display:block;font-size:24px}
.card span{color:var(--muted);font-size:13px}
.ok b{color:var(--new)} .bad b{color:var(--del)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:12px}
.tile{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:12px;display:flex;flex-direction:column;gap:8px;min-width:0}
.tile .img{background:repeating-conic-gradient(var(--chip) 0 25%,transparent 0 50%) 0 0/16px 16px;border-radius:8px;display:flex;align-items:center;justify-content:center;min-height:110px}
img.px{image-rendering:pixelated;max-width:100%;height:auto}
.tile h3{margin:0;font-size:16px}
.small{font-size:12px;color:var(--muted);word-break:break-all}
.badge{display:inline-block;font-size:11px;font-weight:700;padding:1px 8px;border-radius:999px;border:1px solid currentColor;white-space:nowrap}
.b-new{color:var(--new)} .b-changed{color:var(--chg)} .b-same{color:var(--same)} .b-deleted{color:var(--del)} .b-none{color:var(--same)}
table{width:100%;border-collapse:collapse;background:var(--panel);border:1px solid var(--line);border-radius:12px;overflow:hidden;font-size:14px}
th,td{padding:8px 10px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}
th{background:var(--chip);font-size:12px;color:var(--muted);font-weight:600}
td.key{font-family:Consolas,monospace;font-size:12px;color:var(--muted);word-break:break-all;width:22%}
.before{color:var(--muted)}
.mc{white-space:pre-wrap;word-break:keep-all;background:#2b2620;color:#f2eee6;padding:2px 7px;border-radius:5px;display:inline-block;line-height:1.55}
td.before .mc{opacity:.75}
.tex-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}
.tex-grid .tile .img{min-height:90px}
.tex-grid img.px{max-height:128px}
pre{background:var(--code);padding:10px;border-radius:8px;white-space:pre-wrap;font-size:12px}
.tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}
.tabs button{border:1px solid var(--line);background:var(--panel);color:var(--ink);border-radius:999px;padding:4px 12px;font:inherit;font-size:13px;cursor:pointer}
.tabs button.on{background:var(--ink);color:var(--bg)}
.hide{display:none!important}
#hostGrid{grid-template-columns:repeat(auto-fill,minmax(340px,1fr))}
.dual{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.dual .img{min-height:220px}
.v3d-wrap{position:relative;border-radius:8px;overflow:hidden;background:radial-gradient(circle at 50% 35%,#4a5a6e,#1c2229)}
canvas.v3d{display:block;width:100%;height:220px;cursor:grab;touch-action:none}
canvas.v3d:active{cursor:grabbing}
.mgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(380px,1fr));gap:12px}
.a3-bar{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:10px}
.a3-bar .copy.on{background:var(--ink);color:#fff}
.a3-view{position:relative;height:600px;border-radius:12px;overflow:hidden;background:linear-gradient(#bcd8f5,#e8f1f8)}
.a3-view canvas{display:block;width:100%;height:100%;touch-action:none;cursor:grab}
.a3-status{position:absolute;left:12px;bottom:10px;background:rgba(255,255,255,.85);padding:4px 10px;border-radius:8px}
.a3-y{vertical-align:middle;width:180px}
.mcard{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:12px;display:flex;flex-direction:column;gap:6px}
.mcard h3{margin:0;font-size:16px}
.mcard canvas.v3d{height:250px}
.v3d-wrap .lab{position:absolute;top:6px;font-size:12px;font-weight:700;color:#fff;background:rgba(0,0,0,.4);padding:2px 8px;border-radius:6px;pointer-events:none}
.v3d-wrap .lab.l{left:6px}.v3d-wrap .lab.r{right:6px}
.nm{font-weight:700;font-size:13px;color:var(--ink)}
.v3d-wrap .hint{position:absolute;left:6px;bottom:4px;font-size:11px;color:#cfd8e3;pointer-events:none}
.v3d-wrap .err{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;padding:10px;font-size:12px;color:#e9dcc9}
.cap{font-size:11px;color:var(--muted);text-align:center;margin-top:2px}
.ver{font-size:13px;font-weight:700;margin-bottom:-2px}
.ver span{font-size:11px;font-weight:500;color:var(--muted);margin-left:4px}
.warn{color:var(--chg)}
/* 탭 */
.tabbar{display:flex;gap:4px;overflow-x:auto;scrollbar-width:none;flex:1 1 auto;min-width:0}
.tabbar::-webkit-scrollbar{display:none}
.tabbar button{border:0;background:none;color:var(--muted);font:inherit;font-size:14px;font-weight:600;padding:8px 12px;border-radius:8px;cursor:pointer;white-space:nowrap}
.tabbar button:hover{background:var(--chip);color:var(--ink)}
.tabbar button.on{background:var(--ink);color:var(--bg)}
.tabbar button .cnt{font-size:11px;font-weight:700;margin-left:5px;padding:0 6px;border-radius:999px;background:var(--chip);color:var(--chg)}
.tabbar button.on .cnt{background:rgba(255,255,255,.2);color:inherit}
.panel{display:none}.panel.on{display:block}
.panel>h2:first-child,.panel>div:first-child{margin-top:18px}
/* 장소·게임 */
.subtabs{display:flex;gap:6px;flex-wrap:wrap;margin:18px 0 14px}
.subtabs button{display:flex;align-items:center;gap:7px;border:1px solid var(--line);background:var(--panel);color:var(--ink);border-radius:999px;padding:5px 12px 5px 8px;font:inherit;font-size:13px;cursor:pointer}
.subtabs button.on{border-color:var(--ink);box-shadow:inset 0 0 0 1px var(--ink);font-weight:700}
.dot{width:14px;height:14px;border-radius:50%;border:1px solid rgba(0,0,0,.25);flex:none}
.gno{font-size:11px;color:var(--muted);font-weight:600}
.place-head{background:var(--panel);border:1px solid var(--line);border-left:6px solid var(--fog,#999);border-radius:12px;padding:14px 16px}
.place-head h2{margin:0 0 4px;font-size:22px}
.place-head h2 small{font-size:14px;color:var(--muted);font-weight:500;margin-left:6px}
.place-head p{margin:6px 0 0;color:var(--ink)}
.chips{display:flex;gap:6px;flex-wrap:wrap}
.chip{font-size:12px;background:var(--chip);border-radius:999px;padding:2px 9px;color:var(--muted)}
.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px}
.box{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:12px 14px;min-width:0}
.box h3,.sub h3{margin:0 0 8px;font-size:15px}
.clog{margin-bottom:10px}.clog ul{margin:0;padding-left:18px}.clog li{margin:5px 0;line-height:1.6}
.cmd{display:flex;align-items:center;gap:8px;padding:5px 0;border-top:1px dashed var(--line)}
.cmd:first-of-type{border-top:0}
.cmd code{flex:1 1 auto;min-width:0;font-size:13px;background:var(--code);padding:3px 8px;border-radius:6px;overflow-wrap:anywhere}
.cmd .lbl{font-size:12px;color:var(--muted);width:150px;flex:none}
.cmd-extra{font-size:12px;color:var(--muted);margin:-2px 0 4px 158px}
.copy{border:1px solid var(--line);background:var(--panel);color:var(--ink);border-radius:6px;font:inherit;font-size:12px;padding:2px 8px;cursor:pointer;flex:none}
.fogs{display:flex;gap:8px;flex-wrap:wrap}
.fog{display:flex;align-items:center;gap:6px;font-size:12px;background:var(--chip);border-radius:8px;padding:4px 8px}
.fog .sw{width:22px;height:16px;border-radius:4px;border:1px solid rgba(0,0,0,.25)}
.sub{margin-top:18px;scroll-margin-top:70px}
.sub>summary{list-style:none;cursor:pointer;padding:4px 0}
.sub>summary::-webkit-details-marker{display:none}
.sub>summary h3{display:inline-flex;align-items:baseline;gap:4px;margin:0}
.sub>summary h3::before{content:"▸";font-size:12px;color:var(--muted);transition:transform .15s;display:inline-block;width:14px}
.sub[open]>summary h3::before{transform:rotate(90deg)}
.sub>summary+*{margin-top:8px}
.sub h3 .n{font-size:12px;color:var(--muted);font-weight:500;margin-left:6px}
.jump{display:flex;gap:6px;flex-wrap:wrap;margin-top:14px}
.list{display:flex;flex-wrap:wrap;gap:6px}
.snd-play{display:flex;flex-wrap:wrap;align-items:center;gap:6px 12px;margin-top:6px}
.snd-play audio{height:34px;max-width:100%}
.list span{font-size:12px;background:var(--chip);border-radius:6px;padding:2px 8px}
.empty{font-size:13px;color:var(--muted)}
.place-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:10px}
.ptile{text-align:left;background:var(--panel);border:1px solid var(--line);border-top:5px solid var(--fog,#999);border-radius:12px;padding:12px 14px;cursor:pointer;font:inherit;color:var(--ink)}
.ptile:hover{border-color:var(--ink)}
.ptile b{font-size:16px}
.ptile .small{margin-top:4px}
.pair{display:flex;gap:6px;align-items:center;justify-content:center}
.pair figure{margin:0;text-align:center}
.pair figcaption{font-size:10px;color:var(--muted)}
/* 명령어 탭 */
.recipes{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px}
ol.steps{margin:0 0 6px;padding-left:22px}
ol.steps li{margin:4px 0}
ol.steps code,table.cmds code{font-size:13px;background:var(--code);padding:2px 7px;border-radius:6px;margin-right:6px;overflow-wrap:anywhere}
table.cmds td.c{white-space:nowrap;width:1%}
@media (max-width:760px){table.cmds td.c{white-space:normal}}
/* 텍스처 3D 비교 창 */
.b3d{margin-left:auto;font-weight:700}
.tile-foot{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
dialog#dlg3d{border:1px solid var(--line);border-radius:14px;padding:16px;background:var(--panel);color:var(--ink);width:min(960px,94vw);max-height:92vh}
dialog#dlg3d::backdrop{background:rgba(20,16,10,.55)}
.dlg-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}
.dlg-head b{font-size:15px;word-break:break-all}
#dlgModels{margin:10px 0}
.dlg-body{gap:12px}
canvas.v3d-dlg{display:block;width:100%;height:min(440px,56vh);cursor:grab;touch-action:none}
@media (max-width:760px){.info-grid{grid-template-columns:1fr}.cmd{flex-wrap:wrap}.cmd .lbl{width:100%}.cmd-extra{margin-left:0}}
@media (max-width:640px){td.key{width:auto}nav label{margin-left:0}#hostGrid{grid-template-columns:1fr}}
</style>
</head>
<body>
<header>
  <h1 id="title"></h1>
  <div class="meta" id="meta"></div>
</header>
<nav><div class="in">
  <div class="tabbar" id="tabbar" role="tablist"></div>
  <label><input type="checkbox" id="onlyChanged"> 바뀐 것만</label>
  <input type="search" id="q" placeholder="검색 (이름, 키, 파일)">
</div></nav>
<main>
  <section class="panel" id="p-summary"><h2>요약</h2><div class="cards" id="cards"></div>
    <h2 style="margin-top:26px">변경 기록 <span class="n">tools/changelog.js · 항목을 누르면 그 장소·탭으로</span></h2><div id="changelog"></div>
    <h2 style="margin-top:26px">장소·게임 <span class="n">눌러서 자세히 보기</span></h2><div class="place-grid" id="placeOverview"></div></section>
  <section class="panel" id="p-places"><div class="subtabs" id="placeTabs"></div><div id="placeBody"></div></section>
  <section class="panel" id="p-commands"><h2>명령어 <span class="n">게임 채팅창에 입력 · 복사 버튼으로 옮기기</span></h2>
    <div class="info-grid" style="margin-top:0">
      <div class="box"><h3>준비</h3><div class="small" style="color:var(--ink)">① 월드 설정에서 <b>치트(명령어) 허용</b>을 켭니다. ② 명령은 <b>호스트(운영자)</b>만 쓸 수 있습니다.
        ③ 게임 안에서 <b>T</b> 또는 <b>/</b> 키로 채팅창을 열고 붙여 넣습니다. 여러 줄을 한꺼번에 붙여 넣을 수는 없으니 한 줄씩 입력하세요.</div></div>
      <div class="box"><h3>치트 안전장치</h3><div class="small" style="color:var(--ink)"><span class="badge b-changed">디버그</span> 표시가 붙은 치트는
        <b>디버그 모드</b>(/function dev/debug/on)를 켠 사람만, <b>연습 경기</b>에서만 동작합니다. 혼천의로 시작한 어전대회 경기 중에는 스스로 거부하므로
        실제 경기의 규칙·진행·승리 기록에는 영향이 없습니다. 모든 개발용 명령은 <code>functions/dev/</code>의 새 파일이고 기존 게임 파일은 바꾸지 않습니다.</div></div>
    </div>
    <h2 style="margin-top:22px;font-size:17px">자주 쓰는 순서 <span class="n">위에서부터 차례로 입력</span></h2><div class="recipes" id="cmdRecipes"></div>
    <div id="cmdGroups"></div>
    <h2 style="margin-top:22px;font-size:17px">게임별 진행 지점 <span class="n">치트가 건너뛰는 곳 (.seq, 20 = 1초)</span></h2>
    <table><thead><tr><th>게임</th><th>act</th><th>경기 시작</th><th>경기 끝</th><th>설명</th></tr></thead><tbody id="cmdSeqs"></tbody></table>
  </section>
  <section class="panel" id="p-models"><h2>3D 모델 비교 <span class="n" id="modelN"></span></h2>
    <p class="small" style="margin:-6px 0 10px">텍스처가 입혀지는 게임 모델을 변경 전(왼쪽)과 후(오른쪽)로 나란히 그립니다. 드래그하면 함께 돌고, 두 번 누르면 멈춥니다. 화면에 보이는 카드만 그립니다.</p>
    <div id="modelGroups"></div></section>
  <section class="panel" id="p-hosts"><h2>호스트 NPC <span class="n">텍스처 64×64 · 원본 대비</span></h2><div class="grid" id="hostGrid"></div></section>
  <section class="panel" id="p-items"><h2>아이템 <span class="n">아이콘 · 이름</span></h2><div class="grid" id="itemGrid"></div></section>
  <section class="panel" id="p-lang"><h2>문구 (ko_KR) <span class="n" id="langN"></span></h2><div class="tabs" id="langTabs"></div>
    <table><thead><tr><th>키</th><th>원본</th><th>현재</th></tr></thead><tbody id="langBody"></tbody></table></section>
  <section class="panel" id="p-textures"><h2>텍스처 전체 <span class="n" id="texN"></span></h2>
    <p class="small" style="margin:-6px 0 10px"><label><input type="checkbox" id="only3d"> 3D 모델이 있는 것만</label> · 타일의 <b>3D</b> 버튼을 누르면 게임 모델에 씌운 모습을 변경 전/후로 비교합니다.</p><div class="tabs" id="texTabs"></div><div class="tex-grid" id="texGrid"></div></section>
  <section class="panel" id="p-sounds"><h2>사운드 <span class="n" id="sndN"></span></h2>
    <table><thead><tr><th>사운드 이벤트</th><th>원본 파일</th><th>현재 파일</th></tr></thead><tbody id="sndBody"></tbody></table>
    <p class="small" id="sndFiles"></p></section>
  <section class="panel" id="p-files"><h2>원본 대비 바뀐 파일 <span class="n" id="fileN"></span></h2>
    <table><thead><tr><th style="width:90px">상태</th><th>파일</th></tr></thead><tbody id="fileBody"></tbody></table>
    <h2 style="margin-top:18px;font-size:16px">규칙 보존 검사</h2><pre id="guard"></pre></section>
</main>
<dialog id="dlg3d" aria-labelledby="dlgTitle">
  <div class="dlg-head"><div><b id="dlgTitle"></b> <span id="dlgBadges"></span></div><button class="copy" id="dlgClose">닫기</button></div>
  <div class="subtabs" id="dlgModels"></div>
  <div class="dual dlg-body" id="dlgBody"></div>
  <div class="small" id="dlgNote"></div>
</dialog>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script>
const D =${JSON.stringify(data).replace(/</g, "\\u003c")};
const $ = id => document.getElementById(id);
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const LABEL = {new:"새 파일",changed:"변경됨",same:"원본",deleted:"삭제됨",none:"아이콘 없음"};
const badge = s => '<span class="badge b-'+s+'">'+LABEL[s]+'</span>';
// 마인크래프트 서식 코드(§)를 색으로 보여 준다
const COLORS = {"0":"#000","1":"#00a","2":"#0a0","3":"#0aa","4":"#a00","5":"#a0a","6":"#fa0","7":"#aaa","8":"#555","9":"#55f",
  a:"#5f5",b:"#5ff",c:"#f55",d:"#f5f",e:"#ff5",f:"#fff",g:"#ddd605",m:"#971607",n:"#b4684d",h:"#e3d4d1",i:"#cecaca",j:"#443a3b",p:"#deb12d",q:"#11a036",s:"#2cbaa8",t:"#21497b",u:"#9a5cc6"};
function mc(s) {
  if (s == null) return '<span class="before">(없음)</span>';
  let out = "", color = null, bold = false, italic = false, buf = "";
  const flush = () => { if (!buf) return; let st = []; if (color) st.push("color:"+color+";text-shadow:0 0 1px rgba(0,0,0,.6)"); if (bold) st.push("font-weight:700"); if (italic) st.push("font-style:italic");
    out += st.length ? '<span style="'+st.join(";")+'">'+esc(buf)+"</span>" : esc(buf); buf = ""; };
  const txt = s.replace(/%1/g, "\\n").replace(/ {3,}/g, "\\n");
  for (let i = 0; i < txt.length; i++) {
    if (txt[i] === "§" && i + 1 < txt.length) { flush(); const c = txt[++i].toLowerCase();
      if (c === "r") { color = null; bold = italic = false; } else if (c === "l") bold = true; else if (c === "o") italic = true; else if (COLORS[c]) color = COLORS[c]; continue; }
    buf += txt[i];
  }
  flush(); return '<span class="mc">'+out+"</span>";
}
const q = () => $("q").value.trim().toLowerCase();
const only = () => $("onlyChanged").checked;
const match = (...xs) => !q() || xs.some(x => String(x ?? "").toLowerCase().includes(q()));

function renderHeader() {
  $("title").innerHTML = esc(D.world) + " <small>개발자 페이지</small>";
  $("meta").innerHTML = "생성: " + esc(D.generated) + " · 최근 커밋: " + esc(D.head) + (D.dirty ? ' · <span class="warn">커밋하지 않은 변경 있음</span>' : "") + " · 비교 기준: <code>" + esc(D.baseline) + "</code>";
  const nLang = D.langRows.filter(r => r.changed).length, nTex = D.pngs.filter(p => p.status !== "same").length;
  const cards = [
    ["규칙 보존 검사", D.guard.ok ? "통과" : "실패", D.guard.ok ? "ok" : "bad"],
    ["바뀐 문구", nLang + " / " + D.langRows.length, ""],
    ["바뀐·새 텍스처", nTex + " / " + D.pngs.length, ""],
    ["바뀐 사운드", D.sounds.filter(s => s.changed).length, ""],
    ["바뀐 파일(월드 데이터 제외)", D.changedFiles.length, ""],
  ];
  $("cards").innerHTML = cards.map(([k, v, c]) => '<div class="card '+c+'"><b>'+esc(v)+"</b><span>"+esc(k)+"</span></div>").join("");
  // 변경 기록: 항목마다 장소 칩(장소 페이지로)과 탭 칩(그 탭으로)
  const TABNAME = Object.fromEntries(TABS);
  $("changelog").innerHTML = (D.changelog || []).map(e => '<div class="box clog"><h3>'+esc(e.title)+' <span class="small">'+esc(e.date)+"</span></h3><ul>"
    + e.items.map(it => "<li>"+esc(it.text)
      + (it.place ? ' <button class="copy" data-go="places/'+esc(it.place)+'">'+esc((D.sections.find(s => s.id === it.place) || {}).title || it.place)+"</button>" : "")
      + (it.tab ? ' <button class="copy" data-go="'+esc(it.tab)+'">'+esc(TABNAME[it.tab] || it.tab)+" 탭</button>" : "") + "</li>").join("")
    + "</ul></div>").join("");
}
function tileHost(h, isWheel) {
  const changed = h.texStatus !== "same" || h.nameBefore !== h.name || (h.geoStatus && h.geoStatus !== "same");
  if (only() && !changed) return "";
  if (!match(h.name, h.nameBefore, h.id, h.game, h.dialogue)) return "";
  const view = (src, ver) => {
    const flat = '<div class="img"><img class="px" src="'+esc(src)+'" width="'+(isWheel?128:192)+'"></div>';
    return h.model && h.texData
      ? '<div class="dual"><div>'+flat+'<div class="cap">평면(텍스처)</div></div><div><div class="v3d-wrap"><canvas class="v3d" data-host="'+esc(h.id)+'" data-ver="'+ver+'"></canvas><span class="hint">'+(isWheel ? "드래그: 둘러보기 · 클릭: 바퀴 돌리기" : "드래그해서 돌리기")+'</span></div><div class="cap">3D(게임 모델)</div></div></div>'
      : flat;
  };
  const media = h.before
    ? '<div class="ver">변경 전 <span>원본(' + esc(D.baseline) + ')</span></div>' + view(h.before.texData || h.texData || h.tex, "before")
      + '<div class="ver">변경 후 <span>현재</span></div>' + view(h.texData || h.tex, "after")
    : view(h.texData || h.tex, "after"); // 파일 경로 대신 내장 데이터를 써서 브라우저 캐시에 옛 그림이 남지 않게 한다
  if (h.draft) return '<div class="tile">'+media
    + "<h3>"+mc(h.name)+' <span class="badge b-new">시안</span></h3>'
    + '<div>텍스처 '+badge(h.texStatus)+" · 모델 "+badge(h.geoStatus)+"</div>"
    + '<div class="small">'+esc(h.note)+"</div></div>";
  return '<div class="tile">'+media
    + "<h3>"+mc(h.name)+"</h3>"
    + '<div class="small">원래 이름: '+mc(h.nameBefore)+"</div>"
    + '<div>텍스처 '+badge(h.texStatus)+(h.geoStatus ? " · 모델 "+badge(h.geoStatus) : "")+"</div>"
    + '<div class="small">'+(isWheel ? "게임판" : esc(h.id)+" · 게임 "+esc(h.game))+" · 버튼: "+mc(h.button)+"</div>"
    + '<div class="small">'+mc(h.dialogue)+"</div></div>";
}
function tileItem(it) {
  const changed = it.texStatus === "changed" || it.texStatus === "new" || it.nameBefore !== it.name;
  if (only() && !changed) return "";
  if (!match(it.id, it.name, it.nameBefore)) return "";
  return '<div class="tile"><div class="img" style="min-height:80px">'+(it.tex ? '<img class="px" src="'+esc(it.tex)+'" width="64">' : "")+"</div>"
    + "<h3>"+mc(it.name)+"</h3>"
    + '<div class="small">'+esc(it.id)+" · 원래: "+mc(it.nameBefore)+"</div>"
    + "<div>아이콘 "+badge(it.texStatus)+(it.nameBefore !== it.name ? ' <span class="badge b-changed">이름 변경</span>' : "")+"</div></div>";
}
let langTab = "전체", texTab = "전체";
function tabs(el, names, cur, set) {
  el.innerHTML = names.map(n => '<button class="'+(n===cur?"on":"")+'">'+esc(n)+"</button>").join("");
  [...el.children].forEach((b, i) => b.onclick = () => { set(names[i]); render(); });
}
const langRow = r => '<tr><td class="key">'+esc(r.key)+(r.changed?' <span class="badge b-changed">변경</span>':"")+'</td><td class="before">'+mc(r.before)+"</td><td>"+mc(r.after)+"</td></tr>";
function texTile(p) {
  const w = Math.min(128, Math.max(48, p.w * 4)), src = p.data || p.file;
  const img = (s, width) => '<img class="px" loading="lazy" src="'+esc(s)+'" width="'+width+'">';
  const pic = p.status === "deleted" ? "" : p.beforeData
    ? '<div class="pair"><figure>'+img(p.beforeData, Math.round(w * 0.6))+'<figcaption>원본</figcaption></figure><figure>'+img(src, Math.round(w * 0.6))+"<figcaption>현재</figcaption></figure></div>"
    : img(src, w);
  const b3d = p.models ? '<button class="copy b3d" data-3d="'+esc(p.rel)+'" title="게임 모델에 씌워 보기'+(p.status !== "same" ? " (변경 전/후 비교)" : "")+'">3D</button>' : "";
  return '<div class="tile"><div class="img">'+pic+'</div>'+(p.names ? '<div class="nm">'+esc(nameLine(p.names))+"</div>" : "")+'<div class="tile-foot">'+badge(p.status)+' <span class="small">'+p.w+"×"+p.h+"</span>"+b3d+'</div><div class="small">'+esc(p.rel)+"</div></div>";
}
// ---------- 구역 3D: devpage-areas/<id>.js의 블록 격자를 브라우저에서 입체로 만든다 ----------
// 보기는 한 번에 하나(WebGL 맥락 하나). 장소 화면을 다시 그리면 닫는다.
const AV = { r: null };
function areaPanel(ar) {
  if (!ar.length) return '<div class="empty">아직 없음 — <code>python tools/export-areas.py</code>를 실행하면 생깁니다</div>';
  return '<div class="a3-bar">' + ar.map(a => '<button class="copy" data-area="'+esc(a.id)+'">'+esc(a.title)+' <span class="small">'+a.size.join("×")+" · "+a.kb+"KB</span></button>").join("")
    + '<span style="flex:1"></span><button class="copy on" data-a3which="now">현재 텍스처</button><button class="copy" data-a3which="van">원본 텍스처</button>'
    + '<label class="small">높이 <input type="range" class="a3-y" min="0" max="0" value="0" disabled> <span class="a3-yv"></span></label>'
    + '<button class="copy" data-a3reset="1">시점 처음으로</button></div>'
    + '<div class="a3-view"><canvas class="a3"></canvas><div class="a3-status small">구역을 누르면 불러옵니다 · 뽑은 때: '+esc(ar[0].when)+'</div></div>'
    + '<div class="small" style="margin-top:6px">왼쪽 끌기: 돌리기 · 오른쪽 끌기 또는 Shift+끌기: 옮기기 · 휠: 확대·축소 · 높이: 그 위를 잘라 숲·동굴 안을 보기 · 원본 텍스처: 바닐라 그림으로 (리소스팩 리테마 전 모습)'
    + ' · 월드 저장 상태 기준이라 건축을 바꾼 뒤에는 <code>python tools/export-areas.py</code>를 다시 실행</div>';
}
function loadScriptOnce(src) {
  return new Promise((ok, no) => {
    if (document.querySelector('script[data-src="' + src + '"]')) return ok();
    const s = document.createElement("script");
    s.src = src; s.dataset.src = src; s.onload = () => ok(); s.onerror = () => no(new Error(src + " 를 불러오지 못함"));
    document.head.appendChild(s);
  });
}
async function areaGrid(A) {
  if (A.grid) return A.grid;
  const bin = atob(A.data), u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  const buf = await new Response(new Blob([u8]).stream().pipeThrough(new DecompressionStream("deflate-raw"))).arrayBuffer();
  A.grid = new Uint16Array(buf);
  return A.grid;
}
// 면: +x −x +y −y +z −z. 네 모서리와 텍스처 좌표(u, v: 아래가 0)를 상자 범위로 만든다
const A3FACE = [
  (b) => [[b[3],b[1],b[5], 1-b[5],b[1]], [b[3],b[1],b[2], 1-b[2],b[1]], [b[3],b[4],b[2], 1-b[2],b[4]], [b[3],b[4],b[5], 1-b[5],b[4]]],
  (b) => [[b[0],b[1],b[2], b[2],b[1]], [b[0],b[1],b[5], b[5],b[1]], [b[0],b[4],b[5], b[5],b[4]], [b[0],b[4],b[2], b[2],b[4]]],
  (b) => [[b[0],b[4],b[5], b[0],1-b[5]], [b[3],b[4],b[5], b[3],1-b[5]], [b[3],b[4],b[2], b[3],1-b[2]], [b[0],b[4],b[2], b[0],1-b[2]]],
  (b) => [[b[0],b[1],b[2], b[0],b[2]], [b[3],b[1],b[2], b[3],b[2]], [b[3],b[1],b[5], b[3],b[5]], [b[0],b[1],b[5], b[0],b[5]]],
  (b) => [[b[0],b[1],b[5], b[0],b[1]], [b[3],b[1],b[5], b[3],b[1]], [b[3],b[4],b[5], b[3],b[4]], [b[0],b[4],b[5], b[0],b[4]]],
  (b) => [[b[3],b[1],b[2], 1-b[3],b[1]], [b[0],b[1],b[2], 1-b[0],b[1]], [b[0],b[4],b[2], 1-b[0],b[4]], [b[3],b[4],b[2], 1-b[3],b[4]]],
];
const A3SHADE = [0.8, 0.7, 1, 0.5, 0.88, 0.62], A3DIR = [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
function areaMesh(A, grid, yMax) {
  const B = window.AREA_BLOCKS, T = B.types, sx = A.size[0], sz = A.size[2], cols = B.cols, rows = B.rows;
  const full = new Uint8Array(T.length), conn = new Uint8Array(T.length), water = new Uint8Array(T.length);
  T.forEach((t, i) => { full[i] = t.s === "cube" && !t.t ? 1 : 0; conn[i] = full[i] || t.s === "fence" || t.s === "wall" || t.s === "pane" ? 1 : 0; water[i] = t.s === "water" ? 1 : 0; });
  const at = (x, y, z) => (x < 0 || y < 0 || z < 0 || x >= sx || z >= sz || y > yMax) ? 0 : grid[(y * sz + z) * sx + x];
  const mk = () => ({ p: [], n: [], v: [], c: [], i: [] });
  const G = { s: mk(), w: mk() };
  const uv = (tile, u, v, out) => {
    const col = tile % cols, row = Math.floor(tile / cols);
    out.push((col + 0.002 + u * 0.996) / cols, 1 - (row + 1 - 0.002 - v * 0.996) / rows);
  };
  function quad(g, X, Y, Z, pts, tn, tv, shade) {
    if (tn < 0 && tv < 0) return;
    const base = g.p.length / 3;
    for (const q of pts) {
      g.p.push(X + q[0], Y + q[1], Z + q[2]);
      uv(tn < 0 ? tv : tn, q[3], q[4], g.n); uv(tv < 0 ? tn : tv, q[3], q[4], g.v);
      g.c.push(shade, shade, shade);
    }
    g.i.push(base, base + 1, base + 2, base, base + 2, base + 3);
  }
  // 상자 하나: 블록 경계에 닿은 면은 옆이 꽉 찬 블록이면 그리지 않는다 (같은 종류의 투명 블록끼리도)
  function box(g, X, Y, Z, id, b, t) {
    for (let f = 0; f < 6; f++) {
      const edge = [b[3] === 1, b[0] === 0, b[4] === 1, b[1] === 0, b[5] === 1, b[2] === 0][f];
      if (edge) { const d = A3DIR[f], nb = at(X + d[0], Y + d[1], Z + d[2]); if (full[nb] || (nb === id && T[id].s === "cube")) continue; }
      quad(g, X, Y, Z, A3FACE[f](b), t.now[f], t.van[f], A3SHADE[f]);
    }
  }
  const ys = Math.min(yMax, A.size[1] - 1);
  for (let y = 0; y <= ys; y++) for (let z = 0; z < sz; z++) for (let x = 0; x < sx; x++) {
    const id = grid[(y * sz + z) * sx + x];
    if (!id) continue;
    const t = T[id], s = t.s, g = G.s;
    if (s === "none") continue;
    if (s === "cube" || s === "lava") { box(g, x, y, z, id, [0,0,0,1,1,1], t); continue; }
    if (s === "slab") { box(g, x, y, z, id, t.top ? [0,.5,0,1,1,1] : [0,0,0,1,.5,1], t); continue; }
    if (s === "stairs") {
      box(g, x, y, z, id, t.up ? [0,.5,0,1,1,1] : [0,0,0,1,.5,1], t);
      const y0 = t.up ? 0 : .5, y1 = t.up ? .5 : 1;
      box(g, x, y, z, id, [[.5,y0,0,1,y1,1], [0,y0,0,.5,y1,1], [0,y0,.5,1,y1,1], [0,y0,0,1,y1,.5]][t.dir & 3], t);
      continue;
    }
    if (s === "fence" || s === "wall" || s === "pane") {
      const w = s === "wall" ? .25 : s === "fence" ? .125 : .0625, h = s === "wall" ? .8125 : s === "fence" ? .9375 : 1, lo = s === "fence" ? .375 : 0;
      const e = conn[at(x + 1, y, z)], ww = conn[at(x - 1, y, z)], so = conn[at(x, y, z + 1)], no = conn[at(x, y, z - 1)];
      if (s !== "pane") box(g, x, y, z, id, [.5 - w, 0, .5 - w, .5 + w, s === "wall" ? 1 : 1, .5 + w], t);
      const a = s === "pane" ? .0625 : s === "fence" ? .0625 : .1875;
      const none = !e && !ww && !so && !no && s === "pane";
      if (e || none) box(g, x, y, z, id, [.5, lo, .5 - a, 1, h, .5 + a], t);
      if (ww || none) box(g, x, y, z, id, [0, lo, .5 - a, .5, h, .5 + a], t);
      if (so || none) box(g, x, y, z, id, [.5 - a, lo, .5, .5 + a, h, 1], t);
      if (no || none) box(g, x, y, z, id, [.5 - a, lo, 0, .5 + a, h, .5], t);
      continue;
    }
    if (s === "door") { const o = (t.dir + (t.open ? 1 : 0)) & 1; box(g, x, y, z, id, o ? [0,0,0,1,1,.1875] : [0,0,0,.1875,1,1], t); continue; }
    if (s === "trapdoor") { box(g, x, y, z, id, t.open ? ((t.dir & 2) ? [0,0,0,1,1,.1875] : [0,0,0,.1875,1,1]) : t.up ? [0,.8125,0,1,1,1] : [0,0,0,1,.1875,1], t); continue; }
    if (s === "flat") { box(g, x, y, z, id, [0,0,0,1,Math.max(1, t.h) / 16,1], t); continue; }
    if (s === "small") { box(g, x, y, z, id, [.4375,0,.4375,.5625,.625,.5625], t); continue; }
    if (s === "vine") {
      const k = t.bits, d = .03;
      if (k & 1) box(g, x, y, z, id, [0,0,1-d,1,1,1], t); if (k & 2) box(g, x, y, z, id, [0,0,0,d,1,1], t);
      if (k & 4) box(g, x, y, z, id, [0,0,0,1,1,d], t); if (k & 8) box(g, x, y, z, id, [1-d,0,0,1,1,1], t);
      continue;
    }
    if (s === "cross") {
      quad(g, x, y, z, [[0,0,0,0,0],[1,0,1,1,0],[1,1,1,1,1],[0,1,0,0,1]], t.now[5], t.van[5], 0.9);
      quad(g, x, y, z, [[1,0,0,0,0],[0,0,1,1,0],[0,1,1,1,1],[1,1,0,0,1]], t.now[5], t.van[5], 0.9);
      continue;
    }
    if (s === "water") {
      const top = water[at(x, y + 1, z)] ? 1 : .875;
      for (let f = 0; f < 6; f++) {
        const d = A3DIR[f], nb = at(x + d[0], y + d[1], z + d[2]);
        if (water[nb] || full[nb] || (f === 3)) continue;
        quad(G.w, x, y, z, A3FACE[f]([0,0,0,1,top,1]), t.now[f], t.van[f], A3SHADE[f]);
      }
    }
  }
  return G;
}
function a3Geometry(g) {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(g.p, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(g.c, 3));
  geo.userData.uvNow = new THREE.Float32BufferAttribute(g.n, 2);
  geo.userData.uvVan = new THREE.Float32BufferAttribute(g.v, 2);
  geo.setAttribute("uv", geo.userData.uvNow);
  geo.setIndex(g.p.length / 3 > 65535 ? new THREE.Uint32BufferAttribute(g.i, 1) : new THREE.Uint16BufferAttribute(g.i, 1));
  return geo;
}
function closeArea() {
  if (!AV.r) return;
  AV.r.dispose(); AV.r.forceContextLoss(); AV.r = null; AV.id = null; AV.scene = null;
}
function a3Status(msg) { const s = document.querySelector(".a3-status"); if (s) s.textContent = msg; }
async function openArea(id) {
  if (typeof THREE === "undefined") return a3Status("3D 보기는 인터넷 연결이 필요합니다 (three.js를 불러오지 못함)");
  if (typeof DecompressionStream === "undefined") return a3Status("이 브라우저는 압축 풀기(DecompressionStream)를 지원하지 않습니다 — 최신 Chrome·Edge에서 여세요");
  document.querySelectorAll("[data-area]").forEach(b => b.classList.toggle("on", b.dataset.area === id));
  a3Status("불러오는 중…");
  try { await loadScriptOnce("devpage-areas/blocks.js"); await loadScriptOnce("devpage-areas/" + id + ".js"); }
  catch (e) { return a3Status(e.message + " — devpage.html과 같은 폴더의 devpage-areas/가 필요합니다"); }
  const A = window.AREAS[id], grid = await areaGrid(A);
  const cv = document.querySelector("canvas.a3");
  if (!cv) return;
  closeArea();
  const r = AV.r = new THREE.WebGLRenderer({ canvas: cv, antialias: true });
  r.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  r.outputEncoding = THREE.sRGBEncoding;
  const scene = AV.scene = new THREE.Scene();
  scene.background = new THREE.Color(0xc9e0f5);
  const cam = AV.cam = new THREE.PerspectiveCamera(50, 1, 0.5, 4000);
  if (!AV.atlas) {
    AV.atlas = new THREE.TextureLoader().load(window.AREA_BLOCKS.atlas, () => a3Draw());
    AV.atlas.magFilter = THREE.NearestFilter; AV.atlas.minFilter = THREE.NearestFilter; AV.atlas.generateMipmaps = false; AV.atlas.encoding = THREE.sRGBEncoding;
  }
  AV.matS = new THREE.MeshBasicMaterial({ map: AV.atlas, vertexColors: true, alphaTest: 0.5, side: THREE.DoubleSide });
  AV.matW = new THREE.MeshBasicMaterial({ map: AV.atlas, vertexColors: true, transparent: true, opacity: 0.75, side: THREE.DoubleSide, depthWrite: false });
  AV.id = id; AV.A = A; AV.grid = grid;
  // 처음 높이: 동굴·숲처럼 위를 잘라야 보이는 구역은 내보낼 때 정한 높이(view.yMax, 월드 Y)부터
  AV.yMax = A.view && A.view.yMax != null ? Math.max(0, Math.min(A.size[1] - 1, A.view.yMax - A.box[4])) : A.size[1] - 1;
  const sl = document.querySelector(".a3-y");
  if (sl) { sl.max = A.size[1] - 1; sl.value = AV.yMax; sl.disabled = false; }
  a3Build(); a3Reset();
}
function a3Build() {
  if (!AV.r) return;
  const t0 = performance.now();
  if (AV.group) { AV.scene.remove(AV.group); AV.group.children.forEach(m => m.geometry.dispose()); }
  const G = areaMesh(AV.A, AV.grid, AV.yMax);
  const grp = AV.group = new THREE.Group();
  grp.add(new THREE.Mesh(a3Geometry(G.s), AV.matS));
  if (G.w.p.length) { const w = new THREE.Mesh(a3Geometry(G.w), AV.matW); w.renderOrder = 1; grp.add(w); }
  grp.position.set(-AV.A.size[0] / 2, 0, -AV.A.size[2] / 2);
  AV.scene.add(grp);
  a3Which(AV.which || "now");
  const faces = (G.s.i.length + G.w.i.length) / 6, b = AV.A.box, yv = document.querySelector(".a3-yv");
  if (yv) yv.textContent = "Y ≤ " + (b[4] + AV.yMax);
  a3Status(AV.A.title + " · X " + b[0] + "~" + b[2] + " · Z " + b[1] + "~" + b[3] + " · Y " + b[4] + "~" + (b[4] + AV.yMax)
    + " · 면 " + faces.toLocaleString() + "개 · " + Math.round(performance.now() - t0) + "ms");
  a3Draw();
}
function a3Which(w) {
  AV.which = w;
  document.querySelectorAll("[data-a3which]").forEach(b => b.classList.toggle("on", b.dataset.a3which === w));
  if (!AV.group) return;
  AV.group.children.forEach(m => m.geometry.setAttribute("uv", w === "van" ? m.geometry.userData.uvVan : m.geometry.userData.uvNow));
  a3Draw();
}
function a3Reset() {
  const s = AV.A.size, grid = AV.grid;
  let top = 0;   // 가운데 기둥에서 가장 높은 블록 근처를 바라본다
  for (let y = s[1] - 1; y >= 0 && !top; y--) for (let dz = -3; dz <= 3 && !top; dz++) for (let dx = -3; dx <= 3; dx++) {
    const x = (s[0] >> 1) + dx, z = (s[2] >> 1) + dz;
    if (grid[(y * s[2] + z) * s[0] + x]) { top = y; break; }
  }
  AV.tgt = new THREE.Vector3(0, Math.min(top, AV.yMax), 0);
  AV.dist = Math.max(s[0], s[2]) * 1.05; AV.yaw = 0.7; AV.pitch = 0.55;
  a3Draw();
}
function a3Draw() {
  const r = AV.r;
  if (!r || !AV.tgt) return;
  const cv = r.domElement, w = cv.clientWidth, h = cv.clientHeight;
  if (cv.width !== Math.round(w * r.getPixelRatio()) || cv.height !== Math.round(h * r.getPixelRatio())) r.setSize(w, h, false);
  const cam = AV.cam, cp = Math.cos(AV.pitch);
  cam.aspect = w / h; cam.updateProjectionMatrix();
  cam.position.set(AV.tgt.x + AV.dist * cp * Math.sin(AV.yaw), AV.tgt.y + AV.dist * Math.sin(AV.pitch), AV.tgt.z + AV.dist * cp * Math.cos(AV.yaw));
  cam.lookAt(AV.tgt);
  r.render(AV.scene, cam);
}
// 끌기·휠
(function () {
  let drag = null;
  document.addEventListener("pointerdown", e => {
    if (!e.target.matches?.("canvas.a3") || !AV.r) return;
    drag = { x: e.clientX, y: e.clientY, pan: e.button === 2 || e.shiftKey };
    e.target.setPointerCapture(e.pointerId);
  });
  document.addEventListener("pointermove", e => {
    if (!drag || !AV.r) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    drag.x = e.clientX; drag.y = e.clientY;
    if (drag.pan) {
      const k = AV.dist * 0.0016, sy = Math.sin(AV.yaw), cy = Math.cos(AV.yaw);
      AV.tgt.x += (-dx * cy - dy * sy) * k; AV.tgt.z += (dx * sy - dy * cy) * k;
    } else {
      AV.yaw -= dx * 0.006; AV.pitch = Math.max(-0.2, Math.min(1.5, AV.pitch + dy * 0.006));
    }
    a3Draw();
  });
  document.addEventListener("pointerup", () => { drag = null; });
  document.addEventListener("contextmenu", e => { if (e.target.matches?.("canvas.a3")) e.preventDefault(); });
  document.addEventListener("wheel", e => {
    if (!e.target.matches?.("canvas.a3") || !AV.r) return;
    e.preventDefault();
    AV.dist = Math.max(8, Math.min(3000, AV.dist * Math.exp(e.deltaY * 0.001)));
    a3Draw();
  }, { passive: false });
  let yTimer = 0;
  document.addEventListener("input", e => {
    if (!e.target.matches?.(".a3-y") || !AV.r) return;
    AV.yMax = +e.target.value;
    const yv = document.querySelector(".a3-yv"); if (yv) yv.textContent = "Y ≤ " + (AV.A.box[4] + AV.yMax);
    clearTimeout(yTimer); yTimer = setTimeout(a3Build, 120);
  });
  window.addEventListener("resize", () => a3Draw());
})();

// ---------- 3D 모델 비교 카드 ----------
const nameLine = n => n.before && n.after && n.before !== n.after ? n.before + " → " + n.after : n.after || n.before || "";
// 카드 하나 = 텍스처 한 장 × 그 텍스처를 쓰는 모델 하나. 원본과 다르면 변경 전/후를 한 캔버스에 나란히
function pairParts(p, i) {
  const m = p.models[i], out = [];
  const differs = p.status !== "same" || m.before !== m.after;
  const beforeTex = p.beforeData || (p.status === "same" ? p.data : null);
  if (differs && m.before && D.geo[m.before] && beforeTex) out.push({ model: D.geo[m.before], texData: beforeTex, frames: m.frames, side: "before" });
  if (m.after && D.geo[m.after] && p.data) out.push({ model: D.geo[m.after], texData: p.data, frames: m.frames, side: "after" });
  return out;
}
let CARDS = null;
function allCards() {
  if (CARDS) return CARDS;
  CARDS = [];
  for (const p of D.pngs) (p.models || []).forEach((m, i) => {
    const parts = pairParts(p, i);
    if (parts.length) CARDS.push({ p, i, m, parts, changed: p.status !== "same" || m.before !== m.after });
  });
  return CARDS;
}
function modelCard(c) {
  const { p, i, m, parts } = c, n = m.names || {};
  const two = parts.length > 1, title = nameLine(n) || m.label;
  const lab = (side, cls) => '<span class="lab '+cls+'">'+(side === "before" ? "변경 전" : p.status === "new" ? "새 모델" : c.changed ? "변경 후" : "현재")
    + ((side === "before" ? n.before : n.after) ? " · " + esc(side === "before" ? n.before : n.after) : "")+"</span>";
  return '<div class="mcard"><h3>'+esc(title)+'</h3><div class="small">'+esc(m.label)+" · "+esc(texRel(p))+"</div>"
    + '<div class="v3d-wrap"><canvas class="v3d pair" data-tex="'+esc(p.rel)+'" data-idx="'+i+'"></canvas>'
    + (two ? lab("before", "l") + lab("after", "r") : lab(parts[0].side, "l")) + '<span class="hint">드래그해서 돌리기</span></div>'
    + '<div class="tile-foot">'+badge(p.status)+(m.before !== m.after ? ' <span class="badge b-changed">모델 변경</span>' : "")
    + (m.unused ? ' <span class="badge b-same">지금 게임에서 안 씀</span>' : "")
    + '<button class="copy b3d" data-3d="'+esc(p.rel)+'" data-3d-idx="'+i+'">크게 보기</button></div></div>';
}
const cardShown = c => (!only() || c.changed) && match(c.p.rel, c.m.label, c.m.names?.before, c.m.names?.after);
function renderModels() {
  const cards = allCards().filter(cardShown), used = new Set();
  const groups = D.sections.map(s => {
    const st = secTex(s), mine = cards.filter(c => !used.has(c) && st.includes(c.p));
    mine.forEach(c => used.add(c));
    return [s.title, mine];
  });
  groups.push(["기타", cards.filter(c => !used.has(c))]);
  $("modelN").textContent = "표시 " + cards.length + " · 바뀐 " + allCards().filter(c => c.changed).length;
  $("modelGroups").innerHTML = groups.filter(([, cs]) => cs.length).map(([t, cs]) => '<h2 style="margin-top:20px;font-size:17px">'+esc(t)+' <span class="n">'+cs.length+'</span></h2><div class="mgrid">'+cs.map(modelCard).join("")+"</div>").join("")
    || '<div class="empty">없음</div>';
}

// ---------- 탭 ----------
const TABS = [["summary", "요약"], ["places", "장소·게임"], ["commands", "명령어"], ["hosts", "호스트"], ["models", "3D 모델"], ["items", "아이템"], ["lang", "문구"], ["textures", "텍스처"], ["sounds", "사운드"], ["files", "파일"]];
const view = { tab: "summary", place: D.sections[0].id };
function readHash() {
  const [t, p] = decodeURIComponent(location.hash.slice(1)).split("/");
  if (TABS.some(([id]) => id === t)) view.tab = t;
  if (p && D.sections.some(s => s.id === p)) view.place = p;
}
const go = (tab, place) => { location.hash = tab + (place ? "/" + place : ""); };
function renderTabbar() {
  const n = {
    places: D.sections.length, commands: D.commands.groups.reduce((a, g) => a + g.items.length, 0), hosts: D.hosts.filter(h => h.texStatus !== "same").length,
    items: D.items.filter(i => i.texStatus !== "same" || i.nameBefore !== i.name).length, models: allCards().filter(c => c.changed).length,
    lang: D.langRows.filter(r => r.changed).length, textures: D.pngs.filter(p => p.status !== "same").length,
    sounds: D.sounds.filter(s => s.changed).length, files: D.changedFiles.length,
  };
  $("tabbar").innerHTML = TABS.map(([id, label]) => '<button role="tab" data-tab="'+id+'" class="'+(view.tab === id ? "on" : "")+'">'+esc(label)
    + (n[id] ? '<span class="cnt">'+n[id]+"</span>" : "") + "</button>").join("");
}

// ---------- 장소·게임 ----------
const openState = {}; // 접고 편 상태를 다시 그려도 유지
const RX = {};
const rx = s => RX[s] || (RX[s] = new RegExp(s));
const texRel = p => p.rel.replace(/^textures\\//, "");
const secLang = s => D.langRows.filter(r => s.lang.some(re => rx(re).test(r.key)));
const secTex = s => D.pngs.filter(p => s.tex.some(re => rx(re).test(texRel(p))) || s.entityTex.includes(texRel(p)));
const secItems = s => s.items ? D.items.filter(i => rx(s.items).test(i.id)) : [];
const secHost = s => s.host === "wheel" ? { ...D.wheel, id: "wheel" } : D.hosts.find(h => h.id === s.host);
const fogColor = s => s.fogs[0]?.color || "#999";
const plain = x => String(x ?? "").replace(/§./g, "");
function cmdRow(label, cmd, extra) {
  return '<div class="cmd"><span class="lbl">'+esc(label)+'</span><code>'+esc(cmd)+'</code><button class="copy" data-copy="'+esc(cmd)+'">복사</button></div>'
    + (extra ? '<div class="cmd-extra">'+esc(extra)+"</div>" : "");
}
function renderPlaceTabs() {
  $("placeTabs").innerHTML = D.sections.map(s => '<button data-place="'+s.id+'" class="'+(view.place === s.id ? "on" : "")+'"><span class="dot" style="background:'+esc(fogColor(s))+'"></span>'
    + esc(s.title) + (s.game ? ' <span class="gno">게임 '+s.game+"</span>" : "") + "</button>").join("");
}
function renderPlace() {
  closeArea();
  const s = D.sections.find(x => x.id === view.place);
  const host = secHost(s), lang = secLang(s), tex = secTex(s), items = secItems(s);
  const shownLang = lang.filter(r => (!only() || r.changed) && match(r.key, r.before, r.after));
  const shownTex = tex.filter(p => (!only() || p.status !== "same") && match(p.rel));
  // 소제목마다 접었다 펼 수 있다 (항목이 24개를 넘으면 처음엔 접어 둠). 위쪽 바로가기 줄로 이동.
  const jumps = [];
  const sub = (key, title, count, body, size = 0) => {
    const id = "sec-" + key, open = openState[id] ?? size <= 24;
    jumps.push('<button class="copy" data-jump="'+id+'">'+esc(title)+(size ? " "+size : "")+"</button>");
    return '<details class="sub" id="'+id+'"'+(open ? " open" : "")+"><summary><h3>"+esc(title)+(count != null ? '<span class="n">'+count+"</span>" : "")+"</h3></summary>"+body+"</details>";
  };
  const none = '<div class="empty">없음</div>';
  let h = '<div class="place-head" style="--fog:'+esc(fogColor(s))+'"><h2>'+esc(s.title)+"<small>"+esc(s.en)+"</small></h2>"
    + '<div class="chips">' + (s.game ? '<span class="chip">게임 '+s.game+" · .game = "+s.game+" · seq/act"+s.game+"</span>" : '<span class="chip">.game = 0</span>')
    + (host ? '<span class="chip">호스트 '+esc(plain(host.name))+"</span>" : "") + "</div><p>"+esc(s.desc)+"</p></div>";
  h += '<div class="info-grid"><div class="box"><h3>바로가기 명령</h3>'
    + s.tpInfo.map(t => cmdRow(t.label, "/function dev/tp/" + t.id, t.pos + " → " + t.face)).join("")
    + (s.start ? cmdRow("연습 경기 시작", "/function dev/start/" + s.start) : "")
    + (s.id === "craft" ? cmdRow("두 팀 모드로 시작", "/function dev/start/craft_team", "혼자서도 3개 고장·3개 먼저 수리 모드") + cmdRow("한 팀 모드로 시작", "/function dev/start/craft_solo") : "")
    + (s.start ? cmdRow("디버그 모드 켜기", "/function dev/debug/on", "아래 치트는 디버그 모드·연습 경기에서만 동작")
      + cmdRow("설명 건너뛰기", "/function dev/skip/intro") + cmdRow("끝 장면 보기(팀1 승)", "/function dev/skip/end")
      + cmdRow("로비로 (기록 없음)", "/function dev/skip/lobby") : "")
    + cmdRow("건축 모드", "/function dev/build") + "</div>"
    + '<div class="box"><h3>구역 · 안개</h3><div class="small" style="color:var(--ink)">장식 금지 구역: '+esc(s.zone)+"</div>"
    + (s.timer ? '<div class="small">타이머 위치 (덮지 않기): '+esc(s.timer)+"</div>" : "")
    + s.notes.map(n => '<div class="small warn">⚠ '+esc(n)+"</div>").join("")
    + '<div class="fogs" style="margin-top:8px">' + s.fogs.map(f => '<span class="fog"><span class="sw" style="background:'+esc(f.color)+'"></span>'+esc(f.id)
      + ' <span class="small">'+esc(f.color)+" · "+esc(f.end)+"칸"+(f.beforeColor && f.beforeColor !== f.color ? " (원본 "+esc(f.beforeColor)+")" : "")+"</span></span>").join("") + "</div></div></div>";
  let b = "";
  if (host) b += sub("host", s.host === "wheel" ? "혼천의 (세종대왕)" : "호스트 NPC", null, '<div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(340px,1fr))">'+(tileHost(host, s.host === "wheel") || none)+"</div>");
  const cards = allCards().filter(c => tex.includes(c.p) && cardShown(c));
  const ar = (D.areas || []).filter(a => a.place === s.id);
  b += sub("area3d", "구역 3D (월드 블록)", ar.length || null, areaPanel(ar));
  if (cards.length) b += sub("models", "3D 모델 비교", cards.length, '<div class="mgrid">'+cards.map(modelCard).join("")+"</div>", cards.length);
  if (items.length) b += sub("items", "아이템", items.length, '<div class="grid">'+(items.map(tileItem).join("") || none)+"</div>", items.length);
  b += sub("tex", "텍스처", "표시 "+shownTex.length+" / "+tex.length+" · 바뀐 "+tex.filter(p => p.status !== "same").length, shownTex.length ? '<div class="tex-grid">'+shownTex.map(texTile).join("")+"</div>" : none, tex.length);
  b += sub("lang", "문구", "표시 "+shownLang.length+" / "+lang.length+" · 바뀐 "+lang.filter(r => r.changed).length,
    shownLang.length ? "<table><thead><tr><th>키</th><th>원본</th><th>현재</th></tr></thead><tbody>"+shownLang.map(langRow).join("")+"</tbody></table>" : none, lang.length);
  b += sub("ent", "엔티티", s.entities.length, s.entities.length ? '<div class="list">'+s.entities.map(e => "<span>"+esc(e.id)+(e.textures.length ? " · 텍스처 "+e.textures.length : "")+(e.rp ? "" : " · 보이지 않음")+"</span>").join("")+"</div>" : none);
  b += sub("snd", "쓰는 소리", s.sounds.length, s.sounds.length ? '<div class="list">'+s.sounds.map(x => "<span>"+esc(x.name)+" ×"+x.n+(x.custom ? ' · <b class="'+(x.changed ? "warn" : "")+'">'+(x.changed ? "재정의 바뀜" : "재정의")+"</b>" : "")+"</span>").join("")+"</div>"+s.sounds.map(x => D.sounds.find(y => y.event === x.name)).filter(y => y && y.files.length)
      .map(y => '<div class="small" style="margin-top:10px"><b>'+esc(y.event)+"</b> 듣기</div>"+player(y)).join("") : none);
  b += sub("func", "함수 폴더", null, '<div class="list">'+s.funcs.map(f => "<span>functions/"+esc(f.dir)+" · "+f.count+"개"+(f.entries.length ? " · "+esc(f.entries.map(e => e.split("/").pop().replace(".mcfunction", "")).join(", ")) : "")+"</span>").join("")+"</div>");
  $("placeBody").innerHTML = h + '<div class="jump">' + jumps.join("") + "</div>" + b;
}
function renderOverview() {
  $("placeOverview").innerHTML = D.sections.map(s => {
    const lang = secLang(s), tex = secTex(s), host = secHost(s);
    const hostSt = host ? (host.texStatus !== "same" || (host.geoStatus && host.geoStatus !== "same") ? "새 모습" : "원본") : "없음";
    return '<button class="ptile" data-go="places/'+s.id+'" style="--fog:'+esc(fogColor(s))+'"><b>'+esc(s.title)+"</b>"+(s.game ? ' <span class="gno">게임 '+s.game+"</span>" : "")
      + '<div class="small">'+esc(s.en)+(host ? " · "+esc(plain(host.name)) : "")+"</div>"
      + '<div class="small">호스트 '+hostSt+" · 문구 "+lang.filter(r => r.changed).length+"/"+lang.length+" · 텍스처 "+tex.filter(p => p.status !== "same").length+"/"+tex.length+"</div></button>";
  }).join("");
}

// ---------- 명령어 ----------
const copyBtn = cmd => '<button class="copy" data-copy="'+esc(cmd)+'">복사</button>';
function renderCommands() {
  const C = D.commands, sec = s => (s / 20).toFixed(s % 20 ? 1 : 0) + "초";
  $("cmdRecipes").innerHTML = C.recipes.filter(r => match(r.title, r.note, ...r.steps)).map(r => '<div class="box"><h3>'+esc(r.title)+'</h3><ol class="steps">'
    + r.steps.map(s => "<li><code>"+esc(s)+"</code>"+copyBtn(s)+"</li>").join("") + "</ol>"
    + (r.note ? '<div class="small">'+esc(r.note)+"</div>" : "") + "</div>").join("") || '<div class="empty">검색 결과 없음</div>';
  $("cmdGroups").innerHTML = C.groups.map(g => {
    const rows = g.items.filter(it => match(it.cmd, it.desc, it.warn, g.group));
    if (!rows.length) return "";
    return '<h2 style="margin-top:22px;font-size:17px">'+esc(g.group)+' <span class="n">'+rows.length+"개</span></h2>"
      + '<table class="cmds"><tbody>' + rows.map(it => '<tr><td class="c"><code>'+esc(it.cmd)+"</code>"+copyBtn(it.cmd)+"</td><td>"
        + (it.debug ? '<span class="badge b-changed">디버그</span> ' : "") + esc(it.desc)
        + (it.warn ? '<div class="small warn">⚠ '+esc(it.warn)+"</div>" : "") + "</td></tr>").join("") + "</tbody></table>";
  }).join("");
  $("cmdSeqs").innerHTML = C.seqs.map(s => "<tr><td>"+esc(s.title)+"</td><td>"+s.act+"</td><td>"+s.start+' <span class="small">('+sec(s.start)+")</span></td><td>"+s.end+' <span class="small">('+sec(s.end)+')</span></td><td class="small">'+esc(s.note || "")+"</td></tr>").join("");
}

function render() {
  renderHeader();
  renderCommands();
  renderTabbar();
  for (const [id] of TABS) $("p-" + id).classList.toggle("on", view.tab === id);
  renderOverview();
  renderPlaceTabs();
  renderPlace();
  $("hostGrid").innerHTML = tileHost({ ...D.wheel, id: "wheel" }, true) + D.drafts.map(d => tileHost(d, true)).join("") + D.hosts.map(h => tileHost(h)).join("");
  $("itemGrid").innerHTML = D.items.concat(D.armor).map(tileItem).join("");
  renderModels();
  const groups = ["전체", ...new Set(D.langRows.map(r => r.group))];
  tabs($("langTabs"), groups, langTab, v => langTab = v);
  const rows = D.langRows.filter(r => (langTab === "전체" || r.group === langTab) && (!only() || r.changed) && match(r.key, r.before, r.after));
  $("langN").textContent = "바뀐 " + D.langRows.filter(r => r.changed).length + "개 · 표시 " + rows.length + "개";
  $("langBody").innerHTML = rows.map(langRow).join("");
  const folderOf = p => p.rel.split("/").slice(0, -1).join("/") || "(루트)";
  const folders = ["전체", ...new Set(D.pngs.map(folderOf))];
  tabs($("texTabs"), folders, texTab, v => texTab = v);
  const tex = D.pngs.filter(p => (texTab === "전체" || folderOf(p) === texTab)
    && (!only() || p.status !== "same") && (!$("only3d").checked || p.models) && match(p.rel));
  $("texN").textContent = "표시 " + tex.length + "개 · 3D 모델 있는 텍스처 " + D.pngs.filter(p => p.models).length + "개";
  $("texGrid").innerHTML = tex.map(texTile).join("");
  const snd = D.sounds.filter(s => (!only() || s.changed) && match(s.event, s.before, s.after))
    .sort((a, b) => (b.files.length > 0) - (a.files.length > 0)); // 재생할 수 있는 음원이 있는 것은 위로
  $("sndN").textContent = "정의 " + D.sounds.length + "개 · 바뀐 " + D.sounds.filter(s => s.changed).length + "개";
  $("sndBody").innerHTML = snd.map(s => '<tr><td class="key">'+esc(s.event)+(s.changed?' <span class="badge b-changed">변경</span>':"")+'</td><td class="before">'+esc(s.before ?? "(없음)")+"</td><td>"+esc(s.after ?? "(없음)")+player(s)+"</td></tr>").join("");
  $("sndFiles").textContent = D.soundFiles.length ? "리소스팩 음원 파일: " + D.soundFiles.join(", ") : "리소스팩에 직접 넣은 음원 파일은 아직 없습니다 (바닐라 음원 사용).";
  const F = { A: "new", M: "changed", D: "deleted" };
  const files = D.changedFiles.filter(f => match(f.f));
  $("fileN").textContent = files.length + "개";
  $("fileBody").innerHTML = files.map(f => "<tr><td>"+badge(F[f.s] || "changed")+'</td><td class="small" style="color:var(--ink)">'+esc(f.f)+"</td></tr>").join("");
  $("guard").textContent = D.guard.text.trim();
  init3D();
}

// ---------- 3D 미리보기 (Bedrock geo.json → three.js) ----------
// 좌표 변환 (Blockbench와 같은 방식): X축을 뒤집고, 회전은 X·Y 부호를 바꾸고 Z는 유지, 앞면(north)은 -Z
const V3D = [];
function faceRects(c) {
  const u = c.uv[0], v = c.uv[1], w = c.size[0], h = c.size[1], d = c.size[2];
  return { east: [u, v + d, d, h], north: [u + d, v + d, w, h], west: [u + d + w, v + d, d, h],
    south: [u + d + w + d, v + d, w, h], up: [u + d, v, w, d], down: [u + d + w, v, w, d] };
}
function cubeMesh(c, mat, W, H, boneMirror) {
  const inf = c.inflate || 0;
  const geo = new THREE.BoxGeometry(Math.max(c.size[0] + inf * 2, 0.01), Math.max(c.size[1] + inf * 2, 0.01), Math.max(c.size[2] + inf * 2, 0.01));
  const mirror = c.mirror === undefined ? boneMirror : c.mirror;
  const box = Array.isArray(c.uv);
  let R;
  if (box) {
    R = faceRects(c);
    if (mirror) { const e = R.east; R.east = R.west; R.west = e; }
  } else {
    R = {};
    for (const f of ["north", "south", "east", "west", "up", "down"]) {
      const o = c.uv && c.uv[f];
      R[f] = o ? [o.uv[0], o.uv[1], (o.uv_size || [0, 0])[0], (o.uv_size || [0, 0])[1]] : null;
    }
  }
  const uv = geo.attributes.uv;
  ["east", "west", "up", "down", "south", "north"].forEach((f, i) => {
    const r = R[f];
    let u0 = 0, v0 = 0, u1 = 0, v1 = 0;
    if (r) { u0 = r[0]; v0 = r[1]; u1 = r[0] + r[2]; v1 = r[1] + r[3]; }
    if (f === "up" || f === "down") { let t = u0; u0 = u1; u1 = t; t = v0; v0 = v1; v1 = t; }
    if (mirror && box) { const t = u0; u0 = u1; u1 = t; }
    const set = (k, uu, vv) => uv.setXY(i * 4 + k, uu / W, 1 - vv / H);
    set(0, u0, v0); set(1, u1, v0); set(2, u0, v1); set(3, u1, v1);
  });
  uv.needsUpdate = true;
  return new THREE.Mesh(geo, mat);
}
function buildModel(m, tex) {
  const mat = new THREE.MeshLambertMaterial({ map: tex, transparent: true, alphaTest: 0.1, side: THREE.DoubleSide });
  const root = new THREE.Group(), groups = {}, abs = {};
  root.userData.groups = groups;
  const flip = p => [-p[0], p[1], p[2]];
  const deg = Math.PI / 180;
  for (const b of m.bones) { groups[b.name] = new THREE.Group(); abs[b.name] = flip(b.pivot); }
  for (const b of m.bones) {
    const g = groups[b.name], piv = abs[b.name];
    const par = b.parent && groups[b.parent] ? b.parent : null;
    const pp = par ? abs[par] : [0, 0, 0];
    g.position.set(piv[0] - pp[0], piv[1] - pp[1], piv[2] - pp[2]);
    if (b.rotation) g.rotation.set(-b.rotation[0] * deg, -b.rotation[1] * deg, b.rotation[2] * deg, "ZYX");
    (par ? groups[par] : root).add(g);
    for (const c of b.cubes) {
      const mesh = cubeMesh(c, mat, m.tw, m.th, b.mirror);
      const center = [-(c.origin[0] + c.size[0]) + c.size[0] / 2, c.origin[1] + c.size[1] / 2, c.origin[2] + c.size[2] / 2];
      if (c.rotation) {
        const cp = flip(c.pivot || b.pivot);
        const holder = new THREE.Group();
        holder.position.set(cp[0] - piv[0], cp[1] - piv[1], cp[2] - piv[2]);
        holder.rotation.set(-c.rotation[0] * deg, -c.rotation[1] * deg, c.rotation[2] * deg, "ZYX");
        mesh.position.set(center[0] - cp[0], center[1] - cp[1], center[2] - cp[2]);
        holder.add(mesh); g.add(holder);
      } else {
        mesh.position.set(center[0] - piv[0], center[1] - piv[1], center[2] - piv[2]);
        g.add(mesh);
      }
    }
  }
  return root;
}
const disposeViewer = v => { v.renderer.dispose(); v.renderer.forceContextLoss(); V3D.splice(V3D.indexOf(v), 1); };
const no3D = cv => cv.parentNode.insertAdjacentHTML("beforeend", '<div class="err">3D 보기는 인터넷 연결이 필요합니다<br>(three.js를 불러오지 못함)</div>');
function init3D() {
  // 사라졌거나 숨은 캔버스의 뷰어만 정리하고, 이미 그리는 캔버스는 그대로 둔다
  // (같은 캔버스를 다시 만들면 WebGL 문맥이 이미 버려진 상태라 그릴 수 없다). 3D 비교 창의 뷰어는 창이 따로 관리한다
  // 모델 비교 카드(canvas.pair)는 수가 많아 화면 근처의 것만 그리고, 멀어지면 정리한다(브라우저의 WebGL 문맥 수 제한).
  // 정리한 캔버스는 새 캔버스로 바꿔 끼워 두었다가 다시 가까워지면 새로 그린다
  const near = (cv, m) => { const r = cv.getBoundingClientRect(); return r.bottom > -m && r.top < innerHeight + m; };
  for (const v of [...V3D]) {
    const cv = v.renderer.domElement;
    if (v.dialog) continue;
    if (!cv.isConnected || cv.offsetParent === null) disposeViewer(v);
    else if (v.lazy && !near(cv, 1500)) { disposeViewer(v); cv.replaceWith(cv.cloneNode()); }
  }
  const drawing = new Set(V3D.map(v => v.renderer.domElement));
  // 지금 보이는 캔버스만 새로 그린다 (숨은 탭은 크기가 0이고, WebGL 문맥도 아낀다)
  const canvases = [...document.querySelectorAll("canvas.v3d")].filter(cv => cv.offsetParent !== null && !drawing.has(cv)
    && (!cv.classList.contains("pair") || near(cv, 400)));
  if (!window.THREE) return canvases.forEach(no3D);
  canvases.forEach(cv => {
    if (cv.classList.contains("pair")) {
      const p = D.pngs.find(x => x.rel === cv.dataset.tex), i = +cv.dataset.idx;
      const parts = p && pairParts(p, i);
      if (parts && parts.length) makeViewer(cv, { parts }, "pair:" + p.rel + "#" + i).lazy = true;
      return;
    }
    const cur = cv.dataset.host === "wheel" ? D.wheel : [...D.drafts, ...D.hosts].find(x => x.id === cv.dataset.host);
    if (!cur || !cur.model) return;
    const h = cv.dataset.ver === "before" && cur.before
      ? { ...cur, model: cur.before.model || cur.model, texData: cur.before.texData || cur.texData }
      : cur;
    makeViewer(cv, h, cv.dataset.host);
  });
}
// 캔버스 하나에 모델을 그린다. group이 같은 뷰어끼리는 함께 돌아간다 (변경 전/후 비교)
function makeViewer(cv, h, group, dialog = false) {
  {
    const w = cv.clientWidth || 160, ht = cv.clientHeight || 220;
    const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(w, ht, false);
    renderer.outputEncoding = THREE.sRGBEncoding;
    const scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const light = new THREE.DirectionalLight(0xffffff, 0.45);
    light.position.set(-20, 40, -30); scene.add(light);
    // parts: 한 캔버스에 나란히 그릴 모델들 (변경 전/후 비교 카드). 없으면 모델 하나
    const parts = h.parts || [{ model: h.model, texData: h.texData, frames: h.frames }];
    const holders = [], texs = [], sizes = [];
    let first = null;
    for (const part of parts) {
      const tex = new THREE.TextureLoader().load(part.texData);
      tex.magFilter = THREE.NearestFilter; tex.minFilter = THREE.NearestFilter;
      tex.generateMipmaps = false; tex.encoding = THREE.sRGBEncoding;
      const frames = part.frames || 1;
      if (frames > 1) { tex.repeat.set(1, 1 / frames); tex.offset.set(0, 1 - 1 / frames); }
      texs.push({ tex, frames });
      const model = buildModel(part.model, tex);
      first = first || model;
      // 모델을 가로·앞뒤로는 가운데에, 높이는 바닥(y 최솟값)을 0에 맞춘다 — 나란히 놓으면 같은 땅에 선다
      model.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(model);
      const c = box.getCenter(new THREE.Vector3()), s = box.getSize(new THREE.Vector3());
      model.position.set(-c.x, -box.min.y, -c.z);
      const holder = new THREE.Group();
      holder.add(model);
      scene.add(holder);
      holders.push(holder); sizes.push(s);
    }
    // 카메라는 -z에서 +z를 본다 → 화면 왼쪽이 +x. 첫 모델(변경 전)을 왼쪽에 둔다.
    // 여럿이면 돌려도 옆 모델과 겹치지 않게 폭은 가로·세로 중 큰 값으로 잡는다
    const widths = sizes.map(s => parts.length > 1 ? Math.max(s.x, s.z) : s.x), gap = parts.length > 1 ? Math.max(...widths) * 0.2 : 0;
    const total = widths.reduce((a, b) => a + b, 0) + gap * (parts.length - 1);
    let x = total / 2;
    const sy = Math.max(...sizes.map(s => s.y)), sz = Math.max(...sizes.map(s => s.z));
    holders.forEach((hd, i) => { hd.position.set(x - widths[i] / 2, -sy / 2, 0); x -= widths[i] + gap; });
    const fov = 35, fit = Math.max(sy, total * ht / w, parts.length > 1 ? 0 : sz) / 2 / Math.tan(fov * Math.PI / 360) * 1.25;
    const cam = new THREE.PerspectiveCamera(fov, w / ht, 1, fit * 4 + sz * 2);
    cam.position.set(0, sy * 0.12, -fit); cam.lookAt(0, 0, 0);
    const v = { host: group, dialog, renderer, scene, cam, holder: holders[0], holders, tex: texs[0].tex, frames: texs[0].frames, texs, drag: false, moved: 0, lastX: 0, auto: true,
      spinBone: first.userData.groups.wheel || null, spinStart: 0, spinFrom: 0 };
    // 변경 전/후 뷰어는 같은 호스트끼리 함께 돌려 같은 각도에서 비교한다
    const peers = () => V3D.filter(x => x.host === v.host);
    cv.onpointerdown = e => { v.drag = true; v.moved = 0; v.lastX = e.clientX; cv.setPointerCapture(e.pointerId); };
    cv.onpointermove = e => {
      if (!v.drag) return;
      const dx = e.clientX - v.lastX; v.moved += Math.abs(dx); v.lastX = e.clientX;
      for (const p of peers()) { if (v.moved > 3) p.auto = false; for (const hd of p.holders) hd.rotation.y += dx * 0.012; }
    };
    cv.onpointerup = () => {
      v.drag = false;
      // 끌지 않고 클릭만 했으면 바퀴를 돌린다 (게임의 spin 애니메이션처럼 감속)
      if (v.moved <= 3) for (const p of peers()) if (p.spinBone) { p.spinStart = performance.now(); p.spinFrom = p.spinBone.rotation.z; }
    };
    cv.ondblclick = () => { const auto = !v.auto; for (const p of peers()) p.auto = auto; };
    V3D.push(v);
    return v;
  }
}

// ---------- 텍스처 3D 비교 창 ----------
// 텍스처를 그 텍스처가 입혀지는 게임 모델에 씌워 보여 준다. 원본과 다르면 변경 전/후를 나란히.
const dlg = { rel: null, idx: 0 };
function open3D(rel, idx = 0) {
  const p = D.pngs.find(x => x.rel === rel);
  if (!p || !p.models) return;
  Object.assign(dlg, { rel, idx });
  const m = p.models[idx];
  const beforeGeo = m.before && D.geo[m.before], afterGeo = m.after && D.geo[m.after];
  const beforeTex = p.beforeData || p.data, afterTex = p.data;
  const differs = p.status !== "same" || m.before !== m.after;
  const cols = [];
  const n = m.names || {};
  if (differs && beforeGeo && beforeTex) cols.push(["before", "변경 전" + (n.before ? " · " + n.before : ""), "원본(" + D.baseline + ")", beforeGeo, beforeTex]);
  if (afterGeo && afterTex) cols.push(["after", (p.status === "new" ? "새 파일" : differs ? "변경 후" : "현재") + (n.after ? " · " + n.after : ""), differs ? "현재" : "원본과 같음", afterGeo, afterTex]);
  $("dlgTitle").textContent = (n.after ? nameLine(n) + " — " : "") + p.rel;
  $("dlgBadges").innerHTML = badge(p.status) + (m.before !== m.after ? ' <span class="badge b-changed">모델 변경</span>' : "")
    + (m.unused ? ' <span class="badge b-same">지금 게임에서 안 씀</span>' : "");
  $("dlgModels").innerHTML = p.models.length > 1 ? p.models.map((x, i) => '<button data-3d="'+esc(rel)+'" data-3d-idx="'+i+'" class="'+(i === idx ? "on" : "")+'">'+esc(x.label)+"</button>").join("") : '<span class="chip">'+esc(m.label)+"</span>";
  $("dlgBody").style.gridTemplateColumns = cols.length > 1 ? "1fr 1fr" : "1fr";
  $("dlgBody").innerHTML = cols.map(c => '<div><div class="ver">'+esc(c[1])+" <span>"+esc(c[2])+'</span></div><div class="v3d-wrap"><canvas class="v3d-dlg" data-col="'+c[0]+'"></canvas><span class="hint">드래그해서 돌리기 · 두 번 눌러 자동 회전</span></div></div>').join("")
    || '<div class="empty">이 텍스처에 맞는 모델을 찾지 못했습니다.</div>';
  $("dlgNote").textContent = p.models.length > 1 ? "이 텍스처는 모델 " + p.models.length + "개에 쓰입니다. 위에서 골라 보세요." : "";
  const d = $("dlg3d");
  if (!d.open) d.showModal();
  close3DViewers();
  if (!window.THREE) return d.querySelectorAll("canvas.v3d-dlg").forEach(no3D);
  for (const c of cols) makeViewer(d.querySelector('canvas[data-col="'+c[0]+'"]'), { model: c[3], texData: c[4], frames: m.frames }, "dlg", true);
}
const close3DViewers = () => V3D.filter(v => v.dialog).forEach(disposeViewer);
function loop() {
  const now = performance.now();
  for (const v of V3D) {
    if (v.auto) for (const hd of v.holders) hd.rotation.y += 0.01;
    // uv_anim과 같게 초당 7번 프레임을 바꿔 조명이 깜빡이게 한다
    for (const t of v.texs) if (t.frames > 1) t.tex.offset.y = 1 - (1 + Math.floor(now / 1000 * 7) % t.frames) / t.frames;
    if (v.spinStart) {
      const p = Math.min((now - v.spinStart) / 4000, 1);
      v.spinBone.rotation.z = v.spinFrom - (1 - Math.pow(1 - p, 3)) * Math.PI * 2 * 4;
      if (p >= 1) v.spinStart = 0;
    }
    v.renderer.render(v.scene, v.cam);
  }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

function fallbackCopy(t) {
  const a = document.createElement("textarea");
  a.value = t; a.style.position = "fixed"; a.style.opacity = "0";
  document.body.appendChild(a); a.select();
  try { document.execCommand("copy"); } catch {}
  a.remove();
}
const copyText = t => navigator.clipboard && window.isSecureContext ? navigator.clipboard.writeText(t).catch(() => fallbackCopy(t)) : Promise.resolve(fallbackCopy(t));
// 음원 재생기. 게임이 음높이(pitch)를 바꿔 트는 소리는 '게임처럼'을 켜면 브라우저도 같은 배속·음높이로 튼다
// (마인크래프트의 pitch는 재생 속도를 바꾸는 것이라 playbackRate와 같다)
function player(s) {
  if (!s.files || !s.files.length) return "";
  const len = x => x.sec ? " · 파일 " + Math.round(x.sec) + "초" + (s.pitch !== 1 ? ", 게임에서 " + Math.round(x.sec / s.pitch) + "초" : "") : "";
  return s.files.map(x => '<div class="snd-play"><audio controls preload="metadata" src="'+esc(x.f)+'" data-rate="'+s.pitch+'"></audio>'
    + (s.pitch !== 1 ? '<label class="small"><input type="checkbox" class="snd-game" checked> 게임처럼 (pitch '+s.pitch+' = '+s.pitch+'배속)</label>' : "")
    + '<span class="small">'+esc(x.f.split("/").pop()+len(x))+"</span></div>").join("");
}
const applyRate = a => {
  const cb = a.parentNode.querySelector(".snd-game");
  a.preservesPitch = false; a.mozPreservesPitch = false; a.webkitPreservesPitch = false;
  a.playbackRate = cb && cb.checked ? +a.dataset.rate : 1;
};
document.addEventListener("play", e => {
  if (e.target.tagName !== "AUDIO") return;
  document.querySelectorAll("audio").forEach(a => { if (a !== e.target) a.pause(); }); // 한 번에 하나만
  applyRate(e.target);
}, true);
document.addEventListener("change", e => { if (e.target.matches?.(".snd-game")) applyRate(e.target.closest(".snd-play").querySelector("audio")); });
document.addEventListener("click", e => {
  const t = e.target.closest("[data-tab]");
  if (t) return go(t.dataset.tab, t.dataset.tab === "places" ? view.place : "");
  const p = e.target.closest("[data-place]");
  if (p) return go("places", p.dataset.place);
  const g = e.target.closest("[data-go]");
  if (g) { location.hash = g.dataset.go; return; }
  const ar = e.target.closest("[data-area]");
  if (ar) return openArea(ar.dataset.area);
  const aw = e.target.closest("[data-a3which]");
  if (aw) return a3Which(aw.dataset.a3which);
  if (e.target.closest("[data-a3reset]")) return AV.r && a3Reset();
  const b3 = e.target.closest("[data-3d]");
  if (b3) return open3D(b3.dataset["3d"], +(b3.dataset["3dIdx"] || 0));
  if (e.target.id === "dlgClose" || e.target === $("dlg3d")) return $("dlg3d").close(); // 닫기 버튼, 창 바깥 누르기
  const j = e.target.closest("[data-jump]");
  if (j) { const d = $(j.dataset.jump); if (d) { d.open = true; openState[d.id] = true; d.scrollIntoView({ behavior: "smooth", block: "start" }); } return; }
  const c = e.target.closest("[data-copy]");
  if (c) copyText(c.dataset.copy).then(() => { c.textContent = "복사됨"; setTimeout(() => { c.textContent = "복사"; }, 1200); });
});
document.addEventListener("toggle", e => {
  if (!e.target.matches?.("details.sub")) return;
  openState[e.target.id] = e.target.open;
  if (e.target.open && e.target.querySelector("canvas.v3d")) init3D(); // 접혀 있던 3D 보기를 펼치면 다시 그린다
}, true);
let scrollPending = 0;
window.addEventListener("scroll", () => { if (!scrollPending) scrollPending = requestAnimationFrame(() => { scrollPending = 0; init3D(); }); }, { passive: true });
window.addEventListener("hashchange", () => {
  const prevTab = view.tab, prevPlace = view.place;
  readHash(); render();
  if (prevTab !== view.tab || prevPlace !== view.place) window.scrollTo(0, 0);
});
$("dlg3d").addEventListener("close", close3DViewers);
$("q").oninput = render; $("onlyChanged").onchange = render; $("only3d").onchange = render;
readHash();
render();
</script>
</body>
</html>
`;
fs.writeFileSync("devpage.html", html);
// 페이지 스크립트 문법 검사: 템플릿 문자열 안의 \" 같은 실수로 페이지가 통째로 비는 것을 바로 알린다
try { new Function(html.split("<script>").pop().split("</script>")[0]); }
catch (e) { console.error("devpage.html 스크립트 문법 오류: " + e.message); process.exitCode = 1; }
console.log(`devpage.html 생성 (문구 ${langRows.filter(r => r.changed).length}개 변경, 텍스처 ${pngs.filter(p => p.status !== "same").length}개 변경·추가)`);

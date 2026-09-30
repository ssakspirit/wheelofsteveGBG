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
// 텍스트 파일은 줄바꿈 변환 영향을 받으므로 원본 내용과 직접 비교
const baseText = f => { try { return git(["show", `${BASELINE}:${f}`]); } catch { return null; } };
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
function loadGeometry(file, id) {
  if (!exists(file)) return null;
  const j = JSON.parse(read(file).replace(/^\s*\/\/.*$/gm, ""));
  let g = null, tw = 64, th = 64;
  if (j["minecraft:geometry"]) {
    g = j["minecraft:geometry"].find(x => x.description.identifier === id) || j["minecraft:geometry"][0];
    tw = g.description.texture_width; th = g.description.texture_height;
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
  return {
    ...h, tex, texStatus: status(tex), geoStatus: status(geo),
    model: loadGeometry(geo, `geometry.rwm.${h.id}`), texData: dataUri(tex),
    name: t(`${h.key}.n`), nameBefore: langBase.get(`${h.key}.n`),
    button: t(`${h.key}.b1`), dialogue: t(`${h.key}.d`),
  };
});
const wheel = {
  tex: `${RP}textures/rwm/entity/wheel_of_steve.png`,
  texStatus: status(`${RP}textures/rwm/entity/wheel_of_steve.png`),
  name: t("wheel.n"), nameBefore: langBase.get("wheel.n"), dialogue: t("wheel.d"), button: t("wheel.b1"),
  geoStatus: status(`${RP}models/entity/wheel_of_steve.geo.json`),
  model: loadGeometry(`${RP}models/entity/wheel_of_steve.geo.json`, "geometry.wheel_of_steve"),
  texData: dataUri(`${RP}textures/rwm/entity/wheel_of_steve.png`),
  frames: 2, // render controller의 uv_anim: 텍스처를 위아래 2장으로 나눠 번갈아 보여 줌
};

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

// ---------- 텍스처 전체 ----------
function walk(d) {
  return fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
}
const pngs = [...new Set([...walk(RP).map(f => f.split(path.sep).join("/")), ...[...baseTree.keys()].filter(f => f.startsWith(RP))])]
  .filter(f => f.endsWith(".png"))
  .map(f => {
    let w = 0, h = 0;
    if (exists(f)) { const b = fs.readFileSync(f); w = b.readUInt32BE(16); h = b.readUInt32BE(20); }
    return { file: f, rel: f.slice(RP.length), status: status(f), w, h };
  })
  .sort((a, b) => a.rel.localeCompare(b.rel, "en", { numeric: true }));

// ---------- 사운드 ----------
const sdPath = `${RP}sounds/sound_definitions.json`;
const sdBase = JSON.parse(baseText(sdPath) || "{}").sound_definitions || {};
const sdNow = JSON.parse(read(sdPath)).sound_definitions || {};
const soundNames = d => (d?.sounds || []).map(s => (typeof s === "string" ? s : s.name)).join(", ");
const sounds = [...new Set([...Object.keys(sdBase), ...Object.keys(sdNow)])].sort().map(k => ({
  event: k, before: soundNames(sdBase[k]) || null, after: soundNames(sdNow[k]) || null,
  changed: JSON.stringify(sdBase[k]) !== JSON.stringify(sdNow[k]),
}));
const soundFiles = walk(`${RP}sounds`).map(f => f.split(path.sep).join("/")).filter(f => /\.(ogg|wav|fsb)$/i.test(f));

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

const data = {
  generated: new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }),
  head, dirty, baseline: BASELINE, guard, wheel, hosts, items, armor, pngs, langRows, sounds, soundFiles, changedFiles,
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
nav .in{max-width:1200px;margin:auto;padding:8px 20px;display:flex;gap:6px;flex-wrap:wrap;align-items:center}
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
.v3d-wrap .hint{position:absolute;left:6px;bottom:4px;font-size:11px;color:#cfd8e3;pointer-events:none}
.v3d-wrap .err{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;padding:10px;font-size:12px;color:#e9dcc9}
.cap{font-size:11px;color:var(--muted);text-align:center;margin-top:2px}
.warn{color:var(--chg)}
@media (max-width:640px){td.key{width:auto}nav label{margin-left:0}}
</style>
</head>
<body>
<header>
  <h1 id="title"></h1>
  <div class="meta" id="meta"></div>
</header>
<nav><div class="in">
  <a href="#summary">요약</a><a href="#hosts">호스트</a><a href="#items">아이템</a><a href="#lang">문구</a>
  <a href="#textures">텍스처</a><a href="#sounds">사운드</a><a href="#files">파일</a>
  <label><input type="checkbox" id="onlyChanged"> 바뀐 것만</label>
  <input type="search" id="q" placeholder="검색 (이름, 키, 파일)">
</div></nav>
<main>
  <section id="summary"><h2>요약</h2><div class="cards" id="cards"></div></section>
  <section id="hosts"><h2>호스트 NPC <span class="n">텍스처 64×64 · 원본 대비</span></h2><div class="grid" id="hostGrid"></div></section>
  <section id="items"><h2>아이템 <span class="n">아이콘 · 이름</span></h2><div class="grid" id="itemGrid"></div></section>
  <section id="lang"><h2>문구 (ko_KR) <span class="n" id="langN"></span></h2><div class="tabs" id="langTabs"></div>
    <table><thead><tr><th>키</th><th>원본</th><th>현재</th></tr></thead><tbody id="langBody"></tbody></table></section>
  <section id="textures"><h2>텍스처 전체 <span class="n" id="texN"></span></h2><div class="tabs" id="texTabs"></div><div class="tex-grid" id="texGrid"></div></section>
  <section id="sounds"><h2>사운드 <span class="n" id="sndN"></span></h2>
    <table><thead><tr><th>사운드 이벤트</th><th>원본 파일</th><th>현재 파일</th></tr></thead><tbody id="sndBody"></tbody></table>
    <p class="small" id="sndFiles"></p></section>
  <section id="files"><h2>원본 대비 바뀐 파일 <span class="n" id="fileN"></span></h2>
    <table><thead><tr><th style="width:90px">상태</th><th>파일</th></tr></thead><tbody id="fileBody"></tbody></table>
    <h2 style="margin-top:18px;font-size:16px">규칙 보존 검사</h2><pre id="guard"></pre></section>
</main>
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
}
function tileHost(h, isWheel) {
  const changed = h.texStatus !== "same" || h.nameBefore !== h.name || (h.geoStatus && h.geoStatus !== "same");
  if (only() && !changed) return "";
  if (!match(h.name, h.nameBefore, h.id, h.game, h.dialogue)) return "";
  const flat = '<div class="img"><img class="px" src="'+esc(h.tex)+'" width="'+(isWheel?128:192)+'"></div>';
  const media = h.model && h.texData
    ? '<div class="dual"><div>'+flat+'<div class="cap">평면(텍스처)</div></div><div><div class="v3d-wrap"><canvas class="v3d" data-host="'+esc(h.id)+'"></canvas><span class="hint">'+(isWheel ? "드래그: 둘러보기 · 클릭: 바퀴 돌리기" : "드래그해서 돌리기")+'</span></div><div class="cap">3D(게임 모델)</div></div></div>'
    : flat;
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
function render() {
  renderHeader();
  $("hostGrid").innerHTML = tileHost({ ...D.wheel, id: "wheel" }, true) + D.hosts.map(h => tileHost(h)).join("");
  $("itemGrid").innerHTML = D.items.concat(D.armor).map(tileItem).join("");
  const groups = ["전체", ...new Set(D.langRows.map(r => r.group))];
  tabs($("langTabs"), groups, langTab, v => langTab = v);
  const rows = D.langRows.filter(r => (langTab === "전체" || r.group === langTab) && (!only() || r.changed) && match(r.key, r.before, r.after));
  $("langN").textContent = "바뀐 " + D.langRows.filter(r => r.changed).length + "개 · 표시 " + rows.length + "개";
  $("langBody").innerHTML = rows.map(r => '<tr><td class="key">'+esc(r.key)+(r.changed?' <span class="badge b-changed">변경</span>':"")+'</td><td class="before">'+mc(r.before)+"</td><td>"+mc(r.after)+"</td></tr>").join("");
  const folders = ["전체", ...new Set(D.pngs.map(p => p.rel.split("/").slice(0, -1).join("/")))];
  tabs($("texTabs"), folders, texTab, v => texTab = v);
  const tex = D.pngs.filter(p => (texTab === "전체" || p.rel.startsWith(texTab + "/") && p.rel.split("/").slice(0,-1).join("/") === texTab) && (!only() || p.status !== "same") && match(p.rel));
  $("texN").textContent = "표시 " + tex.length + "개";
  $("texGrid").innerHTML = tex.map(p => '<div class="tile"><div class="img">'+(p.status==="deleted"?"":'<img class="px" loading="lazy" src="'+esc(p.file)+'" width="'+Math.min(128, Math.max(48, p.w*4))+'">')+'</div><div>'+badge(p.status)+' <span class="small">'+p.w+"×"+p.h+'</span></div><div class="small">'+esc(p.rel)+"</div></div>").join("");
  const snd = D.sounds.filter(s => (!only() || s.changed) && match(s.event, s.before, s.after));
  $("sndN").textContent = "정의 " + D.sounds.length + "개 · 바뀐 " + D.sounds.filter(s => s.changed).length + "개";
  $("sndBody").innerHTML = snd.map(s => '<tr><td class="key">'+esc(s.event)+(s.changed?' <span class="badge b-changed">변경</span>':"")+'</td><td class="before">'+esc(s.before ?? "(없음)")+"</td><td>"+esc(s.after ?? "(없음)")+"</td></tr>").join("");
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
function disposeViewers() {
  for (const v of V3D) { v.renderer.dispose(); v.renderer.forceContextLoss(); }
  V3D.length = 0;
}
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
function init3D() {
  disposeViewers();
  const canvases = document.querySelectorAll("canvas.v3d");
  if (!window.THREE) {
    canvases.forEach(cv => cv.parentNode.insertAdjacentHTML("beforeend", '<div class="err">3D 보기는 인터넷 연결이 필요합니다<br>(three.js를 불러오지 못함)</div>'));
    return;
  }
  canvases.forEach(cv => {
    const h = cv.dataset.host === "wheel" ? D.wheel : D.hosts.find(x => x.id === cv.dataset.host);
    if (!h || !h.model) return;
    const w = cv.clientWidth || 160, ht = cv.clientHeight || 220;
    const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(w, ht, false);
    renderer.outputEncoding = THREE.sRGBEncoding;
    const scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const light = new THREE.DirectionalLight(0xffffff, 0.45);
    light.position.set(-20, 40, -30); scene.add(light);
    const tex = new THREE.TextureLoader().load(h.texData);
    tex.magFilter = THREE.NearestFilter; tex.minFilter = THREE.NearestFilter;
    tex.generateMipmaps = false; tex.encoding = THREE.sRGBEncoding;
    const frames = h.frames || 1;
    if (frames > 1) { tex.repeat.set(1, 1 / frames); tex.offset.set(0, 1 - 1 / frames); }
    const model = buildModel(h.model, tex);
    // 모델 크기에 맞춰 가운데로 옮기고 카메라 거리를 정한다
    model.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(model);
    const c = box.getCenter(new THREE.Vector3()), s = box.getSize(new THREE.Vector3());
    model.position.set(-c.x, -c.y, -c.z);
    const holder = new THREE.Group();
    holder.add(model);
    scene.add(holder);
    const fov = 35, fit = Math.max(s.y, s.x * ht / w, s.z) / 2 / Math.tan(fov * Math.PI / 360) * 1.25;
    const cam = new THREE.PerspectiveCamera(fov, w / ht, 1, fit * 4);
    cam.position.set(0, s.y * 0.12, -fit); cam.lookAt(0, 0, 0);
    const v = { renderer, scene, cam, holder, tex, frames, drag: false, moved: 0, lastX: 0, auto: true,
      spinBone: model.userData.groups.wheel || null, spinStart: 0, spinFrom: 0 };
    cv.onpointerdown = e => { v.drag = true; v.moved = 0; v.lastX = e.clientX; cv.setPointerCapture(e.pointerId); };
    cv.onpointermove = e => { if (v.drag) { const dx = e.clientX - v.lastX; v.moved += Math.abs(dx); if (v.moved > 3) v.auto = false; holder.rotation.y += dx * 0.012; v.lastX = e.clientX; } };
    cv.onpointerup = () => {
      v.drag = false;
      // 끌지 않고 클릭만 했으면 바퀴를 돌린다 (게임의 spin 애니메이션처럼 감속)
      if (v.moved <= 3 && v.spinBone) { v.spinStart = performance.now(); v.spinFrom = v.spinBone.rotation.z; }
    };
    cv.ondblclick = () => { v.auto = !v.auto; };
    V3D.push(v);
  });
}
function loop() {
  const now = performance.now();
  for (const v of V3D) {
    if (v.auto) v.holder.rotation.y += 0.01;
    // uv_anim과 같게 초당 7번 프레임을 바꿔 조명이 깜빡이게 한다
    if (v.frames > 1) v.tex.offset.y = 1 - (1 + Math.floor(now / 1000 * 7) % v.frames) / v.frames;
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

$("q").oninput = render; $("onlyChanged").onchange = render;
render();
</script>
</body>
</html>
`;
fs.writeFileSync("devpage.html", html);
console.log(`devpage.html 생성 (문구 ${langRows.filter(r => r.changed).length}개 변경, 텍스처 ${pngs.filter(p => p.status !== "same").length}개 변경·추가)`);

// 개발용 function(behavior_packs/bp0/functions/dev/**) 생성기. 사용: node tools/gen-dev.js
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..", "behavior_packs/bp0/functions/dev");
const w = (rel, lines) => {
  const f = path.join(root, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, lines.join("\n") + "\n");
};
const msg = (sel, text) => `tellraw ${sel} {"rawtext":[{"text":"${text}"}]}`;

// 장소·게임 목록은 tools/places.js 한곳에서 관리한다 (개발자 페이지도 같은 목록을 쓴다)
const { places, games, sequences, preSequences } = require("./places");

for (const [name, pos, face, label] of places) {
  w(`tp/${name}.mcfunction`, [
    `## [개발용] ${label}(으)로 이동`,
    `tp @s ${pos} facing ${face}`,
    msg("@s", `§a[dev] §f${label}(으)로 이동했습니다. §7(${pos})`),
  ]);
}

for (const [name, dir, label] of games) {
  w(`start/${name}.mcfunction`, [
    `## [개발용] ${label} 시작 - NPC 대화로 시작하는 연습 경기와 같음 (어전대회 승리 기록에는 포함 안 됨)`,
    `function utility/games/${dir}/game_start`,
    msg("@a", `§a[dev] §f게임 시작: §e${label}`),
  ]);
}

// ---------- 디버그 모드와 치트: 혼자서 각 게임의 시작·끝을 바로 확인 ----------
// 원칙: 새 파일만 만들고 기존 게임 함수는 고치지 않는다. 치트는 rwm_dev 태그(디버그 모드)가 있는 사람만,
// 그리고 어전대회 경기(혼천의로 시작, .wheelgame 1~5)가 아닐 때만 동작한다 → 실제 경기 규칙·진행·승리 기록에 영향 없음.
// 진행 순서는 메인 루프처럼 seq 파일을 부르는 방식으로 건너뛴다: 건너뛸 구간의 예약된 명령(소환·배치·카메라…)을
// 순서대로 한 틱 안에 모두 실행한 뒤 목표 지점으로 옮기므로, 게임 준비 과정이 빠지지 않는다.
const SEQ = path.join(__dirname, "..", "behavior_packs/bp0/functions/seq");
// 천천히 쌓는 시범 연출(structure load … block_by_block <초>): 한 틱에 몰아 재생하면 쌓기가 '판 지우기' 뒤에도
// 몇 초 이어져, 건너뛴 뒤 경기 판에 시범 블록이 남는다(교태전 꽃담 설명 20·100·880번). 재생할 때는 이 줄만 뺀 사본을 쓴다.
const ANIM = /^execute if score \.seq global matches (\d+) run \/?structure load \S+ .* (block_by_block|layer_by_layer) ([\d.]+)\s*$/;
function readSeq(file) {
  const exact = new Set(), win = new Set(), anim = [];
  let final = null;
  const lines = fs.readFileSync(path.join(SEQ, file + ".mcfunction"), "utf8").split(/\r?\n/);
  for (const l of lines) {
    const a = l.match(ANIM);
    if (a) anim.push({ v: +a[1], ticks: Math.ceil(+a[3] * 20) });
    const m = l.match(/\.seq global matches (\d+)(\.\.(\d+)?)?\s/);
    if (!m || m[2]) continue; // 범위(a..b)는 그 구간 동안 계속 실행되는 명령이라 따로 재생하지 않는다
    const v = +m[1];
    exact.add(v);
    if (/utility\/wins\//.test(l)) win.add(v);
    if (/set \.act global 0\b/.test(l)) final = v;
  }
  return { values: [...exact].sort((a, b) => a - b), win, final, anim, lines };
}
// 시범 연출이 있는 seq는 그 줄만 주석으로 바꾼 사본(dev/_cheat/seq/<act>)을 만들어 재생에 쓴다. 나머지 줄은 원본과 같다.
const replayFile = new Map();
function noAnimCopy(act, file, info) {
  if (!info.anim.length) return `seq/${file}`;
  if (!replayFile.has(act)) {
    w(`_cheat/seq/${act}.mcfunction`, [
      `## 자동 생성: seq/${file}의 사본. 건너뛰기 재생용 — 천천히 쌓는 시범 연출(structure load … block_by_block)만 뺐다.`,
      "## 원본(게임)은 그대로 쓰이고, 이 사본은 dev/skip 명령에서만 불린다. node tools/gen-dev.js로 다시 만든다.",
      ...info.lines.map(l => (ANIM.test(l) ? "# [건너뛰기에서 뺌] " + l : l)),
    ]);
    replayFile.set(act, `dev/_cheat/seq/${act}`);
  }
  return replayFile.get(act);
}
// 값 v마다: 아직 지나지 않았으면(.seq ≤ v) seq를 v로 맞추고 메인 루프와 같은 방식(as @p at @s)으로 seq 파일을 부른다
const replay = (act, file, values, fn = `seq/${file}`) => values.flatMap(v => [
  `execute if score .act global matches ${act} if score .seq global matches ..${v} run scoreboard players set .seq global ${v}`,
  `execute if score .act global matches ${act} if score .seq global matches ${v} as @p at @s run function ${fn}`,
]);
const seqInfo = sequences.map(s => {
  const info = readSeq(s.file);
  for (const k of ["start", "end"]) if (!info.values.includes(s[k])) throw new Error(`seq/${s.file}에 ${k} 지점 ${s[k]}이 없음 (원본이 바뀌었는지 확인)`);
  if (info.final == null) throw new Error(`seq/${s.file}에서 로비로 돌아가는 지점(.act 0)을 찾지 못함`);
  return { ...s, ...info };
});
const pre = preSequences.map(p => ({ ...p, ...readSeq(p.file) }));

const DEV_TAG = "rwm_dev";
const say = t => msg("@s", t);
const sayRun = (cond, t) => `execute ${cond} run ${say(t)}`;
const seqNow = `tellraw @s {"rawtext":[{"text":"§7  (.act "},{"score":{"name":".act","objective":"global"}},{"text":" · .seq "},{"score":{"name":".seq","objective":"global"}},{"text":")"}]}`;
// 공개 치트: 디버그 모드·어전대회 여부·진행 중인 게임을 확인한 뒤 본문(dev/_cheat/...)을 부른다
function cheat(file, title, body, { needGame = true } = {}) {
  const ok = `if entity @s[tag=${DEV_TAG}] unless score .wheelgame global matches 1..5`;
  w(file, [
    `## [개발용 치트] ${title}`,
    "## 디버그 모드(/function dev/debug/on)에서만, 어전대회 경기가 아닐 때만 동작한다.",
    sayRun(`unless entity @s[tag=${DEV_TAG}]`, "§c[dev] 디버그 모드에서만 쓸 수 있습니다: §f/function dev/debug/on"),
    sayRun(`if entity @s[tag=${DEV_TAG}] if score .wheelgame global matches 1..5`, "§c[dev] 어전대회 경기 중에는 쓸 수 없습니다. 연습 경기(/function dev/start/<게임>)에서 쓰세요."),
    ...(needGame
      ? [sayRun(`${ok} unless score .act global matches 101..601`, "§c[dev] 진행 중인 게임이 없습니다. 먼저 §f/function dev/start/<게임>"),
         `execute ${ok} if score .act global matches 101..601 run function dev/_cheat/${body}`]
      : [`execute ${ok} run function dev/_cheat/${body}`]),
  ]);
}

// 설명(인트로) 건너뛰기 → 경기 시작 직전
for (const p of pre) w(`_cheat/intro_${p.act}.mcfunction`, [
  `## act ${p.act}: ${p.branch}번에서 다음 act로 갈라질 때까지 재생`,
  ...replay(p.act, p.file, p.values.filter(v => v <= p.branch)),
]);
for (const s of seqInfo) w(`_cheat/intro_${s.act}.mcfunction`, [
  `## act ${s.act} (${s.file}): 경기 시작(${s.start}) 전까지의 예약 명령을 순서대로 재생하고 ${s.start}로 옮긴다`,
  ...(s.anim.length ? [`## 천천히 쌓는 시범 연출(${[...new Set(s.anim.map(a => a.v))].join("·")}번)은 뺀 사본으로 재생한다 (dev/_cheat/seq/${s.act})`] : []),
  ...replay(s.act, s.file, s.values.filter(v => v < s.start), noAnimCopy(s.act, s.file, s)),
  `execute if score .act global matches ${s.act} if score .seq global matches ..${s.start} run scoreboard players set .seq global ${s.start}`,
]);
// 이미 실제로 시작된 시범 쌓기가 진행 중이면 건너뛰지 않는다(지워도 쌓기가 이어진다) → 몇 초 뒤 다시
const animWait = [...new Set(seqInfo.flatMap(s => s.anim.filter(a => a.v < s.start).map(a =>
  `execute if score .act global matches ${s.act} if score .seq global matches ${a.v}..${a.v + a.ticks - 1} run scoreboard players set .dev_wait global 1`)))];
w("_cheat/intro.mcfunction", [
  "scoreboard players set .dev_wait global 0",
  ...animWait,
  `execute if score .dev_wait global matches 1 run ${say("§e[dev] §f시범 블록을 쌓는 중이라 지금은 건너뛸 수 없습니다. 몇 초 뒤 다시 해 보세요.")}`,
  ...pre.map(p => `execute if score .dev_wait global matches 0 if score .act global matches ${p.act} run function dev/_cheat/intro_${p.act}`),
  ...seqInfo.map(s => `execute if score .dev_wait global matches 0 if score .act global matches ${s.act} run function dev/_cheat/intro_${s.act}`),
  "execute if score .dev_wait global matches 0 run stopsound @a", // 한꺼번에 재생된 설명 효과음·음악을 끈다 (경기 시작 음악은 다음 틱에 정상 재생)
  `execute if score .dev_wait global matches 0 run ${say("§a[dev] §f설명을 건너뛰었습니다. 곧 경기가 시작됩니다.")}`, seqNow,
]);
cheat("skip/intro.mcfunction", "설명(인트로)을 건너뛰고 바로 경기 시작", "intro");

// 경기 끝 → 승패 → 종료 장면 (이긴 팀 지정)
for (const [team, other] of [[1, 2], [2, 1]]) {
  const T = team === 1 ? '"§4Team 1"' : '"§9Team 2"', O = other === 1 ? '"§4Team 1"' : '"§9Team 2"';
  const body = [
    `scoreboard players operation ${T} score = ${O} score`,
    `scoreboard players add ${T} score 1`,
    "## 자격루: 이긴 팀 장치를 모두 수리해 완성된 모습으로 종료 장면을 본다",
    ...[1, 2, 3, 4, 5].map(n => `execute if score .act global matches 201..202 run event entity @e[type=rwm:craft_contraption,tag=contraption_team${team},tag=contraption_${n}] rwm:contraption_${n}_fixed`),
    "## 백악산: 나를 참가자로 넣고 1등 점수를 준다 (결승 참가 자격은 원래 어전대회 승수로 정해짐)",
    "execute if score .act global matches 601 run tag @s add final_players",
    "execute if score .act global matches 601 run scoreboard players add @s final_showdown_score 10",
    ...seqInfo.map(s => `execute if score .act global matches ${s.act} if score .seq global matches ..${s.end} run scoreboard players set .seq global ${s.end}`),
    say(`§a[dev] §f팀 ${team} 승리로 경기를 끝냅니다. 종료 장면이 이어집니다.`), seqNow,
  ];
  w(`_cheat/end_team${team}.mcfunction`, [
    `## 팀 ${team} 승리로 경기 끝 지점으로 옮긴다 (아직 설명 중이면 먼저 설명을 건너뛴다; 시범 블록을 쌓는 중이면 아무것도 하지 않음)`,
    "function dev/_cheat/intro",
    ...body.map(l => (l.startsWith("##") ? l : `execute if score .dev_wait global matches 0 run ${l}`)),
  ]);
  cheat(team === 1 ? "skip/end.mcfunction" : "skip/end_team2.mcfunction", `경기를 바로 끝내고 종료 장면 보기 (팀 ${team} 승리)`, `end_team${team}`);
}

// 로비로 돌아가기: 남은 예약 명령(정리·카메라 해제·로비 복귀)을 모두 재생하되 승패 판정 지점은 건너뛴다 → 승리 기록 없음
for (const s of seqInfo) w(`_cheat/lobby_${s.act}.mcfunction`, [
  `## act ${s.act}: 로비 복귀(${s.final})까지 재생, 승패 판정(${[...s.win].join(", ") || "없음"})은 건너뜀`,
  ...replay(s.act, s.file, s.values.filter(v => v <= s.final && !s.win.has(v)), noAnimCopy(s.act, s.file, s)),
]);
w("_cheat/lobby.mcfunction", [
  ...pre.map(p => `execute if score .act global matches ${p.act} run function dev/_cheat/intro_${p.act}`),
  ...seqInfo.map(s => `execute if score .act global matches ${s.act} run function dev/_cheat/lobby_${s.act}`),
  "stopsound @a",
  say("§a[dev] §f게임을 정리하고 로비로 돌아왔습니다 (승패 기록 없음)."),
]);
cheat("skip/lobby.mcfunction", "게임을 바로 정리하고 로비로 (승패 기록 없음)", "lobby");

// 팀 들어가기: 로비 팀 선택 구역에 들어간 것과 같은 기존 함수를 부른다
for (const t of [1, 2]) {
  w(`_cheat/team${t}.mcfunction`, [`function utility/teams/team${t}_select`, say(`§a[dev] §f팀 ${t}에 들어갔습니다.`)]);
  cheat(`team/${t}.mcfunction`, `나를 팀 ${t}에 넣기`, `team${t}`, { needGame: false });
}

// 자격루 모드 고르기: 원래는 두 팀 자리에 사람이 있는지로 정해져서 혼자서는 '두 팀' 모드를 볼 수 없다
const craftPre = pre.find(p => p.act === 200);
for (const [name, mode, label] of [["craft_team", 0, "두 팀 모드(3개 고장·3개 먼저 수리)"], ["craft_solo", 1, "한 팀 모드(5개 고장·시간제)"]]) {
  w(`_cheat/${name}.mcfunction`, [
    `## 자격루 연습 경기를 ${label}로 시작`,
    "function utility/games/craft/game_start",
    ...replay(200, craftPre.file, craftPre.values.filter(v => v < craftPre.branch)),
    `scoreboard players set .gamemode craft_scores ${mode}`,
    `scoreboard players set .seq global ${craftPre.branch}`,
    say(`§a[dev] §f자격루 복원전을 §e${label}§f로 시작합니다.`),
  ]);
  cheat(`start/${name}.mcfunction`, `자격루 복원전을 ${label}로 시작`, name, { needGame: false });
}

// ---------- 진행 편의 명령: /function skip · /function end ----------
// 운영자 권한(명령어 사용)만 있으면 누구나, 디버그 모드·어전대회 여부와 상관없이 쓴다. 새 파일만 만들고 게임 파일은 고치지 않는다.
//   skip: 설명 중에만. 남은 설명 명령을 순서대로 재생하고(시범 쌓기는 뺀 사본) 3·2·1 카운트다운 직전으로 옮긴다
//         → 카운트다운·출발·음악은 게임이 원래대로 진행한다.
//   end : 설명 중이나 경기 중에. 설명 준비를 마치고, 게임의 끝 지점부터 판정 직전까지의 명령을 재생한 뒤 두 팀 점수를 0으로 맞추고
//         게임 자신의 판정 지점으로 옮긴다 → 게임이 무승부를 판정한다(승리 기록 없음). 백악산은 팀 경기가 아니라 제외.
const top = (rel, lines) => {
  const f = path.join(root, "..", rel);
  fs.writeFileSync(f, lines.join("\n") + "\n");
};
const playInfo = seqInfo.map(s => {
  const line = s.lines.find(l => /\.seq global matches \d+ run titleraw @a title .*subtitle\.objective\.101\.1"/.test(l));
  const countdown = line ? +line.match(/matches (\d+)/)[1] : s.start;
  if (!(countdown <= s.start && countdown > 60)) throw new Error(`seq/${s.file}: 카운트다운 지점을 찾지 못함`);
  const judge = [...s.win].filter(v => v >= s.end).sort((a, b) => a - b)[0];
  if (judge == null) throw new Error(`seq/${s.file}: 끝(${s.end}) 뒤의 승패 판정 지점을 찾지 못함`);
  return { ...s, countdown, judge, team: s.act !== 601 };
});
const WAIT = ".dev_wait global";
const waitLines = intro => [
  `scoreboard players set ${WAIT} 0`,
  // 시작하고 3초 동안은 경기장 땅이 아직 불러와지는 중일 수 있다
  ...pre.map(p => `execute if score .act global matches ${p.act} run scoreboard players set ${WAIT} 1`),
  ...playInfo.map(s => `execute if score .act global matches ${s.act} if score .seq global matches ..59 run scoreboard players set ${WAIT} 1`),
  ...animWait,
  `execute if score ${WAIT} matches 1 run ${say(`§e[진행] §f지금은 준비 중이라 ${intro} 수 없습니다. 몇 초 뒤 다시 해 보세요.`)}`,
];

// 로비 소개(팀을 정하고 시작 버튼을 누른 뒤 나오는 혼천의·다섯 대결 소개, seq/act0/001):
// 로비로 옮기는 순간이동 다음부터 화면이 어두워지는 지점 전까지는 안내 문구(scoreboard)와 카메라 명령뿐이라
// 그 사이 명령을 순서대로 재생하고 어두워지는 지점으로 옮긴다 → 카메라 해제·HUD·이동 허용·로비 준비는 게임이 원래대로.
const LOBBY = (() => {
  const info = readSeq("act0/001");
  // 같은 명령이 앞(팀 고르기 전 안내)에도 있으므로, after보다 뒤에 있는 첫 번째 것을 찾는다
  const at = (re, after = -1) => { const v = info.lines.filter(x => re.test(x)).map(x => +x.match(/matches (\d+) /)[1]).filter(v => v > after).sort((a, b) => a - b); return v.length ? v[0] : null; };
  const tpLobby = at(/matches \d+ run tp @a 1\.0 60\.00 1000/), fade = at(/matches \d+ run camera @a fade time 0\.5 1 0\.5/, tpLobby);
  if (tpLobby == null || fade == null || !(tpLobby < fade)) throw new Error("seq/act0/001: 로비 소개의 시작(로비 순간이동)·끝(화면 어두워짐) 지점을 찾지 못함");
  const inside = info.lines.filter(l => { const m = l.match(/\.seq global matches (\d+)(?:\.\.(\d*))?\s+run\s+\/?(\S+)/); return m && +m[1] < fade && (m[2] === undefined ? +m[1] : (m[2] === "" ? 1e9 : +m[2])) > tpLobby; });
  const bad = inside.filter(l => !/run \/?(camera|scoreboard players set \.actionbar\.objective)/.test(l));
  if (bad.length) throw new Error("seq/act0/001: 로비 소개 안에 카메라·안내 문구 말고 다른 명령이 있음 — 건너뛰기를 다시 검토할 것\n" + bad.join("\n"));
  return { ...info, from: tpLobby + 1, fade };
})();
w("_play/skip_1.mcfunction", [
  `## 로비 소개(act 1): ${LOBBY.from}~${LOBBY.fade - 1}의 안내 문구·카메라 명령을 재생하고 화면이 어두워지는 ${LOBBY.fade}로 옮긴다`,
  ...replay(1, "act0/001", LOBBY.values.filter(v => v >= LOBBY.from && v < LOBBY.fade)),
  `execute if score .act global matches 1 if score .seq global matches ${LOBBY.from}..${LOBBY.fade} run scoreboard players set .seq global ${LOBBY.fade}`,
]);

// skip 본문: 게임마다 카운트다운 직전까지 재생
for (const s of playInfo) w(`_play/skip_${s.act}.mcfunction`, [
  `## act ${s.act}: 카운트다운(${s.countdown}) 전까지의 설명 명령을 순서대로 재생하고 ${s.countdown}로 옮긴다`,
  ...replay(s.act, s.file, s.values.filter(v => v < s.countdown), noAnimCopy(s.act, s.file, s)),
  `execute if score .act global matches ${s.act} if score .seq global matches ..${s.countdown} run scoreboard players set .seq global ${s.countdown}`,
]);
w("_play/skip.mcfunction", [
  // 로비 소개
  `execute if score .act global matches 1 run function dev/_play/skip_1`,
  `execute if score .act global matches 1 run ${msg("@a", "§e[진행] §f로비 소개를 건너뛰었습니다.")}`,
  // 경기 설명
  ...pre.map(p => `execute if score .act global matches ${p.act} run function dev/_cheat/intro_${p.act}`),
  ...playInfo.map(s => `execute if score .act global matches ${s.act} run function dev/_play/skip_${s.act}`),
  // 한꺼번에 재생된 설명 효과음을 끈다 (경기 음악은 시작 지점에서 원래대로 나온다)
  "execute unless score .act global matches 1 run stopsound @a",
  `execute unless score .act global matches 1 run ${msg("@a", "§e[진행] §f설명을 건너뛰었습니다. 3초 뒤 경기가 시작됩니다.")}`,
]);
top("skip.mcfunction", [
  "## /function skip — 지금 나오는 장면을 건너뛴다. 운영자면 누구나, 어전대회·연습 경기 모두.",
  "##   경기 설명(인트로) → 3·2·1 카운트다운부터 / 팀을 정한 뒤 나오는 로비 소개(혼천의·다섯 대결) → 로비로",
  "## 자동 생성(tools/gen-dev.js). 게임 파일은 고치지 않고, 그 장면 동안 실행될 명령을 순서대로 한꺼번에 실행할 뿐이다.",
  `scoreboard players set .play_ok global 0`,
  `execute if score .act global matches 1 if score .seq global matches ${LOBBY.from}..${LOBBY.fade - 1} run scoreboard players set .play_ok global 1`,
  `execute if score .act global matches 1 if score .seq global matches ..${LOBBY.from - 1} run ${say("§e[진행] §f로비 소개는 팀을 고르고 시작 버튼을 누른 뒤 나오는 장면에서 건너뛸 수 있어요.")}`,
  `execute if score .act global matches 1 if score .seq global matches ..${LOBBY.from - 1} run scoreboard players set .play_ok global 2`,
  ...pre.map(p => `execute if score .act global matches ${p.act} run scoreboard players set .play_ok global 1`),
  ...playInfo.map(s => `execute if score .act global matches ${s.act} if score .seq global matches ..${s.countdown - 1} run scoreboard players set .play_ok global 1`),
  `execute if score .play_ok global matches 0 run ${say("§e[진행] §f지금은 건너뛸 장면이 없습니다. (경기 설명이나 팀을 정한 뒤의 로비 소개 동안에만 쓸 수 있어요)")}`,
  ...waitLines("건너뛸"),
  `execute if score .play_ok global matches 1 if score ${WAIT} matches 0 run function dev/_play/skip`,
]);

// end 본문: 설명 준비 → 끝 지점부터 판정 직전까지 재생 → 점수 0:0 → 판정 지점으로
for (const s of playInfo.filter(s => s.team)) w(`_play/end_${s.act}.mcfunction`, [
  `## act ${s.act}: 설명 중이면 준비를 마치고(dev/_cheat/intro_${s.act}), 끝(${s.end})~판정 전(${s.judge - 1}) 명령을 재생한 뒤`,
  `## 두 팀 점수를 0으로 맞추고 판정 지점(${s.judge})으로 옮긴다 → 다음 틱에 게임이 스스로 판정한다`,
  `execute if score .act global matches ${s.act} if score .seq global matches ..${s.start - 1} run function dev/_cheat/intro_${s.act}`,
  ...replay(s.act, s.file, s.values.filter(v => v >= s.end && v < s.judge)),
  `execute if score .act global matches ${s.act} run scoreboard players set "§4Team 1" score 0`,
  `execute if score .act global matches ${s.act} run scoreboard players set "§9Team 2" score 0`,
  // 자격루 두 팀 방식은 원작 판정에 무승부 줄이 없어(>만 비교) 아무 표시 없이 끝난다 → 다른 게임과 같은 무승부 함수를 부른다
  ...(s.act === 202 ? [`execute if score .act global matches 202 run function utility/wins/tie`] : []),
  `execute if score .act global matches ${s.act} run scoreboard players set .seq global ${s.judge}`,
]);
w("_play/end.mcfunction", [
  ...pre.map(p => `execute if score .act global matches ${p.act} run function dev/_cheat/intro_${p.act}`),
  ...playInfo.filter(s => s.team).map(s => `execute if score .act global matches ${s.act} run function dev/_play/end_${s.act}`),
  "stopsound @a",
  msg("@a", "§e[진행] §f경기를 무승부로 끝냈습니다. (승리 기록 없음)"),
]);
top("end.mcfunction", [
  "## /function end — 진행 중인 경기를 무승부로 끝낸다(승리 기록 없음). 운영자면 누구나, 어전대회·연습 경기 모두. 백악산은 제외.",
  "## 자동 생성(tools/gen-dev.js). 게임 파일은 고치지 않는다. 판정은 게임 자신의 판정 지점에서 원래 명령으로 한다.",
  `scoreboard players set .play_ok global 0`,
  ...pre.map(p => `execute if score .act global matches ${p.act} run scoreboard players set .play_ok global 1`),
  ...playInfo.filter(s => s.team).map(s => `execute if score .act global matches ${s.act} if score .seq global matches ..${s.end - 1} run scoreboard players set .play_ok global 1`),
  `execute if score .act global matches 601 run ${say("§e[진행] §f백악산 엽전 달리기는 팀 경기가 아니라 무승부로 끝낼 수 없습니다.")}`,
  `execute unless score .act global matches 601 if score .play_ok global matches 0 run ${say("§e[진행] §f지금은 끝낼 경기가 없습니다. (경기 설명이나 경기 중에만 쓸 수 있어요)")}`,
  ...waitLines("끝낼"),
  `execute if score .play_ok global matches 1 if score ${WAIT} matches 0 run function dev/_play/end`,
]);

w("debug/on.mcfunction", [
  "## [개발용] 디버그 모드 켜기: 치트(dev/skip, dev/team, dev/start/craft_*)를 쓸 수 있게 된다",
  `tag @s add ${DEV_TAG}`,
  say("§6===== [dev] 디버그 모드 켜짐 ====="),
  say("§e1. 팀 §f/function dev/team/1 §7(또는 team/2)"),
  say("§e2. 시작 §f/function dev/start/<게임> §7orb craft grid nock elytra finale · 자격루는 craft_team / craft_solo"),
  say("§e3. 설명 건너뛰기 §f/function dev/skip/intro"),
  say("§e4. 끝 장면 보기 §f/function dev/skip/end §7(팀1 승) · §fdev/skip/end_team2 §7(팀2 승)"),
  say("§e5. 로비로 §f/function dev/skip/lobby §7(승패 기록 없음)"),
  say("§7연습 경기에서만 동작하고, 어전대회 경기(혼천의로 시작) 중에는 막혀 있습니다. 끄기: /function dev/debug/off"),
]);
w("debug/off.mcfunction", [
  "## [개발용] 디버그 모드 끄기",
  `tag @s remove ${DEV_TAG}`,
  say("§a[dev] §f디버그 모드를 껐습니다."),
]);

const fogs = ["lobby_fog", "g1_fog", "g2_fog", "g3_fog", "g4_fog", "g4a_fog", "g4b_fog", "g4c_fog",
  "g4d_fog", "g4e_fog", "g4f_fog", "g4g_fog", "g5_fog", "g6_fog"];
w("fog_off.mcfunction", [
  "## [개발용] 나에게 걸린 안개를 모두 끈다 (게임이 시작되면 다시 적용됨)",
  ...fogs.map(n => `fog @s remove ${n}`),
  msg("@s", "§a[dev] §f안개를 껐습니다."),
]);

w("build.mcfunction", [
  "## [개발용] 건축 모드: 크리에이티브 + 안개 끄기 + 야간 투시",
  "## admin 태그가 있으면 10초마다 관전 모드로 바뀌므로 태그를 뗀다",
  `execute if entity @s[tag=admin] run ${msg("@s", "§e[dev] 관전 모드 강제 전환을 막으려고 admin 태그를 뗐습니다. 다시 관리자가 되려면 /function admin")}`,
  "tag @s remove admin",
  "gamemode creative @s",
  "function dev/fog_off",
  "effect @s night_vision 99999 0 true",
  msg("@s", "§a[dev] §f건축 모드: 크리에이티브, 안개 끔, 야간 투시"),
]);

w("play.mcfunction", [
  "## [개발용] 플레이 모드로 복귀: 모험 모드 + 야간 투시 해제",
  "gamemode adventure @s",
  "effect @s night_vision 0",
  msg("@s", "§a[dev] §f플레이 모드: 모험 모드로 돌아왔습니다."),
]);

w("host.mcfunction", [
  "## [개발용] 나를 호스트로 지정 (NPC 대화로 게임을 시작하려면 호스트여야 함)",
  "tag @s add .host",
  msg("@s", "§a[dev] §f호스트 태그를 받았습니다."),
]);

const sc = n => `{"score":{"name":"${n}","objective":"global"}}`;
w("status.mcfunction", [
  "## [개발용] 현재 게임 상태 보기",
  msg("@s", "§6===== [dev] 게임 상태 ====="),
  `tellraw @s {"rawtext":[{"text":"§b.game §7(0=로비,1~6=게임) §f"},${sc(".game")},{"text":"   §b.act §f"},${sc(".act")},{"text":"   §b.seq §f"},${sc(".seq")},{"text":"   §b.run §f"},${sc(".run")}]}`,
  `tellraw @s {"rawtext":[{"text":"§b모드 §7(0=멀티,1=싱글) §f"},${sc(".game_mode")},{"text":"   §4팀1 인원 §f"},${sc(".team1players")},{"text":"   §9팀2 인원 §f"},${sc(".team2players")}]}`,
  `tellraw @s {"rawtext":[{"text":"§4팀1 승리 §f"},${sc(".team1wins")},{"text":"   §9팀2 승리 §f"},${sc(".team2wins")}]}`,
  `tellraw @s {"rawtext":[{"text":"§b호스트 §f"},{"selector":"@a[tag=.host]"},{"text":"   §b관리자 §f"},{"selector":"@a[tag=admin]"}]}`,
]);

w("zones.mcfunction", [
  "## [개발용] 장식을 놓으면 안 되는 게임 구역(대략)과 안개 거리",
  msg("@s", "§6===== [dev] 게임 구역 (이 안에는 장식 금지) ====="),
  msg("@s", "§e로비 §fX -50~21 Y 59~72 Z 1000~1044 §7(+인트로 카메라 0,109,1092) 안개 180"),
  msg("@s", "§e옥새 §fX -14~14 Y 61~70 Z 1974~2022 §7안개 240"),
  msg("@s", "§e자격루 §fX -24~24 Y 59~70 Z 2997~3047 §7(도면 대기 Y 91) 안개 240"),
  msg("@s", "§e꽃담 §fX -51~-16 Y 59~70 Z -109~-78 §7안개 240, 철 블록 금지"),
  msg("@s", "§e활쏘기 §fX -39~36 Y 59~73 Z 3963~4036 §7안개 90, 화살에 깨지는 블록 금지"),
  msg("@s", "§e6진 망루 §fX -176~20 Y 58~210 Z 4992~5188 §7안개 260"),
  msg("@s", "§e백악산 §fX -8~15 Y 150~340 Z 6135~6250 §7/ 시상대 X -1~3 Y -62~-50 Z 5953~5976, 안개 180"),
  msg("@s", "§c공통 §f타이머 (0,90,1998) (0,90,3017) (-33,90,-97) (0,90,4000) 덮지 않기, 문·버튼 금지, 블록은 Y 319까지"),
]);

w("help.mcfunction", [
  "## [개발용] 개발 명령 목록",
  msg("@s", "§6===== [dev] 개발 명령 ====="),
  msg("@s", "§e이동 §f/function dev/tp/<장소>"),
  msg("@s", "§7  lobby 로비 · hall 입장 홀 · npc 호스트 부스 · hq 테스트 HQ"),
  msg("@s", "§7  orb 옥새 · craft 자격루 · grid 꽃담 · nock 활쏘기 · elytra 6진 망루 · finale 백악산 · podium 시상대"),
  msg("@s", "§e시작 §f/function dev/start/<게임> §7orb craft grid nock elytra finale (연습 경기)"),
  msg("@s", "§e모드 §f/function dev/build §7건축 모드 · §f/function dev/play §7플레이 모드"),
  msg("@s", "§e기타 §f/function dev/status §7상태 · §fdev/zones §7장식 금지 구역 · §fdev/fog_off §7안개 끄기 · §fdev/host §7호스트 되기"),
  msg("@s", "§e디버그 §f/function dev/debug/on §7→ dev/team/1 · dev/skip/intro · dev/skip/end · dev/skip/lobby (연습 경기 전용)"),
  msg("@s", "§e진행 §f/function skip §7로비 소개·경기 설명 건너뛰기 · §f/function end §7무승부로 끝내기 (디버그 모드 없이, 어전대회에서도)"),
]);

// 개발용 function(behavior_packs/bp0/functions/dev/**) 생성기. 사용: node tools/gen-dev.js
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..", "behavior_packs/bp0/functions/dev");
const w = (rel, lines) => {
  const f = path.join(root, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, lines.join("\n") + "\n");
};
const msg = (sel, text) => `tellraw ${sel} {"rawtext":[{"text":"${text}"}]}`;

const places = [
  ["lobby", "1 60 1000", "1 62 1022", "로비"],
  ["hall", "-43 65 1018", "-30 65 1018", "로비 입장 홀(팀 선택)"],
  ["npc", "0.5 63 1034", "0.5 64 1042.5", "호스트 NPC 부스"],
  ["orb", "0 70 1998", "0 64 2022", "옥새 쟁탈전(오브 매복)"],
  ["craft", "0 70 3017", "0 61 3030", "자격루 복원전(기계 만들기)"],
  ["grid", "-34.5 70 -85.5", "-34.5 62 -79", "교태전 꽃담 맞추기(그리드 워즈)"],
  ["nock", "0 70 4000", "0 62 3980", "태조의 활쏘기 대회(과녁)"],
  ["elytra", "-80 180 5087", "-80 110 5087", "십자각 공성전(딱지날개)"],
  ["finale", "1 330 6208", "1 300 6230", "백악산 엽전 달리기(결승)"],
  ["podium", "1 -58 5950", "1 -55 5968", "결승 시상대"],
  ["hq", "9 0 10", "9 -3 3", "개발 테스트 HQ"],
];
for (const [name, pos, face, label] of places) {
  w(`tp/${name}.mcfunction`, [
    `## [개발용] ${label}(으)로 이동`,
    `tp @s ${pos} facing ${face}`,
    msg("@s", `§a[dev] §f${label}(으)로 이동했습니다. §7(${pos})`),
  ]);
}

const games = [
  ["orb", "orb", "옥새 쟁탈전"],
  ["craft", "craft", "자격루 복원전"],
  ["grid", "grid", "교태전 꽃담 맞추기"],
  ["nock", "nock", "태조의 활쏘기 대회"],
  ["elytra", "elytra", "십자각 공성전"],
  ["finale", "final", "백악산 엽전 달리기"],
];
for (const [name, dir, label] of games) {
  w(`start/${name}.mcfunction`, [
    `## [개발용] ${label} 시작 - NPC 대화로 시작하는 연습 경기와 같음 (어전대회 승리 기록에는 포함 안 됨)`,
    `function utility/games/${dir}/game_start`,
    msg("@a", `§a[dev] §f게임 시작: §e${label}`),
  ]);
}

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
  msg("@s", "§e십자각 §fX -176~20 Y 58~210 Z 4992~5188 §7안개 260"),
  msg("@s", "§e백악산 §fX -8~15 Y 150~340 Z 6135~6250 §7/ 시상대 X -1~3 Y -62~-50 Z 5953~5976, 안개 180"),
  msg("@s", "§c공통 §f타이머 (0,90,1998) (0,90,3017) (-33,90,-97) (0,90,4000) 덮지 않기, 문·버튼 금지, 블록은 Y 319까지"),
]);

w("help.mcfunction", [
  "## [개발용] 개발 명령 목록",
  msg("@s", "§6===== [dev] 개발 명령 ====="),
  msg("@s", "§e이동 §f/function dev/tp/<장소>"),
  msg("@s", "§7  lobby 로비 · hall 입장 홀 · npc 호스트 부스 · hq 테스트 HQ"),
  msg("@s", "§7  orb 옥새 · craft 자격루 · grid 꽃담 · nock 활쏘기 · elytra 십자각 · finale 백악산 · podium 시상대"),
  msg("@s", "§e시작 §f/function dev/start/<게임> §7orb craft grid nock elytra finale (연습 경기)"),
  msg("@s", "§e모드 §f/function dev/build §7건축 모드 · §f/function dev/play §7플레이 모드"),
  msg("@s", "§e기타 §f/function dev/status §7상태 · §fdev/zones §7장식 금지 구역 · §fdev/fog_off §7안개 끄기 · §fdev/host §7호스트 되기"),
]);

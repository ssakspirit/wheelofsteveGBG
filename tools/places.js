// 장소·게임 정보 한곳 모음: tools/gen-dev.js(개발용 function)와 tools/gen-devpage.js(개발자 페이지)가 함께 쓴다.

// 순간이동 지점: [function 이름, 좌표, 바라볼 곳, 표시 이름]
const places = [
  ["lobby", "1 60 1000", "1 62 1022", "로비"],
  ["hall", "-43 65 1018", "-30 65 1018", "로비 입장 홀(팀 선택)"],
  ["npc", "0.5 63 1034", "0.5 64 1042.5", "호스트 NPC 부스"],
  ["orb", "0 70 1998", "0 64 2022", "옥새 쟁탈전(오브 매복)"],
  ["craft", "0 70 3017", "0 61 3030", "자격루 복원전(기계 만들기)"],
  ["grid", "-34.5 70 -85.5", "-34.5 62 -79", "교태전 꽃담 맞추기(그리드 워즈)"],
  ["nock", "0 70 4000", "0 62 3980", "태조의 활쏘기 대회(과녁)"],
  ["elytra", "-80 180 5087", "-80 110 5087", "6진 망루 공성전(딱지날개)"],
  ["finale", "1 330 6208", "1 300 6230", "백악산 엽전 달리기(결승)"],
  ["podium", "1 -58 5950", "1 -55 5968", "결승 시상대"],
  ["hq", "9 0 10", "9 -3 3", "개발 테스트 HQ"],
];

// 연습 경기 시작: [function 이름, utility/games 폴더, 표시 이름]
const games = [
  ["orb", "orb", "옥새 쟁탈전"],
  ["craft", "craft", "자격루 복원전"],
  ["grid", "grid", "교태전 꽃담 맞추기"],
  ["nock", "nock", "태조의 활쏘기 대회"],
  ["elytra", "elytra", "6진 망루 공성전"],
  ["finale", "final", "백악산 엽전 달리기"],
];

// 개발자 페이지의 '장소·게임' 탭. 정규식은 문자열로 적는다 (브라우저에서도 그대로 쓴다).
//   lang: 문구 키, tex: 리소스팩 기준 텍스처 경로, items: 아이템 id, entities: 엔티티 id(rwm: 뒤), funcs: functions/ 아래 폴더
const sections = [
  {
    id: "lobby", title: "로비", en: "Lobby", game: 0, host: "wheel", tps: ["lobby", "hall", "npc", "hq"], start: null,
    desc: "경복궁 어전대회가 시작되는 곳. 팀 선택 홀, 호스트 NPC 부스, 세종대왕의 혼천의(무작위 대결 뽑기)가 있다. 대결 3개를 먼저 이긴 팀이 비밀 대결(백악산)에 나선다.",
    zone: "X -50~21 · Y 59~72 · Z 1000~1044 (+인트로 카메라 0,109,1092)", fogs: ["lobby_fog"], timer: null,
    notes: ["시작 방(X −5..5, Y 20..35, Z −5..5)으로 순간이동하면 호스트 판정·점수 초기화가 일어난다"],
    lang: ["^actionbar\\.objective\\.00[0-3]\\.", "^subtitle\\.objective\\.1000\\.", "^subtitle\\.title$", "^(chat|board|wheel|npc|map|pack|lang)\\.", "^interact\\.(wheel_of_steve|npc_1|marker)", "^item\\.(iron|diamond)_"],
    tex: ["^rwm/entity/(wheel_of_steve|honcheonui)\\.png$", "^particle/(marketing|common)/", "^pack_icon\\.png$", "^models/armor/", "^items/(iron|diamond)_",
      "^blocks/(obsidian|portal|cobblestone|stone_slab_(top|side)|hardened_clay_stained_white|stripped_oak_log(_top)?)\\.png$", "^blocks/rwm/(giwa|changho|changho_edge)\\.png$"],
    items: null, entities: ["^(wheel_of_steve|npc_\\d|marker|timer|fog_wall)$"],
    funcs: ["seq/act0", "utility/lobby", "utility/wheel", "utility/teams", "utility/wins"],
  },
  {
    id: "orb", title: "옥새 쟁탈전", en: "Orb Ambush", game: 1, host: "npc_1", tps: ["orb"], start: "orb",
    desc: "영의정 황희가 여는 대결. 나라의 도장인 옥새를 두고 겨룬다. 주제 역량: 의사소통.",
    zone: "X -14~14 · Y 61~70 · Z 1974~2022", fogs: ["g1_fog"], timer: "0 90 1998", notes: [],
    lang: ["^actionbar\\.objective\\.101\\.", "^subtitle\\.objective\\.101\\.", "^orb\\.", "^steve\\.", "^item\\.rwm:orb$"],
    tex: ["^rwm/(entity|items)/orb\\.png$", "^rwm/entity/orb_enemy\\.png$", "^particle/(orb_ambush|rainbow)\\.png$",
      "^blocks/(cobblestone(_mossy)?|stone_slab_(top|side)|glass)\\.png$", "^blocks/rwm/giwa\\.png$"],
    items: "^rwm:orb$", entities: ["^orb_"], funcs: ["seq/act1", "utility/games/orb"],
  },
  {
    id: "craft", title: "자격루 복원전", en: "Craft Off", game: 2, host: "npc_2", tps: ["craft"], start: "craft",
    desc: "장영실과 함께 고장 난 자격루 장치 5개를 도면대로 부품을 모아 다시 만든다. 주제 역량: 협동.",
    zone: "X -24~24 · Y 59~70 · Z 2997~3047 (도면 대기 Y 91)", fogs: ["g2_fog"], timer: "0 90 3017",
    notes: ["부품 아이콘 ↔ 도면 ↔ 부품·장치 모델은 함께 바꿔야 한다"],
    lang: ["^actionbar\\.objective\\.20[12]\\.", "^interact\\.craft", "^item\\.rwm:craft", "^garett\\."],
    tex: ["^rwm/(entity|items)/craft_", "^particle/contraption_craft_off\\.png$"],
    items: "^rwm:craft", entities: ["^craft_"], funcs: ["seq/act2", "utility/games/craft"],
  },
  {
    id: "grid", title: "교태전 꽃담 맞추기", en: "Grid Wars", game: 3, host: "npc_5", tps: ["grid"], start: "grid",
    desc: "교태전 꽃담의 무늬를 누가 먼저 똑같이 만드는지 겨룬다. 주제 역량: 비판적 사고.",
    zone: "X -51~-16 · Y 59~70 · Z -109~-78", fogs: ["g3_fog"], timer: "-33 90 -97", notes: ["철 블록 장식 금지"],
    lang: ["^actionbar\\.objective\\.301\\.", "^grid_block", "^natalie\\."],
    tex: ["^particle/grid_wars\\.png$", "^blocks/concrete_(lime|blue|yellow|red|magenta)\\.png$", "^rwm/entity/grid/"],
    items: null, entities: ["^grid_"], funcs: ["seq/act3", "utility/games/grid"],
  },
  {
    id: "nock", title: "태조의 활쏘기 대회", en: "Nock it Off", game: 4, host: "npc_4", tps: ["nock"], start: "nock",
    desc: "태조 이성계의 활터. 과녁을 맞혀 겨룬다. 주제 역량: 창의성.",
    zone: "X -39~36 · Y 59~73 · Z 3963~4036", fogs: ["g4_fog", "g4a_fog", "g4b_fog", "g4c_fog", "g4d_fog", "g4e_fog", "g4f_fog", "g4g_fog"], timer: "0 90 4000",
    notes: ["화살에 깨지는 블록 장식 금지"],
    lang: ["^actionbar\\.objective\\.401\\.", "^henry\\."],
    tex: ["^rwm/entity/nock_", "^rwm/entity/target_mobs/", "^entity/bat\\.png$", "^rwm/entity/wooden_cart\\.png$","^particle/(nock_it_off|arrow|rainbow)\\.png$"],
    items: null, entities: ["^nock_"], funcs: ["seq/act4", "utility/games/nock"],
  },
  {
    id: "elytra", title: "6진 망루 공성전", en: "Elytra Rumble", game: 5, host: "npc_3", tps: ["elytra"], start: "elytra",
    desc: "김종서가 개척한 북방 6진의 하늘 공성전. 백두산 용암 위를 날아 상대 망루(홍포대 망루 · 청포대 망루)에 비격진천뢰를 떨어뜨린다. 주제 역량: 커뮤니티.",
    zone: "X -176~20 · Y 58~210 · Z 4992~5188", fogs: ["g5_fog"], timer: null, notes: [],
    lang: ["^actionbar\\.objective\\.501\\.", "^dawn\\."],
    tex: ["^rwm/entity/tnt_", "^particle/elytra_rumble\\.png$", "^blocks/(mangrove_(planks|log_side|log_top)|cobblestone)\\.png$"],
    items: null, entities: ["^elytra_"], funcs: ["seq/act5", "utility/games/elytra"],
  },
  {
    id: "finale", title: "백악산 엽전 달리기", en: "Finale Showdown", game: 6, host: null, tps: ["finale", "podium"], start: "finale",
    desc: "대결 3개를 먼저 이긴 팀이 나서는 비밀 대결. 끝나면 시상대에서 우승 팀을 발표한다.",
    zone: "X -8~15 · Y 150~340 · Z 6135~6250 / 시상대 X -1~3 · Y -62~-50 · Z 5953~5976", fogs: ["g6_fog"], timer: null, notes: [],
    lang: ["^actionbar\\.objective\\.601\\.", "^item\\.emerald\\.name$"],
    tex: ["^items/emerald\\.png$"],
    items: null, entities: ["^final_"], funcs: ["seq/act6", "utility/games/final"],
  },
];

// 게임 진행 순서(seq 파일)와 디버그 치트가 건너뛸 지점. 값은 해당 파일의 .seq 번호(20틱 = 1초)이며,
// gen-dev.js가 파일 안에 그 번호가 실제로 있는지 확인한다(원본이 바뀌면 생성이 멈춘다).
//   start: 경기 시작(타이머 등장·움직임 풀림)  end: 경기 끝(타이머 사라짐 → 승패 → 종료 장면 → 로비)
const sequences = [
  { act: 101, file: "act1/101", game: "orb", start: 700, end: 6700 },
  { act: 201, file: "act2/201", game: "craft", start: 1200, end: 7200, note: "한쪽 팀만 있을 때: 5개 모두 고장, 시간제" },
  { act: 202, file: "act2/202", game: "craft", start: 2200, end: 8200, note: "두 팀: 3개 고장, 먼저 3개 고치면 승리" },
  { act: 301, file: "act3/301", game: "grid", start: 1160, end: 7280 },
  { act: 401, file: "act4/401", game: "nock", start: 600, end: 4160 },
  { act: 501, file: "act5/501", game: "elytra", start: 1160, end: 7280 },
  { act: 601, file: "act6/601", game: "finale", start: 1000, end: 2301 },
];
// 자격루는 act 200이 20번에서 act 201(한 팀)·202(두 팀)로 갈라진다
const preSequences = [{ act: 200, file: "act2/200", branch: 20 }];

// 개발자 페이지 '명령어' 탭에 싣는 안내. 명령 자체는 gen-dev.js가 만든다(이동·시작은 위 places·games에서 자동으로 채움).
//   debug: true = 디버그 모드(/function dev/debug/on)와 연습 경기에서만 동작하는 치트
const devCommands = [
  { group: "디버그 모드", items: [
    { cmd: "/function dev/debug/on", desc: "디버그 모드 켜기. 아래 치트를 쓸 수 있게 되고 사용법이 채팅에 나온다" },
    { cmd: "/function dev/debug/off", desc: "디버그 모드 끄기" },
  ] },
  { group: "치트 (혼자서 테스트)", items: [
    { cmd: "/function dev/team/1", desc: "나를 팀 1(홍포대)에 넣기 — 로비 팀 선택 구역에 들어간 것과 같음", debug: true },
    { cmd: "/function dev/team/2", desc: "나를 팀 2(청포대)에 넣기", debug: true },
    { cmd: "/function dev/skip/intro", desc: "설명(인트로)을 건너뛰고 바로 경기 시작. 준비 명령은 순서대로 모두 실행됨", debug: true },
    { cmd: "/function dev/skip/end", desc: "팀 1 승리로 경기를 끝내고 원래 종료 장면 보기. 자격루는 이긴 팀 장치를 모두 고친 상태로", debug: true },
    { cmd: "/function dev/skip/end_team2", desc: "팀 2 승리로 경기 끝내기", debug: true },
    { cmd: "/function dev/skip/lobby", desc: "게임을 바로 정리하고 로비로 (승패 기록 없음)", debug: true },
    { cmd: "/function dev/start/craft_team", desc: "자격루 복원전을 두 팀 모드로 시작 (3개 고장 · 3개 먼저 고치면 승리) — 혼자서도 가능", debug: true },
    { cmd: "/function dev/start/craft_solo", desc: "자격루 복원전을 한 팀 모드로 시작 (5개 고장 · 시간제)", debug: true },
  ] },
  { group: "모드 · 상태", items: [
    { cmd: "/function dev/build", desc: "건축 모드: 크리에이티브 + 안개 끄기 + 야간 투시 (admin 태그를 떼서 관전 모드 강제 전환을 막음)" },
    { cmd: "/function dev/play", desc: "플레이 모드로 복귀: 모험 모드, 야간 투시 해제" },
    { cmd: "/function dev/status", desc: "현재 게임 상태(.game · .act · .seq · 팀 인원 · 승수 · 호스트) 보기" },
    { cmd: "/function dev/zones", desc: "장식을 놓으면 안 되는 게임 구역과 안개 거리 보기" },
    { cmd: "/function dev/fog_off", desc: "나에게 걸린 안개 끄기 (게임이 시작되면 다시 적용)" },
    { cmd: "/function dev/host", desc: "나를 호스트로 지정 (NPC 대화로 게임을 시작하려면 필요)" },
    { cmd: "/function dev/help", desc: "개발 명령 목록을 채팅으로 보기" },
  ] },
  { group: "원래 월드에 있던 명령", items: [
    { cmd: "/function admin", desc: "관리자 관찰자 되기: 팀에서 빠지고 금 갑옷 · 크리에이티브. 10초마다 관전 모드로 바뀜" },
    { cmd: "/function utility/admin_commands", desc: "관리자용 상태 보기. 안내되는 순간이동 좌표는 원작 기준이라 맞지 않음", warn: "안내된 /tp @s 0 30 0 은 시작 방이라 호스트 판정·점수 초기화가 일어남 — 대신 dev/tp 사용" },
    { cmd: "/function version", desc: "맵 버전 보기" },
  ] },
];
// 자주 쓰는 순서 (명령을 차례로 입력)
const devRecipes = [
  { title: "혼자서 게임 끝 장면 보기", steps: ["/function dev/debug/on", "/function dev/team/1", "/function dev/start/orb", "/function dev/skip/intro", "/function dev/skip/end"],
    note: "dev/start/orb 대신 craft · grid · nock · elytra · finale. 종료 장면이 끝나면 저절로 로비로 돌아간다" },
  { title: "자격루 두 팀 모드 끝 장면 (완성된 장치 연쇄 동작)", steps: ["/function dev/debug/on", "/function dev/team/1", "/function dev/start/craft_team", "/function dev/skip/intro", "/function dev/skip/end"],
    note: "끝 장면에서 이긴 팀 장치 5개가 모두 고쳐진 상태로 10초 연쇄 동작이 나온다" },
  { title: "경기 한 판 직접 해 보기", steps: ["/function dev/debug/on", "/function dev/team/1", "/function dev/start/grid", "/function dev/skip/intro"],
    note: "설명만 건너뛰고 실제로 플레이. 그만두려면 /function dev/skip/lobby" },
  { title: "장식 짓기", steps: ["/function dev/tp/lobby", "/function dev/build", "/function dev/zones", "/function dev/play"],
    note: "게임 구역·카메라 경로 밖에만 짓기. 시작 방(X −5..5, Y 20..35, Z −5..5)으로는 이동하지 말 것" },
];

module.exports = { places, games, sections, sequences, preSequences, devCommands, devRecipes };

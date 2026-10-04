// 개발자 페이지에서 3D 모델 카드에 붙이는 이름: [변경 전, 변경 후].
// 키: 텍스처 경로(textures/ 뒤) — 한 텍스처를 여러 모델이 쓰면 "경로|모델 키"(client_entity의 텍스처 키)로 따로 적는다.
// 아이템과 이름이 같은 텍스처(자격루 부품 craft_part_N, 옥새 orb 등)는 적지 않아도 아이템 문구(원본/현재)에서 자동으로 붙는다.
const P = "rwm/entity/target_mobs/";
const names = {
  // 태조의 활쏘기 대회 — 동물 모형(rwm:nock_prop)
  [P + "wolf.png"]: ["늑대", "호랑이"],
  [P + "fox.png"]: ["여우", "까치"],
  [P + "armadillo.png"]: ["아르마딜로", "거북"],
  [P + "llama.png"]: ["라마", "꽃사슴(불로초)"],
  [P + "goat.png"]: ["염소", "백록(흰 사슴)"],
  [P + "polar_bear.png"]: ["북극곰", "백호"],
  [P + "snow_golem.png"]: ["눈골렘", "수성노인"],
  [P + "bee.png"]: ["벌", "호랑나비"],
  [P + "chicken.png"]: ["닭", "학"],
  [P + "spider.png"]: ["거미", "게"],
  [P + "donkey.png"]: ["당나귀", "천마"],
  [P + "sheep.png"]: ["양", "고양이"],
  [P + "cow.png"]: ["소", "누렁소"],
  [P + "sniffer.png"]: ["스니퍼", "해치"],
  [P + "pig.png"]: ["돼지", "삽살개"],
  [P + "camel.png"]: ["낙타", "기린(麒麟)"],
  [P + "rabbit_desert.png"]: ["사막 토끼", "산토끼"],
  [P + "rabbit_plains.png"]: ["들 토끼", "옥토끼"],
  [P + "minecart.png"]: ["TNT 광차", "TNT 광차 (게임에서 안 씀)"],
  // 과녁
  "rwm/entity/nock_target.png": ["과녁", "국궁 과녁"],
  "rwm/entity/nock_target_creeper.png": ["크리퍼 특수 과녁", "웅후(곰 과녁)"],
  "rwm/entity/nock_target_enderman.png": ["엔더맨 특수 과녁", "미후(사슴 과녁)"],
  "entity/bat.png": ["박쥐", "붉은 박쥐(홍복)"],
  "rwm/entity/wooden_cart.png": ["광차", "나무 수레"],
  "rwm/entity/gbg_poster.png": ["", "어전대회 포스터 액자"],
  // 옥새 쟁탈전
  "rwm/entity/orb.png": ["오브", "옥새"],
  "rwm/entity/orb_enemy.png": ["좀비 피글린 (바닐라)", "복면 도적"],
  // 6진 망루 공성전 — 폭탄
  "rwm/entity/tnt_pickup.png": ["TNT 폭탄", "비격진천뢰"],
  "rwm/entity/tnt_pickup_toggle.png": ["TNT 폭탄 (활성 · 낙하 표시)", "비격진천뢰 (불붙은 심지 · 불씨 낙하 표시)"],
  // 백악산 엽전 달리기 — 떨어지는 '엽전'은 바닐라 에메랄드 아이템 (아이콘을 덮어씀, tools/skins/finale.js)
  "items/emerald.png": ["에메랄드 (바닐라)", "엽전 (상평통보)"],
  "pack_icon.png": ["스티브 얼굴 (리소스팩 아이콘)", "근정전 앞 태조 이성계 (리소스팩 아이콘)"],
  // 시작 방 포스터 (파티클 rwm:lobby_keyart, tools/skins/keyart.py)
  "particle/marketing/movieMinigames_MarketingKeyArt.png": ["Wheel of Steve 홍보 포스터", "경복궁 어전대회 포스터 (경복궁 배경)"],
  // 팀 옷 — 철(홍포대)·다이아(청포대) 갑옷 (tools/skins/armor.js)
  "models/armor/iron_1.png": ["팀 1 철 갑옷 (투구·흉갑·부츠)", "홍포대 사모·관복·목화"],
  "models/armor/iron_2.png": ["팀 1 철 갑옷 (다리보호대)", "홍포대 관복 아랫자락"],
  "models/armor/diamond_1.png": ["팀 2 다이아 갑옷 (투구·흉갑·부츠)", "청포대 사모·관복·목화"],
  "models/armor/diamond_2.png": ["팀 2 다이아 갑옷 (다리보호대)", "청포대 관복 아랫자락"],
  // 로비 입구의 게임 표지 로고 (파티클 rwm:logo_*, tools/skins/logos.js · orb.js)
  "particle/orb_ambush.png": ["오브 매복 로고", "옥새 쟁탈전 로고"],
  "particle/contraption_craft_off.png": ["기계 만들기 로고", "자격루 복원전 로고"],
  "particle/grid_wars.png": ["그리드 워즈 로고", "교태전 꽃담 맞추기 로고"],
  "particle/nock_it_off.png": ["과녁 맞히기 로고", "태조의 활쏘기 대회 로고"],
  "particle/elytra_rumble.png": ["엘리트라 럼블 로고", "6진 망루 공성전 로고"],
  // 혼천의
  "rwm/entity/honcheonui.png": ["스티브의 바퀴", "혼천의"],
  "rwm/entity/wheel_of_steve.png": ["스티브의 바퀴", "스티브의 바퀴 (혼천의 색, 지금 안 씀)"],
  // 교태전 꽃담 맞추기 — 정원의 블록 (원래는 바닐라 콘크리트 텍스처)
  "rwm/entity/grid/grid_block_lime.png": ["연두 콘크리트", "대나무 꽃전돌"],
  "rwm/entity/grid/grid_block_blue.png": ["파랑 콘크리트", "거북등 꽃전돌"],
  "rwm/entity/grid/grid_block_yellow.png": ["노랑 콘크리트", "국화 꽃전돌"],
  "rwm/entity/grid/grid_block_red.png": ["빨강 콘크리트", "모란 꽃전돌"],
  "rwm/entity/grid/grid_block_magenta.png": ["자홍 콘크리트", "매화 꽃전돌"],
  "rwm/entity/grid/grid_block_empty.png": ["빈 블록", "빈 자리"],
};
// 교태전 — 바닐라 콘크리트 블록 텍스처를 덮어쓴 것 (월드의 같은 색 콘크리트 전체)
for (const [c, ko, motif] of [["lime", "연두", "대나무"], ["blue", "파랑", "거북등"], ["yellow", "노랑", "국화"], ["red", "빨강", "모란"], ["magenta", "자홍", "매화"]])
  names[`blocks/concrete_${c}.png`] = [`${ko} 콘크리트 (바닐라 블록)`, `${motif} 꽃전돌 (월드 전체 ${ko} 콘크리트)`];
// 자격루 복원전 — 장치 5개 × 고장/수리 (텍스처 한 장을 함께 쓴다), 장치마다 설계 보드
const DEV = [["바퀴", "물 공급 장치"], ["치킨 펀처", "잣대 장치"], ["도르래", "구슬 신호 장치"], ["광물 수레", "종·북·징 시보 장치"], ["케이지", "십이지신 시각 알림 장치"]];
DEV.forEach(([a, b], i) => {
  for (const [st, ko] of [["broken", "고장"], ["fixed", "수리"]])
    names[`rwm/entity/craft_contraption_fixed.png|craft_contraption_${i + 1}_${st}`] = [`${a} (${ko})`, `${b} (${ko})`];
  names[`rwm/entity/craft_board_${i + 1}.png`] = [`제작 보드 ${i + 1} (${a})`, `설계 보드 ${i + 1} (${b})`];
});
names["rwm/entity/craft_board_blank.png"] = ["빈 제작 보드", "빈 설계 보드"];
// 호스트 NPC(rwm/entity/npc/npc_N.png)는 호스트 이름 문구(원본/현재)에서 자동으로 붙는다.
module.exports = names;

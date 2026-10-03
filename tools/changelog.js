// 개발자 페이지 요약 탭의 '변경 기록'. 새로 바꾼 것을 위에 적는다.
// place: tools/places.js의 장소 id (누르면 그 장소 페이지로), tab: 바로 볼 탭(models · sounds · items · textures …)
module.exports = [
  {
    date: "2026-10-04", title: "한옥 5차 — 한국어 표지판 · 하늘 · 소품",
    items: [
      { text: "영어로 남아 있던 표지판 26개(로비 팀 홀·시작 버튼, 교태전 '보드 지우기', 지하 관리실)를 한국어로 — 구조물 + /function hanok/signs_ko (게임 안에서 한 번 실행)", place: "lobby" },
      { text: "교태전 정원 기둥(껍질 벗긴 정글나무)은 원래 그림으로 되돌림 — 붉은 기둥이 홍포대 쪽으로 기운 느낌을 주고 꽃담의 모란(빨강) 무늬 색과도 겹쳐서. 로비의 붉은 기둥은 그대로", place: "grid", tab: "textures" },
      { text: "표지판 → 현판, 해·달 → 일월오봉도의 붉은 해·흰 달, 상자 → 반닫이, 통 → 뒤주, 화로 → 아궁이 화덕, 침대 → 이부자리 — tools/skins/hanok-props.py", place: "lobby", tab: "textures" },
    ],
  },
  {
    date: "2026-10-03", title: "한옥 4차 — 손에 드는 물건과 소품",
    items: [
      { text: "활 → 각궁(검은 물소뿔 활대, 붉은 줌통, 누런 끝), 폭죽 로켓 → 신기전(약통 단 화살), 겉날개 → 학 날개(흰 깃·검은 끝깃) — tools/skins/hanok-items.py", tab: "textures" },
      { text: "랜턴 → 청사초롱(위 붉은 비단·아래 푸른 비단), 참나무 문 → 띠살문, 책장 → 책가도", place: "lobby", tab: "textures" },
      { text: "금 간·조각된 석재 벽돌 → 금 간·연꽃 새긴 장대석(교태전 바닥 얼룩 정리), 가문비 울타리 → 고동색 난간(자격루 공방 색 통일)", place: "grid", tab: "textures" },
    ],
  },
  {
    date: "2026-10-03", title: "한옥 궁궐 블록 3차 — 교태전 정원 · 화약궤 · 난간 · 망루 팀 색",
    items: [
      { text: "교태전 정원 세트: 회백색 콘크리트 → 회색 전돌(꽃담 판 둘레), 정글나무 반 블록 → 장대석(가운데 길·담 덮개), 정글나무 울타리 → 대나무 살", place: "grid", tab: "textures" },
      { text: "TNT → 화약궤('火' 붉은 종이를 붙인 나무 궤짝, 자격루 공방·로비 장식), 참나무 울타리 → 원목 기둥과 같은 짙은 고동색 난간", place: "craft", tab: "textures" },
      { text: "6진 망루 목재를 팀 색으로: 홍포대 망루(맹그로브) 검붉은 옻칠 목재, 청포대 망루(뒤틀린 판자) 검푸른 옻칠 목재", place: "elytra", tab: "textures" },
    ],
  },
  {
    date: "2026-10-03", title: "한옥 궁궐 블록 2차 — 회벽 · 장대석",
    items: [
      { text: "석재 벽돌(계단·반 블록·담장 포함) → 장대석: 길게 다듬은 화강암 기단 (교태전 정원 바닥, 로비·활쏘기 벽)", place: "grid", tab: "textures" },
      { text: "참나무 판자 → 흰 회벽 (사용처 조사: 로비 마을·옥새·자격루 건물 벽이 대부분). 원목 기둥 사이가 하얗게 채워져 한옥 벽처럼 보임. 참나무 울타리 등은 나무색 그대로 (blocks.json 연결)", place: "orb", tab: "textures" },
    ],
  },
  {
    date: "2026-10-03", title: "플레이어 소개 페이지",
    items: [
      { text: "초중등 학생용 월드 소개 웹 페이지 (claude.ai): 대회 진행, 여섯 마당 규칙·꿀팁(코드 기준), 역사 인물, 물건·민화 동물·궁궐 블록의 뜻, 배경음악 미리듣기, 선생님 진행 팁 — tools/playerpage/. 역사 내용은 사전·사료와 대조해 고침 (장영실 태종 때 발탁, 대사례는 성균관, 묘접도는 중국어 발음, 비격진천뢰 약 140년 뒤 등)" },
      { text: "게임 안 문구를 실제 규칙·역사에 맞춤: 6진 망루 조기 종료 10점 → 50점, 백악산 '탈락' → 엽전을 못 줍거나 밀려남, 정도전 '경복궁을 설계' → '도읍 한양을 계획하고 경복궁과 전각 이름을 지은', '설계도을' → '설계도를'", tab: "lang" },
    ],
  },
  {
    date: "2026-10-03", title: "구역 3D (월드 블록 그대로 보기)",
    items: [
      { text: "장소마다 '구역 3D' — 월드 저장 데이터에서 게임장을 블록 그대로 뽑아 돌려 보기 (python tools/export-areas.py). 현재/원본 텍스처 전환으로 한옥 블록 리테마 전후 비교, 높이 자르기로 자격루 동굴 공방·교태전 숲 속 정원 보기", place: "orb" },
    ],
  },
  {
    date: "2026-10-03", title: "한옥 궁궐 블록 1차 (월드 전체 블록 텍스처)",
    items: [
      { text: "사용처 조사(tools/scan-blocks.py)로 고른 바닐라 블록 8가지의 그림을 리소스팩에서 바꿈 — 월드 데이터는 그대로, 같은 블록이 월드 전체에서 바뀜 (tools/skins/hanok-blocks.js)", tab: "textures" },
      { text: "궐문: 로비 게임 선택 문의 흑요석 → 단청 문틀, 보라 포털 → 금빛 구름이 흐르는 문 안쪽", place: "lobby", tab: "textures" },
      { text: "기와: 참나무 계단·반 블록 → 검은 기와 (로비 마을·옥새·자격루 지붕). 판자와 그림을 공유해서 blocks.json에서 새 그림으로 연결", place: "orb", tab: "textures" },
      { text: "담장돌·박석: 조약돌(이끼 포함) → 화강암 마름돌 담장, 매끄러운 돌 → 박석 마당", place: "orb", tab: "textures" },
      { text: "창호·회벽·붉은 기둥: 유리 → 나무 창살 진열장, 판유리 → 띠살 창호지, 흰 테라코타 → 회벽, 벗긴 참나무 원목 → 주칠 기둥", place: "lobby", tab: "textures" },
      { text: "망루 목재: 맹그로브 원목·판자·계단 → 6진 망루의 검게 그을린 목재", place: "elytra", tab: "textures" },
    ],
  },
  {
    date: "2026-10-03", title: "로비 로고 크기 · 꽃전돌 깜박임",
    items: [
      { text: "옥새 쟁탈전 로고만 두 배로 크게 보이던 것 → 다른 로고와 같은 크기 (원작은 7×7 작은 그림을 1.5배로 키웠고, 새 로고는 16×16을 꽉 채우므로 0.75)", place: "lobby" },
      { text: "교태전 정원 블록이 돌 때 네 옆면 중 동·서 두 면의 무늬가 깜박이며 겹쳐 보이던 것 수정 — Bedrock은 X축이 뒤집혀 east/west 면이 반대쪽에 그려지므로, 무늬판이 몸통 면과 같은 자리에 놓였었다 (tools/skins/grid.js)", place: "grid", tab: "models" },
    ],
  },
  {
    date: "2026-10-01", title: "활쏘기 철길 — 나무 수레",
    items: [
      { text: "과녁을 싣고 철길을 도는 바닐라 광차 → 쇠테 바퀴·철띠 기둥·끌채가 달린 나무 수레 (Blockbench, tools/skins/nock/minecart.js). 월드의 모든 일반 광차가 바뀌고 상자·TNT·호퍼 광차는 그대로", place: "nock", tab: "models" },
    ],
  },
  {
    date: "2026-10-01", title: "아이콘 · 점검 도구",
    items: [
      { text: "행동팩 아이콘(근정전 앞 혼천의), 리소스팩 아이콘(태조 이성계), 월드 목록 썸네일(포스터) — tools/skins/packicon.py", place: "lobby" },
      { text: "행동팩 이름이 한국어 화면에서도 'Movie Minigames'로 나오던 것 → '경복궁 어전대회' (behavior_packs/bp0/texts/ko_KR.lang)" },
      { text: "6진 망루 안내에서 빠져 있던 '공격이나 웅크리기를 눌러 떨어뜨리세요' 추가", place: "elytra" },
      { text: "팩 점검 도구 node tools/check-pack.js: JSON 문법, 모델·텍스처·애니메이션·렌더 컨트롤러·소리 연결, 문구 자리표시 검사 — 오류 0개" },
    ],
  },
  {
    date: "2026-10-01", title: "전체 점검 마무리 — 시작 포스터 · 팀 관복 · 배경음악 4곡",
    items: [
      { text: "시작 방 대형 포스터: 'WHEEL OF STEVE' 홍보 그림 → Gemini로 만든 블록 스타일 경복궁(근정전·북악산) 배경과 금박 제목·부제('혼천의를 돌려 다섯 마당으로 겨루다'), 황희·장영실·이성계·혼천의·정도전·김종서 배치는 Claude 디자인 캔버스에서 손으로 맞춤, '개발: 스티브코딩'", place: "lobby" },
      { text: "리소스팩 아이콘: 스티브 얼굴 → 근정전 앞 태조 이성계 상반신 (tools/skins/packicon.py)", place: "lobby" },
      { text: "팀 옷: 철·다이아 갑옷 → 홍포대·청포대 관복 (검은 사모, 흉배·각대 단령, 아랫자락, 목화) 착용 모습과 아이콘 8개", place: "lobby", tab: "models" },
      { text: "배경음악: 자격루(Jagyeokru Workshop) · 교태전(Gyotaejeon Garden Flow 두 곡 이어 붙임) · 활쏘기(The King's Archery Contest + Royal Target) · 6진 망루(Vanguard Charge)", tab: "sounds" },
    ],
  },
  {
    date: "2026-10-01", title: "백악산 엽전 달리기",
    items: [
      { text: "엽전(바닐라 에메랄드) 아이콘 → 상평통보", place: "finale" },
      { text: "피날레 배경음악: 사물놀이·태평소 'Royal Mountain Descent'", place: "finale", tab: "sounds" },
      { text: "로비 시작 문구 번역 (Interact to Start → 상호작용하여 시작하세요)", place: "lobby" },
    ],
  },
  {
    date: "2026-10-01", title: "6진 망루 공성전 · 로비 게임 로고",
    items: [
      { text: "십자각 공성전 → 6진 망루 공성전 (김종서의 북방 6진, 용암산 = 백두산), 탑 이름 홍포대 망루 / 청포대 망루", place: "elytra" },
      { text: "TNT 폭탄 → 비격진천뢰 (불붙은 심지, 불씨 낙하 표시)", place: "elytra", tab: "models" },
      { text: "로비 게임 표지 로고 5종을 인장 액자 세트로 (자격루·꽃담·활쏘기·6진 망루 새로 그림)", place: "lobby" },
    ],
  },
  {
    date: "2026-10-01", title: "태조의 활쏘기 대회 — 민화 동물",
    items: [
      { text: "동물 모형 18종을 구역별 민화 장면으로 (호작도·십장생·신선도·초충도·어해도·묘작도·벽사·기린)", place: "nock", tab: "models" },
      { text: "호랑이·백호는 새 뼈대와 포효 애니메이션", place: "nock" },
      { text: "과녁 → 국궁 과녁 · 웅후(곰) · 미후(사슴), 박쥐 → 붉은 홍복 박쥐", place: "nock" },
    ],
  },
  {
    date: "2026-10-01", title: "옥새 쟁탈전",
    items: [
      { text: "오브 → 거북 손잡이 금 옥새, 좀비 피글린 → 복면 도적, 무지개 파티클 → 오방색", place: "orb", tab: "models" },
      { text: "배경음악: 대취타풍 'Imperial Vanguard'", place: "orb", tab: "sounds" },
    ],
  },
  {
    date: "2026-10-01", title: "개발자 페이지",
    items: [
      { text: "3D 모델 탭: 모든 모델을 변경 전/후로 나란히, 이름표(예: 낙타 → 기린)", tab: "models" },
      { text: "음원 재생기(게임 배속 재현)", tab: "sounds" },
    ],
  },
];

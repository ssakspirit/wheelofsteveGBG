// 개발자 페이지 요약 탭의 '변경 기록'. 새로 바꾼 것을 위에 적는다.
// place: tools/places.js의 장소 id (누르면 그 장소 페이지로), tab: 바로 볼 탭(models · sounds · items · textures …)
module.exports = [
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

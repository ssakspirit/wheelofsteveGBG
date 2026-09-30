## [개발용] 디버그 모드 켜기: 치트(dev/skip, dev/team, dev/start/craft_*)를 쓸 수 있게 된다
tag @s add rwm_dev
tellraw @s {"rawtext":[{"text":"§6===== [dev] 디버그 모드 켜짐 ====="}]}
tellraw @s {"rawtext":[{"text":"§e1. 팀 §f/function dev/team/1 §7(또는 team/2)"}]}
tellraw @s {"rawtext":[{"text":"§e2. 시작 §f/function dev/start/<게임> §7orb craft grid nock elytra finale · 자격루는 craft_team / craft_solo"}]}
tellraw @s {"rawtext":[{"text":"§e3. 설명 건너뛰기 §f/function dev/skip/intro"}]}
tellraw @s {"rawtext":[{"text":"§e4. 끝 장면 보기 §f/function dev/skip/end §7(팀1 승) · §fdev/skip/end_team2 §7(팀2 승)"}]}
tellraw @s {"rawtext":[{"text":"§e5. 로비로 §f/function dev/skip/lobby §7(승패 기록 없음)"}]}
tellraw @s {"rawtext":[{"text":"§7연습 경기에서만 동작하고, 어전대회 경기(혼천의로 시작) 중에는 막혀 있습니다. 끄기: /function dev/debug/off"}]}

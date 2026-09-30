## [개발용 치트] 자격루 복원전을 두 팀 모드(3개 고장·3개 먼저 수리)로 시작
## 디버그 모드(/function dev/debug/on)에서만, 어전대회 경기가 아닐 때만 동작한다.
execute unless entity @s[tag=rwm_dev] run tellraw @s {"rawtext":[{"text":"§c[dev] 디버그 모드에서만 쓸 수 있습니다: §f/function dev/debug/on"}]}
execute if entity @s[tag=rwm_dev] if score .wheelgame global matches 1..5 run tellraw @s {"rawtext":[{"text":"§c[dev] 어전대회 경기 중에는 쓸 수 없습니다. 연습 경기(/function dev/start/<게임>)에서 쓰세요."}]}
execute if entity @s[tag=rwm_dev] unless score .wheelgame global matches 1..5 run function dev/_cheat/craft_team

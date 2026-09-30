## [개발용 치트] 게임을 바로 정리하고 로비로 (승패 기록 없음)
## 디버그 모드(/function dev/debug/on)에서만, 어전대회 경기가 아닐 때만 동작한다.
execute unless entity @s[tag=rwm_dev] run tellraw @s {"rawtext":[{"text":"§c[dev] 디버그 모드에서만 쓸 수 있습니다: §f/function dev/debug/on"}]}
execute if entity @s[tag=rwm_dev] if score .wheelgame global matches 1..5 run tellraw @s {"rawtext":[{"text":"§c[dev] 어전대회 경기 중에는 쓸 수 없습니다. 연습 경기(/function dev/start/<게임>)에서 쓰세요."}]}
execute if entity @s[tag=rwm_dev] unless score .wheelgame global matches 1..5 unless score .act global matches 101..601 run tellraw @s {"rawtext":[{"text":"§c[dev] 진행 중인 게임이 없습니다. 먼저 §f/function dev/start/<게임>"}]}
execute if entity @s[tag=rwm_dev] unless score .wheelgame global matches 1..5 if score .act global matches 101..601 run function dev/_cheat/lobby

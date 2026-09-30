## 자격루 연습 경기를 한 팀 모드(5개 고장·시간제)로 시작
function utility/games/craft/game_start
execute if score .act global matches 200 if score .seq global matches ..0 run scoreboard players set .seq global 0
execute if score .act global matches 200 if score .seq global matches 0 as @p at @s run function seq/act2/200
execute if score .act global matches 200 if score .seq global matches ..2 run scoreboard players set .seq global 2
execute if score .act global matches 200 if score .seq global matches 2 as @p at @s run function seq/act2/200
execute if score .act global matches 200 if score .seq global matches ..15 run scoreboard players set .seq global 15
execute if score .act global matches 200 if score .seq global matches 15 as @p at @s run function seq/act2/200
scoreboard players set .gamemode craft_scores 1
scoreboard players set .seq global 20
tellraw @s {"rawtext":[{"text":"§a[dev] §f자격루 복원전을 §e한 팀 모드(5개 고장·시간제)§f로 시작합니다."}]}

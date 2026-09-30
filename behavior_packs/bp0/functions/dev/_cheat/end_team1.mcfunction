## 팀 1 승리로 경기 끝 지점으로 옮긴다 (아직 설명 중이면 먼저 설명을 건너뛴다)
function dev/_cheat/intro
scoreboard players operation "§4Team 1" score = "§9Team 2" score
scoreboard players add "§4Team 1" score 1
## 자격루: 이긴 팀 장치를 모두 수리해 완성된 모습으로 종료 장면을 본다
execute if score .act global matches 201..202 run event entity @e[type=rwm:craft_contraption,tag=contraption_team1,tag=contraption_1] rwm:contraption_1_fixed
execute if score .act global matches 201..202 run event entity @e[type=rwm:craft_contraption,tag=contraption_team1,tag=contraption_2] rwm:contraption_2_fixed
execute if score .act global matches 201..202 run event entity @e[type=rwm:craft_contraption,tag=contraption_team1,tag=contraption_3] rwm:contraption_3_fixed
execute if score .act global matches 201..202 run event entity @e[type=rwm:craft_contraption,tag=contraption_team1,tag=contraption_4] rwm:contraption_4_fixed
execute if score .act global matches 201..202 run event entity @e[type=rwm:craft_contraption,tag=contraption_team1,tag=contraption_5] rwm:contraption_5_fixed
## 백악산: 나를 참가자로 넣고 1등 점수를 준다 (결승 참가 자격은 원래 어전대회 승수로 정해짐)
execute if score .act global matches 601 run tag @s add final_players
execute if score .act global matches 601 run scoreboard players add @s final_showdown_score 10
execute if score .act global matches 101 if score .seq global matches ..6700 run scoreboard players set .seq global 6700
execute if score .act global matches 201 if score .seq global matches ..7200 run scoreboard players set .seq global 7200
execute if score .act global matches 202 if score .seq global matches ..8200 run scoreboard players set .seq global 8200
execute if score .act global matches 301 if score .seq global matches ..7280 run scoreboard players set .seq global 7280
execute if score .act global matches 401 if score .seq global matches ..4160 run scoreboard players set .seq global 4160
execute if score .act global matches 501 if score .seq global matches ..7280 run scoreboard players set .seq global 7280
execute if score .act global matches 601 if score .seq global matches ..2301 run scoreboard players set .seq global 2301
tellraw @s {"rawtext":[{"text":"§a[dev] §f팀 1 승리로 경기를 끝냅니다. 종료 장면이 이어집니다."}]}
tellraw @s {"rawtext":[{"text":"§7  (.act "},{"score":{"name":".act","objective":"global"}},{"text":" · .seq "},{"score":{"name":".seq","objective":"global"}},{"text":")"}]}

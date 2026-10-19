## act 202: 설명 중이면 준비를 마치고(dev/_cheat/intro_202), 끝(8200)~판정 전(8210) 명령을 재생한 뒤
## 두 팀 점수를 0으로 맞추고 판정 지점(8211)으로 옮긴다 → 다음 틱에 게임이 스스로 판정한다
execute if score .act global matches 202 if score .seq global matches ..2199 run function dev/_cheat/intro_202
execute if score .act global matches 202 if score .seq global matches ..8200 run scoreboard players set .seq global 8200
execute if score .act global matches 202 if score .seq global matches 8200 as @p at @s run function seq/act2/202
execute if score .act global matches 202 if score .seq global matches ..8210 run scoreboard players set .seq global 8210
execute if score .act global matches 202 if score .seq global matches 8210 as @p at @s run function seq/act2/202
execute if score .act global matches 202 run scoreboard players set "§4Team 1" score 0
execute if score .act global matches 202 run scoreboard players set "§9Team 2" score 0
execute if score .act global matches 202 run function utility/wins/tie
execute if score .act global matches 202 run scoreboard players set .seq global 8211

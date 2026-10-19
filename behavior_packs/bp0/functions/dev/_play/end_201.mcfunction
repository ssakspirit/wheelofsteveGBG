## act 201: 설명 중이면 준비를 마치고(dev/_cheat/intro_201), 끝(7200)~판정 전(7209) 명령을 재생한 뒤
## 두 팀 점수를 0으로 맞추고 판정 지점(7210)으로 옮긴다 → 다음 틱에 게임이 스스로 판정한다
execute if score .act global matches 201 if score .seq global matches ..1199 run function dev/_cheat/intro_201
execute if score .act global matches 201 if score .seq global matches ..7200 run scoreboard players set .seq global 7200
execute if score .act global matches 201 if score .seq global matches 7200 as @p at @s run function seq/act2/201
execute if score .act global matches 201 run scoreboard players set "§4Team 1" score 0
execute if score .act global matches 201 run scoreboard players set "§9Team 2" score 0
execute if score .act global matches 201 run scoreboard players set .seq global 7210

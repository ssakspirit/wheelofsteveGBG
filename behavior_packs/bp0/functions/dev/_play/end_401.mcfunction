## act 401: 설명 중이면 준비를 마치고(dev/_cheat/intro_401), 끝(4160)~판정 전(4169) 명령을 재생한 뒤
## 두 팀 점수를 0으로 맞추고 판정 지점(4170)으로 옮긴다 → 다음 틱에 게임이 스스로 판정한다
execute if score .act global matches 401 if score .seq global matches ..599 run function dev/_cheat/intro_401
execute if score .act global matches 401 if score .seq global matches ..4160 run scoreboard players set .seq global 4160
execute if score .act global matches 401 if score .seq global matches 4160 as @p at @s run function seq/act4/401
execute if score .act global matches 401 run scoreboard players set "§4Team 1" score 0
execute if score .act global matches 401 run scoreboard players set "§9Team 2" score 0
execute if score .act global matches 401 run scoreboard players set .seq global 4170

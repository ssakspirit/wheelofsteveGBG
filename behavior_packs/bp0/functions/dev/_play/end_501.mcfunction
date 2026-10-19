## act 501: 설명 중이면 준비를 마치고(dev/_cheat/intro_501), 끝(7280)~판정 전(7289) 명령을 재생한 뒤
## 두 팀 점수를 0으로 맞추고 판정 지점(7290)으로 옮긴다 → 다음 틱에 게임이 스스로 판정한다
execute if score .act global matches 501 if score .seq global matches ..1159 run function dev/_cheat/intro_501
execute if score .act global matches 501 if score .seq global matches ..7280 run scoreboard players set .seq global 7280
execute if score .act global matches 501 if score .seq global matches 7280 as @p at @s run function seq/act5/501
execute if score .act global matches 501 run scoreboard players set "§4Team 1" score 0
execute if score .act global matches 501 run scoreboard players set "§9Team 2" score 0
execute if score .act global matches 501 run scoreboard players set .seq global 7290

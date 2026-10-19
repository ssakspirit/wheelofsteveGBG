## act 101: 설명 중이면 준비를 마치고(dev/_cheat/intro_101), 끝(6700)~판정 전(6719) 명령을 재생한 뒤
## 두 팀 점수를 0으로 맞추고 판정 지점(6720)으로 옮긴다 → 다음 틱에 게임이 스스로 판정한다
execute if score .act global matches 101 if score .seq global matches ..699 run function dev/_cheat/intro_101
execute if score .act global matches 101 if score .seq global matches ..6700 run scoreboard players set .seq global 6700
execute if score .act global matches 101 if score .seq global matches 6700 as @p at @s run function seq/act1/101
execute if score .act global matches 101 if score .seq global matches ..6705 run scoreboard players set .seq global 6705
execute if score .act global matches 101 if score .seq global matches 6705 as @p at @s run function seq/act1/101
execute if score .act global matches 101 run scoreboard players set "§4Team 1" score 0
execute if score .act global matches 101 run scoreboard players set "§9Team 2" score 0
execute if score .act global matches 101 run scoreboard players set .seq global 6720

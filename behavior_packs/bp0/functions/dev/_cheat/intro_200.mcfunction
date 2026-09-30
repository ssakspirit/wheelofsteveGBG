## act 200: 20번에서 다음 act로 갈라질 때까지 재생
execute if score .act global matches 200 if score .seq global matches ..0 run scoreboard players set .seq global 0
execute if score .act global matches 200 if score .seq global matches 0 as @p at @s run function seq/act2/200
execute if score .act global matches 200 if score .seq global matches ..2 run scoreboard players set .seq global 2
execute if score .act global matches 200 if score .seq global matches 2 as @p at @s run function seq/act2/200
execute if score .act global matches 200 if score .seq global matches ..15 run scoreboard players set .seq global 15
execute if score .act global matches 200 if score .seq global matches 15 as @p at @s run function seq/act2/200
execute if score .act global matches 200 if score .seq global matches ..20 run scoreboard players set .seq global 20
execute if score .act global matches 200 if score .seq global matches 20 as @p at @s run function seq/act2/200

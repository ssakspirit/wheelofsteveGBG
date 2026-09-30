execute if score .act global matches 200 run function dev/_cheat/intro_200
execute if score .act global matches 101 run function dev/_cheat/lobby_101
execute if score .act global matches 201 run function dev/_cheat/lobby_201
execute if score .act global matches 202 run function dev/_cheat/lobby_202
execute if score .act global matches 301 run function dev/_cheat/lobby_301
execute if score .act global matches 401 run function dev/_cheat/lobby_401
execute if score .act global matches 501 run function dev/_cheat/lobby_501
execute if score .act global matches 601 run function dev/_cheat/lobby_601
stopsound @a
tellraw @s {"rawtext":[{"text":"§a[dev] §f게임을 정리하고 로비로 돌아왔습니다 (승패 기록 없음)."}]}

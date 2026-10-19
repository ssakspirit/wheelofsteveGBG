execute if score .act global matches 200 run function dev/_cheat/intro_200
execute if score .act global matches 101 run function dev/_play/end_101
execute if score .act global matches 201 run function dev/_play/end_201
execute if score .act global matches 202 run function dev/_play/end_202
execute if score .act global matches 301 run function dev/_play/end_301
execute if score .act global matches 401 run function dev/_play/end_401
execute if score .act global matches 501 run function dev/_play/end_501
stopsound @a
tellraw @a {"rawtext":[{"text":"§e[진행] §f경기를 무승부로 끝냈습니다. (승리 기록 없음)"}]}

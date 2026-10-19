execute if score .act global matches 1 run function dev/_play/skip_1
execute if score .act global matches 1 run tellraw @a {"rawtext":[{"text":"§e[진행] §f로비 소개를 건너뛰었습니다."}]}
execute if score .act global matches 200 run function dev/_cheat/intro_200
execute if score .act global matches 101 run function dev/_play/skip_101
execute if score .act global matches 201 run function dev/_play/skip_201
execute if score .act global matches 202 run function dev/_play/skip_202
execute if score .act global matches 301 run function dev/_play/skip_301
execute if score .act global matches 401 run function dev/_play/skip_401
execute if score .act global matches 501 run function dev/_play/skip_501
execute if score .act global matches 601 run function dev/_play/skip_601
execute unless score .act global matches 1 run stopsound @a
execute unless score .act global matches 1 run tellraw @a {"rawtext":[{"text":"§e[진행] §f설명을 건너뛰었습니다. 3초 뒤 경기가 시작됩니다."}]}

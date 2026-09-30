execute if score .act global matches 200 run function dev/_cheat/intro_200
execute if score .act global matches 101 run function dev/_cheat/intro_101
execute if score .act global matches 201 run function dev/_cheat/intro_201
execute if score .act global matches 202 run function dev/_cheat/intro_202
execute if score .act global matches 301 run function dev/_cheat/intro_301
execute if score .act global matches 401 run function dev/_cheat/intro_401
execute if score .act global matches 501 run function dev/_cheat/intro_501
execute if score .act global matches 601 run function dev/_cheat/intro_601
stopsound @a
tellraw @s {"rawtext":[{"text":"§a[dev] §f설명을 건너뛰었습니다. 곧 경기가 시작됩니다."}]}
tellraw @s {"rawtext":[{"text":"§7  (.act "},{"score":{"name":".act","objective":"global"}},{"text":" · .seq "},{"score":{"name":".seq","objective":"global"}},{"text":")"}]}

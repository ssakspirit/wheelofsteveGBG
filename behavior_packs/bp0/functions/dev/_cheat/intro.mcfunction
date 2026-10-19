scoreboard players set .dev_wait global 0
execute if score .act global matches 301 if score .seq global matches 20..39 run scoreboard players set .dev_wait global 1
execute if score .act global matches 301 if score .seq global matches 100..299 run scoreboard players set .dev_wait global 1
execute if score .act global matches 301 if score .seq global matches 880..899 run scoreboard players set .dev_wait global 1
execute if score .dev_wait global matches 1 run tellraw @s {"rawtext":[{"text":"§e[dev] §f시범 블록을 쌓는 중이라 지금은 건너뛸 수 없습니다. 몇 초 뒤 다시 해 보세요."}]}
execute if score .dev_wait global matches 0 if score .act global matches 200 run function dev/_cheat/intro_200
execute if score .dev_wait global matches 0 if score .act global matches 101 run function dev/_cheat/intro_101
execute if score .dev_wait global matches 0 if score .act global matches 201 run function dev/_cheat/intro_201
execute if score .dev_wait global matches 0 if score .act global matches 202 run function dev/_cheat/intro_202
execute if score .dev_wait global matches 0 if score .act global matches 301 run function dev/_cheat/intro_301
execute if score .dev_wait global matches 0 if score .act global matches 401 run function dev/_cheat/intro_401
execute if score .dev_wait global matches 0 if score .act global matches 501 run function dev/_cheat/intro_501
execute if score .dev_wait global matches 0 if score .act global matches 601 run function dev/_cheat/intro_601
execute if score .dev_wait global matches 0 run stopsound @a
execute if score .dev_wait global matches 0 run tellraw @s {"rawtext":[{"text":"§a[dev] §f설명을 건너뛰었습니다. 곧 경기가 시작됩니다."}]}
tellraw @s {"rawtext":[{"text":"§7  (.act "},{"score":{"name":".act","objective":"global"}},{"text":" · .seq "},{"score":{"name":".seq","objective":"global"}},{"text":")"}]}

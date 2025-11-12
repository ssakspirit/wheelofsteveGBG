## Seq for Game 2 (Contraption Craftoff) (Act200)
execute if score .seq global matches 00 run scoreboard players set .actionbar.objective global 0
execute if score .seq global matches 00 run scoreboard players set .subtitle.objective global 0
execute if score .seq global matches 02 run inputpermission set @a[tag=!admin] movement disabled
execute if score .seq global matches 02 run /function utility/fogs/g2_fog
execute if score .seq global matches 15 run /function utility/games/craft/game_reset



# Finished, Setup for next act
execute if score .seq global matches 20 run execute if score .gamemode craft_scores matches 1 run scoreboard players set .act global 201
execute if score .seq global matches 20 run execute if score .gamemode craft_scores matches 0 run scoreboard players set .act global 202
## Used for Picking up the Bomb in Elytra Rumble

execute at @e[type=rwm:elytra_bomb,c=1,tag=!bomb_active] run ride @e[type=rwm:elytra_bomb,c=1,tag=!bomb_active] start_riding @a[c=1,r=5]
execute at @s run execute if entity @a[scores={team=1},c=1,r=5] run tag @s add team1_bomb
execute at @s run execute if entity @a[scores={team=2},c=1,r=5] run tag @s add team2_bomb
execute at @s run tag @a[c=1,r=2] add bomb_carrier
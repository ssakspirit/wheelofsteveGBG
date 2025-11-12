## Used for Reseting Game 5: Elytra Rumble

scoreboard players set .game global 5
tag @a remove bomb_carrier
kill @e[type=rwm:elytra_ring]
kill @e[type=rwm:elytra_bomb]
kill @e[type=rwm:timer]
event entity @a rwm:elytra_seat_add
scoreboard objectives add score dummy §6§lScore
scoreboard players set "§4Team 1" score 0
scoreboard players set "§9Team 2" score 0
function utility/games/elytra/player_loadout

#Insert Better Start Points once players get their tags.
spawnpoint @a[scores={team=1}] -130 164 5087
spawnpoint @a[scores={team=2}] -31 164 5087
tp @a[scores={team=1}] -130 164 5087 -90 0
tp @a[scores={team=2}] -31 164 5087 90 0
tp @a[tag=admin] -80 180 5087 0 0
tp @r[scores={team=1},x=-130,y=164,z=5087,r=1] -133 164 5088 -90 0
tp @r[scores={team=1},x=-130,y=164,z=5087,r=1] -133 164 5087 -90 0
tp @r[scores={team=1},x=-130,y=164,z=5087,r=1] -133 164 5089 -90 0
tp @r[scores={team=1},x=-130,y=164,z=5087,r=1] -133 164 5086 -90 0
tp @r[scores={team=2},x=-31,y=164,z=5087,r=1] -28 164 5087 90 0
tp @r[scores={team=2},x=-31,y=164,z=5087,r=1] -28 164 5088 90 0
tp @r[scores={team=2},x=-31,y=164,z=5087,r=1] -28 164 5086 90 0
tp @r[scores={team=2},x=-31,y=164,z=5087,r=1] -28 164 5089 90 0

tag @a add elytra_player
structure load elytra_tower_blue_0 -59 95 5109
structure load elytra_tower_red_0 -107 95 5061
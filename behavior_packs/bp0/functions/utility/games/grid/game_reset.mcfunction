## Used for Reseting Game 3: Grid Wars

scoreboard players set .game global 3
kill @e[type=rwm:timer]
scoreboard objectives add score dummy §6§lScore
scoreboard players set "§4Team 1" score 0
scoreboard players set "§9Team 2" score 0
fill -46 61 -79 -43 64 -79 air
fill -24 61 -79 -21 64 -79 air
fill -35 64 -78 -32 67 -78 air
##Spawnpoints
tp @a[scores={team=1}] -45.5 60.00 -85.5
tp @a[scores={team=2}] -23.5 60.00 -85.5
tp @a[tag=admin] -34.5 70 -85.5
tp @r[scores={team=1},x=-45,y=60,z=-85,r=1] -46 60 -89 0 0
tp @r[scores={team=1},x=-45,y=60,z=-85,r=1] -43 60 -89 0 0
tp @r[scores={team=1},x=-45,y=60,z=-85,r=1] -49 60 -89 0 0
tp @r[scores={team=1},x=-45,y=60,z=-85,r=1] -40 60 -89 0 0
tp @r[scores={team=2},x=-23,y=60,z=-85,r=1] -24 60 -89 0 0
tp @r[scores={team=2},x=-23,y=60,z=-85,r=1] -21 60 -89 0 0
tp @r[scores={team=2},x=-23,y=60,z=-85,r=1] -27 60 -89 0 0
tp @r[scores={team=2},x=-23,y=60,z=-85,r=1] -18 60 -89 0 0

tag @a add grid_player

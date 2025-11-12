## Runs at Start of Game
execute unless entity @a[tag=!.host] run execute if entity @p[x=-5,y=25,z=-5,dx=10,dy=10,dz=10] run function utility/score_reset

tag @p[x=-5,y=25,z=-5,dx=10,dy=10,dz=10,tag=!.host] add .host

scoreboard players set .actionbar.objective global 10000
scoreboard players set .subtitle.objective global 0
scoreboard players set .team1players global 0
scoreboard players set .team2players global 0
scoreboard players set @p[x=-5,y=25,z=-5,dx=10,dy=10,dz=10] team 0

tp @p[x=-5,y=25,z=-5,dx=10,dy=10,dz=10,tag=.host] 0 20 -2 0 0

structure load board_singleplayer -34 65 1017 

inputpermission set @a[tag=!admin] movement disabled
inputpermission set @a camera disabled
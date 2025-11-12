## Run this command to play the map
execute if entity @a[tag=.host] run execute if entity @p[x=-5,y=25,z=-5,dx=10,dy=10,dz=10,tag=!.host] run function utility/score_reset_nothost

execute if entity @a[x=-5,y=25,z=-5,dx=10,dy=10,dz=10,scores={team=1}] run scoreboard players add .team1players global -1
execute if entity @a[x=-5,y=25,z=-5,dx=10,dy=10,dz=10,scores={team=2}] run scoreboard players add .team2players global -1
scoreboard players set @p[x=-5,y=25,z=-5,dx=10,dy=10,dz=10] team 0

tag @p[x=-5,y=25,z=-5,dx=10,dy=10,dz=10,tag=!.host] add .nothost

execute if entity @a[x=-5,y=20,z=-5,dx=10,dy=4,dz=10,tag=.host] run tp @p[x=-5,y=25,z=-5,dx=10,dy=10,dz=10,tag=.nothost] 0 20 -2 0 0
execute unless entity @a[x=-5,y=20,z=-5,dx=10,dy=4,dz=10,tag=.host] run tp @p[x=-5,y=25,z=-5,dx=10,dy=10,dz=10,tag=.nothost,tag=!.host] -43 65 1018 -90 0
structure load board_multiplayer -34 65 1017 
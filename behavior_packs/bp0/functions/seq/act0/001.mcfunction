## Seq for Lobby
execute if score .seq global matches 00 run scoreboard players set .actionbar.objective global 0
execute if score .seq global matches 00 run scoreboard players set .subtitle.objective global 0
execute if score .seq global matches 02 run inputpermission set @a[tag=!admin] movement disabled
execute if score .seq global matches 800 run setblock -44 66 1018 stone_button ["button_pressed_bit"=false,"facing_direction"=5]

## Cutscene
execute if score .seq global matches 01 run hud @a hide
execute if score .seq global matches 01 run camera @a clear
execute if score .seq global matches 02 run camera @a fade time 0.1 2 1
execute if score .seq global matches 05 run scoreboard objectives add score dummy §6§lScore
execute if score .seq global matches 05 run scoreboard players set "§4Team 1" score 0
execute if score .seq global matches 05 run scoreboard players set "§9Team 2" score 0
execute if score .seq global matches 05 run scoreboard objectives setdisplay sidebar team_scores

### Intro/Team Cutscene

execute if score .seq global matches 00 run scoreboard players set .actionbar.objective global 0
execute if score .seq global matches 20 run /camera @a set minecraft:free pos 0 109 1092 rot -26 0
execute if score .seq global matches 21 run /camera @a set minecraft:free ease 15 in_out_quad pos 0 66.8 1014 rot 0 0
execute if score .seq global matches 321 run /camera @a set minecraft:free ease 15 in_out_quad pos -23 69.7 1035 rot 18 150
execute if score .seq global matches 621 run /camera @a set minecraft:free ease 10 in_out_quad pos -38 67.7 1025 rot 5 -105
execute if score .seq global matches 821 run /camera @a set minecraft:free ease 15 in_out_quad pos -38 67.7 1011 rot 5 -62
execute if score .seq global matches 1121 run /camera @a set minecraft:free ease 10 in_out_quad pos -40 66.8 1015 rot 8 53
execute if score .seq global matches 1321 run /inputpermission set @s movement enabled
##Cutscene Ends at 1321

###Across both Cutscenes
execute if score .seq global matches 80 run scoreboard players set .actionbar.objective global 001
execute if score .seq global matches 161 run scoreboard players set .actionbar.objective global 002
execute if score .seq global matches 261 run scoreboard players set .actionbar.objective global 003
execute if score .seq global matches 381 run scoreboard players set .actionbar.objective global 004
execute if score .seq global matches 521 run scoreboard players set .actionbar.objective global 005
execute if score .seq global matches 681 run scoreboard players set .actionbar.objective global 006
execute if score .seq global matches 901 run scoreboard players set .actionbar.objective global 007
execute if score .seq global matches 1021 run scoreboard players set .actionbar.objective global 008
execute if score .seq global matches 1321 run scoreboard players set .actionbar.objective global 009

### Done with Cutscenes
execute if score .seq global matches 1300 run camera @a fade time 0.5 1 0.5
execute if score .seq global matches 1325 run camera @a set minecraft:first_person
execute if score .seq global matches 1325 run camera @a clear
execute if score .seq global matches 1325 run hud @a reset
execute if score .seq global matches 1400 run scoreboard players set .run global 0



### Check for .host Player pressing Button
execute if score .seq global matches 1400..1401 run execute if block -44 66 1018 stone_button ["button_pressed_bit"=true,"facing_direction"=5] run execute if entity @e[tag=.host,x=-44,y=66,z=1018,r=6] run scoreboard players set .run global 1

execute if score .seq global matches 1405 run scoreboard players set .actionbar.objective global 018

execute if score .seq global matches 1424 run setblock -44 66 1018 polished_blackstone_button ["button_pressed_bit"=false,"facing_direction"=5]

execute if score .seq global matches 1425 run scoreboard players set .run global 0

execute if score .seq global matches 1425..1426 run execute if block -44 66 1018 polished_blackstone_button ["button_pressed_bit"=true,"facing_direction"=5] run execute if entity @e[tag=.host,x=-44,y=66,z=1018,r=6] run scoreboard players set .run global 1




### Add in quick auto teamer if someone is not on a team.
execute if score .seq global matches 1440 run tp @r[scores={team=0}] -29 65 1014
execute if score .seq global matches 1441 run tp @r[scores={team=0}] -29 65 1022
execute if score .seq global matches 1442 run tp @r[scores={team=0}] -29 65 1014
execute if score .seq global matches 1443 run tp @r[scores={team=0}] -29 65 1022
execute if score .seq global matches 1444 run tp @r[scores={team=0}] -29 65 1014
execute if score .seq global matches 1445 run tp @r[scores={team=0}] -29 65 1022
execute if score .seq global matches 1446 run tp @r[scores={team=0}] -29 65 1014
execute if score .seq global matches 1447 run tp @r[scores={team=0}] -29 65 1022

execute if score .seq global matches 1460 run hud @a hide
execute if score .seq global matches 1460 run camera @a clear
execute if score .seq global matches 1460 run camera @a fade time 1 2 1
execute if score .seq global matches 1482 run tp @a 1.0 60.00 1000 0 0

### Teams are ready. Players confirmed. Start next Cutscene
execute if score .seq global matches 1500 run scoreboard players set .actionbar.objective global 0
execute if score .seq global matches 1500 run /camera @a set minecraft:free pos 1.0 62.3 1004 rot 5 0
execute if score .seq global matches 1501 run /camera @a set minecraft:free ease 25 in_out_quad pos 1.0 62.8 1015 rot 12 0
execute if score .seq global matches 2001 run /camera @a set minecraft:free ease 5 in_out_quad pos 18.0 68.0 1029 rot 19 15
execute if score .seq global matches 2101 run /camera @a set minecraft:free ease 15 in_out_quad pos -18.0 68.0 1029 rot 19 -15
execute if score .seq global matches 2401 run /inputpermission set @s movement enabled
##Ends at 2401

## During Cutscene
execute if score .seq global matches 1500 run scoreboard players set .actionbar.objective global 010
execute if score .seq global matches 1600 run scoreboard players set .actionbar.objective global 011
execute if score .seq global matches 1750 run scoreboard players set .actionbar.objective global 012
execute if score .seq global matches 1850 run scoreboard players set .actionbar.objective global 013
execute if score .seq global matches 2000 run scoreboard players set .actionbar.objective global 014
execute if score .seq global matches 2100 run scoreboard players set .actionbar.objective global 015
execute if score .seq global matches 2200 run scoreboard players set .actionbar.objective global 016
execute if score .seq global matches 2300 run scoreboard players set .actionbar.objective global 017
execute if score .seq global matches 2400 run scoreboard players set .actionbar.objective global 0

execute if score .seq global matches 2380 run camera @a fade time 0.5 1 0.5
execute if score .seq global matches 2400 run camera @a set minecraft:first_person
execute if score .seq global matches 2401 run camera @a clear
execute if score .seq global matches 2401 run hud @a reset

### Return to Lobby
execute if score .seq global matches 2401 run tp @a 1.0 60 1000

# Finished, Setup for next act
execute if score .seq global matches 2420 run /function utility/tickingarea_add
execute if score .seq global matches 2420 run scoreboard players set .act global 0
execute if score .seq global matches 2420 run function loops/new_act
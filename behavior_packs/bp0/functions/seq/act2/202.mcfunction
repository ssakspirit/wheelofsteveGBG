## Seq for Game 2 (Contraption Craftoff) (Act202) - Multiplayer Mode
execute if score .seq global matches 00 run scoreboard players set .actionbar.objective global 0
execute if score .seq global matches 00 run scoreboard players set .subtitle.objective global 0
execute if score .seq global matches 02 run inputpermission set @a[tag=!admin] movement disabled
execute if score .seq global matches 01 run /function utility/tickingarea_remove

## Cutscene
execute if score .seq global matches 01 run hud @a hide
execute if score .seq global matches 01 run camera @a clear
execute if score .seq global matches 02 run camera @a fade time 0.1 2 1
execute if score .seq global matches 10 run function utility/games/craft/crafting_grid



## Team 1 Cutscene (Solo)
execute if score .seq global matches 20 run /camera @a[scores={team=1}] set minecraft:free pos -13.3 66 3045 rot 18 -120
execute if score .seq global matches 21 run /camera @a[scores={team=1}] set minecraft:free ease 10 in_out_quad pos -12.9 64.9 3036 rot 14 -90
execute if score .seq global matches 221 run /camera @a[scores={team=1}] set minecraft:free ease 6 in_out_quad pos -12.5 63.3 3030 rot 27 180
execute if score .seq global matches 341 run /camera @a[scores={team=1}] set minecraft:free ease 6 in_out_quad pos -16 63.6 3030 rot 27 149
execute if score .seq global matches 461 run /camera @a[scores={team=1}] set minecraft:free ease 10 in_out_quad pos -15.5 62.45 3018 rot -11 -66
execute if score .seq global matches 661 run /camera @a[scores={team=1}] set minecraft:free ease 10 in_out_quad pos -12.5 63.7 3010 rot 18 0
execute if score .seq global matches 861 run /camera @a[scores={team=1}] set minecraft:free ease 10 in_out_quad pos -12.5 62.9 3005 rot 7 170
execute if score .seq global matches 1061 run /camera @a[scores={team=1}] set minecraft:free ease 10 in_out_quad pos -10.5 62.9 3008 rot 5 -10
execute if score .seq global matches 1261 run /camera @a[scores={team=1}] set minecraft:free ease 10 in_out_quad pos -9.5 62.5 3017 rot -5 50
execute if score .seq global matches 1461 run /camera @a[scores={team=1}] set minecraft:free ease 5 in_out_quad pos -9.5 63.3 3021 rot 42 0
execute if score .seq global matches 1561 run /camera @a[scores={team=1}] set minecraft:free ease 10 in_out_quad pos -12.5 63.9 3030 rot 12 -61
execute if score .seq global matches 1761 run /camera @a[scores={team=1}] set minecraft:free ease 10 in_out_quad pos -22.5 79.3 3048 rot 35 -135

## Admin Observer Cutscene (follows Team 1)
execute if score .seq global matches 20 run /camera @a[tag=admin] set minecraft:free pos -13.3 66 3045 rot 18 -120
execute if score .seq global matches 21 run /camera @a[tag=admin] set minecraft:free ease 10 in_out_quad pos -12.9 64.9 3036 rot 14 -90
execute if score .seq global matches 221 run /camera @a[tag=admin] set minecraft:free ease 6 in_out_quad pos -12.5 63.3 3030 rot 27 180
execute if score .seq global matches 341 run /camera @a[tag=admin] set minecraft:free ease 6 in_out_quad pos -16 63.6 3030 rot 27 149
execute if score .seq global matches 461 run /camera @a[tag=admin] set minecraft:free ease 10 in_out_quad pos -15.5 62.45 3018 rot -11 -66
execute if score .seq global matches 661 run /camera @a[tag=admin] set minecraft:free ease 10 in_out_quad pos -12.5 63.7 3010 rot 18 0
execute if score .seq global matches 861 run /camera @a[tag=admin] set minecraft:free ease 10 in_out_quad pos -12.5 62.9 3005 rot 7 170
execute if score .seq global matches 1061 run /camera @a[tag=admin] set minecraft:free ease 10 in_out_quad pos -10.5 62.9 3008 rot 5 -10
execute if score .seq global matches 1261 run /camera @a[tag=admin] set minecraft:free ease 10 in_out_quad pos -9.5 62.5 3017 rot -5 50
execute if score .seq global matches 1461 run /camera @a[tag=admin] set minecraft:free ease 5 in_out_quad pos -9.5 63.3 3021 rot 42 0
execute if score .seq global matches 1561 run /camera @a[tag=admin] set minecraft:free ease 10 in_out_quad pos -12.5 63.9 3030 rot 12 -61
execute if score .seq global matches 1761 run /camera @a[tag=admin] set minecraft:free ease 10 in_out_quad pos -22.5 79.3 3048 rot 35 -135

## Team 2 Cutscene (Solo)
execute if score .seq global matches 20 run /camera @a[scores={team=2}] set minecraft:free pos 14.3 66 3045 rot 18 120
execute if score .seq global matches 21 run /camera @a[scores={team=2}] set minecraft:free ease 10 in_out_quad pos 13.9 64.9 3036 rot 14 90
execute if score .seq global matches 221 run /camera @a[scores={team=2}] set minecraft:free ease 6 in_out_quad pos 13.5 63.3 3030 rot 27 -180
execute if score .seq global matches 341 run /camera @a[scores={team=2}] set minecraft:free ease 6 in_out_quad pos 17 63.6 3030 rot 27 -149
execute if score .seq global matches 461 run /camera @a[scores={team=2}] set minecraft:free ease 10 in_out_quad pos 16.5 62.45 3018 rot -11 66
execute if score .seq global matches 661 run /camera @a[scores={team=2}] set minecraft:free ease 10 in_out_quad pos 13.5 63.7 3010 rot 18 0
execute if score .seq global matches 861 run /camera @a[scores={team=2}] set minecraft:free ease 10 in_out_quad pos 13.5 62.9 3005 rot 7 -170
execute if score .seq global matches 1061 run /camera @a[scores={team=2}] set minecraft:free ease 10 in_out_quad pos 11.5 62.9 3008 rot 5 10
execute if score .seq global matches 1261 run /camera @a[scores={team=2}] set minecraft:free ease 10 in_out_quad pos 10.5 62.5 3017 rot -5 -50
execute if score .seq global matches 1461 run /camera @a[scores={team=2}] set minecraft:free ease 5 in_out_quad pos 10.5 63.3 3021 rot 42 0
execute if score .seq global matches 1561 run /camera @a[scores={team=2}] set minecraft:free ease 10 in_out_quad pos 13.5 63.9 3030 rot 12 61
execute if score .seq global matches 1761 run /camera @a[scores={team=2}] set minecraft:free ease 10 in_out_quad pos 23.5 79.3 3048 rot 35 135
## (Ends at 1921)
##Across both Team Cutscenes
##Actionbar
execute if score .seq global matches 20 run scoreboard players set .actionbar.objective global 211
execute if score .seq global matches 120 run scoreboard players set .actionbar.objective global 212
execute if score .seq global matches 220 run scoreboard players set .actionbar.objective global 213
execute if score .seq global matches 320 run scoreboard players set .actionbar.objective global 214
execute if score .seq global matches 420 run scoreboard players set .actionbar.objective global 215
execute if score .seq global matches 520 run scoreboard players set .actionbar.objective global 216
execute if score .seq global matches 620 run scoreboard players set .actionbar.objective global 217
execute if score .seq global matches 720 run scoreboard players set .actionbar.objective global 218
execute if score .seq global matches 860 run scoreboard players set .actionbar.objective global 219
execute if score .seq global matches 1000 run scoreboard players set .actionbar.objective global 220
execute if score .seq global matches 1140 run scoreboard players set .actionbar.objective global 221
execute if score .seq global matches 1280 run scoreboard players set .actionbar.objective global 222
execute if score .seq global matches 1400 run scoreboard players set .actionbar.objective global 223
execute if score .seq global matches 1500 run scoreboard players set .actionbar.objective global 224
execute if score .seq global matches 1700 run scoreboard players set .actionbar.objective global 225
execute if score .seq global matches 1820 run scoreboard players set .actionbar.objective global 226


#Events in the cutscene
execute if score .seq global matches 100 run /function utility/games/craft/random_contraption_break
execute if score .seq global matches 120 run /function utility/games/craft/random_contraption_break
execute if score .seq global matches 140 run /function utility/games/craft/random_contraption_break
execute if score .seq global matches 160 run /function utility/games/craft/random_contraption_break
execute if score .seq global matches 180 run /function utility/games/craft/random_contraption_break
execute if score .seq global matches 200 run summon rwm:craft_diagram -19 60 3026 180 0 rwm:diagram_1
execute if score .seq global matches 200 run summon rwm:craft_diagram 19 60 3026 180 0 rwm:diagram_1
execute if score .seq global matches 470 run event entity @e[type=rwm:craft_diagram] rwm:despawn
execute if score .seq global matches 560 run event entity @e[type=rwm:craft_board] rwm:board_1
execute if score .seq global matches 700 run event entity @r[type=rwm:craft_crafting_part] rwm:craft_crafting_1
execute if score .seq global matches 720 run event entity @r[type=rwm:craft_crafting_part] rwm:craft_crafting_2
execute if score .seq global matches 740 run event entity @r[type=rwm:craft_crafting_part] rwm:craft_crafting_3
execute if score .seq global matches 760 run event entity @r[type=rwm:craft_crafting_part] rwm:craft_crafting_4
execute if score .seq global matches 780 run event entity @r[type=rwm:craft_crafting_part] rwm:craft_crafting_5
execute if score .seq global matches 800 run event entity @r[type=rwm:craft_crafting_part] rwm:craft_crafting_6
execute if score .seq global matches 820 run event entity @r[type=rwm:craft_crafting_part] rwm:craft_crafting_7
execute if score .seq global matches 840 run event entity @r[type=rwm:craft_crafting_part] rwm:craft_crafting_8
execute if score .seq global matches 860 run event entity @r[type=rwm:craft_crafting_part] rwm:craft_crafting_9
execute if score .seq global matches 880 run event entity @r[type=rwm:craft_crafting_part] rwm:craft_crafting_10
execute if score .seq global matches 800 run event entity @r[type=rwm:craft_crafting_part] rwm:craft_crafting_11
execute if score .seq global matches 820 run event entity @r[type=rwm:craft_crafting_part] rwm:craft_crafting_12
execute if score .seq global matches 1120 run clone -3 60 3023 -3 60 3023 -2 61 3018
execute if score .seq global matches 1121 run fill -2 61 3018 -2 61 3018 air destroy
execute if score .seq global matches 1122 run kill @e[type=item,name=chest]
execute if score .seq global matches 1123 run tp @e[type=item,x=-2,y=61,z=3018,r=2] -10 62 3023
execute if score .seq global matches 1120 run clone -3 60 3023 -3 60 3023 2 61 3018
execute if score .seq global matches 1121 run fill 2 61 3018 2 61 3018 air destroy
execute if score .seq global matches 1122 run kill @e[type=item,name=chest]
execute if score .seq global matches 1123 run tp @e[type=item,x=2,y=61,z=3018,r=2] 10 62 3023
execute if score .seq global matches 1700 run event entity @e[type=rwm:craft_contraption,tag=contraption_1] rwm:contraption_1_fixed
execute if score .seq global matches 1720 run event entity @e[type=rwm:craft_contraption,tag=contraption_2] rwm:contraption_2_fixed
execute if score .seq global matches 1740 run event entity @e[type=rwm:craft_contraption,tag=contraption_3] rwm:contraption_3_fixed
execute if score .seq global matches 1760 run event entity @e[type=rwm:craft_contraption,tag=contraption_4] rwm:contraption_4_fixed
execute if score .seq global matches 1780 run event entity @e[type=rwm:craft_contraption,tag=contraption_5] rwm:contraption_5_fixed


### Done with Cutscenes
execute if score .seq global matches 1900 run camera @a fade time 2 4 1
execute if score .seq global matches 2030 run function utility/games/craft/respawn_assets
execute if score .seq global matches 2040 run /function utility/games/craft/tagging/crafting_grid
### Continue
execute if score .seq global matches 2030 run camera @a set minecraft:first_person
execute if score .seq global matches 2060 run camera @a clear
execute if score .seq global matches 2060 run hud @a reset
execute if score .seq global matches 2060 run scoreboard players set .actionbar.objective global 0
execute if score .seq global matches 2062 run camera @a clear


### Start Countdown
execute if score .seq global matches 2140 run scoreboard players set "§4Team 1" score 0
execute if score .seq global matches 2140 run scoreboard players set "§9Team 2" score 0
execute if score .seq global matches 2140 run titleraw @a title {"rawtext":[{"translate":"subtitle.objective.101.1"}]}
execute if score .seq global matches 2140 run /execute at @a run /playsound note.harp @a ~ ~ ~ 1 1.0
execute if score .seq global matches 2160 run titleraw @a title {"rawtext":[{"translate":"subtitle.objective.101.2"}]}
execute if score .seq global matches 2160 run /execute at @a run /playsound note.harp @a ~ ~ ~ 1 1.1
execute if score .seq global matches 2180 run titleraw @a title {"rawtext":[{"translate":"subtitle.objective.101.3"}]}
execute if score .seq global matches 2180 run /execute at @a run /playsound note.harp @a ~ ~ ~ 1 1.2
execute if score .seq global matches 2200 run titleraw @a title {"rawtext":[{"translate":"subtitle.objective.101.4"}]}
execute if score .seq global matches 2200 run scoreboard players set .actionbar.objective global 406
execute if score .seq global matches 2200 run /execute at @a run /playsound horn.call.0 @a ~ ~ ~ 1 2.0

#Displayed Scoreboard
execute if score .seq global matches 02 run scoreboard objectives setdisplay sidebar
execute if score .seq global matches 2220 run scoreboard objectives add score dummy §6§lScore
execute if score .seq global matches 2220 run scoreboard players set "§4Team 1" score 0
execute if score .seq global matches 2220 run scoreboard players set "§9Team 2" score 0
execute if score .seq global matches 2220 run scoreboard objectives setdisplay sidebar score

### At game start
execute if score .seq global matches 2200 run summon rwm:timer 0 90 3017 0 0 rwm:timer_craft
execute if score .seq global matches 2200 run inputpermission set @a movement enabled
execute if score .seq global matches 2120 run event entity @e[type=rwm:craft_diagram] rwm:despawn
execute if score .seq global matches 2140 run /function utility/games/craft/random_contraption_break
execute if score .seq global matches 2160 run /function utility/games/craft/random_contraption_break
execute if score .seq global matches 2180 run /function utility/games/craft/random_contraption_break
execute if score .seq global matches 2200 run execute as @e[tag=contraption_team1,c=1,x=-6,y=61,z=3035] run function utility/games/craft/random_next_diagram_multiplayer
execute if score .seq global matches 2200 run execute as @e[tag=contraption_team2,c=1,x=6,y=61,z=3035] run function utility/games/craft/random_next_diagram_multiplayer
execute if score .seq global matches 2200 run /execute as @a run playsound record.stal @a ~ ~ ~ 1 1.1
execute if score .seq global matches 4900 run /execute as @a run playsound record.stal @a ~ ~ ~ 1 1.1
execute if score .seq global matches 7600 run /execute as @a run playsound record.stal @a ~ ~ ~ 1 1.1

### Active till Game Over
execute if score .seq global matches 2200..8200 run function utility/games/craft/crafting_grid
execute if score .seq global matches 2200..8200 run execute if score "§9Team 2" score matches 3 run scoreboard players set .seq global 8210
execute if score .seq global matches 2200..8200 run execute if score "§4Team 1" score matches 3 run scoreboard players set .seq global 8210

##Particles 
execute if score .seq global matches 2200..8200 run execute if score .tick global matches 1 run execute if entity @e[type=item,x=-10,y=61,z=3023,r=1] run particle rwm:craft_crafting -10 61 3023 
execute if score .seq global matches 2200..8200 run execute if score .tick global matches 1 run execute if entity @e[type=item,x=10,y=61,z=3023,r=1] run particle rwm:craft_crafting 10 61 3023 
execute if score .seq global matches 2200..8200 run execute if score .tick global matches 1 run execute as @e[type=rwm:craft_contraption,tag=!fixed]  run execute at @e[type=rwm:craft_contraption,tag=!fixed] run particle rwm:craft_contraption_broken ~ ~ ~

### Game Over
execute if score .seq global matches 8210 run scoreboard players set .actionbar.objective global 0
execute if score .seq global matches 8200 run /kill @e[type=rwm:timer]

### Who Wins?
execute if score .seq global matches 8211 run execute if score "§4Team 1" score > "§9Team 2" score run /function utility/wins/team1
execute if score .seq global matches 8211 run execute if score "§9Team 2" score > "§4Team 1" score run /function utility/wins/team2

execute if score .seq global matches 8211 run scoreboard players set .subtitle.objective global 0

## Cutscene
execute if score .seq global matches 8280 run hud @a hide
execute if score .seq global matches 8280 run camera @a clear
execute if score .seq global matches 8280 run camera @a fade time 1 1 1

execute if score .seq global matches 8300 run tp @a[scores={team=1}] -13 60 3026
execute if score .seq global matches 8300 run tp @a[scores={team=2}] 13 60 3026

##Team 1 Win Teleports
execute if score .seq global matches 8310 run execute if score "§4Team 1" score > "§9Team 2" score run tp @r[x=-13,y=60,z=3026,r=1] -2 66 3031 90 0
execute if score .seq global matches 8310 run execute if score "§4Team 1" score > "§9Team 2" score run tp @r[x=-13,y=60,z=3026,r=1] -3 67 3037 90 0
execute if score .seq global matches 8310 run execute if score "§4Team 1" score > "§9Team 2" score run tp @r[x=-13,y=60,z=3026,r=1] -2 66 3039 90 0
execute if score .seq global matches 8310 run execute if score "§4Team 1" score > "§9Team 2" score run tp @r[x=-13,y=60,z=3026,r=1] -2 66 3043 90 0
execute if score .seq global matches 8310 run execute if score "§4Team 1" score > "§9Team 2" score run tp @r[x=13,y=60,z=3026,r=1] -3.71 61.00 3044.68 88.21 14.55
execute if score .seq global matches 8310 run execute if score "§4Team 1" score > "§9Team 2" score run tp @r[x=13,y=60,z=3026,r=1] -3.49 61.00 3046.03 79.55 6.41
execute if score .seq global matches 8310 run execute if score "§4Team 1" score > "§9Team 2" score run tp @r[x=13,y=60,z=3026,r=1] -2.58 61.00 3045.79 98.25 20.78
execute if score .seq global matches 8310 run execute if score "§4Team 1" score > "§9Team 2" score run tp @r[x=13,y=60,z=3026,r=1] -2.59 61.00 3044.97 86.99 -4.50

##Team 2 Win Teleports
execute if score .seq global matches 8310 run execute if score "§9Team 2" score > "§4Team 1" score run tp @r[x=13,y=60,z=3026,r=1] 2 66 3042 -90 0
execute if score .seq global matches 8310 run execute if score "§9Team 2" score > "§4Team 1" score run tp @r[x=13,y=60,z=3026,r=1] 3 67 3036 -90 0
execute if score .seq global matches 8310 run execute if score "§9Team 2" score > "§4Team 1" score run tp @r[x=13,y=60,z=3026,r=1] 2 66 3034 -90 0
execute if score .seq global matches 8310 run execute if score "§9Team 2" score > "§4Team 1" score run tp @r[x=13,y=60,z=3026,r=1] 2 66 3030 -90 0
execute if score .seq global matches 8310 run execute if score "§9Team 2" score > "§4Team 1" score run tp @r[x=-13,y=60,z=3026,r=1] 4.59 61.00 3029.32 -72.88 3.82
execute if score .seq global matches 8310 run execute if score "§9Team 2" score > "§4Team 1" score run tp @r[x=-13,y=60,z=3026,r=1] 4.48 61.00 3027.96 -104.76 5.03
execute if score .seq global matches 8310 run execute if score "§9Team 2" score > "§4Team 1" score run tp @r[x=-13,y=60,z=3026,r=1] 3.89 61.00 3029.00 -99.04 1.57
execute if score .seq global matches 8310 run execute if score "§9Team 2" score > "§4Team 1" score run tp @r[x=-13,y=60,z=3026,r=1] 3.75 61.00 3027.83 -73.23 4.69

##Animation Trigger
execute if score .seq global matches 8310 run inputpermission set @a[tag=!admin] movement disabled
execute if score .seq global matches 8310 run execute if score "§4Team 1" score > "§9Team 2" score run /playanimation @e[type=rwm:craft_contraption,tag=contraption_team1] animation.craft_contraption.fixed
execute if score .seq global matches 8310 run execute if score "§9Team 2" score > "§4Team 1" score run /playanimation @e[type=rwm:craft_contraption,tag=contraption_team2] animation.craft_contraption.fixed

## Team 1 (Wins)
execute if score .seq global matches 8312 run execute if score "§4Team 1" score > "§9Team 2" score run /camera @a set minecraft:free pos -10 63.7 3031.0 rot 8 -100
execute if score .seq global matches 8313 run execute if score "§4Team 1" score > "§9Team 2" score run /camera @a set minecraft:free ease 10 in_out_quad pos -10 62.0 3047 rot -14 -135

## Team 2 (Wins)
execute if score .seq global matches 8312 run execute if score "§9Team 2" score > "§4Team 1" score run /camera @a set minecraft:free pos 11 63.7 3043.0 rot 8 70
execute if score .seq global matches 8313 run execute if score "§9Team 2" score > "§4Team 1" score run /camera @a set minecraft:free ease 10 in_out_quad pos 11 62.0 3025 rot -14 45

### Done with Cutscenes
execute if score .seq global matches 8540 run camera @a fade time 1 2 1
execute if score .seq global matches 8560 run camera @a set minecraft:first_person
execute if score .seq global matches 8560 run camera @a clear
execute if score .seq global matches 8560 run hud @a reset
execute if score .seq global matches 8560 run scoreboard players set .actionbar.objective global 0
execute if score .seq global matches 8560 run camera @a clear
execute if score .seq global matches 8560 run inputpermission set @a movement enabled



### Return to Lobby
execute if score .seq global matches 8560 run event entity @e[type=rwm:craft_crafting_part] rwm:despawn
execute if score .seq global matches 8560 run event entity @e[type=rwm:craft_part] rwm:despawn
execute if score .seq global matches 8560 run event entity @e[type=rwm:craft_diagram] rwm:despawn
execute if score .seq global matches 8560 run event entity @e[type=rwm:craft_contraption] rwm:despawn
execute if score .seq global matches 8560 run event entity @e[type=rwm:craft_board] rwm:despawn
execute if score .seq global matches 8560 run kill @e[type=minecraft:item]

execute if score .seq global matches 8560 run function utility/lobby/return_to_lobby
execute if score .seq global matches 8560 run clear @a rwm:craft_part_1
execute if score .seq global matches 8560 run clear @a rwm:craft_part_2
execute if score .seq global matches 8560 run clear @a rwm:craft_part_3
execute if score .seq global matches 8560 run clear @a rwm:craft_part_4
execute if score .seq global matches 8560 run clear @a rwm:craft_part_5
execute if score .seq global matches 8560 run clear @a rwm:craft_part_6
execute if score .seq global matches 8560 run clear @a rwm:craft_part_7
execute if score .seq global matches 8560 run clear @a rwm:craft_part_8
execute if score .seq global matches 8560 run clear @a rwm:craft_part_9
execute if score .seq global matches 8560 run clear @a rwm:craft_part_10
execute if score .seq global matches 8560 run clear @a rwm:craft_part_11
execute if score .seq global matches 8560 run clear @a rwm:craft_part_12
execute if score .seq global matches 8560 run clear @a rwm:craft_diagram_1
execute if score .seq global matches 8560 run clear @a rwm:craft_diagram_2
execute if score .seq global matches 8560 run clear @a rwm:craft_diagram_3
execute if score .seq global matches 8560 run clear @a rwm:craft_diagram_4
execute if score .seq global matches 8560 run clear @a rwm:craft_diagram_5
execute if score .seq global matches 8560 run clear @a rwm:craft_contraption_fixed_1
execute if score .seq global matches 8560 run clear @a rwm:craft_contraption_fixed_2
execute if score .seq global matches 8560 run clear @a rwm:craft_contraption_fixed_3
execute if score .seq global matches 8560 run clear @a rwm:craft_contraption_fixed_4
execute if score .seq global matches 8560 run clear @a rwm:craft_contraption_fixed_5
execute if score .seq global matches 8560 run scoreboard players set "§4Team 1" score 0
execute if score .seq global matches 8560 run scoreboard players set "§9Team 2" score 0
execute if score .seq global matches 8560 run tag @a remove craft_player
execute if score .seq global matches 8560 run tag @a remove craft_team1
execute if score .seq global matches 8560 run tag @a remove craft_team2
execute if score .seq global matches 8560 run camera @a clear
execute if score .seq global matches 8560 run stopsound @a
execute if score .seq global matches 8560 run inputpermission set @a movement enabled

# Finished, Setup for next act
execute if score .seq global matches 8600 run /function utility/tickingarea_add
execute if score .seq global matches 8600 run scoreboard players set .act global 0
execute if score .seq global matches 8600 run function loops/new_act
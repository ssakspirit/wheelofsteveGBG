## Seq for Game 2 (Contraption Craftoff) (Act201) - Singleplayer/Low Player Count Mode
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
execute if score .seq global matches 20 run /camera @a[scores={team=1}] set minecraft:free pos -18.3 64 3043 rot 10 -106
execute if score .seq global matches 21 run /camera @a[scores={team=1}] set minecraft:free ease 10 in_out_quad pos -13.6 64.1 3036 rot 12 -90
execute if score .seq global matches 221 run /camera @a[scores={team=1}] set minecraft:free ease 10 in_out_quad pos -9.5 62.3 3021.5 rot 4 -180
execute if score .seq global matches 421 run /camera @a[scores={team=1}] set minecraft:free ease 10 in_out_quad pos -9.5 63.7 3012.0 rot 13 30
execute if score .seq global matches 621 run /camera @a[scores={team=1}] set minecraft:free ease 10 in_out_quad pos -12.5 63.7 3010.0 rot 14 0
execute if score .seq global matches 821 run /camera @a[scores={team=1}] set minecraft:free ease 10 in_out_quad pos -17.0 63.0 3010.0 rot 11 -143
execute if score .seq global matches 1021 run /camera @a[scores={team=1}] set minecraft:free ease 10 in_out_quad pos -13.0 61.6 3004 rot 15 0

## Admin Observer Cutscene (follows Team 1)
execute if score .seq global matches 20 run /camera @a[tag=admin] set minecraft:free pos -18.3 64 3043 rot 10 -106
execute if score .seq global matches 21 run /camera @a[tag=admin] set minecraft:free ease 10 in_out_quad pos -13.6 64.1 3036 rot 12 -90
execute if score .seq global matches 221 run /camera @a[tag=admin] set minecraft:free ease 10 in_out_quad pos -9.5 62.3 3021.5 rot 4 -180
execute if score .seq global matches 421 run /camera @a[tag=admin] set minecraft:free ease 10 in_out_quad pos -9.5 63.7 3012.0 rot 13 30
execute if score .seq global matches 621 run /camera @a[tag=admin] set minecraft:free ease 10 in_out_quad pos -12.5 63.7 3010.0 rot 14 0
execute if score .seq global matches 821 run /camera @a[tag=admin] set minecraft:free ease 10 in_out_quad pos -17.0 63.0 3010.0 rot 11 -143
execute if score .seq global matches 1021 run /camera @a[tag=admin] set minecraft:free ease 10 in_out_quad pos -13.0 61.6 3004 rot 15 0

## Team 2 Cutscene (Solo)
execute if score .seq global matches 20 run /camera @a[scores={team=2}] set minecraft:free pos 18.3 64 3043 rot 10 106
execute if score .seq global matches 21 run /camera @a[scores={team=2}] set minecraft:free ease 10 in_out_quad pos 13.6 64.1 3036 rot 12 90
execute if score .seq global matches 221 run /camera @a[scores={team=2}] set minecraft:free ease 10 in_out_quad pos 9.5 62.3 3021.5 rot 4 180
execute if score .seq global matches 421 run /camera @a[scores={team=2}] set minecraft:free ease 10 in_out_quad pos 9.5 63.7 3012.0 rot 13 -30
execute if score .seq global matches 621 run /camera @a[scores={team=2}] set minecraft:free ease 10 in_out_quad pos 12.5 63.7 3010.0 rot 14 0
execute if score .seq global matches 821 run /camera @a[scores={team=2}] set minecraft:free ease 10 in_out_quad pos 17.0 63.0 3010.0 rot 11 143
execute if score .seq global matches 1021 run /camera @a[scores={team=2}] set minecraft:free ease 10 in_out_quad pos 13.0 61.6 3004 rot 15 0

##Across both Team Cutscenes

##Actionbar
execute if score .seq global matches 20 run scoreboard players set .actionbar.objective global 201
execute if score .seq global matches 120 run scoreboard players set .actionbar.objective global 202
execute if score .seq global matches 220 run scoreboard players set .actionbar.objective global 203
execute if score .seq global matches 420 run scoreboard players set .actionbar.objective global 204
execute if score .seq global matches 620 run scoreboard players set .actionbar.objective global 205
execute if score .seq global matches 720 run scoreboard players set .actionbar.objective global 206
execute if score .seq global matches 820 run scoreboard players set .actionbar.objective global 207
execute if score .seq global matches 920 run scoreboard players set .actionbar.objective global 208
execute if score .seq global matches 1020 run scoreboard players set .actionbar.objective global 209

#Events in the cutscene
execute if score .seq global matches 100 run /function utility/games/craft/random_contraption_break
execute if score .seq global matches 120 run /function utility/games/craft/random_contraption_break
execute if score .seq global matches 140 run /function utility/games/craft/random_contraption_break
execute if score .seq global matches 160 run /function utility/games/craft/random_contraption_break
execute if score .seq global matches 180 run /function utility/games/craft/random_contraption_break
execute if score .seq global matches 500 run event entity @e[type=rwm:craft_board] rwm:board_1
execute if score .seq global matches 600 run event entity @r[type=rwm:craft_crafting_part] rwm:craft_crafting_1
execute if score .seq global matches 620 run event entity @r[type=rwm:craft_crafting_part] rwm:craft_crafting_2
execute if score .seq global matches 640 run event entity @r[type=rwm:craft_crafting_part] rwm:craft_crafting_3
execute if score .seq global matches 660 run event entity @r[type=rwm:craft_crafting_part] rwm:craft_crafting_4
execute if score .seq global matches 680 run event entity @r[type=rwm:craft_crafting_part] rwm:craft_crafting_5
execute if score .seq global matches 700 run event entity @r[type=rwm:craft_crafting_part] rwm:craft_crafting_6
execute if score .seq global matches 720 run event entity @r[type=rwm:craft_crafting_part] rwm:craft_crafting_7
execute if score .seq global matches 740 run event entity @r[type=rwm:craft_crafting_part] rwm:craft_crafting_8
execute if score .seq global matches 760 run event entity @r[type=rwm:craft_crafting_part] rwm:craft_crafting_9
execute if score .seq global matches 780 run event entity @r[type=rwm:craft_crafting_part] rwm:craft_crafting_10
execute if score .seq global matches 800 run event entity @r[type=rwm:craft_crafting_part] rwm:craft_crafting_11
execute if score .seq global matches 820 run event entity @r[type=rwm:craft_crafting_part] rwm:craft_crafting_12

### Done with Cutscenes
execute if score .seq global matches 1000 run camera @a fade time 1 2 1
execute if score .seq global matches 1030 run function utility/games/craft/respawn_assets
execute if score .seq global matches 1040 run /function utility/games/craft/tagging/crafting_grid
### Continue
execute if score .seq global matches 1030 run camera @a set minecraft:first_person
execute if score .seq global matches 1060 run camera @a clear
execute if score .seq global matches 1060 run hud @a reset
execute if score .seq global matches 1060 run scoreboard players set .actionbar.objective global 0
execute if score .seq global matches 1062 run camera @a clear


### Start Countdown
execute if score .seq global matches 1140 run scoreboard players set "§4Team 1" score 0
execute if score .seq global matches 1140 run scoreboard players set "§9Team 2" score 0
execute if score .seq global matches 1140 run titleraw @a title {"rawtext":[{"translate":"subtitle.objective.101.1"}]}
execute if score .seq global matches 1140 run /execute at @a run /playsound note.harp @a ~ ~ ~ 1 1.0
execute if score .seq global matches 1160 run titleraw @a title {"rawtext":[{"translate":"subtitle.objective.101.2"}]}
execute if score .seq global matches 1160 run /execute at @a run /playsound note.harp @a ~ ~ ~ 1 1.1
execute if score .seq global matches 1180 run titleraw @a title {"rawtext":[{"translate":"subtitle.objective.101.3"}]}
execute if score .seq global matches 1180 run /execute at @a run /playsound note.harp @a ~ ~ ~ 1 1.2
execute if score .seq global matches 1200 run titleraw @a title {"rawtext":[{"translate":"subtitle.objective.101.4"}]}
execute if score .seq global matches 1200 run scoreboard players set .actionbar.objective global 406
execute if score .seq global matches 1200 run /execute at @a run /playsound horn.call.0 @a ~ ~ ~ 1 2.0

#Displayed Scoreboard
execute if score .seq global matches 02 run scoreboard objectives setdisplay sidebar
execute if score .seq global matches 1200 run scoreboard objectives add score dummy §6§lScore
execute if score .seq global matches 1200 run scoreboard players set "§4Team 1" score 0
execute if score .seq global matches 1200 run scoreboard players set "§9Team 2" score 0
execute if score .seq global matches 1200 run scoreboard objectives setdisplay sidebar score

### At game start (Difference Old 600 New 1200)
execute if score .seq global matches 1200 run summon rwm:timer 0 90 3017 0 0 rwm:timer_craft
execute if score .seq global matches 1200 run inputpermission set @a movement enabled
execute if score .seq global matches 1200 run function utility/games/craft/random_next_diagram_singleplayer_team1
execute if score .seq global matches 1200 run function utility/games/craft/random_next_diagram_singleplayer_team2
execute if score .seq global matches 1200 run /execute as @a run playsound record.stal @a ~ ~ ~ 1 1.1
execute if score .seq global matches 3900 run /execute as @a run playsound record.stal @a ~ ~ ~ 1 1.1
execute if score .seq global matches 6600 run /execute as @a run playsound record.stal @a ~ ~ ~ 1 1.1

### Active till Game Over
execute if score .seq global matches 1200..7200 run execute if entity @e[type=item,x=-10,y=61,z=3023,r=1] run function utility/games/craft/solo_team1_score 
execute if score .seq global matches 1200..7200 run execute if entity @e[type=item,x=10,y=61,z=3023,r=1] run function utility/games/craft/solo_team2_score 
execute if score .seq global matches 1200..7200 run function utility/games/craft/crafting_grid

##Particles 
execute if score .seq global matches 1200..7200 run execute if score .tick global matches 1 run execute if entity @e[type=item,x=-10,y=61,z=3023,r=1] run particle rwm:craft_crafting -10 61 3023 
execute if score .seq global matches 1200..7200 run execute if score .tick global matches 1 run execute if entity @e[type=item,x=10,y=61,z=3023,r=1] run particle rwm:craft_crafting 10 61 3023 
execute if score .seq global matches 1200..7200 run execute if score .tick global matches 1 run execute as @e[type=rwm:craft_contraption,tag=!fixed]  run execute at @e[type=rwm:craft_contraption,tag=!fixed] run particle rwm:craft_contraption_broken ~ ~ ~

### Singleplayer Scoring
execute if score .seq global matches 1950 run execute unless entity @a[scores={team=1}] run scoreboard players add "§4Team 1" score 1
execute if score .seq global matches 1950 run execute unless entity @a[scores={team=2}] run scoreboard players add "§9Team 2" score 1

execute if score .seq global matches 2700 run execute unless entity @a[scores={team=1}] run scoreboard players add "§4Team 1" score 1
execute if score .seq global matches 2700 run execute unless entity @a[scores={team=2}] run scoreboard players add "§9Team 2" score 1

execute if score .seq global matches 3450 run execute unless entity @a[scores={team=1}] run scoreboard players add "§4Team 1" score 1
execute if score .seq global matches 3450 run execute unless entity @a[scores={team=2}] run scoreboard players add "§9Team 2" score 1

execute if score .seq global matches 4200 run execute unless entity @a[scores={team=1}] run scoreboard players add "§4Team 1" score 1
execute if score .seq global matches 4200 run execute unless entity @a[scores={team=2}] run scoreboard players add "§9Team 2" score 1

execute if score .seq global matches 4950 run execute unless entity @a[scores={team=1}] run scoreboard players add "§4Team 1" score 1
execute if score .seq global matches 4950 run execute unless entity @a[scores={team=2}] run scoreboard players add "§9Team 2" score 1

execute if score .seq global matches 5700 run execute unless entity @a[scores={team=1}] run scoreboard players add "§4Team 1" score 1
execute if score .seq global matches 5700 run execute unless entity @a[scores={team=2}] run scoreboard players add "§9Team 2" score 1

execute if score .seq global matches 6450 run execute unless entity @a[scores={team=1}] run scoreboard players add "§4Team 1" score 1
execute if score .seq global matches 6450 run execute unless entity @a[scores={team=2}] run scoreboard players add "§9Team 2" score 1

execute if score .seq global matches 7200 run execute unless entity @a[scores={team=1}] run scoreboard players add "§4Team 1" score 1
execute if score .seq global matches 7200 run execute unless entity @a[scores={team=2}] run scoreboard players add "§9Team 2" score 1

### Game Over
execute if score .seq global matches 7210 run scoreboard players set .actionbar.objective global 0
execute if score .seq global matches 7200 run /kill @e[type=rwm:timer]

### Who Wins?
execute if score .seq global matches 7210 run execute if score "§4Team 1" score >= "§9Team 2" score run /function utility/wins/team1
execute if score .seq global matches 7210 run execute if score "§9Team 2" score >= "§4Team 1" score run /function utility/wins/team2

execute if score .seq global matches 7220 run scoreboard players set .subtitle.objective global 0

## Cutscene
execute if score .seq global matches 7280 run hud @a hide
execute if score .seq global matches 7280 run camera @a clear
execute if score .seq global matches 7280 run camera @a fade time 1 1 1

execute if score .seq global matches 7300 run tp @a[scores={team=1}] -13 60 3026
execute if score .seq global matches 7300 run tp @a[scores={team=2}] 13 60 3026

###Piglin
execute if score .seq global matches 7310 run execute if score "§4Team 1" score > "§9Team 2" score run execute unless entity @a[scores={team=2}] run summon rwm:orb_enemy -4.0 61.00 3045.00 
execute if score .seq global matches 7310..7560 run execute if score "§4Team 1" score > "§9Team 2" score run execute unless entity @a[scores={team=2}] run tp @e[type=rwm:orb_enemy] -4.0 61.00 3045.00

execute if score .seq global matches 7310 run execute if score "§9Team 2" score > "§4Team 1" score run execute unless entity @a[scores={team=1}] run summon rwm:orb_enemy 5.0 61.00 3029.0 
execute if score .seq global matches 7310..7560 run execute if score "§9Team 2" score > "§4Team 1" score run execute unless entity @a[scores={team=1}] run tp @e[type=rwm:orb_enemy] 5.0 61.00 3029.0 



##Team 1 Win Teleports
execute if score .seq global matches 7310 run execute if score "§4Team 1" score > "§9Team 2" score run tp @r[x=-13,y=60,z=3026,r=1] -2 66 3031 90 0
execute if score .seq global matches 7310 run execute if score "§4Team 1" score > "§9Team 2" score run tp @r[x=-13,y=60,z=3026,r=1] -3 67 3037 90 0
execute if score .seq global matches 7310 run execute if score "§4Team 1" score > "§9Team 2" score run tp @r[x=-13,y=60,z=3026,r=1] -2 66 3039 90 0
execute if score .seq global matches 7310 run execute if score "§4Team 1" score > "§9Team 2" score run tp @r[x=-13,y=60,z=3026,r=1] -2 66 3043 90 0
execute if score .seq global matches 7310 run execute if score "§4Team 1" score > "§9Team 2" score run tp @r[x=13,y=60,z=3026,r=1] -3.71 61.00 3044.68 88.21 14.55
execute if score .seq global matches 7310 run execute if score "§4Team 1" score > "§9Team 2" score run tp @r[x=13,y=60,z=3026,r=1] -3.49 61.00 3046.03 79.55 6.41
execute if score .seq global matches 7310 run execute if score "§4Team 1" score > "§9Team 2" score run tp @r[x=13,y=60,z=3026,r=1] -2.58 61.00 3045.79 98.25 20.78
execute if score .seq global matches 7310 run execute if score "§4Team 1" score > "§9Team 2" score run tp @r[x=13,y=60,z=3026,r=1] -2.59 61.00 3044.97 86.99 -4.50

##Team 2 Win Teleports
execute if score .seq global matches 7310 run execute if score "§9Team 2" score > "§4Team 1" score run tp @r[x=13,y=60,z=3026,r=1] 2 66 3042 -90 0
execute if score .seq global matches 7310 run execute if score "§9Team 2" score > "§4Team 1" score run tp @r[x=13,y=60,z=3026,r=1] 3 67 3036 -90 0
execute if score .seq global matches 7310 run execute if score "§9Team 2" score > "§4Team 1" score run tp @r[x=13,y=60,z=3026,r=1] 2 66 3034 -90 0
execute if score .seq global matches 7310 run execute if score "§9Team 2" score > "§4Team 1" score run tp @r[x=13,y=60,z=3026,r=1] 2 66 3030 -90 0
execute if score .seq global matches 7310 run execute if score "§9Team 2" score > "§4Team 1" score run tp @r[x=-13,y=60,z=3026,r=1] 4.59 61.00 3029.32 -72.88 3.82
execute if score .seq global matches 7310 run execute if score "§9Team 2" score > "§4Team 1" score run tp @r[x=-13,y=60,z=3026,r=1] 4.48 61.00 3027.96 -104.76 5.03
execute if score .seq global matches 7310 run execute if score "§9Team 2" score > "§4Team 1" score run tp @r[x=-13,y=60,z=3026,r=1] 3.89 61.00 3029.00 -99.04 1.57
execute if score .seq global matches 7310 run execute if score "§9Team 2" score > "§4Team 1" score run tp @r[x=-13,y=60,z=3026,r=1] 3.75 61.00 3027.83 -73.23 4.69

##Animation Trigger
execute if score .seq global matches 7310 run execute if score "§4Team 1" score > "§9Team 2" score run /playanimation @e[type=rwm:craft_contraption,tag=contraption_team1] animation.craft_contraption.fixed
execute if score .seq global matches 7310 run execute if score "§9Team 2" score > "§4Team 1" score run /playanimation @e[type=rwm:craft_contraption,tag=contraption_team2] animation.craft_contraption.fixed
execute if score .seq global matches 7310 run inputpermission set @a[tag=!admin] movement disabled

## Team 1 (Wins)
execute if score .seq global matches 7310 run execute if score "§4Team 1" score > "§9Team 2" score run /camera @a set minecraft:free pos -10 63.7 3031.0 rot 8 -100
execute if score .seq global matches 7311 run execute if score "§4Team 1" score > "§9Team 2" score run /camera @a set minecraft:free ease 10 in_out_quad pos -10 62.0 3047 rot -14 -135

## Team 2 (Wins)
execute if score .seq global matches 7310 run execute if score "§9Team 2" score > "§4Team 1" score run /camera @a set minecraft:free pos 11 63.7 3043.0 rot 8 70
execute if score .seq global matches 7311 run execute if score "§9Team 2" score > "§4Team 1" score run /camera @a set minecraft:free ease 10 in_out_quad pos 11 62.0 3025 rot -14 45

### Done with Cutscenes
execute if score .seq global matches 7540 run camera @a fade time 1 2 1
execute if score .seq global matches 7560 run camera @a set minecraft:first_person
execute if score .seq global matches 7560 run camera @a clear
execute if score .seq global matches 7560 run hud @a reset
execute if score .seq global matches 7560 run scoreboard players set .actionbar.objective global 0
execute if score .seq global matches 7560 run camera @a clear



### Return to Lobby
execute if score .seq global matches 7560 run event entity @e[type=rwm:craft_crafting_part] rwm:despawn
execute if score .seq global matches 7560 run event entity @e[type=rwm:craft_part] rwm:despawn
execute if score .seq global matches 7560 run event entity @e[type=rwm:craft_diagram] rwm:despawn
execute if score .seq global matches 7560 run event entity @e[type=rwm:craft_contraption] rwm:despawn
execute if score .seq global matches 7560 run event entity @e[type=rwm:craft_board] rwm:despawn
execute if score .seq global matches 7560 run kill @e[type=minecraft:item]
execute if score .seq global matches 7560 run kill @e[type=rwm:orb_enemy]

execute if score .seq global matches 7560 run function utility/lobby/return_to_lobby
execute if score .seq global matches 7560 run clear @a rwm:craft_part_1
execute if score .seq global matches 7560 run clear @a rwm:craft_part_2
execute if score .seq global matches 7560 run clear @a rwm:craft_part_3
execute if score .seq global matches 7560 run clear @a rwm:craft_part_4
execute if score .seq global matches 7560 run clear @a rwm:craft_part_5
execute if score .seq global matches 7560 run clear @a rwm:craft_part_6
execute if score .seq global matches 7560 run clear @a rwm:craft_part_7
execute if score .seq global matches 7560 run clear @a rwm:craft_part_8
execute if score .seq global matches 7560 run clear @a rwm:craft_part_9
execute if score .seq global matches 7560 run clear @a rwm:craft_part_10
execute if score .seq global matches 7560 run clear @a rwm:craft_part_11
execute if score .seq global matches 7560 run clear @a rwm:craft_part_12
execute if score .seq global matches 7560 run clear @a rwm:craft_diagram_1
execute if score .seq global matches 7560 run clear @a rwm:craft_diagram_2
execute if score .seq global matches 7560 run clear @a rwm:craft_diagram_3
execute if score .seq global matches 7560 run clear @a rwm:craft_diagram_4
execute if score .seq global matches 7560 run clear @a rwm:craft_diagram_5
execute if score .seq global matches 7560 run clear @a rwm:craft_contraption_fixed_1
execute if score .seq global matches 7560 run clear @a rwm:craft_contraption_fixed_2
execute if score .seq global matches 7560 run clear @a rwm:craft_contraption_fixed_3
execute if score .seq global matches 7560 run clear @a rwm:craft_contraption_fixed_4
execute if score .seq global matches 7560 run clear @a rwm:craft_contraption_fixed_5
execute if score .seq global matches 7560 run scoreboard players set "§4Team 1" score 0
execute if score .seq global matches 7560 run scoreboard players set "§9Team 2" score 0
execute if score .seq global matches 7560 run tag @a remove craft_player
execute if score .seq global matches 7560 run tag @a remove craft_team1
execute if score .seq global matches 7560 run tag @a remove craft_team2
execute if score .seq global matches 7560 run camera @a clear
execute if score .seq global matches 7560 run stopsound @a
execute if score .seq global matches 7560 run inputpermission set @a movement enabled

# Finished, Setup for next act
execute if score .seq global matches 7600 run /function utility/tickingarea_add
execute if score .seq global matches 7600 run scoreboard players set .act global 0
execute if score .seq global matches 7600 run function loops/new_act
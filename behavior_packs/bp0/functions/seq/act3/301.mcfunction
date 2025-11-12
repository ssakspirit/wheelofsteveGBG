## Seq for Game 3 (Grid Wars) (Act301)
execute if score .seq global matches 00 run scoreboard players set .actionbar.objective global 0
execute if score .seq global matches 00 run scoreboard players set .subtitle.objective global 0
execute if score .seq global matches 01 run /function utility/games/grid/game_reset
execute if score .seq global matches 02 run inputpermission set @a[tag=!admin] movement disabled
execute if score .seq global matches 02 run /function utility/fogs/g3_fog
execute if score .seq global matches 02 run /function utility/tickingarea_remove


## Cutscene
execute if score .seq global matches 01 run hud @a hide
execute if score .seq global matches 01 run camera @a clear
execute if score .seq global matches 02 run camera @a fade time 0.1 2 1
execute if score .seq global matches 100 run function utility/games/grid/garden_blocks_reset


## Team 1 Cutscene
execute if score .seq global matches 20 run /camera @a[scores={team=1}] set minecraft:free pos -33.0 65.6 -82.5 rot 0 0
execute if score .seq global matches 21 run /camera @a[scores={team=1}] set minecraft:free ease 12 in_out_quad pos -36.0 66.6 -90.5 rot 18 19
execute if score .seq global matches 261 run /camera @a[scores={team=1}] set minecraft:free ease 7 in_out_quad pos -49.0 66.6 -96.5 rot 14 -34
execute if score .seq global matches 401 run /camera @a[scores={team=1}] set minecraft:free ease 8 in_out_quad pos -52.4 62.6 -110.5 rot 19 -47
execute if score .seq global matches 561 run /camera @a[scores={team=1}] set minecraft:free ease 7 in_out_quad pos -42.4 63.1 -94.3 rot 21 -88
execute if score .seq global matches 741 run /camera @a[scores={team=1}] set minecraft:free ease 7 in_out_quad pos -37.3 61.3 -87.9 rot -10 9
execute if score .seq global matches 921 run /camera @a[scores={team=1}] set minecraft:free ease 7 in_out_quad pos -35.9 66.7 -95.0 rot 19 28.7
execute if score .seq global matches 1040 run camera @a[scores={team=1}] fade time 0.5 1 0.5

## Admin Observer Cutscene (follows Team 1)
execute if score .seq global matches 20 run /camera @a[tag=admin] set minecraft:free pos -33.0 65.6 -82.5 rot 0 0
execute if score .seq global matches 21 run /camera @a[tag=admin] set minecraft:free ease 12 in_out_quad pos -36.0 66.6 -90.5 rot 18 19
execute if score .seq global matches 261 run /camera @a[tag=admin] set minecraft:free ease 7 in_out_quad pos -49.0 66.6 -96.5 rot 14 -34
execute if score .seq global matches 401 run /camera @a[tag=admin] set minecraft:free ease 8 in_out_quad pos -52.4 62.6 -110.5 rot 19 -47
execute if score .seq global matches 561 run /camera @a[tag=admin] set minecraft:free ease 7 in_out_quad pos -42.4 63.1 -94.3 rot 21 -88
execute if score .seq global matches 741 run /camera @a[tag=admin] set minecraft:free ease 7 in_out_quad pos -37.3 61.3 -87.9 rot -10 9
execute if score .seq global matches 921 run /camera @a[tag=admin] set minecraft:free ease 7 in_out_quad pos -35.9 66.7 -95.0 rot 19 28.7
execute if score .seq global matches 1040 run camera @a[tag=admin] fade time 0.5 1 0.5

## Team 2 Cutscene
execute if score .seq global matches 20 run /camera @a[scores={team=2}] set minecraft:free pos -33.0 65.6 -82.5 rot 0 0
execute if score .seq global matches 21 run /camera @a[scores={team=2}] set minecraft:free ease 12 in_out_quad pos -30.0 66.6 -90.5 rot 14 -19
execute if score .seq global matches 261 run /camera @a[scores={team=2}] set minecraft:free ease 7 in_out_quad pos -17.0 66.6 -96.5 rot 14 34
execute if score .seq global matches 401 run /camera @a[scores={team=2}] set minecraft:free ease 8 in_out_quad pos -14.4 62.6 -110.5 rot 19 47
execute if score .seq global matches 561 run /camera @a[scores={team=2}] set minecraft:free ease 7 in_out_quad pos -24.4 63.1 -94.3 rot 21 88
execute if score .seq global matches 741 run /camera @a[scores={team=2}] set minecraft:free ease 7 in_out_quad pos -29.3 61.3 -87.9 rot -10 -9
execute if score .seq global matches 921 run /camera @a[scores={team=2}] set minecraft:free ease 7 in_out_quad pos -31.9 66.7 -95.0 rot 19 -28.7
execute if score .seq global matches 1040 run camera @a[scores={team=2}] fade time 0.5 1 0.5


##Across both Team Cutscenes
##Actionbar
execute if score .seq global matches 20 run scoreboard players set .actionbar.objective global 301
execute if score .seq global matches 100 run scoreboard players set .actionbar.objective global 302
execute if score .seq global matches 300 run scoreboard players set .actionbar.objective global 303
execute if score .seq global matches 500 run scoreboard players set .actionbar.objective global 304
execute if score .seq global matches 600 run scoreboard players set .actionbar.objective global 305
execute if score .seq global matches 700 run scoreboard players set .actionbar.objective global 306
execute if score .seq global matches 850 run scoreboard players set .actionbar.objective global 307
execute if score .seq global matches 980 run scoreboard players set .actionbar.objective global 308

#Events in the cutscene
execute if score .seq global matches 20 run structure load grid_pattern_33 -35 64 -78 0_degrees none block_by_block 1

execute if score .seq global matches 100 run structure load grid_pattern_33 -46 61 -79 0_degrees none block_by_block 10
execute if score .seq global matches 100 run structure load grid_pattern_33 -24 61 -79 0_degrees none block_by_block 10
execute if score .seq global matches 300 run fill -46 61 -79 -43 64 -79 air destroy
execute if score .seq global matches 300 run fill -24 61 -79 -21 64 -79 air destroy
execute if score .seq global matches 302 run kill @e[type=item] 
execute if score .seq global matches 560 run event entity @e[tag=grid_block_15a] rwm:grid_block_yellow_recharge
execute if score .seq global matches 700 run /event entity @e[tag=grid_block_5a] rwm:grid_block_magenta_recharge
execute if score .seq global matches 720 run /event entity @e[tag=grid_block_6a] rwm:grid_block_magenta_recharge
execute if score .seq global matches 880 run structure load grid_pattern_33b -46 61 -79 0_degrees none block_by_block 1
execute if score .seq global matches 880 run structure load grid_pattern_33b -24 61 -79 0_degrees none block_by_block 1
execute if score .seq global matches 910 run /function utility/games/grid/board_1_clear
execute if score .seq global matches 910 run /function utility/games/grid/board_2_clear
execute if score .seq global matches 912 run kill @e[type=item] 

### Done with Cutscenes
execute if score .seq global matches 1060 run camera @a set minecraft:first_person
execute if score .seq global matches 1061 run camera @a clear
execute if score .seq global matches 1060 run hud @a reset
execute if score .seq global matches 1060 run scoreboard players set .actionbar.objective global 0




### Start Countdown
execute if score .seq global matches 1100 run titleraw @a title {"rawtext":[{"translate":"subtitle.objective.101.1"}]}
execute if score .seq global matches 1100 run /execute at @a run /playsound note.harp @a ~ ~ ~ 1 1.0
execute if score .seq global matches 1120 run titleraw @a title {"rawtext":[{"translate":"subtitle.objective.101.2"}]}
execute if score .seq global matches 1120 run /execute at @a run /playsound note.harp @a ~ ~ ~ 1 1.1
execute if score .seq global matches 1140 run titleraw @a title {"rawtext":[{"translate":"subtitle.objective.101.3"}]}
execute if score .seq global matches 1140 run /execute at @a run /playsound note.harp @a ~ ~ ~ 1 1.2
execute if score .seq global matches 1160 run titleraw @a title {"rawtext":[{"translate":"subtitle.objective.101.4"}]}
execute if score .seq global matches 1160 run scoreboard players set .actionbar.objective global 309
execute if score .seq global matches 1160 run /execute at @a run /playsound horn.call.0 @a ~ ~ ~ 1 2.0

#Displayed Scoreboard
#Displayed Scoreboard
execute if score .seq global matches 02 run scoreboard objectives setdisplay sidebar
execute if score .seq global matches 1160 run scoreboard objectives add score dummy §6§lScore
execute if score .seq global matches 1160 run scoreboard players set "§4Team 1" score 0
execute if score .seq global matches 1160 run scoreboard players set "§9Team 2" score 0
execute if score .seq global matches 1160 run scoreboard objectives setdisplay sidebar score

### At game start (Difference Old 700 New 1160)
execute if score .seq global matches 1160 run summon rwm:timer -33 90 -97 0 0 rwm:timer_grid
execute if score .seq global matches 1160 run /execute as @a run playsound record.creator @a[scores={team=1}] -33 90 -97 1 0.56 1
execute if score .seq global matches 1160 run /execute as @a run playsound record.creator @a[scores={team=2}] -33 90 -97 1 0.56 1
execute if score .seq global matches 1160 run inputpermission set @a movement enabled
execute if score .seq global matches 1160 run /function utility/games/grid/new_pattern

### Active till Game Over
execute if score .seq global matches 1160..7280 run /function utility/games/grid/game_tick_logic


### Game Over
execute if score .seq global matches 7280 run scoreboard players set .actionbar.objective global 0
execute if score .seq global matches 7280 run kill @e[type=rwm:timer]
execute if score .seq global matches 7280 run tp @e[type=rwm:grid_block] ~ -250 ~
execute if score .seq global matches 7281 run clear @a barrier
execute if score .seq global matches 7281 run clear @a lime_concrete
execute if score .seq global matches 7281 run clear @a blue_concrete
execute if score .seq global matches 7281 run clear @a yellow_concrete
execute if score .seq global matches 7281 run clear @a red_concrete
execute if score .seq global matches 7281 run clear @a magenta_concrete
execute if score .seq global matches 7290 run kill @e[type=rwm:grid_block]

### Who Wins?
execute if score .seq global matches 7290 run execute if score "§4Team 1" score > "§9Team 2" score run /function utility/wins/team1
execute if score .seq global matches 7290 run execute if score "§9Team 2" score > "§4Team 1" score run /function utility/wins/team2
execute if score .seq global matches 7290 run execute if score "§4Team 1" score = "§9Team 2" score run /function utility/wins/tie

execute if score .seq global matches 7290 run scoreboard players set .subtitle.objective global 0
### Return to Lobby
execute if score .seq global matches 7360 run function utility/lobby/return_to_lobby
execute if score .seq global matches 7360 run scoreboard players set "§4Team 1" score 0
execute if score .seq global matches 7360 run scoreboard players set "§9Team 2" score 0
execute if score .seq global matches 7360 run tag @a remove grid_player

# Finished, Setup for next act
execute if score .seq global matches 7380 run /function utility/tickingarea_add
execute if score .seq global matches 7380 run scoreboard players set .act global 0
execute if score .seq global matches 7380 run function loops/new_act

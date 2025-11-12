## Used for setting a new pattern in Grid Wars

scoreboard players set .grid_pattern global 0
scoreboard players random .grid_pattern global 1 40

execute if score .grid_pattern global matches 1 run structure load grid_pattern_1 -35 64 -78
execute if score .grid_pattern global matches 2 run structure load grid_pattern_2 -35 64 -78
execute if score .grid_pattern global matches 3 run structure load grid_pattern_3 -35 64 -78
execute if score .grid_pattern global matches 4 run structure load grid_pattern_4 -35 64 -78
execute if score .grid_pattern global matches 5 run structure load grid_pattern_5 -35 64 -78
execute if score .grid_pattern global matches 6 run structure load grid_pattern_6 -35 64 -78
execute if score .grid_pattern global matches 7 run structure load grid_pattern_7 -35 64 -78
execute if score .grid_pattern global matches 8 run structure load grid_pattern_8 -35 64 -78
execute if score .grid_pattern global matches 9 run structure load grid_pattern_9 -35 64 -78
execute if score .grid_pattern global matches 10 run structure load grid_pattern_10 -35 64 -78
execute if score .grid_pattern global matches 11 run structure load grid_pattern_11 -35 64 -78
execute if score .grid_pattern global matches 12 run structure load grid_pattern_12 -35 64 -78
execute if score .grid_pattern global matches 13 run structure load grid_pattern_13 -35 64 -78
execute if score .grid_pattern global matches 14 run structure load grid_pattern_14 -35 64 -78
execute if score .grid_pattern global matches 15 run structure load grid_pattern_15 -35 64 -78
execute if score .grid_pattern global matches 16 run structure load grid_pattern_16 -35 64 -78
execute if score .grid_pattern global matches 17 run structure load grid_pattern_17 -35 64 -78
execute if score .grid_pattern global matches 18 run structure load grid_pattern_18 -35 64 -78 
execute if score .grid_pattern global matches 19 run structure load grid_pattern_19 -35 64 -78
execute if score .grid_pattern global matches 20 run structure load grid_pattern_20 -35 64 -78
execute if score .grid_pattern global matches 21 run structure load grid_pattern_21 -35 64 -78
execute if score .grid_pattern global matches 22 run structure load grid_pattern_22 -35 64 -78
execute if score .grid_pattern global matches 23 run structure load grid_pattern_23 -35 64 -78
execute if score .grid_pattern global matches 24 run structure load grid_pattern_24 -35 64 -78
execute if score .grid_pattern global matches 25 run structure load grid_pattern_25 -35 64 -78
execute if score .grid_pattern global matches 26 run structure load grid_pattern_26 -35 64 -78
execute if score .grid_pattern global matches 27 run structure load grid_pattern_27 -35 64 -78
execute if score .grid_pattern global matches 28 run structure load grid_pattern_28 -35 64 -78
execute if score .grid_pattern global matches 29 run structure load grid_pattern_29 -35 64 -78
execute if score .grid_pattern global matches 30 run structure load grid_pattern_30 -35 64 -78
execute if score .grid_pattern global matches 31 run structure load grid_pattern_31 -35 64 -78
execute if score .grid_pattern global matches 32 run structure load grid_pattern_32 -35 64 -78
execute if score .grid_pattern global matches 33 run structure load grid_pattern_33 -35 64 -78
execute if score .grid_pattern global matches 34 run structure load grid_pattern_34 -35 64 -78
execute if score .grid_pattern global matches 35 run structure load grid_pattern_35 -35 64 -78
execute if score .grid_pattern global matches 36 run structure load grid_pattern_36 -35 64 -78
execute if score .grid_pattern global matches 37 run structure load grid_pattern_37 -35 64 -78
execute if score .grid_pattern global matches 38 run structure load grid_pattern_38 -35 64 -78
execute if score .grid_pattern global matches 39 run structure load grid_pattern_39 -35 64 -78
execute if score .grid_pattern global matches 40 run structure load grid_pattern_40 -35 64 -78

##SinglePlayer AI
##SINGLEPLAYER - Player on Team 1

execute if entity @a [scores={team=1}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 1 run /structure load grid_pattern_1 -24 61 -79 0_degrees none block_by_block 90 
execute if entity @a [scores={team=1}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 2 run structure load grid_pattern_2 -24 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=1}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 3 run structure load grid_pattern_3 -24 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=1}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 4 run structure load grid_pattern_4 -24 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=1}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 5 run structure load grid_pattern_5 -24 61 -79 0_degrees none block_by_block 90
execute if entity @a [scores={team=1}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 6 run structure load grid_pattern_6 -24 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=1}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 7 run structure load grid_pattern_7 -24 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=1}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 8 run structure load grid_pattern_8 -24 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=1}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 9 run structure load grid_pattern_9 -24 61 -79 0_degrees none block_by_block 90
execute if entity @a [scores={team=1}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 10 run structure load grid_pattern_10 -24 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=1}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 11 run structure load grid_pattern_11 -24 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=1}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 12 run structure load grid_pattern_12 -24 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=1}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 13 run structure load grid_pattern_13 -24 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=1}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 14 run structure load grid_pattern_14 -24 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=1}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 15 run structure load grid_pattern_15 -24 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=1}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 16 run structure load grid_pattern_16 -24 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=1}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 17 run structure load grid_pattern_17 -24 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=1}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 18 run structure load grid_pattern_18 -24 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=1}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 19 run structure load grid_pattern_19 -24 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=1}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 20 run structure load grid_pattern_20 -24 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=1}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 21 run structure load grid_pattern_21 -24 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=1}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 22 run structure load grid_pattern_22 -24 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=1}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 23 run structure load grid_pattern_23 -24 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=1}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 24 run structure load grid_pattern_24 -24 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=1}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 25 run structure load grid_pattern_25 -24 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=1}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 26 run structure load grid_pattern_26 -24 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=1}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 27 run structure load grid_pattern_27 -24 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=1}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 28 run structure load grid_pattern_28 -24 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=1}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 29 run structure load grid_pattern_29 -24 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=1}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 30 run structure load grid_pattern_30 -24 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=1}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 31 run structure load grid_pattern_31 -24 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=1}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 32 run structure load grid_pattern_32 -24 61 -79 0_degrees none block_by_block 90
execute if entity @a [scores={team=1}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 33 run structure load grid_pattern_33 -24 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=1}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 34 run structure load grid_pattern_34 -24 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=1}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 35 run structure load grid_pattern_35 -24 61 -79 0_degrees none block_by_block 110
execute if entity @a [scores={team=1}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 36 run structure load grid_pattern_36 -24 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=1}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 37 run structure load grid_pattern_37 -24 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=1}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 38 run structure load grid_pattern_38 -24 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=1}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 39 run structure load grid_pattern_39 -24 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=1}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 40 run structure load grid_pattern_40 -24 61 -79 0_degrees none block_by_block 70

## PLAYER ON TEAM 2
execute if entity @a [scores={team=2}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 1 run structure load grid_pattern_1 -46 61 -79 0_degrees none block_by_block 90
execute if entity @a [scores={team=2}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 2 run structure load grid_pattern_2 -46 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=2}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 3 run structure load grid_pattern_3 -46 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=2}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 4 run structure load grid_pattern_4 -46 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=2}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 5 run structure load grid_pattern_5 -46 61 -79 0_degrees none block_by_block 90
execute if entity @a [scores={team=2}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 6 run structure load grid_pattern_6 -46 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=2}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 7 run structure load grid_pattern_7 -46 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=2}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 8 run structure load grid_pattern_8 -46 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=2}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 9 run structure load grid_pattern_9 -46 61 -79 0_degrees none block_by_block 90
execute if entity @a [scores={team=2}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 10 run structure load grid_pattern_10 -46 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=2}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 11 run structure load grid_pattern_11 -46 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=2}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 12 run structure load grid_pattern_12 -46 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=2}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 13 run structure load grid_pattern_13 -46 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=2}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 14 run structure load grid_pattern_14 -46 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=2}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 15 run structure load grid_pattern_15 -46 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=2}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 16 run structure load grid_pattern_16 -46 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=2}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 17 run structure load grid_pattern_17 -46 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=2}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 18 run structure load grid_pattern_18 -46 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=2}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 19 run structure load grid_pattern_19 -46 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=2}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 20 run structure load grid_pattern_20 -46 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=2}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 21 run structure load grid_pattern_21 -46 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=2}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 22 run structure load grid_pattern_22 -46 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=2}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 23 run structure load grid_pattern_23 -46 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=2}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 24 run structure load grid_pattern_24 -46 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=2}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 25 run structure load grid_pattern_25 -46 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=2}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 26 run structure load grid_pattern_26 -46 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=2}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 27 run structure load grid_pattern_27 -46 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=2}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 28 run structure load grid_pattern_28 -46 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=2}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 29 run structure load grid_pattern_29 -46 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=2}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 30 run structure load grid_pattern_30 -46 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=2}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 31 run structure load grid_pattern_31 -46 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=2}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 32 run structure load grid_pattern_32 -46 61 -79 0_degrees none block_by_block 90
execute if entity @a [scores={team=2}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 33 run structure load grid_pattern_33 -46 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=2}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 34 run structure load grid_pattern_34 -46 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=2}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 35 run structure load grid_pattern_35 -46 61 -79 0_degrees none block_by_block 110
execute if entity @a [scores={team=2}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 36 run structure load grid_pattern_36 -46 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=2}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 37 run structure load grid_pattern_37 -46 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=2}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 38 run structure load grid_pattern_38 -46 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=2}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 39 run structure load grid_pattern_39 -46 61 -79 0_degrees none block_by_block 70
execute if entity @a [scores={team=2}] run execute if score .game_mode global matches 1 run execute if score .grid_pattern global matches 40 run structure load grid_pattern_40 -46 61 -79 0_degrees none block_by_block 70
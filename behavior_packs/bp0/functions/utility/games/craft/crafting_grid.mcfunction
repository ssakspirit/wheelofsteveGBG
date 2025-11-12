### Detection of Successful Crafting. Runs every tick during gameplay.

#Reset Grid scores the Score
scoreboard players set craft_grid_1 craft_scores 0
scoreboard players set craft_grid_2 craft_scores 0

###Crafting Grid numbering. Starts from top left and goes right.

###Contraption 1
## Team 1
execute as @e[tag=board_1,x=-13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=r9,tag=part_9] run scoreboard players add craft_grid_1 craft_scores 1
execute as @e[tag=board_1,x=-13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=r8,tag=part_null] run scoreboard players add craft_grid_1 craft_scores 1
execute as @e[tag=board_1,x=-13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=r7,tag=part_8] run scoreboard players add craft_grid_1 craft_scores 1
execute as @e[tag=board_1,x=-13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=r6,tag=part_10] run scoreboard players add craft_grid_1 craft_scores 1
execute as @e[tag=board_1,x=-13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=r5,tag=part_6] run scoreboard players add craft_grid_1 craft_scores 1
execute as @e[tag=board_1,x=-13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=r4,tag=part_null] run scoreboard players add craft_grid_1 craft_scores 1
execute as @e[tag=board_1,x=-13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=r3,tag=part_null] run scoreboard players add craft_grid_1 craft_scores 1
execute as @e[tag=board_1,x=-13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=r2,tag=part_null] run scoreboard players add craft_grid_1 craft_scores 1
execute as @e[tag=board_1,x=-13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=r1,tag=part_1] run scoreboard players add craft_grid_1 craft_scores 1
#Success:
execute as @e[tag=board_1,x=-13,y=62,z=3019,r=2] run execute if score craft_grid_1 craft_scores matches 9 run function utility/games/craft/crafting/team1_contraption1
scoreboard players set craft_grid_1 craft_scores 0

## Team 2
execute as @e[tag=board_1,x=13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=b9,tag=part_9] run scoreboard players add craft_grid_2 craft_scores 1
execute as @e[tag=board_1,x=13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=b8,tag=part_null] run scoreboard players add craft_grid_2 craft_scores 1
execute as @e[tag=board_1,x=13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=b7,tag=part_8] run scoreboard players add craft_grid_2 craft_scores 1
execute as @e[tag=board_1,x=13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=b6,tag=part_10] run scoreboard players add craft_grid_2 craft_scores 1
execute as @e[tag=board_1,x=13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=b5,tag=part_6] run scoreboard players add craft_grid_2 craft_scores 1
execute as @e[tag=board_1,x=13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=b4,tag=part_null] run scoreboard players add craft_grid_2 craft_scores 1
execute as @e[tag=board_1,x=13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=b3,tag=part_null] run scoreboard players add craft_grid_2 craft_scores 1
execute as @e[tag=board_1,x=13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=b2,tag=part_null] run scoreboard players add craft_grid_2 craft_scores 1
execute as @e[tag=board_1,x=13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=b1,tag=part_1] run scoreboard players add craft_grid_2 craft_scores 1
#Success:
execute as @e[tag=board_1,x=13,y=62,z=3019,r=2] run execute if score craft_grid_2 craft_scores matches 9 run function utility/games/craft/crafting/team2_contraption1
scoreboard players set craft_grid_2 craft_scores 0

###Contraption 2
## Team 1
execute as @e[tag=board_2,x=-13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=r9,tag=part_null] run scoreboard players add craft_grid_1 craft_scores 1
execute as @e[tag=board_2,x=-13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=r8,tag=part_7] run scoreboard players add craft_grid_1 craft_scores 1
execute as @e[tag=board_2,x=-13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=r7,tag=part_11] run scoreboard players add craft_grid_1 craft_scores 1
execute as @e[tag=board_2,x=-13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=r6,tag=part_null] run scoreboard players add craft_grid_1 craft_scores 1
execute as @e[tag=board_2,x=-13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=r5,tag=part_null] run scoreboard players add craft_grid_1 craft_scores 1
execute as @e[tag=board_2,x=-13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=r4,tag=part_8] run scoreboard players add craft_grid_1 craft_scores 1
execute as @e[tag=board_2,x=-13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=r3,tag=part_8] run scoreboard players add craft_grid_1 craft_scores 1
execute as @e[tag=board_2,x=-13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=r2,tag=part_2] run scoreboard players add craft_grid_1 craft_scores 1
execute as @e[tag=board_2,x=-13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=r1,tag=part_9] run scoreboard players add craft_grid_1 craft_scores 1
#Success:
execute as @e[tag=board_2,x=-13,y=62,z=3019,r=2] run execute if score craft_grid_1 craft_scores matches 9 run function utility/games/craft/crafting/team1_contraption2
scoreboard players set craft_grid_1 craft_scores 0

## Team 2
execute as @e[tag=board_2,x=13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=b9,tag=part_null] run scoreboard players add craft_grid_2 craft_scores 1
execute as @e[tag=board_2,x=13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=b8,tag=part_7] run scoreboard players add craft_grid_2 craft_scores 1
execute as @e[tag=board_2,x=13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=b7,tag=part_11] run scoreboard players add craft_grid_2 craft_scores 1
execute as @e[tag=board_2,x=13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=b6,tag=part_null] run scoreboard players add craft_grid_2 craft_scores 1
execute as @e[tag=board_2,x=13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=b5,tag=part_null] run scoreboard players add craft_grid_2 craft_scores 1
execute as @e[tag=board_2,x=13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=b4,tag=part_8] run scoreboard players add craft_grid_2 craft_scores 1
execute as @e[tag=board_2,x=13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=b3,tag=part_8] run scoreboard players add craft_grid_2 craft_scores 1
execute as @e[tag=board_2,x=13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=b2,tag=part_2] run scoreboard players add craft_grid_2 craft_scores 1
execute as @e[tag=board_2,x=13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=b1,tag=part_9] run scoreboard players add craft_grid_2 craft_scores 1
#Success:
execute as @e[tag=board_2,x=13,y=62,z=3019,r=2] run execute if score craft_grid_2 craft_scores matches 9 run function utility/games/craft/crafting/team2_contraption2
scoreboard players set craft_grid_2 craft_scores 0

###Contraption 3
## Team 1
execute as @e[tag=board_3,x=-13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=r9,tag=part_7] run scoreboard players add craft_grid_1 craft_scores 1
execute as @e[tag=board_3,x=-13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=r8,tag=part_6] run scoreboard players add craft_grid_1 craft_scores 1
execute as @e[tag=board_3,x=-13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=r7,tag=part_null] run scoreboard players add craft_grid_1 craft_scores 1
execute as @e[tag=board_3,x=-13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=r6,tag=part_6] run scoreboard players add craft_grid_1 craft_scores 1
execute as @e[tag=board_3,x=-13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=r5,tag=part_null] run scoreboard players add craft_grid_1 craft_scores 1
execute as @e[tag=board_3,x=-13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=r4,tag=part_3] run scoreboard players add craft_grid_1 craft_scores 1
execute as @e[tag=board_3,x=-13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=r3,tag=part_12] run scoreboard players add craft_grid_1 craft_scores 1
execute as @e[tag=board_3,x=-13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=r2,tag=part_null] run scoreboard players add craft_grid_1 craft_scores 1
execute as @e[tag=board_3,x=-13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=r1,tag=part_12] run scoreboard players add craft_grid_1 craft_scores 1
#Success:
execute as @e[tag=board_3,x=-13,y=62,z=3019,r=2] run execute if score craft_grid_1 craft_scores matches 9 run function utility/games/craft/crafting/team1_contraption3
scoreboard players set craft_grid_1 craft_scores 0

## Team 2
execute as @e[tag=board_3,x=13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=b9,tag=part_7] run scoreboard players add craft_grid_2 craft_scores 1
execute as @e[tag=board_3,x=13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=b8,tag=part_6] run scoreboard players add craft_grid_2 craft_scores 1
execute as @e[tag=board_3,x=13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=b7,tag=part_null] run scoreboard players add craft_grid_2 craft_scores 1
execute as @e[tag=board_3,x=13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=b6,tag=part_6] run scoreboard players add craft_grid_2 craft_scores 1
execute as @e[tag=board_3,x=13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=b5,tag=part_null] run scoreboard players add craft_grid_2 craft_scores 1
execute as @e[tag=board_3,x=13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=b4,tag=part_3] run scoreboard players add craft_grid_2 craft_scores 1
execute as @e[tag=board_3,x=13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=b3,tag=part_12] run scoreboard players add craft_grid_2 craft_scores 1
execute as @e[tag=board_3,x=13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=b2,tag=part_null] run scoreboard players add craft_grid_2 craft_scores 1
execute as @e[tag=board_3,x=13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=b1,tag=part_12] run scoreboard players add craft_grid_2 craft_scores 1
#Success:
execute as @e[tag=board_3,x=13,y=62,z=3019,r=2] run execute if score craft_grid_2 craft_scores matches 9 run function utility/games/craft/crafting/team2_contraption3
scoreboard players set craft_grid_2 craft_scores 0

###Contraption 4
## Team 1
execute as @e[tag=board_4,x=-13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=r9,tag=part_null] run scoreboard players add craft_grid_1 craft_scores 1
execute as @e[tag=board_4,x=-13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=r8,tag=part_6] run scoreboard players add craft_grid_1 craft_scores 1
execute as @e[tag=board_4,x=-13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=r7,tag=part_4] run scoreboard players add craft_grid_1 craft_scores 1
execute as @e[tag=board_4,x=-13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=r6,tag=part_null] run scoreboard players add craft_grid_1 craft_scores 1
execute as @e[tag=board_4,x=-13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=r5,tag=part_8] run scoreboard players add craft_grid_1 craft_scores 1
execute as @e[tag=board_4,x=-13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=r4,tag=part_9] run scoreboard players add craft_grid_1 craft_scores 1
execute as @e[tag=board_4,x=-13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=r3,tag=part_null] run scoreboard players add craft_grid_1 craft_scores 1
execute as @e[tag=board_4,x=-13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=r2,tag=part_null] run scoreboard players add craft_grid_1 craft_scores 1
execute as @e[tag=board_4,x=-13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=r1,tag=part_9] run scoreboard players add craft_grid_1 craft_scores 1
#Success:
execute as @e[tag=board_4,x=-13,y=62,z=3019,r=2] run execute if score craft_grid_1 craft_scores matches 9 run function utility/games/craft/crafting/team1_contraption4
scoreboard players set craft_grid_1 craft_scores 0

## Team 2
execute as @e[tag=board_4,x=13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=b9,tag=part_null] run scoreboard players add craft_grid_2 craft_scores 1
execute as @e[tag=board_4,x=13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=b8,tag=part_6] run scoreboard players add craft_grid_2 craft_scores 1
execute as @e[tag=board_4,x=13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=b7,tag=part_4] run scoreboard players add craft_grid_2 craft_scores 1
execute as @e[tag=board_4,x=13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=b6,tag=part_null] run scoreboard players add craft_grid_2 craft_scores 1
execute as @e[tag=board_4,x=13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=b5,tag=part_8] run scoreboard players add craft_grid_2 craft_scores 1
execute as @e[tag=board_4,x=13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=b4,tag=part_9] run scoreboard players add craft_grid_2 craft_scores 1
execute as @e[tag=board_4,x=13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=b3,tag=part_null] run scoreboard players add craft_grid_2 craft_scores 1
execute as @e[tag=board_4,x=13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=b2,tag=part_null] run scoreboard players add craft_grid_2 craft_scores 1
execute as @e[tag=board_4,x=13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=b1,tag=part_9] run scoreboard players add craft_grid_2 craft_scores 1
#Success:
execute as @e[tag=board_4,x=13,y=62,z=3019,r=2] run execute if score craft_grid_2 craft_scores matches 9 run function utility/games/craft/crafting/team2_contraption4
scoreboard players set craft_grid_2 craft_scores 0

###Contraption 5
## Team 1
execute as @e[tag=board_5,x=-13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=r9,tag=part_null] run scoreboard players add craft_grid_1 craft_scores 1
execute as @e[tag=board_5,x=-13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=r8,tag=part_null] run scoreboard players add craft_grid_1 craft_scores 1
execute as @e[tag=board_5,x=-13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=r7,tag=part_5] run scoreboard players add craft_grid_1 craft_scores 1
execute as @e[tag=board_5,x=-13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=r6,tag=part_null] run scoreboard players add craft_grid_1 craft_scores 1
execute as @e[tag=board_5,x=-13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=r5,tag=part_10] run scoreboard players add craft_grid_1 craft_scores 1
execute as @e[tag=board_5,x=-13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=r4,tag=part_null] run scoreboard players add craft_grid_1 craft_scores 1
execute as @e[tag=board_5,x=-13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=r3,tag=part_10] run scoreboard players add craft_grid_1 craft_scores 1
execute as @e[tag=board_5,x=-13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=r2,tag=part_12] run scoreboard players add craft_grid_1 craft_scores 1
execute as @e[tag=board_5,x=-13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=r1,tag=part_11] run scoreboard players add craft_grid_1 craft_scores 1
#Success:
execute as @e[tag=board_5,x=-13,y=62,z=3019,r=2] run execute if score craft_grid_1 craft_scores matches 9 run function utility/games/craft/crafting/team1_contraption5
scoreboard players set craft_grid_1 craft_scores 0

## Team 2
execute as @e[tag=board_5,x=13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=b9,tag=part_null] run scoreboard players add craft_grid_2 craft_scores 1
execute as @e[tag=board_5,x=13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=b8,tag=part_null] run scoreboard players add craft_grid_2 craft_scores 1
execute as @e[tag=board_5,x=13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=b7,tag=part_5] run scoreboard players add craft_grid_2 craft_scores 1
execute as @e[tag=board_5,x=13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=b6,tag=part_null] run scoreboard players add craft_grid_2 craft_scores 1
execute as @e[tag=board_5,x=13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=b5,tag=part_10] run scoreboard players add craft_grid_2 craft_scores 1
execute as @e[tag=board_5,x=13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=b4,tag=part_null] run scoreboard players add craft_grid_2 craft_scores 1
execute as @e[tag=board_5,x=13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=b3,tag=part_10] run scoreboard players add craft_grid_2 craft_scores 1
execute as @e[tag=board_5,x=13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=b2,tag=part_12] run scoreboard players add craft_grid_2 craft_scores 1
execute as @e[tag=board_5,x=13,y=62,z=3019,r=1] run execute as @e[type=rwm:craft_crafting_part,tag=b1,tag=part_11] run scoreboard players add craft_grid_2 craft_scores 1
#Success:
execute as @e[tag=board_5,x=13,y=62,z=3019,r=2] run execute if score craft_grid_2 craft_scores matches 9 run function utility/games/craft/crafting/team2_contraption5
scoreboard players set craft_grid_2 craft_scores 0
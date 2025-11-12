### Detection of Successful Crafting. Runs every tick during gameplay.

## Inventory Restriction - Only hotbar slot 4 available
# Lock hotbar slots (except slot 4)
replaceitem entity @a[tag=craft_player] slot.hotbar 0 barrier 1 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[tag=craft_player] slot.hotbar 1 barrier 1 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[tag=craft_player] slot.hotbar 2 barrier 1 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[tag=craft_player] slot.hotbar 3 barrier 1 0 {"item_lock": {"mode": "lock_in_slot"}}
# slot.hotbar 4 is left empty (usable)
replaceitem entity @a[tag=craft_player] slot.hotbar 5 barrier 1 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[tag=craft_player] slot.hotbar 6 barrier 1 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[tag=craft_player] slot.hotbar 7 barrier 1 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[tag=craft_player] slot.hotbar 8 barrier 1 0 {"item_lock": {"mode": "lock_in_slot"}}

# Lock all inventory slots
replaceitem entity @a[tag=craft_player] slot.inventory 0 barrier 1 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[tag=craft_player] slot.inventory 1 barrier 1 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[tag=craft_player] slot.inventory 2 barrier 1 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[tag=craft_player] slot.inventory 3 barrier 1 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[tag=craft_player] slot.inventory 4 barrier 1 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[tag=craft_player] slot.inventory 5 barrier 1 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[tag=craft_player] slot.inventory 6 barrier 1 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[tag=craft_player] slot.inventory 7 barrier 1 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[tag=craft_player] slot.inventory 8 barrier 1 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[tag=craft_player] slot.inventory 9 barrier 1 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[tag=craft_player] slot.inventory 10 barrier 1 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[tag=craft_player] slot.inventory 11 barrier 1 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[tag=craft_player] slot.inventory 12 barrier 1 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[tag=craft_player] slot.inventory 13 barrier 1 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[tag=craft_player] slot.inventory 14 barrier 1 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[tag=craft_player] slot.inventory 15 barrier 1 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[tag=craft_player] slot.inventory 16 barrier 1 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[tag=craft_player] slot.inventory 17 barrier 1 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[tag=craft_player] slot.inventory 18 barrier 1 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[tag=craft_player] slot.inventory 19 barrier 1 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[tag=craft_player] slot.inventory 20 barrier 1 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[tag=craft_player] slot.inventory 21 barrier 1 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[tag=craft_player] slot.inventory 22 barrier 1 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[tag=craft_player] slot.inventory 23 barrier 1 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[tag=craft_player] slot.inventory 24 barrier 1 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[tag=craft_player] slot.inventory 25 barrier 1 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a[tag=craft_player] slot.inventory 26 barrier 1 0 {"item_lock": {"mode": "lock_in_slot"}}

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
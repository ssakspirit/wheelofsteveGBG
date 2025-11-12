## Used for Doing Tick stuff in Grid Wars

replaceitem entity @a[tag=!has_grid_block,hasitem=[{item=lime_concrete,quantity=1..}]] slot.hotbar 4 lime_concrete 1 0 {"minecraft:can_place_on":{"blocks":["iron_block"]}}
replaceitem entity @a[tag=!has_grid_block,hasitem=[{item=blue_concrete,quantity=1..}]] slot.hotbar 4 blue_concrete 1 0 {"minecraft:can_place_on":{"blocks":["iron_block"]}}
replaceitem entity @a[tag=!has_grid_block,hasitem=[{item=yellow_concrete,quantity=1..}]] slot.hotbar 4 yellow_concrete 1 0 {"minecraft:can_place_on":{"blocks":["iron_block"]}}
replaceitem entity @a[tag=!has_grid_block,hasitem=[{item=red_concrete,quantity=1..}]] slot.hotbar 4 red_concrete 1 0 {"minecraft:can_place_on":{"blocks":["iron_block"]}}
replaceitem entity @a[tag=!has_grid_block,hasitem=[{item=magenta_concrete,quantity=1..}]] slot.hotbar 4 magenta_concrete 1 0 {"minecraft:can_place_on":{"blocks":["iron_block"]}}

replaceitem entity @a slot.hotbar 0 barrier 1 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a slot.hotbar 1 barrier 1 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a slot.hotbar 2 barrier 1 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a slot.hotbar 3 barrier 1 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a slot.hotbar 5 barrier 1 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a slot.hotbar 6 barrier 1 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a slot.hotbar 7 barrier 1 0 {"item_lock": {"mode": "lock_in_slot"}}
replaceitem entity @a slot.hotbar 8 barrier 1 0 {"item_lock": {"mode": "lock_in_slot"}}

kill @e[type=item]
effect @a speed 10 1 true 

#Tag player if they has a grid block
tag @a[hasitem=[{item=lime_concrete,quantity=1..}]] add has_grid_block
tag @a[hasitem=[{item=blue_concrete,quantity=1..}]] add has_grid_block
tag @a[hasitem=[{item=yellow_concrete,quantity=1..}]] add has_grid_block
tag @a[hasitem=[{item=red_concrete,quantity=1..}]] add has_grid_block
tag @a[hasitem=[{item=magenta_concrete,quantity=1..}]] add has_grid_block

#Remove Tag if player does not have a grid block
tag @a[hasitem=[{item=lime_concrete,quantity=0},{item=blue_concrete,quantity=0},{item=yellow_concrete,quantity=0},{item=red_concrete,quantity=0},{item=magenta_concrete,quantity=0}]] remove has_grid_block


##POINT SCORING

##Team 1
execute if blocks -46 61 -79 -43 64 -79 -35 64 -78 all run function utility/games/grid/team1score
##Team 2
execute if blocks -24 61 -79 -21 64 -79 -35 64 -78 all run function utility/games/grid/team2score









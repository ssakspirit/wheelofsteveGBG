## Used for Randomly breaking Contraptions in Contraption Craft Off. Run 3 times at the start of the game with at least a tick delay to break the contraptions.

#Randomize the Score
scoreboard players set contraption_break_reload craft_scores 0
scoreboard players random contraption_break craft_scores 1 5

#execute if score contraption_break craft_scores matches 1 run say Random 1
#execute if score contraption_break craft_scores matches 2 run say Random 2
#execute if score contraption_break craft_scores matches 3 run say Random 3
#execute if score contraption_break craft_scores matches 4 run say Random 4
#execute if score contraption_break craft_scores matches 5 run say Random 5

## If score is 1.
execute if score contraption_break craft_scores matches 1 run execute as @e[tag=contraption_1,tag=!fixed] run scoreboard players set contraption_break_reload craft_scores 1
execute if score contraption_break craft_scores matches 1 run execute if score contraption_break_reload craft_scores matches 0 run execute as @e[tag=contraption_1,tag=fixed] run event entity @e[tag=contraption_1,tag=fixed] rwm:contraption_1_broken

## If score is 2.
execute if score contraption_break craft_scores matches 2 run execute as @e[tag=contraption_2,tag=!fixed] run scoreboard players set contraption_break_reload craft_scores 1
execute if score contraption_break craft_scores matches 2 run execute if score contraption_break_reload craft_scores matches 0 run execute as @e[tag=contraption_2,tag=fixed] run event entity @e[tag=contraption_2,tag=fixed] rwm:contraption_2_broken

## If score is 3.
execute if score contraption_break craft_scores matches 3 run execute as @e[tag=contraption_3,tag=!fixed] run scoreboard players set contraption_break_reload craft_scores 1
execute if score contraption_break craft_scores matches 3 run execute if score contraption_break_reload craft_scores matches 0 run execute as @e[tag=contraption_3,tag=fixed] run event entity @e[tag=contraption_3,tag=fixed] rwm:contraption_3_broken

## If score is 4.
execute if score contraption_break craft_scores matches 4 run execute as @e[tag=contraption_4,tag=!fixed] run scoreboard players set contraption_break_reload craft_scores 1
execute if score contraption_break craft_scores matches 4 run execute if score contraption_break_reload craft_scores matches 0 run execute as @e[tag=contraption_4,tag=fixed] run event entity @e[tag=contraption_4,tag=fixed] rwm:contraption_4_broken

## If score is 5.
execute if score contraption_break craft_scores matches 5 run execute as @e[tag=contraption_5,tag=!fixed] run scoreboard players set contraption_break_reload craft_scores 1
execute if score contraption_break craft_scores matches 5 run execute if score contraption_break_reload craft_scores matches 0 run execute as @e[tag=contraption_5,tag=fixed] run event entity @e[tag=contraption_5,tag=fixed] rwm:contraption_5_broken

execute if score contraption_break_reload craft_scores matches 1 run function utility/games/craft/random_contraption_break 
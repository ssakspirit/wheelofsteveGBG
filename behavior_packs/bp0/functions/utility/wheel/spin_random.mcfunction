## Triggered from The Wheel Of Steve

##Reset Randomizer
execute if entity @e[type=rwm:wheel_of_steve,tag=game1_played,tag=game2_played,tag=game3_played,tag=game4_played,tag=game5_played] run function utility/wheel/random_reset

#Randomize the Score
scoreboard players set .wheel_of_steve global 0
scoreboard players set .wheel_of_steve_reload global 0
scoreboard players random .wheel_of_steve global 1 5

#execute if score .wheel_of_steve global matches 1 run say Random 1
#execute if score .wheel_of_steve global matches 2 run say Random 2
#execute if score .wheel_of_steve global matches 3 run say Random 3
#execute if score .wheel_of_steve global matches 4 run say Random 4
#execute if score .wheel_of_steve global matches 5 run say Random 5

## If score is 1. Orb Ambush (1)
execute if score .wheel_of_steve global matches 1 run execute as @e[type=rwm:wheel_of_steve,tag=game1_played] run scoreboard players set .wheel_of_steve_reload global 1
execute if score .wheel_of_steve global matches 1 run execute if score .wheel_of_steve_reload global matches 0 run execute as @e[type=rwm:wheel_of_steve] run function utility/wheel/start_orb

## If score is 2. Contraption Craftoff (2)
execute if score .wheel_of_steve global matches 2 run execute as @e[type=rwm:wheel_of_steve,tag=game2_played] run scoreboard players set .wheel_of_steve_reload global 1
execute if score .wheel_of_steve global matches 2 run execute if score .wheel_of_steve_reload global matches 0 run execute as @e[type=rwm:wheel_of_steve] run function utility/wheel/start_craft

## If score is 3. Grid Wars (5)
execute if score .wheel_of_steve global matches 3 run execute as @e[type=rwm:wheel_of_steve,tag=game3_played] run scoreboard players set .wheel_of_steve_reload global 1
execute if score .wheel_of_steve global matches 3 run execute if score .wheel_of_steve_reload global matches 0 run execute as @e[type=rwm:wheel_of_steve] run function utility/wheel/start_grid

## If score is 4. Nock it Off (4)
execute if score .wheel_of_steve global matches 4 run execute as @e[type=rwm:wheel_of_steve,tag=game4_played] run scoreboard players set .wheel_of_steve_reload global 1
execute if score .wheel_of_steve global matches 4 run execute if score .wheel_of_steve_reload global matches 0 run execute as @e[type=rwm:wheel_of_steve] run function utility/wheel/start_nock

## If score is 5. Elytra Rumble (3)
execute if score .wheel_of_steve global matches 5 run execute as @e[type=rwm:wheel_of_steve,tag=game5_played] run scoreboard players set .wheel_of_steve_reload global 1
execute if score .wheel_of_steve global matches 5 run execute if score .wheel_of_steve_reload global matches 0 run execute as @e[type=rwm:wheel_of_steve] run function utility/wheel/start_elytra

execute if score .wheel_of_steve_reload global matches 1 run function utility/wheel/spin_random 
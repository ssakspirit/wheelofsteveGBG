##Reset Randomizer

#Randomize the Score
scoreboard players set .g4_random_fog global 0
scoreboard players random .g4_random_fog global 1 7

execute if score .g4_random_fog global matches 1 run function utility/fogs/g4a_fog
execute if score .g4_random_fog global matches 2 run function utility/fogs/g4b_fog
execute if score .g4_random_fog global matches 3 run function utility/fogs/g4c_fog
execute if score .g4_random_fog global matches 4 run function utility/fogs/g4d_fog
execute if score .g4_random_fog global matches 5 run function utility/fogs/g4e_fog
execute if score .g4_random_fog global matches 6 run function utility/fogs/g4f_fog
execute if score .g4_random_fog global matches 7 run function utility/fogs/g4g_fog
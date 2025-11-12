## team1 scores on elytra rumble
scoreboard players add "§9Team 2" score 1
camerashake add @a 1 1 positional
playsound ambient.weather.thunder @a ~ ~ ~ 0.5 0.5
summon fireworks_rocket -101 107 5084
summon fireworks_rocket -108 107 5084
summon fireworks_rocket -108 107 5091
summon fireworks_rocket -101 107 5091
execute if score "§9Team 2" score matches 2 run structure load elytra_tower_red_1 -107 95 5061
execute if score "§9Team 2" score matches 4 run structure load elytra_tower_red_2 -107 95 5061
execute if score "§9Team 2" score matches 6 run structure load elytra_tower_red_3 -107 95 5061
execute if score "§9Team 2" score matches 8 run structure load elytra_tower_red_4 -107 95 5061
execute if score "§9Team 2" score matches 10 run structure load elytra_tower_red_5 -107 95 5061
